/**
 * Archetipo E · Righe.
 *
 * Liste numerate a riga intera — 01, 02, 03 — con divisori sottili e niente
 * card. La numerazione e' un pallino a mano con il numero dentro. Sono gli
 * ingredienti, i passi, la garanzia, le FAQ.
 */

import type { ReactNode } from 'react'
import { HandDot } from '../../brand'
import { cn } from '../../lib/cn'

export interface RowItem {
  title: ReactNode
  body?: ReactNode
  /** La colonna di destra: la dose, il numero, il claim. */
  aside?: ReactNode
  /** Il pallino della numerazione: `scribble` per il passo fatto. */
  dot?: 'ring' | 'solid' | 'scribble'
}

export interface RowsProps {
  items: readonly RowItem[]
  /** Numerazione da 1: "01, 02, 03". */
  numbered?: boolean
  /** Su un campo scuro il testo e' bianco. */
  deep?: boolean
  className?: string
}

export function Rows({ items, numbered = true, deep = false, className }: RowsProps) {
  return (
    <ol className={cn('m-0 list-none divide-y p-0', deep ? 'divide-white/20' : 'divide-border-subtle', className)} data-archetype="E">
      {items.map((item, i) => (
        <li key={i} className="grid gap-4 py-8 md:grid-cols-[72px_1fr_auto] md:items-start md:gap-8">
          {numbered ? (
            <div className="relative flex h-12 w-12 items-center justify-center">
              <HandDot seed={`row-${i}`} size={48} fill={item.dot ?? 'ring'} className={cn('absolute inset-0', deep ? 'text-neutral-0' : 'text-arancia-500')} />
              <span className={cn('relative font-mono text-body-sm font-medium', item.dot === 'solid' || item.dot === 'scribble' ? 'text-neutral-0' : deep ? 'text-neutral-0' : 'text-text-primary')}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ) : (
            <div />
          )}
          <div className="flex flex-col gap-2">
            <h3 className={cn('type-display-sm', deep ? 'text-neutral-0' : 'text-text-primary')}>{item.title}</h3>
            {item.body && <div className={cn('max-w-prose text-body-md', deep ? 'text-neutral-0/85' : 'text-text-secondary')}>{item.body}</div>}
          </div>
          {item.aside && <div className={cn('md:text-right', deep ? 'text-neutral-0' : 'text-text-primary')}>{item.aside}</div>}
        </li>
      ))}
    </ol>
  )
}

export default Rows
