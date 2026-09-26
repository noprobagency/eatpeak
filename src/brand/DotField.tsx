/**
 * <DotField /> — il pattern a pallini.
 *
 * Una griglia di punti che deriva dal vertice, con raggio crescente lungo una
 * direzione: densita' a gradiente, effetto retino. E' il rumore visivo del
 * brand, e porta il lato "particella" del segno.
 *
 * QUANDO USARLO: terzo inferiore del fronte busta, bande hero, fondi di card
 * grandi. Sempre sotto il blocco dati, mai attraverso il testo.
 * QUANDO NO: come texture di fondo di una pagina intera, o dietro un
 * paragrafo. Statico: nessuna animazione, di proposito.
 *
 * Le unita' sono relative: il pattern si disegna in un viewBox di `cols` x
 * `rows` celle da 20 unita' e si adatta al contenitore con
 * preserveAspectRatio="none" se `stretch` e' attivo.
 *
 * `dotFieldPoints` e' la geometria pura, per chi deve disegnare i punti dentro
 * un altro SVG (il fronte della busta): un <foreignObject> contaminerebbe la
 * tela nell'export, e i cerchi inline no.
 */

import type { CSSProperties } from 'react'
import { DOTFIELD_DEFAULTS } from './paths'

export type DotFieldDirection = 'up' | 'down' | 'left' | 'right'

export interface DotFieldGeometry {
  rows?: number
  cols?: number
  direction?: DotFieldDirection
  opacity?: readonly [number, number]
  radius?: readonly [number, number]
  stagger?: boolean
}

export interface DotFieldProps extends DotFieldGeometry {
  color?: string
  /** Riempie il contenitore deformando la griglia. Utile nelle bande. */
  stretch?: boolean
  className?: string
  style?: CSSProperties
}

/** Il lato di una cella, in unita' di viewBox. */
export const DOTFIELD_CELL = 20

export interface Dot {
  cx: number
  cy: number
  r: number
  o: number
}

/** I punti del pattern, in unita' di viewBox (cols x rows celle da 20). */
export function dotFieldPoints({
  rows = DOTFIELD_DEFAULTS.rows,
  cols = DOTFIELD_DEFAULTS.cols,
  direction = 'up',
  opacity = DOTFIELD_DEFAULTS.opacity,
  radius = DOTFIELD_DEFAULTS.radius,
  stagger = DOTFIELD_DEFAULTS.stagger,
}: DotFieldGeometry = {}): { width: number; height: number; dots: Dot[] } {
  const width = cols * DOTFIELD_CELL
  const height = rows * DOTFIELD_CELL
  const dots: Dot[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = stagger && row % 2 === 1 ? DOTFIELD_CELL / 2 : 0
      const cx = col * DOTFIELD_CELL + DOTFIELD_CELL / 2 + offset
      const cy = row * DOTFIELD_CELL + DOTFIELD_CELL / 2
      if (cx > width) continue

      // 0 all'inizio della direzione, 1 alla fine.
      const t =
        direction === 'down' ? row / Math.max(1, rows - 1)
        : direction === 'up' ? 1 - row / Math.max(1, rows - 1)
        : direction === 'right' ? col / Math.max(1, cols - 1)
        : 1 - col / Math.max(1, cols - 1)

      dots.push({
        cx,
        cy,
        r: radius[0] + (radius[1] - radius[0]) * t,
        o: opacity[0] + (opacity[1] - opacity[0]) * t,
      })
    }
  }

  return { width, height, dots }
}

export function DotField({
  rows, cols, direction, opacity, radius, stagger,
  color = DOTFIELD_DEFAULTS.color,
  stretch = false,
  className,
  style,
}: DotFieldProps) {
  const { width, height, dots } = dotFieldPoints({ rows, cols, direction, opacity, radius, stagger })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} opacity={d.o} />
      ))}
    </svg>
  )
}

/**
 * Lo stesso pattern come <g> da mettere dentro un altro SVG, scalato in un
 * riquadro dato. Per il fronte della busta.
 */
export function DotFieldGroup({
  x, y, width, height, color = DOTFIELD_DEFAULTS.color, ...geometry
}: DotFieldGeometry & { x: number; y: number; width: number; height: number; color?: string }) {
  const field = dotFieldPoints(geometry)
  const sx = width / field.width
  const sy = height / field.height
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`} aria-hidden="true">
      {field.dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} opacity={d.o} />
      ))}
    </g>
  )
}

export default DotField
