import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './ClayButton.css'

type ClayButtonVariant = 'primary' | 'secondary' | 'danger'

type ClayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ClayButtonVariant
  icon?: ReactNode
}

export function ClayButton({
  variant = 'primary',
  icon,
  children,
  className = '',
  type = 'button',
  ...rest
}: ClayButtonProps) {
  return (
    <button
      type={type}
      className={`clay-btn clay-btn--${variant} ${className}`.trim()}
      {...rest}
    >
      {icon ? (
        <span className="clay-btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  )
}
