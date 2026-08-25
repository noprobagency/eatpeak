/**
 * <ProductCard /> — il prodotto in una griglia.
 *
 * QUANDO USARLO: catalogo, cross-sell, blocchi "completa l'ordine".
 * QUANDO NO: come unica presentazione del prodotto principale. Il prodotto di
 * punta merita una pagina, non una card.
 *
 * Il prezzo per giorno e' obbligatorio ed e' in mono: e' il numero che rende
 * confrontabile uno stickpack con un barattolo.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { formatEur, pricePerDay } from '../lib/copy'

export interface ProductCardProps {
  name: string
  /** Formato in chiaro: "30 stickpack monodose". */
  format: string
  priceEur: number
  /** Giorni di prodotto: serve a calcolare il prezzo per giorno. */
  days: number
  /** Il visivo. In genere <StickPack /> o un <img>. */
  visual?: ReactNode
  badge?: ReactNode
  href?: string
  onAddToCart?: () => void
  cta?: string
  soldOut?: boolean
  className?: string
}

export function ProductCard({
  name, format, priceEur, days, visual, badge, href,
  onAddToCart, cta = 'Aggiungi', soldOut = false, className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface',
        'transition-shadow duration-base ease-standard hover:shadow-md',
        soldOut && 'opacity-60',
        className,
      )}
    >
      <div className="relative flex items-center justify-center bg-bg-warm p-8">
        {badge && <div className="absolute left-4 top-4">{badge}</div>}
        {visual}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-heading-lg text-text-primary">
          {href ? (
            <a href={href} className="transition-colors duration-fast hover:text-text-brand">
              {name}
            </a>
          ) : (
            name
          )}
        </h3>

        <p className="font-mono text-mono-md uppercase text-text-muted">{format}</p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-3">
          <span className="text-heading-lg text-text-primary">{formatEur(priceEur)}</span>
          <span className="font-mono text-mono-md text-text-secondary">
            {pricePerDay(priceEur, days)} al giorno
          </span>
        </div>

        {onAddToCart && (
          <button
            type="button"
            onClick={onAddToCart}
            disabled={soldOut}
            className={cn(
              'mt-3 h-11 rounded-full bg-bg-brand px-6 text-body-md font-medium text-text-on-brand',
              'transition-colors duration-base ease-standard hover:bg-terracotta-500',
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
