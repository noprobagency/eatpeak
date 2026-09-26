/**
 * <Divider /> — una riga di separazione.
 *
 * QUANDO USARLO: tra due sezioni dello stesso tono, dentro liste lunghe.
 * QUANDO NO: come decorazione. Se separa qualcosa e' semantico, altrimenti e'
 * rumore: togli il divider e aumenta lo spazio.
 */

import { cn } from '../lib/cn'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  tone?: 'subtle' | 'default' | 'strong'
  className?: string
}

const TONES = {
  subtle: 'border-border-subtle',
  default: 'border-border-default',
  strong: 'border-border-strong',
} as const

export function Divider({ orientation = 'horizontal', tone = 'default', className }: DividerProps) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn(
        'm-0 border-0',
        orientation === 'horizontal' ? 'w-full border-t' : 'h-full self-stretch border-l',
        TONES[tone],
        className,
      )}
    />
  )
}

export default Divider
