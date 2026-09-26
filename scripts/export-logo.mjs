/**
 * Esporta il wordmark in PNG ad alta risoluzione, ritagliato al pixel.
 *
 *   node scripts/export-logo.mjs [variante] [--size=1200] [--out=percorso.png]
 *   node scripts/export-logo.mjs --list
 *
 * Perche' passa da Chrome. Il wordmark e' testo, non un tracciato: per
 * rasterizzarlo serve il motore tipografico che sa cosa fare di Rund Display,
 * del tracking negativo e del contorno esterno. Il rasterizzatore in
 * scripts/lib/raster.mjs disegna poligoni e va benissimo per la saetta, ma di
 * testo non sa niente.
 *
 * Il ritaglio non e' calcolato: si disegna su una tela abbondante, si legge il
 * canale alfa e si taglia sull'ultimo pixel non trasparente. Nessun margine
 * residuo, nessuna lettera tagliata.
 *
 * ─── ATTENZIONE ──────────────────────────────────────────────────────────
 * Rund e' in licenza trial. Il PNG che esce di qui e' un file di lavoro: si
 * usa per valutare e per far vedere, non per pubblicare o stampare. Vedi
 * assets/fonts/README.md.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const FONT = resolve(root, 'public/fonts/RundDisplay-Black.woff2')

// ---------------------------------------------------------------------------
// Argomenti
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const variantName = args.find((a) => !a.startsWith('--')) ?? 'honey-terracotta'
const fontSize = Number(flag('size', 1200))
// Non in assets/logo/: quella cartella viene svuotata da `npm run assets:generate`,
// e un export chiesto a mano sparirebbe alla prima rigenerazione.
const outPath = resolve(root, flag('out', `assets/export/peak-wordmark-${variantName}@${fontSize}.png`))

// ---------------------------------------------------------------------------
// Le costanti del marchio, dalla stessa sorgente dei componenti
// ---------------------------------------------------------------------------

const paths = readFileSync(resolve(root, 'src/brand/paths.ts'), 'utf8')

function extractObject(name) {
  const start = paths.indexOf(`export const ${name} = {`)
  const from = paths.indexOf('{', start)
  let depth = 0
  let end = from
  for (let i = from; i < paths.length; i++) {
    if (paths[i] === '{') depth++
    else if (paths[i] === '}' && --depth === 0) { end = i; break }
  }
  return new Function(`return (${paths.slice(from, end + 1).replace(/^\s*\/\/.*$/gm, '')})`)()
}

const LOGO_VARIANTS = extractObject('LOGO_VARIANTS')
const STROKE_RATIO = extractObject('STROKE_RATIO')

if (args.includes('--list')) {
  console.log('Varianti disponibili:\n')
  for (const [name, spec] of Object.entries(LOGO_VARIANTS)) {
    console.log(`  ${name.padEnd(24)} ${spec.label}`)
  }
  process.exit(0)
}

const spec = LOGO_VARIANTS[variantName]
if (!spec) {
  console.error(`Variante sconosciuta: "${variantName}". Usa --list per l'elenco.`)
  process.exit(1)
}

if (!existsSync(FONT)) {
  console.error(
    `Manca ${FONT}.\n` +
      'Il wordmark e\' testo: senza Rund Display non c\'e\' niente da rasterizzare.\n' +
      'Vedi assets/fonts/README.md.',
  )
  process.exit(1)
}

if (!existsSync(CHROME)) {
  console.error(`Manca Chrome in ${CHROME}. Serve per rasterizzare il testo.`)
  process.exit(1)
}

// Sopra i 120px di larghezza si usa il filo pieno.
const strokeWidth = spec.strokeWidth
  ? (spec.strokeWidth / 60) * fontSize
  : fontSize * STROKE_RATIO.lg

// -0.033em, cioe' -2 su un font-size di 60. Il tracking non si tocca.
const letterSpacing = (-2 / 60) * fontSize

// ---------------------------------------------------------------------------
// La pagina che disegna
// ---------------------------------------------------------------------------

const fontBase64 = readFileSync(FONT).toString('base64')

const html = `<!doctype html>
<meta charset="utf-8">
<body style="margin:0">
<div id="out"></div>
<script>
(async () => {
  const face = new FontFace('Rund Display', 'url(data:font/woff2;base64,${fontBase64}) format("woff2")', { weight: '900' })
  await face.load()
  document.fonts.add(face)
  await document.fonts.ready

  const FILL = ${JSON.stringify(spec.fill)}
  const STROKE = ${JSON.stringify(spec.stroke)}
  const SIZE = ${fontSize}
  const LINE = ${strokeWidth}
  const TRACK = ${letterSpacing}

  // Tela abbondante: il ritaglio arriva dopo, leggendo l'alfa.
  const pad = Math.ceil(SIZE * 1.5)
  const c = document.createElement('canvas')
  c.width = Math.ceil(SIZE * 6)
  c.height = Math.ceil(SIZE * 3)
  const ctx = c.getContext('2d', { willReadFrequently: true })

  ctx.font = '900 ' + SIZE + 'px "Rund Display"'
  ctx.letterSpacing = TRACK + 'px'
  ctx.textBaseline = 'alphabetic'
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2

  const x = pad
  const y = Math.round(c.height * 0.62)

  // paint-order="stroke": il filo va sotto, cosi' la lettera non si assottiglia.
  if (STROKE) {
    ctx.strokeStyle = STROKE
    ctx.lineWidth = LINE
    ctx.strokeText('peak', x, y)
  }
  if (FILL) {
    ctx.fillStyle = FILL
    ctx.fillText('peak', x, y)
  }

  // Ritaglio sull'ultimo pixel non trasparente, su tutti e quattro i lati.
  const data = ctx.getImageData(0, 0, c.width, c.height).data
  let minX = c.width, minY = c.height, maxX = -1, maxY = -1
  for (let py = 0; py < c.height; py++) {
    for (let px = 0; px < c.width; px++) {
      if (data[(py * c.width + px) * 4 + 3] !== 0) {
        if (px < minX) minX = px
        if (px > maxX) maxX = px
        if (py < minY) minY = py
        if (py > maxY) maxY = py
      }
    }
  }

  if (maxX < 0) { document.getElementById('out').textContent = 'ERRORE: nulla di disegnato'; return }

  const w = maxX - minX + 1
  const h = maxY - minY + 1
  const trimmed = document.createElement('canvas')
  trimmed.width = w
  trimmed.height = h
  trimmed.getContext('2d').drawImage(c, minX, minY, w, h, 0, 0, w, h)

  document.getElementById('out').textContent = JSON.stringify({ w, h }) + '|' + trimmed.toDataURL('image/png')
})()
</script>
</body>`

// ---------------------------------------------------------------------------
// Esecuzione
// ---------------------------------------------------------------------------

const work = resolve(tmpdir(), `peak-logo-${process.pid}.html`)
writeFileSync(work, html)

let dom
try {
  dom = execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=10000',
      '--dump-dom',
      `file://${work}`,
    ],
    { maxBuffer: 512 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  )
} finally {
  rmSync(work, { force: true })
}

const match = dom.match(/\{"w":(\d+),"h":(\d+)\}\|data:image\/png;base64,([A-Za-z0-9+/=]+)/)
if (!match) {
  console.error('Chrome non ha prodotto un PNG. La pagina ha risposto:\n')
  console.error(dom.slice(0, 600))
  process.exit(1)
}

const [, w, h, base64] = match
mkdirSync(dirname(outPath), { recursive: true })
const buffer = Buffer.from(base64, 'base64')
writeFileSync(outPath, buffer)

const rel = outPath.replace(`${root}/`, '')
console.log(`${rel}`)
console.log(`  variante   ${variantName} — ${spec.label}`)
console.log(`  pieno      ${spec.fill ?? 'nessuno'}`)
console.log(`  contorno   ${spec.stroke ?? 'nessuno'}${spec.stroke ? ` a ${Math.round(strokeWidth)}px` : ''}`)
console.log(`  misura     ${w} x ${h} px, fondo trasparente, ritagliato al pixel`)
console.log(`  peso       ${(buffer.length / 1024).toFixed(1)} kB`)
console.log('\n  Rund e\' in licenza trial: file di lavoro, non per la pubblicazione.')
