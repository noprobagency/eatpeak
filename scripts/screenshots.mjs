/**
 * Salva gli screenshot di riferimento in docs/screens/, via Chrome headless.
 *
 *   npm run docs:screens                 usa http://localhost:5173 (dev server acceso)
 *   npm run docs:screens -- --url=https://drinkpeak.vercel.app
 *
 * Le viste sono quelle dei criteri di accettazione della 3.0: home e PDP
 * desktop, per intero e strette; la home con le etichette dei reference; il
 * design system; i quattro laboratori (il font con tre candidati); i pack
 * isolati dal fronte al retro.
 *
 * Due limiti di Chrome headless: sotto i 500px la finestra non si stringe
 * (le viste "mobile" sono a 500px), e una pagina scorsa sotto la barra di
 * vetro (backdrop-filter) esce vuota, quindi si allunga la finestra invece di
 * scorrere e non si usano le ancore.
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

/** Nome del file, rotta, query (prima dell'hash), dimensioni della finestra. */
const SHOTS = [
  { name: 'design-system', route: '#/', width: 1440, height: 3200 },
  { name: 'home', route: '#/sito', width: 1440, height: 900 },
  { name: 'home-full', route: '#/sito', width: 1440, height: 9000 },
  { name: 'home-ref', route: '#/sito', query: 'ref=1', width: 1440, height: 9000 },
  { name: 'home-mobile', route: '#/sito', width: 500, height: 7000 },
  { name: 'pdp', route: '#/prodotto', width: 1440, height: 1100 },
  { name: 'pdp-full', route: '#/prodotto', width: 1440, height: 9600 },
  { name: 'pdp-mobile', route: '#/prodotto', width: 500, height: 7000 },
  { name: 'formula', route: '#/formula', width: 1440, height: 2400 },
  { name: 'prototipi', route: '#/prototipi', width: 1440, height: 1500 },
  { name: 'lab-font-nunito', route: '#/lab/font', query: 'font=nunito', width: 1440, height: 2600 },
  { name: 'lab-font-gabarito', route: '#/lab/font', query: 'font=gabarito', width: 1440, height: 2600 },
  { name: 'lab-font-mplus', route: '#/lab/font', query: 'font=mplus', width: 1440, height: 2600 },
  { name: 'lab-simbolo', route: '#/lab/simbolo', query: 'font=denim', width: 1440, height: 2600 },
  { name: 'lab-box', route: '#/lab/box', query: 'font=denim', width: 1440, height: 3200 },
  { name: 'lab-pack', route: '#/lab/pack', query: 'font=denim', width: 1440, height: 2600 },
]

/** I singoli pack, isolati: escono da export:pack, che rende il componente da solo. */
const PACK_SHOTS = [
  { name: 'busta-arancia', flavor: 'arancia', args: ['--busta', '--size=900'] },
  { name: 'busta-lime', flavor: 'lime', args: ['--busta', '--size=900'] },
  { name: 'busta-neutro', flavor: 'arancia', args: ['--busta', '--neutro', '--size=900'], file: 'peak-busta-neutro-fronte.png' },
  { name: 'retro-arancia', flavor: 'arancia', args: ['--retro', '--marked=12', '--size=900'], file: 'peak-retro-arancia-retro.png' },
  { name: 'stick-arancia', flavor: 'arancia', args: ['--stick', '--size=1200'] },
  { name: 'stick-lime', flavor: 'lime', args: ['--stick', '--size=1200'] },
]

function shoot(url, out, width, height) {
  execFileSync(
    CHROME,
    [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--virtual-time-budget=8000', `--window-size=${width},${height}`,
      `--screenshot=${out}`, url,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  )
}

for (const s of SHOTS) {
  const out = resolve(outDir, `${s.name}.png`)
  shoot(`${base}/${s.query ? `?${s.query}` : ''}${s.route}`, out, s.width, s.height)
  console.log(`docs/screens/${s.name}.png  (${s.width}x${s.height})`)
}

// I pack, isolati: si passa da export:pack e si copia il PNG in docs/screens.
for (const p of PACK_SHOTS) {
  execFileSync(
    process.execPath,
    [resolve(root, 'scripts/export-pack.mjs'), p.flavor, ...p.args],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  const kind = p.args.includes('--stick') ? 'stick' : 'busta'
  const from = resolve(root, `assets/export/pack/${p.file ?? `peak-${kind}-${p.flavor}-fronte.png`}`)
  const to = resolve(outDir, `${p.name}.png`)
  copyFileSync(from, to)
  console.log(`docs/screens/${p.name}.png  (da export:pack)`)
}
