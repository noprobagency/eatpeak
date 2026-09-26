/**
 * Archetipo D · Statement.
 *
 * Una frase grande, centrata, con i pallini a mano sparsi intorno che
 * "cadono" in riga, e molto spazio bianco. "La creatina funziona. Il
 * difficile e' prenderla ogni giorno."
 */

import type { ReactNode } from 'react'
import { HandDot } from '../../brand'
import { Container, Section, type SectionTone } from '../../components'
import { cn } from '../../lib/cn'

export interface StatementProps {
  children: ReactNode
  /** Una riga sotto, piu' piccola. */
  note?: ReactNode
  tone?: SectionTone
  id?: string
  dataRef?: string
  className?: string
}

/** Le posizioni dei pallini sparsi: sopra cadono, sotto sono in riga. */
const SCATTER = [
  { x: 8, y: 12, s: 14, seed: 'st-1' },
  { x: 18, y: 30, s: 10, seed: 'st-2' },
  { x: 84, y: 16, s: 16, seed: 'st-3' },
  { x: 92, y: 38, s: 9, seed: 'st-4' },
  { x: 74, y: 8, s: 8, seed: 'st-5' },
]

export function Statement({ children, note, tone = 'page', id, dataRef, className }: StatementProps) {
  const deep = tone === 'brand-deep' || tone === 'lime-deep'
  // Su ambra 400 solo cacao 900: niente grigi.
  const onBrand = tone === 'brand'
  return (
    <Section tone={tone} spacing="loose" id={id} dataRef={dataRef} className={cn('overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SCATTER.map((d) => (
          <HandDot
            key={d.seed}
            seed={d.seed}
            size={d.s}
            fill={d.s > 12 ? 'solid' : 'ring'}
            className={cn('absolute', onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0/80' : 'text-dot-done')}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          />
        ))}
      </div>
      <Container width="narrow">
        <div className="relative flex flex-col items-center gap-6 text-center" data-archetype="D">
          <p className={cn('type-display-lg', onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0' : 'text-text-primary')}>{children}</p>
          {note && <p className={cn('max-w-prose text-body-lg', onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0/85' : 'text-text-secondary')}>{note}</p>}
          <div className="flex items-center gap-3" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <HandDot key={n} seed={`row-${n}`} size={n === 7 ? 12 : 10} fill={n < 5 ? 'solid' : 'ring'} className={onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0' : 'text-dot-done'} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default Statement
