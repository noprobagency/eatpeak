/**
 * Home — la prima pagina del sito (3.0).
 *
 * Costruita sezione per sezione sui reference (docs/10-riferimenti-sezioni.md),
 * con i sei archetipi di src/site/sections e mai due uguali di fila:
 *
 *   H1 hero campo ambra (A+F) → H2 barra numeri (C) → H3 statement (D)
 *   → H4 il gesto in 3 passi (B/E) → H5 ingredienti (E) → H6 il rituale (A lime)
 *   → H7 gusti (A, due tile) → H8 confronto (E) → H9 la co-fondatrice (B)
 *   → H10 recensioni (F) → H11 standard (C/E) → H12 offerta (C + tier)
 *   → H13 garanzia (E) → H14 FAQ (E) → H15 footer ambra (A, in SiteFooter)
 *
 * Ogni sezione ha `data-ref`: con ?ref=1 compare l'etichetta del reference.
 * Il copy e' una bozza (src/lib/copy.ts) presa dai reference: va riscritto.
 * Le foto non ci sono: i <MediaPlaceholder /> tengono il posto con il brief.
 */

import { useState } from 'react'
import {
  Accordion, Badge, BustaPack, Button, Container, Em, Glass, LabTag, MediaPlaceholder,
  PriceTiers, Section, SectionHeader, StockCounter,
} from '../components'
import { DayDot, HandDot, Icon } from '../brand'
import { OrangeHalf, OrangeSlice, LimeHalf, MintLeaf } from '../components/pack/Fruit'
import { ColorField, Editorial, Numbers, Rows, Statement } from '../site/sections'
import { Ritual } from '../site/Ritual'
import { authorizedClaimText, EFSA_CLAIMS } from '../lib/compliance'
import {
  CLAIMS, COMPARISON, DEFAULT_TIER, EXPERT, EXPERT_VIDEOS, FAQ, FLAVORS, GUARANTEE, INGREDIENTS,
  OFFER_NOTES, PRICE_TIERS, PRODUCT, REVIEWS, STANDARDS, STEPS, formatEur, isLabPlaceholder, pricePerDay,
} from '../lib/copy'
import { shotById } from '../lib/media'
import { to } from '../lib/routes'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// Pezzi locali della home
// ---------------------------------------------------------------------------

/** Le tre spunte di fiducia: pallini, non check. Sull'ambra 400 in cacao. */
function Trust({ items, tone = 'brand' }: { items: readonly string[]; tone?: 'brand' | 'color' | 'light' }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((t) => (
        <li key={t} className={cn('flex items-center gap-2 text-body-sm font-display font-bold', tone === 'brand' ? 'text-text-on-brand' : tone === 'color' ? 'text-neutral-0' : 'text-text-primary')}>
          <DayDot state="done" size={12} onColor={tone === 'color'} onBrand={tone === 'brand'} />
          {t}
        </li>
      ))}
    </ul>
  )
}

/** Un mini contatore a punti: dodici pallini, quelli venduti chiari. */
function MiniStock({ sold, total }: { sold: number; total: number }) {
  const dots = 24
  const taken = Math.round((sold / total) * dots)
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: dots }, (_, i) => (
        <span key={i} className={cn('h-[6px] w-[6px] rounded-full bg-bg-brand-deep', i < taken && 'opacity-30')} />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// La pagina
// ---------------------------------------------------------------------------

export function Home() {
  const [tier, setTier] = useState(DEFAULT_TIER)
  const selected = PRICE_TIERS.find((t) => t.units === tier) ?? PRICE_TIERS[0]
  const rituale = PRICE_TIERS.find((t) => t.id === 'rituale') ?? PRICE_TIERS[2]

  return (
    <>
      {/* --- H1 · hero campo ambra ----------------------------------------- */}
      <ColorField
        id="hero"
        tone="brand"
        spacing="loose"
        dataRef="Cure · hero + Create · gerarchia"
        className="lg:pb-16"
        bleed={
          <>
            <svg className="absolute -right-16 -top-10 hidden h-[260px] w-[260px] lg:block" viewBox="0 0 260 260" aria-hidden="true">
              <OrangeHalf cx={150} cy={110} r={120} rotate={-14} />
            </svg>
            <svg className="absolute -bottom-16 left-[55%] hidden h-[180px] w-[180px] lg:block" viewBox="0 0 200 200" aria-hidden="true">
              <OrangeSlice cx={100} cy={100} r={84} rotate={24} />
            </svg>
          </>
        }
      >
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="type-eyebrow text-text-on-brand">Creatina + glicina + vitamina D3</p>
            <h1 className="type-display-xl text-text-on-brand">la creatina, <Em>evoluta</Em>.</h1>
            <p className="max-w-prose text-heading-md font-normal text-text-on-brand md:text-[24px] md:leading-snug">
              {CLAIMS.product.it} {CLAIMS.noLoading.it}
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Button variant="inverse" size="lg" dot as="a" href={to('/prodotto')}>Inizia il tuo rituale</Button>
              <a href={to('/sito', 'gesto')} className="peak-link text-body-md font-display font-bold text-text-on-brand">Come funziona</a>
            </div>
            <Trust items={['Made in Italy', 'Vegan', 'Nessun abbonamento']} />
            <p className="max-w-prose text-body-sm text-text-on-brand" data-compliance="authorized-claim">
              {authorizedClaimText('physical-performance')}
            </p>
          </div>

          <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
            {/* La busta grande, che sborda sotto nella sezione dopo. */}
            <div className="relative lg:translate-y-32">
              <BustaPack flavor="arancia" width={340} className="max-w-full drop-shadow-none" />
              <div className="absolute -right-20 bottom-10 hidden w-[300px] lg:block">
                <Glass tone="light" liquid radius="xl">
                  <p className="type-label text-text-brand">{rituale.name}</p>
                  <p className="mt-1 font-mono text-display-md text-text-primary">
                    €{pricePerDay(rituale.priceEur, rituale.days).replace(' €', '')}
                    <span className="ml-2 text-body-sm font-display font-semibold text-text-muted">al giorno</span>
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-body-sm text-text-secondary">
                    <MiniStock sold={612} total={1000} />
                  </p>
                  <p className="mt-1 text-body-sm text-text-secondary">
                    Lotto <span className="font-mono">01</span> · <span className="font-mono">612</span>/<span className="font-mono">1.000</span> buste <LabTag what="stock">esempio</LabTag>
                  </p>
                </Glass>
              </div>
            </div>
          </div>
        </div>
        {/* Su mobile il vetro sta in fondo. */}
        <div className="mt-10 lg:hidden">
          <Glass tone="light" liquid radius="xl">
            <p className="type-label text-text-brand">{rituale.name}</p>
            <p className="mt-1 font-mono text-display-md text-text-primary">€{pricePerDay(rituale.priceEur, rituale.days).replace(' €', '')} <span className="text-body-sm font-display font-semibold text-text-muted">al giorno</span></p>
            <p className="mt-2 text-body-sm text-text-secondary">Lotto <span className="font-mono">01</span> · <span className="font-mono">612</span>/<span className="font-mono">1.000</span> buste <LabTag what="stock">esempio</LabTag></p>
          </Glass>
        </div>
      </ColorField>

      {/* --- H2 · barra numeri -------------------------------------------- */}
      <div className="lg:pt-32">
        <Numbers
          id="numeri"
          dataRef="HIIT · striscia numeri"
          items={[
            { value: `${PRODUCT.dose} g`, label: 'creatina' },
            { value: 'D3', label: 'vitamina' },
            { value: '+', label: 'glicina' },
            { value: `${PRODUCT.sticksPerBag}`, label: 'stick' },
            { value: '0', label: 'fasi di carico' },
          ]}
        />
      </div>

      {/* --- H3 · statement del problema ---------------------------------- */}
      <Statement id="statement" dataRef="Create · never miss a day" note="Non serve sentire niente domani. Serve un gesto oggi, e la costanza fa il resto.">
        La creatina funziona. <Em>Il difficile</Em> è prenderla ogni giorno.
      </Statement>

      {/* --- H4 · il gesto in tre passi ------------------------------------ */}
      <Editorial id="gesto" dataRef="HIIT · 01 + canvas · Apri. Versa. Bevi." tone="surface" media={<MediaPlaceholder shot={shotById('gesto-stick')} radius="xl" />} mediaSide="left" mediaSpan={7}>
        <p className="type-eyebrow text-text-brand">Il gesto</p>
        <h2 className="type-display-lg text-text-primary">apri. versa. <Em>bevi</Em>.</h2>
        <p className="max-w-prose text-body-lg text-text-secondary">Nessun misurino, nessun barattolo. Il terzo punto è quello che conta: è il giorno fatto.</p>
        <Rows
          items={STEPS.map((s, i) => ({ title: s.title, body: s.body, dot: i === 2 ? 'scribble' : 'ring' }))}
        />
      </Editorial>

      {/* --- H5 · ingredienti --------------------------------------------- */}
      <Section id="ingredienti" tone="page" dataRef="HIIT · five things that work + TLS · apici">
        <Container>
          <SectionHeader eyebrow={PRODUCT.formulaLine} title={<>tre ingredienti. <Em>niente</Em> che non serva.</>} />
          <div className="mt-10">
            <Rows
              numbered
              items={INGREDIENTS.map((ing) => ({
                title: ing.name,
                body: (
                  <>
                    <p>{ing.role} {ing.body}</p>
                    {ing.claims[0] && (
                      <p className="mt-3 text-body-sm text-text-muted" data-compliance="authorized-claim">
                        {authorizedClaimText(ing.claims[0])}
                        {ing.id === 'creatina' && <sup className="ml-1 font-mono">1</sup>}
                        {ing.id === 'vitamina-d3' && <> <LabTag what="%VNR vitamina D3" /></>}
                      </p>
                    )}
                  </>
                ),
                aside: isLabPlaceholder(ing.amount) ? <LabTag size="md" what={ing.name} /> : <span className="font-mono text-display-md text-text-primary">{ing.amount}</span>,
              }))}
            />
          </div>
          <p className="mt-6 max-w-prose text-body-sm text-text-muted">
            <sup className="mr-1 font-mono">1</sup>{EFSA_CLAIMS['physical-performance'].condition}
          </p>
          <div className="mt-6">
            <a href={to('/formula')} className="peak-link text-body-md font-display font-bold text-text-brand">Leggi tutta la formula →</a>
          </div>
        </Container>
      </Section>

      {/* --- H6 · il rituale dei 30 punti ---------------------------------- */}
      <ColorField id="come-funziona" tone="lime-deep" dataRef="canvas · il rituale dei 30 punti + Create · never miss a day">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <p className="type-eyebrow text-neutral-0/90">Il rituale dei 30 punti</p>
            <h2 className="type-display-lg text-neutral-0">il giorno 30, il gesto è <Em>tuo</Em>.</h2>
            <p className="max-w-prose text-body-lg text-neutral-0/90">Ogni stick ha il suo numero. Ogni giorno, un punto. La creatina non si sente al primo stick: si accumula, e da lì in poi conta solo continuare.</p>
            <p className="max-w-prose text-body-sm text-neutral-0/80" data-compliance="authorized-claim">{authorizedClaimText('physical-performance')}</p>
          </div>
          <div className="lg:col-span-7">
            <Ritual upTo={12} />
          </div>
        </div>
      </ColorField>

      {/* --- H7 · gusti ----------------------------------------------------- */}
      <Section id="gusti" tone="page" spacing="flush" dataRef="Cure · griglia gusti + Create · descrittori" className="py-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 md:px-6">
          {FLAVORS.map((f) => (
            <div key={f.id} className={cn('relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-2xl p-8 md:p-10', f.colorToken)} data-archetype="A">
              <svg className="pointer-events-none absolute -right-16 -top-16 h-[300px] w-[300px]" viewBox="0 0 300 300" aria-hidden="true">
                {f.id === 'arancia' ? <OrangeHalf cx={170} cy={130} r={130} rotate={-14} /> : <LimeHalf cx={170} cy={130} r={124} rotate={-10} />}
              </svg>
              {f.id === 'lime' && (
                <svg className="pointer-events-none absolute -left-10 bottom-24 h-[220px] w-[220px]" viewBox="0 0 220 220" aria-hidden="true">
                  <MintLeaf cx={110} cy={110} r={170} rotate={-30} />
                </svg>
              )}
              <div className="relative">
                <p className="font-mono text-display-md text-neutral-0/90">{f.number}</p>
                <h3 className="mt-2 type-flavor-lg text-neutral-0 md:text-[44px]">{f.name}</h3>
              </div>
              <div className="relative flex items-end justify-between gap-6">
                <div className="flex max-w-[280px] flex-col gap-4">
                  <Glass tone="light" radius="lg" padding="sm">
                    <p className="text-body-sm text-text-primary">{f.taste}</p>
                  </Glass>
                  <Button variant="inverse" dot as="a" href={to('/prodotto')}>Scegli {f.name}</Button>
                </div>
                <BustaPack flavor={f.id} width={170} className="-mb-16 -mr-4 shrink-0 rotate-[-6deg]" />
              </div>
            </div>
          ))}
        </div>
        <Container>
          <p className="py-8 text-center text-body-md text-text-secondary">
            Non sai scegliere? <span className="font-display font-bold text-text-primary">Il Duo</span>: una busta per gusto, nel formato Abitudine.
          </p>
        </Container>
      </Section>

      {/* --- H8 · confronto ------------------------------------------------- */}
      <Section id="confronto" tone="surface" dataRef="Create · vs tables + Dosys · vs the rest">
        <Container width="narrow">
          <SectionHeader eyebrow="Il confronto" title={<>uno stick, <Em>non</Em> un barattolo.</>} body="Nessuno è migliore in assoluto. Questo è il formato per chi vuole prenderla ogni giorno." />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left" data-archetype="E">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="py-3 pr-4 type-label text-text-muted">&nbsp;</th>
                  {COMPARISON.columns.map((c, i) => (
                    <th key={c} className={cn('py-3 pr-4 text-heading-sm', i === 0 ? 'text-text-brand' : 'text-text-secondary')}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((row) => (
                  <tr key={row.label} className="border-b border-border-subtle">
                    <th scope="row" className="py-4 pr-4 text-body-md font-normal text-text-primary">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-4 pr-4"><DayDot state={v ? 'done' : 'todo'} size={18} label={v ? 'sì' : 'no'} /></td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="py-4 pr-4 text-body-md font-normal text-text-primary">Costo al giorno</th>
                  {COMPARISON.costPerDay.map((v, i) => (
                    <td key={i} className={cn('py-4 pr-4 font-mono text-body-md', i === 0 ? 'text-text-primary' : 'text-text-muted')}>{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-body-sm text-text-muted">Costi al giorno: il nostro è il Rituale Completo; gli altri sono ordini di grandezza di mercato <LabTag what="confronto">esempio</LabTag></p>
        </Container>
      </Section>

      {/* --- H9 · la co-fondatrice ----------------------------------------- */}
      <Editorial id="dottoressa" dataRef="TLS · advisor + Dosys · video per tema" tone="page" media={<MediaPlaceholder shot={shotById('dottoressa')} radius="xl" />} mediaSide="right" mediaSpan={5}>
        <p className="type-eyebrow text-text-brand">{EXPERT.role} · {EXPERT.title}</p>
        <blockquote className="m-0 type-display-lg text-text-primary">“la creatina non è una scorciatoia: è <Em>un’abitudine</Em>.”</blockquote>
        <p className="max-w-prose text-body-lg text-text-secondary">Il mio lavoro è spiegarla bene, non venderla. Spiega ed educa. Non raccomanda il prodotto.</p>
        <div className="grid grid-cols-3 gap-3">
          {EXPERT_VIDEOS.map((v) => (
            <div key={v.id} className="flex flex-col gap-2">
              <div className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-bg-flavor-lime-tint p-3">
                <span className="absolute left-3 top-3 type-label text-lime-700">{v.kind}</span>
                <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg-brand-deep text-neutral-0" aria-hidden="true">▶</span>
                <span className="type-label text-text-muted">Video in arrivo</span>
              </div>
              <p className="text-body-sm font-display font-bold text-text-primary">{v.title}</p>
            </div>
          ))}
        </div>
      </Editorial>

      {/* --- H10 · recensioni ---------------------------------------------- */}
      <Section id="recensioni" tone="page" spacing="flush" dataRef="HIIT · nome e quartiere + TLS · età" className="pb-20">
        <div className="relative mx-4 overflow-hidden rounded-2xl md:mx-6">
          <MediaPlaceholder shot={shotById('ambiente-scrivania')} radius="none" className="min-h-[520px]" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-4 md:p-8">
            <div className="flex flex-wrap gap-3">
              {REVIEWS.map((r) => (
                <Glass key={r.author} tone="light" liquid radius="xl" padding="sm" className="max-w-[340px]">
                  <div className="flex items-center gap-2">
                    <HandDot seed={`rev-${r.author}`} size={14} className="text-dot-done" />
                    <span className="text-body-sm font-display font-bold text-text-primary">{r.author}, <span className="font-mono">{r.age}</span> · {r.city} · {r.habit}</span>
                  </div>
                  <p className="mt-2 text-body-sm text-text-secondary">“{r.text}”</p>
                  <p className="mt-2 flex items-center gap-2 type-label text-text-muted">
                    {r.benefit}
                    {r.example && <LabTag what="recensione">esempio</LabTag>}
                  </p>
                </Glass>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* --- H11 · i nostri standard --------------------------------------- */}
      <Section id="standard" tone="brand-soft" dataRef="Blueprint · our standards + Create · quality promise">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-7">
              <p className="type-eyebrow text-text-brand">I nostri standard</p>
              <h2 className="type-display-lg text-text-primary">{STANDARDS.title.toLowerCase().replace('.', '')} <Em>ogni</Em> lotto.</h2>
              <p className="max-w-prose text-body-lg text-text-secondary">{STANDARDS.body}</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {STANDARDS.facts.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-body-md font-display font-bold text-text-primary"><HandDot seed={f} size={12} className="text-dot-done" /> {f}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-6 lg:col-span-5 lg:justify-end">
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-bg-surface p-6">
                <Badge tone="brand" variant="solid">Lotto {PRODUCT.launchLot}</Badge>
                <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-ambra-300 font-mono text-body-sm text-text-muted">QR</div>
                <p className="text-body-sm text-text-secondary">Certificato di analisi</p>
                <LabTag what="certificato del lotto">PDF in arrivo</LabTag>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- H12 · offerta -------------------------------------------------- */}
      <Section id="prezzi" tone="page" dataRef="Dosys · prezzo al giorno + Create · select your size + canvas · più punti">
        <Container width="narrow">
          <SectionHeader align="center" eyebrow="Scegli il tuo ritmo" title={<>trenta, sessanta, <Em>novanta</Em> punti.</>} body="Più punti, meno al giorno. Nessun abbonamento: riordini quando finisci." />
          <div className="mt-12">
            <StockCounter />
          </div>
          <div className="mt-12">
            <PriceTiers value={tier} onChange={setTier} />
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button size="lg" fullWidth dot as="a" href={to('/prodotto')}>
              Inizia il tuo rituale · {formatEur(selected.priceEur)}
            </Button>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-body-sm text-text-secondary">
              {OFFER_NOTES.map((n) => (
                <li key={n} className="flex items-center gap-2"><HandDot seed={n} size={10} className="text-dot-done" />{n}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* --- H13 · garanzia ------------------------------------------------- */}
      <Section id="garanzia" tone="surface" dataRef="Scandinavian Biolabs · money-back in 3 steps">
        <Container width="narrow">
          <SectionHeader eyebrow={GUARANTEE.title} title={<>se non continui, ti <Em>rimborsiamo</Em>.</>} body={GUARANTEE.intro} />
          <div className="mt-8">
            <Rows items={GUARANTEE.steps.map((s) => ({ title: s.title, body: s.body, dot: 'scribble' }))} />
          </div>
          <ul className="mt-6 flex flex-col gap-2 text-body-sm text-text-secondary">
            {GUARANTEE.conditions.map((c) => (
              <li key={c} className="flex items-start gap-2"><Icon variant="free" size={14} title="" className="mt-1 shrink-0" />{c}</li>
            ))}
          </ul>
          <a href={to('/prodotto', 'garanzia')} className="peak-link mt-6 inline-block text-body-md font-display font-bold text-text-brand">Il regolamento completo →</a>
        </Container>
      </Section>

      {/* --- H14 · domande -------------------------------------------------- */}
      <Section id="domande" tone="page" dataRef="Dosys · FAQ, il tono">
        <Container width="narrow">
          <SectionHeader eyebrow="Domande" title={<>quello che ci <Em>chiedono</Em>.</>} />
          <div className="mt-10">
            <Accordion single items={FAQ.map((e) => ({ id: e.q, title: e.q, content: e.a }))} />
          </div>
        </Container>
      </Section>
    </>
  )
}

export default Home
