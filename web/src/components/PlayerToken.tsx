import type { DiscColor } from './cellUtils'
import './PlayerToken.css'

type PlayerTokenProps = {
  color: DiscColor
  dropping?: boolean
  dropRows?: number
  winning?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function PlayerToken({
  color,
  dropping = false,
  dropRows = 1,
  winning = false,
  size = 'md',
  className = '',
}: PlayerTokenProps) {
  const classes = [
    'token',
    `token--${color}`,
    `token--${size}`,
    dropping ? 'token--dropping' : '',
    winning ? 'token--winning' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classes}
      style={{ ['--drop-rows' as string]: dropRows }}
      aria-hidden="true"
    />
  )
}
