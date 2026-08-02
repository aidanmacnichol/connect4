CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    red_user_id UUID REFERENCES users(id),
    yellow_user_id UUID REFERENCES users(id),
    winner_id UUID REFERENCES users(id), -- null = draw
    time_control_ms INT, -- in ms, time each player gets per game

    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ
); 