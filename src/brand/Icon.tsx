/**
 * <Icon /> — la saetta di peak, dentro il suo contenitore.
 *
 * QUANDO USARLO: favicon, app icon, avatar social, bollini, lockup, e ovunque
 * serva il marchio in uno spazio quadrato.
 * QUANDO NO: come icona funzionale dentro l'interfaccia. La saetta e' il
 * marchio; se ti serve un'icona che significhi "energia" o "veloce", disegnane
 * un'altra — riusare il marchio come pittogramma lo svaluta.
 *
 * Il contorno esiste solo sopra i 48px. Sotto, il filo scuro si mangia la
 * saetta: il componente lo toglie da solo, non serve ricordarselo.
 */

import type { CSSProperties } from 'react'
import {
  BOLT_PATHS,
  DEFAULT_ICON_VARIANT,
  ICON_OUTLINE_MIN_PX,
  ICON_VARIANTS,
  ICON_VIEWBOX,
  cornerRadiusFor,
  type IconVariant,
  type IconVariantSpec,
} from './paths'

export interface IconProps {
  /** Lato reso in px. Governa la clamp del contorno e del raggio. */
  size?: number
  variant?: IconVariant
  /**
   * Forza il contorno anche sotto i 48px. Esiste solo per la pagina Showcase,
   * che deve poter mostrare il difetto. Non usarla in produzione.
   */
  forceOutline?: boolean
  /** Testo alternativo. Se vuoto l'icona diventa decorativa (aria-hidden). */
  title?: string
  className?: string
  style?: CSSProperties
}

export function Icon({
  size = 64,
  variant = DEFAULT_ICON_VARIANT,
  forceOutline = false,
  title = 'peak',
  className,
  style,
}: IconProps) {
  const spec: IconVariantSpec = ICON_VARIANTS[variant]
  const showOutline = Boolean(spec.outline) && (forceOutline || size >= ICON_OUTLINE_MIN_PX)
  const radius = cornerRadiusFor(size)
  const decorative = title.trim() === ''

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
    >
      {!decorative && <title>{title}</title>}

      {spec.background &&
        (spec.shape === 'circle' ? (
          <circle cx={50} cy={50} r={48} fill={spec.background} />
        ) : (
          <rect x={2} y={2} width={96} height={96} rx={radius} fill={spec.background} />
        ))}

      <path
        d={BOLT_PATHS[spec.path]}
        fill={spec.bolt}
        stroke={showOutline ? spec.outline! : undefined}
        strokeWidth={showOutline ? (spec.outlineWidth ?? 5) : undefined}
        paintOrder={showOutline ? 'stroke' : undefined}
        strokeLinejoin={showOutline ? 'round' : undefined}
      />
    </svg>
  )
}

export default Icon
