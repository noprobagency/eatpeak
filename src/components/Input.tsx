/**
 * <Input /> — campo di testo con etichetta.
 *
 * QUANDO USARLO: ogni volta che serve un dato dall'utente.
 * QUANDO NO: per i numeri di quantita' in carrello. Li' serve
 * <QuantityStepper />, che ha i comandi + e - e non richiede la tastiera.
 *
 * L'etichetta e' obbligatoria per tipo. Un placeholder non e' un'etichetta:
 * sparisce appena scrivi e non viene letto in modo affidabile.
 */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  /** Nasconde l'etichetta visivamente ma la tiene per gli screen reader. */
  hideLabel?: boolean
  hint?: ReactNode
  error?: string
  /** I dati oggettivi passano dal mono. Es. codici lotto, quantita'. */
  mono?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel = false, hint, error, mono = false, id, className, disabled, ...rest },
  ref,
) {
  const reactId = useId()
  const inputId = id ?? reactId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className={cn('text-heading-sm text-text-primary', hideLabel && 'sr-only')}>
        {label}
      </label>

      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-11 w-full rounded-md border bg-bg-surface px-4 text-body-md text-text-primary',
          'transition-colors duration-base ease-standard',
          'placeholder:text-text-muted',
          'disabled:cursor-not-allowed disabled:bg-bg-raised disabled:opacity-60',
          mono && 'font-mono text-mono-md uppercase',
          error
            ? 'border-error focus-visible:outline-error'
            : 'border-border-default hover:border-border-strong',
        )}
        {...rest}
      />

      {hint && !error && (
        <p id={hintId} className="text-body-sm text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
