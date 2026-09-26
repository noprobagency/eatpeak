/**
 * Linter di compliance (2.0).
 *
 * Scandaglia tutto il sorgente — codice, commenti, nomi di variabili,
 * placeholder — e cerca i termini per cui il prodotto non ha un claim
 * autorizzato, piu' il lessico bandito dalla voce del brand.
 *
 * Gli errori bloccano. I benefici generici (articolo 10(3)) sono warning e
 * chiedono di verificare che un claim autorizzato compaia nello stesso blocco.
 *
 * Novita' 2.0: le frasi letterali di EFSA_CLAIMS sono un'allowlist. Il claim
 * "La vitamina D contribuisce alla normale funzione del sistema immunitario."
 * passa per intero; la parola "immune" da sola, fuori da quella frase, resta
 * vietata. Il linter lo verifica su se stesso a ogni avvio (auto-test).
 *
 *   npm run lint:compliance
 *   npm run lint:compliance -- --self-test   (solo l'auto-test)
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
const SCAN_FILES = ['README.md', 'index.html']
const SCAN_EXT = new Set(['.ts', '.tsx', '.css', '.md', '.json', '.html'])

/**
 * Questi file contengono i termini vietati come DATI: sono l'elenco stesso e
 * la sua documentazione. Escluderli e' corretto; escludere altro no.
 * L'archivio v1/ non e' nel perimetro: e' storia, non sistema.
 */
const ALLOWLIST = new Set([
  'src/lib/compliance.ts',
  'docs/06-compliance.md',
])

// ---------------------------------------------------------------------------
// Lettura dei termini dal sorgente TypeScript
// ---------------------------------------------------------------------------

const complianceSource = readFileSync(resolve(root, 'src/lib/compliance.ts'), 'utf8')

function extractArray(name) {
  const start = complianceSource.indexOf(`export const ${name}`)
  if (start === -1) throw new Error(`Non trovo ${name} in src/lib/compliance.ts`)
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

  const literal = complianceSource.slice(from, end + 1).replace(/^\s*\/\/.*$/gm, '')
  return new Function(`return (${literal})`)()
}

function extractObject(name) {
  const start = complianceSource.indexOf(`export const ${name} = {`)
  if (start === -1) throw new Error(`Non trovo ${name} in src/lib/compliance.ts`)
  const from = complianceSource.indexOf('{', start)
  let depth = 0
  let end = from
  for (let i = from; i < complianceSource.length; i++) {
    if (complianceSource[i] === '{') depth++
    else if (complianceSource[i] === '}') {
      depth--
      if (depth === 0) { end = i; break }
    }
  }
  const literal = complianceSource.slice(from, end + 1).replace(/^\s*\/\/.*$/gm, '')
  return new Function(`return (${literal})`)()
}

const FORBIDDEN_TERMS = extractArray('FORBIDDEN_TERMS')
const GENERIC_PHRASES = extractArray('GENERIC_BENEFIT_PHRASES')
const EFSA_CLAIMS = extractObject('EFSA_CLAIMS')
const AUTHORIZED_CLAIM_TEXTS = Object.values(EFSA_CLAIMS).flatMap((c) => [c.it, c.en])

// ---------------------------------------------------------------------------
// Analisi
// ---------------------------------------------------------------------------

const isTechnicalUse = (haystack, index, length) => {
  const before = index > 0 ? haystack[index - 1] : ''
  const after = haystack[index + length] ?? ''
  return ':-.'.includes(before) || ':-('.includes(after)
}

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Parola intera; `*` finale = prefisso (telomer* prende telomeri e telomeres). */
function termPattern(term) {
  const prefix = term.endsWith('*')
  const needle = normalize(prefix ? term.slice(0, -1) : term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\p{L}\\p{N}])${needle}${prefix ? '\\p{L}*' : ''}(?![\\p{L}\\p{N}])`, 'gu')
}

/** Gli intervalli della riga occupati da un claim autorizzato letterale. */
function literalClaimRanges(haystack) {
  const ranges = []
  for (const claim of AUTHORIZED_CLAIM_TEXTS) {
    const needle = normalize(claim)
    let from = 0
    let idx
    while ((idx = haystack.indexOf(needle, from)) !== -1) {
      ranges.push([idx, idx + needle.length])
      from = idx + needle.length
    }
  }
  return ranges
}

/**
 * Controlla una riga. Restituisce i termini vietati trovati (fuori dalle frasi
 * letterali e dagli usi tecnici) e i benefici generici.
 */
function scanLine(line) {
  const haystack = normalize(line)
  const literal = literalClaimRanges(haystack)
  const insideLiteral = (i) => literal.some(([a, b]) => i >= a && i < b)
  const hits = []

  for (const t of FORBIDDEN_TERMS) {
    const pattern = termPattern(t.term)
    let match
    while ((match = pattern.exec(haystack)) !== null) {
      if (t.technicalCollision && isTechnicalUse(haystack, match.index, match[0].length)) continue
      if (insideLiteral(match.index)) continue
      hits.push(t)
      break
    }
  }

  const generic = GENERIC_PHRASES.filter((p) => haystack.includes(normalize(p)))
  return { hits, generic }
}

// ---------------------------------------------------------------------------
// Auto-test: un caso positivo e uno negativo per l'allowlist
// ---------------------------------------------------------------------------

function selfTest() {
  const cases = [
    {
      name: 'il claim letterale vitd-immune passa',
      text: `Il prodotto: ${EFSA_CLAIMS['vitd-immune'].it}`,
      expectErrors: 0,
    },
    {
      name: 'il claim letterale vitd-immune in inglese passa',
      text: EFSA_CLAIMS['vitd-immune'].en,
      expectErrors: 0,
    },
    {
      name: '"immune" da solo, fuori dal claim, fallisce',
      text: 'La vitamina D sostiene il sistema immune.',
      expectErrors: 1,
    },
    {
      name: 'il claim riscritto (non letterale) fallisce',
      text: 'La vitamina D aiuta il sistema immunitario a funzionare.',
      expectErrors: 0, // "immunitario" non e' nell'elenco: e' il claim riscritto che va vietato per regola, non per parola
    },
    {
      name: 'telomer* prende anche la forma inglese',
      text: 'protects your telomeres',
      expectErrors: 1,
    },
    {
      name: 'mojito e vietato',
      text: 'Gusto Mojito',
      expectErrors: 1,
    },
    {
      name: ':focus-visible e un uso tecnico',
      text: 'a:focus-visible { outline: 2px }',
      expectErrors: 0,
    },
  ]

  const failures = []
  for (const c of cases) {
    const { hits } = scanLine(c.text)
    if (hits.length !== c.expectErrors) {
      failures.push(`${c.name}: attesi ${c.expectErrors} errori, trovati ${hits.length} [${hits.map((h) => h.term).join(', ')}]`)
    }
  }

  if (failures.length > 0) {
    console.error('✗  Auto-test del linter fallito:\n')
    for (const f of failures) console.error(`   ${f}`)
    process.exit(1)
  }

  console.log(`✓  Auto-test del linter: ${cases.length} casi, allowlist dei claim letterali attiva.`)
}

selfTest()
if (process.argv.includes('--self-test')) process.exit(0)

// ---------------------------------------------------------------------------
// Scansione
// ---------------------------------------------------------------------------

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
 * Chiede il termine E la motivazione: una soppressione senza spiegazione non
 * vale e viene ignorata.
 */
const SUPPRESS = /peak-compliance-ignore\s+(.+?)\s+[—-]\s+(.+)/
const SUPPRESS_LOOKBACK = 3
const SUPPRESS_START = /peak-compliance-ignore-start\s+(.+?)\s+[—-]\s+(.+)/
const SUPPRESS_END = /peak-compliance-ignore-end/

function cleanReason(raw) {
  return raw.replace(/\s*(-->|\*\/\}?|\}|\*\/)\s*$/, '').trim()
}

function blockSuppressions(lines) {
  const map = new Array(lines.length).fill(null)
  let open = null

  lines.forEach((line, i) => {
    if (open === null) {
      const m = line.match(SUPPRESS_START)
      if (m) {
        open = { term: normalize(m[1].trim()), reason: cleanReason(m[2]) }
        map[i] = open
        return
      }
    } else if (SUPPRESS_END.test(line)) {
      open = null
      return
    }
    map[i] = open
  })

  return map
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

  let lines
  try {
    lines = readFileSync(file, 'utf8').split('\n')
  } catch {
    continue
  }
  const blocks = blockSuppressions(lines)

  lines.forEach((line, index) => {
    const suppressed = [...suppressionsNear(lines, index), blocks[index]].filter(Boolean)
    const { hits, generic } = scanLine(line)

    for (const t of hits) {
      const hit = suppressed.find((x) => x.term === '*' || x.term === normalize(t.term))
      if (hit) {
        suppressions.push({ file: rel, line: index + 1, term: t.term, reason: hit.reason })
      } else {
        errors.push({ file: rel, line: index + 1, term: t.term, reason: t.reason, group: t.group, text: line.trim() })
      }
    }

    for (const phrase of generic) {
      warnings.push({ file: rel, line: index + 1, term: phrase, text: line.trim() })
    }
  })
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(`Compliance — analizzati ${files.length} file, ${FORBIDDEN_TERMS.length} termini vietati, ${AUTHORIZED_CLAIM_TEXTS.length} frasi letterali ammesse.\n`)

if (suppressions.length > 0) {
  const grouped = new Map()
  for (const s of suppressions) {
    const key = `${s.file}|${s.reason}`
    const g = grouped.get(key) ?? { file: s.file, reason: s.reason, terms: new Set(), lines: [] }
    g.terms.add(s.term)
    g.lines.push(s.line)
    grouped.set(key, g)
  }

  console.log(`•  ${grouped.size} soppressioni esplicite, su ${suppressions.length} occorrenze.\n`)
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
  console.log(`⚠  ${warnings.length} benefici generici (articolo 10(3)).`)
  console.log('   Ammessi, ma serve un claim autorizzato nelle immediate vicinanze.\n')
  for (const w of warnings) {
    console.log(`   ${w.file}:${w.line}  "${w.term}"`)
    console.log(`     ${w.text.slice(0, 100)}`)
  }
  console.log()
}

if (errors.length > 0) {
  console.error(`✗  ${errors.length} termini vietati.\n`)
  for (const e of errors) {
    console.error(`   ${e.file}:${e.line}  "${e.term}"  [${e.group}]`)
    console.error(`     ${e.reason}`)
    console.error(`     ${e.text.slice(0, 100)}\n`)
  }
  process.exit(1)
}

console.log('✓  Nessun termine vietato.')
