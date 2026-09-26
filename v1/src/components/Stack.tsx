/**
 * <Stack /> — impilamento con spaziatura dai token.
 *
 * QUANDO USARLO: ogni volta che stai per scrivere `margin-bottom` su una serie
 * di elementi. Lo spazio appartiene al contenitore, non ai figli.
 * QUANDO NO: per layout a due dimensioni. Quello e' <Grid />.
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { SpaceToken } from '../tokens/tokens'

export interface StackProps {
  children: ReactNode
  direction?: 'vertical' | 'horizontal'
  gap?: SpaceToken
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
  as?: ElementType
  className?: string
}

const ALIGN = {
  start: 'items-start', center: 'items-center', end: 'items-end',
  stretch: 'items-stretch', baseline: 'items-baseline',
} as const

const JUSTIFY = {
  start: 'justify-start', center: 'justify-center',
  end: 'justify-end', between: 'justify-between',
} as const

export function Stack({
  children,
  direction = 'vertical',
  gap = '4',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  as: Tag = 'div',
  className,
}: StackProps) {
  return (
    <Tag
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        ALIGN[align],
        JUSTIFY[justify],
        wrap && 'flex-wrap',
        className,
      )}
      style={{ gap: `var(--space-${gap})` }}
    >
      {children}
    </Tag>
  )
}

export default Stack
