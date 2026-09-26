/**
 * Archetipo A · Campo colore.
 *
 * Fondo arancia o lime a tutta larghezza, con la grana, testo bianco, e gli
 * oggetti — pack, frutta — che escono dai bordi della sezione. E' l'hero, i
 * gusti, il footer, e al massimo una banda a meta' pagina.
 *
 * `tone`: i 500 (arancia, lime) reggono solo logo, titoli e numeri grandi;
 * i deep (arancia 600, lime 700) reggono anche il testo corrente bianco.
 * `bleed` sono gli elementi che sbordano: stanno fuori dal flusso, con
 * `overflow: visible`, e la sezione dopo li lascia passare.
 */

import type { ReactNode } from 'react'
import { Grain } from '../../brand'
import { Container } from '../../components'
import { cn } from '../../lib/cn'

export interface ColorFieldProps {
  children: ReactNode
  tone?: 'arancia' | 'lime' | 'brand-deep' | 'lime-deep'
  /** Elementi che escono dai bordi: posizionati in assoluto dentro la sezione. */
  bleed?: ReactNode
  grain?: boolean
  spacing?: 'tight' | 'default' | 'loose' | 'flush'
  width?: 'default' | 'wide' | 'narrow'
  id?: string
  dataRef?: string
  className?: string
}

const TONES = {
  arancia: 'bg-bg-flavor-arancia text-text-on-flavor',
  lime: 'bg-bg-flavor-lime text-text-on-flavor',
  'brand-deep': 'bg-bg-brand-deep text-text-inverse',
  'lime-deep': 'bg-bg-lime-deep text-text-inverse',
} as const

const SPACING = {
  flush: '',
  tight: 'py-16 md:py-20',
  default: 'py-20 md:py-section',
  loose: 'py-24 md:py-32',
} as const

export function ColorField({
  children, tone = 'arancia', bleed, grain = true, spacing = 'default', width = 'default', id, dataRef, className,
}: ColorFieldProps) {
  return (
    <section
      id={id}
      data-ref={dataRef}
      data-archetype="A"
      data-tone={tone}
      className={cn('relative', TONES[tone], SPACING[spacing], className)}
      style={{ overflow: 'visible' }}
    >
      {grain && <Grain />}
      <div className="relative z-10">
        <Container width={width}>{children}</Container>
      </div>
      {bleed && <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">{bleed}</div>}
    </section>
  )
}

export default ColorField
