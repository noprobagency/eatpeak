// Utility di contrasto WCAG 2.1. Nessuna dipendenza esterna.

export function hexToRgb(hex) {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function channel(c) {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a, b) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const light = Math.max(la, lb)
  const dark = Math.min(la, lb)
  return (light + 0.05) / (dark + 0.05)
}

export function round2(n) {
  return Math.round(n * 100) / 100
}

/**
 * Soglie WCAG AA.
 * Il testo e' "large" da 18px normale (24px CSS) o 14px bold (18.66px CSS) in su.
 * Il design system di peak richiede 4.5:1 per tutto cio' che sta sotto i 18px.
 */
export function passesAA(ratio, { large = false } = {}) {
  return large ? ratio >= 3 : ratio >= 4.5
}

export function passesAAA(ratio, { large = false } = {}) {
  return large ? ratio >= 4.5 : ratio >= 7
}

export function verdict(ratio, { large = false } = {}) {
  if (passesAAA(ratio, { large })) return 'AAA'
  if (passesAA(ratio, { large })) return 'AA'
  if (large && ratio >= 3) return 'AA large'
  return 'FAIL'
}
