/**
 * <StockCounter /> — "Ogni punto è una busta".
 *
 * Il lotto 01 e' numerato: 500 buste per gusto, una griglia di 500 punti.
 * Quando una busta ha gia' un nome, il suo punto diventa chiaro. La scarsita'
 * e' vera, quindi si mostra; i numeri sono di esempio finche' non c'e'
 * l'ordine vero, e il tag lo dice.
 *
 * QUANDO USARLO: home (offerta), PDP, waitlist.
 * QUANDO NO: con numeri inventati senza il tag "esempio".
 */

import { LabTag } from './LabTag'
import { FLAVORS, PRODUCT, type Flavor } from '../lib/copy'
import { cn } from '../lib/cn'

export interface StockCounterProps {
  /** Buste gia' vendute per gusto. Di esempio finche' non c'e' l'ordine. */
  sold?: Partial<Record<Flavor['id'], number>>
  /** Il numero e' un esempio: mostra il tag. */
  example?: boolean
  /** Su un campo colore i punti diventano bianchi. */
  onColor?: boolean
  className?: string
}

const COLS = 25

export function StockCounter({ sold = { arancia: 388, lime: 421 }, example = true, onColor = false, className }: StockCounterProps) {
  const perFlavor = PRODUCT.launchLotSize
  return (
    <div className={cn('flex flex-col gap-6', className)} data-ref="canvas:stock">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className={cn('text-heading-md', onColor ? 'text-neutral-0' : 'text-text-primary')}>
          Ogni punto è una busta. Lotto <span className="font-mono">{PRODUCT.launchLot}</span>, <span className="font-mono">{perFlavor * FLAVORS.length}</span> buste numerate.
        </p>
        {example && <LabTag what="stock">esempio</LabTag>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {FLAVORS.map((f) => {
          const taken = Math.min(perFlavor, sold[f.id] ?? 0)
          const left = perFlavor - taken
          return (
            <div key={f.id} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="type-flavor-sm">{f.number} {f.name}</span>
                <span className={cn('text-body-sm', onColor ? 'text-neutral-0/85' : 'text-text-secondary')}>
                  <span className="font-mono">{left}</span> su <span className="font-mono">{perFlavor}</span> ancora senza nome
                </span>
              </div>
              <svg
                viewBox={`0 0 ${COLS * 10} ${Math.ceil(perFlavor / COLS) * 10}`}
                className="block h-auto w-full"
                role="img"
                aria-label={`${f.name}: ${taken} buste vendute su ${perFlavor}`}
              >
                {Array.from({ length: perFlavor }, (_, i) => {
                  const cx = (i % COLS) * 10 + 5
                  const cy = Math.floor(i / COLS) * 10 + 5
                  const takenDot = i < taken
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={3.2}
                      fill={onColor ? '#FFFFFF' : f.hex}
                      opacity={takenDot ? (onColor ? 0.3 : 0.22) : 1}
                    />
                  )
                })}
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StockCounter
