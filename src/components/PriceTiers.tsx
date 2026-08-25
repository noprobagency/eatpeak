/**
 * <PriceTiers /> — il selettore delle confezioni.
 *
 * QUANDO USARLO: pagina prodotto e landing, come unico punto in cui si sceglie
 * quanto comprare.
 * QUANDO NO: insieme a un <QuantityStepper /> per lo stesso prodotto. Due
 * comandi che fanno la stessa cosa fanno perdere l'acquisto.
 *
 * Il risparmio e' calcolato sul prezzo unitario del primo livello, non
 * dichiarato a mano: cosi' non puo' mentire. La soglia di spedizione gratuita
 * parte da due pezzi ed e' segnalata sul livello, non in una nota a fondo
 * pagina.
 *
 * Tutti i numeri passano dal mono.
 */

import { cn } from '../lib/cn'
import { PRICE_TIERS, PRODUCT, formatEur, pricePerDay } from '../lib/copy'

export interface PriceTier {
  units: number
  label: string
  days: number
  priceEur: number
  badge?: string | null
}

export interface PriceTiersProps {
  tiers?: readonly PriceTier[]
  value: number
  onChange: (units: number) => void
  /** Numero di pezzi da cui la spedizione e' gratuita. */
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
      <legend className="mb-3 text-heading-sm text-text-primary">Quante confezioni</legend>

      <div className="flex flex-col gap-3">
        {tiers.map((tier) => {
          const selected = tier.units === value
          const unitPrice = tier.priceEur / tier.units
          const savedPct = referenceUnitPrice > 0
            ? Math.round(((referenceUnitPrice - unitPrice) / referenceUnitPrice) * 100)
            : 0
          const freeShipping = tier.units >= freeShippingFrom
          const inputId = `tier-${tier.units}`

          // Il badge e le etichette inline possono dire la stessa cosa: si
          // tiene il badge, che e' piu' visibile, e si toglie il doppione.
          const badgeText = tier.badge?.toLowerCase() ?? ''
          const showFreeShipping = freeShipping && !badgeText.includes('spedizione')

          return (
            <label
              key={tier.units}
              htmlFor={inputId}
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-lg border p-5',
                'transition-colors duration-base ease-standard',
                selected
                  ? 'border-border-brand bg-bg-brand-soft'
                  : 'border-border-default bg-bg-surface hover:border-border-strong',
              )}
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
                  'flex h-5 w-5 shrink-0 rounded-full border transition-colors duration-fast',
                  selected ? 'border-[6px] border-bg-brand' : 'border-border-strong bg-bg-surface',
                )}
              />

              <span className="flex min-w-0 flex-1 flex-col gap-1">
                {tier.badge && (
                  <span className="mb-1 w-fit rounded-full bg-bg-brand px-3 py-0.5 font-mono text-mono-sm uppercase text-text-on-brand">
                    {tier.badge}
                  </span>
                )}

                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-heading-md text-text-primary">{tier.label}</span>
                  <span className="font-mono text-mono-md uppercase text-text-muted">{tier.days} giorni</span>
                </span>

                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-mono-md text-text-secondary">
                    {pricePerDay(tier.priceEur, tier.days)} al giorno
                  </span>
                  {savedPct > 0 && (
                    <span className="font-mono text-mono-sm uppercase text-bosco-600">risparmi {savedPct}%</span>
                  )}
                  {showFreeShipping && (
                    <span className="font-mono text-mono-sm uppercase text-bosco-600">spedizione gratuita</span>
                  )}
                </span>
              </span>

              <span className="shrink-0 text-heading-lg text-text-primary">{formatEur(tier.priceEur)}</span>

            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default PriceTiers
