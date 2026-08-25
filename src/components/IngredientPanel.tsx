/**
 * <IngredientPanel /> — la tabella nutrizionale.
 *
 * QUANDO USARLO: pagina prodotto, sempre visibile o dentro una tab. Mai dentro
 * un accordion chiuso di default se e' l'unico posto dove compare la
 * composizione.
 * QUANDO NO: come sostituto dell'etichetta legale. Questa e' la versione
 * leggibile; l'etichetta di legge sta sul pack e non si riscrive.
 *
 * Tutta la tabella e' in mono, intestazioni comprese: sono dati, e i dati nel
 * sistema di peak hanno una voce sola.
 */

import { cn } from '../lib/cn'
import { NUTRITION_ROWS } from '../lib/copy'

export interface IngredientRow {
  label: string
  perStick: string
  perDay?: string
}

export interface IngredientPanelProps {
  rows?: readonly IngredientRow[]
  /** Intestazioni delle due colonne di valori. */
  headers?: [string, string]
  /** Elenco ingredienti in chiaro, sotto la tabella. */
  ingredients?: string
  /** Avvertenze di legge. */
  warning?: string
  className?: string
}

export function IngredientPanel({
  rows = NUTRITION_ROWS,
  headers = ['PER STICK', 'PER GIORNO'],
  ingredients = 'Creatina monoidrato (100%).',
  warning = 'Non superare la dose giornaliera consigliata. Tenere fuori dalla portata dei bambini sotto i tre anni. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano.',
  className,
}: IngredientPanelProps) {
  return (
    <div className={cn('rounded-lg border border-border-default bg-bg-surface', className)}>
      <table className="w-full border-collapse text-left">
        <caption className="border-b border-border-default px-6 py-4 text-left font-mono text-mono-md uppercase text-text-primary">
          Valori nutrizionali
        </caption>
        <thead>
          <tr className="border-b border-border-subtle">
            <th scope="col" className="px-6 py-3 font-mono text-mono-sm uppercase font-normal text-text-muted">
              Composizione
            </th>
            <th scope="col" className="px-6 py-3 text-right font-mono text-mono-sm uppercase font-normal text-text-muted">
              {headers[0]}
            </th>
            <th scope="col" className="px-6 py-3 text-right font-mono text-mono-sm uppercase font-normal text-text-muted">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border-subtle last:border-0">
              <th scope="row" className="px-6 py-3 font-mono text-mono-md uppercase font-normal text-text-primary">
                {row.label}
              </th>
              <td className="px-6 py-3 text-right font-mono text-mono-md tabular-nums text-text-secondary">
                {row.perStick}
              </td>
              <td className="px-6 py-3 text-right font-mono text-mono-md tabular-nums text-text-secondary">
                {row.perDay ?? row.perStick}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 border-t border-border-default px-6 py-5">
        <p className="font-mono text-mono-sm uppercase text-text-muted">Ingredienti</p>
        <p className="text-body-sm text-text-secondary">{ingredients}</p>
        <p className="text-body-sm text-text-muted">{warning}</p>
      </div>
    </div>
  )
}

export default IngredientPanel
