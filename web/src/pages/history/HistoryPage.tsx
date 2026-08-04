import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Board } from '../../components/Board'
import { ClayButton } from '../../components/ClayButton'
import { useAuth } from '../../app/AuthProvider'
import {
  getGameHistoryForUser,
  type GameHistoryItem,
  type GameHistoryResponse,
} from '../../shared/api/user'
import { boardAfterMoves } from './boardFromMoves'
import './HistoryPage.css'

function formatGameDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}

function gameResult(
  item: GameHistoryItem,
  userId: string | undefined,
): 'WIN' | 'LOSS' | 'DRAW' {
  if (item.game.winner_id == null) return 'DRAW'
  if (userId && item.game.winner_id === userId) return 'WIN'
  return 'LOSS'
}

export function HistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<GameHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ply, setPly] = useState(0)

  useEffect(() => {
    getGameHistoryForUser()
      .then((data) => {
        setHistory(data)
        if (data.length > 0) {
          setSelectedId(data[0].game.id)
          setPly(data[0].moves.length)
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => setLoading(false))
  }, [])

  const selected = useMemo(
    () => history?.find((item) => item.game.id === selectedId) ?? null,
    [history, selectedId],
  )

  const board = useMemo(() => {
    if (!selected) return boardAfterMoves([], 0)
    return boardAfterMoves(selected.moves, ply)
  }, [selected, ply])

  function selectGame(item: GameHistoryItem) {
    setSelectedId(item.game.id)
    setPly(item.moves.length)
  }

  if (loading) {
    return (
      <div className="history-page history-page--muted">
        <p className="history-page__status">Loading history…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="history-page history-page--muted">
        <p className="history-page__status" role="alert">
          {error}
        </p>
      </div>
    )
  }
  if (!history || history.length === 0) {
    return (
      <div className="history-page history-page--muted">
        <p className="history-page__status">No games yet. Play a match first.</p>
      </div>
    )
  }

  const maxPly = selected?.moves.length ?? 0
  const result = selected ? gameResult(selected, user?.id) : null
  const atEnd = ply >= maxPly

  return (
    <section className="history-page">
      <aside className="history-page__rail" aria-label="Past games">
        <header className="history-page__rail-header">
          <h1 className="history-page__title">History</h1>
          <p className="history-page__subtitle">Replay your past matches</p>
        </header>

        <ul className="history-page__games">
          {history.map((item) => {
            const itemResult = gameResult(item, user?.id)
            const active = item.game.id === selectedId
            return (
              <li key={item.game.id}>
                <button
                  type="button"
                  className={`history-game${active ? ' history-game--active' : ''}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => selectGame(item)}
                >
                  <span className="history-game__top">
                    <span className="history-game__date">
                      {formatGameDate(item.game.ended_at ?? item.game.started_at)}
                    </span>
                    <span
                      className={`history-game__badge history-game__badge--${itemResult.toLowerCase()}`}
                    >
                      {itemResult}
                    </span>
                  </span>
                  <span className="history-game__meta">
                    {item.moves.length} moves
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <div className="history-page__stage">
        {selected && result ? (
          <div className="history-stage" key={selected.game.id}>
            <header className="history-stage__header">
              <div className="history-stage__copy">
                <p className="history-stage__eyebrow">Match replay</p>
                <h2 className="history-stage__date">
                  {formatGameDate(selected.game.ended_at ?? selected.game.started_at)}
                </h2>
              </div>
              <span
                className={`history-game__badge history-game__badge--lg history-game__badge--${result.toLowerCase()}`}
              >
                {result}
              </span>
            </header>

            <div className="history-stage__board">
              <Board
                board={board}
                interactive={false}
                showWinHighlight={atEnd && selected.game.winner_id != null}
              />
            </div>

            <div className="history-scrubber" role="group" aria-label="Move controls">
              <ClayButton
                variant="secondary"
                className="history-scrubber__btn"
                icon={<ChevronsLeft />}
                aria-label="Go to start"
                disabled={ply <= 0}
                onClick={() => setPly(0)}
              />
              <ClayButton
                variant="secondary"
                className="history-scrubber__btn"
                icon={<ChevronLeft />}
                aria-label="Previous move"
                disabled={ply <= 0}
                onClick={() => setPly((p) => Math.max(0, p - 1))}
              />
              <div className="history-scrubber__meter" aria-live="polite">
                <span className="history-scrubber__meter-label">Move</span>
                <span className="history-scrubber__meter-value">
                  {ply}
                  <span className="history-scrubber__meter-total"> / {maxPly}</span>
                </span>
              </div>
              <ClayButton
                variant="secondary"
                className="history-scrubber__btn"
                icon={<ChevronRight />}
                aria-label="Next move"
                disabled={ply >= maxPly}
                onClick={() => setPly((p) => Math.min(maxPly, p + 1))}
              />
              <ClayButton
                variant="secondary"
                className="history-scrubber__btn"
                icon={<ChevronsRight />}
                aria-label="Go to end"
                disabled={ply >= maxPly}
                onClick={() => setPly(maxPly)}
              />
            </div>
          </div>
        ) : (
          <p className="history-page__status">Select a game</p>
        )}
      </div>
    </section>
  )
}
