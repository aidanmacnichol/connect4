import type { DiscColor } from './cellUtils'
import { PlayerToken } from './PlayerToken'
import './PlayerChip.css'

type PlayerChipProps = {
  color: DiscColor
}

export function PlayerChip({ color }: PlayerChipProps) {
  const label = color === 'red' ? 'Red' : 'Yellow'
  return (
    <span className={`player-chip player-chip--${color}`}>
      <PlayerToken color={color} size="sm" />
      <span className="player-chip__label">{label}</span>
    </span>
  )
}
