

import '../../app/App.css'

import { GameScreen } from '../game/GameScreen'
import { useGameSocket } from '../game/useGameSocket'
import { Lobby } from '../lobby/Lobby'


export function PlayPage() {

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


  const inMatch = phase === 'playing' || phase === 'over'

  return (
    <main className="app">
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

export default PlayPage
