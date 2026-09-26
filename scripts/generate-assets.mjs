/**
 * Genera tutti gli asset statici del marchio (3.1).
 *
 *   assets/logo/      il wordmark in tracciati, bianco e ambra; i lockup
 *                     (simbolo + wordmark) orizzontali e verticali
 *   assets/favicon/   il simbolo a quattro punti: nel contenitore (ambra,
 *                     ambra profondo, arancia, lime) e libero (ambra 700,
 *                     cacao, bianco), a ogni misura prevista
 *   public/           i file che il sito serve davvero: favicon.ico (16, 32,
 *                     48), favicon.svg, apple-touch-icon.png, le icone PWA, il
 *                     manifest
 *
 * Le costanti arrivano da src/brand/paths.ts e dai tracciati del wordmark, gli
 * stessi file dei componenti React: gli SVG statici non possono andare fuori
 * sincrono col codice. Tutto e' in tracciati: nessun font richiesto.
 *
 * Il wordmark della v1 (Rund Display) e' in licenza trial: gli asset che
 * finiscono in git usano il ripiego (src/brand/wordmark.json, Gabarito 900).
 * Se in locale c'e' il tracciato vero (src/brand/wordmarks/rund.json), le
 * stesse versioni escono anche in assets/export/logo-v1/, fuori da git.
 *
 *   npm run assets:generate
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { encodeIco, encodePng, renderIcon } from './lib/raster.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------------------
// Lettura delle costanti dal sorgente
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
  const cleaned = literal.replace(/^\s*\/\/.*$/gm, '')
  return new Function(`return (${cleaned})`)()
}

function extractNumber(name) {
  const m = pathsSource.match(new RegExp(`export const ${name} = ([0-9.]+)`))
  if (!m) throw new Error(`Non trovo ${name} in src/brand/paths.ts`)
  return Number(m[1])
}

const SYMBOL_VARIANT = (pathsSource.match(/export const SYMBOL_VARIANT: SymbolVariantId = '([a-z0-9]+)'/) ?? [])[1]
if (SYMBOL_VARIANT !== 'v7') {
  throw new Error(`SYMBOL_VARIANT e' "${SYMBOL_VARIANT}": questo script disegna il simbolo a quattro punti (v7).`)
}
const GEOMETRY = extractObject('SYMBOL_GEOMETRY')
const SYMBOL_COLORS = extractObject('SYMBOL_COLORS')
const ICON_VARIANTS = extractObject('ICON_VARIANTS')
const LOGO_VARIANTS = extractObject('LOGO_VARIANTS')
const CORNER_RADIUS = extractNumber('ICON_CORNER_RADIUS')
const DOTS_SPAN = extractNumber('FAVICON_DOTS_SPAN')
const GAP_EM = extractNumber('LOCKUP_GAP_EM')
const SYMBOL_EM = extractNumber('SYMBOL_EM_PER_UNIT')

const FAVICON_SIZES = [512, 192, 96, 64, 48, 32, 16]
const ICO_SIZES = [16, 32, 48]

const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens/tokens.json'), 'utf8'))
const THEME_COLOR = tokens.color.ambra['400']

// ---------------------------------------------------------------------------
// Cartelle
// ---------------------------------------------------------------------------

const dirs = {
  logo: resolve(root, 'assets/logo'),
  favicon: resolve(root, 'assets/favicon'),
  publicDir: resolve(root, 'public'),
  logoV1: resolve(root, 'assets/export/logo-v1'),
}

for (const d of [dirs.logo, dirs.favicon]) {
  rmSync(d, { recursive: true, force: true })
  mkdirSync(d, { recursive: true })
}
mkdirSync(dirs.publicDir, { recursive: true })

const written = { logo: 0, favicon: 0, publicFiles: 0, v1: 0 }

function round(n) {
  return Math.round(n * 100) / 100
}

// ---------------------------------------------------------------------------
// Il simbolo: i punti di una geometria riportati su un riquadro 100x100,
// come poseDots() in paths.ts
// ---------------------------------------------------------------------------

function poseDots(pose, span = 1) {
  const g = GEOMETRY[pose]
  const k = (100 * span) / g.width
  const ox = (100 - g.width * k) / 2
  const oy = (100 - g.height * k) / 2
  return g.dots.map(([cx, cy, r]) => ({ cx: round(ox + cx * k), cy: round(oy + cy * k), r: round(r * k) }))
}

function circles(dots, fill) {
  return dots.map((d) => `  <circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${fill}"/>`).join('\n')
}

function radiusFor(size) {
  return round(Math.max(CORNER_RADIUS, Math.min((4 / size) * 100, 50)))
}

/** Il simbolo nel contenitore: quadrato a tutto lato, raggio 24%, punti al 64%. */
function containedSvg(spec, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="peak">
  <title>peak - simbolo</title>
  <rect width="100" height="100" rx="${radiusFor(size)}" fill="${spec.background}"/>
${circles(poseDots('favicon', DOTS_SPAN), spec.dots)}
</svg>
`
}

/** Il simbolo libero, a montagna, nel suo viewBox: niente margini. */
function freeSvg(fill, width) {
  const g = GEOMETRY.montagna
  const height = round((width * g.height) / g.width)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.width} ${g.height}" width="${width}" height="${height}" role="img" aria-label="peak">
  <title>peak - simbolo</title>
${g.dots.map(([cx, cy, r]) => `  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`).join('\n')}
</svg>
`
}

for (const [name, spec] of Object.entries(ICON_VARIANTS)) {
  if (name === 'free') {
    for (const [color, hex] of Object.entries({ ambra700: SYMBOL_COLORS.onLight, cacao: SYMBOL_COLORS.onBrand, white: SYMBOL_COLORS.onColor })) {
      for (const size of FAVICON_SIZES) {
        writeFileSync(resolve(dirs.favicon, `peak-simbolo-free-${color}-${size}.svg`), freeSvg(hex, size))
        written.favicon++
      }
    }
    continue
  }
  for (const size of FAVICON_SIZES) {
    writeFileSync(resolve(dirs.favicon, `peak-simbolo-${name}-${size}.svg`), containedSvg(spec, size))
    written.favicon++
  }
}

// ---------------------------------------------------------------------------
// Wordmark e lockup — in tracciati
// ---------------------------------------------------------------------------

/** Scrive wordmark e lockup per un tracciato, in una cartella. */
function writeLogos(wordmark, dir, note) {
  const { width: W, height: H } = wordmark.viewBox
  let count = 0

  const wordmarkSvg = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="peak">
  <title>peak</title>
  <!-- ${note} Nessun font richiesto. -->
  <path d="${wordmark.path}" fill="${fill}"/>
</svg>
`
  // Dalla 3.1 il wordmark e' solo bianco o ambra.
  for (const [name, fill] of Object.entries({ white: LOGO_VARIANTS.white.fill, ambra: LOGO_VARIANTS.ambra.fill })) {
    writeFileSync(resolve(dir, `peak-wordmark-${name}.svg`), wordmarkSvg(fill))
    count++
  }

  /**
   * Il lockup: corpo del wordmark = 100 unita' (il tracciato e' generato a
   * corpo 100), simbolo a SYMBOL_EM per unita' del suo viewBox, spazio 0,3em,
   * centrati in verticale.
   */
  function lockupSvg(dotFill, wordFill, orientation) {
    const g = GEOMETRY.montagna
    const k = SYMBOL_EM * 100
    const sw = g.width * k
    const sh = g.height * k
    const gap = GAP_EM * 100
    const dots = g.dots.map(([cx, cy, r]) => `<circle cx="${round(cx * k)}" cy="${round(cy * k)}" r="${round(r * k)}" fill="${dotFill}"/>`).join('')
    const word = `<path d="${wordmark.path}" fill="${wordFill}"/>`

    if (orientation === 'horizontal') {
      const total = { w: sw + gap + W, h: Math.max(sh, H) }
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(total.w)} ${round(total.h)}" role="img" aria-label="peak">
  <title>peak</title>
  <g transform="translate(0 ${round((total.h - sh) / 2)})">${dots}</g>
  <g transform="translate(${round(sw + gap)} ${round((total.h - H) / 2)})">${word}</g>
</svg>
`
    }
    const total = { w: Math.max(sw, W), h: sh + gap + H }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(total.w)} ${round(total.h)}" role="img" aria-label="peak">
  <title>peak</title>
  <g transform="translate(${round((total.w - sw) / 2)} 0)">${dots}</g>
  <g transform="translate(${round((total.w - W) / 2)} ${round(sh + gap)})">${word}</g>
</svg>
`
  }

  const lockups = {
    // Su bianco e carta: simbolo ambra 700, parola ambra.
    chiaro: { dots: SYMBOL_COLORS.onLight, word: LOGO_VARIANTS.ambra.fill },
    // Sull'ambra 400: simbolo cacao, parola bianca.
    ambra: { dots: SYMBOL_COLORS.onBrand, word: LOGO_VARIANTS.white.fill },
    // Sugli altri fondi colore: tutto bianco.
    bianco: { dots: SYMBOL_COLORS.onColor, word: LOGO_VARIANTS.white.fill },
  }
  for (const [name, spec] of Object.entries(lockups)) {
    for (const orientation of ['horizontal', 'vertical']) {
      writeFileSync(resolve(dir, `peak-lockup-${name}-${orientation}.svg`), lockupSvg(spec.dots, spec.word, orientation))
      count++
    }
  }
  return count
}

const fallback = JSON.parse(readFileSync(resolve(root, 'src/brand/wordmark.json'), 'utf8'))
written.logo = writeLogos(fallback, dirs.logo, 'Wordmark peak 3.1 - ripiego del wordmark della v1, vettorializzato da Gabarito 900, tracking -0.04em. Il tracciato Rund Display (trial) non entra in git.')

const v1Path = resolve(root, 'src/brand/wordmarks/rund.json')
if (existsSync(v1Path)) {
  rmSync(dirs.logoV1, { recursive: true, force: true })
  mkdirSync(dirs.logoV1, { recursive: true })
  written.v1 = writeLogos(JSON.parse(readFileSync(v1Path, 'utf8')), dirs.logoV1, 'Wordmark peak 3.1 - il wordmark della v1, Rund Display Black (TRIAL, solo per valutazione: non pubblicare), tracking -0.0333em.')
}

// ---------------------------------------------------------------------------
// Il simbolo — PNG e ICO per il deploy
// ---------------------------------------------------------------------------

function rasterSpec(variant) {
  const spec = ICON_VARIANTS[variant]
  return {
    background: spec.background,
    dots: spec.dots,
    inset: 0,
    circles: poseDots('favicon', DOTS_SPAN),
  }
}

// favicon.ico multi-risoluzione, dalla variante primaria (ambra).
const icoImages = ICO_SIZES.map((size) => ({ size, rgba: renderIcon(rasterSpec('ambra'), size, radiusFor(size)) }))
writeFileSync(resolve(dirs.publicDir, 'favicon.ico'), encodeIco(icoImages))
written.publicFiles++

// La favicon vettoriale, che i browser moderni preferiscono.
writeFileSync(resolve(dirs.publicDir, 'favicon.svg'), containedSvg(ICON_VARIANTS.ambra, 32))
written.publicFiles++

// PNG delle varianti nel contenitore, a tutte le misure (16-512).
for (const variant of Object.keys(ICON_VARIANTS).filter((v) => v !== 'free')) {
  for (const size of FAVICON_SIZES) {
    const rgba = renderIcon(rasterSpec(variant), size, radiusFor(size))
    writeFileSync(resolve(dirs.favicon, `peak-simbolo-${variant}-${size}.png`), encodePng(rgba, size))
    written.favicon++
  }
}

// Icona per iOS: senza trasparenza e senza raggio, il sistema arrotonda da se'.
writeFileSync(resolve(dirs.publicDir, 'apple-touch-icon.png'), encodePng(renderIcon(rasterSpec('ambra'), 180, 0), 180))
written.publicFiles++

// Icone PWA.
for (const size of [192, 512]) {
  writeFileSync(resolve(dirs.publicDir, `icon-${size}.png`), encodePng(renderIcon(rasterSpec('ambra'), size, radiusFor(size)), size))
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
      theme_color: THEME_COLOR,
      background_color: '#FAF7F2',
      display: 'standalone',
    },
    null,
    2,
  ) + '\n',
)
written.publicFiles++

console.log(
  `Asset generati — simbolo ${SYMBOL_VARIANT} (quattro punti) · logo e lockup: ${written.logo} · simbolo: ${written.favicon} · public: ${written.publicFiles}` +
    (written.v1 ? ` · wordmark v1 in assets/export/logo-v1: ${written.v1} (trial, fuori da git)` : ''),
)
