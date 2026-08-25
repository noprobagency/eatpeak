/**
 * <Logo /> — il wordmark "peak".
 *
 * QUANDO USARLO: header, footer, packaging, creativita', ovunque serva il nome
 * del brand come segno.
 * QUANDO NO: dentro un titolo di testo corrente. Il wordmark non e' una parola,
 * e' un'immagine — se stai scrivendo una frase, scrivi "peak" in tondo.
 *
 * La parola e' sempre minuscola e il tracking e' fisso: entrambi sono usi
 * vincolati, non preferenze. Vedi docs/03-logo.md.
 *
 * Il filo non scala col logo. Il componente sceglie da solo la versione di
 * spessore in base a `size`; `strokeSize` la forza solo se hai davvero un
 * motivo (es. un'esportazione per stampa).
 */

import type { CSSProperties } from 'react'
import {
  DEFAULT_LOGO_VARIANT,
  LOGO_VARIANTS,
  WORDMARK_BASELINE_Y,
  WORDMARK_FONT_SIZE,
  WORDMARK_LETTER_SPACING,
  WORDMARK_TEXT,
  WORDMARK_VIEWBOX,
  strokeSizeFor,
  strokeWidthFor,
  type LogoVariant,
  type LogoVariantSpec,
  type StrokeSize,
} from './paths'

export interface LogoProps {
  /** Larghezza resa in px. Determina anche la versione di filo. */
  size?: number
  variant?: LogoVariant
  /**
   * Il fondo su cui il logo verra' posato. Non disegna nulla: serve al
   * componente per scegliere la variante giusta quando `variant` e' omessa,
   * e per avvisare in dev se la combinazione e' illeggibile.
   */
  background?: 'light' | 'warm' | 'brand' | 'forest' | 'dark'
  /** Forza la versione di filo. Lasciala stare, a meno di esportazioni. */
  strokeSize?: StrokeSize
  /**
   * Dove sta la parola dentro il suo riquadro.
   *
   * Il viewBox del wordmark e' piu' largo dell'inchiostro, quindi con `center`
   * il marchio risulta rientrato rispetto al testo che gli sta sotto. Con
   * `left` il bordo esterno del filo cade esatto a x=0, e il logo si allinea
   * alla colonna come qualsiasi altro elemento.
   */
  align?: 'center' | 'left'
  /** Testo alternativo. Se vuoto il logo diventa decorativo (aria-hidden). */
  title?: string
  className?: string
  style?: CSSProperties
}

/** Per ogni fondo, la variante che ci si legge sopra. */
const VARIANT_FOR_BACKGROUND: Record<NonNullable<LogoProps['background']>, LogoVariant> = {
  light: 'honey-terracotta',
  warm: 'honey-terracotta',
  brand: 'honey-terracotta-deep',
  forest: 'honey-forest-deep',
  dark: 'honey-terracotta',
}

export function Logo({
  size = 160,
  variant,
  background = 'light',
  strokeSize,
  align = 'center',
  title = 'peak',
  className,
  style,
}: LogoProps) {
  const resolvedVariant = variant ?? VARIANT_FOR_BACKGROUND[background] ?? DEFAULT_LOGO_VARIANT
  const spec: LogoVariantSpec = LOGO_VARIANTS[resolvedVariant]

  const step = strokeSize ?? strokeSizeFor(size)
  const strokeWidth = spec.strokeWidth ?? strokeWidthFor(step)

  const height = (size * WORDMARK_VIEWBOX.height) / WORDMARK_VIEWBOX.width

  // Ancorata a sinistra l'origine del testo va a x=0: il filo esce di meta'
  // spessore verso sinistra e va a coprire quasi esattamente l'avvicinamento
  // sinistro della "p", cosi' il bordo visibile del marchio cade sulla colonna.
  // `overflow="visible"` garantisce che, con un font di ripiego dalle metriche
  // diverse, sbordi invece di perdere un pezzo di lettera.
  const left = align === 'left'
  const anchorX = left ? 0 : WORDMARK_VIEWBOX.width / 2
  const decorative = title.trim() === ''

  if (import.meta.env.DEV && resolvedVariant === 'outline-only' && size < 120) {
    console.warn(
      `[peak/Logo] La variante "outline-only" non regge sotto i 120px (size=${size}). ` +
        'Il filo da 2.4 sparisce. Usa "solid-terracotta" o "honey-terracotta".',
    )
  }

  return (
    <svg
      viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
      width={size}
      height={height}
      className={className}
      style={style}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      // Senza font Rund il fallback ha metriche diverse e potrebbe eccedere il
      // riquadro: meglio che sbordi, piuttosto che perdere una lettera.
      overflow="visible"
    >
      {!decorative && <title>{title}</title>}
      <text
        x={anchorX}
        y={WORDMARK_BASELINE_Y}
        textAnchor={left ? 'start' : 'middle'}
        fontFamily="var(--font-display)"
        fontWeight={900}
        fontSize={WORDMARK_FONT_SIZE}
        letterSpacing={WORDMARK_LETTER_SPACING}
        fill={spec.fill ?? 'none'}
        stroke={spec.stroke ?? undefined}
        strokeWidth={spec.stroke ? strokeWidth : undefined}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {WORDMARK_TEXT}
      </text>
    </svg>
  )
}

export default Logo
