/**
 * <PackBack /> — il segnaposto del retro della busta.
 *
 * QUANDO USARLO: nello Showcase e nella pagina prototipi, come promemoria di
 * cosa il retro deve contenere per legge. Non e' il retro: e' l'elenco.
 * QUANDO NO: come etichetta. L'etichetta di legge si scrive con il laboratorio
 * e con chi segue la notifica al Ministero, non partendo da qui.
 *
 * I valori sono tutti [dal laboratorio], e si vede.
 */

import { cn } from '../lib/cn'
import { LabTag } from './LabTag'
import { PRODUCT, flavorById, type FlavorId } from '../lib/copy'
import { EFSA_CLAIMS } from '../lib/compliance'

export interface PackBackProps {
  flavor?: FlavorId
  className?: string
}

const REQUIRED = [
  { label: 'Denominazione', value: 'Integratore alimentare', lab: false },
  { label: 'Nome esteso', value: PRODUCT.extendedName, lab: false },
  { label: 'Ingredienti', value: 'In ordine decrescente di peso', lab: true },
  { label: 'Tabella nutrizionale', value: 'Per stick e per dose giornaliera, con %VNR della vitamina D3', lab: true },
  { label: 'Claim creatina', value: EFSA_CLAIMS['physical-performance'].it, lab: false },
  { label: 'Claim vitamina D', value: 'Uno o piu dei quattro autorizzati, solo se la dose supera il 15% dei VNR', lab: true },
  { label: 'Dose giornaliera', value: `${PRODUCT.dose} ${PRODUCT.doseUnit} di creatina: uno stick al giorno`, lab: false },
  { label: 'Avvertenze', value: 'Non superare la dose giornaliera consigliata. Tenere fuori dalla portata dei bambini sotto i tre anni. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano.', lab: false },
  { label: 'Conservazione', value: 'A temperatura ambiente, al riparo dalla luce', lab: false },
  { label: 'Responsabile', value: 'Ragione sociale e indirizzo dell operatore', lab: true },
  { label: 'Lotto e scadenza', value: 'Stampati in variabile', lab: true },
  { label: 'Contenuto netto', value: `${PRODUCT.sticksPerBag} stick · peso netto`, lab: true },
] as const

export function PackBack({ flavor = 'arancia', className }: PackBackProps) {
  const f = flavorById(flavor)
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border-subtle bg-bg-surface', className)}>
      <div className={cn('flex items-center justify-between gap-4 px-6 py-4', f.tintToken)}>
        <p className="type-eyebrow text-text-primary">Retro · contenuti obbligatori</p>
        <LabTag what="fustella e valori">provvisorio</LabTag>
      </div>
      <dl className="m-0 divide-y divide-border-subtle">
        {REQUIRED.map((row) => (
          <div key={row.label} className="grid gap-2 px-6 py-4 sm:grid-cols-[180px_1fr]">
            <dt className="type-label text-text-muted">{row.label}</dt>
            <dd className="m-0 flex flex-wrap items-center gap-2 text-body-sm text-text-secondary">
              <span>{row.value}</span>
              {row.lab && <LabTag what={row.label} />}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default PackBack
