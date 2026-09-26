/**
 * <MediaPlaceholder /> — dove andra' una fotografia o un render.
 *
 * QUANDO USARLO: ovunque il sito prevede un'immagine che non c'e' ancora. I
 * prototipi finali arrivano da Higgsfield nel passo successivo; finche' non ci
 * sono, questo riquadro tiene il posto con il colore giusto e con il brief
 * dello scatto, cosi' chi guarda la pagina capisce cosa ci andra'.
 * QUANDO NO: per un'immagine che esiste. Passa `src` allo scatto in
 * src/lib/media.ts e il componente mostra la foto, senza cambiare pagina.
 *
 * Il segnaposto e' un campo colore pieno — colore-gusto, carta o inchiostro —
 * con il vertice al centro: e' gia' un'immagine del brand, non un rettangolo
 * grigio.
 */

import { Icon, DotField } from '../brand'
import { cn } from '../lib/cn'
import { flavorById } from '../lib/copy'
import { ratioValue, type Shot } from '../lib/media'

export interface MediaPlaceholderProps {
  shot: Shot
  /** Nasconde il brief: per le griglie strette. */
  compact?: boolean
  /** Raggio del riquadro. */
  radius?: 'md' | 'lg' | 'xl' | 'none'
  className?: string
}

const RADIUS = { none: '', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl' } as const

export function MediaPlaceholder({ shot, compact = false, radius = 'lg', className }: MediaPlaceholderProps) {
  const style = { aspectRatio: ratioValue(shot.ratio) }

  if (shot.src) {
    return (
      <figure className={cn('m-0 overflow-hidden', RADIUS[radius], className)} style={style}>
        <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </figure>
    )
  }

  const flavor = shot.flavor ? flavorById(shot.flavor) : null
  const onFlavor = shot.tone === 'flavor' && flavor
  const onInk = shot.tone === 'deep'

  return (
    <figure
      className={cn(
        'relative m-0 flex flex-col justify-between overflow-hidden p-5',
        RADIUS[radius],
        onFlavor ? flavor.colorToken : onInk ? 'bg-bg-brand-deep' : 'border border-dashed border-border-strong bg-bg-raised',
        className,
      )}
      style={style}
      role="img"
      aria-label={`Segnaposto: ${shot.title}. ${shot.brief}`}
      data-placeholder="media"
    >
      <DotField
        rows={3}
        cols={10}
        direction="right"
        color={onFlavor || onInk ? '#FFFFFF' : '#3A2A22'}
        opacity={onFlavor || onInk ? [0.1, 0.28] : [0.05, 0.14]}
        stretch
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 w-full"
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className={cn('type-mono-sm', onFlavor || onInk ? 'text-neutral-0/80' : 'text-text-muted')}>
          prototipo in arrivo · higgsfield
        </span>
        <span className={cn('type-mono-sm', onFlavor || onInk ? 'text-neutral-0/80' : 'text-text-muted')}>{shot.ratio}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-4">
        <Icon variant="free" color={onFlavor || onInk ? 'white' : 'cacao'} size={compact ? 40 : 56} title="" />
      </div>

      <div className="relative flex flex-col gap-1">
        <p className={cn('type-mono-md', onFlavor || onInk ? 'text-neutral-0' : 'text-text-primary')}>{shot.title}</p>
        {!compact && (
          <p className={cn('text-body-sm', onFlavor || onInk ? 'text-neutral-0/85' : 'text-text-secondary')}>{shot.brief}</p>
        )}
      </div>
    </figure>
  )
}

export default MediaPlaceholder
