-- name: CreateGame :one
INSERT INTO games (id, red_user_id, yellow_user_id, winner_id, time_control_ms, started_at, ended_at)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: CreateGameMove :exec
INSERT INTO game_moves (game_id, move_number, col, played_at)
VALUES ($1, $2, $3, $4);

-- name: ListGamesForUser :many
SELECT * FROM games
where red_user_id = $1 OR yellow_user_id = $1
ORDER BY ended_at DESC NULLS LAST
LIMIT $2; 

-- name: ListMovesForGames :many
SELECT game_id, move_number, col, played_at
FROM game_moves
WHERE game_id = ANY($1::uuid[])
ORDER BY game_id, move_number;