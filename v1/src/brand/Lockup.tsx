/**
 * <Lockup /> — icona e wordmark insieme.
 *
 * QUANDO USARLO: header del sito, firma delle creativita', fondo pagina, ogni
 * punto in cui il marchio si presenta per intero.
 * QUANDO NO: quando lo spazio e' stretto. Meglio la sola <Icon /> di un lockup
 * compresso.
 *
 * L'unica regola che serve: lo spazio tra i due elementi e' pari alla meta'
 * dell'altezza dell'icona. Il componente la applica da solo.
 */

import type { CSSProperties } from 'react'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { CLEARSPACE_RATIO, LOCKUP_GAP_RATIO, type IconVariant, type LogoVariant } from './paths'

export interface LockupProps {
  /** Lato dell'icona in px. Il wordmark e lo spazio si dimensionano da qui. */
  iconSize?: number
  orientation?: 'horizontal' | 'vertical'
  iconVariant?: IconVariant
  logoVariant?: LogoVariant
  /** Disegna l'area di rispetto come padding reale attorno al blocco. */
  withClearspace?: boolean
  title?: string
  className?: string
  style?: CSSProperties
}

/** Il wordmark sta bene a circa 2.65 volte il lato dell'icona. */
const WORDMARK_TO_ICON = 2.65

export function Lockup({
  iconSize = 64,
  orientation = 'horizontal',
  iconVariant,
  logoVariant,
  withClearspace = false,
  title = 'peak',
  className,
  style,
}: LockupProps) {
  const gap = iconSize * LOCKUP_GAP_RATIO
  const logoWidth = iconSize * WORDMARK_TO_ICON
  const clearspace = withClearspace ? iconSize * CLEARSPACE_RATIO : 0

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
      <Icon size={iconSize} variant={iconVariant} title="" />
      <Logo size={logoWidth} variant={logoVariant} title="" />
    </div>
  )
}

export default Lockup
