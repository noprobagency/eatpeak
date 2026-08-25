/**
 * Contrasto WCAG 2.1.
 *
 * Duplicato consapevole di scripts/lib/contrast.mjs: quello gira in Node per
 * generare il report in docs/02-tokens.md, questo gira nel browser per la
 * pagina Showcase. Le formule sono ferme dal 2008 e non cambieranno: il costo
 * del duplicato e' minore di quello di un build step in piu'.
 */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function channel(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export type ContrastVerdict = 'AAA' | 'AA' | 'AA large' | 'FAIL'

export function verdict(ratio: number, large = false): ContrastVerdict {
  if (large) {
    if (ratio >= 4.5) return 'AAA'
    if (ratio >= 3) return 'AA'
    return 'FAIL'
  }
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA large'
  return 'FAIL'
}

/** Il testo che si legge meglio su un fondo dato: bianco o inchiostro. */
export function readableOn(background: string): '#FFFFFF' | '#1B1A18' {
  return contrastRatio(background, '#FFFFFF') >= contrastRatio(background, '#1B1A18')
    ? '#FFFFFF'
    : '#1B1A18'
}
