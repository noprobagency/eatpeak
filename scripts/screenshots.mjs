/**
 * Salva gli screenshot di riferimento in docs/screens/, via Chrome headless.
 *
 *   npm run docs:screens                 usa http://localhost:5173 (dev server acceso)
 *   npm run docs:screens -- --url=https://drinkpeak.vercel.app
 *
 * Le viste sono quelle dei criteri di accettazione della 2.0: la prima
 * schermata del design system a 1440x900, logo e simbolo, busta e stick dei
 * due gusti, piu' home e PDP per il sito.
 */

import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const base = flag('url', 'http://localhost:5173').replace(/\/$/, '')
const outDir = resolve(root, 'docs/screens')
mkdirSync(outDir, { recursive: true })

if (!existsSync(CHROME)) {
  console.error(`Manca Chrome in ${CHROME}.`)
  process.exit(1)
}

/** Nome del file, rotta, dimensioni della finestra, id da cui scorrere (opzionale). */
const SHOTS = [
  { name: 'showcase-v2-top', route: '#/design-system', width: 1440, height: 900 },
  { name: 'showcase-v2-logo-simbolo', route: '#/design-system#logo', width: 1440, height: 1800 },
  { name: 'home', route: '#/', width: 1440, height: 900 },
  { name: 'home-mobile', route: '#/', width: 390, height: 844 },
  { name: 'pdp', route: '#/prodotto', width: 1440, height: 1100 },
  { name: 'prototipi-v2', route: '#/prototipi#v2', width: 1440, height: 1200 },
]

/** I singoli pack, isolati: escono da export:pack, che rende il componente da solo. */
const PACK_SHOTS = [
  { name: 'busta-arancia', flavor: 'arancia', kind: 'busta', size: 900 },
  { name: 'busta-lime', flavor: 'lime', kind: 'busta', size: 900 },
  { name: 'stick-arancia', flavor: 'arancia', kind: 'stick', size: 1200 },
  { name: 'stick-lime', flavor: 'lime', kind: 'stick', size: 1200 },
]

function shoot(url, out, width, height) {
  execFileSync(
    CHROME,
    [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--virtual-time-budget=6000', `--window-size=${width},${height}`,
      `--screenshot=${out}`, url,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  )
}

for (const s of SHOTS) {
  const out = resolve(outDir, `${s.name}.png`)
  shoot(`${base}/${s.route}`, out, s.width, s.height)
  console.log(`docs/screens/${s.name}.png  (${s.width}x${s.height})`)
}

// I pack, isolati: si passa da export:pack e si copia il PNG in docs/screens.
for (const p of PACK_SHOTS) {
  execFileSync(
    process.execPath,
    [resolve(root, 'scripts/export-pack.mjs'), p.flavor, `--${p.kind}`, `--size=${p.size}`],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  const from = resolve(root, `assets/export/pack/peak-${p.kind}-${p.flavor}-fronte.png`)
  copyFileSync(from, resolve(outDir, `${p.name}.png`))
  console.log(`docs/screens/${p.name}.png  (da export:pack, ${p.size}px)`)
}

console.log('\nFatto.')
