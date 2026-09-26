/**
 * Esporta il fronte della busta o lo stick per il designer: SVG piatto e PNG
 * trasparente, in assets/export/pack/.
 *
 *   npm run export:pack -- arancia|lime [--busta|--stick] [--size=3000] [--lot=01] [--serial=137]
 *   npm run export:pack -- lime --stick --size=2000
 *
 * Come funziona. I componenti <BustaPack /> e <StickPack /> sono React: lo
 * script li carica con il server di Vite in modalita' SSR (nessuna dipendenza
 * in piu', Vite c'e' gia'), li rende in markup statico con `standalone` (i
 * font dichiarati dentro l'SVG) e scrive l'SVG. Poi, come export:logo, passa
 * da Chrome headless per il PNG: l'SVG viene disegnato su una tela con i font
 * di Google caricati, e ritagliato sull'alfa.
 *
 * Il PNG e' per far vedere; l'SVG e' il file di lavoro. Il wordmark e' gia' in
 * tracciati; i testi secondari restano testo con la famiglia dichiarata, cosi'
 * il designer puo' correggerli. Le proporzioni sono un segnaposto della
 * fustella: vedi docs/08-packaging.md.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const flavor = args.find((a) => !a.startsWith('--')) ?? 'arancia'
if (!['arancia', 'lime'].includes(flavor)) {
  console.error(`Gusto sconosciuto: "${flavor}". Usa arancia o lime.`)
  process.exit(1)
}
const kind = args.includes('--stick') ? 'stick' : 'busta'
const size = Number(flag('size', 3000))
const lot = flag('lot', '01')
const serial = Number(flag('serial', 137))

const outDir = resolve(root, 'assets/export/pack')
mkdirSync(outDir, { recursive: true })
const base = resolve(outDir, `peak-${kind}-${flavor}-fronte`)

// ---------------------------------------------------------------------------
// 1. L'SVG, dai componenti React via Vite SSR
// ---------------------------------------------------------------------------

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})

let svg
try {
  const components = await server.ssrLoadModule('/src/components/index.ts')
  const Component = kind === 'busta' ? components.BustaPack : components.StickPack
  const props = kind === 'busta'
    ? { flavor, lot, serial, width: size, standalone: true }
    : { flavor, height: size, standalone: true }
  svg = renderToStaticMarkup(createElement(Component, props))
} finally {
  await server.close()
}

// React non scrive l'xmlns: serve al file per aprirsi da solo.
svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ')
const header = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- peak - ${kind} ${flavor}, fronte. Generato da scripts/export-pack.mjs. Proporzioni provvisorie: segnaposto della fustella. -->\n`
writeFileSync(`${base}.svg`, header + svg + '\n')

// ---------------------------------------------------------------------------
// 2. Il PNG, via Chrome
// ---------------------------------------------------------------------------

if (!existsSync(CHROME)) {
  console.log(`${base}.svg`)
  console.log(`Manca Chrome in ${CHROME}: scritto solo l'SVG.`)
  process.exit(0)
}

const width = kind === 'busta' ? size : Math.round(size / 5)
const height = kind === 'busta' ? Math.round(size * 1.5) : size

const html = `<!doctype html>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@1,9..144,500&family=Gabarito:wght@900&family=Inter:wght@500&display=swap" rel="stylesheet">
<body style="margin:0;background:transparent">
<div id="stage" style="position:absolute;left:-99999px;top:0;width:${width}px;height:${height}px">${svg}</div>
<div id="out"></div>
<script>
(async () => {
  try { await document.fonts.load('900 40px Gabarito'); await document.fonts.load('italic 500 40px Fraunces'); await document.fonts.load('500 40px "DM Mono"'); await document.fonts.load('500 40px Inter') } catch (e) {}
  await document.fonts.ready
  const svgEl = document.querySelector('#stage svg')
  const xml = new XMLSerializer().serializeToString(svgEl)
  // I font web non entrano in un'immagine SVG esterna: si incorporano come @font-face nel foglio dell'SVG.
  const faces = []
  for (const sheet of document.styleSheets) {
    try { for (const rule of sheet.cssRules) if (rule instanceof CSSFontFaceRule) faces.push(rule.cssText) } catch (e) {}
  }
  const withFonts = xml.replace('<style>', '<style>' + faces.join(' '))
  const blob = new Blob([withFonts], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.decoding = 'sync'
  await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = url })
  const c = document.createElement('canvas')
  c.width = ${width}; c.height = ${height}
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0, ${width}, ${height})
  document.getElementById('out').textContent = JSON.stringify({ w: c.width, h: c.height }) + '|' + c.toDataURL('image/png')
})().catch((e) => { document.getElementById('out').textContent = 'ERRORE: ' + e })
</script>
</body>`

const work = resolve(tmpdir(), `peak-pack-${process.pid}.html`)
writeFileSync(work, html)

let dom
try {
  dom = execFileSync(
    CHROME,
    ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--virtual-time-budget=20000', '--dump-dom', `file://${work}`],
    { maxBuffer: 1024 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  )
} finally {
  rmSync(work, { force: true })
}

const match = dom.match(/\{"w":(\d+),"h":(\d+)\}\|data:image\/png;base64,([A-Za-z0-9+/=]+)/)
if (!match) {
  console.error(`${base}.svg scritto. Chrome non ha prodotto il PNG:`)
  console.error((dom.match(/ERRORE:[^<]*/) ?? ['(nessun dettaglio)'])[0])
  process.exit(1)
}

const [, w, h, base64] = match
const png = Buffer.from(base64, 'base64')
writeFileSync(`${base}.png`, png)

console.log(`${base.replace(`${root}/`, '')}.svg`)
console.log(`${base.replace(`${root}/`, '')}.png`)
console.log(`  ${kind} · ${flavor} · fronte`)
console.log(`  misura     ${w} x ${h} px, fondo trasparente`)
console.log(`  peso       ${(png.length / 1024).toFixed(0)} kB`)
console.log('  proporzioni provvisorie: segnaposto della fustella (docs/08-packaging.md)')
