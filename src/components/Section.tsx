/**
 * <Section /> — una banda orizzontale di pagina.
 *
 * QUANDO USARLO: come contenitore di primo livello di ogni blocco di una
 * pagina. La prop `tone` imposta il fondo e, con esso, i colori di testo
 * corretti: e' il punto in cui il sistema garantisce il contrasto.
 * QUANDO NO: per raggruppare elementi dentro un blocco. Li' basta <Stack />.
 *
 * Un solo colore-gusto per composizione: due sezioni arancia e lime una sotto
 * l'altra sono il Duo, non una pagina.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type SectionTone =
  | 'page' | 'surface' | 'warm' | 'inverse'
  | 'arancia' | 'lime' | 'arancia-tint' | 'lime-tint'

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
 * Sui campi colore-gusto il testo corrente e' inchiostro: il bianco e' per il
 * logo e per i titoli, e va scelto a mano con `text-text-on-flavor`.
 */
const TONES: Record<SectionTone, string> = {
  page: 'bg-bg-page text-text-primary',
  surface: 'bg-bg-surface text-text-primary',
  warm: 'bg-bg-warm text-text-primary',
  inverse: 'bg-bg-inverse text-text-inverse',
  arancia: 'bg-bg-flavor-arancia text-text-on-flavor-small',
  lime: 'bg-bg-flavor-lime text-text-on-flavor-small',
  'arancia-tint': 'bg-bg-flavor-arancia-tint text-text-on-flavor-small',
  'lime-tint': 'bg-bg-flavor-lime-tint text-text-on-flavor-small',
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
