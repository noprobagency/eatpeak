/**
 * <Grid /> — griglia responsive a colonne fisse.
 *
 * QUANDO USARLO: cataloghi, elenchi di prove, timeline a quattro passi.
 * QUANDO NO: quando le colonne devono avere larghezze diverse fra loro. In quel
 * caso scrivi la grid a mano: forzare questa componente peggiora il risultato.
 *
 * Le colonne scendono da sole: `cols` e' il numero al breakpoint piu' largo.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { SpaceToken } from '../tokens/tokens'

export interface GridProps {
  children: ReactNode
  cols?: 2 | 3 | 4
  gap?: SpaceToken
  className?: string
}

const COLS = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
} as const

export function Grid({ children, cols = 3, gap = '6', className }: GridProps) {
  return (
    <div className={cn('grid', COLS[cols], className)} style={{ gap: `var(--space-${gap})` }}>
      {children}
    </div>
  )
}

export default Grid
