/**
 * <RadioGroup /> — una scelta fra poche alternative.
 *
 * QUANDO USARLO: sotto le cinque opzioni, quando vuoi che si vedano tutte.
 * QUANDO NO: per il numero di confezioni. Li' serve <PriceTiers />, che mostra
 * anche il risparmio e la soglia di spedizione.
 *
 * Il gruppo e' un <fieldset> con <legend>: e' cosi' che uno screen reader
 * capisce che le opzioni appartengono alla stessa domanda.
 */

import { useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface RadioOption {
  value: string
  label: ReactNode
  hint?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  legend: string
  name: string
  options: readonly RadioOption[]
  value?: string
  onChange?: (value: string) => void
  hideLegend?: boolean
  error?: string
  className?: string
}

export function RadioGroup({
  legend, name, options, value, onChange, hideLegend = false, error, className,
}: RadioGroupProps) {
  const groupId = useId()

  return (
    <fieldset className={cn('m-0 border-0 p-0', className)}>
      <legend className={cn('mb-3 text-heading-sm text-text-primary', hideLegend && 'sr-only')}>{legend}</legend>

      <div className="flex flex-col gap-3">
        {options.map((o) => {
          const id = `${groupId}-${o.value}`
          return (
            <div key={o.value} className="flex items-start gap-3">
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={value === o.value}
                  disabled={o.disabled}
                  onChange={() => onChange?.(o.value)}
                  className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none flex h-5 w-5 items-center justify-center rounded-full border',
                    'border-border-strong bg-bg-surface transition-colors duration-fast ease-standard',
                    'peer-hover:border-border-brand',
                    'peer-checked:border-bg-brand peer-checked:border-[6px]',
                    'peer-disabled:opacity-45',
                    error && 'border-error',
                  )}
                />
              </span>

              <label htmlFor={id} className={cn('flex flex-col gap-1', o.disabled ? 'opacity-45' : 'cursor-pointer')}>
                <span className="text-body-md text-text-primary">{o.label}</span>
                {o.hint && <span className="text-body-sm text-text-secondary">{o.hint}</span>}
              </label>
            </div>
          )
        })}
      </div>

      {error && <p role="alert" className="mt-2 text-body-sm text-error">{error}</p>}
    </fieldset>
  )
}

export default RadioGroup
