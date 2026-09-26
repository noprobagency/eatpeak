/**
 * <Icon /> — il simbolo di peak.
 *
 * Dalla 3.1 sono quattro punti pieni, un solo colore, diametri 0,64 · 0,76 ·
 * 0,88 · 1, a montagna (V7, dietro il flag SYMBOL_VARIANT). Libero, sta in
 * ambra 700 su chiaro, cacao su ambra, bianco sugli altri fondi colore; nel
 * contenitore (favicon, app icon) e' un quadrato ambra 400 con i punti cacao.
 * Le varianti a tre punti della 3.0 (V0-V6) restano in #/lab/simbolo.
 *
 * La salita animata dell'header e' <SymbolRise />, non questo componente.
 *
 * QUANDO USARLO: favicon, app icon, avatar social, sigillo sullo stick, lockup,
 * e come seme del pattern <DotField />.
 * QUANDO NO: come icona funzionale dentro l'interfaccia. Il simbolo e' il
 * marchio; per i giorni e gli stati c'e' <DayDot />, per il segno a mano
 * <HandDot />.
 *
 * Sotto i 24px resi i punti passano a r=13: a 12 si fondono.
 */

import type { CSSProperties } from 'react'
import {
  DEFAULT_ICON_VARIANT,
  ICON_VARIANTS,
  ICON_VIEWBOX,
  MIELE_HEX,
  MIELE_RING_HEX,
  SYMBOL_COLORS,
  SYMBOL_VARIANT,
  SYMBOL_VARIANTS,
  VERTEX_SMALL_BELOW_PX,
  cornerRadiusFor,
  flavorHex,
  symbolDots,
  type IconVariant,
  type SymbolVariantId,
} from './paths'
import type { FlavorId } from '../lib/copy'

export interface IconProps {
  /** Lato reso in px. Governa la clamp del raggio e la misura dei punti. */
  size?: number
  variant?: IconVariant
  /**
   * Per la variante `free`: il colore dei punti. `brand` (ambra 700, su
   * chiaro, il default), `cacao` (su ambra), `white` (sugli altri fondi
   * colore), o un gusto (solo nelle comunicazioni del gusto).
   */
  color?: FlavorId | 'brand' | 'cacao' | 'white'
  /** La geometria del simbolo. Default: SYMBOL_VARIANT. Solo il laboratorio la forza. */
  symbol?: SymbolVariantId
  /**
   * Il simbolo sta su un fondo chiaro: la punta miele, se c'e', porta un
   * anello arancia 700 perche' da sola non si vede (solo le varianti 3.0).
   */
  onLight?: boolean
  /** Testo alternativo. Se vuoto l'icona diventa decorativa (aria-hidden). */
  title?: string
  className?: string
  style?: CSSProperties
}

const FREE_COLORS: Record<'brand' | 'cacao' | 'white', string> = {
  brand: SYMBOL_COLORS.onLight,
  cacao: SYMBOL_COLORS.onBrand,
  white: SYMBOL_COLORS.onColor,
}

export function Icon({
  size = 64,
  variant = DEFAULT_ICON_VARIANT,
  color = 'brand',
  symbol = SYMBOL_VARIANT,
  onLight,
  title = 'peak',
  className,
  style,
}: IconProps) {
  const spec = ICON_VARIANTS[variant]
  const contained = spec.background !== null
  const geometry = contained ? (size < VERTEX_SMALL_BELOW_PX ? 'small' : 'contained') : 'free'
  const dots = symbolDots(symbol, geometry)
  const radius = cornerRadiusFor(size)
  const decorative = title.trim() === ''
  const light = onLight ?? (!contained && color !== 'white')

  const base =
    spec.dots === 'flavor'
      ? color === 'brand' || color === 'cacao' || color === 'white'
        ? FREE_COLORS[color]
        : flavorHex(color)
      : spec.dots

  const topMiele = SYMBOL_VARIANTS[symbol].topMiele

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
      data-symbol={symbol}
    >
      {!decorative && <title>{title}</title>}

      {spec.background && <rect x={0} y={0} width={100} height={100} rx={radius} fill={spec.background} />}

      {/* Dal basso alla vetta: e' l'ordine del respiro (H1). */}
      {[...dots].sort((a, b) => b.cy - a.cy).map((d, i) => {
        const miele = topMiele && d.top
        return (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={miele ? MIELE_HEX : base}
            opacity={d.ghost ? 0.2 : 1}
            stroke={miele && light ? MIELE_RING_HEX : undefined}
            strokeWidth={miele && light ? Math.max(2, d.r * 0.22) : undefined}
            data-top={d.top || undefined}
          />
        )
      })}
    </svg>
  )
}

export default Icon
