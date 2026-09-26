/**
 * <StickPack /> — lo stick monodose disegnato.
 *
 * QUANDO USARLO: mockup, hero, card gusto, ovunque serva il prodotto senza
 * una fotografia.
 * QUANDO NO: nella galleria della pagina prodotto, dove serve la foto vera. Un
 * disegno al posto di una foto sul prodotto in vendita e' un problema di
 * fiducia, non di stile.
 *
 * Nella 2.0 lo stick e' tutto nel colore del gusto: la "banda parametrica"
 * della 1.0 e' diventata l'intero stick. Sopra: il wordmark bianco ruotato di
 * 90 gradi lungo la lunghezza, verso il lato di strappo "3 g" e il nome corto
 * del gusto in corsivo, e il vertice libero bianco come sigillo.
 */

import { VERTEX, useWordmark } from '../brand'
import { cn } from '../lib/cn'
import { PRODUCT, flavorById, type FlavorId } from '../lib/copy'

export interface StickPackProps {
  flavor?: FlavorId
  height?: number
  /** Dichiara i font dentro l'SVG, per l'export. */
  standalone?: boolean
  className?: string
  title?: string
  /** Forza un candidato del laboratorio font. */
  fontId?: string
}

/** ViewBox 1:5. */
const W = 100
const H = 500

export function StickPack({
  flavor = 'arancia',
  height = 320,
  standalone = false,
  className,
  title,
  fontId,
}: StickPackProps) {
  const f = flavorById(flavor)
  const wordmark = useWordmark(fontId)
  const width = height * (W / H)
  const label = title ?? `Stick peak ${f.number} ${f.shortName}`

  // Il wordmark corre lungo la lunghezza: la sua altezza e' l'80% della
  // larghezza dello stick, e la larghezza ne consegue.
  const wordmarkH = W * 0.8
  const wordmarkW = (wordmarkH * wordmark.viewBox.width) / wordmark.viewBox.height
  const scale = wordmarkH / wordmark.viewBox.height
  const wordmarkTop = 56

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      className={cn('shrink-0', className)}
      role="img"
      aria-label={label}
      data-flavor={f.id}
    >
      <title>{label}</title>
      {standalone && (
        <style>{`.mono{font-family:'DM Mono',ui-monospace,monospace}.display{font-family:Gabarito,system-ui,sans-serif}.accent{font-family:Fraunces,Georgia,serif;font-style:italic}`}</style>
      )}

      {/* Il corpo, tutto nel colore del gusto. */}
      <rect x="6" y="10" width="88" height="480" rx="8" fill={f.hex} />

      {/* Le saldature: la zigrinatura e' la firma del formato. */}
      <g fill="#FFFFFF" opacity="0.18">
        <rect x="6" y="10" width="88" height="14" rx="4" />
        <rect x="6" y="476" width="88" height="14" rx="4" />
      </g>
      <g stroke="#FFFFFF" strokeWidth="1" opacity="0.35">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`t${i}`} x1={11 + i * 7.8} y1="12" x2={11 + i * 7.8} y2="22" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`b${i}`} x1={11 + i * 7.8} y1="478" x2={11 + i * 7.8} y2="488" />
        ))}
      </g>
      {/* La tacca di strappo. */}
      <path d="M2 30 l6 4 l-6 4 z" fill="#FFFFFF" opacity="0.8" />

      {/* Il wordmark bianco, ruotato di 90 gradi, lungo la lunghezza. */}
      <g transform={`translate(${(W + wordmarkH) / 2} ${wordmarkTop}) rotate(90) scale(${scale})`}>
        <path d={wordmark.path} fill="#FFFFFF" />
      </g>

      {/* Verso il lato di strappo: 3 g e il nome corto del gusto. */}
      <text
        x={W / 2}
        y={wordmarkTop + wordmarkW + 78}
        textAnchor="middle"
        fill="#FFFFFF"
        className={standalone ? 'display' : undefined}
        fontFamily={standalone ? undefined : 'var(--font-display)'}
        fontWeight="900"
        fontSize="30"
        letterSpacing="-1"
      >
        {PRODUCT.dose} {PRODUCT.doseUnit}
      </text>
      <text
        x={W / 2}
        y={wordmarkTop + wordmarkW + 104}
        textAnchor="middle"
        fill="#FFFFFF"
        className={standalone ? 'accent' : undefined}
        fontFamily={standalone ? undefined : 'var(--font-accent)'}
        fontStyle="italic"
        fontWeight="500"
        fontSize="10.5"
      >
        {f.shortName}
      </text>

      {/* Il vertice libero bianco: il sigillo. */}
      <g transform={`translate(${W / 2 - 14} 418) scale(0.28)`}>
        {VERTEX.free.points.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={VERTEX.free.r} fill="#FFFFFF" />
        ))}
      </g>
    </svg>
  )
}

export default StickPack
