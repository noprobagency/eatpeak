/**
 * Esporta il wordmark in PNG ad alta risoluzione, ritagliato al pixel.
 *
 *   node scripts/export-logo.mjs [white|ink|arancia|lime] [--size=2400] [--out=percorso.png] [--bg=#E4572E]
 *   node scripts/export-logo.mjs --list
 *
 * Nella 2.0 il wordmark e' un tracciato, quindi non serve nessun font: Chrome
 * disegna il path su una tela con Path2D e ritaglia sull'alfa. `--size` e' la
 * larghezza in pixel del risultato. Con `--bg` si aggiunge un campo di colore
 * pieno (utile per il bianco, che su trasparente non si vede in anteprima).
 *
 * Esce in assets/export/, fuori dal versionamento.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const FILLS = {
  white: { hex: '#FFFFFF', label: 'Bianco — primaria, su campo colore-gusto o inchiostro' },
  ink: { hex: '#1B1A18', label: 'Inchiostro — su bianco e carta' },
  arancia: { hex: '#E4572E', label: 'Colore-gusto arancia — solo su chiaro, sopra i 48px' },
  lime: { hex: '#5E9E1F', label: 'Colore-gusto lime — solo su chiaro, sopra i 48px' },
}

if (args.includes('--list')) {
  console.log('Varianti disponibili:\n')
  for (const [name, spec] of Object.entries(FILLS)) console.log(`  ${name.padEnd(10)} ${spec.label}`)
  process.exit(0)
}

const variantName = args.find((a) => !a.startsWith('--')) ?? 'white'
const spec = FILLS[variantName]
if (!spec) {
  console.error(`Variante sconosciuta: "${variantName}". Usa --list per l'elenco.`)
  process.exit(1)
}

const width = Number(flag('size', 2400))
const bg = flag('bg', variantName === 'white' ? '#E4572E' : null)
const outPath = resolve(root, flag('out', `assets/export/peak-wordmark-${variantName}@${width}.png`))

if (!existsSync(CHROME)) {
  console.error(`Manca Chrome in ${CHROME}. Serve per rasterizzare il tracciato.`)
  process.exit(1)
}

const wordmark = JSON.parse(readFileSync(resolve(root, 'src/brand/wordmark.json'), 'utf8'))
const { width: W, height: H } = wordmark.viewBox
const height = Math.round((width * H) / W)
// Con il campo di colore, un margine pari all'area di rispetto (l'altezza della e).
const pad = bg ? Math.round((width * wordmark.eHeight) / W) : 0

const html = `<!doctype html>
<meta charset="utf-8">
<body style="margin:0"><div id="out"></div>
<script>
  const c = document.createElement('canvas')
  c.width = ${width + pad * 2}
  c.height = ${height + pad * 2}
  const ctx = c.getContext('2d')
  ${bg ? `ctx.fillStyle = ${JSON.stringify(bg)}; ctx.fillRect(0, 0, c.width, c.height);` : ''}
  ctx.translate(${pad}, ${pad})
  ctx.scale(${width / W}, ${width / W})
  ctx.fillStyle = ${JSON.stringify(spec.hex)}
  ctx.fill(new Path2D(${JSON.stringify(wordmark.path)}))
  document.getElementById('out').textContent = JSON.stringify({ w: c.width, h: c.height }) + '|' + c.toDataURL('image/png')
</script>
</body>`

const work = resolve(tmpdir(), `peak-logo-${process.pid}.html`)
writeFileSync(work, html)

let dom
try {
  dom = execFileSync(
    CHROME,
    ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--virtual-time-budget=5000', '--dump-dom', `file://${work}`],
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

console.log(outPath.replace(`${root}/`, ''))
console.log(`  variante   ${variantName} — ${spec.label}`)
console.log(`  pieno      ${spec.hex}${bg ? ` su campo ${bg}` : ', fondo trasparente'}`)
console.log(`  misura     ${w} x ${h} px${bg ? ` (area di rispetto ${pad}px per lato)` : ', ritagliato al tracciato'}`)
console.log(`  peso       ${(buffer.length / 1024).toFixed(1)} kB`)
