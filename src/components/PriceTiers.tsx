/**
 * <PriceTiers /> — il selettore delle confezioni.
 *
 * QUANDO USARLO: pagina prodotto e home, come unico punto in cui si sceglie
 * quanto comprare.
 * QUANDO NO: insieme a un <QuantityStepper /> per lo stesso prodotto. Due
 * comandi che fanno la stessa cosa fanno perdere l'acquisto.
 *
 * Il prezzo al giorno sta in grande, in mono; il totale in piccolo. Il
 * risparmio e' calcolato sul prezzo unitario del primo livello, non
 * dichiarato a mano: cosi' non puo' mentire. Il livello con `preselected`
 * parte selezionato; il primo, che non ha la spedizione gratuita, mostra anche
 * il costo al giorno con la spedizione dentro.
 *
 * Tutti i numeri passano dal mono.
 */

import { cn } from '../lib/cn'
import { PRICE_TIERS, PRODUCT, formatEur, pricePerDay, pricePerDayShipped, type PriceTier } from '../lib/copy'

export type { PriceTier }

export interface PriceTiersProps {
  tiers?: readonly PriceTier[]
  /** Le buste del livello selezionato. */
  value: number
  onChange: (units: number) => void
  /** Numero di buste da cui la spedizione e' gratuita. */
  freeShippingFrom?: number
  className?: string
}

export function PriceTiers({
  tiers = PRICE_TIERS,
  value,
  onChange,
  freeShippingFrom = PRODUCT.freeShippingFromUnits,
  className,
}: PriceTiersProps) {
  const reference = tiers[0]
  const referenceUnitPrice = reference ? reference.priceEur / reference.units : 0

  return (
    <fieldset className={cn('m-0 border-0 p-0', className)}>
      <legend className="mb-3 text-heading-sm text-text-primary">Quante buste</legend>

      <div className="flex flex-col gap-3">
        {tiers.map((tier) => {
          const selected = tier.units === value
          const unitPrice = tier.priceEur / tier.units
          const savedPct = referenceUnitPrice > 0
            ? Math.round(((referenceUnitPrice - unitPrice) / referenceUnitPrice) * 100)
            : 0
          const freeShipping = tier.units >= freeShippingFrom || tier.shippingEur === 0
          const inputId = `tier-${tier.id}`

          return (
            <label
              key={tier.id}
              htmlFor={inputId}
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-lg border p-5',
                'transition-colors duration-base ease-standard',
                selected
                  ? 'border-neutral-900 bg-bg-surface shadow-sm'
                  : 'border-border-default bg-bg-surface hover:border-border-strong',
              )}
              data-preselected={tier.preselected || undefined}
            >
              <input
                id={inputId}
                type="radio"
                name="price-tier"
                value={tier.units}
                checked={selected}
                onChange={() => onChange(tier.units)}
                className="peer sr-only"
              />

              <span
                aria-hidden="true"
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 rounded-full border transition-colors duration-fast',
                  selected ? 'border-[6px] border-neutral-900' : 'border-border-strong bg-bg-surface',
                )}
              />

              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-heading-md text-text-primary">{tier.name}</span>
                  {tier.badge && (
                    <span className={cn(
                      'rounded-full px-3 py-1 font-mono text-mono-sm uppercase',
                      tier.preselected ? 'bg-bg-brand text-text-on-brand' : 'bg-lime-50 text-lime-700',
                    )}>
                      {tier.badge}
                    </span>
                  )}
                </span>

                <span className="font-mono text-mono-md uppercase text-text-muted">
                  {tier.units} {tier.units === 1 ? 'busta' : 'buste'} · {tier.days} giorni
                  {savedPct > 0 && <span className="text-lime-700"> · risparmi {savedPct}%</span>}
                </span>

                <span className="flex flex-col gap-1 font-mono text-mono-sm uppercase text-text-secondary">
                  {freeShipping ? (
                    <span>spedizione gratuita</span>
                  ) : (
                    <span>
                      + {formatEur(tier.shippingEur)} di spedizione · {pricePerDayShipped(tier)} al giorno spedizione inclusa
                    </span>
                  )}
                  {tier.extras.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-mono text-heading-lg tabular-nums text-text-primary">
                  {pricePerDay(tier.priceEur, tier.days)}
                </span>
                <span className="font-mono text-mono-sm uppercase text-text-muted">al giorno</span>
                <span className="font-mono text-mono-sm uppercase text-text-secondary">{formatEur(tier.priceEur)} totale</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default PriceTiers
