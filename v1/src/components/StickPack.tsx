/**
 * <StickPack /> — lo stickpack disegnato.
 *
 * QUANDO USARLO: mockup, hero, griglie di gusti, ovunque serva il prodotto
 * senza una fotografia.
 * QUANDO NO: nella galleria della pagina prodotto, dove serve la foto vera. Un
 * disegno al posto di una foto sul prodotto in vendita e' un problema di
 * fiducia, non di stile.
 *
 * La banda colore e' parametrica: cambiando `band` si ottiene la variante di
 * gusto senza toccare il disegno.
 */

import { BOLT_UP } from '../brand/paths'
import { cn } from '../lib/cn'
import { contrastRatio } from '../lib/contrast'

export interface StickPackProps {
  /** Colore della banda inferiore. Identifica la variante. */
  band?: string
  /** Colore del corpo dello stick. */
  body?: string
  /** Colore del marchio e del testo stampati sopra. */
  ink?: string
  /** La riga in mono stampata sulla banda colore. */
  label?: string
  /**
   * Colore del testo sulla banda. Se omesso, il componente sceglie fra `ink` e
   * `body` quello che si legge meglio sulla banda: miele su terracotta sta
   * sotto 2:1, ed e' proprio la combinazione che il sistema vieta nel testo.
   */
  bandInk?: string
  height?: number
  className?: string
  title?: string
}

export function StickPack({
  band = '#E9724C',
  body = '#FCD589',
  ink = '#47190E',
  label = '3 G',
  bandInk,
  height = 320,
  className,
  title = 'Stickpack di creatina monoidrato',
}: StickPackProps) {
  const width = height * (100 / 300)

  const inkOnBand =
    bandInk ??
    (contrastRatio(band, ink) >= contrastRatio(band, body) ? ink : body)

  return (
    <svg
      viewBox="0 0 100 300"
      width={width}
      height={height}
      className={cn('drop-shadow-none', className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>

      {/* Corpo dello stick */}
      <rect x="8" y="12" width="84" height="276" rx="6" fill={body} />

      {/* Saldature sopra e sotto: la zigrinatura e' la firma del formato */}
      <g fill={body} opacity="0.55">
        <rect x="8" y="4" width="84" height="12" rx="2" />
        <rect x="8" y="284" width="84" height="12" rx="2" />
      </g>
      <g stroke={ink} strokeWidth="1" opacity="0.25">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`t${i}`} x1={12 + i * 7.6} y1="5" x2={12 + i * 7.6} y2="15" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`b${i}`} x1={12 + i * 7.6} y1="285" x2={12 + i * 7.6} y2="295" />
        ))}
      </g>

      {/* Banda colore: il parametro di variante */}
      <path d="M8 214 h84 v68 a6 6 0 0 1 -6 6 h-72 a6 6 0 0 1 -6 -6 z" fill={band} />

      {/* Il simbolo */}
      <g transform="translate(28 66) scale(0.44)">
        <path d={BOLT_UP} fill={ink} />
      </g>

      {/* Il nome, in verticale come su uno stick vero */}
      <text
        x="50"
        y="180"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="26"
        letterSpacing="-1"
        fill={ink}
      >
        peak
      </text>

      <text
        x="50"
        y="252"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="1.6"
        fill={inkOnBand}
      >
        {label}
      </text>
    </svg>
  )
}

export default StickPack
