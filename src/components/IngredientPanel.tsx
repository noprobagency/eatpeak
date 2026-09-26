/**
 * <IngredientPanel /> — la tabella nutrizionale.
 *
 * QUANDO USARLO: pagina prodotto e pagina formula, sempre visibile o dentro
 * una tab. Mai dentro un accordion chiuso di default se e' l'unico posto dove
 * compare la composizione.
 * QUANDO NO: come sostituto dell'etichetta legale. Questa e' la versione
 * leggibile; l'etichetta di legge sta sul pack e non si riscrive.
 *
 * Tutta la tabella e' in mono, intestazioni comprese: sono dati, e i dati nel
 * sistema di peak hanno una voce sola. Dove il dato non c'e' ancora, il tag
 * grigio [dal laboratorio] lo dice: non si inventa un numero.
 */

import { cn } from '../lib/cn'
import { INGREDIENTS_LINE, NUTRITION_ROWS, isLabPlaceholder } from '../lib/copy'
import { LabTag, renderWithPlaceholders } from './LabTag'

export interface IngredientRow {
  label: string
  perStick: string
  perDay?: string
  /** Percentuale dei valori nutritivi di riferimento, dove esiste. */
  vnr?: string
}

export interface IngredientPanelProps {
  rows?: readonly IngredientRow[]
  /** Intestazioni delle colonne di valori. */
  headers?: [string, string, string]
  /** Elenco ingredienti in chiaro, sotto la tabella. */
  ingredients?: string
  /** Avvertenze di legge. */
  warning?: string
  className?: string
}

function Cell({ value, what }: { value: string; what: string }) {
  if (isLabPlaceholder(value)) return <LabTag what={what} />
  return <>{value}</>
}

export function IngredientPanel({
  rows = NUTRITION_ROWS,
  headers = ['Per stick', 'Per giorno', '%VNR*'],
  ingredients = INGREDIENTS_LINE,
  warning = 'Non superare la dose giornaliera consigliata. Tenere fuori dalla portata dei bambini sotto i tre anni. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano.',
  className,
}: IngredientPanelProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border-default bg-bg-surface', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="border-b border-border-default px-6 py-4 text-left type-eyebrow text-text-primary">
            Valori nutrizionali · dose giornaliera: uno stick
          </caption>
          <thead>
            <tr className="border-b border-border-subtle">
              <th scope="col" className="px-6 py-3 type-label text-text-muted">Composizione</th>
              {headers.map((h) => (
                <th key={h} scope="col" className="px-6 py-3 text-right type-label text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border-subtle last:border-0">
                <th scope="row" className="px-6 py-3 text-body-sm font-display font-bold text-text-primary">{row.label}</th>
                <td className="px-6 py-3 text-right font-mono text-mono-md tabular-nums text-text-secondary"><Cell value={row.perStick} what={row.label} /></td>
                <td className="px-6 py-3 text-right font-mono text-mono-md tabular-nums text-text-secondary"><Cell value={row.perDay ?? row.perStick} what={row.label} /></td>
                <td className="px-6 py-3 text-right font-mono text-mono-md tabular-nums text-text-secondary"><Cell value={row.vnr ?? '—'} what={`${row.label} %VNR`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border-default px-6 py-5">
        <p className="type-label text-text-muted">Ingredienti</p>
        <p className="text-body-sm leading-loose text-text-secondary">{renderWithPlaceholders(ingredients, 'ingredienti')}</p>
        <p className="text-body-sm text-text-muted">{warning}</p>
        <p className="text-body-sm text-text-muted">* VNR: valori nutritivi di riferimento. I claim sulla vitamina D valgono solo sopra il 15% dei VNR per dose giornaliera.</p>
      </div>
    </div>
  )
}

export default IngredientPanel
