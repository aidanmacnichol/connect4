package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/aidanmacnichol/connect4/server/internal/db/sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type historyMove struct {
	MoveNumber int32     `json:"move_number"`
	Col        int16     `json:"col"`
	PlayedAt   time.Time `json:"played_at"`
}

type gameHistoryItem struct {
	Game  sqlc.Game     `json:"game"`
	Moves []historyMove `json:"moves"`
}

// Gets all game history for a user
// TODO: pagination
func GetGameHistoryForUser(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := UserFromContext(r.Context())
		if !ok {
			http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
			return
		}

		q := sqlc.New(pool)

		games, err := q.ListGamesForUser(r.Context(), sqlc.ListGamesForUserParams{
			RedUserID: &user.ID,
			Limit:     50,
		})
		if err != nil {
			http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
			return
		}

		ids := make([]uuid.UUID, 0, len(games))
		for _, g := range games {
			ids = append(ids, g.ID)
		}

		moves, err := q.ListMovesForGames(r.Context(), ids)
		if err != nil {
			http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
			return
		}

		byGame := make(map[uuid.UUID][]historyMove, len(games))
		for _, m := range moves {
			byGame[m.GameID] = append(byGame[m.GameID], historyMove{
				MoveNumber: m.MoveNumber,
				Col:        m.Col,
				PlayedAt:   m.PlayedAt,
			})
		}

		out := make([]gameHistoryItem, 0, len(games))
		for _, g := range games {
			ms := byGame[g.ID]
			if ms == nil {
				ms = []historyMove{}
			}
			out = append(out, gameHistoryItem{Game: g, Moves: ms})
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(out)
	}
}
