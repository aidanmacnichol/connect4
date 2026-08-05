package api

import (
	"net/http"

	"github.com/aidanmacnichol/connect4/server/internal/config"
	"github.com/aidanmacnichol/connect4/server/internal/ws"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
)

func NewRouter(cfg config.Config, pool *pgxpool.Pool, oauth *oauth2.Config) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", Health(pool))

	// websocket
	mux.HandleFunc("GET /api/ws", ws.HandleWebSocket(pool))

	// auth
	mux.HandleFunc("GET /api/auth/google", GoogleLogin(oauth, cfg.CookieSecure))
	mux.HandleFunc("GET /api/auth/google/callback", GoogleCallback(oauth, pool, cfg.FrontendURL, cfg.CookieSecure))
	mux.HandleFunc("GET /api/me", Me(pool))
	mux.Handle("PATCH /api/me", RequireUser(pool, UpdateMe(pool)))
	mux.HandleFunc("POST /api/auth/logout", Logout(pool, cfg.CookieSecure))

	// User specific
	mux.Handle("GET /api/game/history", RequireUser(pool, GetGameHistoryForUser(pool)))
	return mux
}
