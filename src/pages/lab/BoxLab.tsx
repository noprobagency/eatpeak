/**
 * #/lab/box — i sei archetipi di sezione, uno sotto l'altro.
 *
 * A campo colore, B editoriale, C numeri, D statement, E righe, F vetro. Le
 * pagine usano solo questi. In fondo, la stessa sequenza dentro una cornice
 * da 390px (un iframe della pagina con `?frame=1`), per vederla mobile.
 */

import { Button, BustaPack, Container, Em, Glass, MediaPlaceholder, Section } from '../../components'
import { DayDot, HandDot } from '../../brand'
import { ColorField, Editorial, Numbers, Rows, Statement } from '../../site/sections'
import { CLAIMS, PRODUCT } from '../../lib/copy'
import { shotById } from '../../lib/media'
import { LabShell } from './LabShell'

function Label({ letter, title, when }: { letter: string; title: string; when: string }) {
  return (
    <Container>
      <div className="flex flex-wrap items-baseline gap-3 py-6">
        <span className="font-mono text-display-md text-text-brand">{letter}</span>
        <span className="type-display-sm text-text-primary">{title}</span>
        <span className="text-body-sm text-text-muted">{when}</span>
      </div>
    </Container>
  )
}

export function Archetypes() {
  return (
    <>
      <Label letter="A" title="campo colore" when="hero, gusti, footer, una banda a metà pagina" />
      <ColorField
        tone="brand-deep"
        bleed={<BustaPack flavor="arancia" width={220} className="absolute -bottom-16 right-[8%] rotate-[-4deg]" />}
      >
        <div className="max-w-[620px]">
          <p className="type-eyebrow text-neutral-0/90">Creatina + glicina + vitamina D3</p>
          <h2 className="mt-3 type-display-xl">la creatina, <Em>evoluta</Em>.</h2>
          <p className="mt-6 max-w-prose text-body-lg text-neutral-0/90">{CLAIMS.product.it} {CLAIMS.noLoading.it}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="inverse" size="lg" dot>Inizia il tuo rituale</Button>
            <a href="#/" className="peak-link self-center text-body-md font-display font-bold text-neutral-0">Come funziona</a>
          </div>
          <div className="mt-10 max-w-[360px]">
            <Glass tone="light" liquid>
              <p className="type-label text-text-brand">Rituale Completo</p>
              <p className="mt-1 font-mono text-display-md text-text-primary">€0,94 <span className="text-body-sm font-display font-semibold text-text-muted">al giorno</span></p>
              <p className="mt-2 text-body-sm text-text-secondary">Lotto <span className="font-mono">01</span> · <span className="font-mono">612</span>/<span className="font-mono">1.000</span> (esempio)</p>
            </Glass>
          </div>
        </div>
      </ColorField>
      <div className="h-16" aria-hidden="true" />

      <Label letter="B" title="editoriale" when="il gesto, la co-fondatrice" />
      <Editorial media={<MediaPlaceholder shot={shotById('gesto-stick')} radius="xl" />} mediaSide="left" mediaSpan={7}>
        <p className="type-eyebrow text-text-brand">Il gesto</p>
        <h2 className="type-display-lg text-text-primary">apri. versa. <Em>bevi</Em>.</h2>
        <p className="max-w-prose text-body-lg text-text-secondary">Nessun misurino, nessun barattolo. Il terzo punto è quello che conta: è il giorno fatto.</p>
      </Editorial>

      <Label letter="C" title="numeri" when="barra numeri, prezzo al giorno" />
      <Numbers
        items={[
          { value: '3 g', label: 'creatina' },
          { value: 'D3', label: 'vitamina' },
          { value: '30', label: 'stick' },
          { value: '0', label: 'fasi di carico' },
        ]}
      />

      <Label letter="D" title="statement" when="una frase manifesto, da sola" />
      <Statement note="Non serve sentire niente domani. Serve un gesto oggi.">
        La creatina funziona. <Em>Il difficile</Em> è prenderla ogni giorno.
      </Statement>

      <Label letter="E" title="righe" when="ingredienti, passi, garanzia, FAQ" />
      <Section tone="page" spacing="tight">
        <Container>
          <Rows
            items={[
              { title: 'Apri lo stick del giorno', body: 'È numerato: sai sempre a che punto sei.', dot: 'ring' },
              { title: 'Versa in 300 ml d’acqua', body: 'Fredda. Agita e bevi subito: sa di spremuta.', dot: 'ring' },
              { title: 'Bevi. Segna il punto.', body: 'Oggi è fatto. Domani, il prossimo numero.', dot: 'scribble', aside: <DayDot state="today" size={28} label="oggi" /> },
            ]}
          />
        </Container>
      </Section>

      <Label letter="F" title="vetro" when="solo sopra colore o immagine" />
      <ColorField tone="lime-deep" spacing="tight">
        <div className="flex flex-wrap items-center gap-6">
          <Glass tone="light" liquid radius="xl">
            <p className="type-label text-text-brand">Giorno</p>
            <p className="font-mono text-display-md text-text-primary">12<span className="text-body-md text-text-muted"> / 30</span></p>
          </Glass>
          <Glass tone="onColor" radius="full" padding="sm">
            <div className="flex items-center gap-3 px-2">
              <HandDot seed="chip" size={14} className="text-neutral-0" />
              <span className="text-body-sm font-display font-bold">Giulia, 47 · Bologna</span>
              <span className="text-body-sm text-neutral-0/80">“Il barattolo lo saltavo. Lo stick no.”</span>
            </div>
          </Glass>
          <Glass tone="light" radius="full" padding="sm">
            <div className="flex items-center gap-3 px-2 text-body-sm font-display font-bold text-text-primary">
              <DayDot state="done" size={14} /> {PRODUCT.dose} g · <span className="font-mono">€0,94</span>/giorno
            </div>
          </Glass>
        </div>
      </ColorField>
    </>
  )
}

export function BoxLab() {
  const framed = new URLSearchParams(window.location.search).get('frame') === '1'
  if (framed) {
    return (
      <div className="pb-16">
        <Archetypes />
      </div>
    )
  }
  return (
    <LabShell
      title="laboratorio sezioni"
      intro="Sei archetipi e basta: campo colore, editoriale, numeri, statement, righe, vetro. Card bianche col bordo solo dove gli elementi si confrontano. Mai due sezioni consecutive con lo stesso archetipo e lo stesso allineamento; almeno un elemento che sborda per pagina."
    >
      <Archetypes />
      <Section tone="surface">
        <Container>
          <h2 className="type-display-md text-text-primary">a 390px</h2>
          <p className="mt-2 text-body-md text-text-secondary">La stessa sequenza, mobile.</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle bg-bg-page" style={{ width: 390, height: 900 }}>
            <iframe title="Archetipi a 390px" src="/?frame=1#/lab/box" width={390} height={900} className="block border-0" />
          </div>
        </Container>
      </Section>
    </LabShell>
  )
}

export default BoxLab
