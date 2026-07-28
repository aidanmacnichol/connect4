export const CELL = { EMPTY: 0, RED: 1, YELLOW: 2 } as const

export type DiscColor = 'red' | 'yellow'

export function cellToColor(value: number): DiscColor | null {
  if (value === CELL.RED) return 'red'
  if (value === CELL.YELLOW) return 'yellow'
  return null
}

/** Find a winning line of 4 (UI-only highlight; does not change game rules). */
export function findWinningCells(board: number[][]): Set<string> {
  const rows = board.length
  const cols = board[0]?.length ?? 0
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = board[r][c]
      if (v === CELL.EMPTY) continue
      for (const [dr, dc] of dirs) {
        const cells: string[] = [`${r}-${c}`]
        let ok = true
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i
          const nc = c + dc * i
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== v) {
            ok = false
            break
          }
          cells.push(`${nr}-${nc}`)
        }
        if (ok) return new Set(cells)
      }
    }
  }
  return new Set()
}
