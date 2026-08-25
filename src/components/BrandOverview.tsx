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
 * Il testo arriva da src/lib/brand-overview.ts, che genera anche
 * docs/00-brand-overview.md. Un contenuto solo, due uscite.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Il blocco CLAIM contiene il claim corto, che e' un beneficio generico ai
 * sensi dell'articolo 10(3). Per questo `authorizedClaim` e' obbligatoria: il
 * claim autorizzato viene stampato nello stesso riquadro, non a fondo pagina.
 * ─────────────────────────────────────────────────────────────────────────
 */

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
  locale?: Locale
  className?: string
}

export function BrandOverview({
  content = BRAND_OVERVIEW,
  authorizedClaim,
  locale = 'it',
  className,
}: BrandOverviewProps) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border border-border-subtle bg-bg-surface',
        className,
      )}
    >
      {/* Intestazione. Il display forza il minuscolo via CSS: e' il sistema
          che applica la regola, non chi scrive il titolo. */}
      <header className="flex flex-col gap-4 border-b border-border-subtle p-6 md:p-10">
        <h2 className="type-display-sm text-text-primary">{content.title}</h2>
        <p className="max-w-prose text-body-lg text-text-secondary">{content.intro}</p>
      </header>

      {/* Il claim, staccato dal resto: e' la frase che regge tutte le altre. */}
      <section className="flex flex-col gap-4 border-b border-border-subtle bg-bg-warm p-6 md:p-10">
        <h3 className="type-mono-md text-text-muted">{content.claim.label}</h3>

        <ul className="flex flex-col gap-2">
          {content.claim.lines.map((line, i) => (
            <li
              key={line}
              className={cn(
                // La prima riga e' quella italiana, ed e' la principale.
                i === 0 ? 'type-display-sm text-text-primary' : 'text-heading-md text-text-secondary',
              )}
            >
              {line}
            </li>
          ))}
        </ul>

        <p className="max-w-prose text-body-sm text-text-muted" data-compliance="authorized-claim">
          {authorizedClaimText(authorizedClaim, locale)}
        </p>
      </section>

      {/* Le righe della scheda. Un <dl> perche' e' esattamente questo:
          etichetta e definizione, in coppia. */}
      <dl className="m-0">
        {content.blocks.map((block) => (
          <div
            key={block.label}
            className={cn(
              'flex flex-col gap-3 border-b border-border-subtle p-6',
              'last:border-0 md:flex-row md:gap-10 md:p-10',
            )}
          >
            <dt className="type-mono-md shrink-0 text-text-muted md:w-44 md:pt-1">{block.label}</dt>

            <dd className="m-0 flex max-w-prose flex-col gap-3">
              {block.paragraphs.map((p) => (
                <p key={p} className="text-body-md text-text-secondary">
                  {p}
                </p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

export default BrandOverview
