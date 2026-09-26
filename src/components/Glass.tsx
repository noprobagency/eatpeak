/**
 * <Glass /> — un pannello di vetro (archetipo F).
 *
 * La ricetta e' quella dell'header: gradiente bianco 40% -> 5%, blur 21px,
 * bordo bianco 10%, raggio 14px, in token `--glass-*`. `liquid` aggiunge il
 * riflesso in alto, l'ombra interna e saturate(140%): e' il vetro di Apple.
 *
 * QUANDO USARLO: solo sopra colore o immagine — la card prezzo nell'hero, lo
 * sticky add-to-cart, lo switch gusto sulla galleria, i chip delle
 * recensioni sulla foto, il contatore "giorno 12 di 30".
 * QUANDO NO: su carta piatta (non si vede), e mai piu' di tre pannelli per
 * altezza di schermo. Il testo sul vetro ha sempre il velo interno che
 * garantisce 4,5:1; senza backdrop-filter il fondo e' bianco 85%; con
 * prefers-reduced-transparency il fondo e' pieno.
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'
import './glass.css'

export interface GlassProps {
  children: ReactNode
  /** `light`: velo chiaro, testo cacao. `onColor`: velo scuro, testo bianco. */
  tone?: 'light' | 'onColor'
  /** Il vetro liquido: riflesso, ombra interna, saturazione. */
  liquid?: boolean
  radius?: 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: ElementType
  className?: string
}

const RADIUS = { md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full' } as const
const PADDING = { none: '', sm: 'p-4', md: 'p-5 md:p-6', lg: 'p-6 md:p-8' } as const

export function Glass({ children, tone = 'light', liquid = false, radius = 'lg', padding = 'md', as: Tag = 'div', className }: GlassProps) {
  return (
    <Tag
      className={cn(
        'peak-glass',
        tone === 'light' ? 'peak-glass--light' : 'peak-glass--on-color',
        liquid && 'peak-glass--liquid',
        RADIUS[radius],
        PADDING[padding],
        className,
      )}
      data-glass={tone}
    >
      <div className="relative">{children}</div>
    </Tag>
  )
}

export default Glass
