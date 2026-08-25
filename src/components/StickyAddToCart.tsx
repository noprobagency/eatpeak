/**
 * <StickyAddToCart /> — la barra che compare allo scroll.
 *
 * QUANDO USARLO: pagina prodotto su mobile, dove il pulsante d'acquisto esce
 * dallo schermo appena si legge.
 * QUANDO NO: sulla landing. Una barra fissa prima che l'utente sappia cosa sta
 * comprando e' solo un ostacolo.
 *
 * Compare quando l'elemento osservato esce dallo schermo *verso l'alto*, non a
 * una soglia di pixel: cosi' resta corretta a qualunque altezza di viewport.
 *
 * La distinzione fra "sopra" e "sotto" e' il punto. Un elemento non ancora
 * raggiunto e' fuori schermo tanto quanto uno gia' superato, ma solo nel secondo
 * caso la barra serve: nel primo il pulsante vero e' ancora la' che aspetta.
 */

import { useEffect, useRef, useState, type RefObject } from 'react'
import { cn } from '../lib/cn'
import { formatEur } from '../lib/copy'

export interface StickyAddToCartProps {
  name: string
  priceEur: number
  /** Riga in mono sotto il nome: formato, quantita', prezzo al giorno. */
  detail?: string
  onAddToCart: () => void
  cta?: string
  /**
   * L'elemento da osservare: in genere il pulsante d'acquisto principale.
   * La barra compare quando questo esce dallo schermo.
   */
  watch?: RefObject<HTMLElement>
  disabled?: boolean
  className?: string
}

export function StickyAddToCart({
  name, priceEur, detail, onAddToCart, cta = 'Aggiungi al carrello',
  watch, disabled = false, className,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(!watch)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = watch?.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fuori schermo E sopra il viewport: l'utente l'ha superato.
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0
        setVisible(scrolledPast)
      },
      { threshold: 0 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [watch])

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-bg-surface/95 backdrop-blur',
        'transition-transform duration-base ease-standard',
        visible ? 'translate-y-0' : 'translate-y-full',
        className,
      )}
    >
      <div className="mx-auto flex max-w-container items-center gap-4 px-6 py-3 md:px-[28px]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-heading-sm text-text-primary">{name}</p>
          {detail && <p className="truncate font-mono text-mono-sm uppercase text-text-muted">{detail}</p>}
        </div>

        <span className="shrink-0 text-heading-md text-text-primary">{formatEur(priceEur)}</span>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={disabled || !visible}
          tabIndex={visible ? 0 : -1}
          className={cn(
            'h-11 shrink-0 rounded-full bg-bg-brand px-6 text-body-md font-medium text-text-on-brand',
            'transition-colors duration-base ease-standard hover:bg-terracotta-500',
            'disabled:cursor-not-allowed disabled:opacity-45',
          )}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

export default StickyAddToCart
