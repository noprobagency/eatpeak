/**
 * <FlavorCard /> — un gusto, come card.
 *
 * QUANDO USARLO: la sezione gusti della home, lo Showcase, ovunque i gusti
 * vadano presentati uno accanto all'altro come famiglia.
 * QUANDO NO: per scegliere il gusto in un acquisto. Quello e' <FlavorSelector />,
 * che e' un controllo, non una presentazione.
 *
 * Legge tutto da FLAVORS: numero, nome in corsivo, colore, profondo, tint.
 * Aggiungere un gusto = aggiungere una riga, e questa card lo mostra da sola.
 */

import { DotField } from '../brand'
import { cn } from '../lib/cn'
import { flavorLabel, type Flavor } from '../lib/copy'
import { StickPack } from './StickPack'
import { renderWithPlaceholders } from './LabTag'

export interface FlavorCardProps {
  flavor: Flavor
  /** Mostra i tre valori di colore con l'hex. Per lo Showcase. */
  showSwatches?: boolean
  /** Mostra l'aroma, che finche' non arriva e' [dal laboratorio]. */
  showAroma?: boolean
  className?: string
}

export function FlavorCard({ flavor, showSwatches = false, showAroma = false, className }: FlavorCardProps) {
  return (
    <article className={cn('flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface', className)}>
      <div className={cn('relative flex items-end justify-between gap-4 p-6', flavor.colorToken)}>
        <DotField
          rows={3}
          cols={10}
          direction="right"
          stretch
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 w-full"
        />
        <div className="relative flex flex-col gap-2">
          <span className="type-display-lg text-text-on-flavor">{flavor.number}</span>
        </div>
        <StickPack flavor={flavor.id} height={150} className="relative" />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <h3 className="type-flavor text-text-primary">{flavor.name}</h3>
        <p className="type-mono-sm text-text-muted">{flavorLabel(flavor, 'short')} · 30 stick · 3 g al giorno</p>

        {showAroma && (
          <p className="text-body-sm text-text-secondary">Aroma: {renderWithPlaceholders(flavor.aroma, 'aroma')}</p>
        )}

        {showSwatches && (
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {([
              ['colore', flavor.hex],
              ['profondo', flavor.deepHex],
              ['tint', flavor.tintHex],
            ] as const).map(([name, hex]) => (
              <li key={name} className="flex flex-col gap-2">
                <span className="h-10 w-full rounded-sm border border-border-subtle" style={{ background: hex }} aria-hidden="true" />
                <span className="type-mono-sm text-text-muted">{name}</span>
                <span className="type-mono-sm text-text-primary">{hex}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default FlavorCard
