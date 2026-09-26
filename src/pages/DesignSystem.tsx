/**
 * DesignSystem — la scheda del brand, leggibile in due minuti.
 *
 * Nella 1.0 lo Showcase era una mappa tecnica esaustiva. Dalla 2.0 sopra la
 * piega ci sono dieci sezioni corte — la scheda, il logo, il simbolo, il
 * colore, la tipografia, i gusti, il packaging, i componenti chiave, la
 * voce, i laboratori — e tutto il dettaglio tecnico sta in fondo, in un solo
 * blocco <details> chiuso di default.
 *
 * La 3.0 umanizza: niente nero (i neutri del testo sono cacao), titoli 700–800
 * con una parola in corsivo, occhielli in display 600, il mono solo per numeri
 * e codici, il font display dal laboratorio (?font=<id>), il simbolo dietro
 * SYMBOL_VARIANT. In fondo, i quattro laboratori dove si decide.
 *
 * La 3.1 cambia il colore brand (ambra), il simbolo (quattro punti, con la
 * salita animata dell'header), il wordmark (quello della v1, bianco o ambra) e
 * il font di tutto il testo (Denim, trial: solo in locale).
 *
 * Regola per chi la estende: se aggiungi un componente e non lo aggiungi qui
 * — anche dentro i dettagli tecnici — per il sistema quel componente non
 * esiste.
 */

import { useEffect, useRef, useState } from 'react'
import {
  Accordion, Badge, BrandSheet, BustaBack, BustaPack, Button, Card, Checkbox, Container, Divider,
  DoseSeal, Em, FaqAccordion, FlavorCard, FlavorSelector, Glass, Grid, IngredientPanel, Input, LabTag,
  Marquee, MediaPlaceholder, Modal, PackBack, PriceTiers, ProductCard, QuantityStepper,
  RadioGroup, ReviewCard, Section, SectionHeader, Select, Stack, StickPack, StickyAddToCart,
  Tabs, Tag, Toast, ToastStack, Tooltip, TrustRow, WeekTimeline,
} from '../components'
import { DayDot, DotField, HandDot, Icon, Lockup, Logo, SymbolRise } from '../brand'
import {
  FAVICON_SIZES, ICON_VARIANTS, LOGO_FORBIDDEN_USES, SALITA_MOTION,
  SYMBOL_COLORS, SYMBOL_VARIANT, WORDMARK_MIN_WIDTH_MM, WORDMARK_MIN_WIDTH_PX, WORDMARK_V1_AVAILABLE,
  useWordmark, wordmarkHeightFor, type IconVariant,
} from '../brand/paths'
import { FONT_CANDIDATES, candidate, fontLabHref, useFontLab } from '../lib/fontlab'
import { SYSTEM_NAV, to } from '../lib/routes'
import tokens, { palette, radius, semantic, shadow, space, typeScale } from '../tokens/tokens'
import { contrastRatio, readableOn, verdict } from '../lib/contrast'
import { CLAIMS, CLAIM_HIERARCHY, DEFAULT_TIER, FLAVORS, PRODUCT, REVIEWS } from '../lib/copy'
import { shotById } from '../lib/media'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// Impalcatura
// ---------------------------------------------------------------------------

function Block({ id, number, title, intro, children }: {
  id: string; number: string; title: React.ReactNode; intro?: string; children: React.ReactNode
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
        <span className="type-label opacity-80">{name}</span>
      </div>
      <div className="bg-bg-surface px-2 py-2 font-mono text-mono-md text-text-muted">{hex}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// I sei colori della scheda
// ---------------------------------------------------------------------------

const CORE_COLORS = [
  { name: 'ambra', hex: palette.ambra['400'], use: 'Il colore del brand (3.1). Fondi: hero, bande, footer, annunci, pulsante primario, badge. Sopra solo cacao.' },
  { name: 'ambra 700', hex: palette.ambra['700'], use: 'Il profondo: i punti e il simbolo su chiaro, i link, il testo brand, l anello della tastiera.' },
  { name: 'bianco', hex: palette.neutral['0'], use: 'Superfici, pieni, il logo su colore.' },
  { name: 'carta', hex: palette.neutral['50'], use: 'Il fondo del sito e della stampa.' },
  { name: 'cacao', hex: palette.cacao['900'], use: 'Il testo, anche sull ambra. Caldo, mai nero.' },
  { name: 'arancia', hex: palette.arancia['500'], use: 'Colore-gusto 01 (Arancia Rossa). Resta del pack: si decide nello step packaging.' },
  { name: 'lime', hex: palette.lime['500'], use: 'Colore-gusto 02. Campi pieni delle comunicazioni del gusto.' },
  { name: 'lime 700', hex: palette.lime['700'], use: 'Il profondo del gusto 02: il rituale dei 30 punti.' },
  { name: 'miele', hex: palette.miele['300'], use: 'L accento: bollino della dose, il punto di oggi. Mai testo su chiaro.' },
] as const

// ---------------------------------------------------------------------------
// Contrasto (dettagli tecnici)
// ---------------------------------------------------------------------------

const CONTRAST_PAIRS: Array<{ fg: string; bg: string; label: string; allowed: boolean; large?: boolean; note?: string }> = [
  { fg: palette.cacao['900'], bg: palette.neutral['50'], label: 'text-primary (cacao 900) su carta', allowed: true },
  { fg: palette.cacao['600'], bg: palette.neutral['50'], label: 'text-secondary (cacao 600) su carta', allowed: true },
  { fg: palette.cacao['500'], bg: palette.neutral['0'], label: 'text-muted (cacao 500) su bianco', allowed: true },
  { fg: palette.cacao['900'], bg: palette.ambra['400'], label: 'cacao 900 su ambra 400: hero, footer, annunci, pulsante primario', allowed: true },
  { fg: palette.cacao['900'], bg: palette.ambra['500'], label: 'cacao 900 su ambra 500: hover del primario', allowed: true },
  { fg: palette.ambra['700'], bg: palette.neutral['50'], label: 'text-brand (ambra 700) su carta: link, occhielli', allowed: true },
  { fg: palette.ambra['700'], bg: palette.neutral['0'], label: 'ambra 700 su bianco: pulsante secondario, pillola sui campi', allowed: true },
  { fg: palette.ambra['700'], bg: palette.ambra['50'], label: 'ambra 700 su ambra 50: badge tenue', allowed: true },
  { fg: palette.neutral['0'], bg: palette.ambra['700'], label: 'bianco su ambra 700: toast, tooltip, bg-brand-deep', allowed: true },
  { fg: palette.neutral['0'], bg: palette.lime['700'], label: 'bianco su lime 700', allowed: true },
  { fg: palette.neutral['0'], bg: palette.lime['500'], label: 'logo bianco e testo grande su lime 500', allowed: true, large: true, note: 'Solo logo e testo grande: 3,29:1.' },
  { fg: palette.cacao['900'], bg: palette.miele['300'], label: 'cacao 900 su miele 300', allowed: true },
  { fg: palette.lime['700'], bg: palette.neutral['0'], label: 'lime 700 (success) su bianco', allowed: true },
  { fg: palette.neutral['0'], bg: palette.ambra['400'], label: 'bianco come testo su ambra 400', allowed: false, note: 'Vietato: 1,85:1. Su ambra si scrive solo in cacao. Il logo bianco sull ambra e un segno, non testo.' },
  { fg: palette.cacao['600'], bg: palette.ambra['400'], label: 'cacao 600 come testo su ambra 400', allowed: false, note: 'Vietato: 3,31:1. Sull ambra niente grigi: la gerarchia la fanno corpo e peso.' },
  { fg: palette.ambra['400'], bg: palette.neutral['0'], label: 'ambra 400 come testo su bianco', allowed: false, note: 'Vietato: 1,85:1. Il 400 e un fondo; per il testo brand il 700.' },
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
              <th key={h} scope="col" className="px-4 py-3 type-label text-text-muted">{h}</th>
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
                  <span className={cn('inline-block rounded-sm px-3 py-2', p.large ? 'font-display text-heading-lg font-extrabold' : 'text-body-sm')} style={{ background: p.bg, color: p.fg }}>
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
        <span className="text-body-sm text-text-muted">
          {inView ? 'Ancora nella viewport: la barra è montata.' : 'Ancora osservata.'}
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
  const lab = useFontLab()
  const font = candidate(lab.font)
  const wordmark = useWordmark()

  return (
    <>
      {/* --- header ------------------------------------------------------ */}
      <Section tone="page" spacing="flush">
        <Container>
          <div className="flex flex-col gap-4 pt-10">
            <Logo size={220} variant="ambra" title="" className="h-auto max-w-full" />
            <header className="flex flex-col gap-2">
              <h1 className="type-display-md text-text-primary">peak — design system <Em>3.3</Em></h1>
              <p className="max-w-prose text-body-lg text-text-secondary">
                {CLAIMS.brand.it} Creatina + glicina + vitamina D3 in stick monodose.
              </p>
              <p className="text-body-md text-text-muted">{CLAIMS.product.it}</p>
            </header>
          </div>
        </Container>
      </Section>

      <Container>
        <div className="flex gap-12 py-6">
          <nav aria-label="Sezioni del design system" className="sticky top-24 hidden h-fit w-[208px] shrink-0 lg:block">
            <ul className="flex flex-col gap-1 border-l border-border-subtle">
              {SYSTEM_NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={to('/', n.id)}
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
            <Block id="logo" number="01 — logo" title={<>il wordmark della v1: bianco o <Em>ambra</Em></>} intro={`Un tracciato, non un testo: il wordmark della v1, “peak” in Rund Display Black con il suo tracking (−0,0333em), senza più il contorno. ${WORDMARK_V1_AVAILABLE ? 'Qui lo vedi dal tracciato vero, generato in locale.' : 'Rund è in licenza trial: qui vedi il ripiego, lo stesso segno in Gabarito 900, finché la licenza non c’è.'} Un solo colore, pieno: sempre bianco, oppure ambra su bianco e carta. Mai cacao, mai nero.`}>
              <div className="flex flex-col gap-4">
                {([
                  { bg: 'bg-bg-brand', variant: 'white', label: 'bianco su ambra 400 — il campo del brand, il footer', labelClass: 'text-text-on-brand' },
                  { bg: 'bg-bg-flavor-arancia', variant: 'white', label: 'bianco su arancia 500 — il logo del packaging', labelClass: 'text-neutral-0/80' },
                  { bg: 'bg-bg-page border border-border-subtle', variant: 'ambra', label: 'ambra su carta — header del sito, documenti', labelClass: 'text-text-muted' },
                ] as const).map((t) => (
                  <div key={t.label} className={cn('flex flex-col gap-6 rounded-xl p-8 md:p-12', t.bg)}>
                    <Logo size={520} variant={t.variant} title="" className="h-auto w-full max-w-[520px]" />
                    <span className={cn('type-label', t.labelClass)}>{t.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card padding="sm">
                  <p className="type-label text-text-muted">Misura minima</p>
                  <p className="mt-2 font-mono text-heading-lg text-text-primary">{WORDMARK_MIN_WIDTH_PX}px · {WORDMARK_MIN_WIDTH_MM}mm</p>
                  <div className="mt-3 flex items-end gap-4">
                    <Logo size={WORDMARK_MIN_WIDTH_PX} variant="ambra" title="" />
                    <span className="text-body-sm text-text-muted"><span className="font-mono">{WORDMARK_MIN_WIDTH_PX}</span>px di larghezza</span>
                  </div>
                </Card>
                <Card padding="sm">
                  <p className="type-label text-text-muted">Area di rispetto</p>
                  <p className="mt-2 text-body-sm text-text-secondary">L’altezza della “e” minuscola su tutti i lati: il {Math.round(wordmark.clearspaceRatio * 100)}% dell’altezza del blocco.</p>
                  <div className="mt-3 inline-block bg-bg-raised outline-dashed outline-1 outline-border-brand" style={{ padding: wordmarkHeightFor(140, wordmark.viewBox) * wordmark.clearspaceRatio }}>
                    <Logo size={140} variant="ambra" title="" />
                  </div>
                </Card>
                <Card padding="sm">
                  <p className="type-label text-text-muted">Scala</p>
                  <ul className="mt-2 flex flex-col gap-1 text-body-sm text-text-secondary">
                    <li>Busta: 82% della larghezza, a sinistra, in alto.</li>
                    <li>Stick: lungo la lunghezza, ruotato di 90°.</li>
                    <li>Header: la salita, corpo 28px; il wordmark compare al passaggio.</li>
                    <li>Hero: XL.</li>
                    <li>Variante colore-gusto: solo il pack Neutro, sopra i 48px di altezza.</li>
                  </ul>
                </Card>
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="simbolo" number="02 — simbolo" title={<>quattro <Em>punti</Em></>} intro={`Quattro cerchi pieni, un solo colore, diametri 0,64 · 0,76 · 0,88 · 1. A riposo sono una montagna; al passaggio salgono in diagonale a 36 gradi, dal più piccolo al più grande, ed è la salita dell’header. Variante ${SYMBOL_VARIANT.toUpperCase()}, dietro il flag SYMBOL_VARIANT; le varianti a tre punti della 3.0 restano in #/lab/simbolo. Ambra 700 su chiaro, cacao su ambra, bianco sugli altri fondi colore. Mai come icona funzionale nell’interfaccia.`}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {(Object.keys(ICON_VARIANTS) as IconVariant[]).map((v) => (
                  <div key={v} className="flex flex-col items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-5">
                    <Icon size={88} variant={v} title="" />
                    <span className="text-center type-label text-text-primary">{ICON_VARIANTS[v].label}</span>
                    <span className="text-center text-body-sm text-text-secondary">{ICON_VARIANTS[v].note}</span>
                  </div>
                ))}
              </div>

              <Sub title="la salita" note={`Passa sopra (o arriva con la tastiera): i punti salgono in ${SALITA_MOTION.durationMs} ms, uno dopo l’altro (${SALITA_MOTION.delaysMs.join(' / ')} ms), poi compare il wordmark. All’uscita si torna giù, senza ritardi. Su touch parte da sola una volta; con il movimento ridotto compare solo il wordmark.`}>
                <div className="grid gap-4 md:grid-cols-3">
                  <a href={to('/', 'simbolo')} className="flex h-32 items-center justify-center rounded-xl border border-border-subtle bg-bg-page" aria-label="La salita su carta">
                    <SymbolRise style={{ fontSize: 48 }} />
                  </a>
                  <a href={to('/', 'simbolo')} className="flex h-32 items-center justify-center rounded-xl bg-bg-brand" aria-label="La salita su ambra">
                    <SymbolRise symbolColor={SYMBOL_COLORS.onBrand} wordmarkColor="#FFFFFF" style={{ fontSize: 48 }} />
                  </a>
                  <a href={to('/', 'simbolo')} className="flex h-32 items-center justify-center rounded-xl bg-bg-lime-deep" aria-label="La salita su lime 700">
                    <SymbolRise symbolColor={SYMBOL_COLORS.onColor} wordmarkColor="#FFFFFF" style={{ fontSize: 48 }} />
                  </a>
                </div>
              </Sub>

              <Sub title="favicon" note="Quadrato ambra 400 con il raggio al 24% del lato, quattro punti cacao al 64% del lato, con lo spazio fra i punti a 0,2 perché a 16px non si impastino. Le misure sono quelle esportate in assets/favicon.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border-subtle bg-bg-surface p-8">
                  {FAVICON_SIZES.filter((s) => s <= 96).map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Icon size={size} title="" />
                      <span className="font-mono text-mono-md text-text-muted">{size}px</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="lockup" note="Simbolo e wordmark centrati in verticale sulla scritta, con 0,3em di spazio. Su chiaro: simbolo ambra 700, parola ambra. Sull’ambra: simbolo cacao, parola bianca. Sugli altri fondi colore: tutto bianco.">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card padding="lg" className="flex items-center justify-center"><Lockup size={56} /></Card>
                  <Card padding="lg" tone="brand" className="flex items-center justify-center"><Lockup size={56} background="brand" /></Card>
                  <Card padding="lg" tone="lime-deep" className="flex items-center justify-center"><Lockup size={56} orientation="vertical" background="dark" /></Card>
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="colore" number="03 — colore" title={<>ambra, carta, cacao, <Em>due</Em> colori-gusto</>} intro="Dalla 3.1 il colore del brand è l’ambra: il 400 per i fondi (hero, bande, footer, annunci, pulsante primario, badge), con sopra solo il cacao 900; il 700 per i punti e il simbolo su chiaro, i link, il testo brand e l’anello della tastiera. I tint (50, 100) fanno le card morbide e i fondi di sezione. Arancia e lime restano i colori-gusto del pack. Niente nero, da nessuna parte. La grana (3–5%) si posa sui campi e sul vetro.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {CORE_COLORS.map((c) => (
                  <div key={c.name} className="flex flex-col overflow-hidden rounded-lg border border-border-subtle">
                    <div className="h-24" style={{ background: c.hex }} aria-hidden="true" />
                    <div className="flex flex-col gap-1 bg-bg-surface p-3">
                      <span className="type-label text-text-primary">{c.name}</span>
                      <span className="font-mono text-mono-md text-text-muted">{c.hex}</span>
                      <span className="text-body-sm text-text-secondary">{c.use}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="tipografia" number="04 — tipografia" title={<>quattro famiglie, <Em>tutte</Em> libere</>} intro={`Il display viene dal laboratorio font: ${font.family} ${font.titleWeight} per i titoli (mai 900), sempre in minuscolo, con una sola parola in corsivo. Gli occhielli sono display 600 in frase normale. Inter per il testo. DM Mono solo per numeri e codici. Fraunces Italic solo per i nomi dei gusti: mai titoli, mai testo.`}>
              <div className="grid gap-4 md:grid-cols-2">
                {([
                  { role: 'display', sample: <>la creatina, <Em>evoluta</Em></>, cls: 'type-display-md', note: `${font.family} ${font.titleWeight} · minuscolo · una parola in corsivo` },
                  { role: 'occhiello', sample: 'Il gesto, in tre passi', cls: 'type-eyebrow text-text-brand', note: 'Display 600 · frase normale, mai maiuscolo' },
                  { role: 'testo', sample: 'Tre grammi di creatina in uno stick. Da aprire, non da misurare.', cls: 'text-body-lg', note: 'Inter 400 / 500 / 600' },
                  { role: 'dati', sample: '3 g · 30 stick · 90 giorni', cls: 'font-mono text-heading-lg', note: 'DM Mono 500 · solo numeri e codici' },
                  { role: 'accento', sample: `${FLAVORS[0].number} ${FLAVORS[0].name}`, cls: 'type-flavor-lg', note: 'Fraunces Italic 500 · solo i nomi dei gusti' },
                ] as const).map((f) => (
                  <Card key={f.role} padding="md">
                    <p className="type-label text-text-muted">{f.role} · {f.note}</p>
                    <p className={cn('mt-4 text-text-primary', f.cls)}>{f.sample}</p>
                  </Card>
                ))}
              </div>

              <Sub title="il laboratorio font" note="Dalla 3.1 tutto il testo è in Denim (versione basic), titoli e testo corrente: è in licenza trial, quindi si vede solo in locale; in produzione lo stack scende su Nunito e Inter. Gli altri sette candidati OFL restano con ?font=<id>; ?italic=0 spegne la parola in corsivo.">
                <div className="flex flex-wrap gap-2">
                  {FONT_CANDIDATES.map((c) => (
                    <a
                      key={c.id}
                      href={fontLabHref({ font: c.id })}
                      aria-current={c.id === font.id ? 'true' : undefined}
                      className={cn('rounded-full border px-4 py-2 text-body-sm font-bold transition-colors', c.id === font.id ? 'border-border-brand bg-bg-brand-soft text-text-brand' : 'border-border-default text-text-secondary hover:border-border-brand')}
                      style={{ fontFamily: c.stack }}
                    >
                      {c.family}
                    </a>
                  ))}
                  <Button variant="link" as="a" href={to('/lab/font')}>La scorecard →</Button>
                </div>
              </Sub>

              <Sub title="sei stili chiave">
                <div className="rounded-lg border border-border-subtle bg-bg-surface">
                  {(['display-xl', 'display-md', 'heading-lg', 'eyebrow', 'body-md', 'mono-md'] as const).map((name) => {
                    const s = typeScale[name]
                    return (
                      <div key={name} className="flex flex-col gap-3 border-b border-border-subtle p-6 last:border-0 lg:flex-row lg:items-baseline lg:gap-8">
                        <div className="w-[176px] shrink-0">
                          <p className="type-label text-text-primary">{name}</p>
                          <p className="font-mono text-mono-md text-text-muted">{s.size} / {s.lineHeight} / {s.tracking}</p>
                        </div>
                        <p className={cn(`type-${name}`, 'min-w-0 flex-1 break-words text-text-primary')}>
                          {s.family === 'mono' ? '3 g · 30 stick · 90 giorni' : name === 'display-xl' ? 'evoluta' : name === 'eyebrow' ? 'Il gesto, in tre passi' : 'la creatina, evoluta'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="gusti" number="05 — gusti" title={<>due al lancio, letti da <Em>FLAVORS</Em></>} intro="Numero, nome in corsivo, colore, profondo e tint. Aggiungere un gusto è aggiungere una riga in src/lib/copy.ts; il nome del gusto 02 vive in una sola costante.">
              <div className="grid gap-6 md:grid-cols-2">
                {FLAVORS.map((f) => (
                  <FlavorCard key={f.id} flavor={f} showSwatches showAroma />
                ))}
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="packaging" number="06 — packaging (anteprima)" title={<>la busta, il retro e lo <Em>stick</Em></>} intro="Parametrici e provvisori: le proporzioni sono un segnaposto della fustella. La frutta è un placeholder piatto con il suo brief, il Neutro sta su bianco, il retro conta trenta cerchi. Le tre varianti, i retri e gli stick sono in #/lab/pack.">
              <div className="mb-4 flex flex-wrap gap-3">
                <LabTag size="md" what="fustella">provvisorio: in attesa della fustella del laboratorio</LabTag>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:items-end">
                {FLAVORS.map((f) => (
                  <div key={`b-${f.id}`} className="flex justify-center rounded-xl bg-bg-raised p-6">
                    <BustaPack flavor={f.id} width={220} className="max-w-full" />
                  </div>
                ))}
                {FLAVORS.map((f) => (
                  <div key={`s-${f.id}`} className="flex justify-center rounded-xl bg-bg-raised p-6">
                    <StickPack flavor={f.id} height={330} />
                  </div>
                ))}
              </div>
              <ol className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
                  {[
                    'Frutta stilizzata, sovradimensionata, dietro e sopra il wordmark, tagliata dai bordi (placeholder con il brief)',
                    'Wordmark bianco, 82% della larghezza, a sinistra',
                    `Descrittore “${PRODUCT.descriptor}”`,
                    'Nome del gusto in corsivo',
                    'Blocco numero: “3 g” + “DI CREATINA AL GIORNO · 30 STICK”',
                    'Retino a pallini nel terzo inferiore, sotto il blocco numero',
                    'Piede in mono: formula e vegan; lotto e numero di serie',
                  ].map((line, i) => (
                  <li key={line} className="flex gap-3 text-body-sm text-text-secondary">
                    <span className="font-mono text-mono-md text-text-muted">{i + 1}</span>
                    {line}
                  </li>
                ))}
              </ol>
              <Sub title="il retro" note="Trenta cerchi a mano, uno per stick, da segnare a penna: al giorno 75 la foto dei tre retri è la prova della garanzia. I contenuti di legge restano un elenco con i valori dal laboratorio.">
                <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
                  <BustaBack flavor="arancia" width={260} marked={12} className="max-w-full" />
                  <PackBack />
                </div>
                <div className="mt-4"><Button variant="link" as="a" href={to('/lab/pack')}>Il laboratorio pack →</Button></div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="componenti" number="07 — componenti brand chiave" title={<>sette, gli altri nei <Em>dettagli</Em></>} intro="Quelli che portano il posizionamento: il prezzo al giorno, il numero, i punti che contano i giorni, il vetro sul colore, le quattro settimane, le prove, il retino.">
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
              <Sub title="DayDot e HandDot" note="I tre stati, sempre gli stessi: da fare (anello cacao), fatto (ambra 700 su chiaro, cacao sull’ambra, bianco sugli altri colori), oggi (miele con l’anello ambra 700). Il punto a mano è il segno del cliente: calendario, retro busta, numerazioni.">
                <div className="flex flex-wrap items-center gap-10">
                  <div className="flex items-center gap-4">
                    <DayDot state="todo" size={28} label="da fare" />
                    <DayDot state="done" size={28} label="fatto" />
                    <DayDot state="today" size={28} label="oggi" />
                  </div>
                  <div className="flex items-center gap-4 text-dot-done">
                    <HandDot seed="ds-1" size={28} />
                    <HandDot seed="ds-2" size={28} />
                    <HandDot seed="ds-3" size={28} />
                  </div>
                </div>
              </Sub>
              <Sub title="Glass" note="Solo sopra colore o immagine: chip, card prezzo, switch gusto, barra sticky. Mai su carta. Con i fallback per chi non ha backdrop-filter o riduce la trasparenza.">
                <div className="flex flex-wrap items-center gap-4 rounded-xl bg-bg-brand p-6">
                  <Glass tone="light" liquid radius="xl">
                    <p className="type-label text-text-brand">Rituale Completo</p>
                    <p className="mt-1 font-mono text-display-md text-text-primary">€0,94 <span className="text-body-sm font-display font-semibold text-text-muted">al giorno</span></p>
                  </Glass>
                  <Glass tone="onColor" radius="full" padding="sm">
                    <div className="flex items-center gap-3 px-2 text-body-sm font-display font-bold">
                      <HandDot seed="chip" size={14} className="text-neutral-0" />
                      Giulia, <span className="font-mono">47</span> · Bologna
                    </div>
                  </Glass>
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="voce" number="08 — voce in breve" title={<>cinque claim, <Em>sei</Em> regole</>} intro="La gerarchia dei claim con i ruoli, e la colonna sì / no. Per esteso: docs/05 (voce) e docs/06 (compliance).">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card padding="md">
                  <ol className="m-0 flex list-none flex-col gap-4 p-0">
                    {CLAIM_HIERARCHY.map((c) => (
                      <li key={c.key} className="flex flex-col gap-1">
                        <span className="type-label text-text-muted">{c.role}</span>
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
                        <th className="pb-3 type-label text-lime-700">Sì</th>
                        <th className="pb-3 type-label text-errore-700">No</th>
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
                <Button variant="link" as="a" href="https://github.com/noprobagency/eatpeak/blob/main/docs/05-voice-and-copy.md">docs/05 — voce e copy →</Button>
                <Button variant="link" as="a" href="https://github.com/noprobagency/eatpeak/blob/main/docs/06-compliance.md">docs/06 — compliance →</Button>
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="laboratori" number="09 — laboratori" title={<>quattro laboratori, <Em>una</Em> scelta ciascuno</>} intro="Le decisioni ancora aperte non si prendono nel codice: si guardano. Ogni laboratorio mette le alternative fianco a fianco e lascia la scelta al brand.">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { href: to('/lab/font'), title: 'Font', body: 'Deciso nella 3.1: Denim per tutto il testo. Gli altri candidati restano con ?font=<id> e la scorecard.' },
                  { href: to('/lab/simbolo'), title: 'Simbolo', body: 'Deciso nella 3.1: i quattro punti (V7). Il laboratorio tiene le sei varianti a tre punti della 3.0, per la storia.' },
                  { href: to('/lab/box'), title: 'Sezioni', body: 'I sei archetipi di sezione, uno sotto l’altro, e la stessa sequenza a 390 px.' },
                  { href: to('/lab/pack'), title: 'Pack', body: 'La busta nei due gusti con la frutta, il Neutro, il retro con i trenta cerchi e gli stick.' },
                ].map((l) => (
                  <a key={l.href} href={l.href} className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-fast hover:border-border-brand">
                    <span className="flex items-center gap-3 text-heading-md text-text-primary"><HandDot seed={l.title} size={12} className="text-dot-done" />{l.title}</span>
                    <span className="text-body-sm text-text-secondary">{l.body}</span>
                  </a>
                ))}
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
                  <span className="type-label text-text-muted">Dettagli tecnici</span>
                  <span className="text-heading-md text-text-primary">Per lo sviluppo: token, scale, tutti i componenti in tutti gli stati</span>
                </span>
                <span className="text-body-sm text-text-muted">{detailsOpen ? 'chiudi' : 'apri'}</span>
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
                            <span className="block truncate type-label text-text-primary">{name}</span>
                            <span className="block truncate font-mono text-mono-md text-text-muted">{ref} · {hex}</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </Sub>

                <Sub title="Le scale complete">
                  {(Object.keys(palette) as Array<keyof typeof palette>).map((scale) => (
                    <div key={scale} className="mb-6">
                      <p className="mb-2 type-label text-text-muted">{scale}</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
                        {Object.entries(palette[scale]).map(([step, hex]) => (
                          <Swatch key={step} name={step} hex={hex as string} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="mb-2 type-label text-text-muted">stato</p>
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
                        <span className="font-mono text-mono-md text-text-muted">{token}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    {Object.entries(radius).map(([token, value]) => (
                      <div key={token} className="flex flex-col items-center gap-2">
                        <div className="h-20 w-20 border border-border-brand bg-bg-brand-soft" style={{ borderRadius: value }} aria-hidden="true" />
                        <span className="font-mono text-mono-md text-text-muted">{token} · {value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-6">
                    {Object.entries(shadow).map(([token, value]) => (
                      <div key={token} className="flex flex-col items-center gap-3">
                        <div className="h-20 w-32 rounded-lg bg-bg-surface" style={{ boxShadow: value }} aria-hidden="true" />
                        <span className="font-mono text-mono-md text-text-muted">{token}</span>
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
                        <span className="w-24 type-label text-text-muted">{variant}</span>
                        {(['sm', 'md', 'lg'] as const).map((size) => (
                          <Button key={size} variant={variant} size={size}>Aggiungi</Button>
                        ))}
                        <Button variant={variant} loading>Aggiungi</Button>
                        <Button variant={variant} disabled>Aggiungi</Button>
                      </div>
                    ))}
                    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-bg-brand-deep p-4">
                      <span className="w-24 type-label text-neutral-0">inverse</span>
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

                <Sub title="Card" note="I toni profondi portano il testo bianco; l’ambra, i tint e i pieni portano il cacao.">
                  <Grid cols={4}>
                    {(['surface', 'raised', 'warm', 'brand', 'brand-soft', 'brand-tint', 'brand-deep', 'lime-deep', 'arancia', 'lime', 'arancia-tint', 'lime-tint'] as const).map((tone) => (
                      <Card key={tone} tone={tone} elevation={tone === 'surface' ? 'md' : 'none'}>
                        <p className="type-label opacity-70">{tone}</p>
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
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-default text-body-sm text-text-muted">?</span>
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
                        Toast <span className="font-display font-bold">{tone}</span> — aggiunto al carrello.
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
                      <SectionHeader eyebrow="Il protocollo" title={CLAIMS.noLoading.it.toLowerCase()} body={CLAIMS.againstTheTub.it} />
                    </Card>
                    <Card padding="lg">
                      <SectionHeader eyebrow="Il sign-off" title={<>il piacere di sentirsi al <Em>picco</Em></>} genericBenefit authorizedClaim="physical-performance" />
                    </Card>
                  </div>
                </Sub>

                <Sub title="Marquee" note="Di default la banda è ambra 400 con il testo cacao; sui campi colore-gusto il mono è cacao; il bianco sta sulla banda profonda (ambra 700).">
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
                          <Logo size={130} variant="ambra" title="" />
                        </div>
                        <span className="type-label text-errore-700">no · {t.label}</span>
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
                          background: 'linear-gradient(to top right, transparent calc(50% - 1px), rgba(192,57,43,.5) 50%, transparent calc(50% + 1px))',
                        }} />
                      </div>
                    ))}
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {LOGO_FORBIDDEN_USES.map((u) => (
                      <li key={u.label} className="text-body-sm text-text-secondary"><span className="type-label text-errore-700">no · {u.label}</span> — {u.reason}</li>
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
