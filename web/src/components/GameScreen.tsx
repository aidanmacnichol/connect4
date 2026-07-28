import { RotateCcw } from 'lucide-react'
import type { PlayerColor } from '../types'
import { Board } from './Board'
import { ClayButton } from './ClayButton'
import { PlayerChip } from './PlayerChip'
import './GameScreen.css'

type GameScreenProps = {
  phase: 'playing' | 'over'
  board: number[][]
  color: PlayerColor | null
  myTurn: boolean
  winner: string
  draw: boolean
  status: string
  error: string
  onPlay: (col: number) => void
  onPlayAgain: () => void
}

export function GameScreen({
  phase,
  board,
  color,
  myTurn,
  winner,
  draw,
  status,
  error,
  onPlay,
  onPlayAgain,
}: GameScreenProps) {
  const isOver = phase === 'over'
  const youWon = isOver && !draw && color !== null && winner === color
  const youLost = isOver && !draw && color !== null && winner !== 'empty' && winner !== color

  let resultTitle = 'Draw'
  let resultClass = 'game-screen__result--draw'
  let resultCopy = "Board's full. Draw!"

  if (youWon) {
    resultTitle = 'You win!'
    resultClass = 'game-screen__result--win'
    resultCopy = 'You connected four.'
  } else if (youLost) {
    resultTitle = 'Opponent wins'
    resultClass = 'game-screen__result--loss'
    resultCopy = 'Nice try — opponent connected four.'
  } else if (draw) {
    resultTitle = 'Draw!'
    resultClass = 'game-screen__result--draw'
    resultCopy = "Board's full. Draw!"
  }

  return (
    <section className="game-screen">
      <h1 className="game-screen__brand">Connect 4</h1>

      {color ? (
        <div className="game-screen__meta" aria-live="polite">
          <span className="game-screen__you">You are</span>
          <PlayerChip color={color} />
          {!isOver ? (
            <span className="game-screen__turn">
              {myTurn ? 'Your turn' : 'Waiting…'}
            </span>
          ) : null}
        </div>
      ) : null}

      {isOver ? (
        <div
          className={`game-screen__result ${resultClass}`}
          role="status"
          aria-live="assertive"
        >
          <p className="game-screen__result-title">{resultTitle}</p>
          <p className="game-screen__result-copy">{resultCopy}</p>
        </div>
      ) : (
        <p className="game-screen__status" aria-live="polite">
          {status}
        </p>
      )}

      {error ? (
        <p className="game-screen__error" role="alert">
          {error}
        </p>
      ) : null}

      <Board
        board={board}
        interactive={!isOver}
        myTurn={myTurn}
        showWinHighlight={isOver && !draw}
        onPlayColumn={onPlay}
      />

      {isOver ? (
        <div className="game-screen__actions">
          <ClayButton
            variant="primary"
            icon={<RotateCcw />}
            onClick={onPlayAgain}
          >
            Play again
          </ClayButton>
        </div>
      ) : null}
    </section>
  )
}
