/**
 * <Toast /> e <ToastStack /> — conferma breve, non bloccante.
 *
 * QUANDO USARLO: "aggiunto al carrello", "codice copiato". Cose che l'utente
 * puo' ignorare senza perdere niente.
 * QUANDO NO: per errori che richiedono un'azione. Un toast sparisce; un errore
 * bloccante deve restare dove l'utente sta guardando.
 *
 * Lo stack e' un live region: gli screen reader annunciano il messaggio senza
 * peak-compliance-ignore focus — focus da tastiera, non un claim
 * spostare il focus.
 */

import { useEffect, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type ToastTone = 'default' | 'success' | 'warning' | 'error'

export interface ToastProps {
  id?: string
  children: ReactNode
  tone?: ToastTone
  onDismiss?: () => void
  /** Millisecondi prima della chiusura automatica. `null` per non chiudere. */
  duration?: number | null
  className?: string
}

const TONES: Record<ToastTone, string> = {
  default: 'bg-bg-inverse text-text-inverse',
  success: 'bg-bosco-500 text-neutral-0',
  warning: 'bg-miele-300 text-neutral-900',
  error: 'bg-error text-neutral-0',
}

export function Toast({ children, tone = 'default', onDismiss, duration = 4000, className }: ToastProps) {
  useEffect(() => {
    if (duration === null || !onDismiss) return
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-lg px-5 py-4 shadow-lg animate-slide-up',
        TONES[tone],
        className,
      )}
    >
      <div className="flex-1 text-body-sm">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Chiudi la notifica"
          className="-mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

export interface ToastStackProps {
  children: ReactNode
  position?: 'bottom-right' | 'bottom-center' | 'top-right'
}

const POSITIONS = {
  'bottom-right': 'bottom-6 right-6 items-end',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-6 right-6 items-end',
} as const

export function ToastStack({ children, position = 'bottom-right' }: ToastStackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className={cn('pointer-events-none fixed z-50 flex w-full max-w-[380px] flex-col gap-3', POSITIONS[position])}
    >
      <div className="pointer-events-auto flex w-full flex-col gap-3">{children}</div>
    </div>
  )
}

export default Toast
