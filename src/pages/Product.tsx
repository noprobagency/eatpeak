/**
 * Product — la pagina prodotto (PDP), 3.0.
 *
 * Sezione per sezione sui reference (docs/10-riferimenti-sezioni.md):
 *
 *   P1 breadcrumb → P2 galleria con lo switch gusto di vetro → P3 buy box
 *   a step numerati → P4 "e' per me?" → P5 barra numeri → P6 tab → P7
 *   ingredienti + tabella → P8 i 30/60/90 giorni a punti → P9 confronto
 *   compatto → P10 co-fondatrice + video → P11 recensioni con filtri → P12
 *   garanzia → P13 FAQ + prima di ordinare → P14 sticky add-to-cart di vetro
 *
 * Chi arriva qui ha gia' deciso di valutare il prodotto: sopra ci sono il
 * gusto, i giorni, il prezzo al giorno e il pulsante; sotto i dettagli. Le
 * foto non ci sono: i <MediaPlaceholder /> tengono il posto con il brief.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accordion, Badge, BustaBack, BustaPack, Button, Container, Em, Glass, IngredientPanel, LabTag,
  MediaPlaceholder, PackBack, PriceTiers, Section, SectionHeader, StickPack, Tabs, Toast, ToastStack,
} from '../components'
import { DayDot, HandDot } from '../brand'
import { LimeHalf, MintLeaf, OrangeHalf, OrangeSlice } from '../components/pack/Fruit'
import { Editorial, Numbers, Rows } from '../site/sections'
import { authorizedClaimText, EFSA_CLAIMS } from '../lib/compliance'
import {
  CLAIMS, COMPARISON, DEFAULT_TIER, EXPERT, EXPERT_VIDEOS, FAQ, FLAVORS, GUARANTEE, INGREDIENTS,
  OFFER_NOTES, PRICE_TIERS, PRODUCT, PROFILES, REVIEWS, flavorById, flavorLabel, formatEur,
  isLabPlaceholder, pricePerDay, type FlavorId,
} from '../lib/copy'
import { shotById } from '../lib/media'
import { cn } from '../lib/cn'
import { to } from '../lib/routes'

// ---------------------------------------------------------------------------
// La galleria
// ---------------------------------------------------------------------------

type View = 'busta' | 'stick' | 'gesto' | 'dentro' | 'retro' | 'cofondatrice'

const VIEWS: ReadonlyArray<{ id: View; label: string }> = [
  { id: 'busta', label: 'La busta' },
  { id: 'stick', label: 'Lo stick' },
  { id: 'gesto', label: 'Il gesto' },
  { id: 'dentro', label: 'Cosa c’è dentro' },
  { id: 'retro', label: 'Il retro' },
  { id: 'cofondatrice', label: 'La co-fondatrice' },
]

function Inside({ flavor }: { flavor: FlavorId }) {
  const f = flavorById(flavor)
  return (
    <div className={cn('flex h-full flex-col justify-center gap-4 rounded-xl p-8', f.tintToken)}>
      <p className="type-eyebrow text-text-brand">Cosa c’è dentro, per stick</p>
      {INGREDIENTS.map((ing, i) => (
        <div key={ing.id} className="flex items-baseline justify-between gap-4 border-b border-cacao-900/10 py-3">
          <span className="flex items-center gap-3 text-heading-sm text-text-primary"><span className="font-mono text-text-brand">0{i + 1}</span>{ing.name}</span>
          <span className="font-mono text-heading-md text-text-primary">{isLabPlaceholder(ing.amount) ? <LabTag what={ing.name} /> : ing.amount}</span>
        </div>
      ))}
      <p className="text-body-sm text-text-muted">Aromi naturali {f.name.toLowerCase()} <LabTag what="aromi" /></p>
    </div>
  )
}

function Gallery({ flavor, onFlavor }: { flavor: FlavorId; onFlavor: (id: FlavorId) => void }) {
  const [view, setView] = useState<View>('busta')
  const f = flavorById(flavor)

  const main = useMemo(() => {
    switch (view) {
      case 'busta':
        return (
          <div className={cn('relative flex h-full items-center justify-center overflow-hidden rounded-xl p-10 md:p-16', f.tintToken)}>
            <svg className="pointer-events-none absolute -left-16 -top-14 h-[260px] w-[260px]" viewBox="0 0 260 260" aria-hidden="true">
              {flavor === 'arancia' ? <OrangeHalf cx={130} cy={130} r={110} rotate={-16} /> : <LimeHalf cx={130} cy={130} r={104} rotate={-8} />}
            </svg>
            <svg className="pointer-events-none absolute -bottom-12 -right-10 h-[220px] w-[220px]" viewBox="0 0 220 220" aria-hidden="true">
              {flavor === 'arancia' ? <OrangeSlice cx={110} cy={110} r={92} rotate={24} /> : <MintLeaf cx={110} cy={110} r={170} rotate={30} />}
            </svg>
            <Badge tone={flavor === 'lime' ? 'lime' : 'brand'} variant="solid" className="absolute left-6 top-6">{PRODUCT.days} giorni</Badge>
            <BustaPack flavor={flavor} width={300} className="relative max-w-full" />
          </div>
        )
      case 'stick':
        return (
          <div className={cn('flex h-full items-center justify-center rounded-xl p-10', f.tintToken)}>
            <StickPack flavor={flavor} height={440} />
          </div>
        )
      case 'gesto':
        return <MediaPlaceholder shot={shotById('gesto-stick')} radius="xl" className="h-full" />
      case 'dentro':
        return <Inside flavor={flavor} />
      case 'retro':
        return (
          <div className={cn('flex h-full items-center justify-center rounded-xl p-10', f.tintToken)}>
            <BustaBack flavor={flavor} width={300} marked={12} className="max-w-full" />
          </div>
        )
      case 'cofondatrice':
        return <MediaPlaceholder shot={shotById('dottoressa')} radius="xl" className="h-full" />
    }
  }, [view, flavor, f.tintToken])

  return (
    <div className="flex flex-col gap-4" data-ref="Create · galleria PDP">
      <div className="relative aspect-[4/5] md:aspect-square">
        <div className="h-full">{main}</div>
        {/* Lo switch gusto di vetro, flottante in basso. */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Glass tone="light" liquid radius="full" padding="none">
            <div className="flex items-center gap-1 p-1" role="radiogroup" aria-label="Il gusto">
              {FLAVORS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={x.id === flavor}
                  onClick={() => onFlavor(x.id)}
                  className={cn('flex items-center gap-2 rounded-full px-3 py-2 text-body-sm font-display font-bold transition-colors', x.id === flavor ? 'bg-bg-surface text-text-primary' : 'text-text-secondary hover:text-text-primary')}
                >
                  <span className={cn('h-3 w-3 rounded-full', x.colorToken)} aria-hidden="true" />
                  {x.shortName}
                </button>
              ))}
            </div>
          </Glass>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2" role="tablist" aria-label="Immagini del prodotto">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={cn('flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border p-1 text-center transition-colors', view === v.id ? 'border-arancia-600 bg-bg-surface' : 'border-border-subtle bg-bg-page hover:border-border-strong')}
          >
            <span className="text-[11px] font-display font-bold leading-tight text-text-secondary">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// I 30 / 60 / 90 giorni a punti (P8)
// ---------------------------------------------------------------------------

function NinetyDays({ selectedDays }: { selectedDays: number }) {
  const blocks = [
    { days: 30, title: 'il gesto', body: 'I primi trenta punti. Un momento che hai già, ogni mattina.' },
    { days: 60, title: 'l’abitudine', body: 'Non ci pensi più: lo stick sta dove sta l’acqua.' },
    { days: 90, title: 'il rituale', body: 'La busta è finita tre volte. Il rituale no.' },
  ]
  return (
    <div className="flex flex-col gap-6" data-ref="Create · 2–3 weeks, no loading">
      <div className="grid gap-3 sm:grid-cols-3">
        {blocks.map((b, bi) => (
          <div key={b.days} className={cn('rounded-2xl p-4', b.days <= selectedDays ? 'bg-bg-flavor-arancia-tint' : 'bg-bg-raised')}>
            <svg viewBox="0 0 150 30" className="block h-auto w-full" aria-hidden="true">
              {Array.from({ length: 30 }, (_, i) => (
                <circle key={i} cx={(i % 15) * 10 + 5} cy={Math.floor(i / 15) * 12 + 8} r={3.4} fill={b.days <= selectedDays ? 'var(--dot-done)' : 'var(--color-cacao-300)'} />
              ))}
            </svg>
            <p className="mt-3 flex items-baseline gap-2 text-heading-sm text-text-primary"><span className="font-mono">{bi === 0 ? 1 : blocks[bi - 1].days + 1}–{b.days}</span> {b.title}</p>
            <p className="mt-1 text-body-sm text-text-secondary">{b.body}</p>
          </div>
        ))}
      </div>
      <p className="text-body-sm text-text-muted" data-compliance="authorized-claim">
        Nessuna fase di carico: tre grammi al giorno, dal primo giorno. {authorizedClaimText('physical-performance')}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Lo sticky add-to-cart di vetro (P14)
// ---------------------------------------------------------------------------

function StickyBar({ watch, flavor, tierName, days, priceEur, onAdd }: {
  watch: React.RefObject<HTMLDivElement>; flavor: FlavorId; tierName: string; days: number; priceEur: number; onAdd: () => void
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const target = watch.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [watch])
  const f = flavorById(flavor)
  return (
    <div
      aria-hidden={!visible}
      className={cn('fixed inset-x-2 bottom-2 z-40 transition-transform duration-base ease-standard md:inset-x-6', visible ? 'translate-y-0' : 'translate-y-[120%]')}
      data-ref="Create · sticky ATC"
    >
      <div className={cn('rounded-xl p-1', f.colorToken)}>
        <Glass tone="light" liquid radius="lg" padding="sm">
          <div className="flex items-center gap-4">
            <span className={cn('h-4 w-4 shrink-0 rounded-full', f.colorToken)} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-display font-bold text-text-primary">{f.shortName} · {tierName}</p>
              <p className="truncate text-body-sm text-text-muted"><span className="font-mono">{pricePerDay(priceEur, days)}</span>/giorno · <span className="font-mono">{days}</span> giorni</p>
            </div>
            <Button onClick={onAdd} disabled={!visible} tabIndex={visible ? 0 : -1} dot>Aggiungi · {formatEur(priceEur)}</Button>
          </div>
        </Glass>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// La pagina
// ---------------------------------------------------------------------------

export function Product() {
  const [flavor, setFlavor] = useState<FlavorId>('arancia')
  const [tier, setTier] = useState(DEFAULT_TIER)
  const [profile, setProfile] = useState<(typeof PROFILES)[number]['id']>('allenamento')
  const [reviewFilter, setReviewFilter] = useState<'tutte' | 'under45' | 'over45' | FlavorId>('tutte')
  const [toast, setToast] = useState(false)
  const buyButton = useRef<HTMLDivElement>(null)

  const f = flavorById(flavor)
  const selected = PRICE_TIERS.find((t) => t.units === tier) ?? PRICE_TIERS[0]
  const activeProfile = PROFILES.find((p) => p.id === profile) ?? PROFILES[0]
  const reviews = REVIEWS.filter((r) =>
    reviewFilter === 'tutte' ? true : reviewFilter === 'under45' ? r.age < 45 : reviewFilter === 'over45' ? r.age >= 45 : r.flavor === reviewFilter,
  )

  return (
    <>
      {/* --- P1 + P2 + P3 ------------------------------------------------- */}
      <Section tone="page" spacing="tight">
        <Container>
          <nav aria-label="Percorso" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-body-sm text-text-muted">
              <li><a href={to('/')} className="hover:text-text-brand">peak</a></li>
              <li aria-hidden="true">·</li>
              <li aria-current="page" className="text-text-primary">{PRODUCT.descriptor}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Gallery flavor={flavor} onFlavor={setFlavor} />
            </div>

            {/* --- P3 · buy box ------------------------------------------- */}
            <div className="flex flex-col gap-6 lg:col-span-5" data-ref="Create · buy box a step">
              <div className="flex flex-col gap-3">
                <p className="type-eyebrow text-text-brand">Integratore alimentare · {PRODUCT.format}</p>
                <h1 className="type-display-md text-text-primary">peak · creatina + glicina + vitamina d3</h1>
                <p className="flex flex-wrap items-center gap-2 text-body-sm text-text-muted">
                  <span className="flex items-center gap-1" aria-hidden="true">{[1, 2, 3, 4, 5].map((n) => <HandDot key={n} seed={`star-${n}`} size={10} className="text-arancia-500" />)}</span>
                  Recensioni di esempio <LabTag what="rating">esempio</LabTag>
                </p>
                <p className="text-body-md text-text-secondary">{CLAIMS.product.it} {CLAIMS.noLoading.it}</p>
              </div>

              {/* 1. il gusto */}
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-3 type-eyebrow text-text-brand"><span className="font-mono">1.</span> Il gusto</legend>
                <div className="flex flex-col gap-2">
                  {FLAVORS.map((x) => (
                    <label key={x.id} className={cn('flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 transition-colors', x.id === flavor ? 'border-arancia-600 bg-bg-surface' : 'border-border-subtle bg-bg-surface hover:border-border-strong')}>
                      <input type="radio" name="gusto" value={x.id} checked={x.id === flavor} onChange={() => setFlavor(x.id)} className="sr-only" />
                      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', x.colorToken)} aria-hidden="true">
                        {x.id === flavor && <span className="h-3 w-3 rounded-full bg-neutral-0" />}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="type-flavor-sm text-text-primary">{x.number} {x.name}</span>
                        <span className="text-body-sm text-text-secondary">{x.taste}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* 2. quanti giorni */}
              <PriceTiers value={tier} onChange={setTier} legend={<><span className="font-mono">2.</span> Quanti giorni</>} />

              <div ref={buyButton} className="flex flex-col gap-3">
                <Button size="lg" fullWidth dot onClick={() => setToast(true)}>Aggiungi · {formatEur(selected.priceEur)}</Button>
                <ul className="flex flex-wrap gap-x-5 gap-y-1 text-body-sm text-text-secondary">
                  {['Garanzia 90 giorni sul Rituale', 'Spedito dall’Italia in 24/48 h', 'PayPal, Satispay, Scalapay'].map((t) => (
                    <li key={t} className="flex items-center gap-2"><DayDot state="done" size={10} />{t}</li>
                  ))}
                </ul>
                <p className="text-body-sm text-text-muted">{OFFER_NOTES[0]}</p>
              </div>

              <p className="text-body-sm text-text-muted" data-compliance="authorized-claim">
                {authorizedClaimText('physical-performance')} <sup className="font-mono">1</sup>
              </p>
              <p className="text-body-sm text-text-muted"><sup className="mr-1 font-mono">1</sup>{EFSA_CLAIMS['physical-performance'].condition}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- P4 · e' per me? ------------------------------------------------ */}
      <Section tone="arancia-tint" id="per-me" dataRef="Create · is this right for me?">
        <Container>
          <SectionHeader eyebrow="È per me?" title={<>la stessa dose. cambia il <Em>racconto</Em>.</>} body="Uno stick al giorno per tutti. Quello che cambia è il claim autorizzato per il tuo profilo, e lo scriviamo letterale." />
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Profili">
            {PROFILES.map((p) => (
              <button key={p.id} type="button" role="tab" aria-selected={p.id === profile} onClick={() => setProfile(p.id)} className={cn('rounded-full px-4 py-2 text-body-sm font-display font-bold transition-colors', p.id === profile ? 'bg-bg-brand-deep text-neutral-0' : 'bg-bg-surface text-text-secondary hover:text-text-primary')}>
                {p.title}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-6 rounded-2xl bg-bg-surface p-6 md:grid-cols-[1fr_auto] md:p-8" role="tabpanel">
            <div className="flex flex-col gap-3">
              <h3 className="type-display-sm text-text-primary">{activeProfile.title.toLowerCase()}</h3>
              <p className="max-w-prose text-body-md text-text-secondary">{activeProfile.body}</p>
              <p className="max-w-prose text-body-sm text-text-muted" data-compliance="authorized-claim">
                {authorizedClaimText(activeProfile.claim)}
                {EFSA_CLAIMS[activeProfile.claim].ingredient === 'vitamina D' && <> <LabTag what="%VNR vitamina D3" /></>}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-bg-flavor-arancia-tint p-6">
              <span className="font-mono text-display-md text-text-primary">1</span>
              <span className="type-label text-text-muted">stick al giorno</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- P5 · barra numeri --------------------------------------------- */}
      <Numbers
        size="compact"
        dataRef="HIIT · striscia numeri"
        items={[
          { value: `${PRODUCT.dose} g`, label: 'creatina' },
          { value: 'D3', label: 'vitamina' },
          { value: `${PRODUCT.sticksPerBag}`, label: 'stick' },
          { value: '0', label: 'fasi di carico' },
        ]}
      />

      {/* --- P6 · tab + P7 · ingredienti e tabella -------------------------- */}
      <Section tone="surface" id="composizione" dataRef="HIIT · PDP ingredienti + TLS · apici">
        <Container width="narrow">
          <Tabs
            items={[
              { id: 'come', label: 'Come si prende', content: <p>{CLAIMS.gesture.it} Uno stick al giorno in <span className="font-mono">300</span> ml d’acqua fredda. Scegli un momento che hai già: il primo bicchiere della mattina. Senza fase di carico.</p> },
              { id: 'cosa', label: 'Cosa contiene', content: <p>{PRODUCT.formulaLine}: creatina monoidrato (<span className="font-mono">{PRODUCT.dose} g</span> per stick), glicina e vitamina D3 vegana. Aromi naturali del gusto {f.name}. I valori del laboratorio, dove ci sono, sono nella tabella qui sotto.</p> },
              { id: 'spedizione', label: 'Spedizione', content: <p>Spedito dall’Italia in <span className="font-mono">24/48</span> h. Gratuita da <span className="font-mono">{PRODUCT.freeShippingFromUnits}</span> buste; per una busta <span className="font-mono">{formatEur(PRODUCT.shippingEur)}</span>. Reso entro <span className="font-mono">14</span> giorni sui prodotti sigillati.</p> },
            ]}
          />
          <div className="mt-12">
            <SectionHeader eyebrow={PRODUCT.formulaLine} title={<>tre ingredienti. <Em>niente</Em> che non serva.</>} size="md" />
            <div className="mt-6">
              <Rows
                items={INGREDIENTS.map((ing) => ({
                  title: ing.name,
                  body: (
                    <>
                      <p>{ing.role}</p>
                      {ing.claims[0] && <p className="mt-2 text-body-sm text-text-muted" data-compliance="authorized-claim">{authorizedClaimText(ing.claims[0])}{ing.id === 'vitamina-d3' && <> <LabTag what="%VNR" /></>}</p>}
                    </>
                  ),
                  aside: isLabPlaceholder(ing.amount) ? <LabTag size="md" what={ing.name} /> : <span className="font-mono text-display-md text-text-primary">{ing.amount}</span>,
                }))}
              />
            </div>
          </div>
          <div className="mt-10">
            <IngredientPanel />
          </div>
          <div className="mt-6">
            <Accordion items={[{ title: 'Il retro della busta: cosa conterrà', content: <PackBack flavor={flavor} className="mt-2" /> }]} />
          </div>
        </Container>
      </Section>

      {/* --- P8 · 30 / 60 / 90 giorni --------------------------------------- */}
      <Section tone="page" id="giorni">
        <Container width="narrow">
          <SectionHeader eyebrow="Cosa succede" title={<>trenta, sessanta, <Em>novanta</Em> giorni.</>} body="Ogni blocco è una busta. Le didascalie parlano del gesto e dell’abitudine: gli effetti li dice solo il claim autorizzato." />
          <div className="mt-8"><NinetyDays selectedDays={selected.days} /></div>
        </Container>
      </Section>

      {/* --- P9 · confronto compatto ------------------------------------------ */}
      <Section tone="surface" id="confronto" dataRef="Create · vs tables + Dosys · vs the rest">
        <Container width="narrow">
          <SectionHeader eyebrow="Il confronto" title={<>uno stick, <Em>non</Em> un barattolo.</>} size="md" />
          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-default">
                <th className="py-2 pr-4 type-label text-text-muted">&nbsp;</th>
                {COMPARISON.columns.map((c, i) => <th key={c} className={cn('py-2 pr-3 text-body-sm font-display font-bold', i === 0 ? 'text-text-brand' : 'text-text-secondary')}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.slice(0, 4).map((row) => (
                <tr key={row.label} className="border-b border-border-subtle">
                  <th scope="row" className="py-3 pr-4 text-body-sm font-normal text-text-primary">{row.label}</th>
                  {row.values.map((v, i) => <td key={i} className="py-3 pr-3"><DayDot state={v ? 'done' : 'todo'} size={16} label={v ? 'sì' : 'no'} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </Section>

      {/* --- P10 · co-fondatrice + video -------------------------------------- */}
      <Editorial id="dottoressa" dataRef="TLS · advisor + Dosys · video per tema" tone="page" media={<MediaPlaceholder shot={shotById('dottoressa')} radius="xl" />} mediaSide="left" mediaSpan={5} bleed={false}>
        <p className="type-eyebrow text-text-brand">{EXPERT.role} · {EXPERT.title}</p>
        <blockquote className="m-0 type-display-md text-text-primary">“{EXPERT.intro.toLowerCase().replace(/\.$/, '')}.”</blockquote>
        <div className="grid grid-cols-3 gap-3">
          {EXPERT_VIDEOS.map((v) => (
            <div key={v.id} className="flex flex-col gap-2">
              <div className="relative flex aspect-[4/5] items-center justify-center rounded-xl bg-bg-flavor-lime-tint">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-brand-deep text-neutral-0" aria-hidden="true">▶</span>
                <span className="absolute left-3 top-3 type-label text-lime-700">{v.kind}</span>
              </div>
              <p className="text-body-sm font-display font-bold text-text-primary">{v.title}</p>
            </div>
          ))}
        </div>
        <p className="text-body-sm text-text-muted">Spiega ed educa. Non raccomanda il prodotto.</p>
      </Editorial>

      {/* --- P11 · recensioni con filtri ---------------------------------------- */}
      <Section tone="warm" id="recensioni" dataRef="HIIT · nome e quartiere + TLS · età">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Recensioni" title={<>chi la prende da <Em>un po’</Em>.</>} size="md" />
            <LabTag size="md" what="recensioni">esempi, finché non ci sono recensioni vere</LabTag>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtri">
            {([['tutte', 'Tutte'], ['under45', 'Sotto i 45'], ['over45', 'Oltre i 45'], ['arancia', 'Arancia Rossa'], ['lime', FLAVORS[1].name]] as const).map(([id, label]) => (
              <button key={id} type="button" aria-pressed={reviewFilter === id} onClick={() => setReviewFilter(id)} className={cn('rounded-full border px-4 py-2 text-body-sm font-display font-bold transition-colors', reviewFilter === id ? 'border-arancia-600 bg-bg-brand-soft text-text-brand' : 'border-border-default text-text-secondary hover:border-arancia-600')}>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <figure key={r.author} className="m-0 flex flex-col gap-3 rounded-2xl border border-border-subtle bg-bg-surface p-6">
                <div className="flex items-center gap-2 text-body-sm font-display font-bold text-text-primary">
                  <HandDot seed={`rev-${r.author}`} size={14} className="text-arancia-500" />
                  {r.author}, <span className="font-mono">{r.age}</span> · {r.city} · {r.habit}
                </div>
                <blockquote className="m-0 text-body-md text-text-primary">“{r.text}”</blockquote>
                <figcaption className="flex items-center justify-between gap-2 type-label text-text-muted">
                  <span>{r.benefit} · {flavorById(r.flavor).shortName}</span>
                  <LabTag what="recensione">esempio</LabTag>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- P12 · garanzia ------------------------------------------------- */}
      <Section tone="surface" id="garanzia" dataRef="Scandinavian Biolabs · money-back in 3 steps">
        <Container width="narrow">
          <SectionHeader eyebrow={GUARANTEE.title} title={<>se non continui, ti <Em>rimborsiamo</Em>.</>} body={GUARANTEE.intro} size="md" />
          <div className="mt-6"><Rows items={GUARANTEE.steps.map((s) => ({ title: s.title, body: s.body, dot: 'scribble' }))} /></div>
          <ul className="mt-6 flex flex-col gap-2 text-body-sm text-text-secondary">
            {GUARANTEE.conditions.map((c) => <li key={c} className="flex items-start gap-2"><HandDot seed={c} size={12} className="mt-1 shrink-0 text-arancia-500" />{c}</li>)}
          </ul>
        </Container>
      </Section>

      {/* --- P13 · FAQ + prima di ordinare ------------------------------------ */}
      <Section tone="page" id="domande" dataRef="Dosys · FAQ, il tono">
        <Container width="narrow">
          <SectionHeader eyebrow="Prima di ordinare" title={<>quello che ci <Em>chiedono</Em>.</>} size="md" />
          <div className="mt-8">
            <Accordion
              single
              items={[
                ...FAQ.map((e) => ({ id: e.q, title: e.q, content: e.a })),
                { id: 'conservazione', title: 'Conservazione', content: 'A temperatura ambiente, al riparo dalla luce diretta. Gli stick sono sigillati singolarmente: una volta aperto uno, gli altri restano protetti.' },
                { id: 'avvertenze', title: 'Avvertenze', content: 'Non superare la dose giornaliera consigliata. Tenere fuori dalla portata dei bambini sotto i tre anni. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* --- P14 · sticky add-to-cart di vetro ------------------------------- */}
      <StickyBar watch={buyButton} flavor={flavor} tierName={selected.name} days={selected.days} priceEur={selected.priceEur} onAdd={() => setToast(true)} />

      {toast && (
        <ToastStack position="bottom-center">
          <Toast tone="success" onDismiss={() => setToast(false)}>
            Aggiunto al carrello — {selected.name}, {flavorLabel(f, 'short')}. Sito dimostrativo: nessun ordine viene evaso.
          </Toast>
        </ToastStack>
      )}
    </>
  )
}

export default Product
