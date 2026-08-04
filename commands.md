General commands I use, so I can remember them


# Websockets

### Browser test:

```javascript
const ws = new WebSocket("ws://localhost:8080/api/ws")
ws.onopen = () => console.log("open")
ws.onmessage = (e) => console.log("server:", e.data)
ws.onerror = (e) => console.log("error", e)
ws.onclose = () => console.log("closed")
// test message
ws.send(JSON.stringify({ type: "find_game" }))
```


# Server

- Run Server: `go run ./cmd/server`
- pull image (first run): `docker compose up -d` 

### DB Migrations:
- Apply migration:`make migrate-up`
- Create new migration: `make migrate-create name=<name>`
- Downgrade migration: `make migrate-down`
- Postgress shell to query: `docker compose exec db psql -U connect4 -d connect4`

- Create queries (sqlc) `server/db/queries` write the query then: : `sqlc generate`