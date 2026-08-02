-- name: UpsertUserFromGoogle :one
INSERT INTO users (google_sub, email, name, avatar_url)
VALUES ($1, $2, $3, $4)
ON CONFLICT (google_sub) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now()
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: GetUserByGoogleSub :one
SELECT * FROM users
WHERE google_sub = $1;
