/**
 * <Grain /> — la grana leggerissima dei campi colore.
 *
 * Un velo di rumore (feTurbulence) al 4% in multiply sopra un campo colore:
 * toglie l'effetto "vettoriale" e da' la sensazione della stampa. Si mette
 * dentro un contenitore `relative` e copre tutto. Non ha mai contenuto sopra
 * di se': e' l'ultimo figlio decorativo, sotto il testo (z-index 0).
 *
 * Si spegne con `prefers-reduced-transparency` e sotto i 480px (regola CSS in
 * globals.css, classe .peak-grain).
 */

import { useId } from 'react'
import { cn } from '../lib/cn'

export interface GrainProps {
  /** Opacita' del velo. Default dal token --grain-opacity (0.04). */
  opacity?: number
  className?: string
}

export function Grain({ opacity, className }: GrainProps) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={cn('peak-grain pointer-events-none absolute inset-0 h-full w-full', className)}
      style={opacity !== undefined ? { opacity } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <filter id={`grain-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  )
}

export default Grain
