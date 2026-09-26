/**
 * <DoseSeal /> — il bollino del dosaggio.
 *
 * QUANDO USARLO: sul pack, sull'hero, accanto alla scheda prodotto. E' il segno
 * che porta il numero: tre grammi, in uno stick.
 * QUANDO NO: per numeri che non sono dosaggi. Un bollino "-30%" con questa
 * forma confonde un dato di prodotto con una promozione.
 *
 * Il numero e' in Gabarito, l'unita' e la didascalia in mono: e' il
 * contrappeso che impedisce al rounded di diventare infantile. Il miele e'
 * l'accento del sistema, ed e' il tono di default del bollino.
 */

import { cn } from '../lib/cn'

export interface DoseSealProps {
  /** Il numero grande. */
  value: number | string
  /** L'unita' sotto il numero, in mono. */
  unit?: string
  /** Riga aggiuntiva sotto l'unita'. Tienila corta. */
  caption?: string
  size?: number
  tone?: 'miele' | 'arancia' | 'lime' | 'deep' | 'white'
  className?: string
}

const TONES = {
  miele: 'bg-miele-300 text-cacao-900',
  arancia: 'bg-bg-flavor-arancia text-text-on-flavor',
  lime: 'bg-bg-flavor-lime text-text-on-flavor',
  deep: 'bg-bg-brand-deep text-text-inverse',
  white: 'bg-neutral-0 text-cacao-900',
} as const

export function DoseSeal({ value, unit = 'g', caption, size = 128, tone = 'miele', className }: DoseSealProps) {
  return (
    <div
      className={cn('flex shrink-0 flex-col items-center justify-center rounded-full text-center', TONES[tone], className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value} ${unit}${caption ? ` — ${caption}` : ''}`}
    >
      <span className="font-display leading-none" style={{ fontSize: size * 0.4, fontWeight: 900, letterSpacing: '-0.04em' }} aria-hidden="true">
        {value}
      </span>
      <span className="font-display font-bold" style={{ fontSize: Math.max(10, size * 0.1) }} aria-hidden="true">
        {unit}
      </span>
      {caption && (
        <span
          className="mt-1 max-w-[80%] font-display font-semibold opacity-75"
          style={{ fontSize: Math.max(9, size * 0.08), lineHeight: 1.3 }}
          aria-hidden="true"
        >
          {caption}
        </span>
      )}
    </div>
  )
}

export default DoseSeal
