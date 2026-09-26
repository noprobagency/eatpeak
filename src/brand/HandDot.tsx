/**
 * <HandDot /> — il pallino a mano.
 *
 * Il sistema e' preciso; il segno del cliente e' a mano. Questo e' il punto
 * che si segna a penna: un blob SVG deterministico dal seed, cosi' lo stesso
 * giorno ha sempre lo stesso segno e due giorni vicini non sono mai uguali.
 *
 * QUANDO USARLO: il calendario da segnare, il rituale dei 30 punti, il retro
 * busta, le numerazioni 01/02/03 delle sezioni, i divisori e i punti elenco.
 * QUANDO NO: nell'interfaccia funzionale (radio, selettori, stati) e nel
 * simbolo: li' i punti restano geometrici.
 *
 *   solid     riempito, bordo irregolare
 *   ring      cerchio disegnato a pennarello, tratto irregolare
 *   scribble  riempito a mano, con i tratti visibili
 */

import type { CSSProperties } from 'react'

export interface HandDotProps {
  /** Il seme: stesso seme, stesso segno. Un numero o una stringa. */
  seed: number | string
  /** Lato reso in px. */
  size?: number
  fill?: 'solid' | 'ring' | 'scribble'
  /** Colore del segno. Default: currentColor. */
  color?: string
  /** Quanto e' irregolare, 0..1. Default 0.5 (raggio +-5%). */
  wobble?: number
  title?: string
  className?: string
  style?: CSSProperties
}

/** mulberry32: piccolo, deterministico, basta e avanza. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(seed: number | string): number {
  if (typeof seed === 'number') return Math.floor(seed * 2654435761) >>> 0
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Un blob chiuso: 10-14 punti di controllo, raggio +-4..6%, rotazione casuale. */
export function handDotPath(seed: number | string, radius = 50, wobble = 0.5): string {
  const random = rng(hashSeed(seed))
  const n = 10 + Math.floor(random() * 5)
  const rotation = random() * Math.PI * 2
  const jitter = 0.04 + wobble * 0.02
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const a = rotation + (i / n) * Math.PI * 2
    const r = radius * (1 + (random() * 2 - 1) * jitter)
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r])
  }
  // Catmull-Rom -> Bezier cubiche, chiuso.
  const d: string[] = [`M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`]
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d.push(`C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`)
  }
  return d.join('') + 'Z'
}

/** I tratti dello scarabocchio: 4-6 linee spezzate dentro il blob. */
function scribbleStrokes(seed: number | string): string[] {
  const random = rng(hashSeed(`${seed}:scribble`))
  const strokes: string[] = []
  const lines = 4 + Math.floor(random() * 3)
  for (let i = 0; i < lines; i++) {
    const y = 22 + (i / (lines - 1)) * 56 + (random() * 6 - 3)
    const x1 = 18 + random() * 10
    const x2 = 72 + random() * 10
    const bend = random() * 10 - 5
    strokes.push(`M${x1.toFixed(1)} ${(y + bend).toFixed(1)} Q50 ${(y - bend).toFixed(1)} ${x2.toFixed(1)} ${(y + bend / 2).toFixed(1)}`)
  }
  return strokes
}

export function HandDot({
  seed, size = 24, fill = 'solid', color = 'currentColor', wobble = 0.5, title, className, style,
}: HandDotProps) {
  const outer = handDotPath(seed, 42, wobble)
  const inner = handDotPath(`${seed}:inner`, 36, wobble + 0.3)
  const decorative = !title

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={title}
      focusable="false"
      data-hand-dot={fill}
    >
      {title && <title>{title}</title>}
      {fill === 'solid' && <path d={outer} fill={color} />}
      {fill === 'ring' && (
        <>
          <path d={outer} fill="none" stroke={color} strokeWidth="7" strokeLinejoin="round" />
          {/* Un secondo tratto, un po' storto: il pennarello non passa due volte uguale. */}
          <path d={inner} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" opacity="0.55" transform="rotate(-8 50 50) scale(1.14) translate(-6 -6)" />
        </>
      )}
      {fill === 'scribble' && (
        <>
          <path d={outer} fill={color} opacity="0.82" />
          {scribbleStrokes(seed).map((d, i) => (
            <path key={i} d={d} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          ))}
          <path d={outer} fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}

export default HandDot
