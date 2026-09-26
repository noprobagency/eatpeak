/**
 * <Card /> — un blocco che raccoglie contenuto correlato.
 *
 * QUANDO USARLO: dove gli elementi si confrontano — i formati di prezzo, le
 * recensioni in griglia. E' l'unico caso in cui la card bianca col bordo ha
 * senso.
 * QUANDO NO: per dare un fondo a un blocco di testo. Nella 3.0 tutto il resto
 * e' riga, campo o vetro. Le card morbide (`soft`) sono sul tint, senza bordo,
 * con raggio 2xl.
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type CardTone =
  | 'surface' | 'raised' | 'warm'
  | 'arancia' | 'lime' | 'arancia-tint' | 'lime-tint'
  | 'brand-deep' | 'lime-deep'

export interface CardProps {
  children: ReactNode
  tone?: CardTone
  radius?: 'lg' | 'xl' | '2xl'
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
  arancia: 'bg-bg-flavor-arancia text-text-on-flavor',
  lime: 'bg-bg-flavor-lime text-text-on-flavor',
  'arancia-tint': 'bg-bg-flavor-arancia-tint text-text-on-flavor-small',
  'lime-tint': 'bg-bg-flavor-lime-tint text-text-on-flavor-small',
  'brand-deep': 'bg-bg-brand-deep text-text-inverse',
  'lime-deep': 'bg-bg-lime-deep text-text-inverse',
}

/** Sui toni pieni e sui tint la card e' morbida: niente bordo. */
const BORDERLESS: readonly CardTone[] = ['arancia', 'lime', 'arancia-tint', 'lime-tint', 'brand-deep', 'lime-deep']

const RADIUS = { lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl' } as const
const PADDING = { none: '', sm: 'p-5', md: 'p-6 md:p-8', lg: 'p-8 md:p-12' } as const
const ELEVATION = { none: '', sm: 'shadow-sm', md: 'shadow-md' } as const

export function Card({
  children, tone = 'surface', radius, elevation = 'none',
  bordered, padding = 'md', interactive = false, as: Tag = 'div', className,
}: CardProps) {
  const soft = BORDERLESS.includes(tone)
  const withBorder = bordered ?? !soft
  return (
    <Tag
      className={cn(
        'overflow-hidden',
        RADIUS[radius ?? (soft ? '2xl' : 'lg')],
        TONES[tone],
        PADDING[padding],
        ELEVATION[elevation],
        withBorder && 'border border-border-subtle',
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
