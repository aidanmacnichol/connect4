# Test Websocket

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

- pull image (first run): `docker compose up -d` 

# DB Migrations:
- `make migrate-up`
- `make migrate-create name=<name>`
- make migrate-down

- Postgress shell to query: `docker compose exec db psql -U connect4 -d connect4`
`