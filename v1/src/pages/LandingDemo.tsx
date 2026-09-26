/**
 * LandingDemo — la landing completa.
 *
 * Serve a due cose: far vedere i componenti dentro un contesto reale, e fissare
 * l'ordine in cui il brand racconta se' stesso. Quell'ordine non e' casuale.
 *
 *   hero → prova → il problema → la narrazione → le prove → le voci → il prezzo → le domande
 *
 * Si parte dal piacere e si arriva al prezzo passando dal motivo per cui il
 * prodotto esiste: il barattolo si salta, lo stick no.
 *
 * Tutti i testi vengono da src/lib/copy.ts e sono gia' passati dal linter di
 * compliance. Non scrivere copy direttamente qui.
 */

import { useState } from 'react'
import {
  Badge, Button, Card, Container, FaqAccordion, Grid, Hero, Marquee,
  PriceTiers, ReviewCard, Section, SectionHeader, StickPack, TrustRow,
  WeekTimeline,
} from '../components'
import { Lockup } from '../brand'
import { CLAIMS, LONG_CLAIM, PRICE_TIERS, PRODUCT, REVIEWS, SHORT_CLAIM, formatEur, pricePerDay } from '../lib/copy'
import { authorizedClaimText } from '../lib/compliance'

export function LandingDemo() {
  const [tier, setTier] = useState(2)
  const selected = PRICE_TIERS.find((t) => t.units === tier) ?? PRICE_TIERS[0]

  return (
    <>
      {/* --- hero -------------------------------------------------------- */}
      <Section tone="warm" spacing="loose">
        <Container>
          <Hero
            eyebrow={`creatina monoidrato · ${PRODUCT.format}`}
            headline={SHORT_CLAIM.it.toLowerCase()}
            usesShortClaim
            authorizedClaim="physical-performance"
            body={
              <>
                {LONG_CLAIM.it[0]}
                <br />
                {LONG_CLAIM.it[2]}
              </>
            }
            actions={
              <>
                <Button size="lg" as="a" href="#prezzo">Prendi la tua confezione</Button>
                <Button size="lg" variant="ghost" as="a" href="#settimane">Come funziona</Button>
              </>
            }
            proof={<TrustRow variant="compact" />}
            visual={<StickPack height={380} />}
          />
        </Container>
      </Section>

      {/* --- la banda delle prove --------------------------------------- */}
      <Marquee tone="brand" />

      {/* --- il problema del barattolo ---------------------------------- */}
      <Section tone="page">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeader
              eyebrow="il problema"
              title="il barattolo si salta"
              body={
                <>
                  Il misurino va trovato, riempito, livellato. La polvere resta sul fondo del bicchiere. E un
                  giorno che hai fretta, salti. Poi ne salti un altro. Il barattolo non è fatto per essere
                  preso tutti i giorni: è fatto per stare su uno scaffale.
                </>
              }
            />

            <Grid cols={2}>
              {[
                { n: '1', t: 'niente misurini', d: 'La dose è già dentro. Non c’è niente da pesare.' },
                { n: '2', t: 'niente grumi', d: 'Si scioglie in qualche secondo, senza residui sul fondo.' },
                { n: '3', t: 'niente scuse', d: 'Sta in tasca, in borsa, nel cassetto della scrivania.' },
                { n: '4', t: 'sai a che punto sei', d: `${PRODUCT.days} stick, ${PRODUCT.days} giorni. Il conteggio è la confezione.` },
              ].map((item) => (
                <Card key={item.n} tone="surface" padding="md">
                  <p className="font-mono text-mono-sm uppercase text-text-muted">{item.n}</p>
                  <h3 className="mt-3 text-heading-md text-text-primary">{item.t}</h3>
                  <p className="mt-2 text-body-sm text-text-secondary">{item.d}</p>
                </Card>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* --- la narrazione delle quattro settimane ----------------------- */}
      <Section tone="forest" id="settimane">
        <Container>
          <SectionHeader
            eyebrow="cosa succede"
            title={CLAIMS.narrative.it.toLowerCase()}
            tone="inverse"
            body="La creatina non si sente al primo stick. Si accumula: i muscoli si saturano nel giro di tre o quattro settimane, e da li' in poi conta solo continuare."
            authorizedClaim="physical-performance"
          />
          <div className="mt-12">
            <WeekTimeline tone="inverse" />
          </div>
        </Container>
      </Section>

      {/* --- le prove ---------------------------------------------------- */}
      <Section tone="page">
        <Container>
          <SectionHeader eyebrow="le prove" title="quello che possiamo dimostrare" body="Fatti verificabili, non aggettivi." />
          <div className="mt-12">
            <TrustRow />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { k: `${PRODUCT.dose} g`, v: 'creatina monoidrato per stick' },
              { k: `${PRODUCT.days}`, v: 'stick per confezione' },
              { k: pricePerDay(PRODUCT.priceEur, PRODUCT.days), v: 'al giorno' },
            ].map((s) => (
              <Card key={s.v} tone="warm" padding="md">
                <p className="type-display-md text-text-primary">{s.k}</p>
                <p className="mt-2 font-mono text-mono-md uppercase text-text-muted">{s.v}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- le voci ----------------------------------------------------- */}
      <Section tone="surface">
        <Container>
          <SectionHeader eyebrow="chi la prende" title="cosa cambia davvero" />
          <div className="mt-12">
            <Grid cols={3}>
              {REVIEWS.map((r) => (
                <ReviewCard key={r.author} stars={r.stars as 4 | 5} text={r.text} author={r.author} benefit={r.benefit} verified />
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* --- il prezzo --------------------------------------------------- */}
      <Section tone="warm" id="prezzo">
        <Container width="narrow">
          <SectionHeader
            eyebrow="il formato"
            title={CLAIMS.product.it.toLowerCase()}
            align="center"
            body={`Spedizione gratuita da ${PRODUCT.freeShippingFromUnits} confezioni. Nessun abbonamento: riordini quando finisci.`}
          />

          <div className="mt-12">
            <PriceTiers value={tier} onChange={setTier} />
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button size="lg" fullWidth>
              Aggiungi al carrello — {formatEur(selected.priceEur)}
            </Button>
            <p className="font-mono text-mono-md uppercase text-text-muted">
              {pricePerDay(selected.priceEur, selected.days)} al giorno · {selected.days} giorni
            </p>
          </div>
        </Container>
      </Section>

      {/* --- le domande -------------------------------------------------- */}
      <Section tone="page">
        <Container width="narrow">
          <SectionHeader eyebrow="domande" title="quello che ci chiedono" />
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </Container>
      </Section>

      {/* --- footer ------------------------------------------------------ */}
      <Section tone="inverse" spacing="tight">
        <Container>
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div className="flex flex-col gap-4">
                <Lockup iconSize={44} logoVariant="honey-terracotta" />
                <p className="max-w-prose text-body-sm text-neutral-0/70">{CLAIMS.audience.it}</p>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-mono text-mono-sm uppercase text-neutral-0/50">Il prodotto</p>
                {['Creatina monoidrato', 'Come si prende', 'Spedizioni e resi', 'Contatti'].map((l) => (
                  <a key={l} href="#" className="text-body-sm text-neutral-0/80 transition-colors duration-fast hover:text-neutral-0">
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/*
              Il claim autorizzato compare anche qui, perché il claim corto
              compare nell'hero e nel footer del sito: l'articolo 10(3) chiede
              che la copertura sia nelle immediate vicinanze, non una volta per
              dominio.
            */}
            <div className="flex flex-col gap-3 border-t border-white/15 pt-8">
              <Badge tone="neutral" variant="soft">integratore alimentare</Badge>
              <p className="max-w-prose text-body-sm text-neutral-0/60" data-compliance="authorized-claim">
                {authorizedClaimText('physical-performance')} {authorizedClaimText('muscle-strength-55plus')}
              </p>
              <p className="max-w-prose text-body-sm text-neutral-0/50">
                Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno
                stile di vita sano. Non superare la dose giornaliera consigliata.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default LandingDemo
