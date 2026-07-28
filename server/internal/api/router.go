package api

import (
	"net/http"

	"github.com/aidanmacnichol/connect4/server/internal/ws"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", Health)
	mux.HandleFunc("GET /api/ws", ws.HandleWebSocket)
	return mux
}
