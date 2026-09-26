/**
 * <Badge /> — un'etichetta che il sistema mette addosso a qualcosa.
 *
 * QUANDO USARLO: "spedizione gratuita", "il piu scelto", "novita'". Stato o
 * qualifica decisi dal sistema, non dall'utente.
 * QUANDO NO: per una categoria che l'utente puo' togliere o filtrare. Quello e'
 * <Tag />. Per un valore in attesa del laboratorio c'e' <LabTag />.
 *
 * Il testo e' in mono maiuscolo: il badge porta un dato, non una frase.
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

/**
 * Nessuna combinazione usa arancia 500, lime 500 o miele 300 come colore di
 * testo su fondo chiaro. Sui pieni colore-gusto il testo e' inchiostro:
 * il bianco a questa misura non arriva a 4,5:1.
 */
const TONES: Record<BadgeTone, { soft: string; solid: string }> = {
  brand:   { soft: 'bg-arancia-50 text-arancia-700',  solid: 'bg-bg-brand text-text-on-brand' },
  lime:    { soft: 'bg-lime-50 text-lime-700',        solid: 'bg-bg-flavor-lime text-neutral-900' },
  miele:   { soft: 'bg-miele-100 text-miele-800',     solid: 'bg-miele-300 text-neutral-900' },
  neutral: { soft: 'bg-neutral-100 text-neutral-700', solid: 'bg-neutral-900 text-neutral-0' },
  success: { soft: 'bg-lime-50 text-lime-700',        solid: 'bg-success text-neutral-0' },
  warning: { soft: 'bg-miele-100 text-miele-800',     solid: 'bg-warning text-neutral-900' },
  error:   { soft: 'bg-errore-50 text-errore-700',    solid: 'bg-error text-neutral-0' },
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
