import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  CellName,
  ClientMessage,
  GamePhase,
  PlayerColor,
  ServerMessage,
} from './types'

const EMPTY_BOARD = (): number[][] =>
  Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0))

function wsUrl(): string {
  const custom = import.meta.env.VITE_WS_URL
  if (custom) return custom
  return 'ws://localhost:8080/api/ws'
}

function isServerMessage(value: unknown): value is ServerMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type: unknown }).type === 'string'
  )
}

/**
 * Online Connect 4 via the Go WebSocket server.
 * Server state is authoritative.
 */
export function useGameSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [phase, setPhase] = useState<GamePhase>('connecting')
  const [color, setColor] = useState<PlayerColor | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const [board, setBoard] = useState<number[][]>(EMPTY_BOARD)
  const [current, setCurrent] = useState<PlayerColor>('red')
  const [winner, setWinner] = useState<CellName>('empty')
  const [draw, setDraw] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Connecting…')

  const handleMessage = useCallback((raw: string) => {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      setError('Bad message from server')
      return
    }

    if (!isServerMessage(parsed)) {
      setError('Bad message from server')
      return
    }

    const msg = parsed

    switch (msg.type) {
      case 'queued':
        setPhase('queued')
        setStatus('Looking for an opponent…')
        setError('')
        break

      case 'matched':
        setPhase('playing')
        setColor(msg.color)
        setGameId(msg.gameId)
        setStatus(`Matched as ${msg.color}`)
        setError('')
        break

      case 'state':
        setPhase('playing')
        if (msg.board) setBoard(msg.board)
        if (msg.current) setCurrent(msg.current)
        setWinner(msg.winner ?? 'empty')
        setDraw(Boolean(msg.draw))
        setStatus(msg.current === 'red' ? 'Red to move' : 'Yellow to move')
        setError('')
        break

      case 'game_over':
        setPhase('over')
        if (msg.board) setBoard(msg.board)
        setWinner(msg.winner ?? 'empty')
        setDraw(Boolean(msg.draw))
        if (msg.draw) {
          setStatus('Draw!')
        } else {
          setStatus(`${capitalize(msg.winner)} wins!`)
        }
        setError('')
        break

      case 'error':
        setError(msg.message || 'Error')
        break

      case 'cancel':
        setPhase('idle')
        setStatus('Cancelled — find a new game when ready')
        setColor(null)
        setGameId(null)
        setBoard(EMPTY_BOARD())
        break

      default:
        break
    }
  }, [])

  const connect = useCallback(() => {
    const prev = wsRef.current
    if (prev) {
      prev.onclose = null
      prev.close()
      wsRef.current = null
    }

    setPhase('connecting')
    setStatus('Connecting…')
    setError('')
    setColor(null)
    setGameId(null)
    setBoard(EMPTY_BOARD())
    setCurrent('red')
    setWinner('empty')
    setDraw(false)

    const ws = new WebSocket(wsUrl())
    wsRef.current = ws

    ws.onopen = () => {
      if (wsRef.current !== ws) return
      setConnected(true)
      setPhase('idle')
      setStatus('Connected — find a game')
    }

    ws.onmessage = (event: MessageEvent<string>) => {
      if (wsRef.current !== ws) return
      handleMessage(event.data)
    }

    ws.onerror = () => {
      if (wsRef.current !== ws) return
      setError('WebSocket error — is the Go server running on :8080?')
    }

    ws.onclose = () => {
      if (wsRef.current !== ws) return
      wsRef.current = null
      setConnected(false)
      setPhase('idle')
      setStatus('Disconnected')
    }
  }, [handleMessage])

  useEffect(() => {
    connect()
    return () => {
      const ws = wsRef.current
      if (!ws) return
      ws.onclose = null
      ws.close()
      wsRef.current = null
    }
  }, [connect])

  const send = useCallback((payload: ClientMessage) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError('Not connected')
      return
    }
    ws.send(JSON.stringify(payload))
  }, [])

  const findGame = useCallback(() => {
    setError('')
    send({ type: 'find_game' })
  }, [send])

  const cancelQueue = useCallback(() => {
    send({ type: 'cancel' })
  }, [send])

  const play = useCallback(
    (col: number) => {
      if (phase !== 'playing') return
      if (color !== current) {
        setError('Not your turn')
        return
      }
      setError('')
      send({ type: 'move', col })
    },
    [phase, color, current, send],
  )

  const myTurn = phase === 'playing' && color === current

  return {
    connected,
    phase,
    color,
    gameId,
    board,
    current,
    winner,
    draw,
    error,
    status,
    myTurn,
    findGame,
    cancelQueue,
    play,
    reconnect: connect,
  }
}

function capitalize(s: string | undefined): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
