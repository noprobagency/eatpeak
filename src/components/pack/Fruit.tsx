/**
 * La frutta del pack, come placeholder SVG piatto e stilizzato.
 *
 * Cerchi con gli spicchi, foglie con la nervatura: niente realismo. Servono
 * a bloccare la composizione stile Cure — frutta sovradimensionata dietro e
 * sopra il wordmark, tagliata dai bordi — in attesa delle immagini generate.
 * Il brief per la generazione e' `fruitBrief` in FLAVORS.
 *
 * Sono gruppi SVG da mettere dentro il viewBox della busta (400 x H), sotto
 * il wordmark; il clipPath della busta li taglia ai bordi.
 */

export interface FruitProps {
  cx: number
  cy: number
  r: number
  /** Rotazione in gradi, per non allineare mai due frutti. */
  rotate?: number
}

/** Mezza arancia rossa, vista dal taglio: buccia, albedo, otto spicchi. */
export function OrangeHalf({ cx, cy, r, rotate = 0 }: FruitProps) {
  const segments = 8
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="#A03B1E" />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="#FDF2EE" opacity="0.9" />
      <circle cx={cx} cy={cy} r={r * 0.82} fill="#C24926" />
      {Array.from({ length: segments }, (_, i) => {
        const a = (i / segments) * Math.PI * 2
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * r * 0.82}
            y2={cy + Math.sin(a) * r * 0.82}
            stroke="#FDF2EE"
            strokeWidth={r * 0.045}
            opacity="0.85"
          />
        )
      })}
      {Array.from({ length: segments }, (_, i) => {
        const a = ((i + 0.5) / segments) * Math.PI * 2
        return <circle key={`p${i}`} cx={cx + Math.cos(a) * r * 0.5} cy={cy + Math.sin(a) * r * 0.5} r={r * 0.09} fill="#7E2E16" opacity="0.55" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.07} fill="#FDF2EE" opacity="0.9" />
    </g>
  )
}

/** Una fetta: la stessa geometria, piu' sottile e con la buccia a vista. */
export function OrangeSlice({ cx, cy, r, rotate = 0 }: FruitProps) {
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="#E97958" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="#FDF2EE" opacity="0.85" />
      <circle cx={cx} cy={cy} r={r * 0.76} fill="#E4572E" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r * 0.76} y2={cy + Math.sin(a) * r * 0.76} stroke="#FDF2EE" strokeWidth={r * 0.05} opacity="0.85" />
      })}
    </g>
  )
}

/** Mezzo lime: buccia scura, albedo, polpa chiara, otto spicchi. */
export function LimeHalf({ cx, cy, r, rotate = 0 }: FruitProps) {
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="#315511" />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="#F2F7ED" opacity="0.9" />
      <circle cx={cx} cy={cy} r={r * 0.82} fill="#A5C982" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r * 0.82} y2={cy + Math.sin(a) * r * 0.82} stroke="#F2F7ED" strokeWidth={r * 0.045} opacity="0.9" />
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((i + 0.5) / 8) * Math.PI * 2
        return <circle key={`p${i}`} cx={cx + Math.cos(a) * r * 0.5} cy={cy + Math.sin(a) * r * 0.5} r={r * 0.08} fill="#7EB14C" opacity="0.7" />
      })}
    </g>
  )
}

/** Una foglia di menta con la nervatura. `r` e' la lunghezza. */
export function MintLeaf({ cx, cy, r, rotate = 0 }: FruitProps) {
  const w = r * 0.42
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`} aria-hidden="true">
      <path d={`M${cx} ${cy - r / 2} C${cx + w} ${cy - r / 4} ${cx + w} ${cy + r / 4} ${cx} ${cy + r / 2} C${cx - w} ${cy + r / 4} ${cx - w} ${cy - r / 4} ${cx} ${cy - r / 2} Z`} fill="#315511" />
      <path d={`M${cx} ${cy - r * 0.42} L${cx} ${cy + r * 0.42}`} stroke="#C5DCAE" strokeWidth={r * 0.03} opacity="0.9" />
      {[-0.25, -0.05, 0.15].map((t, i) => (
        <path key={i} d={`M${cx} ${cy + r * t} L${cx + w * 0.55} ${cy + r * (t + 0.14)} M${cx} ${cy + r * t} L${cx - w * 0.55} ${cy + r * (t + 0.14)}`} stroke="#C5DCAE" strokeWidth={r * 0.02} opacity="0.8" />
      ))}
    </g>
  )
}

/** La composizione della frutta per gusto, sul viewBox 400 x H della busta. */
export function PackFruit({ flavor, H }: { flavor: 'arancia' | 'lime'; H: number }) {
  if (flavor === 'arancia') {
    return (
      <>
        <OrangeHalf cx={372} cy={H * 0.13} r={118} rotate={-18} />
        <OrangeSlice cx={46} cy={H * 0.27} r={72} rotate={22} />
        <OrangeHalf cx={356} cy={H * 0.5} r={84} rotate={40} />
      </>
    )
  }
  return (
    <>
      <LimeHalf cx={366} cy={H * 0.14} r={112} rotate={-12} />
      <MintLeaf cx={62} cy={H * 0.27} r={130} rotate={-28} />
      <LimeHalf cx={352} cy={H * 0.52} r={82} rotate={30} />
      <MintLeaf cx={372} cy={H * 0.36} r={96} rotate={48} />
    </>
  )
}
