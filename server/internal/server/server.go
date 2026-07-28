package server

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/aidanmacnichol/connect4/server/internal/api"
	"github.com/aidanmacnichol/connect4/server/internal/config"
)

func New(cfg config.Config) *http.Server {
	return &http.Server{
		Addr:              cfg.Addr,
		Handler:           withCORS(withLogging(api.NewRouter())),
		ReadHeaderTimeout: 5 * time.Second,
	}
}

func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		slog.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"duration", time.Since(start).String(),
		)
	})
}

// withCORS -> vite dever server
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		switch origin {
		case "http://localhost:5173", "http://127.0.0.1:5173":
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
