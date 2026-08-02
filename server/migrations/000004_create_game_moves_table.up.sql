CREATE TABLE game_moves (
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    move_number INT NOT NULL,
    col SMALLINT NOT NULL,
    played_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (game_id, move_number)
);