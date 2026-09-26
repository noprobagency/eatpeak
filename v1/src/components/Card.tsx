/**
 * <Card /> — un blocco che raccoglie contenuto correlato.
 *
 * QUANDO USARLO: quando un gruppo di elementi va letto come una cosa sola.
 * QUANDO NO: per dare solo un fondo a una sezione. Se non c'e' un confine
 * concettuale, la card e' una scatola vuota: usa <Section tone="..." />.
 *
 * Raggio lg o xl, mai spigoli vivi. Ombre minime: il brand e' piatto.
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface CardProps {
  children: ReactNode
  tone?: 'surface' | 'raised' | 'warm' | 'brand' | 'forest'
  radius?: 'lg' | 'xl'
  elevation?: 'none' | 'sm' | 'md'
  bordered?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Alza la card all'hover. Usalo solo se la card e' davvero cliccabile. */
  interactive?: boolean
  as?: ElementType
  className?: string
}

const TONES = {
  surface: 'bg-bg-surface text-text-primary',
  raised: 'bg-bg-raised text-text-primary',
  warm: 'bg-bg-warm text-text-primary',
  brand: 'bg-bg-brand text-text-on-brand',
  forest: 'bg-bg-forest text-text-inverse',
} as const

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
        bordered && (tone === 'brand' || tone === 'forest' ? 'border border-white/15' : 'border border-border-subtle'),
        interactive && 'cursor-pointer transition-shadow duration-base ease-standard hover:shadow-md',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export default Card
