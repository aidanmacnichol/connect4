const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export type GameHistoryResponse = GameHistoryItem[]

export type GameHistoryItem = {
  game: Game
  moves: GameMove[]
}

export type Game = {
  id: string
  red_user_id: string | null
  yellow_user_id: string | null
  winner_id: string | null
  time_control_ms: number | null
  started_at: string
  ended_at: string | null
}

export type GameMove = {
  move_number: number
  col: number
  played_at: string
}

export async function getGameHistoryForUser(): Promise<GameHistoryResponse> {
  const res = await fetch(`${API}/api/game/history`, {
    credentials: 'include',
  })
  if (res.status === 401) throw new Error('unauthorized')
  if (!res.ok) throw new Error('fetch game history failed')
  return res.json()
}
