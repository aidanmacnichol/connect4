import { Loader, Play, X } from 'lucide-react'
import type { GamePhase } from '../types'
import { Board } from './Board'
import { ClayButton } from './ClayButton'
import './Lobby.css'

type LobbyProps = {
  phase: GamePhase
  connected: boolean
  status: string
  error: string
  onFindGame: () => void
  onCancelQueue: () => void
}

const EMPTY_BOARD = Array.from({ length: 6 }, () =>
  Array.from({ length: 7 }, () => 0),
)

export function Lobby({
  phase,
  connected,
  status,
  error,
  onFindGame,
  onCancelQueue,
}: LobbyProps) {
  const isQueued = phase === 'queued'
  const isConnecting = phase === 'connecting' || !connected

  return (
    <section className="lobby">
      <header className="lobby__hero">
        <h1 className="lobby__brand">Connect 4</h1>
        <p className="lobby__support">Drop discs. Beat a stranger.</p>
      </header>

      <p
        className={`lobby__connection ${connected ? 'lobby__connection--ok' : ''}`}
        aria-live="polite"
      >
        {isConnecting ? 'Connecting…' : connected ? 'Connected' : 'Disconnected'}
      </p>

      {isQueued ? (
        <div className="lobby__queue" role="status" aria-live="polite">
          <Loader className="lobby__spinner" aria-hidden="true" />
          <div className="lobby__queue-copy">
            <p className="lobby__queue-title">Looking for an opponent…</p>
            <p className="lobby__queue-helper">Hang tight — matching you now.</p>
          </div>
        </div>
      ) : null}

      <div className="lobby__actions">
        {isQueued ? (
          <ClayButton
            variant="danger"
            icon={<X />}
            onClick={onCancelQueue}
          >
            Cancel search
          </ClayButton>
        ) : (
          <ClayButton
            variant="primary"
            icon={<Play />}
            onClick={onFindGame}
            disabled={!connected}
          >
            {isConnecting ? 'Connecting…' : 'Find game'}
          </ClayButton>
        )}
      </div>

      {error ? (
        <p className="lobby__error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="lobby__status" aria-live="polite">
        {status}
      </p>

      <div className="lobby__preview">
        <Board board={EMPTY_BOARD} decorative />
      </div>

      <p className="lobby__hint">
        Run the Go server (<code>cd server && go run ./cmd/server</code>), then
        open this page in two tabs and hit Find game in each.
      </p>
    </section>
  )
}
