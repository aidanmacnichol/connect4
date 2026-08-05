package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"unicode/utf8"

	"github.com/aidanmacnichol/connect4/server/internal/db/sqlc"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	displayNameMinLen = 2
	displayNameMaxLen = 24
)

type updateMeRequest struct {
	DisplayName string `json:"display_name"`
}

func UpdateMe(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := UserFromContext(r.Context())
		if !ok {
			http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
			return
		}

		var req updateMeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, http.StatusBadRequest, "invalid json")
			return
		}

		name := strings.TrimSpace(req.DisplayName)
		if err := validateDisplayName(name); err != nil {
			writeJSONError(w, http.StatusBadRequest, err.Error())
			return
		}

		updated, err := sqlc.New(pool).UpdateDisplayName(r.Context(), sqlc.UpdateDisplayNameParams{
			ID:          user.ID,
			DisplayName: &name,
		})
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				writeJSONError(w, http.StatusConflict, "display name already taken")
				return
			}
			writeJSONError(w, http.StatusInternalServerError, "internal server error")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(updated)
	}
}

func validateDisplayName(name string) error {
	n := utf8.RuneCountInString(name)
	if n < displayNameMinLen {
		return errors.New("display name must be at least 2 characters")
	}
	if n > displayNameMaxLen {
		return errors.New("display name must be at most 24 characters")
	}
	for _, r := range name {
		if r < 32 || r == 127 {
			return errors.New("display name contains invalid characters")
		}
	}
	return nil
}

func writeJSONError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
