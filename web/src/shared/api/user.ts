const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export async function getGameHistoryForUser(id: string) {
    const res = await fetch(`${API}/api/game/history/${id}`)
    if (res.status === 401) throw new Error('unauthorized')
    if (res.status === 404) return null
    if (!res.ok) throw new Error('fetch game history failed')
    return res.json()
}