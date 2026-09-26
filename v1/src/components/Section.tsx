/**
 * <Section /> — una banda orizzontale di pagina.
 *
 * QUANDO USARLO: come contenitore di primo livello di ogni blocco di una
 * pagina. La prop `tone` imposta il fondo e, con esso, i colori di testo
 * corretti: e' il punto in cui il sistema garantisce il contrasto.
 * QUANDO NO: per raggruppare elementi dentro un blocco. Li' basta <Stack />.
 *
 * Due sezioni con lo stesso `tone` non vanno mai messe una sotto l'altra senza
 * un <Divider />: il confine sparisce.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type SectionTone = 'page' | 'surface' | 'warm' | 'brand' | 'forest' | 'inverse'

export interface SectionProps {
  children: ReactNode
  tone?: SectionTone
  /** Densita' verticale. `flush` toglie il padding, per le bande. */
  spacing?: 'flush' | 'tight' | 'default' | 'loose'
  id?: string
  className?: string
}

/**
 * Ogni tono porta con se' il colore di testo che ci si legge sopra.
 * Su terracotta il testo e' neutral-0, mai miele: e' una regola di contrasto,
 * non una scelta.
 */
const TONES: Record<SectionTone, string> = {
  page: 'bg-bg-page text-text-primary',
  surface: 'bg-bg-surface text-text-primary',
  warm: 'bg-bg-warm text-text-primary',
  brand: 'bg-bg-brand text-text-on-brand',
  forest: 'bg-bg-forest text-text-inverse',
  inverse: 'bg-bg-inverse text-text-inverse',
}

const SPACING = {
  flush: '',
  tight: 'py-12 md:py-16',
  default: 'py-16 md:py-24',
  loose: 'py-24 md:py-32',
} as const

export function Section({ children, tone = 'page', spacing = 'default', id, className }: SectionProps) {
  return (
    <section id={id} className={cn(TONES[tone], SPACING[spacing], className)} data-tone={tone}>
      {children}
    </section>
  )
}

export default Section
