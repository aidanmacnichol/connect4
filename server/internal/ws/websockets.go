package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"github.com/aidanmacnichol/connect4/server/internal/auth"
	"github.com/aidanmacnichol/connect4/server/internal/db/sqlc"
	"github.com/aidanmacnichol/connect4/server/internal/game"
	"github.com/aidanmacnichol/connect4/server/internal/matchmaking"
	"github.com/coder/websocket"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// global queue
var matchQueue = matchmaking.NewQueue()

var (
	games   = map[string]*liveGame{}  // gameID -> game
	players = map[string]string{}     // playerID -> gameID
	rooms   = map[string][2]*Client{} // gameID -> [red, yellow]
	hubMu   sync.Mutex
)

func HandleWebSocket(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			OriginPatterns: []string{"*"}, // local testing only
		})
		if err != nil {
			log.Println("Error accepting websocket connection:", err)
			return
		}
		defer conn.CloseNow()
		ctx, cancel := context.WithTimeout(r.Context(), time.Hour)
		defer cancel()

		client := &Client{
			id:   uuid.New().String(),
			Conn: conn,
		}

		if c, err := r.Cookie("session"); err == nil {
			if user, err := auth.UserFromSession(r.Context(), pool, c.Value); err == nil {
				client.userID = &user.ID
			}
		}

		fmt.Println("Client connected:", client.ID())

		for {
			_, data, err := client.Conn.Read(ctx)
			if err != nil {
				// Normal when the browser tab closes / React remounts the socket.
				break
			}

			var msg ClientMessage
			if err := json.Unmarshal(data, &msg); err != nil {
				_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: "bad json"})
				fmt.Println("Error unmarshalling message:", err)
				continue
			}
			fmt.Println("from", client.ID(), "type", msg.Type)

			switch msg.Type {
			case MsgFindGame:
				handleFindGame(ctx, client)

			case MsgCancel:
				matchQueue.Cancel(client.ID())
				_ = client.Send(ctx, ServerMessage{Type: MsgCancel, Message: "game cancelled"})

			case MsgMove:
				handleMove(ctx, pool, client, msg.Col)

			default:
				_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: "unknown message type"})
			}
		}
		matchQueue.Cancel(client.ID())
		fmt.Println("client disconnected:", client.ID())
	}
}

func handleFindGame(ctx context.Context, client *Client) {
	opponent, matched := matchQueue.Enqueue(client)
	if !matched {
		_ = client.Send(ctx, ServerMessage{Type: MsgQueued})
		return
	}

	opp, ok := opponent.(*Client)
	if !ok {
		_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: "internal matchmaking error"})
		return
	}
	startMatchedGame(ctx, opp, client)
}

func startMatchedGame(ctx context.Context, red, yellow *Client) {
	gameID := uuid.New().String()
	lg := &liveGame{
		Game:      game.NewGame(gameID),
		startedAt: time.Now().UTC(),
	}

	hubMu.Lock()
	games[gameID] = lg
	players[red.ID()] = gameID
	players[yellow.ID()] = gameID
	rooms[gameID] = [2]*Client{red, yellow}
	hubMu.Unlock()

	_ = red.Send(ctx, ServerMessage{Type: MsgMatched, GameID: gameID, Color: "red"})
	_ = yellow.Send(ctx, ServerMessage{Type: MsgMatched, GameID: gameID, Color: "yellow"})
	broadcastState(ctx, gameID, lg.Game, red, yellow)
	fmt.Println("started game", gameID, "with", red.ID(), "(red) and", yellow.ID(), "(yellow)")
}

func handleMove(ctx context.Context, pool *pgxpool.Pool, client *Client, col *int) {
	if col == nil {
		_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: "missing col"})
		return
	}

	hubMu.Lock()
	gameID, ok := players[client.ID()]
	if !ok {
		hubMu.Unlock()
		_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: "not in a game"})
		return
	}

	lg := games[gameID]
	g := lg.Game

	room := rooms[gameID]

	var expected *Client
	if g.Current() == game.Red {
		expected = room[0]
	} else {
		expected = room[1]
	}
	if client != expected {
		hubMu.Unlock()
		_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: "not your turn"})
		return
	}

	if err := g.Play(*col); err != nil {
		hubMu.Unlock()
		_ = client.Send(ctx, ServerMessage{Type: MsgError, Message: err.Error()})
		return
	}

	red, yellow := room[0], room[1]

	lg.Moves = append(lg.Moves, moveRecord{
		Col:      *col,
		PlayedAt: time.Now().UTC(),
	})
	hubMu.Unlock()

	if g.IsOver() {
		go persistGame(context.Background(), pool, lg, red, yellow)
	}
	broadcastState(ctx, gameID, g, red, yellow)
}

func broadcastState(ctx context.Context, gameID string, g *game.Game, red, yellow *Client) {
	msgType := MsgState
	if g.IsOver() {
		msgType = MsgGameOver
	}

	msg := ServerMessage{
		Type:    msgType,
		GameID:  gameID,
		Board:   boardToJSON(g),
		Current: cellName(g.Current()),
		Winner:  cellName(g.Winner()),
		Draw:    g.IsDraw(),
	}

	_ = red.Send(ctx, msg)
	_ = yellow.Send(ctx, msg)
}

func persistGame(ctx context.Context, pool *pgxpool.Pool, lg *liveGame, red, yellow *Client) {
	if red.userID == nil || yellow.userID == nil {
		return // TODO: Implement guests
	}

	var winner *uuid.UUID
	switch lg.Game.Winner() {
	case game.Red:
		winner = red.userID
	case game.Yellow:
		winner = yellow.userID
	default:
		winner = nil // draw
	}

	gameID, err := uuid.Parse(lg.Game.ID)
	if err != nil {
		return
	}

	q := sqlc.New(pool)
	_, err = q.CreateGame(ctx, sqlc.CreateGameParams{
		ID:           gameID,
		RedUserID:    red.userID,
		YellowUserID: yellow.userID,
		WinnerID:     winner,
		StartedAt:    lg.startedAt,
		EndedAt:      pgTimestamptz(time.Now().UTC()),
	})

	if err != nil {
		slog.Error("persist game", "err", err)
		return
	}

	for i, m := range lg.Moves {
		if err := q.CreateGameMove(ctx, sqlc.CreateGameMoveParams{
			GameID:     gameID,
			MoveNumber: int32(i + 1),
			Col:        int16(m.Col),
			PlayedAt:   m.PlayedAt,
		}); err != nil {
			slog.Error("persist move", "err", err, "n", i+1)
		}
	}
}

func boardToJSON(g *game.Game) [][]int {
	raw := g.Board()
	out := make([][]int, game.Rows)
	for r := 0; r < game.Rows; r++ {
		out[r] = make([]int, game.Cols)
		for c := 0; c < game.Cols; c++ {
			out[r][c] = int(raw[r][c])
		}
	}
	return out
}

func cellName(c game.Cell) string {
	switch c {
	case game.Red:
		return "red"
	case game.Yellow:
		return "yellow"
	default:
		return "empty"
	}
}

func pgTimestamptz(t time.Time) pgtype.Timestamptz {
	return pgtype.Timestamptz{Time: t, Valid: true}
}
