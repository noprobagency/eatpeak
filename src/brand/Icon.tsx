/**
 * <Icon /> — il vertice di peak.
 *
 * Tre cerchi pieni e uguali disposti a triangolo: uno sopra, due sotto. E' il
 * picco senza disegnare una montagna, i 3 ingredienti, i 3 grammi, e un segno
 * a "particella" che porta il lato scientifico del brand.
 *
 * QUANDO USARLO: favicon, app icon, avatar social, sigillo sullo stick, lockup,
 * e come seme del pattern <DotField />.
 * QUANDO NO: come icona funzionale dentro l'interfaccia. Il vertice e' il
 * marchio; se ti serve un pittogramma per "tre" o "ingredienti", disegnane un
 * altro — riusare il marchio come icona lo svaluta.
 *
 * Sotto i 24px resi i punti passano a r=13: a 12 si fondono.
 */

import type { CSSProperties } from 'react'
import {
  DEFAULT_ICON_VARIANT,
  ICON_VARIANTS,
  ICON_VIEWBOX,
  VERTEX,
  VERTEX_SMALL_BELOW_PX,
  cornerRadiusFor,
  flavorHex,
  type IconVariant,
} from './paths'
import type { FlavorId } from '../lib/copy'

export interface IconProps {
  /** Lato reso in px. Governa la clamp del raggio e la misura dei punti. */
  size?: number
  variant?: IconVariant
  /** Per la variante `free`: il colore dei punti. Un gusto, o inchiostro. */
  color?: FlavorId | 'ink' | 'white'
  /** Testo alternativo. Se vuoto l'icona diventa decorativa (aria-hidden). */
  title?: string
  className?: string
  style?: CSSProperties
}

const FREE_COLORS: Record<'ink' | 'white', string> = { ink: '#1B1A18', white: '#FFFFFF' }

export function Icon({
  size = 64,
  variant = DEFAULT_ICON_VARIANT,
  color = 'arancia',
  title = 'peak',
  className,
  style,
}: IconProps) {
  const spec = ICON_VARIANTS[variant]
  const contained = spec.background !== null
  const geometry = contained ? (size < VERTEX_SMALL_BELOW_PX ? VERTEX.small : VERTEX.contained) : VERTEX.free
  const radius = cornerRadiusFor(size)
  const decorative = title.trim() === ''

  const dots =
    spec.dots === 'flavor'
      ? color === 'ink' || color === 'white'
        ? FREE_COLORS[color]
        : flavorHex(color)
      : spec.dots

  return (
    <svg
      viewBox={ICON_VIEWBOX}
      width={size}
      height={size}
      className={className}
      style={style}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      data-variant={variant}
    >
      {!decorative && <title>{title}</title>}

      {spec.background && <rect x={2} y={2} width={96} height={96} rx={radius} fill={spec.background} />}

      {geometry.points.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={geometry.r} fill={dots} />
      ))}
    </svg>
  )
}

export default Icon
