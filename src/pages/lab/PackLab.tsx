/**
 * #/lab/pack — la busta nelle tre varianti, il retro e lo stick.
 *
 * Arancia Rossa e Lime & Menta con la frutta stilizzata che sborda (stile
 * Cure) e il wordmark bianco; il Neutro senza aroma su bianco con il
 * wordmark arancia 600; il retro con i 30 cerchi da segnare a penna e lo
 * spazio foto per la garanzia. Tutto segue lo switch font. Le proporzioni
 * restano un segnaposto della fustella; la frutta e' un placeholder SVG con
 * il brief per la generazione.
 */

import { useState } from 'react'
import { BustaBack, BustaPack, Container, LabTag, Section, StickPack } from '../../components'
import { FLAVORS } from '../../lib/copy'
import { LabShell } from './LabShell'

export function PackLab() {
  const [guides, setGuides] = useState(false)
  const [fruit, setFruit] = useState(true)
  const [marked, setMarked] = useState(12)

  return (
    <LabShell
      title="laboratorio pack"
      intro="Il fronte con la frutta sovradimensionata dietro e sopra il wordmark, tagliata dai bordi. Tre varianti: Arancia Rossa, Lime & Menta e Neutro. Il retro conta: trenta cerchi a mano, uno per stick, e lo spazio per la foto della garanzia. Nessuna foto e nessuna generazione AI adesso: la frutta e' un placeholder piatto con il suo brief."
    >
      <Section tone="page" spacing="tight">
        <Container>
          <div className="flex flex-wrap items-center gap-6">
            <LabTag size="md" what="fustella">provvisorio: in attesa della fustella</LabTag>
            <label className="flex items-center gap-2 text-body-sm text-text-secondary">
              <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} /> guide
            </label>
            <label className="flex items-center gap-2 text-body-sm text-text-secondary">
              <input type="checkbox" checked={fruit} onChange={(e) => setFruit(e.target.checked)} /> frutta
            </label>
            <label className="flex items-center gap-3 text-body-sm text-text-secondary">
              giorni segnati sul retro <input type="range" min={0} max={30} value={marked} onChange={(e) => setMarked(Number(e.target.value))} /> <span className="font-mono">{marked}</span>
            </label>
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="tight" id="fronti">
        <Container>
          <h2 className="type-display-md text-text-primary">i fronti</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {FLAVORS.map((f) => (
              <figure key={f.id} className="m-0 flex flex-col items-center gap-4">
                <BustaPack flavor={f.id} width={300} showGuides={guides} fruit={fruit} className="max-w-full" />
                <figcaption className="text-center text-body-sm text-text-secondary">
                  <span className="type-flavor-sm block text-text-primary">{f.number} {f.name}</span>
                  <span className="mt-1 block text-text-muted">{f.taste}</span>
                </figcaption>
                <p className="max-w-[300px] text-body-sm text-text-muted"><span className="type-label text-text-brand">Brief frutta · </span>{f.fruitBrief}</p>
              </figure>
            ))}
            <figure className="m-0 flex flex-col items-center gap-4">
              <BustaPack flavor="arancia" variant="neutro" width={300} showGuides={guides} className="max-w-full" />
              <figcaption className="text-center text-body-sm text-text-secondary">
                <span className="type-flavor-sm block text-text-primary">Neutro</span>
                <span className="mt-1 block text-text-muted">Senza aroma. Fondo bianco, wordmark arancia 600, niente frutta e niente retino.</span>
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      <Section tone="page" spacing="tight" id="retri">
        <Container>
          <h2 className="type-display-md text-text-primary">i retri</h2>
          <p className="mt-2 max-w-prose text-body-md text-text-secondary">Trenta cerchi a mano, uno per stick. I contenuti di legge restano [dal laboratorio] e sono l’elenco di PackBack.</p>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {FLAVORS.map((f) => (
              <BustaBack key={f.id} flavor={f.id} width={300} marked={marked} className="max-w-full" />
            ))}
            <BustaBack flavor="arancia" variant="neutro" width={300} marked={marked} className="max-w-full" />
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="tight" id="stick">
        <Container>
          <h2 className="type-display-md text-text-primary">gli stick</h2>
          <div className="mt-8 flex flex-wrap items-end gap-10">
            {FLAVORS.map((f) => (
              <StickPack key={f.id} flavor={f.id} height={420} />
            ))}
          </div>
        </Container>
      </Section>
    </LabShell>
  )
}

export default PackLab
