/**
 * <VertexBreath /> — il simbolo che respira (H1).
 *
 * Al passaggio i punti si accendono dal basso verso la vetta in 520 ms, una
 * volta per passaggio, poi stanno fermi. E' un componente: l'header e' mio
 * e resta com'e'. Serve nel footer, nelle card e nei sigilli grandi.
 */

import { Icon, type IconProps } from './Icon'
import { cn } from '../lib/cn'
import './dots.css'

export function VertexBreath({ className, ...props }: IconProps) {
  return (
    <span className={cn('peak-breath inline-flex', className)} tabIndex={-1}>
      <Icon {...props} />
    </span>
  )
}

export default VertexBreath
