/**
 * <Tabs /> — piu' viste dello stesso oggetto.
 *
 * QUANDO USARLO: descrizione / ingredienti / spedizione su una pagina prodotto.
 * QUANDO NO: per un percorso a passi. Le tab suggeriscono che l'ordine non
 * conta; se conta, servono passi numerati.
 *
 * Navigazione da tastiera completa: frecce per spostarsi, Home e End per gli
 * estremi, come da pattern ARIA.
 */

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: readonly TabItem[]
  defaultId?: string
  className?: string
}

export function Tabs({ items, defaultId, className }: TabsProps) {
  const baseId = useId()
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const enabled = items.filter((t) => !t.disabled)

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const i = enabled.findIndex((t) => t.id === active)
    if (i === -1) return

    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % enabled.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1

    if (next !== null) {
      e.preventDefault()
      const id = enabled[next].id
      setActive(id)
      tabRefs.current[id]?.focus()
    }
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label="Sezioni" className="flex gap-1 border-b border-border-subtle">
        {items.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[t.id] = el }}
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-controls={`${baseId}-panel-${t.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={t.disabled}
              onClick={() => setActive(t.id)}
              onKeyDown={onKeyDown}
              className={cn(
                '-mb-px border-b-2 px-4 py-3 text-heading-sm transition-colors duration-fast ease-standard',
                'disabled:cursor-not-allowed disabled:opacity-40',
                selected
                  ? 'border-border-brand text-text-brand'
                  : 'border-transparent text-text-secondary hover:text-text-primary',
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="pt-6 text-body-md text-text-secondary"
        >
          {t.id === active && t.content}
        </div>
      ))}
    </div>
  )
}

export default Tabs
