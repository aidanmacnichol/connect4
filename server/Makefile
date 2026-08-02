# Load ../.env when present (repo root)
ifneq (,$(wildcard ../.env))
include ../.env
export
endif

DATABASE_URL ?= postgres://connect4:connect4@localhost:5432/connect4?sslmode=disable
MIGRATE_DATABASE_URL ?= $(subst postgres://,pgx5://,$(subst postgresql://,pgx5://,$(DATABASE_URL)))
MIGRATIONS := migrations

.PHONY: migrate-up migrate-down migrate-version migrate-force migrate-create sqlc

migrate-up:
	migrate -path $(MIGRATIONS) -database "$(MIGRATE_DATABASE_URL)" up

migrate-down:
	migrate -path $(MIGRATIONS) -database "$(MIGRATE_DATABASE_URL)" down 1

migrate-version:
	migrate -path $(MIGRATIONS) -database "$(MIGRATE_DATABASE_URL)" version

migrate-force:
	migrate -path $(MIGRATIONS) -database "$(MIGRATE_DATABASE_URL)" force $(version)

migrate-create:
	migrate create -ext sql -dir $(MIGRATIONS) -seq $(name)

sqlc:
	sqlc generate
