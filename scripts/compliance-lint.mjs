/**
 * Linter di compliance.
 *
 * Scandaglia tutto il sorgente — codice, commenti, nomi di variabili,
 * placeholder — e cerca i termini per cui la creatina non ha un claim
 * autorizzato, piu' il lessico bandito dalla voce del brand.
 *
 * Gli errori bloccano. I benefici generici (articolo 10(3)) sono warning e
 * chiedono di verificare che un claim autorizzato compaia nello stesso blocco.
 *
 *   npm run lint:compliance
 *
 * L'elenco dei termini sta in src/lib/compliance.ts, che e' anche cio' che
 * documenta docs/06-compliance.md. Un posto solo.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------------------
// Cosa si guarda e cosa no
// ---------------------------------------------------------------------------

const SCAN_DIRS = ['src', 'docs']
/** File di primo livello da includere comunque. */
const SCAN_FILES = ['README.md']
const SCAN_EXT = new Set(['.ts', '.tsx', '.css', '.md', '.json', '.html'])

/**
 * Questi file contengono i termini vietati come DATI: sono l'elenco stesso e
 * la sua documentazione. Escluderli e' corretto; escludere altro no.
 */
const ALLOWLIST = new Set([
  'src/lib/compliance.ts',
  'docs/06-compliance.md',
])

// ---------------------------------------------------------------------------
// Lettura dei termini dal sorgente TypeScript
// ---------------------------------------------------------------------------

const complianceSource = readFileSync(resolve(root, 'src/lib/compliance.ts'), 'utf8')

function extractTerms() {
  const start = complianceSource.indexOf('export const FORBIDDEN_TERMS')
  // Si parte dopo l'uguale: l'annotazione `readonly ForbiddenTerm[]` contiene
  // un '[' che altrimenti verrebbe scambiato per l'inizio dell'array.
  const from = complianceSource.indexOf('[', complianceSource.indexOf('=', start))
  let depth = 0
  let end = from

  for (let i = from; i < complianceSource.length; i++) {
    if (complianceSource[i] === '[') depth++
    else if (complianceSource[i] === ']') {
      depth--
      if (depth === 0) { end = i; break }
    }
  }

  const literal = complianceSource
    .slice(from, end + 1)
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\bgroup:\s*'([^']*)'/g, "group: '$1'")

  return new Function(`return (${literal})`)()
}

function extractGenericPhrases() {
  const start = complianceSource.indexOf('export const GENERIC_BENEFIT_PHRASES')
  const from = complianceSource.indexOf('[', complianceSource.indexOf('=', start))
  const end = complianceSource.indexOf(']', from)
  return complianceSource
    .slice(from + 1, end)
    .split(',')
    .map((s) => s.trim().replace(/^'|'$/g, ''))
    .filter(Boolean)
}

const FORBIDDEN_TERMS = extractTerms()
const GENERIC_PHRASES = extractGenericPhrases()

// ---------------------------------------------------------------------------
// Analisi
// ---------------------------------------------------------------------------

const isTechnicalUse = (haystack, index, length) => {
  const before = index > 0 ? haystack[index - 1] : ''
  const after = haystack[index + length] ?? ''
  return ':-.'.includes(before) || ':-('.includes(after)
}

const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue
      walk(full, out)
    } else if (SCAN_EXT.has(extname(entry))) {
      out.push(full)
    }
  }
  return out
}

const files = [
  ...SCAN_DIRS.flatMap((d) => {
    try { return walk(resolve(root, d)) } catch { return [] }
  }),
  ...SCAN_FILES.map((f) => resolve(root, f)),
]

const errors = []
const warnings = []
const suppressions = []

/**
 * Soppressione esplicita, sulla stessa riga o su quella sopra:
 *
 *   // peak-compliance-ignore focus — anello di focus da tastiera, non un claim
 *
 * Con `*` al posto del termine sopprime tutti i termini della riga. Serve ai
 * documenti che elencano le parole vietate: elencarle e' il loro lavoro.
 *
 *   <!-- peak-compliance-ignore * — elenco dei termini vietati, non un uso -->
 *
 * Serve per i pochi casi in cui un termine vietato e' anche un concetto
 * tecnico legittimo. Chiede il termine E la motivazione: una soppressione senza
 * spiegazione non vale e viene ignorata.
 */
// Il termine puo' contenere spazi ("per lei"), quindi si legge fino al trattino
// che introduce la motivazione.
const SUPPRESS = /peak-compliance-ignore\s+(.+?)\s+[—-]\s+(.+)/

/** Quante righe sopra si guarda: basta a coprire un blocco di direttive. */
const SUPPRESS_LOOKBACK = 3

/**
 * Per i paragrafi di prosa, dove la direttiva per riga non basta:
 *
 *   <!-- peak-compliance-ignore-start * — elenco dei termini vietati -->
 *   ...
 *   <!-- peak-compliance-ignore-end -->
 */
const SUPPRESS_START = /peak-compliance-ignore-start\s+(.+?)\s+[—-]\s+(.+)/
const SUPPRESS_END = /peak-compliance-ignore-end/

/** Per ogni riga del file, quali termini sono soppressi da un blocco aperto. */
function blockSuppressions(lines) {
  const map = new Array(lines.length).fill(null)
  let open = null

  lines.forEach((line, i) => {
    if (open === null) {
      const m = line.match(SUPPRESS_START)
      if (m) { open = { term: normalize(m[1].trim()), reason: cleanReason(m[2]) }; return }
    } else if (SUPPRESS_END.test(line)) {
      open = null
      return
    }
    map[i] = open
  })

  return map
}

/** Toglie i delimitatori di chiusura del commento dalla motivazione. */
function cleanReason(raw) {
  return raw.replace(/\s*(-->|\*\/\}?|\}|\*\/)\s*$/, '').trim()
}

function suppressionsNear(lines, index) {
  const found = []
  for (let i = index; i >= Math.max(0, index - SUPPRESS_LOOKBACK); i--) {
    const m = lines[i]?.match(SUPPRESS)
    if (m) found.push({ term: normalize(m[1].trim()), reason: cleanReason(m[2]) })
  }
  return found
}

for (const file of files) {
  const rel = relative(root, file)
  if (ALLOWLIST.has(rel)) continue

  const lines = readFileSync(file, 'utf8').split('\n')
  const blocks = blockSuppressions(lines)

  lines.forEach((line, index) => {
    const haystack = normalize(line)
    const suppressed = [...suppressionsNear(lines, index), blocks[index]].filter(Boolean)

    for (const { term, reason, group, technicalCollision } of FORBIDDEN_TERMS) {
      const needle = normalize(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${needle}(?![\\p{L}\\p{N}])`, 'gu')

      let match
      while ((match = pattern.exec(haystack)) !== null) {
        // "focus" e' anche una pseudo-classe CSS e un evento del DOM: incollato
        // a ':', '-', '.' o '(' e' un identificatore, non una parola.
        if (technicalCollision && isTechnicalUse(haystack, match.index, match[0].length)) continue

        const hit = suppressed.find((x) => x.term === '*' || x.term === normalize(term))
        if (hit) {
          suppressions.push({ file: rel, line: index + 1, term, reason: hit.reason })
          break
        }

        errors.push({ file: rel, line: index + 1, term, reason, group, text: line.trim() })
        break
      }
    }

    for (const phrase of GENERIC_PHRASES) {
      if (haystack.includes(normalize(phrase))) {
        warnings.push({ file: rel, line: index + 1, term: phrase, text: line.trim() })
      }
    }
  })
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(`Compliance — analizzati ${files.length} file, ${FORBIDDEN_TERMS.length} termini vietati.\n`)

if (suppressions.length > 0) {
  // Una soppressione a blocco copre molte righe: si raggruppa per file e
  // motivazione, altrimenti il report annega nel proprio rumore.
  const grouped = new Map()
  for (const s of suppressions) {
    const key = `${s.file}|${s.reason}`
    const g = grouped.get(key) ?? { file: s.file, reason: s.reason, terms: new Set(), lines: [] }
    g.terms.add(s.term)
    g.lines.push(s.line)
    grouped.set(key, g)
  }

  console.log(`•  ${grouped.size} soppressione esplicita, su ${suppressions.length} occorrenze.\n`)
  for (const g of grouped.values()) {
    const from = Math.min(...g.lines)
    const to = Math.max(...g.lines)
    const range = from === to ? `${from}` : `${from}-${to}`
    const terms = [...g.terms].sort().join(', ')
    console.log(`   ${g.file}:${range}  [${terms}]`)
    console.log(`     ${g.reason}`)
  }
  console.log()
}

if (warnings.length > 0) {
  console.log(`⚠  ${warnings.length} beneficio generico (articolo 10(3)).`)
  console.log('   Ammesso, ma serve un claim autorizzato nelle immediate vicinanze.\n')
  for (const w of warnings) {
    console.log(`   ${w.file}:${w.line}  "${w.term}"`)
    console.log(`     ${w.text.slice(0, 100)}`)
  }
  console.log()
}

if (errors.length > 0) {
  console.error(`✗  ${errors.length} termine vietato.\n`)
  for (const e of errors) {
    console.error(`   ${e.file}:${e.line}  "${e.term}"  [${e.group}]`)
    console.error(`     ${e.reason}`)
    console.error(`     ${e.text.slice(0, 100)}\n`)
  }
  process.exit(1)
}

console.log('✓  Nessun termine vietato.')
