/**
 * <DoseSeal /> — il bollino del dosaggio.
 *
 * QUANDO USARLO: sul pack, sull'hero, accanto alla scheda prodotto. E' il segno
 * che porta il numero: tre grammi, in uno stick.
 * QUANDO NO: per numeri che non sono dosaggi. Un bollino "-30%" con questa
 * forma confonde un dato di prodotto con una promozione.
 *
 * Il numero e' in Rund Display, l'unita' e la didascalia in mono: e' il
 * contrappeso che impedisce al rounded di diventare infantile.
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
  tone?: 'brand' | 'honey' | 'forest' | 'ink'
  className?: string
}

const TONES = {
  brand: 'bg-bg-brand text-text-on-brand',
  honey: 'bg-miele-300 text-neutral-900',
  forest: 'bg-bg-forest text-neutral-0',
  ink: 'bg-bg-inverse text-text-inverse',
} as const

export function DoseSeal({ value, unit = 'g', caption, size = 128, tone = 'honey', className }: DoseSealProps) {
  return (
    <div
      className={cn('flex shrink-0 flex-col items-center justify-center rounded-full text-center', TONES[tone], className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value} ${unit}${caption ? ` — ${caption}` : ''}`}
    >
      <span
        className="font-display leading-none"
        style={{ fontSize: size * 0.4, fontWeight: 900, letterSpacing: '-0.04em' }}
        aria-hidden="true"
      >
        {value}
      </span>
      <span className="font-mono uppercase" style={{ fontSize: Math.max(9, size * 0.09), letterSpacing: '0.14em' }} aria-hidden="true">
        {unit}
      </span>
      {caption && (
        <span
          className="mt-1 max-w-[80%] font-mono uppercase opacity-75"
          style={{ fontSize: Math.max(8, size * 0.07), letterSpacing: '0.16em', lineHeight: 1.4 }}
          aria-hidden="true"
        >
          {caption}
        </span>
      )}
    </div>
  )
}

export default DoseSeal
