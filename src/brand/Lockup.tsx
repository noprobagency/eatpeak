/**
 * <Lockup /> — il simbolo e il wordmark insieme (3.1).
 *
 * QUANDO USARLO: firma delle creativita', fondo pagina, documenti, ogni punto
 * in cui il marchio si presenta per intero e sta fermo.
 * QUANDO NO: quando lo spazio e' stretto (meglio il solo <Logo />) e
 * nell'header, dove c'e' la salita animata (<SymbolRise />).
 *
 * La regola: il simbolo a quattro punti, a montagna, centrato in verticale
 * sulla scritta, con 0,3em di spazio. Tutto si misura sul corpo del wordmark
 * (`size`): la parola e' alta circa 0,87 volte il corpo, il simbolo a riposo
 * 0,86. I colori seguono il fondo:
 *
 * - `light` (bianco, carta): simbolo ambra 700, wordmark ambra;
 * - `brand` (ambra 400): simbolo cacao, wordmark bianco;
 * - `flavor` e `dark` (campi gusto, ambra 700, lime 700): tutto bianco.
 */

import type { CSSProperties } from 'react'
import { Icon } from './Icon'
import {
  LOCKUP_GAP_EM,
  LOGO_VARIANTS,
  SYMBOL_COLORS,
  SYMBOL_EM_PER_UNIT,
  SYMBOL_GEOMETRY,
  SYMBOL_VARIANT,
  useWordmark,
  wordmarkHeightFor,
  type SymbolVariantId,
} from './paths'

export interface LockupProps {
  /** Il corpo del wordmark, in px: la parola, il simbolo e lo spazio si misurano da qui. */
  size?: number
  orientation?: 'horizontal' | 'vertical'
  background?: 'light' | 'brand' | 'flavor' | 'dark'
  /** Disegna l'area di rispetto come padding reale attorno al blocco. */
  withClearspace?: boolean
  title?: string
  className?: string
  style?: CSSProperties
  /** Forza un candidato del laboratorio font (solo per #/lab/font). */
  fontId?: string
  /** Forza una variante del simbolo (solo per #/lab/simbolo). */
  symbol?: SymbolVariantId
}

const COLORS = {
  light: { symbol: 'onLight', wordmark: LOGO_VARIANTS.ambra.fill },
  brand: { symbol: 'onBrand', wordmark: LOGO_VARIANTS.white.fill },
  flavor: { symbol: 'onColor', wordmark: LOGO_VARIANTS.white.fill },
  dark: { symbol: 'onColor', wordmark: LOGO_VARIANTS.white.fill },
} as const

const ICON_COLOR = { onLight: 'brand', onBrand: 'cacao', onColor: 'white' } as const

export function Lockup({
  size = 64,
  orientation = 'horizontal',
  background = 'light',
  withClearspace = false,
  title = 'peak',
  className,
  style,
  fontId,
  symbol = SYMBOL_VARIANT,
}: LockupProps) {
  const wordmark = useWordmark(fontId)
  const colors = COLORS[background]
  const wordW = (wordmark.viewBox.width / 100) * size
  const wordH = wordmarkHeightFor(wordW, wordmark.viewBox)
  const mountain = SYMBOL_GEOMETRY.montagna
  const clearspace = withClearspace ? wordH * wordmark.clearspaceRatio : 0

  return (
    <div
      className={className}
      role="img"
      aria-label={title}
      style={{
        display: 'inline-flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        gap: `${LOCKUP_GAP_EM * size}px`,
        padding: clearspace ? `${clearspace}px` : undefined,
        ...style,
      }}
    >
      {symbol === 'v7' ? (
        // La montagna nel suo viewBox, senza margini: lo spazio resta 0,3em esatti.
        <svg
          viewBox={`0 0 ${mountain.width} ${mountain.height}`}
          width={mountain.width * SYMBOL_EM_PER_UNIT * size}
          height={mountain.height * SYMBOL_EM_PER_UNIT * size}
          aria-hidden="true"
          focusable="false"
          style={{ display: 'block', flexShrink: 0 }}
        >
          {mountain.dots.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={SYMBOL_COLORS[colors.symbol]} />
          ))}
        </svg>
      ) : (
        // Le varianti a tre punti della 3.0, per il laboratorio.
        <Icon size={wordH} variant="free" color={ICON_COLOR[colors.symbol]} symbol={symbol} title="" style={{ display: 'block' }} />
      )}
      <svg viewBox={`0 0 ${wordmark.viewBox.width} ${wordmark.viewBox.height}`} width={wordW} height={wordH} aria-hidden="true" focusable="false" style={{ display: 'block' }}>
        <path d={wordmark.path} fill={colors.wordmark} />
      </svg>
    </div>
  )
}

export default Lockup
