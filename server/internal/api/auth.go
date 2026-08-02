package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/aidanmacnichol/connect4/server/internal/auth"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
)

func GoogleLogin(oauth *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		state, _ := auth.RandomString(16)
		http.SetCookie(w, &http.Cookie{
			Name:     "oauth_state",
			Value:    state,
			Path:     "/",
			MaxAge:   300,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})
		http.Redirect(w, r, oauth.AuthCodeURL(state), http.StatusFound)
	}
}

func GoogleCallback(oauth *oauth2.Config, pool *pgxpool.Pool, frontendURL string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		stateCookie, err := r.Cookie("oauth_state")
		if err != nil || r.URL.Query().Get("state") != stateCookie.Value {
			http.Error(w, "invalid state", http.StatusBadRequest)
			return
		}

		code := r.URL.Query().Get("code")
		token, err := oauth.Exchange(r.Context(), code)
		if err != nil {
			http.Error(w, "token exchange failed", http.StatusBadRequest)
			return
		}

		client := oauth.Client(r.Context(), token)
		resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
		if err != nil {
			http.Error(w, "failed to get userinfo", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		var info struct {
			ID      string `json:"id"`
			Email   string `json:"email"`
			Name    string `json:"name"`
			Picture string `json:"picture"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
			http.Error(w, "bad userinfo", http.StatusBadGateway)
			return
		}

		avatar := info.Picture
		user, err := auth.UpsertFromGoogle(r.Context(), pool, info.ID, info.Email, info.Name, &avatar)
		if err != nil {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}

		sessionID, err := auth.CreateSession(r.Context(), pool, user.ID, 7*24*time.Hour)
		if err != nil {
			http.Error(w, "session error", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "session",
			Value:    sessionID,
			Path:     "/",
			MaxAge:   int((7 * 24 * time.Hour).Seconds()),
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})

		// clear oauth state
		http.SetCookie(w, &http.Cookie{Name: "oauth_state", Path: "/", MaxAge: -1})
		http.Redirect(w, r, frontendURL, http.StatusFound)
	}
}

func Me(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("session")
		if err != nil {
			http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
			return
		}

		user, err := auth.UserFromSession(r.Context(), pool, c.Value)
		if err != nil {
			http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(user)
	}
}

func Logout(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if c, err := r.Cookie("session"); err == nil {
			_ = auth.DeleteSession(r.Context(), pool, c.Value)
		}
		http.SetCookie(w, &http.Cookie{
			Name:     "session",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})
		w.WriteHeader(http.StatusNoContent)
	}
}
