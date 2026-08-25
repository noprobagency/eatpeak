/**
 * Verifica che ogni utility di dimensione usata nel sorgente esista davvero
 * nel CSS costruito.
 *
 * Serve per un motivo preciso. tailwind.config.js SOSTITUISCE la scala di
 * spaziatura invece di estenderla, cosi' che `p-7` o `gap-1.5` non siano
 * scrivibili per sbaglio. Il rovescio e' che Tailwind non protesta: la classe
 * semplicemente non genera nulla, e il difetto si vede solo guardando la
 * pagina. Un pulsante senza `h-11` resta in piedi grazie al padding, e nessuno
 * se ne accorge per settimane.
 *
 * Questo script chiude il buco: confronta cio' che il sorgente usa con cio'
 * che il CSS contiene, e fallisce sulla differenza.
 *
 *   npm run check:utilities   (gira dentro `npm test`, dopo la build)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------------------
// Il CSS costruito
// ---------------------------------------------------------------------------

const distAssets = resolve(root, 'dist/assets')

let css
try {
  const file = readdirSync(distAssets).find((f) => f.endsWith('.css'))
  if (!file) throw new Error('nessun .css')
  css = readFileSync(join(distAssets, file), 'utf8')
} catch {
  console.error('Manca il CSS costruito. Lancia prima `npm run build`.')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Cosa si controlla
// ---------------------------------------------------------------------------

/** I gruppi di utility che leggono la scala di spaziatura. */
const PREFIXES = [
  'gap', 'gap-x', 'gap-y',
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'w', 'h', 'min-w', 'min-h', 'size',
  'space-x', 'space-y',
]

/**
 * Numero puro, niente frazioni (`left-1/2`), niente parole (`h-full`), niente
 * valori arbitrari (`w-[208px]`), che compilano sempre.
 */
const USAGE = new RegExp(
  String.raw`(?<![\w-])(-?(?:${PREFIXES.join('|')})-\d+(?:\.\d+)?)(?![\w./-])`,
  'g',
)

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (['.tsx', '.ts', '.css'].includes(extname(entry))) out.push(full)
  }
  return out
}

/**
 * La classe puo' comparire nuda (`.gap-4{`), in un elenco di selettori
 * (`.gap-4,`) o dietro una variante (`.lg\:gap-4`, `.first\:mt-0`).
 */
function isInCss(cls) {
  const escaped = cls.replace('.', '\\.')
  return css.includes(`${escaped}{`) || css.includes(`${escaped},`) || css.includes(`${escaped}:`)
}

// ---------------------------------------------------------------------------
// Analisi
// ---------------------------------------------------------------------------

const used = new Map()

for (const file of walk(resolve(root, 'src'))) {
  const rel = relative(root, file)
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    // I path SVG contengono sequenze come `h-72`: non sono classi.
    if (/\bd="[^"]*"/.test(line)) return

    for (const [, cls] of line.matchAll(USAGE)) {
      if (!used.has(cls)) used.set(cls, [])
      used.get(cls).push(`${rel}:${i + 1}`)
    }
  })
}

const broken = [...used.entries()].filter(([cls]) => !isInCss(cls))

console.log(`Utility — ${used.size} classi di dimensione usate nel sorgente.`)

if (broken.length > 0) {
  console.error(`\n✗  ${broken.length} non genera CSS: e' fuori dalla scala dei token.\n`)
  for (const [cls, places] of broken.sort()) {
    console.error(`   ${cls}  (${places.length}x)`)
    for (const place of [...new Set(places)].slice(0, 4)) console.error(`     ${place}`)
  }
  console.error(
    '\n   Scala di spaziatura: 0 1 2 3 4 5 6 8 10 12 16 20 24 32 (base 4px).' +
      '\n   Altezze dei controlli: h-control-sm | h-control-md | h-control-lg.' +
      '\n   Per un one-off di layout usa un valore arbitrario, es. w-[208px].',
  )
  process.exit(1)
}

console.log('✓  Ogni utility usata esiste nel CSS costruito.')
