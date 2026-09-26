/**
 * <Tooltip /> — una precisazione breve.
 *
 * QUANDO USARLO: per spiegare un'abbreviazione o un dato tecnico accanto a cui
 * non c'e' spazio.
 * QUANDO NO: per contenuto che serve davvero. Un tooltip non esiste su touch,
 * non si copia e sparisce: se l'informazione conta, scrivila in pagina.
 *
 * peak-compliance-ignore focus — focus da tastiera, non un claim
 * Si apre anche col focus da tastiera, non solo con l'hover, e si chiude con
 * Escape.
 */

import { useId, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface TooltipProps {
  /** L'elemento che scatena il tooltip. Deve poter ricevere il focus. */ // peak-compliance-ignore focus — focus da tastiera, non un claim
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

export function Tooltip({ children, content, side = 'top', className }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
    >
      <span aria-describedby={open ? id : undefined} tabIndex={0} className="inline-flex">
        {children}
      </span>

      <span
        role="tooltip"
        id={id}
        hidden={!open}
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 w-max max-w-[240px] -translate-x-1/2',
          'rounded-md bg-bg-inverse px-3 py-2 text-body-sm text-text-inverse shadow-md',
          side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
        )}
      >
        {content}
      </span>
    </span>
  )
}

export default Tooltip
