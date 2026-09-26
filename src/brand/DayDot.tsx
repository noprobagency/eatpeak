/**
 * <DayDot /> — un giorno, in uno dei tre stati.
 *
 * I punti geometrici dell'interfaccia: passo fisso, un colore, tre stati
 * sempre uguali. Da fare: anello cacao 500 al 40%. Fatto: ambra 700 su
 * chiaro (3.1), cacao sull'ambra 400, bianco sugli altri colori. Oggi: miele
 * pieno con l'anello ambra 700, mai cacao. E' la griglia che conta (calendario, stick 01-30, tier 30/60/90,
 * stock). Per il segno a penna del cliente c'e' <HandDot />.
 */

import { cn } from '../lib/cn'

export type DayState = 'todo' | 'done' | 'today'

export interface DayDotProps {
  state?: DayState
  size?: number
  /** Il punto sta su un campo colore: il fatto diventa bianco. */
  onColor?: boolean
  /** Il punto sta sull'ambra 400 (3.1): il fatto diventa cacao, mai bianco. */
  onBrand?: boolean
  /** Un giorno numerato, per gli screen reader. */
  label?: string
  className?: string
}

export function DayDot({ state = 'todo', size = 12, onColor = false, onBrand = false, label, className }: DayDotProps) {
  const done = onBrand ? 'var(--text-on-brand)' : onColor ? '#FFFFFF' : 'var(--dot-done)'
  const todo = onBrand
    ? 'color-mix(in srgb, var(--text-on-brand) 40%, transparent)'
    : onColor ? 'rgba(255,255,255,0.45)' : 'color-mix(in srgb, var(--dot-todo) 40%, transparent)'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
      data-state={state}
    >
      {label && <title>{label}</title>}
      {state === 'todo' && <circle cx="12" cy="12" r="9" fill="none" stroke={todo} strokeWidth="2.5" />}
      {state === 'done' && <circle cx="12" cy="12" r="10" fill={done} />}
      {state === 'today' && (
        <>
          <circle cx="12" cy="12" r="10" fill="var(--dot-today)" />
          <circle cx="12" cy="12" r="9.2" fill="none" stroke="var(--dot-today-ring)" strokeWidth="2.2" />
        </>
      )}
    </svg>
  )
}

export default DayDot
