/**
 * <QuantityStepper /> — quanti pezzi.
 *
 * QUANDO USARLO: carrello, riga prodotto, ovunque la quantita' si aggiusti di
 * uno alla volta.
 * QUANDO NO: per scegliere il formato d'acquisto in pagina prodotto. Li' il
 * numero non e' una quantita' neutra, e' un'offerta: usa <PriceTiers />.
 *
 * Il numero e' in mono, come ogni dato oggettivo del sistema.
 */

import { useId } from 'react'
import { cn } from '../lib/cn'

export interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

const STEP_BUTTON =
  'flex items-center justify-center rounded-full border border-border-default bg-bg-surface ' +
  'text-text-primary transition-colors duration-fast ease-standard ' +
  'hover:border-border-brand hover:text-text-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-default disabled:hover:text-text-primary'

export function QuantityStepper({
  value, onChange, min = 1, max = 99, label = 'Quantita', size = 'md', disabled = false, className,
}: QuantityStepperProps) {
  const id = useId()
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <span id={id} className="sr-only">{label}</span>

      <button
        type="button"
        className={cn(STEP_BUTTON, box)}
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label={`Diminuisci ${label.toLowerCase()}`}
      >
        <svg className="h-4 w-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2.5 7h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      <output
        htmlFor={id}
        className={cn('min-w-8 text-center font-mono text-mono-md tabular-nums text-text-primary', disabled && 'opacity-45')}
        aria-live="polite"
      >
        {value}
      </output>

      <button
        type="button"
        className={cn(STEP_BUTTON, box)}
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label={`Aumenta ${label.toLowerCase()}`}
      >
        <svg className="h-4 w-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export default QuantityStepper
