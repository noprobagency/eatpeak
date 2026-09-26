/**
 * Vettorializza il wordmark "peak" in un tracciato SVG.
 *
 *   npm run brand:vectorize                       usa assets/fonts/Gabarito-900.ttf
 *   npm run brand:vectorize -- --download         lo scarica da Google Fonts se manca
 *   npm run brand:vectorize -- --tracking=-0.04   prova un tracking diverso
 *   npm run brand:vectorize -- --compare          stampa -0.03 / -0.04 / -0.05 affiancati
 *   npm run brand:vectorize -- --font-id=nunito --download   un candidato del laboratorio font
 *   npm run brand:vectorize -- --all              tutti i candidati, in src/brand/wordmarks/
 *   npm run brand:vectorize -- --font-id=rund     il wordmark della v1 (Rund Display Black), solo in locale
 *
 * Perche' esiste. Nella 1.0 il logo era testo SVG e dipendeva da un font
 * installato: senza, si vedeva il fallback. Nella 2.0 il wordmark e' un
 * tracciato: si apre ovunque, si stampa ovunque, non dipende da nessuno.
 *
 * Il font (Gabarito 900, SIL OFL) si usa solo qui, in locale, per generare.
 * Il file TTF non si committa (regola dei font); il risultato si': sta in
 * src/brand/wordmark.json, letto dal componente <Logo> e dagli script.
 *
 * Unica devDependency ammessa per questo: opentype.js.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const WORD = 'peak'
const FONT_SIZE = 100
/**
 * Tracking di default, in em. Vedi docs/03-logo.md per la scelta. Il wordmark
 * della v1 aveva il suo: -2 su un corpo 60, cioe' -0.0333em.
 */
const DEFAULT_TRACKING = flag('font-id', null) === 'rund' ? -0.0333 : -0.04
const TRACKING_EM = Number(flag('tracking', DEFAULT_TRACKING))

/**
 * I candidati del laboratorio font (3.0): stessa tabella di src/lib/fontlab.ts.
 * `--font-id=<id>` scarica il TTF statico del peso del wordmark e scrive
 * src/brand/wordmarks/<id>.json. Senza flag si genera il wordmark ufficiale
 * (Gabarito 900) in src/brand/wordmark.json, come nella 2.0.
 */
const CANDIDATES = {
  gabarito: { family: 'Gabarito', weight: 800 },
  nunito: { family: 'Nunito', weight: 900 },
  mplus: { family: 'M PLUS Rounded 1c', weight: 800 },
  fredoka: { family: 'Fredoka', weight: 600 },
  baloo: { family: 'Baloo 2', weight: 800 },
  rubik: { family: 'Rubik', weight: 800 },
  varela: { family: 'Varela Round', weight: 400 },
  /**
   * Il wordmark della v1 (3.1): Rund Display Black, di Letters from Sweden.
   * E' in licenza TRIAL: niente download, il file sta solo in locale
   * (assets/fonts/rund-900.otf) e anche il tracciato che ne esce resta fuori
   * da git (src/brand/wordmarks/rund.json, in .gitignore). Senza, il sito usa
   * il wordmark di ripiego. Vedi assets/fonts/README.md.
   */
  rund: { family: 'Rund Display', weight: 900, trial: true, file: 'assets/fonts/rund-900.otf' },
}
const fontId = flag('font-id', null)
if (fontId && !CANDIDATES[fontId]) {
  console.error(`Font sconosciuto: "${fontId}". Candidati: ${Object.keys(CANDIDATES).join(', ')}`)
  process.exit(1)
}
if (args.includes('--all')) {
  const { execFileSync } = await import('node:child_process')
  for (const id of Object.keys(CANDIDATES).filter((k) => !CANDIDATES[k].trial)) {
    execFileSync(process.execPath, [fileURLToPath(import.meta.url), `--font-id=${id}`, '--download', `--tracking=${TRACKING_EM}`], { stdio: 'inherit' })
  }
  process.exit(0)
}
const chosen = fontId ? CANDIDATES[fontId] : { family: 'Gabarito', weight: 900 }
const defaultFontFile = chosen.file ?? (fontId ? `assets/fonts/${fontId}-${chosen.weight}.ttf` : 'assets/fonts/Gabarito-900.ttf')
const FONT_PATH = resolve(root, flag('font', defaultFontFile))

// Google Fonts serve un TTF statico (istanza del peso chiesto) a un browser che
// non dichiara il supporto ai font variabili: e' quello che serve a opentype.js.
const GOOGLE_CSS = `https://fonts.googleapis.com/css2?family=${chosen.family.replace(/ /g, '+')}:wght@${chosen.weight}`
const LEGACY_UA = 'Mozilla/5.0 (Windows NT 5.1)'

async function ensureFont() {
  if (existsSync(FONT_PATH)) return
  if (chosen.trial) {
    console.error(
      `Manca ${FONT_PATH}.\n` +
        `${chosen.family} e' in licenza trial: non si scarica. Mettilo a mano in locale\n` +
        '(vedi assets/fonts/README.md). Il file e il tracciato non vanno committati.',
    )
    process.exit(1)
  }
  if (!args.includes('--download')) {
    console.error(
      `Manca ${FONT_PATH}.\n` +
        'Scaricalo con `npm run brand:vectorize -- --download` (Gabarito e SIL OFL),\n' +
        'oppure passa un percorso con --font=... Il TTF non va committato.',
    )
    process.exit(1)
  }
  const css = await (await fetch(GOOGLE_CSS, { headers: { 'User-Agent': LEGACY_UA } })).text()
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1]
  if (!url) throw new Error(`Google Fonts non ha restituito un TTF statico per ${chosen.family} ${chosen.weight}.`)
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  mkdirSync(dirname(FONT_PATH), { recursive: true })
  writeFileSync(FONT_PATH, buf)
  console.log(`Scaricato ${FONT_PATH} (${(buf.length / 1024).toFixed(0)} kB)`)
}

await ensureFont()

const font = opentype.parse(readFileSync(FONT_PATH).buffer.slice(0))

/** Il tracciato della parola, con tracking in em, origine sulla linea di base. */
function wordPath(trackingEm) {
  const path = font.getPath(WORD, 0, 0, FONT_SIZE, {
    kerning: true,
    letterSpacing: trackingEm,
  })
  return path
}

function round(n) {
  return Math.round(n * 100) / 100
}

/** Serializza il path opentype in una stringa SVG compatta, traslata di (dx, dy). */
function serialize(path, dx, dy) {
  const out = []
  for (const c of path.commands) {
    switch (c.type) {
      case 'M': out.push(`M${round(c.x + dx)} ${round(c.y + dy)}`); break
      case 'L': out.push(`L${round(c.x + dx)} ${round(c.y + dy)}`); break
      case 'Q': out.push(`Q${round(c.x1 + dx)} ${round(c.y1 + dy)} ${round(c.x + dx)} ${round(c.y + dy)}`); break
      case 'C': out.push(`C${round(c.x1 + dx)} ${round(c.y1 + dy)} ${round(c.x2 + dx)} ${round(c.y2 + dy)} ${round(c.x + dx)} ${round(c.y + dy)}`); break
      case 'Z': out.push('Z'); break
      default: throw new Error(`Comando inatteso: ${c.type}`)
    }
  }
  return out.join('')
}

function build(trackingEm) {
  const path = wordPath(trackingEm)
  const bb = path.getBoundingBox()
  const width = round(bb.x2 - bb.x1)
  const height = round(bb.y2 - bb.y1)

  // Le lettere singole, per le misure ottiche: la "e" da' l'area di rispetto.
  const glyphs = font.stringToGlyphs(WORD)
  const eGlyph = glyphs[1]
  const eBox = eGlyph.getPath(0, 0, FONT_SIZE).getBoundingBox()
  const eHeight = round(eBox.y2 - eBox.y1)

  // Le distanze fra le lettere, per giudicare il tracking: bordo destro di una
  // e bordo sinistro della successiva, misurate sui tracciati.
  const gaps = []
  let x = 0
  const boxes = []
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i]
    const gb = g.getPath(x, 0, FONT_SIZE).getBoundingBox()
    boxes.push(gb)
    let advance = (g.advanceWidth * FONT_SIZE) / font.unitsPerEm
    if (i < glyphs.length - 1) {
      advance += (font.getKerningValue(g, glyphs[i + 1]) * FONT_SIZE) / font.unitsPerEm
      advance += trackingEm * FONT_SIZE
    }
    x += advance
  }
  for (let i = 0; i < boxes.length - 1; i++) {
    gaps.push({ pair: `${WORD[i]}-${WORD[i + 1]}`, gap: round(boxes[i + 1].x1 - boxes[i].x2) })
  }

  return {
    d: serialize(path, -bb.x1, -bb.y1),
    width,
    height,
    eHeight,
    baseline: round(-bb.y1),
    gaps,
  }
}

if (args.includes('--compare')) {
  console.log(`Confronto del tracking su "${WORD}", Gabarito 900, corpo ${FONT_SIZE}:\n`)
  for (const t of [-0.03, -0.04, -0.05]) {
    const r = build(t)
    const gaps = r.gaps.map((g) => `${g.pair} ${g.gap.toFixed(2)}`).join(' · ')
    console.log(`  ${String(t).padEnd(6)}  larghezza ${r.width.toFixed(1)}  ${gaps}`)
  }
  console.log('\nI valori sono le distanze fra i tracciati delle lettere, in unita di viewBox.')
  process.exit(0)
}

const r = build(TRACKING_EM)

const out = {
  $meta: {
    note: 'FILE GENERATO da scripts/vectorize-wordmark.mjs. Non modificare a mano: rigenera con `npm run brand:vectorize`.',
    font: `${font.names.fullName?.en ?? 'Gabarito'} ${font.tables.os2?.usWeightClass ?? 900}`,
    fontSize: FONT_SIZE,
    trackingEm: TRACKING_EM,
    word: WORD,
  },
  path: r.d,
  viewBox: { width: r.width, height: r.height },
  /** Altezza della "e" minuscola, in unita di viewBox: l'area di rispetto. */
  eHeight: r.eHeight,
  /** Rapporto fra l'altezza della "e" e l'altezza del blocco: CLEARSPACE_RATIO. */
  clearspaceRatio: round(r.eHeight / r.height),
  /** Linea di base dal bordo superiore del viewBox. */
  baseline: r.baseline,
  gaps: r.gaps,
}

if (fontId) {
  out.$meta.fontId = fontId
  mkdirSync(resolve(root, 'src/brand/wordmarks'), { recursive: true })
}
const target = resolve(root, fontId ? `src/brand/wordmarks/${fontId}.json` : 'src/brand/wordmark.json')
writeFileSync(target, JSON.stringify(out, null, 2) + '\n')

console.log(`${target.replace(`${root}/`, '')} generato`)
console.log(`  font        ${out.$meta.font}`)
console.log(`  tracking    ${TRACKING_EM}em`)
console.log(`  viewBox     ${r.width} x ${r.height}`)
console.log(`  "e"         ${r.eHeight} (clearspace ${out.clearspaceRatio})`)
console.log(`  spazi       ${r.gaps.map((g) => `${g.pair} ${g.gap}`).join(' · ')}`)
console.log(`  tracciato   ${r.d.length} caratteri`)
