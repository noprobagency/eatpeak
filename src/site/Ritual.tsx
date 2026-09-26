/**
 * <Ritual /> — il rituale dei 30 punti (H6).
 *
 * Trenta pallini a mano in griglia 10 x 3 che si riempiono allo scroll, uno
 * per volta, solo quando la sezione e' in vista, poi stanno fermi. Con
 * reduced-motion sono gia' pieni. Il contatore di vetro dice "Giorno n di
 * 30". E' il componente narrativo del brand: racconta il gesto e il tempo,
 * mai un effetto.
 */

import { useEffect, useRef, useState } from 'react'
import { HandDot } from '../brand'
import { Glass } from '../components'
import { RITUAL_CAPTIONS } from '../lib/copy'
import { cn } from '../lib/cn'

export interface RitualProps {
  /** Fino a che giorno riempire. Default 12. */
  upTo?: number
  /** Su un campo scuro i punti sono bianchi. */
  onColor?: boolean
  className?: string
}

export function Ritual({ upTo = 12, onColor = true, className }: RitualProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [filled, setFilled] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setFilled(upTo)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [upTo])

  useEffect(() => {
    if (!started || filled >= upTo) return
    const t = setTimeout(() => setFilled((n) => Math.min(upTo, n + 1)), 90)
    return () => clearTimeout(t)
  }, [started, filled, upTo])

  const color = onColor ? 'text-neutral-0' : 'text-dot-done'

  return (
    <div ref={ref} className={cn('flex flex-col gap-8', className)}>
      <div className="grid grid-cols-10 gap-2 sm:gap-3" role="img" aria-label={`Trenta giorni: ${filled} segnati`}>
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1
          const done = day <= filled
          const today = day === filled
          return (
            <div key={day} className="relative flex aspect-square items-center justify-center">
              <HandDot
                seed={`ritual-${day}`}
                size={40}
                fill={done ? (today ? 'scribble' : 'solid') : 'ring'}
                className={cn('h-full w-full transition-opacity duration-base', color, !done && 'opacity-60')}
              />
              {!done && <span className={cn('absolute font-mono text-[11px]', onColor ? 'text-neutral-0/80' : 'text-text-muted')}>{day}</span>}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <Glass tone="light" liquid radius="xl" className="w-fit">
          <p className="type-label text-text-brand">Giorno</p>
          <p className="font-mono text-display-md text-text-primary">
            {filled}
            <span className="text-body-md text-text-muted"> / 30</span>
          </p>
        </Glass>
        <ol className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
          {RITUAL_CAPTIONS.map((c) => (
            <li key={c.day} className={cn('flex items-center gap-2 text-body-sm font-display font-bold', onColor ? 'text-neutral-0' : 'text-text-primary')}>
              <span className="font-mono">{c.day}</span>
              <span className={onColor ? 'text-neutral-0/70' : 'text-text-muted'}>·</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Ritual
