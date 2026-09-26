/**
 * <LabTag /> — il segnaposto di un valore che arriva dal laboratorio.
 *
 * QUANDO USARLO: ovunque un numero non c'e' ancora — grammi di glicina, µg e
 * %VNR della vitamina D3, kcal, zuccheri, aromi, misure della fustella. Il tag
 * grigio dice "manca" senza inventare un valore plausibile.
 * QUANDO NO: per uno stato di prodotto ("esaurito", "novita'"). Quello e'
 * <Badge />. E mai per nascondere un dato che esiste.
 *
 * `renderWithPlaceholders` prende una stringa che contiene [dal laboratorio]
 * e sostituisce ogni occorrenza col tag, lasciando il resto in chiaro.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { LAB_PLACEHOLDER } from '../lib/copy'

export interface LabTagProps {
  /** Il testo del tag. Di default "dal laboratorio". */
  children?: ReactNode
  /** Cosa manca, per il title e per gli screen reader. */
  what?: string
  size?: 'sm' | 'md'
  className?: string
}

export function LabTag({ children = 'dal laboratorio', what, size = 'sm', className }: LabTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-dashed border-cacao-300 bg-cacao-50 text-cacao-600',
        'font-mono uppercase',
        size === 'sm' ? 'px-2 py-1 text-mono-sm' : 'px-3 py-1 text-mono-md',
        className,
      )}
      title={what ? `${what}: valore in attesa dal laboratorio` : 'Valore in attesa dal laboratorio'}
      data-placeholder="lab"
    >
      <span aria-hidden="true">·</span>
      {children}
    </span>
  )
}

/** Sostituisce ogni [dal laboratorio] in una stringa col tag. */
export function renderWithPlaceholders(text: string, what?: string): ReactNode {
  const parts = text.split(LAB_PLACEHOLDER)
  if (parts.length === 1) return text
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <LabTag what={what} />}
    </span>
  ))
}

export default LabTag
