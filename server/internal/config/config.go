package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Addr               string
	DatabaseURL        string
	GoogleClientID     string
	GoogleClientSecret string
	OAuthRedirectURL   string // http://localhost:8080/api/auth/google/callback
	FrontendURL        string // http://localhost:5173
}

func Load() Config {
	// Try each path separately — godotenv.Load stops on the first missing file,
	// which breaks when you run from server/ (./.env missing, ../.env present).
	for _, path := range []string{".env", "../.env"} {
		_ = godotenv.Load(path)
	}

	return Config{
		Addr:               env("ADDR", ":8080"),
		DatabaseURL:        env("DATABASE_URL", "postgres://connect4:connect4@localhost:5432/connect4?sslmode=disable"),
		GoogleClientID:     env("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: env("GOOGLE_CLIENT_SECRET", ""),
		OAuthRedirectURL:   env("OAUTH_REDIRECT_URL", "http://localhost:8080/api/auth/google/callback"),
		FrontendURL:        env("FRONTEND_URL", "http://localhost:5173"),
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
