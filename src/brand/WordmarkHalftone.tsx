/**
 * <WordmarkHalftone /> — il wordmark che si scompone in retino (H3).
 *
 * Il wordmark e' un retino di punti, rado in alto e denso in basso, come
 * l'accumulo. Dove passa il puntatore i punti si riempiono e la parola torna
 * piena. Solo in grande, una volta per pagina (il footer), mai nell'header.
 * Su touch e con reduced-motion resta il retino, leggibile lo stesso.
 */

import { useRef, type MouseEvent } from 'react'
import { useWordmark } from './paths'
import { dotFieldPoints } from './DotField'
import { cn } from '../lib/cn'
import './dots.css'

export interface WordmarkHalftoneProps {
  color?: string
  className?: string
  fontId?: string
}

export function WordmarkHalftone({ color = '#FFFFFF', className, fontId }: WordmarkHalftoneProps) {
  const wordmark = useWordmark(fontId)
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = wordmark.viewBox
  const cols = 60
  const rows = Math.max(8, Math.round((height / width) * cols))
  const field = dotFieldPoints({ rows, cols, direction: 'down', radius: [2.2, 7.6], opacity: [0.7, 1], stagger: true })
  const sx = width / field.width
  const sy = height / field.height

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div ref={ref} className={cn('peak-halftone', className)} onMouseMove={onMove} aria-label="peak" role="img">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="peak-halftone-clip">
            <path d={wordmark.path} />
          </clipPath>
        </defs>
        {/* Il ritaglio sta fuori dalla scala: sullo stesso <g> il tracciato
            verrebbe scalato con i punti e coprirebbe solo l'angolo in alto. */}
        <g clipPath="url(#peak-halftone-clip)">
          <g transform={`scale(${sx} ${sy})`}>
            {field.dots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} opacity={d.o} />
            ))}
          </g>
        </g>
      </svg>
      <svg viewBox={`0 0 ${width} ${height}`} className="peak-halftone__solid block h-auto w-full" aria-hidden="true" focusable="false">
        <path d={wordmark.path} fill={color} />
      </svg>
    </div>
  )
}

export default WordmarkHalftone
