/**
 * <Badge /> — un'etichetta che il sistema mette addosso a qualcosa.
 *
 * QUANDO USARLO: "spedizione gratuita", "esaurito", "novita'". Stato o
 * qualifica decisi dal sistema, non dall'utente.
 * QUANDO NO: per una categoria che l'utente puo' togliere o filtrare. Quello e'
 * <Tag />.
 *
 * Il testo e' in mono maiuscolo: il badge porta un dato, non una frase.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type BadgeTone = 'brand' | 'forest' | 'honey' | 'neutral' | 'success' | 'warning' | 'error'

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  /** `soft` per il fondo tenue, `solid` per il pieno. */
  variant?: 'soft' | 'solid'
  className?: string
}

/**
 * Nessuna combinazione qui sotto usa miele-300 o terracotta-400 come colore di
 * testo su fondo chiaro: sotto 4.5:1 non si legge.
 */
const TONES: Record<BadgeTone, { soft: string; solid: string }> = {
  brand:   { soft: 'bg-terracotta-50 text-terracotta-700', solid: 'bg-terracotta-400 text-terracotta-900' },
  forest:  { soft: 'bg-bosco-50 text-bosco-700',           solid: 'bg-bosco-500 text-neutral-0' },
  honey:   { soft: 'bg-miele-100 text-miele-800',          solid: 'bg-miele-300 text-neutral-900' },
  neutral: { soft: 'bg-neutral-100 text-neutral-700',      solid: 'bg-neutral-900 text-neutral-0' },
  success: { soft: 'bg-bosco-50 text-bosco-700',           solid: 'bg-success text-neutral-0' },
  warning: { soft: 'bg-miele-100 text-miele-800',          solid: 'bg-warning text-neutral-900' },
  error:   { soft: 'bg-terracotta-50 text-error',          solid: 'bg-error text-neutral-0' },
}

export function Badge({ children, tone = 'brand', variant = 'soft', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1',
        'font-mono text-mono-sm uppercase',
        TONES[tone][variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
