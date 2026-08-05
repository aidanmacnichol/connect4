import { API_BASE } from './base'

export type User = {
    id: string
    email: string
    name: string
    display_name?: string | null
    avatar_url?: string | null
}

// TODO: convert to react query
export async function fetchMe(): Promise<User | null> {
    const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' })
    if (res.status === 401) return null
    if (!res.ok) throw new Error('me failed')
    return res.json() // {id, email, name, avator_url, ... }
}

export async function logout() {
    await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    })
}

export async function updateDisplayName(displayName: string): Promise<User> {
    const res = await fetch(`${API_BASE}/api/me`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName }),
    })
    if (!res.ok) {
        let message = 'Failed to update display name'
        try {
            const data = (await res.json()) as { error?: string }
            if (data.error) message = data.error
        } catch {
            /* ignore */
        }
        throw new Error(message)
    }
    return res.json()
}