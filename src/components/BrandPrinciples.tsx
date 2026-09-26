/**
 * <BrandPrinciples /> — il posizionamento in sei punti.
 *
 * QUANDO USARLO: dove serve il contesto per esteso — la sezione 00 dello
 * Showcase, un brief, l'onboarding di un'agenzia. Chi legge i token senza
 * sapere cos'e' peak applica il sistema senza capirlo, ed e' cosi' che un
 * design system si degrada in una tavolozza.
 * QUANDO NO: in cima a una pagina, come intestazione. Li' bastano il nome e il
 * claim, e c'e' <BrandOverview />.
 *
 * Etichetta sopra e testo sotto, una colonna sola. Il label a sinistra sembra
 * ordinato finche' i blocchi non hanno lunghezze diverse: poi le righe si
 * disallineano e la scheda diventa rumorosa.
 *
 * Il testo arriva da src/lib/brand-overview.ts, che genera anche
 * docs/00-brand-overview.md. Un contenuto solo, due uscite.
 */

import { cn } from '../lib/cn'
import { BRAND_OVERVIEW, type BrandOverviewContent } from '../lib/brand-overview'

export interface BrandPrinciplesProps {
  content?: BrandOverviewContent
  /** `bare` toglie la cornice, per quando il contenitore ce l'ha gia'. */
  variant?: 'framed' | 'bare'
  className?: string
}

export function BrandPrinciples({
  content = BRAND_OVERVIEW,
  variant = 'framed',
  className,
}: BrandPrinciplesProps) {
  const framed = variant === 'framed'

  return (
    <dl
      className={cn(
        'm-0',
        framed
          ? 'rounded-lg border border-border-subtle bg-bg-surface'
          : 'flex flex-col gap-6',
        className,
      )}
    >
      {content.blocks.map((block) => (
        <div
          key={block.label}
          className={cn(
            'flex flex-col gap-2',
            framed && 'border-b border-border-subtle p-6 last:border-0',
          )}
        >
          <dt className="type-mono-md text-text-muted">{block.label}</dt>

          <dd className="m-0 flex max-w-prose flex-col gap-2 text-body-md text-text-secondary">
            {block.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default BrandPrinciples
