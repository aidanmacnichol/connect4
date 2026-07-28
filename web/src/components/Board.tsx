import { useEffect, useState } from 'react'
import { CELL, cellToColor, findWinningCells } from './cellUtils'
import { PlayerToken } from './PlayerToken'
import './Board.css'

type BoardProps = {
  board: number[][]
  interactive?: boolean
  myTurn?: boolean
  showWinHighlight?: boolean
  decorative?: boolean
  onPlayColumn?: (col: number) => void
}

function boardsEqual(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false
  for (let r = 0; r < a.length; r++) {
    if (a[r].length !== b[r].length) return false
    for (let c = 0; c < a[r].length; c++) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

function cloneBoard(board: number[][]): number[][] {
  return board.map((row) => row.slice())
}

function findNewDiscs(prev: number[][], next: number[][]): Set<string> {
  const keys = new Set<string>()
  for (let r = 0; r < next.length; r++) {
    for (let c = 0; c < (next[r]?.length ?? 0); c++) {
      if ((prev[r]?.[c] ?? CELL.EMPTY) === CELL.EMPTY && next[r][c] !== CELL.EMPTY) {
        keys.add(`${r}-${c}`)
      }
    }
  }
  return keys
}

export function Board({
  board,
  interactive = false,
  myTurn = false,
  showWinHighlight = false,
  decorative = false,
  onPlayColumn,
}: BoardProps) {
  const [prevBoard, setPrevBoard] = useState(() => cloneBoard(board))
  const [droppingKeys, setDroppingKeys] = useState<Set<string>>(() => new Set())
  const [hoverCol, setHoverCol] = useState<number | null>(null)

  // Adjust animation state when the board updates (React-recommended render pattern).
  if (!boardsEqual(prevBoard, board)) {
    const nextDrops = findNewDiscs(prevBoard, board)
    setPrevBoard(cloneBoard(board))
    setDroppingKeys(nextDrops)
  }

  useEffect(() => {
    if (droppingKeys.size === 0) return
    const timer = window.setTimeout(() => {
      setDroppingKeys(new Set())
    }, 480)
    return () => window.clearTimeout(timer)
  }, [droppingKeys])

  const winning = showWinHighlight ? findWinningCells(board) : new Set<string>()
  const canInteract = interactive && myTurn && !decorative
  const cols = board[0]?.length ?? 7

  return (
    <div
      className={[
        'board-wrap',
        myTurn && interactive ? 'board-wrap--my-turn' : '',
        decorative ? 'board-wrap--decorative' : '',
        !canInteract && interactive ? 'board-wrap--waiting' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="board"
        role={decorative ? 'presentation' : 'grid'}
        aria-label={decorative ? undefined : 'Connect 4 board'}
        onMouseLeave={() => setHoverCol(null)}
      >
        {Array.from({ length: cols }, (_, c) => (
          <button
            key={`col-${c}`}
            type="button"
            className={[
              'board__col',
              hoverCol === c && canInteract ? 'board__col--hover' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!canInteract}
            onClick={() => onPlayColumn?.(c)}
            onMouseEnter={() => {
              if (canInteract) setHoverCol(c)
            }}
            onFocus={() => {
              if (canInteract) setHoverCol(c)
            }}
            onBlur={() => setHoverCol(null)}
            aria-label={decorative ? undefined : `Drop in column ${c + 1}`}
            aria-hidden={decorative || undefined}
            tabIndex={decorative ? -1 : undefined}
          >
            {board.map((row, r) => {
              const value = row[c] ?? CELL.EMPTY
              const color = cellToColor(value)
              const key = `${r}-${c}`
              const isEmpty = color === null
              const highlightEmpty = isEmpty && hoverCol === c && canInteract

              return (
                <span
                  key={key}
                  className={[
                    'board__cell',
                    isEmpty ? 'board__cell--empty' : 'board__cell--filled',
                    highlightEmpty ? 'board__cell--col-hover' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {color ? (
                    <PlayerToken
                      color={color}
                      dropping={droppingKeys.has(key)}
                      dropRows={r + 1}
                      winning={winning.has(key)}
                    />
                  ) : null}
                </span>
              )
            })}
          </button>
        ))}
      </div>
    </div>
  )
}
