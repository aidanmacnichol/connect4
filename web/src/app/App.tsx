import './App.css'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'

import { AppShell } from './AppShell'
import { PlayPage } from '../pages/play/PlayPage'
import { LoginPage } from '../pages/login/LoginPage'
import { HistoryPage } from '../pages/history/HistoryPage'
import { useAuth } from './AuthProvider'

function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return <main className="app">Loading...</main>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestOnly() {
  const { user, loading } = useAuth()
  if (loading) return <main className='app'>Loading...</main>
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route
          path='/login'
          element={
            <main className="app">
              <LoginPage />
            </main>
          }
        />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<PlayPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Route>


      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<PlayPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
