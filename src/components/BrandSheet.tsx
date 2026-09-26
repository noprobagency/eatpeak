/**
 * <BrandSheet /> — la scheda del brand in una card.
 *
 * QUANDO USARLO: in cima allo Showcase, come sezione 00. E' la scheda che si
 * legge in due minuti: brand line, product line, posizionamento in due righe,
 * target in una, tono in tre parole, cosa non siamo, la gerarchia dei claim.
 * QUANDO NO: come copy di vendita. Il posizionamento esteso resta in docs/00,
 * e il copy pubblicabile in src/lib/copy.ts.
 *
 * Il testo arriva da src/lib/brand-overview.ts, che genera anche il doc 00.
 */

import { cn } from '../lib/cn'
import { BRAND_SHEET } from '../lib/brand-overview'
import { CLAIMS, CLAIM_HIERARCHY } from '../lib/copy'

export interface BrandSheetProps {
  className?: string
}

export function BrandSheet({ className }: BrandSheetProps) {
  return (
    <div className={cn('grid gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle lg:grid-cols-[1.1fr_1fr]', className)}>
      <div className="flex flex-col gap-4 bg-bg-surface p-6">
        <div className="flex flex-col gap-1">
          <span className="type-mono-sm text-text-muted">brand line</span>
          <p className="type-display-sm normal-case text-text-primary">{CLAIMS.brand.it} <span className="text-body-sm font-normal normal-case text-text-muted">{CLAIMS.brand.en}</span></p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="type-mono-sm text-text-muted">product line</span>
          <p className="text-heading-md text-text-primary">{CLAIMS.product.it}</p>
        </div>

        <dl className="m-0 flex flex-col gap-3 border-t border-border-subtle pt-4">
          {BRAND_SHEET.map((row) => (
            <div key={row.label} className="grid gap-1 sm:grid-cols-[140px_1fr]">
              <dt className="type-mono-sm text-text-muted">{row.label}</dt>
              <dd className="m-0 text-body-sm text-text-secondary">{row.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-3 bg-bg-page p-6">
        <span className="type-mono-sm text-text-muted">gerarchia dei claim</span>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {CLAIM_HIERARCHY.map((c, i) => (
            <li key={c.key} className="grid gap-1 sm:grid-cols-[140px_1fr]">
              <span className="type-mono-sm text-text-muted">
                {String(i + 1).padStart(2, '0')} · {c.role}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-body-md text-text-primary">{CLAIMS[c.key].it}</span>
                <span className="text-body-sm text-text-muted">{CLAIMS[c.key].en} — {c.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default BrandSheet
