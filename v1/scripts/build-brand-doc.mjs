/**
 * Genera docs/00-brand-overview.md da src/lib/brand-overview.ts.
 *
 * Lo stesso contenuto alimenta il componente <BrandOverview />: se il markdown
 * fosse scritto a mano, il giorno che cambia una riga ne cambieresti una sola
 * delle due e l'altra mentirebbe.
 *
 *   npm run docs:brand
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(resolve(root, 'src/lib/brand-overview.ts'), 'utf8')

// ---------------------------------------------------------------------------
// Estrazione
// ---------------------------------------------------------------------------

function extractContent() {
  const start = source.indexOf('export const BRAND_OVERVIEW')
  if (start === -1) throw new Error('Non trovo BRAND_OVERVIEW in src/lib/brand-overview.ts')

  const from = source.indexOf('{', source.indexOf('=', start))
  let depth = 0
  let end = from

  for (let i = from; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) { end = i; break }
    }
  }

  const literal = source.slice(from, end + 1).replace(/^\s*\/\/.*$/gm, '')
  return new Function(`return (${literal})`)()
}

const content = extractContent()

// ---------------------------------------------------------------------------
// Composizione
// ---------------------------------------------------------------------------

const L = []
const push = (s = '') => L.push(s)

push('<!--')
push('  FILE GENERATO. Non modificare a mano.')
push('  Sorgente: src/lib/brand-overview.ts — rigenera con `npm run docs:brand`')
push('  Lo stesso contenuto alimenta il componente <BrandOverview />.')
push('-->')
push()
push(`# ${content.title}`)
push()
push(content.intro)
push()
push('> **Documento di posizionamento interno.** Dice a chi parliamo e come, e')
push('> per farlo nomina termini che il brand non usa in comunicazione. Nessuna')
push('> riga va copiata in una pagina di vendita così com’è: il copy pubblicabile')
push('> sta in [`src/lib/copy.ts`](../src/lib/copy.ts) ed è un altro insieme.')
push()
push('---')
push()

// --- il claim ---
push(`## ${content.claim.label}`)
push()
for (const line of content.claim.lines) push(`**${line}**  `)
push()
push('Il claim corto è un **beneficio generico** ai sensi dell’articolo 10(3) del')
push('Regolamento UE 1924/2006: ovunque compaia, deve comparire anche un claim')
push('autorizzato nelle immediate vicinanze. Vedi [06 — Compliance](06-compliance.md).')
push()
push('---')
push()

// --- i blocchi ---
for (const block of content.blocks) {
  if (block.compliance) {
    // La dichiarazione viaggia col blocco: il linter la legge, e chi legge il
    // documento vede perche' quel termine e' li'.
    push(`<!-- peak-compliance-ignore ${block.compliance.term} — ${block.compliance.reason} -->`)
  }

  push(`## ${block.label}`)
  push()
  for (const p of block.paragraphs) push(p), push()

  if (block.compliance) {
    push(`> ⚠ **Nota di compliance.** ${block.compliance.reason}`)
    push()
  }
}

push('---')
push()
push('## Dove continua')
push()
push('| # | Documento |')
push('|---|---|')
push('| 01 | [Brand](01-brand.md) — posizionamento esteso, tono, le tensioni da tenere |')
push('| 02 | [Token](02-tokens.md) — colore, tipografia, spazio, forma |')
push('| 05 | [Voce e copy](05-voice-and-copy.md) — i claim approvati |')
push('| 06 | [**Compliance**](06-compliance.md) — cosa si può dire e cosa no |')
push()

writeFileSync(resolve(root, 'docs/00-brand-overview.md'), L.join('\n'))
console.log(`docs/00-brand-overview.md generato — ${content.blocks.length + 1} blocchi, ${L.length} righe`)
