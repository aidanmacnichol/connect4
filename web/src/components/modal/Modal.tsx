import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

type ModalProps = {
  title: string
  children: ReactNode
  /** When true, clicking the backdrop / Escape will not close. */
  dismissible?: boolean
  onClose?: () => void
}

export function Modal({
  title,
  children,
  dismissible = true,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!dismissible || !onClose) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dismissible, onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
