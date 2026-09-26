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
            <svg
              className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-base ease-standard group-open:rotate-45"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </summary>

          <div className="max-w-prose pb-6 text-body-md text-text-secondary">{item.content}</div>
        </details>
      ))}
    </div>
  )
}

export default Accordion
