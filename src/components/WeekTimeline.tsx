/**
 * <WeekTimeline /> — le quattro settimane.
 *
 * E' il componente narrativo centrale del brand. Racconta la saturazione
 * progressiva e, con essa, il posizionamento: il prodotto non funziona perche'
 * e' potente, funziona perche' lo prendi tutti i giorni.
 *
 * QUANDO USARLO: una volta per landing, nel punto in cui il lettore si chiede
 * "e quindi cosa succede se la prendo".
 * QUANDO NO: come elenco di benefici. I testi descrivono il gesto e il tempo,
 * non un effetto: l'effetto lo dice il claim autorizzato, e va accanto.
 *
 * La barra di riempimento e' decorativa e non promette una percentuale di
 * efficacia: e' l'immagine del serbatoio che si riempie.
 */

import { cn } from '../lib/cn'
import { WEEK_TIMELINE } from '../lib/copy'

export interface WeekTimelineProps {
  steps?: typeof WEEK_TIMELINE
  tone?: 'default' | 'inverse'
  /** Evidenzia una settimana. Utile nelle creativita' e nelle email. */
  highlight?: number
  className?: string
}

/** Quanto e' pieno il serbatoio, visivamente, a ogni passo. */
const FILL = [0.15, 0.45, 1, 1]

export function WeekTimeline({ steps = WEEK_TIMELINE, tone = 'default', highlight, className }: WeekTimelineProps) {
  const inverse = tone === 'inverse'

  return (
    <ol className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {steps.map((step, i) => {
        const active = highlight === step.week

        return (
          <li
            key={step.week}
            className={cn(
              'flex flex-col gap-4 rounded-lg border p-6 transition-colors duration-base ease-standard',
              inverse ? 'border-white/15 bg-white/5' : 'border-border-subtle bg-bg-surface',
              active && (inverse ? 'border-white/40' : 'border-border-brand'),
            )}
          >
            <p className={cn('type-mono-md', inverse ? 'text-neutral-0/60' : 'text-text-muted')}>
              settimana {step.week}
            </p>

            <h3 className={cn('type-display-sm', inverse ? 'text-text-inverse' : 'text-text-primary')}>
              {step.title}
            </h3>

            {/* Il serbatoio. Decorativo: nessuna percentuale dichiarata. */}
            <div
              aria-hidden="true"
              className={cn('h-1.5 w-full overflow-hidden rounded-full', inverse ? 'bg-white/15' : 'bg-neutral-200')}
            >
              <div
                className="h-full rounded-full bg-bg-brand transition-[width] duration-slow ease-standard"
                style={{ width: `${FILL[i] * 100}%` }}
              />
            </div>

            <p className={cn('text-body-sm', inverse ? 'text-neutral-0/80' : 'text-text-secondary')}>{step.body}</p>
          </li>
        )
      })}
    </ol>
  )
}

export default WeekTimeline
