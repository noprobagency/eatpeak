/**
 * <Select /> — scelta singola da un elenco.
 *
 * QUANDO USARLO: sopra le cinque opzioni, o quando le opzioni sono note e
 * noiose (paese, formato, quantita' alta).
 * QUANDO NO: sotto le cinque opzioni con un peso reale nella decisione. Li' il
 * <Radio /> mostra tutto senza un click, e converte meglio.
 *
 * E' un <select> nativo di proposito: la tastiera, il mobile e gli screen
 * reader funzionano gia', e nessuna reimplementazione li batte.
 */

import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string
  options: readonly SelectOption[]
  hideLabel?: boolean
  hint?: string
  error?: string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, hideLabel = false, hint, error, placeholder, id, className, ...rest },
  ref,
) {
  const reactId = useId()
  const selectId = id ?? reactId
  const hintId = `${selectId}-hint`
  const errorId = `${selectId}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={selectId} className={cn('text-heading-sm text-text-primary', hideLabel && 'sr-only')}>
        {label}
      </label>

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-control-md w-full appearance-none rounded-md border bg-bg-surface pl-4 pr-10',
            'text-body-md text-text-primary transition-colors duration-base ease-standard',
            'disabled:cursor-not-allowed disabled:bg-bg-raised disabled:opacity-60',
            error ? 'border-error' : 'border-border-default hover:border-border-strong',
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {hint && !error && <p id={hintId} className="text-body-sm text-text-secondary">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-body-sm text-error">{error}</p>}
    </div>
  )
})

export default Select
