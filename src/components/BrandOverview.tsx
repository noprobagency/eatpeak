/**
 * <BrandOverview /> — l'apertura: nome, cosa vendiamo, il claim.
 *
 * QUANDO USARLO: in cima allo Showcase, come intestazione della pagina. Sono
 * le tre righe che servono a chi arriva per la prima volta.
 * QUANDO NO: quando serve il posizionamento per esteso. Quello e'
 * <BrandPrinciples />, che sta piu' in basso e si legge dopo.
 *
 * Il testo arriva da src/lib/brand-overview.ts, che genera anche
 * docs/00-brand-overview.md. Un contenuto solo, due uscite.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Il claim corto e' un beneficio generico ai sensi dell'articolo 10(3): in una
 * comunicazione commerciale deve avere un claim autorizzato nelle immediate
 * vicinanze, e per questo `authorizedClaim` e' obbligatoria.
 *
 * L'unico modo per ometterla e' dichiarare `internalUseOnly`, che vale per lo
 * Showcase e per i documenti di lavoro. Non e' una scorciatoia: e' una riga
 * che qualcuno deve scrivere di proposito, e che si vede in code review.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { ElementType } from 'react'
import { cn } from '../lib/cn'
import { BRAND_OVERVIEW, type BrandOverviewContent } from '../lib/brand-overview'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

interface BrandOverviewBase {
  content?: BrandOverviewContent
  /** `h1` quando la scheda apre la pagina, `h2` quando sta dentro a qualcosa. */
  titleAs?: ElementType
  locale?: Locale
  className?: string
}

export type BrandOverviewProps = BrandOverviewBase &
  (
    | { authorizedClaim: AuthorizedClaimId; internalUseOnly?: false }
    | {
        /**
         * Pagina interna o documento di lavoro: nessuna comunicazione
         * commerciale, quindi nessun obbligo di copertura del claim corto.
         */
        internalUseOnly: true
        authorizedClaim?: never
      }
  )

export function BrandOverview(props: BrandOverviewProps) {
  const {
    content = BRAND_OVERVIEW,
    titleAs: Title = 'h2',
    locale = 'it',
    className,
    authorizedClaim,
  } = props

  const [primaryClaim, ...otherClaims] = content.claim.lines

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <header className="flex flex-col gap-2">
        <Title className="type-display-md text-text-primary">{content.title}</Title>
        <p className="max-w-prose text-body-md text-text-secondary">{content.intro}</p>
      </header>

      <div className="flex flex-col gap-2">
        <span className="type-mono-sm text-text-muted">{content.claim.label}</span>

        {/*
          `normal-case` è voluto. La regola del minuscolo vale per i titoli,
          che sono etichette; questo è una frase, e una frase comincia con la
          maiuscola. Il claim va reso come è scritto in copy.ts.
        */}
        <p className="type-display-sm normal-case text-text-primary">{primaryClaim}</p>

        {otherClaims.length > 0 && (
          <p className="flex max-w-prose flex-wrap items-baseline gap-x-2 text-body-md text-text-secondary">
            {otherClaims.map((line, i) => (
              <span key={line}>
                {i > 0 && <span aria-hidden="true" className="pr-2 text-text-muted">·</span>}
                {line}
              </span>
            ))}
          </p>
        )}

        {authorizedClaim && (
          <p className="max-w-prose text-body-sm text-text-muted" data-compliance="authorized-claim">
            {authorizedClaimText(authorizedClaim, locale)}
          </p>
        )}
      </div>
    </div>
  )
}

export default BrandOverview
