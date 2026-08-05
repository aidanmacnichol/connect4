package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Addr               string
	DatabaseURL        string
	GoogleClientID     string
	GoogleClientSecret string
	OAuthRedirectURL   string // http://localhost:8080/api/auth/google/callback
	FrontendURL        string // http://localhost:5173
	CookieSecure       bool
	CORSOrigins        []string
}

func Load() Config {
	// Try each path separately — godotenv.Load stops on the first missing file,
	// which breaks when you run from server/ (./.env missing, ../.env present).
	for _, path := range []string{".env", "../.env"} {
		_ = godotenv.Load(path)
	}

	frontend := env("FRONTEND_URL", "http://localhost:5173")
	cors := splitCSV(env("CORS_ORIGINS", ""))
	if len(cors) == 0 {
		cors = []string{
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			frontend,
		}
	}

	return Config{
		Addr:               env("ADDR", ":8080"),
		DatabaseURL:        env("DATABASE_URL", "postgres://connect4:connect4@localhost:5432/connect4?sslmode=disable"),
		GoogleClientID:     env("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: env("GOOGLE_CLIENT_SECRET", ""),
		OAuthRedirectURL:   env("OAUTH_REDIRECT_URL", "http://localhost:8080/api/auth/google/callback"),
		FrontendURL:        frontend,
		CookieSecure:       envBool("COOKIE_SECURE", false),
		CORSOrigins:        uniqueNonEmpty(cors),
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envBool(key string, fallback bool) bool {
	v := strings.ToLower(strings.TrimSpace(os.Getenv(key)))
	if v == "" {
		return fallback
	}
	return v == "1" || v == "true" || v == "yes"
}

func splitCSV(s string) []string {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func uniqueNonEmpty(in []string) []string {
	seen := make(map[string]struct{}, len(in))
	out := make([]string, 0, len(in))
	for _, s := range in {
		if s == "" {
			continue
		}
		if _, ok := seen[s]; ok {
			continue
		}
		seen[s] = struct{}{}
		out = append(out, s)
	}
	return out
}
