// Genera src/tokens/tokens.css a partire da src/tokens/tokens.json.
// Eseguire dopo ogni modifica ai token: `npm run tokens:build`.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const t = JSON.parse(readFileSync(resolve(root, 'src/tokens/tokens.json'), 'utf8'))

const L = []
const push = (s = '') => L.push(s)

push('/* ============================================================')
push(' * peak — design tokens')
push(' * FILE GENERATO. Non modificare a mano.')
push(' * Sorgente: src/tokens/tokens.json — rigenera con `npm run tokens:build`')
push(' * ============================================================ */')
push()
push(':root {')

push('  /* --- colori grezzi: non usarli nei componenti, usa i semantici --- */')
for (const [scale, steps] of Object.entries(t.color)) {
  if (scale === 'state') continue
  for (const [step, hex] of Object.entries(steps)) {
    push(`  --color-${scale}-${step}: ${hex};`)
  }
  push('')
}
push('  /* --- stato --- */')
for (const [k, v] of Object.entries(t.color.state)) push(`  --color-${k}: ${v};`)
push()

push('  /* --- token semantici: SOLO questi nei componenti --- */')
for (const [name, ref] of Object.entries(t.semantic)) {
  const [scale, step] = ref.split('.')
  push(`  --${name}: var(--color-${scale}-${step});`)
}
push()

push('  /* --- famiglie --- */')
for (const [k, v] of Object.entries(t.font)) push(`  --font-${k}: ${v};`)
push()

push('  /* --- scala tipografica --- */')
for (const [name, s] of Object.entries(t.type)) {
  push(`  --type-${name}-size: ${s.size};`)
  push(`  --type-${name}-lh: ${s.lineHeight};`)
  push(`  --type-${name}-tracking: ${s.tracking};`)
}
push()

push('  /* --- spazio --- */')
for (const [k, v] of Object.entries(t.space)) push(`  --space-${k}: ${v};`)
push()

push('  /* --- altezze dei controlli: non sono spazi, hanno la loro scala --- */')
for (const [k, v] of Object.entries(t.control)) push(`  --control-${k}: ${v};`)
push()

push('  /* --- raggi --- */')
for (const [k, v] of Object.entries(t.radius)) push(`  --radius-${k}: ${v};`)
push()

push('  /* --- ombre --- */')
for (const [k, v] of Object.entries(t.shadow)) push(`  --shadow-${k}: ${v};`)
push()

push('  /* --- movimento --- */')
for (const [k, v] of Object.entries(t.motion.duration)) push(`  --duration-${k}: ${v};`)
for (const [k, v] of Object.entries(t.motion.easing)) push(`  --easing-${k}: ${v};`)
push()

push('  /* --- layout --- */')
push(`  --container-max: ${t.layout.containerMax};`)
push(`  --media-max: ${t.layout.mediaMax};`)
push(`  --container-padding: ${t.layout.containerPadding};`)
push('}')
push()

push('/* Le classi tipografiche riproducono la scala con famiglia, peso e case corretti.')
push('   I display sono sempre minuscoli: fa parte dell identita, non e uno stile. */')
for (const [name, s] of Object.entries(t.type)) {
  push(`.type-${name} {`)
  push(`  font-family: var(--font-${s.family});`)
  push(`  font-size: var(--type-${name}-size);`)
  push(`  line-height: var(--type-${name}-lh);`)
  push(`  letter-spacing: var(--type-${name}-tracking);`)
  push(`  font-weight: ${s.weight};`)
  if (s.case !== 'none') push(`  text-transform: ${s.case};`)
  push('}')
}
push()

push('/* Ogni animazione del sistema si spegne se l utente lo ha chiesto. */')
push('@media (prefers-reduced-motion: reduce) {')
push('  :root {')
push('    --duration-fast: 0ms;')
push('    --duration-base: 0ms;')
push('    --duration-slow: 0ms;')
push('  }')
push('  *, *::before, *::after {')
push('    animation-duration: 0.01ms !important;')
push('    animation-iteration-count: 1 !important;')
push('    transition-duration: 0.01ms !important;')
push('    scroll-behavior: auto !important;')
push('  }')
push('}')
push()

writeFileSync(resolve(root, 'src/tokens/tokens.css'), L.join('\n'))
console.log(`tokens.css generato — ${L.length} righe`)
