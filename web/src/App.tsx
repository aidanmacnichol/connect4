import './App.css'
import { useGameSocket } from './useGameSocket'

const CELL = { EMPTY: 0, RED: 1, YELLOW: 2 } as const

function cellClass(value: number): string {
  if (value === CELL.RED) return 'cell red'
  if (value === CELL.YELLOW) return 'cell yellow'
  return 'cell empty'
}

function App() {
  const {
    connected,
    phase,
    color,
    board,
    error,
    status,
    myTurn,
    findGame,
    cancelQueue,
    play,
    reconnect,
  } = useGameSocket()

  const canPlay = myTurn
  const showQueueActions = phase === 'idle' || phase === 'queued'

  return (
    <main className="app">
      <h1>Connect 4</h1>
      <p className="status">{status}</p>
      {color ? (
        <p className="meta">
          You are <span className={`tag ${color}`}>{color}</span>
          {phase === 'playing' ? (myTurn ? ' · your turn' : ' · waiting') : null}
        </p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="actions">
        {showQueueActions ? (
          phase === 'queued' ? (
            <button type="button" className="reset" onClick={cancelQueue}>
              Cancel search
            </button>
          ) : (
            <button
              type="button"
              className="reset"
              onClick={findGame}
              disabled={!connected}
            >
              Find game
            </button>
          )
        ) : null}

        {phase === 'over' ? (
          <button type="button" className="reset" onClick={reconnect}>
            Play again
          </button>
        ) : null}
      </div>

      <div className="board" style={{ ['--cols' as string]: 7 }}>
        {board.map((row, r) =>
          row.map((value, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className={cellClass(value)}
              onClick={() => play(c)}
              disabled={!canPlay}
              aria-label={`Row ${r}, column ${c}`}
            />
          )),
        )}
      </div>

      <div className="columns">
        {board[0]?.map((_, c) => (
          <button
            key={c}
            type="button"
            className="col-btn"
            onClick={() => play(c)}
            disabled={!canPlay}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="hint">
        Run the Go server (<code>cd server && go run ./cmd/server</code>), then
        open this page in two tabs and hit Find game in each.
      </p>
    </main>
  )
}

export default App
