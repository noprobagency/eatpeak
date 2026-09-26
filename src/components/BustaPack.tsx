/**
 * <BustaPack /> — il fronte della busta da 30 stick, piatto.
 *
 * QUANDO USARLO: hero, card gusto, pagina prototipi, esportazione per il
 * designer. E' il fronte parametrico: legge il gusto da FLAVORS e le
 * proporzioni dai token `pack.*`.
 * QUANDO NO: come foto del prodotto in vendita. Un disegno al posto di una
 * fotografia sul PDP e' un problema di fiducia, non di stile. E non e' la
 * fustella: quella arriva dal laboratorio, e questo componente e' provvisorio.
 *
 * La gerarchia del fronte, dall'alto:
 *   1. wordmark bianco, 82% della larghezza, a sinistra
 *   2. descrittore "creatina + glicina + vitamina D3"
 *   3. nome gusto in corsivo
 *   4. blocco numero: "3 g" grande + "DI CREATINA AL GIORNO · 30 STICK"
 *   5. pattern a pallini nel terzo inferiore, sotto il blocco numero
 *   6. piede in mono: formula e vegan; lotto e numero di serie
 *
 * Sul pack il testo piccolo e' bianco: e' stampa, non interfaccia, e la
 * leggibilita' si verifica sulla prova colore. Sul web vale la regola del
 * tint. Vedi docs/08-packaging.md.
 */

import { useId } from 'react'
import { DotFieldGroup, useWordmark } from '../brand'
import { cn } from '../lib/cn'
import { PRODUCT, flavorById, flavorLabel, serialLabel, type FlavorId } from '../lib/copy'
import { packTokens } from '../tokens/tokens'
import { PackFruit } from './pack/Fruit'

export interface BustaPackProps {
  flavor: FlavorId
  /**
   * `gusto`: campo colore pieno, frutta sovradimensionata, wordmark bianco,
   * retino. `neutro`: la busta senza aroma, fondo bianco, wordmark arancia
   * 600, niente frutta e niente retino.
   */
  variant?: 'gusto' | 'neutro'
  /** La frutta stilizzata dietro e sopra il wordmark (stile Cure). */
  fruit?: boolean
  /** Il lotto stampato nel piede. */
  lot?: string
  /** Il numero di serie, stampato in variabile nel lotto 01. */
  serial?: number
  /** Proporzione larghezza:altezza. Default 2:3, segnaposto della fustella. */
  ratio?: number
  /** Larghezza resa in px. L'altezza segue il ratio. */
  width?: number
  /** Disegna i margini di sicurezza e la banda di saldatura, per lo Showcase. */
  showGuides?: boolean
  /**
   * Dichiara i font dentro l'SVG: serve quando il file esce dal sito
   * (export). Nella pagina le variabili CSS ci sono gia'.
   */
  standalone?: boolean
  title?: string
  className?: string
  /** Forza un candidato del laboratorio font (solo per #/lab/font e #/lab/pack). */
  fontId?: string
}

/** Il viewBox nominale: 400 di larghezza, l'altezza segue il ratio. */
const W = 400

export function BustaPack({
  flavor,
  variant = 'gusto',
  fruit = true,
  lot = PRODUCT.launchLot,
  serial = 137,
  ratio = 2 / 3,
  width = 320,
  showGuides = false,
  standalone = false,
  title,
  className,
  fontId,
}: BustaPackProps) {
  const f = flavorById(flavor)
  const wordmark = useWordmark(fontId)
  const clipId = `busta-${useId().replace(/:/g, '')}`
  const neutro = variant === 'neutro'
  const H = Math.round(W / ratio)
  const height = Math.round(width / ratio)
  const ink = neutro ? '#C24926' : '#FFFFFF'
  const text = neutro ? '#3A2A22' : '#FFFFFF'

  const safe = Math.round(Math.min(W, H) * packTokens.safe)
  const seal = Math.round(H * packTokens.sealBand)
  const wordmarkW = Math.round(W * packTokens.wordmarkWidth)
  const wordmarkH = (wordmarkW * wordmark.viewBox.height) / wordmark.viewBox.width
  const scale = wordmarkW / wordmark.viewBox.width

  // La gerarchia, in unita' di viewBox. Le distanze sono proporzionali all'altezza.
  const y = {
    wordmark: seal + H * 0.12,
    descriptor: seal + H * 0.12 + wordmarkH + H * 0.045,
    flavor: seal + H * 0.12 + wordmarkH + H * 0.12,
    dose: H * 0.65,
    doseCaption: H * 0.69,
    dotsTop: H * 0.715,
    dotsBottom: H * 0.86,
    footer1: H - safe - 18,
    footer2: H - safe,
  }

  const label = title ?? (neutro ? 'Busta peak Neutro, senza aroma, fronte' : `Busta peak ${flavorLabel(f)}, fronte`)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      className={cn('shrink-0', className)}
      role="img"
      aria-label={label}
      data-flavor={neutro ? 'neutro' : f.id}
      data-variant={variant}
    >
      <title>{label}</title>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={W} height={H} rx="22" />
        </clipPath>
      </defs>
      {standalone && (
        <style>{`text{font-family:Inter,system-ui,sans-serif}.mono{font-family:'DM Mono',ui-monospace,monospace}.display{font-family:Gabarito,system-ui,sans-serif}.accent{font-family:Fraunces,Georgia,serif;font-style:italic}`}</style>
      )}

      {/* Il campo: colore-gusto pieno, o bianco per il Neutro. */}
      <rect x="0" y="0" width={W} height={H} rx="22" fill={neutro ? '#FFFFFF' : f.hex} stroke={neutro ? '#E8E5E0' : undefined} />

      {/* La banda di saldatura, bianco al 14% (carta sul Neutro). */}
      <path d={`M0 22 a22 22 0 0 1 22 -22 h${W - 44} a22 22 0 0 1 22 22 v${seal - 22} h-${W} z`} fill={neutro ? '#FAF7F2' : '#FFFFFF'} opacity={neutro ? 1 : 0.14} />

      {/* La frutta sovradimensionata, tagliata dai bordi: dietro il wordmark. */}
      {!neutro && fruit && (
        <g clipPath={`url(#${clipId})`} opacity="0.96">
          <PackFruit flavor={f.id} H={H} />
        </g>
      )}

      {/* Il pattern, nel terzo inferiore, sotto il blocco numero. Cerchi inline: niente foreignObject, cosi' l'export non si contamina. */}
      {!neutro && <DotFieldGroup x={safe} y={y.dotsTop} width={W - safe * 2} height={y.dotsBottom - y.dotsTop} rows={4} cols={12} direction="right" />}

      {/* 1. Il wordmark, 82% della larghezza, a sinistra: bianco, o arancia 600 sul Neutro. */}
      <g transform={`translate(${safe} ${y.wordmark}) scale(${scale})`}>
        <path d={wordmark.path} fill={ink} />
      </g>

      {/* 2. Il descrittore. */}
      <text x={safe} y={y.descriptor} fill={text} fontFamily={standalone ? undefined : 'var(--font-text)'} fontWeight="500" fontSize="15">
        {PRODUCT.descriptor}
      </text>

      {/* 3. Il nome del gusto, in corsivo. */}
      <text
        x={safe}
        y={y.flavor}
        fill={text}
        className={standalone ? 'accent' : undefined}
        fontFamily={standalone ? undefined : 'var(--font-accent)'}
        fontStyle="italic"
        fontWeight="500"
        fontSize="26"
      >
        {neutro ? 'Neutro · senza aroma' : flavorLabel(f)}
      </text>

      {/* 4. Il blocco numero. */}
      <text
        x={safe}
        y={y.dose}
        fill={ink}
        className={standalone ? 'display' : undefined}
        fontFamily={standalone ? undefined : 'var(--font-display)'}
        fontWeight="900"
        fontSize="54"
        letterSpacing="-2"
      >
        {PRODUCT.dose} {PRODUCT.doseUnit}
      </text>
      <text
        x={safe}
        y={y.doseCaption}
        fill={text}
        className={standalone ? 'mono' : undefined}
        fontFamily={standalone ? undefined : 'var(--font-mono)'}
        fontWeight="500"
        fontSize="10.5"
        letterSpacing="1.6"
      >
        DI CREATINA AL GIORNO · {PRODUCT.sticksPerBag} STICK
      </text>

      {/* 6. Il piede. */}
      <text x={safe} y={y.footer1} fill={text} className={standalone ? 'mono' : undefined} fontFamily={standalone ? undefined : 'var(--font-mono)'} fontWeight="500" fontSize="9.5" letterSpacing="1.4">
        {PRODUCT.formulaLine.toUpperCase()} · VEGAN
      </text>
      <text x={safe} y={y.footer2} fill={text} className={standalone ? 'mono' : undefined} fontFamily={standalone ? undefined : 'var(--font-mono)'} fontWeight="500" fontSize="9.5" letterSpacing="1.4">
        LOTTO {lot} · {serialLabel(serial)}
      </text>

      {showGuides && (
        <g fill="none" stroke={neutro ? '#C24926' : '#FFFFFF'} strokeDasharray="4 4" strokeWidth="1" opacity="0.7">
          <rect x={safe} y={safe} width={W - safe * 2} height={H - safe * 2} />
          <line x1="0" y1={seal} x2={W} y2={seal} />
          <line x1={safe} y1={y.dotsTop} x2={W - safe} y2={y.dotsTop} />
        </g>
      )}
    </svg>
  )
}

export default BustaPack
