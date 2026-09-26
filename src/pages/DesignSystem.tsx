/**
 * DesignSystem — la scheda del brand, leggibile in due minuti.
 *
 * Nella 1.0 lo Showcase era una mappa tecnica esaustiva. Nella 2.0 sopra la
 * piega ci sono nove sezioni corte — la scheda, il logo, il simbolo, il
 * colore, la tipografia, i gusti, il packaging, cinque componenti chiave, la
 * voce — e tutto il dettaglio tecnico sta in fondo, in un solo blocco
 * <details> chiuso di default.
 *
 * Regola per chi la estende: se aggiungi un componente e non lo aggiungi qui
 * — anche dentro i dettagli tecnici — per il sistema quel componente non
 * esiste.
 */

import { useEffect, useRef, useState } from 'react'
import {
  Accordion, Badge, BrandSheet, BustaPack, Button, Card, Checkbox, Container, Divider,
  DoseSeal, FaqAccordion, FlavorCard, FlavorSelector, Grid, IngredientPanel, Input, LabTag,
  Marquee, MediaPlaceholder, Modal, PackBack, PriceTiers, ProductCard, QuantityStepper,
  RadioGroup, ReviewCard, Section, SectionHeader, Select, Stack, StickPack, StickyAddToCart,
  Tabs, Tag, Toast, ToastStack, Tooltip, TrustRow, WeekTimeline,
} from '../components'
import { DotField, Icon, Lockup, Logo } from '../brand'
import {
  CLEARSPACE_RATIO, FAVICON_SIZES, HEADER_LOGO_WIDTH, ICON_VARIANTS, LOGO_FORBIDDEN_USES,
  WORDMARK_MIN_WIDTH_MM, WORDMARK_MIN_WIDTH_PX, WORDMARK_TRACKING_EM, wordmarkHeightFor,
  type IconVariant,
} from '../brand/paths'
import tokens, { palette, radius, semantic, shadow, space, typeScale } from '../tokens/tokens'
import { contrastRatio, readableOn, verdict } from '../lib/contrast'
import { CLAIMS, CLAIM_HIERARCHY, DEFAULT_TIER, FLAVORS, PRODUCT, REVIEWS } from '../lib/copy'
import { shotById } from '../lib/media'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// Impalcatura
// ---------------------------------------------------------------------------

const NAV = [
  { id: 'scheda', label: '00 · La scheda' },
  { id: 'logo', label: '01 · Logo' },
  { id: 'simbolo', label: '02 · Simbolo' },
  { id: 'colore', label: '03 · Colore' },
  { id: 'tipografia', label: '04 · Tipografia' },
  { id: 'gusti', label: '05 · Gusti' },
  { id: 'packaging', label: '06 · Packaging' },
  { id: 'componenti', label: '07 · Componenti chiave' },
  { id: 'voce', label: '08 · Voce in breve' },
  { id: 'dettagli', label: 'Dettagli tecnici' },
] as const

function Block({ id, number, title, intro, children }: {
  id: string; number: string; title: string; intro?: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border-subtle py-10 last:border-0">
      <p className="type-mono-md text-text-muted">{number}</p>
      <h2 className="type-display-sm mt-2 text-text-primary">{title}</h2>
      {intro && <p className="mt-2 max-w-prose text-body-md text-text-secondary">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Sub({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="text-heading-md text-text-primary">{title}</h3>
      {note && <p className="mt-2 max-w-prose text-body-sm text-text-secondary">{note}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  const ink = readableOn(hex)
  return (
    <div className="overflow-hidden rounded-md border border-border-subtle">
      <div className="flex h-16 items-end p-2" style={{ background: hex, color: ink }}>
        <span className="font-mono text-mono-sm uppercase opacity-80">{name}</span>
      </div>
      <div className="bg-bg-surface px-2 py-2 font-mono text-mono-sm uppercase text-text-muted">{hex}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// I sei colori della scheda
// ---------------------------------------------------------------------------

const CORE_COLORS = [
  { name: 'bianco', hex: palette.neutral['0'], use: 'Superfici, pieni, il logo su colore.' },
  { name: 'carta', hex: palette.neutral['50'], use: 'Il fondo del sito e della stampa.' },
  { name: 'cacao', hex: palette.cacao['900'], use: 'Il testo e il logo su chiaro. Caldo, mai nero: le superfici scure sono arancia 600.' },
  { name: 'arancia', hex: palette.arancia['500'], use: 'Colore-gusto 01 e primario del brand. Campi pieni, pulsanti.' },
  { name: 'lime', hex: palette.lime['500'], use: 'Colore-gusto 02. Campi pieni delle comunicazioni del gusto.' },
  { name: 'miele', hex: palette.miele['300'], use: 'L unico accento: bollino della dose, badge, evidenziazioni. Mai testo su chiaro.' },
] as const

// ---------------------------------------------------------------------------
// Contrasto (dettagli tecnici)
// ---------------------------------------------------------------------------

const CONTRAST_PAIRS: Array<{ fg: string; bg: string; label: string; allowed: boolean; large?: boolean; note?: string }> = [
  { fg: palette.cacao['900'], bg: palette.neutral['50'], label: 'text-primary (cacao 900) su carta', allowed: true },
  { fg: palette.cacao['600'], bg: palette.neutral['50'], label: 'text-secondary (cacao 600) su carta', allowed: true },
  { fg: palette.cacao['500'], bg: palette.neutral['0'], label: 'text-muted (cacao 500) su bianco', allowed: true },
  { fg: palette.arancia['600'], bg: palette.neutral['0'], label: 'text-brand (arancia 600) su bianco', allowed: true },
  { fg: palette.neutral['0'], bg: palette.arancia['600'], label: 'bianco su arancia 600: pulsante primario, footer, toast', allowed: true },
  { fg: palette.neutral['0'], bg: palette.lime['700'], label: 'bianco su lime 700', allowed: true },
  { fg: palette.arancia['700'], bg: palette.neutral['0'], label: 'arancia 700 su bianco: la pillola sui campi', allowed: true },
  { fg: palette.neutral['0'], bg: palette.arancia['500'], label: 'logo bianco e testo grande su arancia 500', allowed: true, large: true, note: 'Solo logo e testo grande: 3,68:1.' },
  { fg: palette.neutral['0'], bg: palette.lime['500'], label: 'logo bianco e testo grande su lime 500', allowed: true, large: true, note: 'Solo logo e testo grande: 3,29:1.' },
  { fg: palette.cacao['900'], bg: palette.miele['300'], label: 'cacao 900 su miele 300', allowed: true },
  { fg: palette.lime['700'], bg: palette.neutral['0'], label: 'lime 700 (success) su bianco', allowed: true },
  { fg: palette.neutral['0'], bg: palette.arancia['500'], label: 'bianco come testo corrente su arancia 500', allowed: false, note: 'Vietato: 3,68:1. Il testo corrente sta sul deep (arancia 600) o in cacao sul tint.' },
  { fg: palette.cacao['900'], bg: palette.arancia['500'], label: 'cacao 900 come testo corrente su arancia 500', allowed: false, note: 'Vietato: 3,72:1. Sul 500 stanno solo logo e testo grande.' },
  { fg: palette.arancia['500'], bg: palette.neutral['0'], label: 'arancia 500 come testo su bianco', allowed: false, note: 'Vietato. Il 500 e un campo; per il testo brand il 600 o il 700.' },
  { fg: palette.miele['300'], bg: palette.neutral['0'], label: 'miele 300 come testo su bianco', allowed: false, note: 'Vietato. Il miele e un accento, non un inchiostro.' },
  { fg: palette.cacao['400'], bg: palette.neutral['0'], label: 'cacao 400 come testo su bianco', allowed: false, note: 'Non arriva a 4,5:1: e il colore degli anelli da fare. text-muted parte dal 500.' },
]

function ContrastTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-default bg-bg-raised">
            {['Coppia', 'Anteprima', 'Rapporto', 'Esito', 'Regola'].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-mono text-mono-sm uppercase font-normal text-text-muted">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((p) => {
            const ratio = contrastRatio(p.fg, p.bg)
            const v = verdict(ratio, p.large)
            const passes = v === 'AA' || v === 'AAA'
            return (
              <tr key={p.label} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-3 text-body-sm text-text-primary">{p.label}</td>
                <td className="px-4 py-3">
                  <span className={cn('inline-block rounded-sm px-3 py-2', p.large ? 'font-display text-heading-lg font-black' : 'text-body-sm')} style={{ background: p.bg, color: p.fg }}>
                    {p.large ? 'peak' : 'Uno stick. Tre grammi.'}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-mono-md tabular-nums text-text-secondary">{ratio.toFixed(2)}:1</td>
                <td className="px-4 py-3"><Badge tone={passes ? 'success' : 'error'} variant="soft">{v}</Badge></td>
                <td className="max-w-[280px] px-4 py-3 text-body-sm text-text-secondary">{p.allowed ? (p.note ?? 'Consentita.') : p.note}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// La demo della barra sticky: montata solo se i dettagli sono aperti e
// l'ancora e' nella viewport. E' il fix del bug della 1.0.
// ---------------------------------------------------------------------------

function StickyDemo({ enabled, onAdd }: { enabled: boolean; onAdd: () => void }) {
  const anchor = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const target = anchor.current
    if (!enabled || !target) {
      setInView(false)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled])

  return (
    <>
      <div ref={anchor} className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border-strong bg-bg-raised">
        <span className="font-mono text-mono-sm uppercase text-text-muted">
          {inView ? 'ancora nella viewport: la barra e montata' : 'ancora osservata'}
        </span>
      </div>
      {enabled && inView && (
        <StickyAddToCart
          name={`peak · ${FLAVORS[0].name}`}
          detail={`Rituale Completo · 0,94 € al giorno`}
          priceEur={85}
          onAddToCart={onAdd}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// La pagina
// ---------------------------------------------------------------------------

export function DesignSystem() {
  const [qty, setQty] = useState(1)
  const [tier, setTier] = useState(DEFAULT_TIER)
  const [flavor, setFlavor] = useState<'arancia' | 'lime'>('arancia')
  const [radioValue, setRadioValue] = useState('mattina')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <>
      {/* --- header ------------------------------------------------------ */}
      <Section tone="page" spacing="flush">
        <Container>
          <div className="flex flex-col gap-4 pt-10">
            <Logo size={220} variant="ink" title="" className="h-auto max-w-full" />
            <header className="flex flex-col gap-2">
              <h1 className="type-display-md text-text-primary">peak — design system 2.0</h1>
              <p className="max-w-prose text-body-lg text-text-secondary">
                {CLAIMS.brand.it} Creatina + glicina + vitamina D3 in stick monodose.
              </p>
              <p className="type-mono-md text-text-muted">{CLAIMS.product.it}</p>
            </header>
          </div>
        </Container>
      </Section>

      <Container>
        <div className="flex gap-12 py-6">
          <nav aria-label="Sezioni del design system" className="sticky top-24 hidden h-fit w-[208px] shrink-0 lg:block">
            <ul className="flex flex-col gap-1 border-l border-border-subtle">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#/design-system#${n.id}`}
                    className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-body-sm text-text-secondary transition-colors duration-fast hover:border-border-brand hover:text-text-brand"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 flex-1">
            {/* ---------------------------------------------------------- */}
            <Block id="scheda" number="00 — la scheda" title="chi siamo, in una card" intro="Sta prima del colore perché viene prima: ogni scelta delle sezioni successive discende da queste righe. Il posizionamento esteso è in docs/00.">
              <BrandSheet />
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="logo" number="01 — logo" title="il wordmark: bianco, pieno, grande" intro={`Un tracciato, non un testo: Gabarito 900 vettorializzato, tracking ${WORDMARK_TRACKING_EM}em. Un solo colore, nessun contorno. Bianco su ogni campo colore-gusto e su inchiostro; inchiostro su bianco e carta.`}>
              <div className="flex flex-col gap-4">
                {([
                  { bg: 'bg-bg-flavor-arancia', variant: 'white', label: 'bianco su arancia 500 — primaria, il logo del packaging' },
                  { bg: 'bg-bg-flavor-lime', variant: 'white', label: 'bianco su lime 500' },
                  { bg: 'bg-bg-page border border-border-subtle', variant: 'ink', label: 'cacao su carta — header del sito, documenti' },
                ] as const).map((t) => (
                  <div key={t.label} className={cn('flex flex-col gap-6 rounded-xl p-8 md:p-12', t.bg)}>
                    <Logo size={520} variant={t.variant} title="" className="h-auto w-full max-w-[520px]" />
                    <span className={cn('type-mono-sm', t.variant === 'white' ? 'text-neutral-0/80' : 'text-text-muted')}>{t.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card padding="sm">
                  <p className="type-mono-sm text-text-muted">misura minima</p>
                  <p className="mt-2 font-mono text-heading-lg text-text-primary">{WORDMARK_MIN_WIDTH_PX}px · {WORDMARK_MIN_WIDTH_MM}mm</p>
                  <div className="mt-3 flex items-end gap-4">
                    <Logo size={WORDMARK_MIN_WIDTH_PX} variant="ink" title="" />
                    <span className="type-mono-sm text-text-muted">{WORDMARK_MIN_WIDTH_PX}px di larghezza</span>
                  </div>
                </Card>
                <Card padding="sm">
                  <p className="type-mono-sm text-text-muted">area di rispetto</p>
                  <p className="mt-2 text-body-sm text-text-secondary">L’altezza della “e” minuscola su tutti i lati: il {Math.round(CLEARSPACE_RATIO * 100)}% dell’altezza del blocco.</p>
                  <div className="mt-3 inline-block bg-bg-raised outline-dashed outline-1 outline-border-brand" style={{ padding: wordmarkHeightFor(140) * CLEARSPACE_RATIO }}>
                    <Logo size={140} variant="ink" title="" />
                  </div>
                </Card>
                <Card padding="sm">
                  <p className="type-mono-sm text-text-muted">scala</p>
                  <ul className="mt-2 flex flex-col gap-1 text-body-sm text-text-secondary">
                    <li>Busta: 82% della larghezza, a sinistra, in alto.</li>
                    <li>Stick: lungo la lunghezza, ruotato di 90°.</li>
                    <li>Header: {HEADER_LOGO_WIDTH.desktop}px desktop, {HEADER_LOGO_WIDTH.mobile}px mobile.</li>
                    <li>Hero: XL.</li>
                    <li>Variante colore-gusto: solo su chiaro, sopra i 48px di altezza.</li>
                  </ul>
                </Card>
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="simbolo" number="02 — simbolo" title="il vertice" intro="Tre cerchi pieni e uguali a triangolo: il picco senza disegnare una montagna, i tre ingredienti, i tre grammi. Favicon, avatar, sigillo sullo stick, seme del pattern. Mai come icona funzionale nell’interfaccia.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(Object.keys(ICON_VARIANTS) as IconVariant[]).map((v) => (
                  <div key={v} className="flex flex-col items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-5">
                    <Icon size={88} variant={v} color="arancia" title="" />
                    <span className="text-center type-mono-sm text-text-primary">{ICON_VARIANTS[v].label}</span>
                    <span className="text-center text-body-sm text-text-secondary">{ICON_VARIANTS[v].note}</span>
                  </div>
                ))}
              </div>

              <Sub title="favicon" note="Sotto i 24px i punti passano a r=13, per non fondersi. Le misure sono quelle esportate in assets/favicon.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border-subtle bg-bg-surface p-8">
                  {FAVICON_SIZES.filter((s) => s <= 96).map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Icon size={size} title="" />
                      <span className="type-mono-sm text-text-muted">{size}px</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="lockup" note="Vertice libero e wordmark: lo spazio è la metà dell’altezza del simbolo. Su chiaro il vertice è nel colore-gusto e la parola in inchiostro; su colore e su inchiostro è tutto bianco.">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card padding="lg" className="flex items-center justify-center"><Lockup iconSize={56} /></Card>
                  <Card padding="lg" className="flex items-center justify-center"><Lockup iconSize={56} orientation="vertical" flavor="lime" /></Card>
                  <Card padding="lg" tone="brand-deep" className="flex items-center justify-center"><Lockup iconSize={56} background="dark" /></Card>
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="colore" number="03 — colore" title="tre neutri, due colori-gusto, un accento" intro="Tutto il resto esce o finisce nei dettagli tecnici. I campi colore-gusto sono pieni e a tutto campo; su di essi stanno solo il logo e il testo grande. Il testo corrente va inchiostro sul tint.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {CORE_COLORS.map((c) => (
                  <div key={c.name} className="flex flex-col overflow-hidden rounded-lg border border-border-subtle">
                    <div className="h-24" style={{ background: c.hex }} aria-hidden="true" />
                    <div className="flex flex-col gap-1 bg-bg-surface p-3">
                      <span className="type-mono-md text-text-primary">{c.name}</span>
                      <span className="type-mono-sm text-text-muted">{c.hex}</span>
                      <span className="text-body-sm text-text-secondary">{c.use}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="tipografia" number="04 — tipografia" title="quattro famiglie, tutte libere" intro="Gabarito 900 per i display e il wordmark, sempre in minuscolo. Inter per il testo. DM Mono per ogni numero e ogni dato. Fraunces Italic solo per i nomi dei gusti: mai titoli, mai testo.">
              <div className="grid gap-4 md:grid-cols-2">
                {([
                  { role: 'display', sample: 'la creatina, evoluta', cls: 'type-display-md', note: 'Gabarito 900 · minuscolo' },
                  { role: 'testo', sample: 'Tre grammi di creatina in uno stick. Da aprire, non da misurare.', cls: 'text-body-lg', note: 'Inter 400 / 500 / 600' },
                  { role: 'dati', sample: '3 G · 30 STICK · 90 GIORNI', cls: 'type-mono-md', note: 'DM Mono 500 · maiuscolo · tracking 0.14em' },
                  { role: 'accento', sample: `${FLAVORS[0].number} ${FLAVORS[0].name}`, cls: 'type-flavor-lg', note: 'Fraunces Italic 500 · solo i nomi dei gusti' },
                ] as const).map((f) => (
                  <Card key={f.role} padding="md">
                    <p className="type-mono-sm text-text-muted">{f.role} · {f.note}</p>
                    <p className={cn('mt-4 text-text-primary', f.cls)}>{f.sample}</p>
                  </Card>
                ))}
              </div>

              <Sub title="cinque stili chiave">
                <div className="rounded-lg border border-border-subtle bg-bg-surface">
                  {(['display-xl', 'display-md', 'heading-lg', 'body-md', 'mono-md'] as const).map((name) => {
                    const s = typeScale[name]
                    return (
                      <div key={name} className="flex flex-col gap-3 border-b border-border-subtle p-6 last:border-0 lg:flex-row lg:items-baseline lg:gap-8">
                        <div className="w-[176px] shrink-0">
                          <p className="type-mono-md text-text-primary">{name}</p>
                          <p className="type-mono-sm text-text-muted">{s.size} / {s.lineHeight} / {s.tracking}</p>
                        </div>
                        <p className={cn(`type-${name}`, 'min-w-0 flex-1 break-words text-text-primary')}>
                          {s.family === 'mono' ? 'uno stick · tre grammi · 30 giorni' : name === 'display-xl' ? 'evoluta' : 'la creatina, evoluta'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="gusti" number="05 — gusti" title="due al lancio, letti da FLAVORS" intro="Numero, nome in corsivo, colore, profondo e tint. Aggiungere un gusto è aggiungere una riga in src/lib/copy.ts; il nome del gusto 02 vive in una sola costante.">
              <div className="grid gap-6 md:grid-cols-2">
                {FLAVORS.map((f) => (
                  <FlavorCard key={f.id} flavor={f} showSwatches showAroma />
                ))}
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="packaging" number="06 — packaging (anteprima)" title="il fronte della busta e lo stick" intro="Parametrici e provvisori: le proporzioni sono un segnaposto della fustella. La gerarchia del fronte è la stessa per i due gusti, cambia solo il campo.">
              <div className="mb-4 flex flex-wrap gap-3">
                <LabTag size="md" what="fustella">provvisorio: in attesa della fustella del laboratorio</LabTag>
              </div>
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr_auto_auto_1fr] lg:items-end">
                {FLAVORS.map((f) => (
                  <div key={`b-${f.id}`} className="flex justify-center rounded-xl bg-bg-raised p-6">
                    <BustaPack flavor={f.id} width={240} className="max-w-full" />
                  </div>
                ))}
                {FLAVORS.map((f) => (
                  <div key={`s-${f.id}`} className="flex justify-center rounded-xl bg-bg-raised p-6">
                    <StickPack flavor={f.id} height={360} />
                  </div>
                ))}
                <ol className="m-0 flex list-none flex-col gap-3 p-0">
                  {[
                    'Wordmark bianco, 82% della larghezza, a sinistra',
                    `Descrittore “${PRODUCT.descriptor}”`,
                    'Nome del gusto in corsivo',
                    'Blocco numero: “3 g” + “DI CREATINA AL GIORNO · 30 STICK”',
                    'Pattern a pallini nel terzo inferiore, sotto il blocco numero',
                    'Piede in mono: formula e vegan; lotto e numero di serie',
                  ].map((line, i) => (
                    <li key={line} className="flex gap-3 text-body-sm text-text-secondary">
                      <span className="type-mono-sm text-text-muted">{i + 1}</span>
                      {line}
                    </li>
                  ))}
                </ol>
              </div>
              <Sub title="il retro" note="Non ora. Solo l’elenco di cosa deve contenere, con i valori dal laboratorio.">
                <PackBack />
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="componenti" number="07 — componenti brand chiave" title="cinque, gli altri nei dettagli" intro="Quelli che portano il posizionamento: il prezzo al giorno, il numero, le quattro settimane, le prove, il pattern.">
              <Sub title="PriceTiers" note="Prezzo al giorno in grande, totale in piccolo. Il risparmio è calcolato, non scritto. Il Rituale Completo parte selezionato ed è l’unico con la garanzia.">
                <PriceTiers value={tier} onChange={setTier} />
              </Sub>
              <Sub title="DoseSeal" note="Il miele è l’accento e il tono di default.">
                <div className="flex flex-wrap items-center gap-6">
                  <DoseSeal value={3} unit="g" caption="per stick" />
                  <DoseSeal value={30} unit="stick" caption="30 giorni" tone="arancia" />
                  <DoseSeal value={3} unit="ingredienti" tone="lime" size={104} />
                  <DoseSeal value={0} unit="fase di carico" tone="deep" size={104} />
                </div>
              </Sub>
              <Sub title="WeekTimeline" note="Il componente narrativo centrale. I testi descrivono il gesto e il tempo, mai un effetto.">
                <WeekTimeline highlight={3} />
              </Sub>
              <Sub title="TrustRow">
                <TrustRow />
              </Sub>
              <Sub title="DotField" note="Il pattern a pallini: raggio crescente lungo una direzione. Nel terzo inferiore del fronte e nelle bande. Mai sotto il testo. Statico.">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="h-32 rounded-lg bg-bg-flavor-arancia p-4"><DotField direction="right" stretch className="h-full w-full" /></div>
                  <div className="h-32 rounded-lg bg-bg-flavor-lime p-4"><DotField direction="up" rows={5} cols={10} stretch className="h-full w-full" /></div>
                  <div className="h-32 rounded-lg border border-border-subtle bg-bg-surface p-4"><DotField direction="down" color="#3A2A22" opacity={[0.08, 0.35]} stretch className="h-full w-full" /></div>
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="voce" number="08 — voce in breve" title="cinque claim, sei regole" intro="La gerarchia dei claim con i ruoli, e la colonna sì / no. Per esteso: docs/05 (voce) e docs/06 (compliance).">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card padding="md">
                  <ol className="m-0 flex list-none flex-col gap-4 p-0">
                    {CLAIM_HIERARCHY.map((c) => (
                      <li key={c.key} className="flex flex-col gap-1">
                        <span className="type-mono-sm text-text-muted">{c.role}</span>
                        <span className="text-body-md text-text-primary">{CLAIMS[c.key].it}</span>
                        <span className="text-body-sm text-text-muted">{c.note}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
                <Card padding="md">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        <th className="pb-3 type-mono-sm font-normal text-lime-700">sì</th>
                        <th className="pb-3 type-mono-sm font-normal text-errore-700">no</th>
                      </tr>
                    </thead>
                    <tbody className="text-body-sm">
                      {/* peak-compliance-ignore-start * — la colonna "no" cita i termini vietati per mostrarli, non e' un uso */}
                      {[
                        ['“3 g in uno stick”', '“una dose generosa”'],
                        ['“Senza fase di carico”', '“Non gonfia” / “zero ritenzione”'],
                        ['“Il mattone naturale della creatina”', 'Glicina e collagene o altro'],
                        ['“Co-fondatrice ed esperta del brand”', '“Consigliato dalla dott.ssa”'],
                        [`“Nº02 ${FLAVORS[1].name}”`, '“Mojito”'],
                        ['Il claim EFSA letterale, accanto al sign-off', '“Sentirsi al picco” da solo'],
                      ].map(([yes, no]) => (
                      /* peak-compliance-ignore-end */
                        <tr key={yes} className="border-t border-border-subtle">
                          <td className="py-3 pr-4 text-text-primary">{yes}</td>
                          <td className="py-3 text-text-secondary">{no}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="link" as="a" href="https://github.com/noprobagency/eatpeak/blob/ds-v2/docs/05-voice-and-copy.md">docs/05 — voce e copy →</Button>
                <Button variant="link" as="a" href="https://github.com/noprobagency/eatpeak/blob/ds-v2/docs/06-compliance.md">docs/06 — compliance →</Button>
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <details
              id="dettagli"
              className="scroll-mt-24 py-12"
              open={detailsOpen}
              onToggle={(e) => setDetailsOpen((e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg border border-border-default bg-bg-surface px-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="flex flex-col gap-1">
                  <span className="type-mono-md text-text-muted">dettagli tecnici</span>
                  <span className="text-heading-md text-text-primary">Per lo sviluppo: token, scale, tutti i componenti in tutti gli stati</span>
                </span>
                <span className="type-mono-sm text-text-muted">{detailsOpen ? 'chiudi' : 'apri'}</span>
              </summary>

              <div className="mt-8 flex flex-col gap-2">
                <Sub title="Contrasto" note="I rapporti sono calcolati, non stimati. Le ultime righe sono le combinazioni vietate: un divieto senza il numero accanto non viene rispettato.">
                  <ContrastTable />
                </Sub>

                <Sub title="Token semantici" note="Gli unici che i componenti devono conoscere.">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(semantic).map(([name, ref]) => {
                      const [scale, step] = (ref as string).split('.')
                      const hex = (palette as Record<string, Record<string, string>>)[scale][step]
                      return (
                        <div key={name} className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-3">
                          <span className="h-control-sm w-control-sm shrink-0 rounded-sm border border-border-subtle" style={{ background: hex }} aria-hidden="true" />
                          <span className="min-w-0">
                            <span className="block truncate type-mono-md text-text-primary">{name}</span>
                            <span className="block truncate type-mono-sm text-text-muted">{ref} · {hex}</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </Sub>

                <Sub title="Le scale complete">
                  {(Object.keys(palette) as Array<keyof typeof palette>).map((scale) => (
                    <div key={scale} className="mb-6">
                      <p className="mb-2 type-mono-sm text-text-muted">{scale}</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
                        {Object.entries(palette[scale]).map(([step, hex]) => (
                          <Swatch key={step} name={step} hex={hex as string} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="mb-2 type-mono-sm text-text-muted">stato</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {Object.entries(tokens.color.state).map(([name, hex]) => (
                      <Swatch key={name} name={name} hex={hex} />
                    ))}
                  </div>
                </Sub>

                <Sub title="Spazio, raggi, ombre, movimento">
                  <div className="flex flex-wrap items-end gap-4">
                    {Object.entries(space).map(([token, value]) => (
                      <div key={token} className="flex flex-col items-center gap-2">
                        <div className="bg-bg-brand" style={{ width: value, height: 24, minWidth: 2 }} aria-hidden="true" />
                        <span className="type-mono-sm text-text-muted">{token}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    {Object.entries(radius).map(([token, value]) => (
                      <div key={token} className="flex flex-col items-center gap-2">
                        <div className="h-20 w-20 border border-border-brand bg-bg-brand-soft" style={{ borderRadius: value }} aria-hidden="true" />
                        <span className="type-mono-sm text-text-muted">{token} · {value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-6">
                    {Object.entries(shadow).map(([token, value]) => (
                      <div key={token} className="flex flex-col items-center gap-3">
                        <div className="h-20 w-32 rounded-lg bg-bg-surface" style={{ boxShadow: value }} aria-hidden="true" />
                        <span className="type-mono-sm text-text-muted">{token}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {Object.entries(tokens.motion.duration).map(([token, value]) => (
                      <Badge key={token} tone="neutral" variant="soft">{token} · {value}</Badge>
                    ))}
                    <Badge tone="neutral" variant="soft">easing · {tokens.motion.easing.standard}</Badge>
                  </div>
                </Sub>

                <Sub title="Button — varianti e dimensioni">
                  <Stack gap="6">
                    {(['primary', 'secondary', 'ghost', 'link'] as const).map((variant) => (
                      <div key={variant} className="flex flex-wrap items-center gap-4">
                        <span className="w-24 type-mono-sm text-text-muted">{variant}</span>
                        {(['sm', 'md', 'lg'] as const).map((size) => (
                          <Button key={size} variant={variant} size={size}>Aggiungi</Button>
                        ))}
                        <Button variant={variant} loading>Aggiungi</Button>
                        <Button variant={variant} disabled>Aggiungi</Button>
                      </div>
                    ))}
                    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-bg-brand-deep p-4">
                      <span className="w-24 type-mono-sm text-neutral-0">inverse</span>
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <Button key={size} variant="inverse" size={size}>Aggiungi</Button>
                      ))}
                    </div>
                  </Stack>
                </Sub>

                <Sub title="Input, Select, Checkbox, Radio">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Stack gap="5">
                      <Input label="Email" type="email" placeholder="nome@esempio.it" hint="Ti scriviamo solo per l'ordine." />
                      <Input label="Codice lotto" mono placeholder="LOTTO 01 · Nº 0137/0500" />
                      <Input label="Email" type="email" defaultValue="nome@" error="Manca il dominio." />
                      <Input label="Campo disattivato" disabled placeholder="Non modificabile" />
                    </Stack>
                    <Stack gap="5">
                      <Select
                        label="Paese di spedizione"
                        options={[
                          { value: 'it', label: 'Italia' },
                          { value: 'fr', label: 'Francia' },
                          { value: 'de', label: 'Germania' },
                          { value: 'es', label: 'Spagna' },
                        ]}
                        defaultValue="it"
                      />
                      <Checkbox label="Voglio ricevere il promemoria quando la busta sta per finire." />
                      <Checkbox label="Casella disattivata" disabled />
                      <RadioGroup
                        legend="Quando la prendi"
                        name="momento"
                        value={radioValue}
                        onChange={setRadioValue}
                        options={[
                          { value: 'mattina', label: 'La mattina', hint: 'Appena in piedi, con l’acqua.' },
                          { value: 'allenamento', label: 'Vicino all’allenamento' },
                          { value: 'sera', label: 'La sera' },
                        ]}
                      />
                    </Stack>
                  </div>
                </Sub>

                <Sub title="QuantityStepper, Badge, Tag, LabTag">
                  <Stack gap="6">
                    <div className="flex flex-wrap items-center gap-8">
                      <QuantityStepper value={qty} onChange={setQty} />
                      <QuantityStepper value={1} onChange={() => {}} size="sm" />
                      <QuantityStepper value={1} onChange={() => {}} disabled />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['brand', 'lime', 'miele', 'neutral', 'success', 'warning', 'error'] as const).map((tone) => (
                        <Badge key={tone} tone={tone} variant="soft">{tone}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['brand', 'lime', 'miele', 'neutral', 'success', 'warning', 'error'] as const).map((tone) => (
                        <Badge key={tone} tone={tone} variant="solid">{tone}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Tag>Non interattivo</Tag>
                      <Tag onClick={() => {}}>Cliccabile</Tag>
                      <Tag onClick={() => {}} selected>Selezionato</Tag>
                      <Tag onRemove={() => {}}>Rimuovibile</Tag>
                      <LabTag what="glicina" />
                      <LabTag size="md" what="vitamina D3">µg e %VNR dal laboratorio</LabTag>
                    </div>
                  </Stack>
                </Sub>

                <Sub title="Card" note="I toni colore-gusto pieni portano il testo inchiostro di default.">
                  <Grid cols={4}>
                    {(['surface', 'raised', 'warm', 'brand-deep', 'lime-deep', 'arancia', 'lime', 'arancia-tint', 'lime-tint'] as const).map((tone) => (
                      <Card key={tone} tone={tone} elevation={tone === 'surface' ? 'md' : 'none'}>
                        <p className="type-mono-sm opacity-70">{tone}</p>
                        <p className="mt-3 text-heading-md">{CLAIMS.product.it}</p>
                      </Card>
                    ))}
                  </Grid>
                </Sub>

                <Sub title="Accordion, Tabs, Tooltip">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Accordion
                      defaultOpen={0}
                      items={[
                        { title: 'Come si apre lo stick', content: 'Si strappa dalla tacca, si versa in un bicchiere d’acqua e si mescola qualche secondo.' },
                        { title: 'Dove si conserva', content: 'A temperatura ambiente, al riparo dalla luce. Non serve il frigorifero.' },
                        { title: 'Quanto dura una busta', content: 'Trenta stick, uno al giorno: trenta giorni esatti.' },
                      ]}
                    />
                    <Tabs
                      items={[
                        { id: 'come', label: 'Come', content: CLAIMS.gesture.it },
                        { id: 'quanto', label: 'Quanto', content: `${PRODUCT.dose} ${PRODUCT.doseUnit} per stick, ${PRODUCT.sticksPerBag} stick per busta.` },
                        { id: 'presto', label: 'Presto', content: 'In arrivo.', disabled: true },
                      ]}
                    />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-body-md text-text-secondary">Creatina monoidrato</span>
                    <Tooltip content="La forma più studiata, e quella a cui si riferisce il claim autorizzato.">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-default type-mono-sm text-text-muted">?</span>
                    </Tooltip>
                  </div>
                </Sub>

                {/* peak-compliance-ignore focus — focus da tastiera, non un claim */}
                <Sub title="Modal e Toast" note="Prova anche Escape, il click fuori e il ciclo del Tab: il focus resta dentro la modale.">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => setModalOpen(true)}>Apri la modale</Button>
                    <Button variant="secondary" onClick={() => setToastOpen(true)}>Mostra un toast</Button>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    {(['default', 'success', 'warning', 'error'] as const).map((tone) => (
                      <Toast key={tone} tone={tone} duration={null}>
                        Toast <span className="font-mono uppercase">{tone}</span> — aggiunto al carrello.
                      </Toast>
                    ))}
                  </div>
                </Sub>

                <Sub title="Divider">
                  <Stack gap="4">
                    <Divider tone="subtle" />
                    <Divider tone="default" />
                    <Divider tone="strong" />
                  </Stack>
                </Sub>

                <Sub title="SectionHeader" note="Con genericBenefit il claim autorizzato diventa obbligatorio per tipo.">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <Card padding="lg">
                      <SectionHeader eyebrow="il protocollo" title={CLAIMS.noLoading.it.toLowerCase()} body={CLAIMS.againstTheTub.it} />
                    </Card>
                    <Card padding="lg">
                      <SectionHeader eyebrow="il sign-off" title="il piacere di sentirsi al picco" genericBenefit authorizedClaim="physical-performance" />
                    </Card>
                  </div>
                </Sub>

                <Sub title="Marquee" note="Sui campi colore-gusto il mono è inchiostro; il bianco sta sulla banda inchiostro.">
                  <div className="-mx-6 md:-mx-[28px]">
                    <Marquee />
                    <div className="mt-3"><Marquee tone="lime" /></div>
                    <div className="mt-3"><Marquee tone="deep" /></div>
                    <div className="mt-3"><Marquee tone="miele" /></div>
                  </div>
                </Sub>

                <Sub title="FlavorSelector e ProductCard">
                  <FlavorSelector value={flavor} onChange={setFlavor} />
                  <div className="mt-6">
                    <Grid cols={3}>
                      {FLAVORS.map((f) => (
                        <ProductCard
                          key={f.id}
                          name="peak"
                          flavor={f.id}
                          format={PRODUCT.format}
                          priceEur={PRODUCT.priceEur}
                          days={PRODUCT.days}
                          badge={f.id === 'arancia' ? <Badge tone="miele" variant="solid">novità</Badge> : undefined}
                          onAddToCart={() => setToastOpen(true)}
                        />
                      ))}
                      <ProductCard name="peak" flavor="arancia" format={PRODUCT.format} priceEur={PRODUCT.priceEur} days={PRODUCT.days} soldOut onAddToCart={() => {}} />
                    </Grid>
                  </div>
                </Sub>

                <Sub title="ReviewCard">
                  <Grid cols={3}>
                    {REVIEWS.map((r) => (
                      <ReviewCard key={r.author} stars={r.stars as 4 | 5} text={r.text} author={r.author} benefit={r.benefit} verified />
                    ))}
                  </Grid>
                </Sub>

                <Sub title="IngredientPanel" note="I placeholder [dal laboratorio] sono tag grigi: non si inventa un numero.">
                  <IngredientPanel />
                </Sub>

                <Sub title="FaqAccordion">
                  <FaqAccordion structuredData={false} />
                </Sub>

                <Sub title="MediaPlaceholder" note="Il segnaposto delle fotografie in arrivo, con il brief dello scatto.">
                  <div className="grid gap-4 md:grid-cols-3">
                    <MediaPlaceholder shot={shotById('hero-busta-arancia')} compact />
                    <MediaPlaceholder shot={shotById('gesto-stick')} compact />
                    <MediaPlaceholder shot={shotById('dottoressa')} compact />
                  </div>
                </Sub>

                <Sub title="StickyAddToCart" note="Montata solo quando questo blocco è aperto e l’ancora qui sotto è nella viewport. Nella 1.0 compariva fissa in cima alla pagina e copriva la scheda.">
                  <StickyDemo enabled={detailsOpen} onAdd={() => setToastOpen(true)} />
                </Sub>

                <Sub title="Usi vietati del logo" note="Documentati per esteso in docs/03-logo.md.">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {([
                      { label: 'contorno', style: { filter: 'drop-shadow(0 0 2px #E4572E) drop-shadow(0 0 2px #E4572E)' } },
                      { label: 'ruotato', style: { transform: 'rotate(-12deg)' } },
                      { label: 'con ombra', style: { filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' } },
                      { label: 'gradiente', style: { opacity: 0.55 } },
                    ] as const).map((t) => (
                      <div key={t.label} className="relative flex flex-col items-center gap-3 overflow-hidden rounded-md border border-errore-500/40 bg-bg-surface p-6">
                        <div className="flex h-20 items-center" style={t.style}>
                          <Logo size={130} variant="ink" title="" />
                        </div>
                        <span className="type-mono-sm text-errore-700">no · {t.label}</span>
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
                          background: 'linear-gradient(to top right, transparent calc(50% - 1px), rgba(192,57,43,.5) 50%, transparent calc(50% + 1px))',
                        }} />
                      </div>
                    ))}
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {LOGO_FORBIDDEN_USES.map((u) => (
                      <li key={u.label} className="text-body-sm text-text-secondary"><span className="type-mono-sm text-errore-700">no · {u.label}</span> — {u.reason}</li>
                    ))}
                  </ul>
                </Sub>
              </div>
            </details>
          </div>
        </div>
      </Container>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="come si prende"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Chiudi</Button>
            <Button onClick={() => setModalOpen(false)}>Ho capito</Button>
          </>
        }
      >
        <p>{CLAIMS.gesture.it} Uno stick al giorno, tutti i giorni: è la costanza a fare il lavoro.</p>
      </Modal>

      {toastOpen && (
        <ToastStack>
          <Toast tone="success" onDismiss={() => setToastOpen(false)}>
            Aggiunto al carrello — 30 stick.
          </Toast>
        </ToastStack>
      )}
    </>
  )
}

export default DesignSystem
