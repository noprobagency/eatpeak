/**
 * Genera tutti gli asset statici del marchio (2.0).
 *
 *   assets/logo/      il wordmark in tracciati: bianco, inchiostro, arancia,
 *                     lime; i lockup orizzontali e verticali
 *   assets/favicon/   il vertice nelle 4 varianti, a ogni misura prevista
 *   public/           i file che il sito serve davvero: favicon.ico,
 *                     favicon.svg, apple-touch-icon.png, le icone PWA, il
 *                     manifest
 *
 * Le costanti arrivano da src/brand/paths.ts e src/brand/wordmark.json, gli
 * stessi file dei componenti React: gli SVG statici non possono andare fuori
 * sincrono col codice. Tutto e' in tracciati: nessun font richiesto.
 *
 *   npm run assets:generate
 */

import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { encodeIco, encodePng, renderIcon } from './lib/raster.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------------------
// Lettura delle costanti dal sorgente
// ---------------------------------------------------------------------------

const pathsSource = readFileSync(resolve(root, 'src/brand/paths.ts'), 'utf8')
const wordmark = JSON.parse(readFileSync(resolve(root, 'src/brand/wordmark.json'), 'utf8'))

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
  const cleaned = literal.replace(/^\s*\/\/.*$/gm, '')
  return new Function(`return (${cleaned})`)()
}

function extractNumber(name) {
  const m = pathsSource.match(new RegExp(`export const ${name} = ([0-9.]+)`))
  if (!m) throw new Error(`Non trovo ${name} in src/brand/paths.ts`)
  return Number(m[1])
}

const VERTEX = extractObject('VERTEX')
const ICON_VARIANTS = extractObject('ICON_VARIANTS')
const LOGO_VARIANTS = extractObject('LOGO_VARIANTS')
const CORNER_RADIUS = extractNumber('ICON_CORNER_RADIUS')
const SMALL_BELOW = extractNumber('VERTEX_SMALL_BELOW_PX')
const LOCKUP_GAP_RATIO = extractNumber('LOCKUP_GAP_RATIO')
const LOCKUP_WORDMARK_TO_ICON = extractNumber('LOCKUP_WORDMARK_TO_ICON')

const FAVICON_SIZES = [512, 192, 96, 64, 48, 32, 16]
const ICO_SIZES = [16, 32, 48]

/** I colori-gusto, per il logo `flavor` e il vertice libero. */
const FLAVOR_HEX = { arancia: '#E4572E', lime: '#5E9E1F' }

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
// Wordmark — in tracciati
// ---------------------------------------------------------------------------

const { width: W, height: H } = wordmark.viewBox

function wordmarkSvg(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="peak">
  <title>peak</title>
  <!-- Wordmark peak 2.0 - tracciato vettorializzato da Gabarito 900, tracking -0.04em. Nessun font richiesto. -->
  <path d="${wordmark.path}" fill="${fill}"/>
</svg>
`
}

const logoFiles = {
  white: LOGO_VARIANTS.white.fill,
  ink: LOGO_VARIANTS.ink.fill,
  arancia: FLAVOR_HEX.arancia,
  lime: FLAVOR_HEX.lime,
}

for (const [name, fill] of Object.entries(logoFiles)) {
  writeFileSync(resolve(dirs.logo, `peak-wordmark-${name}.svg`), wordmarkSvg(fill))
  written.logo++
}

// ---------------------------------------------------------------------------
// Vertice — SVG
// ---------------------------------------------------------------------------

function vertexCircles(geometry, fill) {
  return geometry.points
    .map(([cx, cy]) => `  <circle cx="${cx}" cy="${cy}" r="${geometry.r}" fill="${fill}"/>`)
    .join('\n')
}

function iconSvg(spec, size, dotsOverride) {
  const contained = spec.background !== null
  const geometry = contained ? (size < SMALL_BELOW ? VERTEX.small : VERTEX.contained) : VERTEX.free
  const radius = Math.max(CORNER_RADIUS, Math.min((4 / size) * 100, 50))
  const dots = dotsOverride ?? spec.dots

  const container = spec.background
    ? `  <rect x="2" y="2" width="96" height="96" rx="${Math.round(radius * 100) / 100}" fill="${spec.background}"/>\n`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="peak">
  <title>peak</title>
${container}${vertexCircles(geometry, dots)}
</svg>
`
}

for (const [name, spec] of Object.entries(ICON_VARIANTS)) {
  if (name === 'free') {
    // Il vertice libero esce nei tre colori possibili.
    for (const [color, hex] of Object.entries({ ...FLAVOR_HEX, ink: '#1B1A18' })) {
      for (const size of FAVICON_SIZES) {
        writeFileSync(resolve(dirs.favicon, `peak-vertice-free-${color}-${size}.svg`), iconSvg(spec, size, hex))
        written.favicon++
      }
    }
    continue
  }
  for (const size of FAVICON_SIZES) {
    writeFileSync(resolve(dirs.favicon, `peak-vertice-${name}-${size}.svg`), iconSvg(spec, size))
    written.favicon++
  }
}

// ---------------------------------------------------------------------------
// Lockup — SVG
// ---------------------------------------------------------------------------

/**
 * Vertice libero + wordmark. Lo spazio e' meta' dell'altezza del simbolo.
 * Il simbolo e' 100 unita' di lato; il wordmark 2.4 volte tanto in larghezza.
 */
function lockupSvg(dots, fill, orientation) {
  const icon = 100
  const gap = icon * LOCKUP_GAP_RATIO
  const logoW = icon * LOCKUP_WORDMARK_TO_ICON
  const logoH = (logoW * H) / W
  const circles = VERTEX.free.points
    .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="${VERTEX.free.r}" fill="${dots}"/>`)
    .join('')

  if (orientation === 'horizontal') {
    const total = { w: icon + gap + logoW, h: Math.max(icon, logoH) }
    const iconY = (total.h - icon) / 2
    const logoY = (total.h - logoH) / 2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(total.w)} ${round(total.h)}" role="img" aria-label="peak">
  <title>peak</title>
  <g transform="translate(0 ${round(iconY)})">${circles}</g>
  <g transform="translate(${round(icon + gap)} ${round(logoY)}) scale(${round(logoW / W)})"><path d="${wordmark.path}" fill="${fill}"/></g>
</svg>
`
  }

  const total = { w: Math.max(icon, logoW), h: icon + gap + logoH }
  const iconX = (total.w - icon) / 2
  const logoX = (total.w - logoW) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(total.w)} ${round(total.h)}" role="img" aria-label="peak">
  <title>peak</title>
  <g transform="translate(${round(iconX)} 0)">${circles}</g>
  <g transform="translate(${round(logoX)} ${round(icon + gap)}) scale(${round(logoW / W)})"><path d="${wordmark.path}" fill="${fill}"/></g>
</svg>
`
}

function round(n) {
  return Math.round(n * 100) / 100
}

const lockups = {
  'arancia-ink': { dots: FLAVOR_HEX.arancia, fill: '#1B1A18' },
  'lime-ink': { dots: FLAVOR_HEX.lime, fill: '#1B1A18' },
  white: { dots: '#FFFFFF', fill: '#FFFFFF' },
  ink: { dots: '#1B1A18', fill: '#1B1A18' },
}

for (const [name, spec] of Object.entries(lockups)) {
  for (const orientation of ['horizontal', 'vertical']) {
    writeFileSync(resolve(dirs.logo, `peak-lockup-${name}-${orientation}.svg`), lockupSvg(spec.dots, spec.fill, orientation))
    written.logo++
  }
}

// ---------------------------------------------------------------------------
// Vertice — PNG e ICO per il deploy
// ---------------------------------------------------------------------------

function rasterSpec(variant, size) {
  const spec = ICON_VARIANTS[variant]
  const geometry = size < SMALL_BELOW ? VERTEX.small : VERTEX.contained
  return {
    background: spec.background,
    dots: spec.dots,
    circles: geometry.points.map(([cx, cy]) => ({ cx, cy, r: geometry.r })),
  }
}

// favicon.ico multi-risoluzione, dalla variante primaria (arancia).
const icoImages = ICO_SIZES.map((size) => ({ size, rgba: renderIcon(rasterSpec('arancia', size), size, CORNER_RADIUS) }))
writeFileSync(resolve(dirs.publicDir, 'favicon.ico'), encodeIco(icoImages))
written.publicFiles++

// La favicon vettoriale, che i browser moderni preferiscono.
writeFileSync(resolve(dirs.publicDir, 'favicon.svg'), iconSvg(ICON_VARIANTS.arancia, 32))
written.publicFiles++

// PNG delle tre varianti nel contenitore, a tutte le misure.
for (const variant of ['arancia', 'lime', 'ink']) {
  for (const size of FAVICON_SIZES) {
    const rgba = renderIcon(rasterSpec(variant, size), size, CORNER_RADIUS)
    writeFileSync(resolve(dirs.favicon, `peak-vertice-${variant}-${size}.png`), encodePng(rgba, size))
    written.favicon++
  }
}

// Icona per iOS: senza trasparenza e senza raggio, il sistema arrotonda da se'.
const appleSpec = rasterSpec('arancia', 180)
const appleTouch = renderIcon(appleSpec, 180, 0)
writeFileSync(resolve(dirs.publicDir, 'apple-touch-icon.png'), encodePng(appleTouch, 180))
written.publicFiles++

// Icone PWA.
for (const size of [192, 512]) {
  writeFileSync(resolve(dirs.publicDir, `icon-${size}.png`), encodePng(renderIcon(rasterSpec('arancia', size), size, CORNER_RADIUS), size))
  written.publicFiles++
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

writeFileSync(
  resolve(dirs.publicDir, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'peak',
      short_name: 'peak',
      description: 'La creatina, evoluta. Creatina + glicina + vitamina D3 in stick monodose.',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#E4572E',
      background_color: '#FAF7F2',
      display: 'standalone',
    },
    null,
    2,
  ) + '\n',
)
written.publicFiles++

console.log(
  `Asset generati — logo e lockup: ${written.logo} · vertice: ${written.favicon} · public: ${written.publicFiles}`,
)
