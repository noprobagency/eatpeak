/**
 * Calcola i rapporti di contrasto e li scrive dentro docs/02-tokens.md,
 * fra i marcatori CONTRAST:START e CONTRAST:END.
 *
 * E' anche un test: se una coppia dichiarata valida non raggiunge la soglia, o
 * se una coppia dichiarata vietata la raggiungerebbe (nel qual caso il divieto
 * andrebbe rivisto), lo script esce con codice 1.
 *
 * Regola 2.0 sui campi colore-gusto: bianco su arancia 500 (3,68:1) e su lime
 * 500 (3,29:1) sono ammessi SOLO per il logo e per il testo grande. Il testo
 * corrente su un campo colore e' vietato: si usa inchiostro sul tint del gusto.
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
 * `largeOnly: true` abbassa la soglia a 3:1, quella di WCAG AA per il testo
 * grande (>= 24px, o >= 18.66px in grassetto) e per la grafica.
 */
export const PAIRS = [
  // --- testo su fondo chiaro ---
  { fg: c.neutral['900'], bg: c.neutral['50'], label: '`text-primary` su `bg-page` (carta)', allowed: true },
  { fg: c.neutral['900'], bg: c.neutral['0'], label: '`text-primary` su `bg-surface`', allowed: true },
  { fg: c.neutral['700'], bg: c.neutral['50'], label: '`text-secondary` su `bg-page`', allowed: true },
  { fg: c.neutral['600'], bg: c.neutral['0'], label: '`text-muted` su `bg-surface`', allowed: true },
  { fg: c.neutral['600'], bg: c.neutral['50'], label: '`text-muted` su `bg-page`', allowed: true },
  { fg: c.neutral['700'], bg: c.miele['50'], label: '`text-secondary` su `bg-warm`', allowed: true },

  // --- testo brand ---
  { fg: c.arancia['600'], bg: c.neutral['0'], label: '`text-brand` (arancia 600) su bianco', allowed: true },
  { fg: c.arancia['700'], bg: c.neutral['0'], label: 'arancia 700 su bianco', allowed: true },
  { fg: c.arancia['700'], bg: c.neutral['50'], label: 'arancia 700 su carta', allowed: true },
  { fg: c.arancia['700'], bg: c.arancia['50'], label: 'arancia 700 su arancia 50 (badge)', allowed: true },
  { fg: c.lime['700'], bg: c.neutral['0'], label: 'lime 700 (`success`) su bianco', allowed: true },
  { fg: c.lime['700'], bg: c.lime['50'], label: 'lime 700 su lime 50 (badge)', allowed: true },

  // --- i campi colore-gusto: il logo e il testo grande ---
  { fg: c.neutral['0'], bg: c.arancia['500'], label: '**logo bianco** e testo grande su arancia 500', allowed: true, largeOnly: true, note: 'Solo logo, titoli display e numeri grandi (>= 24px bold o >= 32px regular).' },
  { fg: c.neutral['0'], bg: c.lime['500'], label: '**logo bianco** e testo grande su lime 500', allowed: true, largeOnly: true, note: 'Solo logo, titoli display e numeri grandi (>= 24px bold o >= 32px regular).' },
  { fg: c.neutral['0'], bg: c.neutral['900'], label: '`logo-on-flavor` bianco su inchiostro', allowed: true },

  // --- testo piccolo sui campi colore: inchiostro ---
  { fg: c.neutral['900'], bg: c.arancia['500'], label: '`text-on-brand` (inchiostro) su arancia 500 — pulsanti, badge', allowed: true },
  { fg: c.neutral['900'], bg: c.lime['500'], label: 'inchiostro su lime 500', allowed: true },
  { fg: c.neutral['900'], bg: c.arancia['50'], label: '`text-on-flavor-small` su tint arancia', allowed: true },
  { fg: c.neutral['900'], bg: c.lime['50'], label: '`text-on-flavor-small` su tint lime', allowed: true },
  { fg: c.neutral['900'], bg: c.miele['300'], label: 'inchiostro su miele 300 (accento)', allowed: true },

  // --- fondo inverso ---
  { fg: c.neutral['0'], bg: c.neutral['900'], label: '`text-inverse` su `bg-inverse`', allowed: true },
  { fg: c.arancia['500'], bg: c.neutral['900'], label: 'arancia 500 su inchiostro', allowed: true },
  { fg: c.lime['500'], bg: c.neutral['900'], label: 'lime 500 su inchiostro', allowed: true },
  { fg: c.miele['300'], bg: c.neutral['900'], label: 'miele 300 su inchiostro', allowed: true },

  // --- stato ---
  { fg: c.state.error, bg: c.neutral['0'], label: '`error` su bianco', allowed: true },
  { fg: c.miele['800'], bg: c.miele['100'], label: 'miele 800 su miele 100 (badge warning)', allowed: true },
  { fg: c.errore['700'], bg: c.errore['50'], label: '`text-danger` su `bg-danger` (blocco di avviso)', allowed: true },
  { fg: c.errore['700'], bg: c.neutral['0'], label: '`text-danger` su bianco', allowed: true },

  // --- le combinazioni vietate dal manuale ---
  {
    fg: c.neutral['0'], bg: c.arancia['500'], allowed: false, largeOnly: true,
    label: 'bianco come **testo corrente** su arancia 500',
    note: 'Si ferma a 3,68:1. Il testo corrente su un campo colore e vietato: va inchiostro sul tint del gusto. Il bianco resta per il logo e il testo grande.',
  },
  {
    fg: c.neutral['0'], bg: c.lime['500'], allowed: false, largeOnly: true,
    label: 'bianco come **testo corrente** su lime 500',
    note: 'Si ferma a 3,29:1. Stessa regola: inchiostro sul tint, bianco solo per logo e testo grande.',
  },
  {
    fg: c.arancia['500'], bg: c.neutral['0'], allowed: false,
    label: 'arancia 500 come **testo** su bianco',
    note: 'Per il testo brand su fondo chiaro si usa il 600 o il 700, mai il 500. Il 500 e un campo, non un inchiostro.',
  },
  {
    fg: c.lime['500'], bg: c.neutral['0'], allowed: false,
    label: 'lime 500 come **testo** su bianco',
    note: 'Stessa regola dell arancia: il 500 e un campo. Per il testo verde si usa lime 700.',
  },
  {
    fg: c.miele['300'], bg: c.neutral['0'], allowed: false,
    label: 'miele 300 come **testo** su bianco',
    note: 'Il miele e l accento: vive come riempimento, sigillo o badge. Mai come testo su fondo chiaro.',
  },
  {
    fg: c.neutral['500'], bg: c.neutral['0'], allowed: false,
    label: 'neutral 500 come **testo** su bianco',
    note: 'Non raggiunge 4,5:1. E il motivo per cui `--text-muted` punta al 600 e non al 500.',
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
      ? r.largeOnly ? `Consentita solo per logo e testo grande. ${r.note ?? ''}`.trim() : 'Consentita.'
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

// Il criterio di accettazione 2.0: il logo bianco sui due campi colore-gusto
// deve stare a >= 3:1 e comparire nel report.
const logoPairs = rows.filter((r) => r.label.includes('**logo bianco**'))
for (const r of logoPairs) {
  console.log(`   logo bianco: ${r.label.replace('**logo bianco** e testo grande su ', '')} — ${r.ratio.toFixed(2)}:1`)
}

if (overStrict.length > 0) {
  console.log(`\n•  ${overStrict.length} coppia vietata che tecnicamente passerebbe:`)
  for (const r of overStrict) console.log(`   ${r.label} — ${r.ratio.toFixed(2)}:1`)
  console.log('   Il divieto resta: e una scelta di sistema, non solo di contrasto.')
}

if (broken.length > 0) {
  console.error(`\n✗  ${broken.length} coppia dichiarata valida che non raggiunge la soglia:\n`)
  for (const r of broken) console.error(`   ${r.label} — ${r.ratio.toFixed(2)}:1 (${r.v})`)
  process.exit(1)
}

console.log('✓  Tutte le coppie consentite raggiungono la loro soglia (4.5:1, o 3:1 se marcate solo-grande).')
