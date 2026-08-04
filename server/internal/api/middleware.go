package api

import (
	"context"
	"net/http"

	"github.com/aidanmacnichol/connect4/server/internal/auth"
	"github.com/aidanmacnichol/connect4/server/internal/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

type contextKey string

const userContextKey contextKey = "user"

func RequireUser(pool *pgxpool.Pool, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session")
		if err != nil {
			http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
			return
		}
		user, err := auth.UserFromSession(r.Context(), pool, cookie.Value)
		if err != nil {
			http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), userContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserFromContext(ctx context.Context) (sqlc.User, bool) {
	user, ok := ctx.Value(userContextKey).(sqlc.User)
	return user, ok
}
