/**
 * <ProductCard /> — il prodotto in una griglia.
 *
 * QUANDO USARLO: catalogo, cross-sell, blocchi "completa l'ordine".
 * QUANDO NO: come unica presentazione del prodotto principale. Il prodotto di
 * punta merita una pagina, non una card.
 *
 * Il prezzo per giorno e' obbligatorio ed e' in mono: e' il numero che rende
 * confrontabile uno stick con un barattolo. Il gusto arriva da FLAVORS e
 * decide il colore del riquadro visivo.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { flavorById, flavorLabel, formatEur, pricePerDay, type FlavorId } from '../lib/copy'
import { StickPack } from './StickPack'

export interface ProductCardProps {
  name: string
  flavor: FlavorId
  /** Formato in chiaro: "30 stick monodose". */
  format: string
  priceEur: number
  /** Giorni di prodotto: serve a calcolare il prezzo per giorno. */
  days: number
  /** Il visivo. Se omesso, lo stick del gusto. */
  visual?: ReactNode
  badge?: ReactNode
  href?: string
  onAddToCart?: () => void
  cta?: string
  soldOut?: boolean
  className?: string
}

export function ProductCard({
  name, flavor, format, priceEur, days, visual, badge, href,
  onAddToCart, cta = 'Aggiungi', soldOut = false, className,
}: ProductCardProps) {
  const f = flavorById(flavor)

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface',
        'transition-shadow duration-base ease-standard hover:shadow-md',
        soldOut && 'opacity-60',
        className,
      )}
    >
      <div className={cn('relative flex items-center justify-center p-8', f.colorToken)}>
        {badge && <div className="absolute left-4 top-4">{badge}</div>}
        {visual ?? <StickPack flavor={flavor} height={180} />}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="text-heading-lg text-text-primary">
          {href ? (
            <a href={href} className="transition-colors duration-fast hover:text-text-brand">{name}</a>
          ) : (
            name
          )}
        </h3>
        <p className="type-flavor-sm text-text-primary">{flavorLabel(f)}</p>
        <p className="text-body-sm text-text-muted">{format}</p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-3">
          <span className="font-mono text-heading-lg tabular-nums text-text-primary">{pricePerDay(priceEur, days)}</span>
          <span className="text-body-sm text-text-muted">al giorno · <span className="font-mono">{formatEur(priceEur)}</span></span>
        </div>

        {onAddToCart && (
          <button
            type="button"
            onClick={onAddToCart}
            disabled={soldOut}
            className={cn(
              'mt-3 h-control-md rounded-full bg-bg-brand px-6 text-body-md font-medium text-text-on-brand',
              'transition-colors duration-base ease-standard hover:bg-bg-brand-hover',
              'disabled:cursor-not-allowed disabled:opacity-45',
            )}
          >
            {soldOut ? 'Esaurito' : cta}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
