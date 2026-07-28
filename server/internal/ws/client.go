package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"

	"github.com/coder/websocket"
)

type Client struct {
	id   string
	Conn *websocket.Conn
	Mu   sync.Mutex
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
