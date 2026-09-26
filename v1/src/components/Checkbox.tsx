/**
 * <Checkbox /> — scelta indipendente, si' o no.
 *
 * QUANDO USARLO: consensi, opzioni multiple, "ricordami".
 * QUANDO NO: per scegliere una fra piu' alternative. Quello e' <Radio />.
 *
 * L'input nativo resta nel DOM e riceve il focus: il quadratino disegnato e'
 * solo pittura sopra. Cosi' tastiera e screen reader funzionano gratis.
 */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  hint?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, id, className, disabled, ...rest },
  ref,
) {
  const reactId = useId()
  const inputId = id ?? reactId
  const hintId = `${inputId}-hint`

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-3">
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-describedby={hint ? hintId : undefined}
            aria-invalid={error ? true : undefined}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none flex h-5 w-5 items-center justify-center rounded-sm border',
              'transition-colors duration-fast ease-standard',
              'border-border-strong bg-bg-surface',
              'peer-hover:border-border-brand',
              'peer-checked:border-transparent peer-checked:bg-bg-brand',
              'peer-disabled:opacity-45',
              error && 'border-error',
            )}
          >
            <svg className="h-3 w-3 text-text-on-brand opacity-0 peer-checked:opacity-100" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5l2.5 2.5 4.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>

        <label htmlFor={inputId} className={cn('text-body-md text-text-primary', disabled ? 'opacity-45' : 'cursor-pointer')}>
          {label}
        </label>
      </div>

      {hint && !error && <p id={hintId} className="pl-8 text-body-sm text-text-secondary">{hint}</p>}
      {error && <p role="alert" className="pl-8 text-body-sm text-error">{error}</p>}
    </div>
  )
})

export default Checkbox
