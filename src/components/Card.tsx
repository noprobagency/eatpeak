/**
 * <Card /> — un blocco che raccoglie contenuto correlato.
 *
 * QUANDO USARLO: quando un gruppo di elementi va letto come una cosa sola.
 * QUANDO NO: per dare solo un fondo a una sezione. Se non c'e' un confine
 * concettuale, la card e' una scatola vuota: usa <Section tone="..." />.
 *
 * Raggio lg o xl, mai spigoli vivi. Ombre minime: il brand e' piatto.
 * Sui toni colore-gusto pieni il testo di default e' inchiostro; il bianco lo
 * si usa a mano solo per titoli e numeri grandi.
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type CardTone =
  | 'surface' | 'raised' | 'warm' | 'inverse'
  | 'arancia' | 'lime' | 'arancia-tint' | 'lime-tint'

export interface CardProps {
  children: ReactNode
  tone?: CardTone
  radius?: 'lg' | 'xl'
  elevation?: 'none' | 'sm' | 'md'
  bordered?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Alza la card all'hover. Usalo solo se la card e' davvero cliccabile. */
  interactive?: boolean
  as?: ElementType
  className?: string
}

const TONES: Record<CardTone, string> = {
  surface: 'bg-bg-surface text-text-primary',
  raised: 'bg-bg-raised text-text-primary',
  warm: 'bg-bg-warm text-text-primary',
  inverse: 'bg-bg-inverse text-text-inverse',
  arancia: 'bg-bg-flavor-arancia text-text-on-flavor-small',
  lime: 'bg-bg-flavor-lime text-text-on-flavor-small',
  'arancia-tint': 'bg-bg-flavor-arancia-tint text-text-on-flavor-small',
  'lime-tint': 'bg-bg-flavor-lime-tint text-text-on-flavor-small',
}

const FLAT_TONES: readonly CardTone[] = ['arancia', 'lime', 'inverse']

const PADDING = { none: '', sm: 'p-5', md: 'p-6 md:p-8', lg: 'p-8 md:p-12' } as const
const ELEVATION = { none: '', sm: 'shadow-sm', md: 'shadow-md' } as const

export function Card({
  children, tone = 'surface', radius = 'lg', elevation = 'none',
  bordered = true, padding = 'md', interactive = false, as: Tag = 'div', className,
}: CardProps) {
  return (
    <Tag
      className={cn(
        'overflow-hidden',
        radius === 'lg' ? 'rounded-lg' : 'rounded-xl',
        TONES[tone],
        PADDING[padding],
        ELEVATION[elevation],
        bordered && (FLAT_TONES.includes(tone) ? 'border border-white/15' : 'border border-border-subtle'),
        interactive && 'cursor-pointer transition-shadow duration-base ease-standard hover:shadow-md',
        className,
      )}
      data-tone={tone}
    >
      {children}
    </Tag>
  )
}

export default Card
