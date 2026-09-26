/**
 * <Accordion /> — contenuto che si apre.
 *
 * QUANDO USARLO: FAQ, dettagli tecnici, tutto cio' che serve a chi lo cerca e
 * ingombra chi non lo cerca.
 * QUANDO NO: per nascondere informazioni che servono a decidere. Se il prezzo o
 * il dosaggio stanno dentro un accordion, li stai nascondendo, non ordinando.
 *
 * Costruito su <details>/<summary>: apre e chiude senza JavaScript, e la
 * tastiera funziona da sola.
 */

import { useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { DayDot } from '../brand'

export interface AccordionItem {
  id?: string
  title: ReactNode
  content: ReactNode
}

export interface AccordionProps {
  items: readonly AccordionItem[]
  /** Se true, aprire un pannello chiude gli altri. */
  single?: boolean
  /** Indice del pannello aperto all'inizio. */
  defaultOpen?: number
  className?: string
}

export function Accordion({ items, single = false, defaultOpen, className }: AccordionProps) {
  const groupName = useId()

  return (
    <div className={cn('divide-y divide-border-subtle border-y border-border-subtle', className)}>
      {items.map((item, i) => (
        <details
          key={item.id ?? i}
          name={single ? groupName : undefined}
          open={defaultOpen === i || undefined}
          className="group"
        >
          <summary
            className={cn(
              'flex cursor-pointer list-none items-center justify-between gap-6 py-5',
              'text-heading-md text-text-primary transition-colors duration-fast ease-standard',
              'hover:text-text-brand [&::-webkit-details-marker]:hidden',
            )}
          >
            <span>{item.title}</span>
            {/* Il pallino: vuoto da chiuso, pieno da aperto. */}
            <span className="shrink-0" aria-hidden="true">
              <span className="block group-open:hidden"><DayDot state="todo" size={16} /></span>
              <span className="hidden group-open:block"><DayDot state="done" size={16} /></span>
            </span>
          </summary>

          <div className="max-w-prose pb-6 text-body-md text-text-secondary">{item.content}</div>
        </details>
      ))}
    </div>
  )
}

export default Accordion
