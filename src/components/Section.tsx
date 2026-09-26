/**
 * <Section /> — una banda orizzontale di pagina.
 *
 * QUANDO USARLO: come contenitore di primo livello di ogni blocco di una
 * pagina. La prop `tone` imposta il fondo e, con esso, i colori di testo
 * corretti: e' il punto in cui il sistema garantisce il contrasto.
 * QUANDO NO: per raggruppare elementi dentro un blocco. Li' basta <Stack />.
 *
 * 3.1: il colore brand e' l'ambra. `brand` (ambra 400) e' il campo pieno e ci
 * si scrive solo in cacao 900 (7,4:1); `brand-soft` e `brand-tint` (ambra 50 e
 * 100) sono i fondi morbidi. Le superfici scure restano colore, mai nere:
 * `brand-deep` (ambra 700) e `lime-deep` (lime 700) reggono il testo bianco.
 * `arancia` e `lime` (i 500) sono i colori-gusto del pack: solo logo, titoli e
 * numeri grandi, e solo dove si parla di quel gusto.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type SectionTone =
  | 'page' | 'surface' | 'warm'
  | 'brand' | 'brand-soft' | 'brand-tint'
  | 'arancia' | 'lime' | 'arancia-tint' | 'lime-tint'
  | 'brand-deep' | 'lime-deep'

export interface SectionProps {
  children: ReactNode
  tone?: SectionTone
  /** Densita' verticale. `flush` toglie il padding, per le bande. */
  spacing?: 'flush' | 'tight' | 'default' | 'loose'
  id?: string
  className?: string
  /** L'etichetta del reference, per `?ref=1`. Es. "create:hero". */
  dataRef?: string
}

const TONES: Record<SectionTone, string> = {
  page: 'bg-bg-page text-text-primary',
  surface: 'bg-bg-surface text-text-primary',
  warm: 'bg-bg-warm text-text-primary',
  brand: 'bg-bg-brand text-text-on-brand',
  'brand-soft': 'bg-bg-brand-soft text-text-primary',
  'brand-tint': 'bg-bg-brand-tint text-text-primary',
  arancia: 'bg-bg-flavor-arancia text-text-on-flavor',
  lime: 'bg-bg-flavor-lime text-text-on-flavor',
  'arancia-tint': 'bg-bg-flavor-arancia-tint text-text-on-flavor-small',
  'lime-tint': 'bg-bg-flavor-lime-tint text-text-on-flavor-small',
  'brand-deep': 'bg-bg-brand-deep text-text-on-brand-deep',
  'lime-deep': 'bg-bg-lime-deep text-text-inverse',
}

const SPACING = {
  flush: '',
  tight: 'py-12 md:py-16',
  default: 'py-20 md:py-section',
  loose: 'py-24 md:py-32',
} as const

export function Section({ children, tone = 'page', spacing = 'default', id, className, dataRef }: SectionProps) {
  return (
    <section id={id} className={cn('relative', TONES[tone], SPACING[spacing], className)} data-tone={tone} data-ref={dataRef}>
      {children}
    </section>
  )
}

export default Section
