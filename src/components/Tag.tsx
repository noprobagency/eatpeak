/**
 * <Tag /> — un'etichetta che appartiene all'utente.
 *
 * QUANDO USARLO: filtri attivi, categorie selezionate, cose che si tolgono.
 * QUANDO NO: per uno stato deciso dal sistema. Quello e' <Badge />, che non ha
 * la x e non e' cliccabile.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface TagProps {
  children: ReactNode
  /** Se presente, il tag mostra la x e diventa rimuovibile. */
  onRemove?: () => void
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function Tag({ children, onRemove, selected = false, onClick, className }: TagProps) {
  const interactive = Boolean(onClick)

  const body = (
    <>
      <span className="text-body-sm">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="-mr-1 flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-fast hover:bg-neutral-200"
          aria-label={`Togli ${typeof children === 'string' ? children : 'filtro'}`}
        >
          <svg className="h-3 w-3" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </>
  )

  const classes = cn(
    'inline-flex items-center gap-2 rounded-full border px-3 py-2',
    'transition-colors duration-fast ease-standard',
    selected
      ? 'border-border-brand bg-bg-brand-soft text-text-brand'
      : 'border-border-default bg-bg-surface text-text-secondary',
    interactive && 'cursor-pointer hover:border-border-brand hover:text-text-brand',
    className,
  )

  if (interactive) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={classes}>
        {body}
      </button>
    )
  }

  return <span className={classes}>{body}</span>
}

export default Tag
