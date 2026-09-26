/**
 * Archetipo B · Editoriale.
 *
 * Una grande immagine (o il suo segnaposto) e il testo, in asimmetria 7/5 o
 * 5/7; l'immagine sborda dal contenitore. E' il gesto, la co-fondatrice.
 */

import type { ReactNode } from 'react'
import { Container, Section, type SectionTone } from '../../components'
import { cn } from '../../lib/cn'

export interface EditorialProps {
  media: ReactNode
  children: ReactNode
  /** Da che parte sta l'immagine. */
  mediaSide?: 'left' | 'right'
  /** Quanto e' larga l'immagine: 7 colonne su 12, o 5. */
  mediaSpan?: 7 | 5
  /** L'immagine esce dal contenitore verso il bordo della finestra. */
  bleed?: boolean
  tone?: SectionTone
  id?: string
  dataRef?: string
  className?: string
}

export function Editorial({
  media, children, mediaSide = 'left', mediaSpan = 7, bleed = true, tone = 'page', id, dataRef, className,
}: EditorialProps) {
  const mediaCols = mediaSpan === 7 ? 'lg:col-span-7' : 'lg:col-span-5'
  const textCols = mediaSpan === 7 ? 'lg:col-span-5' : 'lg:col-span-7'
  return (
    <Section tone={tone} id={id} dataRef={dataRef} className={cn('overflow-x-clip', className)}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16" data-archetype="B">
          <div
            className={cn(
              mediaCols,
              mediaSide === 'right' && 'lg:order-2',
              bleed && (mediaSide === 'left' ? 'lg:-ml-[12vw]' : 'lg:-mr-[12vw]'),
            )}
          >
            {media}
          </div>
          <div className={cn(textCols, mediaSide === 'right' && 'lg:order-1', 'flex flex-col gap-6')}>{children}</div>
        </div>
      </Container>
    </Section>
  )
}

export default Editorial
