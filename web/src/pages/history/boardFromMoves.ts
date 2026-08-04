import { CELL } from '../../components/cellUtils'
import type { GameMove } from '../../shared/api/user'

const ROWS = 6
const COLS = 7

export function emptyBoard(): number[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => CELL.EMPTY),
  )
}

/**
 * Replay the first `ply` moves onto an empty board.
 * ply 0 = empty; ply === moves.length = final position.
 * Assumes red plays first (even indices), yellow second.
 */
export function boardAfterMoves(moves: GameMove[], ply: number): number[][] {
  const board = emptyBoard()
  const sorted = [...moves].sort((a, b) => a.move_number - b.move_number)
  const count = Math.max(0, Math.min(ply, sorted.length))

  for (let i = 0; i < count; i++) {
    const col = sorted[i].col
    if (col < 0 || col >= COLS) continue
    const value = i % 2 === 0 ? CELL.RED : CELL.YELLOW
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === CELL.EMPTY) {
        board[r][col] = value
        break
      }
    }
  }

  return board
}
