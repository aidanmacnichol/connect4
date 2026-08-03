import './App.css'
import { useEffect, useState } from 'react'

import { GameScreen } from '../pages/game/GameScreen'
import { useGameSocket } from '../pages/game/useGameSocket'
import { Lobby } from '../pages/lobby/Lobby'

import { LoginPage } from '../pages/login/LoginPage'
import { fetchMe, logout, type User } from '../shared/api/auth'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const {
    connected,
    phase,
    color,
    board,
    winner,
    draw,
    error,
    status,
    myTurn,
    findGame,
    cancelQueue,
    play,
    reconnect,
  } = useGameSocket()

  useEffect(() => {
    fetchMe()
    .then(setUser)
    .catch(() => setUser(null))
    .finally(() => setAuthLoading(false))
  }, [])

  if (authLoading) {
    return <main className="app">Loading...</main>
  }

  if (!user) {
    return (
      <main className="app">
      <LoginPage />
      </main>
    )
  }
  const inMatch = phase === 'playing' || phase === 'over'

  return (
    <main className="app">
      <p>
        Signed in as {user.name}{' '}
        <button type="button"
        onClick={async () => {
          await logout()
          setUser(null)
        }}
        >
          Logout
        </button>
      </p>
      {inMatch ? (
        <GameScreen
          phase={phase}
          board={board}
          color={color}
          myTurn={myTurn}
          winner={winner}
          draw={draw}
          status={status}
          error={error}
          onPlay={play}
          onPlayAgain={reconnect}
        />
      ) : (
        <Lobby
          phase={phase}
          connected={connected}
          status={status}
          error={error}
          onFindGame={findGame}
          onCancelQueue={cancelQueue}
        />
      )}
    </main>
  )
}

export default App
