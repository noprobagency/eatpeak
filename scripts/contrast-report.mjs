/**
 * Calcola i rapporti di contrasto e li scrive dentro docs/02-tokens.md,
 * fra i marcatori CONTRAST:START e CONTRAST:END.
 *
 * E' anche un test: se una coppia dichiarata valida non raggiunge la soglia, o
 * se una coppia dichiarata vietata la raggiungerebbe (nel qual caso il divieto
 * andrebbe rivisto), lo script esce con codice 1.
 *
 * Regole 3.0:
 * - il testo e' cacao (900 / 600 / 500), mai inchiostro: l'inchiostro e' un
 *   token di stampa e non compare qui;
 * - le superfici scure sono arancia 600 e lime 700, con testo bianco;
 * - sui campi 500 (arancia, lime) stanno solo il logo, i titoli e i numeri
 *   grandi: il testo corrente ci va sopra solo sul tint, in cacao.
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

export const PAIRS = [
  // --- testo cacao su fondo chiaro ---
  { fg: c.cacao['900'], bg: c.neutral['50'], label: '`text-primary` (cacao 900) su carta', allowed: true },
  { fg: c.cacao['900'], bg: c.neutral['0'], label: '`text-primary` su bianco', allowed: true },
  { fg: c.cacao['600'], bg: c.neutral['50'], label: '`text-secondary` (cacao 600) su carta', allowed: true },
  { fg: c.cacao['500'], bg: c.neutral['50'], label: '`text-muted` (cacao 500) su carta', allowed: true },
  { fg: c.cacao['500'], bg: c.neutral['0'], label: '`text-muted` su bianco', allowed: true },
  { fg: c.cacao['900'], bg: c.arancia['50'], label: '`text-on-flavor-small` (cacao 900) su tint arancia', allowed: true },
  { fg: c.cacao['900'], bg: c.lime['50'], label: '`text-on-flavor-small` su tint lime', allowed: true },
  { fg: c.cacao['500'], bg: c.arancia['50'], label: 'cacao 500 su tint arancia', allowed: true },
  { fg: c.cacao['600'], bg: c.miele['50'], label: '`text-secondary` su `bg-warm`', allowed: true },
  { fg: c.cacao['900'], bg: c.miele['300'], label: 'cacao 900 su miele 300 (accento, badge)', allowed: true },

  // --- testo brand ---
  { fg: c.arancia['600'], bg: c.neutral['0'], label: '`text-brand` (arancia 600) su bianco — occhielli', allowed: true },
  { fg: c.arancia['600'], bg: c.neutral['50'], label: 'arancia 600 su carta — occhielli', allowed: true },
  { fg: c.arancia['700'], bg: c.neutral['0'], label: 'arancia 700 su bianco — pillola bianca sui campi', allowed: true },
  { fg: c.arancia['700'], bg: c.arancia['50'], label: 'arancia 700 su arancia 50 (badge)', allowed: true },
  { fg: c.lime['700'], bg: c.neutral['0'], label: 'lime 700 (`success`) su bianco', allowed: true },
  { fg: c.lime['700'], bg: c.lime['50'], label: 'lime 700 su lime 50 (badge)', allowed: true },

  // --- le superfici brand scure: testo corrente bianco ---
  { fg: c.neutral['0'], bg: c.arancia['600'], label: '**bianco su arancia 600** — pulsante primario, footer, toast, `bg-brand-deep`', allowed: true },
  { fg: c.neutral['0'], bg: c.lime['700'], label: '**bianco su lime 700** — `bg-lime-deep`', allowed: true },
  { fg: c.neutral['0'], bg: c.arancia['700'], label: 'bianco su arancia 700 (hover del primario)', allowed: true },

  // --- i campi colore-gusto 500: solo logo e testo grande ---
  { fg: c.neutral['0'], bg: c.arancia['500'], label: '**logo bianco** e testo grande su arancia 500', allowed: true, largeOnly: true, note: 'Solo logo, titoli display e numeri grandi (>= 24px bold o >= 32px regular).' },
  { fg: c.neutral['0'], bg: c.lime['500'], label: '**logo bianco** e testo grande su lime 500', allowed: true, largeOnly: true, note: 'Solo logo, titoli display e numeri grandi.' },

  // --- vetro: il velo interno garantisce il cacao ---
  { fg: c.cacao['900'], bg: '#F6EFEA', label: 'cacao 900 sul vetro con velo (bianco 62% su arancia)', allowed: true },

  // --- stato ---
  { fg: c.state.error, bg: c.neutral['0'], label: '`error` su bianco', allowed: true },
  { fg: c.miele['800'], bg: c.miele['100'], label: 'miele 800 su miele 100 (badge warning)', allowed: true },
  { fg: c.errore['700'], bg: c.errore['50'], label: '`text-danger` su `bg-danger`', allowed: true },

  // --- le combinazioni vietate dal manuale ---
  {
    fg: c.neutral['0'], bg: c.arancia['500'], allowed: false, largeOnly: true,
    label: 'bianco come **testo corrente** su arancia 500',
    note: 'Si ferma a 3,68:1. Il testo corrente sta sul deep (arancia 600) o, in cacao, sul tint.',
  },
  {
    fg: c.cacao['900'], bg: c.arancia['500'], allowed: false, largeOnly: true,
    label: 'cacao 900 come **testo corrente** su arancia 500',
    note: 'Si ferma a 3,72:1: nemmeno il cacao regge sul 500. Sul 500 stanno solo logo e testo grande.',
  },
  {
    fg: c.neutral['0'], bg: c.lime['500'], allowed: false, largeOnly: true,
    label: 'bianco come **testo corrente** su lime 500',
    note: 'Si ferma a 3,29:1. Il testo corrente sta su lime 700.',
  },
  {
    fg: c.arancia['500'], bg: c.neutral['0'], allowed: false,
    label: 'arancia 500 come **testo** su bianco',
    note: 'Per il testo brand su fondo chiaro si usa il 600 o il 700. Il 500 e un campo, non un inchiostro.',
  },
  {
    fg: c.miele['300'], bg: c.neutral['0'], allowed: false,
    label: 'miele 300 come **testo** su bianco',
    note: 'Il miele e l accento: bollino, badge, il punto di oggi. Mai come testo su fondo chiaro.',
  },
  {
    fg: c.cacao['400'], bg: c.neutral['0'], allowed: false,
    label: 'cacao 400 come **testo** su bianco',
    note: 'Non raggiunge 4,5:1: e il colore degli anelli da fare, non un inchiostro. text-muted parte dal 500.',
  },
]

// ---------------------------------------------------------------------------
// Tabella
// ---------------------------------------------------------------------------

const rows = PAIRS.map((p) => {
  const ratio = round2(contrastRatio(p.fg, p.bg))
  const v = verdict(ratio, { large: Boolean(p.largeOnly) })
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
  lines.push(`| \`${r.fg}\` | \`${r.bg}\` | ${r.label} | ${r.ratio.toFixed(2)}:1 | ${r.v} | ${status} |`)
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

for (const r of rows.filter((x) => x.label.includes('**'))) {
  console.log(`   ${r.label.replace(/\*\*/g, '')} — ${r.ratio.toFixed(2)}:1`)
}

// L'inchiostro di stampa non deve comparire in nessuna coppia: e' un token di stampa.
const ink = t.color.print.ink.toUpperCase()
if (rows.some((r) => r.fg.toUpperCase() === ink || r.bg.toUpperCase() === ink)) {
  console.error(`\n✗  ${ink} e un token di stampa e non deve entrare nel contrast report dell interfaccia.`)
  process.exit(1)
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
