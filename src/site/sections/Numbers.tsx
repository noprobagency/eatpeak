/**
 * Archetipo C · Numeri.
 *
 * Numeri enormi in DM Mono su carta, senza card, separati da spazio e da un
 * pallino a mano. E' la barra numeri e il prezzo al giorno.
 */

import type { ReactNode } from 'react'
import { HandDot } from '../../brand'
import { Container, Section, type SectionTone } from '../../components'
import { cn } from '../../lib/cn'

export interface NumberItem {
  value: ReactNode
  label: ReactNode
}

export interface NumbersProps {
  items: readonly NumberItem[]
  tone?: SectionTone
  /** `compact` per il PDP. */
  size?: 'default' | 'compact'
  id?: string
  dataRef?: string
  className?: string
}

export function Numbers({ items, tone = 'page', size = 'default', id, dataRef, className }: NumbersProps) {
  const deep = tone === 'brand-deep' || tone === 'lime-deep'
  // Su ambra 400 solo cacao 900: niente grigi.
  const onBrand = tone === 'brand'
  return (
    <Section tone={tone} spacing={size === 'compact' ? 'tight' : 'default'} id={id} dataRef={dataRef} className={className}>
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-8 md:gap-x-10" data-archetype="C">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className={cn('font-mono font-medium', size === 'compact' ? 'text-display-md' : 'type-mono-lg', onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0' : 'text-text-primary')}>
                  {item.value}
                </span>
                <span className={cn('type-eyebrow', onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0/85' : 'text-text-secondary')}>{item.label}</span>
              </div>
              {i < items.length - 1 && (
                <HandDot seed={`num-${i}`} size={size === 'compact' ? 10 : 14} className={cn('hidden md:block', onBrand ? 'text-text-on-brand' : deep ? 'text-neutral-0/70' : 'text-dot-done')} />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

export default Numbers
