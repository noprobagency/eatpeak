/**
 * <Lockup /> — vertice libero e wordmark insieme.
 *
 * QUANDO USARLO: firma delle creativita', fondo pagina, documenti, ogni punto
 * in cui il marchio si presenta per intero.
 * QUANDO NO: quando lo spazio e' stretto. Meglio il solo <Logo /> di un lockup
 * compresso. Nell'header del sito va il wordmark da solo.
 *
 * L'unica regola: lo spazio tra i due elementi e' pari alla meta' dell'altezza
 * del simbolo. Il componente la applica da solo. Su bianco e carta il lockup e'
 * wordmark inchiostro + vertice colore-gusto; su un campo colore o su
 * inchiostro e' tutto bianco.
 */

import type { CSSProperties } from 'react'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { CLEARSPACE_RATIO, LOCKUP_GAP_RATIO, LOCKUP_WORDMARK_TO_ICON, wordmarkHeightFor } from './paths'
import type { FlavorId } from '../lib/copy'

export interface LockupProps {
  /** Lato del vertice in px. Il wordmark e lo spazio si dimensionano da qui. */
  iconSize?: number
  orientation?: 'horizontal' | 'vertical'
  /**
   * `light`: wordmark inchiostro, vertice nel colore-gusto (default arancia).
   * `flavor` e `dark`: tutto bianco.
   */
  background?: 'light' | 'flavor' | 'dark'
  /** Il gusto del vertice su fondo chiaro. */
  flavor?: FlavorId
  /** Disegna l'area di rispetto come padding reale attorno al blocco. */
  withClearspace?: boolean
  title?: string
  className?: string
  style?: CSSProperties
}

export function Lockup({
  iconSize = 64,
  orientation = 'horizontal',
  background = 'light',
  flavor = 'arancia',
  withClearspace = false,
  title = 'peak',
  className,
  style,
}: LockupProps) {
  const gap = iconSize * LOCKUP_GAP_RATIO
  const logoWidth = iconSize * LOCKUP_WORDMARK_TO_ICON
  const clearspace = withClearspace ? wordmarkHeightFor(logoWidth) * CLEARSPACE_RATIO : 0
  const onLight = background === 'light'

  return (
    <div
      className={className}
      role="img"
      aria-label={title}
      style={{
        display: 'inline-flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        gap: `${gap}px`,
        padding: clearspace ? `${clearspace}px` : undefined,
        ...style,
      }}
    >
      <Icon size={iconSize} variant="free" color={onLight ? flavor : 'white'} title="" />
      <Logo size={logoWidth} variant={onLight ? 'ink' : 'white'} title="" />
    </div>
  )
}

export default Lockup
