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