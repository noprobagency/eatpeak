/**
 * Home — la prima pagina del sito.
 *
 * L'ordine in cui il brand racconta se' stesso, e non e' casuale:
 *
 *   hero → prove → il protocollo → la formula → i gusti → come funziona
 *   → la dottoressa → il rituale → il prezzo → le domande
 *
 * Si parte dalla brand line e si arriva al prezzo passando dal motivo per cui
 * il prodotto esiste: il barattolo si salta, lo stick no. Tutti i testi vengono
 * da src/lib/copy.ts e sono gia' passati dal linter di compliance.
 *
 * Le fotografie non ci sono ancora: i <MediaPlaceholder /> tengono il posto
 * con il brief dello scatto, in attesa dei prototipi finali.
 */

import { useState } from 'react'
import {
  Badge, BustaPack, Button, Card, Container, FaqAccordion, FlavorCard, Grid, Hero,
  LabTag, MediaPlaceholder, PriceTiers, ReviewCard, Section, SectionHeader,
  TrustRow, WeekTimeline,
} from '../components'
import { DotField, Icon } from '../brand'
import { authorizedClaimText } from '../lib/compliance'
import {
  CLAIMS, DEFAULT_TIER, EXPERT, FLAVORS, INGREDIENTS, LONG_CLAIM, PRICE_TIERS, PRODUCT,
  REVIEWS, formatEur, isLabPlaceholder, pricePerDay,
} from '../lib/copy'
import { shotById } from '../lib/media'
import { to } from '../lib/routes'

export function Home() {
  const [tier, setTier] = useState(DEFAULT_TIER)
  const selected = PRICE_TIERS.find((t) => t.units === tier) ?? PRICE_TIERS[0]

  return (
    <>
      {/* --- hero -------------------------------------------------------- */}
      <Section tone="page" spacing="loose">
        <Container>
          <Hero
            eyebrow={`${PRODUCT.descriptor} · ${PRODUCT.format}`}
            headline={CLAIMS.brand.it.toLowerCase().replace(/\.$/, '')}
            body={
              <>
                <span className="block text-heading-md text-text-primary">{CLAIMS.product.it}</span>
                <span className="mt-3 block">{LONG_CLAIM.it[0]} {LONG_CLAIM.it[2]}</span>
              </>
            }
            authorizedClaim="physical-performance"
            actions={
              <>
                <Button size="lg" as="a" href={to('/prodotto')}>Prendi la tua busta</Button>
                <Button size="lg" variant="ghost" as="a" href={to('/', 'come-funziona')}>Come funziona</Button>
              </>
            }
            proof={<TrustRow variant="compact" />}
            visual={
              <div className="relative w-full max-w-[520px]">
                <div className="relative overflow-hidden rounded-xl bg-bg-flavor-arancia-tint p-8 md:p-12">
                  <DotField
                    rows={4}
                    cols={12}
                    direction="right"
                    color="#E4572E"
                    opacity={[0.08, 0.28]}
                    stretch
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 w-full"
                  />
                  <div className="relative flex items-end justify-center gap-6">
                    <BustaPack flavor="lime" width={150} className="hidden translate-y-6 sm:block" />
                    <BustaPack flavor="arancia" width={260} className="drop-shadow-none" />
                  </div>
                </div>
                <p className="mt-3 text-center type-mono-sm text-text-muted">
                  render dei componenti · fotografie in arrivo
                </p>
              </div>
            }
          />
        </Container>
      </Section>

      {/* --- il protocollo: senza fase di carico, senza barattoli --------- */}
      <Section tone="page" id="protocollo">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="il protocollo"
                title={CLAIMS.noLoading.it.toLowerCase()}
                body={
                  <>
                    Il misurino va trovato, riempito, livellato. La polvere resta sul fondo. E un giorno che
                    hai fretta, salti. Poi ne salti un altro. Lo stick è già dosato: tre grammi, uno al
                    giorno, dal primo giorno. Nessuna settimana di carico, nessun barattolo sullo scaffale.
                  </>
                }
              />
              <MediaPlaceholder shot={shotById('gesto-stick')} />
            </div>

            <Grid cols={2}>
              {[
                { n: '1', t: 'niente misurini', d: 'La dose è già dentro. Non c’è niente da pesare.' },
                { n: '2', t: 'niente grumi', d: 'Si scioglie in qualche secondo, senza residui sul fondo.' },
                { n: '3', t: 'niente fase di carico', d: 'Tre grammi al giorno, dal primo giorno. La saturazione arriva da sola.' },
                { n: '4', t: 'sai a che punto sei', d: `${PRODUCT.days} stick, ${PRODUCT.days} giorni. Il conteggio è la busta.` },
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

      {/* --- la formula --------------------------------------------------- */}
      <Section tone="surface" id="formula">
        <Container>
          <SectionHeader
            eyebrow={PRODUCT.formulaLine}
            title="tre ingredienti, tre grammi, un gesto"
            body="Creatina monoidrato, glicina e vitamina D3 vegana. La formula è un sigillo di qualità, non una promessa: quello che può dire lo dicono i claim autorizzati, riga per riga."
          />
          <div className="mt-12">
            <Grid cols={3}>
              {INGREDIENTS.map((ing, i) => (
                <Card key={ing.id} tone={i === 0 ? 'arancia-tint' : 'surface'} padding="md" className="flex flex-col gap-3">
                  <p className="font-mono text-mono-sm uppercase text-text-muted">0{i + 1}</p>
                  <h3 className="text-heading-lg text-text-primary">{ing.name}</h3>
                  <p className="font-mono text-heading-lg text-text-primary">
                    {isLabPlaceholder(ing.amount) ? <LabTag size="md" what={ing.name} /> : ing.amount}
                  </p>
                  <p className="text-body-md text-text-primary">{ing.role}</p>
                  <p className="text-body-sm text-text-secondary">{ing.body}</p>
                  {ing.claims[0] && (
                    <p className="mt-auto border-t border-border-subtle pt-3 text-body-sm text-text-muted" data-compliance="authorized-claim">
                      {authorizedClaimText(ing.claims[0])}
                      {ing.id === 'vitamina-d3' && <> <LabTag what="%VNR vitamina D3" /></>}
                    </p>
                  )}
                </Card>
              ))}
            </Grid>
          </div>
          <div className="mt-8">
            <Button variant="link" as="a" href={to('/formula')}>Leggi tutta la formula →</Button>
          </div>
        </Container>
      </Section>

      {/* --- i gusti ------------------------------------------------------ */}
      <Section tone="page" id="gusti">
        <Container>
          <SectionHeader
            eyebrow="i gusti"
            title="due gusti, una busta ciascuno"
            body="Un solo colore per busta, pieno, a tutto campo. Il Duo li mette insieme: una busta per gusto, nel formato Abitudine."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FLAVORS.map((f) => (
              <FlavorCard key={f.id} flavor={f} />
            ))}
          </div>
        </Container>
      </Section>

      {/* --- come funziona ------------------------------------------------ */}
      <Section tone="inverse" id="come-funziona">
        <Container>
          <SectionHeader
            eyebrow="come funziona"
            title={CLAIMS.narrative.it.toLowerCase()}
            tone="inverse"
            body="La creatina non si sente al primo stick. Si accumula: i muscoli si saturano nel giro di tre o quattro settimane, e da lì in poi conta solo continuare."
            authorizedClaim="physical-performance"
          />
          <div className="mt-12">
            <WeekTimeline tone="inverse" />
          </div>
        </Container>
      </Section>

      {/* --- la dottoressa ------------------------------------------------ */}
      <Section tone="lime-tint" id="dottoressa">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
            <MediaPlaceholder shot={shotById('dottoressa')} className="max-w-[420px]" />
            <div className="flex flex-col gap-6">
              <p className="type-mono-md text-lime-700">{EXPERT.role} · {EXPERT.title}</p>
              <p className="type-display-sm normal-case text-text-primary">“{EXPERT.intro}”</p>
              <ul className="flex flex-col gap-3">
                {EXPERT.topics.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-body-md text-text-secondary">
                    <Icon variant="free" color="lime" size={18} title="" className="mt-1 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="text-body-sm text-text-muted">
                Spiega ed educa. Non raccomanda il prodotto: la legge non lo permette, e noi non lo chiederemmo.
              </p>
              <div>
                <Button variant="link" as="a" href={to('/formula', 'dottoressa')}>Le sue risposte →</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- il rituale --------------------------------------------------- */}
      <Section tone="warm" id="rituale">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <p className="type-mono-md text-text-muted">il rituale</p>
              <h2 className="type-display-lg text-text-primary">{CLAIMS.ritual.it.toLowerCase()}</h2>
              <p className="max-w-prose text-body-lg text-text-secondary">
                Trenta secondi la mattina, con l’acqua. Sta in tasca, in borsa, nel cassetto della scrivania.
                {' '}{CLAIMS.gesture.it}
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { k: `${PRODUCT.dose} g`, v: 'creatina per stick' },
                  { k: `${PRODUCT.days}`, v: 'stick per busta' },
                  { k: pricePerDay(selected.priceEur, selected.days), v: `al giorno · ${selected.name}` },
                ].map((s) => (
                  <div key={s.v} className="rounded-lg border border-border-subtle bg-bg-surface p-5">
                    <p className="font-mono text-heading-lg tabular-nums text-text-primary">{s.k}</p>
                    <p className="mt-1 font-mono text-mono-sm uppercase text-text-muted">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <MediaPlaceholder shot={shotById('ambiente-scrivania')} />
          </div>

          <div className="mt-16">
            <Grid cols={3}>
              {REVIEWS.map((r) => (
                <ReviewCard key={r.author} stars={r.stars as 4 | 5} text={r.text} author={r.author} benefit={r.benefit} verified />
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* --- il prezzo ---------------------------------------------------- */}
      <Section tone="page" id="prezzi">
        <Container width="narrow">
          <SectionHeader
            eyebrow="il formato"
            title={CLAIMS.product.it.toLowerCase()}
            align="center"
            body={`Una busta, ${PRODUCT.days} stick, ${PRODUCT.days} giorni. Spedizione gratuita da ${PRODUCT.freeShippingFromUnits} buste. Nessun abbonamento: riordini quando finisci.`}
          />

          <div className="mt-12">
            <PriceTiers value={tier} onChange={setTier} />
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button size="lg" fullWidth as="a" href={to('/prodotto')}>
              Scegli il gusto — {formatEur(selected.priceEur)}
            </Button>
            <p className="font-mono text-mono-md uppercase text-text-muted">
              {pricePerDay(selected.priceEur, selected.days)} al giorno · {selected.days} giorni
            </p>
            {selected.duo && <Badge tone="lime">disponibile anche in duo</Badge>}
          </div>
        </Container>
      </Section>

      {/* --- le domande --------------------------------------------------- */}
      <Section tone="surface" id="domande">
        <Container width="narrow">
          <SectionHeader eyebrow="domande" title="quello che ci chiedono" />
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </Container>
      </Section>
    </>
  )
}

export default Home
