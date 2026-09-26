/**
 * <Marquee /> — la banda scorrevole a tutta larghezza.
 *
 * QUANDO USARLO: una volta per pagina, subito sotto l'hero, per portare le
 * prove oggettive del prodotto.
 * QUANDO NO: per contenuti che l'utente deve leggere davvero. Il testo che
 * scorre non si legge, si percepisce.
 *
 * ─── ACCESSIBILITA ───────────────────────────────────────────────────────
 * Il testo visibile e' duplicato per riempire il ciclo, quindi e' marcato
 * aria-hidden. La versione per gli screen reader e' un elenco statico in
 * .sr-only: viene letto una volta sola, senza scorrimento.
 *
 * Con `prefers-reduced-motion: reduce` l'animazione si ferma e la banda
 * diventa una riga fissa che va a capo.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { MARQUEE_ITEMS } from '../lib/copy'

export interface MarqueeProps {
  items?: readonly string[]
  tone?: 'brand' | 'forest' | 'ink' | 'honey'
  /** Il separatore tra una voce e l'altra. */
  separator?: string
  /** Ferma lo scorrimento quando il puntatore entra nella banda. */
  pauseOnHover?: boolean
  className?: string
}

const TONES = {
  brand: 'bg-bg-brand text-text-on-brand',
  forest: 'bg-bg-forest text-neutral-0',
  ink: 'bg-bg-inverse text-text-inverse',
  honey: 'bg-miele-300 text-neutral-900',
} as const

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export function Marquee({
  items = MARQUEE_ITEMS,
  tone = 'brand',
  separator = '·',
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const reduced = usePrefersReducedMotion()

  const strip = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap type-mono-md">
          {item}
          <span aria-hidden="true" className="opacity-50">{separator}</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className={cn('w-full overflow-hidden py-4', TONES[tone], className)}>
      {/* Elenco statico: e' questo che sentono gli screen reader. */}
      <ul className="sr-only">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      {reduced ? (
        <div aria-hidden="true" className="mx-auto flex max-w-container flex-wrap justify-center gap-x-8 gap-y-2 px-6">
          {items.map((item, i) => (
            <span key={i} className="type-mono-md">{item}</span>
          ))}
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={cn('flex w-max animate-marquee', pauseOnHover && 'hover:[animation-play-state:paused]')}
        >
          {strip}
          {/* Il duplicato serve al loop: l'animazione trasla del 50%. */}
          {strip}
        </div>
      )}
    </div>
  )
}

export default Marquee
