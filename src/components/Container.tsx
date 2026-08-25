/**
 * <Container /> — la larghezza massima del sistema.
 *
 * QUANDO USARLO: dentro ogni <Section />, per riportare il contenuto alla
 * colonna di lettura.
 * QUANDO NO: per le bande a tutta larghezza (Marquee, immagini a vivo). Quelle
 * escono di proposito.
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface ContainerProps {
  children: ReactNode
  /**
   * `narrow` per i blocchi di testo lungo, `wide` per le griglie prodotto,
   * `media` per le pagine fatte di immagini: piu' stretta della default, cosi'
   * una fotografia a piena colonna non diventa smisurata.
   */
  width?: 'narrow' | 'default' | 'media' | 'wide'
  as?: ElementType
  className?: string
}

const WIDTHS = {
  narrow: 'max-w-[760px]',
  default: 'max-w-container',
  media: 'max-w-media',
  wide: 'max-w-[1440px]',
} as const

export function Container({ children, width = 'default', as: Tag = 'div', className }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-6 md:px-[28px]', WIDTHS[width], className)}>{children}</Tag>
  )
}

export default Container
