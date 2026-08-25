/**
 * Showcase — la mappa del sistema.
 *
 * E' la pagina piu' importante del repo: e' quella che uno strumento a valle
 * (Claude Design, un nuovo collaboratore, te fra sei mesi) legge per capire
 * come e' fatto peak. Ogni token e' visualizzato col suo valore, ogni
 * componente compare in ogni stato, e dove il sistema ha un limite quel limite
 * e' mostrato invece che nascosto.
 *
 * Regola per chi la estende: se aggiungi un componente e non lo aggiungi qui,
 * per il sistema quel componente non esiste.
 */

import { useRef, useState } from 'react'
import {
  Accordion, Badge, BrandOverview, Button, Card, Checkbox, Container, Divider, DoseSeal,
  FaqAccordion, Grid, IngredientPanel, Input, Marquee, Modal, PriceTiers,
  ProductCard, QuantityStepper, RadioGroup, ReviewCard, Section, SectionHeader,
  Select, Stack, StickPack, StickyAddToCart, Tabs, Tag, Toast, ToastStack,
  Tooltip, TrustRow, WeekTimeline,
} from '../components'
import { Icon, Lockup, Logo } from '../brand'
import {
  FAVICON_SIZES, ICON_VARIANTS, LOGO_VARIANTS, STROKE_RATIO,
  type IconVariant, type LogoVariant,
} from '../brand/paths'
import tokens, { palette, radius, semantic, shadow, space, typeScale } from '../tokens/tokens'
import { contrastRatio, readableOn, verdict } from '../lib/contrast'
import { CLAIMS, PRODUCT, REVIEWS } from '../lib/copy'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// Impalcatura
// ---------------------------------------------------------------------------

const NAV = [
  { id: 'scheda', label: 'Il brand' },
  { id: 'colore', label: 'Colore' },
  { id: 'contrasto', label: 'Contrasto' },
  { id: 'semantici', label: 'Token semantici' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'spazio', label: 'Spazio e forma' },
  { id: 'logo', label: 'Wordmark' },
  { id: 'icona', label: 'Icona' },
  { id: 'lockup', label: 'Lockup' },
  { id: 'fondamentali', label: 'Componenti base' },
  { id: 'brand', label: 'Componenti brand' },
] as const

function Block({ id, title, intro, children }: {
  id: string; title: string; intro?: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border-subtle py-12 last:border-0">
      <p className="type-mono-md text-text-muted">{title}</p>
      <h2 className="type-display-sm mt-3 text-text-primary">{intro ?? title}</h2>
      <div className="mt-8">{children}</div>
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
// Contrasto
// ---------------------------------------------------------------------------

/** Le coppie che il manuale dichiara valide, piu' quelle che dichiara vietate. */
const CONTRAST_PAIRS: Array<{ fg: string; bg: string; label: string; allowed: boolean; note?: string }> = [
  { fg: palette.neutral['900'], bg: palette.neutral['50'], label: 'text-primary su bg-page', allowed: true },
  { fg: palette.neutral['700'], bg: palette.neutral['50'], label: 'text-secondary su bg-page', allowed: true },
  { fg: palette.neutral['600'], bg: palette.neutral['0'], label: 'text-muted su bg-surface', allowed: true },
  { fg: palette.terracotta['600'], bg: palette.neutral['0'], label: 'text-brand su bg-surface', allowed: true },
  { fg: palette.terracotta['700'], bg: palette.neutral['0'], label: 'terracotta 700 su bianco', allowed: true },
  { fg: palette.terracotta['900'], bg: palette.terracotta['400'], label: 'text-on-brand su terracotta 400', allowed: true },
  { fg: palette.neutral['900'], bg: palette.miele['300'], label: 'inchiostro su miele 300', allowed: true },
  { fg: palette.terracotta['700'], bg: palette.miele['300'], label: 'terracotta 700 su miele 300', allowed: true },
  { fg: palette.neutral['0'], bg: palette.bosco['500'], label: 'bianco su bosco 500', allowed: true },
  { fg: palette.miele['300'], bg: palette.neutral['0'], label: 'miele 300 come testo su bianco', allowed: false, note: 'Vietato. Il miele e riempimento, fondo o bordo — mai testo su fondo chiaro.' },
  { fg: palette.terracotta['400'], bg: palette.neutral['0'], label: 'terracotta 400 come testo su bianco', allowed: false, note: 'Vietato sotto i 18px. Per il testo brand usa il 600 o il 700.' },
  { fg: palette.miele['300'], bg: palette.terracotta['400'], label: 'miele 300 su terracotta 400', allowed: false, note: 'Vietato. E la combinazione del logo, dove il contorno risolve: nel testo no.' },
  { fg: palette.neutral['0'], bg: palette.terracotta['400'], label: 'bianco su terracotta 400', allowed: false, note: 'Si ferma a 3:1. Ammesso solo per il testo grande, con il token text-on-brand-large.' },
  { fg: palette.neutral['500'], bg: palette.neutral['0'], label: 'neutral 500 come testo su bianco', allowed: false, note: 'Non arriva a 4.5:1. E il motivo per cui text-muted punta al 600.' },
]

function ContrastTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-default bg-bg-raised">
            {['Coppia', 'Anteprima', 'Rapporto', 'Esito', 'Regola'].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-mono text-mono-sm uppercase font-normal text-text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((p) => {
            const ratio = contrastRatio(p.fg, p.bg)
            const v = verdict(ratio)
            const passes = v === 'AA' || v === 'AAA'
            return (
              <tr key={p.label} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-3 text-body-sm text-text-primary">{p.label}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block rounded-sm px-3 py-2 text-body-sm"
                    style={{ background: p.bg, color: p.fg }}
                  >
                    Uno stick. Tre grammi.
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-mono-md tabular-nums text-text-secondary">
                  {ratio.toFixed(2)}:1
                </td>
                <td className="px-4 py-3">
                  <Badge tone={passes ? 'success' : 'error'} variant="soft">{v}</Badge>
                </td>
                <td className="max-w-[280px] px-4 py-3 text-body-sm text-text-secondary">
                  {p.allowed ? 'Consentita.' : p.note}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// La pagina
// ---------------------------------------------------------------------------

export function Showcase() {
  const [qty, setQty] = useState(1)
  const [tier, setTier] = useState(2)
  const [radioValue, setRadioValue] = useState('mattina')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const stickyAnchor = useRef<HTMLDivElement>(null)

  return (
    <>
      {/*
        L'apertura della pagina e' la scheda del brand, non un titolo sullo
        showcase. Chi legge i token senza sapere cos'e' peak applica il sistema
        senza capirlo, ed e' cosi' che un design system si degrada in una
        tavolozza. E' un'introduzione: deve occupare poco e finire presto.
      */}
      <Section tone="page" spacing="tight">
        <Container>
          <div id="scheda" className="scroll-mt-24">
            <BrandOverview authorizedClaim="physical-performance" titleAs="h1" />
          </div>
        </Container>
      </Section>

      <Container>
        <div className="flex gap-12 py-10">
          {/* Navigazione laterale */}
          <nav aria-label="Sezioni dello showcase" className="sticky top-24 hidden h-fit w-[208px] shrink-0 lg:block">
            <ul className="flex flex-col gap-1 border-l border-border-subtle">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
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
            <Block id="colore" title="01 — colore" intro="quattro scale, tutte calde">
              <p className="max-w-prose text-body-md text-text-secondary">
                I neutri sono caldi di proposito. Un grigio neutro o freddo, anche uno solo, spezza la
                temperatura di tutto il resto: e la cosa si nota prima di riuscire a spiegarsela.
              </p>

              {(Object.keys(palette) as Array<keyof typeof palette>).map((scale) => (
                <Sub key={scale} title={scale}>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
                    {Object.entries(palette[scale]).map(([step, hex]) => (
                      <Swatch key={step} name={step} hex={hex as string} />
                    ))}
                  </div>
                </Sub>
              ))}

              <Sub title="stato" note="Success riusa il bosco: non serviva un verde in piu'.">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(tokens.color.state).map(([name, hex]) => (
                    <Swatch key={name} name={name} hex={hex} />
                  ))}
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="contrasto" title="02 — contrasto" intro="cosa si legge e cosa no">
              <p className="max-w-prose text-body-md text-text-secondary">
                I rapporti sono calcolati, non stimati. Le ultime tre righe sono le combinazioni vietate dal
                manuale: stanno qui apposta, perche' un divieto senza la prova visiva non viene rispettato.
              </p>
              <div className="mt-6">
                <ContrastTable />
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="semantici" title="03 — token semantici" intro="gli unici da usare nei componenti">
              <p className="max-w-prose text-body-md text-text-secondary">
                Nei componenti si scrive <code className="font-mono text-mono-md">bg-brand</code>, mai
                <code className="font-mono text-mono-md"> terracotta-400</code>. Il giorno che il brand cambia
                sfumatura si tocca un file, non trecento.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(semantic).map(([name, ref]) => {
                  const [scale, step] = (ref as string).split('.')
                  const hex = (palette as Record<string, Record<string, string>>)[scale][step]
                  return (
                    <div key={name} className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-3">
                      <span
                        className="h-control-sm w-control-sm shrink-0 rounded-sm border border-border-subtle"
                        style={{ background: hex }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-mono-md uppercase text-text-primary">{name}</span>
                        <span className="block truncate font-mono text-mono-sm uppercase text-text-muted">
                          {ref} · {hex}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="tipografia" title="04 — tipografia" intro="rounded minuscolo, mono per i dati">
              <p className="max-w-prose text-body-md text-text-secondary">
                I display sono sempre minuscoli: e' identita', non stile. Il mono non e' decorativo — porta
                tutti i dati oggettivi, ed e' il contrappeso che impedisce al rounded di diventare infantile.
              </p>

              <div className="mt-6 rounded-lg border border-border-subtle bg-bg-surface">
                {(Object.keys(typeScale) as Array<keyof typeof typeScale>).map((name) => {
                  const s = typeScale[name]
                  return (
                    <div key={name} className="flex flex-col gap-3 border-b border-border-subtle p-6 last:border-0 lg:flex-row lg:items-baseline lg:gap-8">
                      <div className="w-[176px] shrink-0">
                        <p className="font-mono text-mono-md uppercase text-text-primary">{name}</p>
                        <p className="font-mono text-mono-sm uppercase text-text-muted">
                          {s.size} / {s.lineHeight} / {s.tracking}
                        </p>
                      </div>
                      <p className={cn(`type-${name}`, 'min-w-0 flex-1 truncate text-text-primary')}>
                        {s.family === 'mono' ? 'uno stick · tre grammi · 30 giorni' : 'il piacere di sentirsi al picco'}
                      </p>
                    </div>
                  )
                })}
              </div>

              <Sub title="le tre famiglie" note="Se i file Rund non ci sono, il sistema scende sui fallback gratuiti e non si rompe. Cambia la voce, non il funzionamento.">
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(tokens.font).map(([role, stack]) => (
                    <Card key={role} padding="sm">
                      <p className="font-mono text-mono-sm uppercase text-text-muted">{role}</p>
                      <p
                        className="mt-3 text-heading-lg text-text-primary"
                        style={{ fontFamily: `var(--font-${role})` }}
                      >
                        peak 3g
                      </p>
                      <p className="mt-3 break-words font-mono text-mono-sm uppercase text-text-muted">{stack}</p>
                    </Card>
                  ))}
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="spazio" title="05 — spazio, forma, movimento" intro="base 4, raggi generosi, ombre minime">
              <Sub title="spazio">
                <div className="flex flex-wrap items-end gap-4">
                  {Object.entries(space).map(([token, value]) => (
                    <div key={token} className="flex flex-col items-center gap-2">
                      <div className="bg-bg-brand" style={{ width: value, height: 24, minWidth: 2 }} aria-hidden="true" />
                      <span className="font-mono text-mono-sm uppercase text-text-muted">{token}</span>
                      <span className="font-mono text-mono-sm uppercase text-text-muted">{value}</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="raggi" note="I pulsanti usano sempre full. Le card lg o xl. Spigoli vivi solo nelle bande a tutta larghezza.">
                <div className="flex flex-wrap gap-4">
                  {Object.entries(radius).map(([token, value]) => (
                    <div key={token} className="flex flex-col items-center gap-2">
                      <div
                        className="h-20 w-20 border border-border-brand bg-bg-brand-soft"
                        style={{ borderRadius: value }}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-mono-sm uppercase text-text-muted">{token} · {value}</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="ombre" note="Mai ombre colorate, mai glow. Il brand e' piatto: l'ombra dice solo cosa sta sopra cosa.">
                <div className="flex flex-wrap gap-6">
                  {Object.entries(shadow).map(([token, value]) => (
                    <div key={token} className="flex flex-col items-center gap-3">
                      <div className="h-20 w-32 rounded-lg bg-bg-surface" style={{ boxShadow: value }} aria-hidden="true" />
                      <span className="font-mono text-mono-sm uppercase text-text-muted">{token}</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="movimento" note="Ogni durata si azzera con prefers-reduced-motion. Il marquee si ferma e diventa una riga fissa.">
                <div className="flex flex-wrap gap-3">
                  {Object.entries(tokens.motion.duration).map(([token, value]) => (
                    <Badge key={token} tone="neutral" variant="soft">{token} · {value}</Badge>
                  ))}
                  <Badge tone="neutral" variant="soft">easing · {tokens.motion.easing.standard}</Badge>
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="logo" title="06 — wordmark" intro="undici varianti, tre spessori">
              <p className="max-w-prose text-body-md text-text-secondary">
                Il contorno sta all'esterno del disegno della lettera, cosi' la lettera non si assottiglia.
                E il filo non scala col logo: sotto una certa soglia entrerebbe nelle contro-forme di
                &quot;e&quot; e &quot;a&quot; e il nome diventerebbe una macchia.
              </p>

              <Sub title="le varianti">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(Object.keys(LOGO_VARIANTS) as LogoVariant[]).map((v) => {
                    const dark = v === 'solid-white'
                    return (
                      <div key={v} className={cn('rounded-md border border-border-subtle p-5', dark ? 'bg-bg-inverse' : 'bg-bg-surface')}>
                        <div className="flex h-20 items-center justify-center">
                          <Logo size={150} variant={v} title="" />
                        </div>
                        <p className={cn('mt-3 font-mono text-mono-sm uppercase', dark ? 'text-neutral-0' : 'text-text-primary')}>
                          {LOGO_VARIANTS[v].label}
                        </p>
                        <p className={cn('mt-1 text-body-sm', dark ? 'text-neutral-0/70' : 'text-text-secondary')}>
                          {LOGO_VARIANTS[v].note}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </Sub>

              <Sub title="i tre spessori" note="Il componente sceglie da solo in base a size. Qui sono affiancati alla stessa scala per far vedere la differenza.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border-subtle bg-bg-surface p-8">
                  {(Object.keys(STROKE_RATIO) as Array<keyof typeof STROKE_RATIO>).map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <Logo size={170} strokeSize={s} title="" />
                      <span className="font-mono text-mono-sm uppercase text-text-muted">
                        {s} · rapporto {STROKE_RATIO[s]}
                      </span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="alle misure reali" note="La terza e' la misura nell'header di un sito, la quarta e' il limite basso. Nota come il filo si assottiglia: e' automatico.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border-subtle bg-bg-surface p-8">
                  {[200, 110, 64, 34].map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Logo size={size} title="" />
                      <span className="font-mono text-mono-sm uppercase text-text-muted">{size}px</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="su fondo colorato" note="Il contorno risolve un problema pratico: il logo resta leggibile ovunque senza una versione in negativo.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {([
                    { bg: 'bg-miele-50', ink: 'text-text-muted', variant: 'honey-terracotta', label: 'crema' },
                    { bg: 'bg-terracotta-400', ink: 'text-terracotta-900', variant: 'honey-terracotta-deep', label: 'terracotta' },
                    { bg: 'bg-bosco-500', ink: 'text-neutral-0', variant: 'honey-forest-deep', label: 'bosco' },
                    { bg: 'bg-neutral-900', ink: 'text-neutral-0', variant: 'honey-terracotta', label: 'scuro' },
                  ] as const).map((t) => (
                    <div key={t.label} className={cn('flex flex-col items-center gap-3 rounded-md p-6', t.bg)}>
                      <Logo size={140} variant={t.variant} title="" />
                      <span className={cn('font-mono text-mono-sm uppercase', t.ink)}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="usi vietati" note="Documentati per esteso in docs/03-logo.md. Qui la versione visiva.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {([
                    { label: 'ruotato', style: { transform: 'rotate(-12deg)' } },
                    { label: 'inclinato', style: { transform: 'skewX(-14deg)' } },
                    { label: 'con ombra', style: { filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' } },
                    { label: 'tracking cambiato', style: { letterSpacing: '0.2em' } },
                  ] as const).map((t) => (
                    <div key={t.label} className="relative flex flex-col items-center gap-3 overflow-hidden rounded-md border border-error/40 bg-bg-surface p-6">
                      <div className="flex h-20 items-center" style={t.style}>
                        <Logo size={130} title="" />
                      </div>
                      <span className="font-mono text-mono-sm uppercase text-error">no · {t.label}</span>
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
                        background: 'linear-gradient(to top right, transparent calc(50% - 1px), rgba(192,57,43,.5) 50%, transparent calc(50% + 1px))',
                      }} />
                    </div>
                  ))}
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="icona" title="07 — icona" intro="la saetta che punta in su">
              <p className="max-w-prose text-body-md text-text-secondary">
                L'orientamento all'insu' e' il dettaglio che la fa leggere come ascesa e non come scarica
                elettrica, e la lega al significato di &quot;peak&quot; senza disegnare una montagna.
              </p>

              <Sub title="le dodici varianti">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {(Object.keys(ICON_VARIANTS) as IconVariant[]).map((v) => (
                    <div key={v} className="flex flex-col items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-5">
                      <Icon size={80} variant={v} title="" />
                      <span className="text-center font-mono text-mono-sm uppercase text-text-muted">
                        {ICON_VARIANTS[v].label}
                      </span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub title="il test di dimensione" note="La versione piena regge fino alla favicon reale del browser.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border-subtle bg-bg-surface p-8">
                  {FAVICON_SIZES.filter((s) => s <= 96).map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Icon size={size} title="" />
                      <span className="font-mono text-mono-sm uppercase text-text-muted">{size}px</span>
                    </div>
                  ))}
                </div>
              </Sub>

              <Sub
                title="perche' il contorno sparisce sotto i 48px"
                note="A sinistra il comportamento reale del componente, a destra lo stesso con forceOutline. Sotto i 32px il filo scuro si mangia la saetta e l'icona diventa una macchia."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {([false, true] as const).map((force) => (
                    <div key={String(force)} className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                      <p className="mb-4 font-mono text-mono-sm uppercase text-text-muted">
                        {force ? 'contorno forzato — sbagliato' : 'comportamento del componente'}
                      </p>
                      <div className="flex flex-wrap items-end gap-6">
                        {[96, 64, 48, 32, 16].map((size) => (
                          <div key={size} className="flex flex-col items-center gap-2">
                            <Icon size={size} variant="terracotta-honey-outline" forceOutline={force} title="" />
                            <span className="font-mono text-mono-sm uppercase text-text-muted">{size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Sub>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="lockup" title="08 — lockup" intro="una regola sola">
              <p className="max-w-prose text-body-md text-text-secondary">
                Lo spazio tra icona e parola e' pari alla meta' dell'altezza dell'icona. Non serve altro.
                L'area di rispetto e' un margine libero pari all'altezza della &quot;p&quot; minuscola.
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <Card padding="lg" className="flex items-center justify-center">
                  <Lockup iconSize={64} />
                </Card>
                <Card padding="lg" className="flex items-center justify-center">
                  <Lockup iconSize={64} orientation="vertical" />
                </Card>
              </div>
              <div className="mt-4">
                <Card padding="lg" className="flex items-center justify-center bg-bg-raised">
                  <div className="bg-bg-surface outline-dashed outline-1 outline-border-brand">
                    <Lockup iconSize={56} withClearspace />
                  </div>
                </Card>
                <p className="mt-2 font-mono text-mono-sm uppercase text-text-muted">
                  area di rispetto — il tratteggio e' il limite oltre cui non entra nulla
                </p>
              </div>
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="fondamentali" title="09 — componenti base" intro="ogni stato, non solo quello buono">
              <Sub title="Button — varianti e dimensioni">
                <Stack gap="6">
                  {(['primary', 'secondary', 'ghost', 'link'] as const).map((variant) => (
                    <div key={variant} className="flex flex-wrap items-center gap-4">
                      <span className="w-24 font-mono text-mono-sm uppercase text-text-muted">{variant}</span>
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <Button key={size} variant={variant} size={size}>Aggiungi</Button>
                      ))}
                      <Button variant={variant} loading>Aggiungi</Button>
                      <Button variant={variant} disabled>Aggiungi</Button>
                    </div>
                  ))}
                </Stack>
                <p className="mt-4 text-body-sm text-text-secondary">
                  {/* peak-compliance-ignore focus — anello di focus da tastiera, non un claim */}
                Hover, active e focus si provano col puntatore e col tasto Tab: l'anello di focus e'
                  terracotta 700 con offset 2px su tutto il sistema.
                </p>
              </Sub>

              <Sub title="Input, Select, Checkbox, Radio">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Stack gap="5">
                    <Input label="Email" type="email" placeholder="nome@esempio.it" hint="Ti scriviamo solo per l'ordine." />
                    <Input label="Codice lotto" mono placeholder="PK-2026-0142" />
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
                    <Checkbox label="Voglio ricevere il promemoria quando la confezione sta per finire." />
                    <Checkbox label="Casella disattivata" disabled />
                    <RadioGroup
                      legend="Quando la prendi"
                      name="momento"
                      value={radioValue}
                      onChange={setRadioValue}
                      options={[
                        { value: 'mattina', label: 'La mattina', hint: 'Appena sveglio, con l\'acqua.' },
                        { value: 'allenamento', label: 'Vicino all\'allenamento' },
                        { value: 'sera', label: 'La sera' },
                      ]}
                    />
                  </Stack>
                </div>
              </Sub>

              <Sub title="QuantityStepper, Badge, Tag">
                <Stack gap="6">
                  <div className="flex flex-wrap items-center gap-8">
                    <QuantityStepper value={qty} onChange={setQty} />
                    <QuantityStepper value={1} onChange={() => {}} size="sm" />
                    <QuantityStepper value={1} onChange={() => {}} disabled />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(['brand', 'forest', 'honey', 'neutral', 'success', 'warning', 'error'] as const).map((tone) => (
                      <Badge key={tone} tone={tone} variant="soft">{tone}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['brand', 'forest', 'honey', 'neutral', 'success', 'warning', 'error'] as const).map((tone) => (
                      <Badge key={tone} tone={tone} variant="solid">{tone}</Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Tag>Non interattivo</Tag>
                    <Tag onClick={() => {}}>Cliccabile</Tag>
                    <Tag onClick={() => {}} selected>Selezionato</Tag>
                    <Tag onRemove={() => {}}>Rimuovibile</Tag>
                  </div>
                </Stack>
              </Sub>

              <Sub title="Card">
                <Grid cols={3}>
                  {(['surface', 'raised', 'warm', 'brand', 'forest'] as const).map((tone) => (
                    <Card key={tone} tone={tone} elevation={tone === 'surface' ? 'md' : 'none'}>
                      <p className="font-mono text-mono-sm uppercase opacity-70">{tone}</p>
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
                      { title: 'Come si apre lo stick', content: 'Si strappa dalla tacca, si versa in un bicchiere d\'acqua e si mescola qualche secondo.' },
                      { title: 'Dove si conserva', content: 'A temperatura ambiente, al riparo dalla luce. Non serve il frigorifero.' },
                      { title: 'Quanto dura una confezione', content: 'Trenta stick, uno al giorno: trenta giorni esatti.' },
                    ]}
                  />
                  <Tabs
                    items={[
                      { id: 'come', label: 'Come', content: CLAIMS.gesture.it },
                      { id: 'quanto', label: 'Quanto', content: `${PRODUCT.dose} ${PRODUCT.doseUnit} per stick, ${PRODUCT.days} stick per confezione.` },
                      { id: 'presto', label: 'Presto', content: 'In arrivo.', disabled: true },
                    ]}
                  />
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-body-md text-text-secondary">Creatina monoidrato</span>
                  <Tooltip content="La forma piu' studiata, e quella a cui si riferisce il claim autorizzato.">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-default font-mono text-mono-sm text-text-muted">?</span>
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
            </Block>

            {/* ---------------------------------------------------------- */}
            <Block id="brand" title="10 — componenti brand" intro="quelli che esistono solo qui">
              <Sub title="SectionHeader" note="Con genericBenefit il claim autorizzato diventa obbligatorio per tipo: e' il vincolo di compliance espresso nel sistema dei tipi.">
                <div className="grid gap-8 lg:grid-cols-2">
                  <Card padding="lg">
                    <SectionHeader eyebrow="il formato" title="uno stick, non un barattolo" body={CLAIMS.againstTheTub.it} />
                  </Card>
                  <Card padding="lg">
                    <SectionHeader
                      eyebrow="il claim corto"
                      title="il piacere di sentirsi al picco"
                      genericBenefit
                      authorizedClaim="physical-performance"
                    />
                  </Card>
                </div>
              </Sub>

              <Sub title="DoseSeal">
                <div className="flex flex-wrap items-center gap-6">
                  <DoseSeal value={3} unit="g" caption="per stick" />
                  <DoseSeal value={30} unit="stick" caption="30 giorni" tone="brand" />
                  <DoseSeal value={0} unit="additivi" tone="forest" size={104} />
                  <DoseSeal value={100} unit="%" caption="monoidrato" tone="ink" size={88} />
                </div>
              </Sub>

              <Sub title="StickPack" note="La banda colore e' parametrica: cambiando band si ottiene la variante di gusto senza toccare il disegno.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg bg-bg-warm p-8">
                  <StickPack height={260} />
                  <StickPack height={260} band="#2F6E5E" body="#D6E5E0" ink="#102D26" label="3 G" />
                  <StickPack height={260} band="#1B1A18" body="#F5F4F2" ink="#1B1A18" label="3 G" />
                </div>
              </Sub>

              <Sub title="WeekTimeline" note="Il componente narrativo centrale. I testi descrivono il gesto e il tempo, mai un effetto: l'effetto lo dice il claim autorizzato, e va accanto.">
                <WeekTimeline highlight={3} />
              </Sub>

              <Sub title="TrustRow">
                <TrustRow />
                <div className="mt-6">
                  <TrustRow variant="compact" />
                </div>
              </Sub>

              <Sub title="Marquee" note="Attiva prefers-reduced-motion nel sistema operativo per vederlo diventare una riga fissa.">
                <div className="-mx-6 md:-mx-[28px]">
                  <Marquee />
                  <div className="mt-3">
                    <Marquee tone="forest" />
                  </div>
                  <div className="mt-3">
                    <Marquee tone="honey" />
                  </div>
                </div>
              </Sub>

              <Sub title="PriceTiers" note="Il risparmio e' calcolato sul prezzo unitario del primo livello, non scritto a mano: cosi' non puo' mentire.">
                <PriceTiers value={tier} onChange={setTier} />
              </Sub>

              <Sub title="ProductCard">
                <Grid cols={3}>
                  <ProductCard
                    name="creatina monoidrato"
                    format="30 stickpack monodose"
                    priceEur={29}
                    days={30}
                    visual={<StickPack height={180} />}
                    badge={<Badge tone="honey" variant="solid">novita</Badge>}
                    onAddToCart={() => setToastOpen(true)}
                  />
                  <ProductCard
                    name="creatina monoidrato"
                    format="60 stickpack monodose"
                    priceEur={52}
                    days={60}
                    visual={<StickPack height={180} band="#2F6E5E" body="#D6E5E0" ink="#102D26" />}
                    badge={<Badge tone="success" variant="solid">spedizione gratuita</Badge>}
                    onAddToCart={() => setToastOpen(true)}
                  />
                  <ProductCard
                    name="creatina monoidrato"
                    format="90 stickpack monodose"
                    priceEur={72}
                    days={90}
                    visual={<StickPack height={180} band="#1B1A18" body="#F5F4F2" ink="#1B1A18" />}
                    soldOut
                    onAddToCart={() => {}}
                  />
                </Grid>
              </Sub>

              <Sub title="ReviewCard">
                <Grid cols={3}>
                  {REVIEWS.map((r) => (
                    <ReviewCard key={r.author} stars={r.stars as 4 | 5} text={r.text} author={r.author} benefit={r.benefit} verified />
                  ))}
                </Grid>
              </Sub>

              <Sub title="IngredientPanel">
                <IngredientPanel />
              </Sub>

              <Sub title="FaqAccordion">
                <FaqAccordion structuredData={false} />
              </Sub>

              <Sub title="StickyAddToCart" note="Compare quando l'elemento osservato esce dallo schermo. Qui l'ancora e' il riquadro sotto: scorri finche' sparisce.">
                <div ref={stickyAnchor} className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border-strong bg-bg-raised">
                  <span className="font-mono text-mono-sm uppercase text-text-muted">ancora osservata</span>
                </div>
              </Sub>
            </Block>
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
        <p>{CLAIMS.gesture.it} Uno stick al giorno, tutti i giorni: e' la costanza a fare il lavoro.</p>
      </Modal>

      {toastOpen && (
        <ToastStack>
          <Toast tone="success" onDismiss={() => setToastOpen(false)}>
            Aggiunto al carrello — 30 stickpack.
          </Toast>
        </ToastStack>
      )}

      <StickyAddToCart
        name="creatina monoidrato"
        detail="30 stick · 0,97 € al giorno"
        priceEur={29}
        watch={stickyAnchor}
        onAddToCart={() => setToastOpen(true)}
      />
    </>
  )
}

export default Showcase
