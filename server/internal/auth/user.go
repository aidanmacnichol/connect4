package auth

import (
	"context"

	"github.com/aidanmacnichol/connect4/server/internal/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

func UpsertFromGoogle(
	ctx context.Context,
	pool *pgxpool.Pool,
	sub, email, name string,
	avatarURL *string) (sqlc.User, error) {
	return sqlc.New(pool).UpsertUserFromGoogle(ctx, sqlc.UpsertUserFromGoogleParams{
		GoogleSub: sub,
		Email:     email,
		Name:      name,
		AvatarUrl: avatarURL,
	})
}
