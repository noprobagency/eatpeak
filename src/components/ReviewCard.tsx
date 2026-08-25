/**
 * <ReviewCard /> — la parola di chi lo usa.
 *
 * QUANDO USARLO: sezione recensioni, pagina prodotto, prove sociali.
 * QUANDO NO: per riportare un effetto fisiologico. Una recensione che parla di
 * peak-compliance-ignore recupero — esempio di claim vietato, citato per spiegare la regola
 * recupero e' un claim non autorizzato anche se l'ha scritta un cliente: il
 * testo va scelto, non copiato in blocco.
 *
 * L'etichetta del beneficio e' in mono e nomina un fatto del prodotto — il
 * formato, la costanza, l'assenza di grumi — non un effetto sul corpo.
 */

import { cn } from '../lib/cn'

export interface ReviewCardProps {
  stars: 1 | 2 | 3 | 4 | 5
  text: string
  author: string
  /** Etichetta in mono. Nomina un fatto del prodotto, non un effetto. */
  benefit?: string
  /** Marca la recensione come proveniente da un acquisto verificato. */
  verified?: boolean
  className?: string
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} stelle su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6z"
            fill={i < value ? 'var(--color-terracotta-400)' : 'var(--color-neutral-300)'}
          />
        </svg>
      ))}
    </span>
  )
}

export function ReviewCard({ stars, text, author, benefit, verified = false, className }: ReviewCardProps) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col gap-4 rounded-lg border border-border-subtle bg-bg-surface p-6',
        className,
      )}
    >
      <Stars value={stars} />

      <blockquote className="flex-1 text-body-md text-text-primary">{text}</blockquote>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <span className="text-body-sm text-text-secondary">
          {author}
          {verified && <span className="ml-2 type-mono-sm text-bosco-600">acquisto verificato</span>}
        </span>
        {benefit && <span className="type-mono-sm text-text-muted">{benefit}</span>}
      </figcaption>
    </figure>
  )
}

export default ReviewCard
