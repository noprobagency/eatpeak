/**
 * <FlavorSelector /> — la scelta del gusto.
 *
 * QUANDO USARLO: nella pagina prodotto, sopra i formati. E' l'unico punto in
 * cui si sceglie il gusto.
 * QUANDO NO: per presentare i gusti. Quello e' <FlavorCard />.
 *
 * Un <fieldset> di radio, come <RadioGroup />: la tastiera e gli screen reader
 * funzionano da soli. Il nome del gusto e' in corsivo Fraunces, il pallino e'
 * il colore-gusto pieno.
 */

import { useId } from 'react'
import { cn } from '../lib/cn'
import { FLAVORS, type Flavor, type FlavorId } from '../lib/copy'

export interface FlavorSelectorProps {
  value: FlavorId
  onChange: (id: FlavorId) => void
  flavors?: readonly Flavor[]
  legend?: string
  className?: string
}

export function FlavorSelector({
  value, onChange, flavors = FLAVORS, legend = 'Il gusto', className,
}: FlavorSelectorProps) {
  const groupId = useId()

  return (
    <fieldset className={cn('m-0 border-0 p-0', className)}>
      <legend className="mb-3 text-heading-sm text-text-primary">{legend}</legend>

      <div className="flex flex-wrap gap-3">
        {flavors.map((f) => {
          const selected = f.id === value
          const id = `${groupId}-${f.id}`
          return (
            <label
              key={f.id}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-full border py-2 pl-2 pr-5',
                'transition-colors duration-base ease-standard',
                selected ? 'border-arancia-600 bg-bg-surface' : 'border-border-default bg-bg-surface hover:border-border-strong',
              )}
            >
              <input
                id={id}
                type="radio"
                name={`${groupId}-flavor`}
                value={f.id}
                checked={selected}
                onChange={() => onChange(f.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn('flex h-control-sm w-control-sm shrink-0 items-center justify-center rounded-full', f.colorToken)}
              >
                {selected && <span className="h-3 w-3 rounded-full bg-neutral-0" />}
              </span>
              <span className="flex flex-col">
                <span className="type-mono-sm text-text-muted">{f.number}</span>
                <span className="type-flavor-sm text-text-primary">{f.name}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default FlavorSelector
