package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/aidanmacnichol/connect4/server/internal/game"
	"github.com/coder/websocket"
	"github.com/google/uuid"
)

type liveGame struct {
	Game      *game.Game
	startedAt time.Time
	Moves     []moveRecord
}

type moveRecord struct {
	Col      int
	PlayedAt time.Time
}

type Client struct {
	id     string     // connection/matchmaking id
	userID *uuid.UUID // nil = guest
	Conn   *websocket.Conn
	Mu     sync.Mutex
}

func (c *Client) ID() string {
	return c.id
}

func (c *Client) Send(ctx context.Context, msg ServerMessage) error {
	c.Mu.Lock()
	defer c.Mu.Unlock()

	data, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	return c.Conn.Write(ctx, websocket.MessageText, data)
}
