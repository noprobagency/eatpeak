/**
 * <BrandOverview /> — la scheda del brand.
 *
 * QUANDO USARLO: in apertura dello Showcase, e ovunque serva dare a qualcuno —
 * una persona nuova, un'agenzia, uno strumento generativo — il contesto prima
 * dei colori. Chi legge i token senza sapere cos'e' peak applica il sistema
 * senza capirlo.
 * QUANDO NO: su una pagina di vendita. Questo e' un documento di
 * posizionamento interno: dice a chi parliamo e come, e per farlo nomina cose
 * che al cliente non si dicono. Il copy pubblicabile sta in src/lib/copy.ts.
 *
 * E' un'introduzione, quindi deve occupare poco: nessuna cornice, una colonna
 * sola, etichetta sopra e testo sotto. Il label a sinistra e il testo a destra
 * sembrano ordinati finche' i blocchi non hanno lunghezze diverse — poi le
 * righe si disallineano e la scheda diventa rumorosa.
 *
 * Il testo arriva da src/lib/brand-overview.ts, che genera anche
 * docs/00-brand-overview.md. Un contenuto solo, due uscite.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Il blocco CLAIM contiene il claim corto, che e' un beneficio generico ai
 * sensi dell'articolo 10(3). Per questo `authorizedClaim` e' obbligatoria: il
 * claim autorizzato viene stampato subito sotto, non a fondo pagina.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { ElementType } from 'react'
import { cn } from '../lib/cn'
import { BRAND_OVERVIEW, type BrandOverviewContent } from '../lib/brand-overview'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

export interface BrandOverviewProps {
  content?: BrandOverviewContent
  /**
   * Obbligatoria: il blocco CLAIM porta un beneficio generico e deve avere il
   * claim autorizzato nelle immediate vicinanze.
   */
  authorizedClaim: AuthorizedClaimId
  /** `h1` quando la scheda apre la pagina, `h2` quando sta dentro a qualcosa. */
  titleAs?: ElementType
  locale?: Locale
  className?: string
}

/** Etichetta in mono. Una sola definizione: le etichette devono essere identiche. */
function Label({ children }: { children: string }) {
  return <span className="type-mono-sm text-text-muted">{children}</span>
}

export function BrandOverview({
  content = BRAND_OVERVIEW,
  authorizedClaim,
  titleAs: Title = 'h2',
  locale = 'it',
  className,
}: BrandOverviewProps) {
  const [primaryClaim, ...otherClaims] = content.claim.lines

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <header className="flex flex-col gap-2">
        <Title className="type-display-md text-text-primary">{content.title}</Title>
        <p className="max-w-prose text-body-md text-text-secondary">{content.intro}</p>
      </header>

      {/* Il claim. Unico blocco in display: e' la frase che regge le altre. */}
      <div className="flex flex-col gap-2">
        <Label>{content.claim.label}</Label>

        <p className="type-display-sm text-text-primary">{primaryClaim}</p>

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

        <p className="max-w-prose text-body-sm text-text-muted" data-compliance="authorized-claim">
          {authorizedClaimText(authorizedClaim, locale)}
        </p>
      </div>

      {/* I punti, in colonna: etichetta sopra, testo sotto. */}
      <dl className="m-0 flex flex-col gap-5">
        {content.blocks.map((block) => (
          <div key={block.label} className="flex flex-col gap-2">
            <dt>
              <Label>{block.label}</Label>
            </dt>

            <dd className="m-0 flex max-w-prose flex-col gap-2 text-body-sm text-text-secondary">
              {block.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default BrandOverview
