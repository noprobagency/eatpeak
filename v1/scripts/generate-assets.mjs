/**
 * Genera tutti gli asset statici del marchio.
 *
 *   assets/logo/      un SVG per variante, nelle tre versioni di filo
 *   assets/favicon/   un SVG per variante, a ogni misura prevista
 *   public/           i file che il sito serve davvero: favicon.ico,
 *                     favicon.svg, apple-touch-icon.png, le icone PWA
 *
 * Le costanti arrivano da src/brand/paths.ts, lette come testo e valutate:
 * cosi' il generatore non puo' andare fuori sincrono col componente React.
 *
 *   npm run assets:generate
 */

import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { encodeIco, encodePng, renderIcon } from './lib/raster.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------------------
// Lettura delle costanti dal sorgente TypeScript
// ---------------------------------------------------------------------------

const pathsSource = readFileSync(resolve(root, 'src/brand/paths.ts'), 'utf8')

function extractObject(name) {
  const start = pathsSource.indexOf(`export const ${name} = {`)
  if (start === -1) throw new Error(`Non trovo ${name} in src/brand/paths.ts`)

  const from = pathsSource.indexOf('{', start)
  let depth = 0
  let end = from

  for (let i = from; i < pathsSource.length; i++) {
    if (pathsSource[i] === '{') depth++
    else if (pathsSource[i] === '}') {
      depth--
      if (depth === 0) { end = i; break }
    }
  }

  const literal = pathsSource.slice(from, end + 1)
  // Toglie i commenti di riga, che nel literal non servono.
  const cleaned = literal.replace(/^\s*\/\/.*$/gm, '')
  return new Function(`return (${cleaned})`)()
}

function extractString(name) {
  const m = pathsSource.match(new RegExp(`export const ${name} = '([^']+)'`))
  if (!m) throw new Error(`Non trovo ${name} in src/brand/paths.ts`)
  return m[1]
}

const BOLT_UP = extractString('BOLT_UP')
const BOLT_PEAK = extractString('BOLT_PEAK')
const BOLT_PATHS = { up: BOLT_UP, peak: BOLT_PEAK }
const ICON_VARIANTS = extractObject('ICON_VARIANTS')
const LOGO_VARIANTS = extractObject('LOGO_VARIANTS')
const STROKE_RATIO = extractObject('STROKE_RATIO')

const FAVICON_SIZES = [512, 192, 96, 64, 48, 32, 16]
const ICO_SIZES = [16, 32, 48]
const ICON_OUTLINE_MIN_PX = 48
const CORNER_RADIUS = 26

const WORDMARK = { width: 210, height: 74, fontSize: 60, baseline: 56, tracking: -2 }

// ---------------------------------------------------------------------------
// Cartelle
// ---------------------------------------------------------------------------

const dirs = {
  logo: resolve(root, 'assets/logo'),
  favicon: resolve(root, 'assets/favicon'),
  publicDir: resolve(root, 'public'),
}

for (const d of [dirs.logo, dirs.favicon]) {
  rmSync(d, { recursive: true, force: true })
  mkdirSync(d, { recursive: true })
}
mkdirSync(dirs.publicDir, { recursive: true })

const written = { logo: 0, favicon: 0, publicFiles: 0 }

// ---------------------------------------------------------------------------
// Wordmark
// ---------------------------------------------------------------------------

/**
 * Il font non e' incorporato: Rund e' in licenza trial e i file non stanno nel
 * repo. Questi SVG usano lo stack con i fallback, quindi si aprono ovunque ma
 * NON sono i file finali da mandare in stampa.
 *
 * Una volta comprata la licenza desktop, il wordmark va vettorializzato una
 * volta sola (testo convertito in tracciati) e quei file sostituiscono questi.
 */
const FONT_STACK = "'Rund Display', Gabarito, system-ui, sans-serif"

function wordmarkSvg(spec, strokeWidth) {
  const stroke = spec.stroke
    ? ` stroke="${spec.stroke}" stroke-width="${strokeWidth}" paint-order="stroke" stroke-linejoin="round"`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORDMARK.width} ${WORDMARK.height}" role="img" aria-label="peak">
  <title>peak</title>
  <!-- ATTENZIONE: il testo NON e' vettorializzato. Senza Rund Display installato
       si vede il fallback. Per stampa e packaging serve la versione outlined. -->
  <text x="${WORDMARK.width / 2}" y="${WORDMARK.baseline}" text-anchor="middle"
        font-family="${FONT_STACK}" font-weight="900" font-size="${WORDMARK.fontSize}"
        letter-spacing="${WORDMARK.tracking}"
        fill="${spec.fill ?? 'none'}"${stroke}>peak</text>
</svg>
`
}

for (const [name, spec] of Object.entries(LOGO_VARIANTS)) {
  for (const [step, ratio] of Object.entries(STROKE_RATIO)) {
    const strokeWidth = spec.strokeWidth ?? Math.round(WORDMARK.fontSize * ratio * 100) / 100
    writeFileSync(resolve(dirs.logo, `peak-wordmark-${name}-${step}.svg`), wordmarkSvg(spec, strokeWidth))
    written.logo++

    // Le varianti senza filo e quelle a spessore fisso sono identiche nei tre
    // step: se ne scrive una sola.
    if (!spec.stroke || spec.strokeWidth) break
  }
}

// ---------------------------------------------------------------------------
// Icona — SVG
// ---------------------------------------------------------------------------

function iconSvg(spec, size) {
  const showOutline = Boolean(spec.outline) && size >= ICON_OUTLINE_MIN_PX

  // Il raggio nominale vale 26 su 100. La clamp protegge i rendering piu'
  // piccoli del previsto, dove scenderebbe sotto i 4px assoluti.
  const radius = Math.max(CORNER_RADIUS, Math.min((4 / size) * 100, 50))

  const container = spec.background
    ? spec.shape === 'circle'
      ? `  <circle cx="50" cy="50" r="48" fill="${spec.background}"/>\n`
      : `  <rect x="2" y="2" width="96" height="96" rx="${Math.round(radius * 100) / 100}" fill="${spec.background}"/>\n`
    : ''

  const outline = showOutline
    ? ` stroke="${spec.outline}" stroke-width="${spec.outlineWidth ?? 5}" paint-order="stroke" stroke-linejoin="round"`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="peak">
  <title>peak</title>
${container}  <path d="${BOLT_PATHS[spec.path]}" fill="${spec.bolt}"${outline}/>
</svg>
`
}

for (const [name, spec] of Object.entries(ICON_VARIANTS)) {
  for (const size of FAVICON_SIZES) {
    writeFileSync(resolve(dirs.favicon, `peak-icon-${name}-${size}.svg`), iconSvg(spec, size))
    written.favicon++
  }
}

// ---------------------------------------------------------------------------
// Icona — PNG e ICO per il deploy
// ---------------------------------------------------------------------------

// renderIcon vuole il path gia' risolto: nella spec `path` e' una chiave.
const withPath = (spec) => ({ ...spec, path: BOLT_PATHS[spec.path] })

const PRIMARY = withPath(ICON_VARIANTS['terracotta-honey'])
const ROUND = withPath(ICON_VARIANTS['terracotta-honey-round'])

// favicon.ico multi-risoluzione, partendo dalla variante primaria.
const icoImages = ICO_SIZES.map((size) => ({ size, rgba: renderIcon(PRIMARY, size, CORNER_RADIUS) }))
writeFileSync(resolve(dirs.publicDir, 'favicon.ico'), encodeIco(icoImages))
written.publicFiles++

// La favicon vettoriale, che i browser moderni preferiscono.
writeFileSync(resolve(dirs.publicDir, 'favicon.svg'), iconSvg(ICON_VARIANTS['terracotta-honey'], 32))
written.publicFiles++

// PNG della variante primaria a tutte le misure.
for (const size of FAVICON_SIZES) {
  const rgba = renderIcon(PRIMARY, size, CORNER_RADIUS)
  writeFileSync(resolve(dirs.favicon, `peak-icon-terracotta-honey-${size}.png`), encodePng(rgba, size))
  written.favicon++
}

// Icona per iOS: senza trasparenza e senza raggio, il sistema arrotonda da se'.
const appleTouch = renderIcon({ ...PRIMARY, shape: 'rect' }, 180, 0)
writeFileSync(resolve(dirs.publicDir, 'apple-touch-icon.png'), encodePng(appleTouch, 180))
written.publicFiles++

// Icone PWA.
for (const size of [192, 512]) {
  writeFileSync(resolve(dirs.publicDir, `icon-${size}.png`), encodePng(renderIcon(PRIMARY, size, CORNER_RADIUS), size))
  written.publicFiles++
}

// Avatar tondo per i social.
writeFileSync(resolve(dirs.favicon, 'peak-icon-round-512.png'), encodePng(renderIcon(ROUND, 512, CORNER_RADIUS), 512))
written.favicon++

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

writeFileSync(
  resolve(dirs.publicDir, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'peak',
      short_name: 'peak',
      description: 'Creatina monoidrato in stickpack monodose.',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#E9724C',
      background_color: '#FAF9F7',
      display: 'standalone',
    },
    null,
    2,
  ) + '\n',
)
written.publicFiles++

console.log(
  `Asset generati — logo: ${written.logo} · favicon: ${written.favicon} · public: ${written.publicFiles}`,
)
