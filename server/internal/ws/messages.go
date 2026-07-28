package ws

const (
	MsgFindGame = "find_game"
	MsgMove     = "move"
	MsgCancel   = "cancel"

	MsgQueued   = "queued"
	MsgMatched  = "matched"
	MsgState    = "state"
	MsgGameOver = "game_over"
	MsgError    = "error"
)

// Client -> server
type ClientMessage struct {
	Type string `json:"type"`
	Col  *int   `json:"col,omitempty"`
}

// Server -> client
type ServerMessage struct {
	Type    string  `json:"type"`
	GameID  string  `json:"gameId,omitempty"`
	Color   string  `json:"color,omitempty"`
	Message string  `json:"message,omitempty"`
	Board   [][]int `json:"board,omitempty"`
	Current string  `json:"current,omitempty"`
	Winner  string  `json:"winner,omitempty"`
	Draw    bool    `json:"draw,omitempty"`
}
