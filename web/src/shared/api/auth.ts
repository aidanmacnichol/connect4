const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'


export type User = {
    id: string
    email: string
    name: string
    avatar_url?: string | null
}

// TODO: convert to react query
export async function fetchMe(): Promise<User | null> {
    const res = await fetch(`${API}/api/me`, { credentials: 'include' })
    if (res.status === 401) return null
    if (!res.ok) throw new Error('me failed')
        return res.json() // {id, email, name, avator_url, ... }
}

export async function logout() {
    await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    })
}