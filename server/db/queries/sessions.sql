-- name: CreateSession :one
INSERT INTO sessions (id, user_id, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserBySessionID :one
SELECT u.*
FROM users u
INNER JOIN sessions s ON s.user_id = u.id
WHERE s.id = $1
  AND s.expires_at > now();

-- name: DeleteSession :exec
DELETE FROM sessions
WHERE id = $1;
