/**
 * <SymbolRise /> — la salita: il simbolo che sale e il wordmark che compare (3.1).
 *
 * A riposo i quattro punti stanno a montagna. Al passaggio (o arrivando con la
 * tastiera sul link che lo contiene) passano a una diagonale a 36 gradi, dal
 * piu' piccolo al piu' grande, uno dopo l'altro (0 / 60 / 120 / 190 ms, 520 ms
 * con un piccolo rimbalzo), e poi compare il wordmark. All'uscita si torna alla
 * montagna senza ritardi. Mai in loop.
 *
 * Su touch non c'e' passaggio: la salita parte una volta al caricamento e si
 * ripete al tap. Con prefers-reduced-motion i punti non si muovono e compare
 * solo il wordmark.
 *
 * Tutto e' in em: la misura la da' il font-size del contenitore (il wordmark e'
 * alto circa 0,87em, il simbolo a riposo 0,86em). I punti sono span posizionati
 * con left/bottom: la transizione e' su quelli e sulle misure del contenitore,
 * che si allarga e si alza insieme ai punti. Geometria in paths.ts
 * (SYMBOL_GEOMETRY), movimento in SALITA_MOTION, stile in salita.css.
 *
 * QUANDO USARLO: l'header. QUANDO NO: dove il marchio sta fermo; li' c'e'
 * <Lockup />.
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { LOGO_VARIANTS, SALITA_MOTION, SYMBOL_COLORS, SYMBOL_EM_PER_UNIT, SYMBOL_GEOMETRY, useWordmark } from './paths'
import { cn } from '../lib/cn'
import './salita.css'

export interface SymbolRiseProps {
  /** Colore dei punti. Default: ambra 700, su chiaro. Cacao su ambra, bianco sugli altri fondi colore. */
  symbolColor?: string
  /** Colore del wordmark. Default: ambra, su chiaro. Bianco su ogni fondo colore. */
  wordmarkColor?: string
  className?: string
  style?: CSSProperties
}

const em = (units: number) => `${+(units * SYMBOL_EM_PER_UNIT).toFixed(4)}em`

/** Per ogni punto: posizione a riposo e in salita, in em dal basso a sinistra. */
function dotVars(i: number): CSSProperties {
  const rest = SYMBOL_GEOMETRY.montagna
  const up = SYMBOL_GEOMETRY.salita
  const [cx0, cy0, r] = rest.dots[i]
  const [cx1, cy1] = up.dots[i]
  return {
    '--s': em(r * 2),
    '--l0': em(cx0 - r),
    '--b0': em(rest.height - cy0 - r),
    '--l1': em(cx1 - r),
    '--b1': em(up.height - cy1 - r),
    '--d': `${SALITA_MOTION.delaysMs[i]}ms`,
  } as CSSProperties
}

const MARK_VARS = {
  '--w0': em(SYMBOL_GEOMETRY.montagna.width),
  '--h0': em(SYMBOL_GEOMETRY.montagna.height),
  '--w1': em(SYMBOL_GEOMETRY.salita.width),
  '--h1': em(SYMBOL_GEOMETRY.salita.height),
  '--salita-ms': `${SALITA_MOTION.durationMs}ms`,
  '--salita-ease': SALITA_MOTION.easing,
  '--word-ms': `${SALITA_MOTION.wordmarkMs}ms`,
  // Il wordmark parte quando parte l'ultimo punto.
  '--word-delay': `${SALITA_MOTION.delaysMs[SALITA_MOTION.delaysMs.length - 1]}ms`,
  '--word-max': `${SALITA_MOTION.wordmarkMaxEm}em`,
  '--gap': `${SALITA_MOTION.gapEm}em`,
} as CSSProperties

function isTouch() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
}

export function SymbolRise({
  symbolColor = SYMBOL_COLORS.onLight,
  wordmarkColor = LOGO_VARIANTS.ambra.fill,
  className,
  style,
}: SymbolRiseProps) {
  const wordmark = useWordmark()
  const [risen, setRisen] = useState(false)
  const timer = useRef<number>()

  // Su touch la salita parte una volta, poco dopo il caricamento.
  useEffect(() => {
    if (!isTouch()) return
    timer.current = window.setTimeout(() => setRisen(true), 350)
    return () => window.clearTimeout(timer.current)
  }, [])

  // ...e si ripete al tap: giu' alla montagna, poi di nuovo su.
  function onTap() {
    if (!isTouch()) return
    window.clearTimeout(timer.current)
    setRisen(false)
    timer.current = window.setTimeout(() => setRisen(true), 280)
  }

  return (
    <span
      className={cn('peak-rise', className)}
      data-risen={risen || undefined}
      style={{ ...MARK_VARS, ...style }}
      onClick={onTap}
      aria-hidden="true"
    >
      <span className="peak-rise__mark" style={{ color: symbolColor }}>
        {SYMBOL_GEOMETRY.montagna.dots.map((_, i) => (
          <span key={i} className="peak-rise__dot" style={dotVars(i)} />
        ))}
      </span>
      <span className="peak-rise__word">
        <svg
          viewBox={`0 0 ${wordmark.viewBox.width} ${wordmark.viewBox.height}`}
          style={{ width: `${wordmark.viewBox.width / 100}em`, height: `${wordmark.viewBox.height / 100}em` }}
          focusable="false"
          data-font={wordmark.fontId}
        >
          <path d={wordmark.path} fill={wordmarkColor} />
        </svg>
      </span>
    </span>
  )
}

export default SymbolRise
