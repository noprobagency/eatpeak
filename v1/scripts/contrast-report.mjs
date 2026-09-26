/**
 * Calcola i rapporti di contrasto e li scrive dentro docs/02-tokens.md,
 * fra i marcatori CONTRAST:START e CONTRAST:END.
 *
 * E' anche un test: se una coppia dichiarata valida non raggiunge la soglia, o
 * se una coppia dichiarata vietata la raggiungerebbe (nel qual caso il divieto
 * andrebbe rivisto), lo script esce con codice 1.
 *
 *   npm run tokens:contrast
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contrastRatio, round2, verdict } from './lib/contrast.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const t = JSON.parse(readFileSync(resolve(root, 'src/tokens/tokens.json'), 'utf8'))

const c = t.color

/**
 * Le coppie che il manuale dichiara.
 * `allowed: false` significa "il manuale la vieta": lo script verifica che il
 * divieto sia giustificato dai numeri, non solo dal gusto.
 */
const PAIRS = [
  // --- testo su fondo chiaro ---
  { fg: c.neutral['900'], bg: c.neutral['50'], label: '`text-primary` su `bg-page`', allowed: true },
  { fg: c.neutral['900'], bg: c.neutral['0'], label: '`text-primary` su `bg-surface`', allowed: true },
  { fg: c.neutral['700'], bg: c.neutral['50'], label: '`text-secondary` su `bg-page`', allowed: true },
  { fg: c.neutral['600'], bg: c.neutral['0'], label: '`text-muted` su `bg-surface`', allowed: true },
  { fg: c.neutral['600'], bg: c.neutral['50'], label: '`text-muted` su `bg-page`', allowed: true },
  { fg: c.neutral['700'], bg: c.miele['50'], label: '`text-secondary` su `bg-warm`', allowed: true },

  // --- testo brand ---
  { fg: c.terracotta['600'], bg: c.neutral['0'], label: '`text-brand` (terracotta 600) su bianco', allowed: true },
  { fg: c.terracotta['700'], bg: c.neutral['0'], label: 'terracotta 700 su bianco', allowed: true },
  { fg: c.terracotta['700'], bg: c.miele['300'], label: 'terracotta 700 su miele 300', allowed: true },
  { fg: c.terracotta['700'], bg: c.terracotta['50'], label: 'terracotta 700 su terracotta 50', allowed: true },

  // --- testo su fondo pieno ---
  { fg: c.terracotta['900'], bg: c.terracotta['400'], label: '`text-on-brand` (terracotta 900) su terracotta 400', allowed: true },
  { fg: c.neutral['0'], bg: c.terracotta['500'], label: 'bianco su terracotta 500 (hover del pulsante)', allowed: true, largeOnly: true, note: 'Solo per il testo grande.' },
  { fg: c.neutral['900'], bg: c.miele['300'], label: 'inchiostro su miele 300', allowed: true },
  { fg: c.neutral['0'], bg: c.bosco['500'], label: 'bianco su bosco 500', allowed: true },
  { fg: c.neutral['0'], bg: c.bosco['700'], label: 'bianco su bosco 700', allowed: true },
  { fg: c.neutral['0'], bg: c.neutral['900'], label: '`text-inverse` su `bg-inverse`', allowed: true },
  { fg: c.miele['300'], bg: c.neutral['900'], label: 'miele 300 su inchiostro', allowed: true },

  // --- stato ---
  { fg: c.state.error, bg: c.neutral['0'], label: '`error` su bianco', allowed: true },
  { fg: c.bosco['600'], bg: c.neutral['0'], label: 'bosco 600 (success testuale) su bianco', allowed: true },
  { fg: c.miele['800'], bg: c.miele['100'], label: 'miele 800 su miele 100 (badge warning)', allowed: true },
  { fg: c.rosso['700'], bg: c.rosso['50'], label: '`text-danger` su `bg-danger` (blocco di avviso)', allowed: true },
  { fg: c.rosso['700'], bg: c.neutral['0'], label: '`text-danger` su bianco', allowed: true },

  // --- le combinazioni vietate dal manuale ---
  {
    fg: c.miele['300'], bg: c.neutral['0'], allowed: false,
    label: 'miele 300 come **testo** su bianco',
    note: 'Il miele vive come riempimento, fondo o bordo. Mai come testo su fondo chiaro.',
  },
  {
    fg: c.terracotta['400'], bg: c.neutral['0'], allowed: false,
    label: 'terracotta 400 come **testo** su bianco',
    note: 'Per il testo brand su fondo chiaro si usa il 600 o il 700, mai il 400.',
  },
  {
    fg: c.miele['300'], bg: c.terracotta['400'], allowed: false,
    label: 'miele 300 su terracotta 400',
    note: 'E la combinazione del wordmark, dove il contorno risolve. Nel testo no: il testo su terracotta 400 e bianco o terracotta 900.',
  },
  {
    fg: c.neutral['0'], bg: c.terracotta['400'], allowed: false, largeOnly: true,
    label: '`text-on-brand-large` (bianco) su terracotta 400',
    note: 'Raggiunge 3:1: ammesso SOLO per il testo grande (24px, o 18.66px in grassetto). Sotto quella misura si usa `text-on-brand`, che e terracotta 900.',
  },
  {
    fg: c.neutral['500'], bg: c.neutral['0'], allowed: false,
    label: 'neutral 500 come **testo** su bianco',
    note: 'Non raggiunge 4.5:1. E il motivo per cui `--text-muted` punta al 600 e non al 500, come sarebbe stato naturale.',
  },
]

// ---------------------------------------------------------------------------
// Tabella
// ---------------------------------------------------------------------------

const rows = PAIRS.map((p) => {
  const ratio = round2(contrastRatio(p.fg, p.bg))
  const v = verdict(ratio, { large: Boolean(p.largeOnly) })
  // Per il testo grande WCAG AA si accontenta di 3:1.
  const passes = ratio >= (p.largeOnly ? 3 : 4.5)
  return { ...p, ratio, v, passes }
})

const lines = []
lines.push('| Testo | Fondo | Coppia | Rapporto | Esito | Stato nel sistema |')
lines.push('|---|---|---|---|---|---|')

for (const r of rows) {
  const status = r.allowed
    ? r.passes
      ? r.largeOnly ? `Consentita solo per il testo grande. ${r.note ?? ''}`.trim() : 'Consentita.'
      : '**Da rivedere.** Dichiarata valida ma non arriva alla soglia.'
    : `**Vietata.** ${r.note}`
  lines.push(
    `| \`${r.fg}\` | \`${r.bg}\` | ${r.label} | ${r.ratio.toFixed(2)}:1 | ${r.v} | ${status} |`,
  )
}

const table = lines.join('\n')

// ---------------------------------------------------------------------------
// Scrittura
// ---------------------------------------------------------------------------

const docPath = resolve(root, 'docs/02-tokens.md')
const doc = readFileSync(docPath, 'utf8')

const START = '<!-- CONTRAST:START -->'
const END = '<!-- CONTRAST:END -->'

const from = doc.indexOf(START)
const to = doc.indexOf(END)

if (from === -1 || to === -1) {
  console.error(`Mancano i marcatori ${START} / ${END} in docs/02-tokens.md`)
  process.exit(1)
}

const generated = [
  START,
  '',
  `_Tabella generata da \`npm run tokens:contrast\`. Non modificarla a mano._`,
  '',
  table,
  '',
  END,
].join('\n')

writeFileSync(docPath, doc.slice(0, from) + generated + doc.slice(to + END.length))

// ---------------------------------------------------------------------------
// Verifica
// ---------------------------------------------------------------------------

const broken = rows.filter((r) => r.allowed && !r.passes)
const overStrict = rows.filter((r) => !r.allowed && !r.largeOnly && r.ratio >= 4.5)

console.log(`Contrasto — ${rows.length} coppie calcolate, tabella aggiornata in docs/02-tokens.md.`)

if (overStrict.length > 0) {
  console.log(`\n•  ${overStrict.length} coppia vietata che tecnicamente passerebbe:`)
  for (const r of overStrict) console.log(`   ${r.label} — ${r.ratio.toFixed(2)}:1`)
  console.log('   Il divieto resta: e una scelta di sistema, non solo di contrasto.')
}

if (broken.length > 0) {
  console.error(`\n✗  ${broken.length} coppia dichiarata valida che non raggiunge 4.5:1:\n`)
  for (const r of broken) console.error(`   ${r.label} — ${r.ratio.toFixed(2)}:1 (${r.v})`)
  process.exit(1)
}

console.log('✓  Tutte le coppie consentite raggiungono la loro soglia (4.5:1, o 3:1 se marcate solo-grande).')
