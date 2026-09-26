/**
 * <TrustRow /> — la riga delle prove.
 *
 * QUANDO USARLO: sotto l'hero o sopra il carrello, dove serve una ragione
 * verificabile per fidarsi.
 * QUANDO NO: per benefici. Qui stanno solo fatti controllabili — dove si
 * produce, quanti grammi, quali analisi. Un beneficio in questa riga sembra un
 * fatto, ed e' esattamente il tipo di errore che la compliance punisce.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { TRUST_ITEMS } from '../lib/copy'

export interface TrustItem {
  label: string
  detail?: string
  icon?: ReactNode
}

export interface TrustRowProps {
  items?: readonly TrustItem[]
  tone?: 'default' | 'inverse'
  /** `compact` per una riga sola senza dettagli. */
  variant?: 'compact' | 'detailed'
  className?: string
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <path d="M5 8.2l2.1 2.1L11 6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TrustRow({ items = TRUST_ITEMS, tone = 'default', variant = 'detailed', className }: TrustRowProps) {
  const inverse = tone === 'inverse'

  if (variant === 'compact') {
    return (
      <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-2', className)}>
        {items.map((item) => (
          <li key={item.label} className={cn('flex items-center gap-2 type-mono-md', inverse ? 'text-neutral-0/75' : 'text-text-muted')}>
            <span className="text-text-brand">{item.icon ?? <CheckIcon />}</span>
            {item.label}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-2">
          <span className={cn(inverse ? 'text-miele-300' : 'text-text-brand')}>{item.icon ?? <CheckIcon />}</span>
          <p className={cn('type-mono-md', inverse ? 'text-neutral-0' : 'text-text-primary')}>{item.label}</p>
          {item.detail && (
            <p className={cn('text-body-sm', inverse ? 'text-neutral-0/75' : 'text-text-secondary')}>{item.detail}</p>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TrustRow
