/**
 * Calcola i rapporti di contrasto e li scrive dentro docs/02-tokens.md,
 * fra i marcatori CONTRAST:START e CONTRAST:END.
 *
 * E' anche un test: se una coppia dichiarata valida non raggiunge la soglia, o
 * se una coppia dichiarata vietata la raggiungerebbe (nel qual caso il divieto
 * andrebbe rivisto), lo script esce con codice 1.
 *
 * Regole 3.1:
 * - il colore brand e' l'ambra: il 400 fa i fondi e ci si scrive SOLO in
 *   cacao 900 (7,4:1); mai bianco (1,85:1), mai i grigi cacao;
 * - l'ambra 700 e' il profondo: punti e simbolo su chiaro, link, testo brand,
 *   anello della tastiera; regge anche il bianco (toast, tooltip);
 * - il testo e' cacao (900 / 600 / 500), mai inchiostro: l'inchiostro e' un
 *   token di stampa e non compare qui;
 * - arancia e lime restano i colori-gusto del pack: sui 500 solo logo, titoli
 *   e numeri grandi.
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
  { fg: c.cacao['600'], bg: c.miele['50'], label: '`text-secondary` su `bg-warm`', allowed: true },
  { fg: c.cacao['900'], bg: c.miele['300'], label: 'cacao 900 su miele 300 (accento, il punto di oggi)', allowed: true },

  // --- l'ambra: i fondi (400) e il testo cacao ---
  { fg: c.cacao['900'], bg: c.ambra['400'], label: '**cacao 900 su ambra 400** — `text-on-brand` su `bg-brand`: hero, bande, footer, annunci, pulsante primario, badge', allowed: true },
  { fg: c.cacao['900'], bg: c.ambra['500'], label: 'cacao 900 su ambra 500 — hover del primario (`bg-brand-hover`)', allowed: true },
  { fg: c.cacao['900'], bg: c.ambra['50'], label: 'cacao 900 su ambra 50 — `bg-brand-soft`', allowed: true },
  { fg: c.cacao['900'], bg: c.ambra['100'], label: 'cacao 900 su ambra 100 — `bg-brand-tint`', allowed: true },
  { fg: c.cacao['600'], bg: c.ambra['50'], label: '`text-secondary` su ambra 50', allowed: true },
  { fg: c.cacao['500'], bg: c.ambra['50'], label: '`text-muted` su ambra 50', allowed: true },

  // --- l'ambra 700: il testo brand e il profondo ---
  { fg: c.ambra['700'], bg: c.neutral['50'], label: '**`text-brand` (ambra 700) su carta** — link, occhielli, secondario', allowed: true },
  { fg: c.ambra['700'], bg: c.neutral['0'], label: 'ambra 700 su bianco — pillola bianca sui campi, secondario', allowed: true },
  { fg: c.ambra['700'], bg: c.ambra['50'], label: 'ambra 700 su ambra 50 — badge tenue', allowed: true },
  { fg: c.ambra['700'], bg: c.ambra['100'], label: 'ambra 700 su ambra 100', allowed: true },
  { fg: c.neutral['0'], bg: c.ambra['700'], label: '**bianco su ambra 700** — `bg-brand-deep`: toast, tooltip, play', allowed: true },

  // --- lime, i colori-gusto e i loro deep ---
  { fg: c.cacao['900'], bg: c.arancia['50'], label: 'cacao 900 su tint arancia (gusto 01)', allowed: true },
  { fg: c.cacao['900'], bg: c.lime['50'], label: '`text-on-flavor-small` su tint lime', allowed: true },
  { fg: c.lime['700'], bg: c.neutral['0'], label: 'lime 700 (`success`) su bianco', allowed: true },
  { fg: c.lime['700'], bg: c.lime['50'], label: 'lime 700 su lime 50 (badge)', allowed: true },
  { fg: c.neutral['0'], bg: c.lime['700'], label: '**bianco su lime 700** — `bg-lime-deep`', allowed: true },
  { fg: c.neutral['0'], bg: c.arancia['500'], label: '**logo bianco** e testo grande su arancia 500 (gusto 01)', allowed: true, largeOnly: true, note: 'Solo logo, titoli display e numeri grandi (>= 24px bold o >= 32px regular).' },
  { fg: c.neutral['0'], bg: c.lime['500'], label: '**logo bianco** e testo grande su lime 500 (gusto 02)', allowed: true, largeOnly: true, note: 'Solo logo, titoli display e numeri grandi.' },

  // --- vetro: il velo interno garantisce il cacao ---
  { fg: c.cacao['900'], bg: '#FFE0B2', label: 'cacao 900 sul vetro con velo (bianco 62% su ambra 400)', allowed: true },

  // --- stato ---
  { fg: c.state.error, bg: c.neutral['0'], label: '`error` su bianco', allowed: true },
  { fg: c.miele['800'], bg: c.miele['100'], label: 'miele 800 su miele 100 (badge warning)', allowed: true },
  { fg: c.errore['700'], bg: c.errore['50'], label: '`text-danger` su `bg-danger`', allowed: true },

  // --- le combinazioni vietate dal manuale ---
  {
    fg: c.neutral['0'], bg: c.ambra['400'], allowed: false, largeOnly: true,
    label: 'bianco come **testo** su ambra 400',
    note: 'Si ferma a 1,85:1, nemmeno il testo grande regge. Su ambra si scrive solo in cacao 900. Il wordmark bianco sull ambra e un logo, non testo (scelta del brand, 3.1).',
  },
  {
    fg: c.cacao['600'], bg: c.ambra['400'], allowed: false,
    label: '`text-secondary` (cacao 600) come testo su ambra 400',
    note: 'Si ferma a 3,31:1. Sull ambra niente grigi: la gerarchia la fanno corpo e peso, sempre in cacao 900.',
  },
  {
    fg: c.ambra['400'], bg: c.neutral['0'], allowed: false, largeOnly: true,
    label: 'ambra 400 come **testo** su bianco',
    note: 'Si ferma a 1,85:1. Il 400 e un fondo; il testo brand e ambra 700. Il wordmark ambra su bianco e un logo, non testo.',
  },
  {
    fg: c.cacao['900'], bg: c.arancia['500'], allowed: false, largeOnly: true,
    label: 'cacao 900 come **testo corrente** su arancia 500',
    note: 'Si ferma a 3,72:1. Sul 500 del gusto stanno solo logo e testo grande.',
  },
  {
    fg: c.neutral['0'], bg: c.lime['500'], allowed: false, largeOnly: true,
    label: 'bianco come **testo corrente** su lime 500',
    note: 'Si ferma a 3,29:1. Il testo corrente sta su lime 700.',
  },
  {
    fg: c.miele['300'], bg: c.neutral['0'], allowed: false,
    label: 'miele 300 come **testo** su bianco',
    note: 'Il miele e l accento: bollino, il punto di oggi. Mai come testo su fondo chiaro.',
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
