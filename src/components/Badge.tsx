/**
 * <Badge /> — un'etichetta che il sistema mette addosso a qualcosa.
 *
 * QUANDO USARLO: "spedizione gratuita", "il piu scelto", "esempio". Stato o
 * qualifica decisi dal sistema, non dall'utente.
 * QUANDO NO: per una categoria che l'utente puo' togliere o filtrare. Quello e'
 * <Tag />. Per un valore in attesa del laboratorio c'e' <LabTag />.
 *
 * 3.0: niente mono e niente maiuscolo tracciato. Il badge e' nel font display,
 * peso 700, sentence case. I pieni sono colore brand, mai neri.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type BadgeTone = 'brand' | 'lime' | 'miele' | 'neutral' | 'success' | 'warning' | 'error'

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  /** `soft` per il fondo tenue, `solid` per il pieno. */
  variant?: 'soft' | 'solid'
  className?: string
}

const TONES: Record<BadgeTone, { soft: string; solid: string }> = {
  brand:   { soft: 'bg-arancia-50 text-arancia-700',  solid: 'bg-bg-brand-deep text-text-on-brand' },
  lime:    { soft: 'bg-lime-50 text-lime-700',        solid: 'bg-bg-lime-deep text-neutral-0' },
  miele:   { soft: 'bg-miele-100 text-miele-800',     solid: 'bg-miele-300 text-cacao-900' },
  neutral: { soft: 'bg-neutral-100 text-cacao-600',   solid: 'bg-cacao-100 text-cacao-900' },
  success: { soft: 'bg-lime-50 text-lime-700',        solid: 'bg-success text-neutral-0' },
  warning: { soft: 'bg-miele-100 text-miele-800',     solid: 'bg-warning text-cacao-900' },
  error:   { soft: 'bg-errore-50 text-errore-700',    solid: 'bg-error text-neutral-0' },
}

export function Badge({ children, tone = 'brand', variant = 'soft', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1',
        'font-display text-body-sm font-bold leading-none',
        TONES[tone][variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
