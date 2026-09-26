/**
 * <Logo /> — il wordmark "peak" (2.0).
 *
 * QUANDO USARLO: header, footer, packaging, creativita', ovunque serva il nome
 * del brand come segno.
 * QUANDO NO: dentro un titolo di testo corrente. Il wordmark non e' una parola,
 * e' un'immagine — se stai scrivendo una frase, scrivi "peak" in tondo.
 *
 * E' un tracciato, non un testo: si vede uguale ovunque, senza font. Un solo
 * colore, pieno, senza contorno. Tre varianti: bianco (primaria, su ogni campo
 * colore-gusto e su inchiostro), inchiostro (su bianco e carta), colore-gusto
 * (raro, solo su chiaro e solo sopra i 48px di altezza).
 *
 * `background` sceglie la variante da solo: flavor/dark -> bianco, light ->
 * inchiostro. Vedi docs/03-logo.md.
 */

import type { CSSProperties } from 'react'
import {
  DEFAULT_LOGO_VARIANT,
  FLAVOR_VARIANT_MIN_HEIGHT_PX,
  LOGO_VARIANTS,
  WORDMARK_MIN_WIDTH_PX,
  WORDMARK_PATH,
  WORDMARK_VIEWBOX,
  flavorHex,
  wordmarkHeightFor,
  type LogoVariant,
} from './paths'
import type { FlavorId } from '../lib/copy'

export interface LogoProps {
  /** Larghezza resa in px. L'altezza segue il tracciato. */
  size?: number
  variant?: LogoVariant
  /** Il gusto, per la variante `flavor`. Ignorato dalle altre. */
  flavor?: FlavorId
  /**
   * Il fondo su cui il logo verra' posato. Non disegna nulla: serve al
   * componente per scegliere la variante giusta quando `variant` e' omessa,
   * e per avvisare in sviluppo se la combinazione e' illeggibile.
   */
  background?: 'light' | 'flavor' | 'dark'
  /**
   * Come sta nel suo contenitore. Il viewBox e' stretto sull'inchiostro,
   * quindi `left` e' il comportamento naturale; `center` lo centra come blocco.
   */
  align?: 'left' | 'center'
  /** Testo alternativo. Se vuoto il logo diventa decorativo (aria-hidden). */
  title?: string
  className?: string
  style?: CSSProperties
}

/** Per ogni fondo, la variante che ci si legge sopra. */
const VARIANT_FOR_BACKGROUND: Record<NonNullable<LogoProps['background']>, LogoVariant> = {
  light: 'ink',
  flavor: 'white',
  dark: 'white',
}

export function Logo({
  size = 160,
  variant,
  flavor = 'arancia',
  background,
  align = 'left',
  title = 'peak',
  className,
  style,
}: LogoProps) {
  const resolvedVariant: LogoVariant =
    variant ?? (background ? VARIANT_FOR_BACKGROUND[background] : DEFAULT_LOGO_VARIANT)
  const spec = LOGO_VARIANTS[resolvedVariant]
  const fill = spec.fill === 'flavor' ? flavorHex(flavor) : spec.fill

  const height = wordmarkHeightFor(size)
  const decorative = title.trim() === ''

  if (import.meta.env.DEV) {
    if (size < WORDMARK_MIN_WIDTH_PX) {
      console.warn(`[peak/Logo] ${size}px e sotto la misura minima di ${WORDMARK_MIN_WIDTH_PX}px di larghezza.`)
    }
    if (resolvedVariant === 'flavor' && height < FLAVOR_VARIANT_MIN_HEIGHT_PX) {
      console.warn(
        `[peak/Logo] La variante "flavor" non si usa sotto i ${FLAVOR_VARIANT_MIN_HEIGHT_PX}px di altezza (qui ${Math.round(height)}px). Usa "ink".`,
      )
    }
    if (resolvedVariant === 'white' && background === 'light') {
      console.warn('[peak/Logo] Logo bianco su fondo chiaro: non si legge. Usa "ink".')
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
      width={size}
      height={height}
      className={className}
      style={align === 'center' ? { display: 'block', marginInline: 'auto', ...style } : style}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      data-variant={resolvedVariant}
    >
      {!decorative && <title>{title}</title>}
      <path d={WORDMARK_PATH} fill={fill} />
    </svg>
  )
}

export default Logo
