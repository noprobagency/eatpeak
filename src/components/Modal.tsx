/**
 * <Modal /> — interrompe tutto e chiede una cosa sola.
 *
 * QUANDO USARLO: conferme distruttive, un modulo breve, la guida alla taglia.
 * QUANDO NO: per contenuti lunghi o per informazioni che l'utente potrebbe
 * voler tenere aperte mentre fa altro. Una modale toglie il controllo: usala
 * quando toglierlo e' il punto.
 *
 * Chiude con Escape e col click fuori.
 * peak-compliance-ignore focus — anello di focus da tastiera, non un claim
 * Il focus entra nel dialogo, resta
 * dentro finche' e' aperto e torna dove stava alla chiusura.
 */

import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Riga di azioni in fondo. In genere due <Button />. */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = { sm: 'max-w-[420px]', md: 'max-w-[560px]', lg: 'max-w-[760px]' } as const

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, title, children, footer, size = 'md', className }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (nodes.length === 0) return

    const first = nodes[0]
    const last = nodes[nodes.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    if (!open) return

    restoreTo.current = document.activeElement as HTMLElement | null

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      trapFocus(e)
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    firstFocusable?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      restoreTo.current?.focus()
    }
  }, [open, onClose, trapFocus])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/40 p-0 sm:items-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'w-full animate-slide-up rounded-t-xl bg-bg-surface shadow-lg sm:rounded-xl',
          SIZES[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-6 border-b border-border-subtle p-6">
          <h2 id={titleId} className="type-display-sm text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="-mr-2 -mt-1 flex h-control-sm w-control-sm shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 text-body-md text-text-secondary">{children}</div>

        {footer && <div className="flex justify-end gap-3 border-t border-border-subtle p-6">{footer}</div>}
      </div>
    </div>
  )
}

export default Modal
