package api

import (
	"net/http"

	"github.com/aidanmacnichol/connect4/server/internal/ws"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
)

func NewRouter(pool *pgxpool.Pool, oauth *oauth2.Config, frontendURL string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", Health(pool))
	mux.HandleFunc("GET /api/ws", ws.HandleWebSocket)

	// auth
	mux.HandleFunc("GET /api/auth/google", GoogleLogin(oauth))
	mux.HandleFunc("GET /api/auth/google/callback", GoogleCallback(oauth, pool, frontendURL))

	mux.HandleFunc("GET /api/me", Me(pool))
	mux.HandleFunc("POST /api/auth/logout", Logout(pool))
	return mux
}
