export type PlayerColor = 'red' | 'yellow'

export type CellName = PlayerColor | 'empty'

export type GamePhase =
  | 'connecting'
  | 'idle'
  | 'queued'
  | 'playing'
  | 'over'

export type ClientMessage =
  | { type: 'find_game' }
  | { type: 'cancel' }
  | { type: 'move'; col: number }

export type ServerMessage =
  | { type: 'queued' }
  | { type: 'matched'; gameId: string; color: PlayerColor }
  | {
      type: 'state'
      gameId?: string
      board?: number[][]
      current?: PlayerColor
      winner?: CellName
      draw?: boolean
    }
  | {
      type: 'game_over'
      gameId?: string
      board?: number[][]
      current?: string
      winner?: CellName
      draw?: boolean
    }
  | { type: 'error'; message?: string }
  | { type: 'cancel'; message?: string }
