package auth

import (
	"context"
	"time"

	"github.com/aidanmacnichol/connect4/server/internal/db/sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateSession(
	ctx context.Context,
	pool *pgxpool.Pool,
	userID uuid.UUID,
	ttl time.Duration) (string, error) {
	id, err := RandomString(32)
	if err != nil {
		return "", err
	}

	q := sqlc.New(pool)
	_, err = q.CreateSession(ctx, sqlc.CreateSessionParams{
		ID:        id,
		UserID:    userID,
		ExpiresAt: time.Now().Add(ttl),
	})
	return id, err
}

func UserFromSession(ctx context.Context, pool *pgxpool.Pool, sessionID string) (sqlc.User, error) {
	return sqlc.New(pool).GetUserBySessionID(ctx, sessionID)
}

func DeleteSession(ctx context.Context, pool *pgxpool.Pool, sessionID string) error {
	return sqlc.New(pool).DeleteSession(ctx, sessionID)
}
