import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from 'react'

import { fetchMe, logout as apiLogout, type User } from '../shared/api/auth'

type AuthContextValue = {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMe()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }, [])

    async function logout() {
        await apiLogout()
        setUser(null)
    }
    
    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return ctx
}