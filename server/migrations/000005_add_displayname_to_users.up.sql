ALTER TABLE users
    ADD COLUMN display_name TEXT UNIQUE,
    ADD COLUMN display_name_set_at TIMESTAMPTZ;