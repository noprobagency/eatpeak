/**
 * peak — geometrie e varianti del marchio (2.0, rivisto nella 3.1).
 *
 * Qui stanno i dati puri: il tracciato del wordmark, i cerchi del vertice, le
 * combinazioni di colore. I componenti Logo, Icon, Lockup e DotField si
 * limitano a disegnarli, e scripts/generate-assets.mjs legge lo STESSO file:
 * gli SVG statici non possono andare fuori sincrono col codice.
 *
 * Gli script leggono questo file come testo e valutano i literal esportati:
 * tieni le costanti come literal semplici, senza calcoli.
 */

import wordmark from './wordmark.json'
import { FLAVORS, type FlavorId } from '../lib/copy'

// ---------------------------------------------------------------------------
// Il wordmark
// ---------------------------------------------------------------------------

export const WORDMARK_TEXT = 'peak'

/**
 * Il tracciato di ripiego, vettorializzato da Gabarito 900 con
 * scripts/vectorize-wordmark.mjs: e' il wordmark della v1 come si vedeva senza
 * Rund Display installato. Dalla 3.1 il wordmark vero e' quello della v1 (vedi
 * WORDMARK_ID sotto); questo resta quando il tracciato Rund non c'e'.
 */
export const WORDMARK_PATH: string = wordmark.path
export const WORDMARK_VIEWBOX = wordmark.viewBox as { width: number; height: number }

/** Tracking del ripiego: -0.04em. Il tracciato della v1 ha il suo (-0.0333em). Non si tocca. */
export const WORDMARK_TRACKING_EM: number = wordmark.$meta.trackingEm

/**
 * Area di rispetto: l'altezza della "e" minuscola su tutti i lati,
 * calcolata sul tracciato: 51.3 su 87.1 unita' di viewBox.
 */
export const CLEARSPACE_RATIO: number = wordmark.clearspaceRatio

/** Misura minima resa sullo schermo, in px di larghezza. In stampa: 12mm. */
export const WORDMARK_MIN_WIDTH_PX = 48
export const WORDMARK_MIN_WIDTH_MM = 12

/** Sotto questa altezza la variante `flavor` non si usa: il colore si impasta. */
export const FLAVOR_VARIANT_MIN_HEIGHT_PX = 48

/** Altezza resa per una larghezza data: il viewBox e' stretto sull'inchiostro. */
export function wordmarkHeightFor(widthPx: number, viewBox: { width: number; height: number } = WORDMARK_VIEWBOX): number {
  return (widthPx * viewBox.height) / viewBox.width
}

// ---------------------------------------------------------------------------
// Il laboratorio font (3.0): un tracciato per candidato
// ---------------------------------------------------------------------------

export interface WordmarkSpec {
  path: string
  viewBox: { width: number; height: number }
  clearspaceRatio: number
  eHeight: number
  fontId: string
  font: string
}

const CANDIDATE_WORDMARKS = import.meta.glob<{ default: { path: string; viewBox: { width: number; height: number }; clearspaceRatio: number; eHeight: number; $meta: { font: string } } }>(
  './wordmarks/*.json',
  { eager: true },
)

/** Il tracciato di un candidato; senza corrispondenza torna quello ufficiale. */
export function wordmarkFor(fontId: string): WordmarkSpec {
  const hit = CANDIDATE_WORDMARKS[`./wordmarks/${fontId}.json`]?.default
  if (!hit) {
    return { path: WORDMARK_PATH, viewBox: WORDMARK_VIEWBOX, clearspaceRatio: CLEARSPACE_RATIO, eHeight: wordmark.eHeight, fontId: 'gabarito-900', font: wordmark.$meta.font }
  }
  return { path: hit.path, viewBox: hit.viewBox, clearspaceRatio: hit.clearspaceRatio, eHeight: hit.eHeight, fontId, font: hit.$meta.font }
}

/**
 * Il wordmark del marchio, dalla 3.1: quello della v1, "peak" in Rund Display
 * Black con il tracking della v1 (-2 su 60, cioe' -0.0333em).
 *
 * Rund e' in licenza TRIAL: il tracciato (src/brand/wordmarks/rund.json) si
 * genera in locale con `npm run brand:vectorize -- --font-id=rund` e non entra
 * in git. Dove non c'e' (Vercel, un clone pulito) wordmarkFor() torna il
 * ripiego Gabarito 900, cioe' la v1 com'era senza il font. Con la licenza
 * desktop comprata il tracciato si committa e il ripiego sparisce.
 */
export const WORDMARK_ID = 'rund'

/** true se il tracciato della v1 c'e' davvero (solo in locale, finche' Rund e' in trial). */
export const WORDMARK_V1_AVAILABLE = `./wordmarks/${WORDMARK_ID}.json` in CANDIDATE_WORDMARKS

/**
 * Il wordmark da disegnare. Dalla 3.1 non segue piu' il font del laboratorio:
 * e' sempre quello della v1. Con `override` si forza un candidato: serve alla
 * pagina #/lab/font, che mostra il tracciato di ogni font.
 */
export function useWordmark(override?: string): WordmarkSpec {
  return wordmarkFor(override ?? WORDMARK_ID)
}

export const WORDMARK_FONT_IDS = Object.keys(CANDIDATE_WORDMARKS).map((k) => k.replace('./wordmarks/', '').replace('.json', ''))

// ---------------------------------------------------------------------------
// Varianti colore del wordmark (3.1): bianco o ambra, sempre. Piene.
// ---------------------------------------------------------------------------

export interface LogoVariantSpec {
  /** `flavor` risolve a runtime nel colore-gusto 500. */
  fill: string | 'flavor'
  label: string
  note: string
}

/**
 * Dalla 3.1 il wordmark e' sempre bianco, oppure ambra quando il fondo e'
 * bianco o carta. Mai cacao, mai nero. E' un logo, non testo: la soglia del
 * 4,5:1 non lo riguarda (ambra su bianco fa 1,85:1, bianco su ambra lo stesso).
 */
export const LOGO_VARIANTS = {
  white: {
    fill: '#FFFFFF',
    label: 'Bianco',
    note: 'Primaria. Su ogni fondo colore: ambra 400 e 700, i campi gusto, lime 700. E il logo del packaging.',
  },
  ambra: {
    fill: '#FFAE34',
    label: 'Ambra',
    note: 'Su bianco e carta: header del sito e documenti. Ambra 400, il colore brand.',
  },
  flavor: {
    fill: 'flavor',
    label: 'Colore-gusto',
    note: 'Arancia 500 o lime 500: solo il pack Neutro e la pubblicita di un gusto su fondo chiaro, sopra i 48px di altezza.',
  },
} as const satisfies Record<string, LogoVariantSpec>

export type LogoVariant = keyof typeof LOGO_VARIANTS

export const DEFAULT_LOGO_VARIANT: LogoVariant = 'white'

/** Il colore-gusto 500 di un gusto, per il logo e per il vertice libero. */
export function flavorHex(flavor: FlavorId): string {
  return FLAVORS.find((f) => f.id === flavor)?.hex ?? '#E4572E'
}

// ---------------------------------------------------------------------------
// I colori del simbolo (3.1)
// ---------------------------------------------------------------------------

/** Ambra 700 su chiaro, cacao su ambra, bianco sugli altri fondi colore. */
export const SYMBOL_COLORS = {
  onLight: '#A04F06',
  onBrand: '#3A2A22',
  onColor: '#FFFFFF',
} as const

/** Il colore brand dei fondi (ambra 400): favicon, campi, pulsante primario. */
export const AMBRA_HEX = '#FFAE34'

// ---------------------------------------------------------------------------
// Il vertice
// ---------------------------------------------------------------------------

export const ICON_VIEWBOX = '0 0 100 100'

/** Raggio del contenitore squadrato, in unita' di viewBox: il 24% del lato (3.1). */
export const ICON_CORNER_RADIUS = 24

/**
 * Tre cerchi pieni e uguali disposti a triangolo: uno sopra, due sotto.
 * Il picco senza disegnare una montagna; i 3 ingredienti; i 3 grammi.
 *
 * `contained` vive nel contenitore rx=26; `free` sta da solo, per il lockup e
 * il sigillo dello stick; `small` e' la versione per i rendering sotto i 24px,
 * dove i punti da 12 si fondono.
 */
export const VERTEX = {
  contained: { r: 12, points: [[50, 33], [33, 64], [67, 64]] },
  free: { r: 14, points: [[50, 30], [30, 66], [70, 66]] },
  small: { r: 13, points: [[50, 33], [33, 64], [67, 64]] },
} as const

export type VertexGeometry = keyof typeof VERTEX

/** Sotto questa misura resa i punti passano a r=13. */
export const VERTEX_SMALL_BELOW_PX = 24

// ---------------------------------------------------------------------------
// Le varianti del simbolo (3.0): tre punti uguali a triangolo ricordano Asana.
// Basta un cambio minimo. La scelta finale e' del brand: qui c'e' il flag.
// ---------------------------------------------------------------------------

/**
 * Ogni variante e' una lista di punti sul viewBox 100x100, con la scala del
 * raggio rispetto alla geometria base (contained r=12, free r=14) e il ruolo.
 * `top` e' la vetta; `ghost` sono i punti fantasma della griglia (20%).
 * Gli script leggono questo literal come testo: niente calcoli qui.
 */
export const SYMBOL_VARIANTS = {
  v0: {
    label: 'Base',
    note: 'Tre punti uguali a triangolo. Il riferimento da cui allontanarsi: ricorda Asana.',
    topMiele: false,
    dots: [
      { x: 50, y: 33, scale: 1, top: true },
      { x: 33, y: 64, scale: 1 },
      { x: 67, y: 64, scale: 1 },
    ],
  },
  v1: {
    label: 'Crescendo',
    note: 'Stessi tre punti, diametri diversi: 0,8 in basso a sinistra, 1,0 a destra, 1,2 in alto. Il retino che cresce: l accumulo.',
    topMiele: false,
    dots: [
      { x: 50, y: 32, scale: 1.2, top: true },
      { x: 32, y: 65, scale: 0.8 },
      { x: 67, y: 64, scale: 1 },
    ],
  },
  v2: {
    label: 'Punta miele',
    note: 'Triangolo uguale, il punto in alto e miele: e oggi, il giorno fatto.',
    topMiele: true,
    dots: [
      { x: 50, y: 33, scale: 1, top: true },
      { x: 33, y: 64, scale: 1 },
      { x: 67, y: 64, scale: 1 },
    ],
  },
  v3: {
    label: 'Su griglia',
    note: 'Griglia 3x3: sei punti fantasma al 20% e tre pieni che formano la salita.',
    topMiele: false,
    dots: [
      { x: 72, y: 28, scale: 0.85, top: true },
      { x: 50, y: 50, scale: 0.85 },
      { x: 28, y: 72, scale: 0.85 },
      { x: 28, y: 28, scale: 0.85, ghost: true },
      { x: 50, y: 28, scale: 0.85, ghost: true },
      { x: 28, y: 50, scale: 0.85, ghost: true },
      { x: 72, y: 50, scale: 0.85, ghost: true },
      { x: 50, y: 72, scale: 0.85, ghost: true },
      { x: 72, y: 72, scale: 0.85, ghost: true },
    ],
  },
  v4: {
    label: 'Pendio',
    note: 'Il punto alto spostato a destra: si legge come salita, non come triangolo.',
    topMiele: false,
    dots: [
      { x: 63, y: 31, scale: 1, top: true },
      { x: 31, y: 66, scale: 1 },
      { x: 67, y: 66, scale: 1 },
    ],
  },
  v5: {
    label: 'Crescendo, punta miele',
    note: 'V1 + V2: il retino che cresce e la vetta di oggi. La candidata consigliata.',
    topMiele: true,
    dots: [
      { x: 50, y: 32, scale: 1.2, top: true },
      { x: 32, y: 65, scale: 0.8 },
      { x: 67, y: 64, scale: 1 },
    ],
  },
  v6: {
    label: 'Pendio in crescendo',
    note: 'V4 + V1, monocolore: per la stampa a un colore.',
    topMiele: false,
    dots: [
      { x: 64, y: 30, scale: 1.2, top: true },
      { x: 31, y: 66, scale: 0.8 },
      { x: 66, y: 66, scale: 1 },
    ],
  },
  v7: {
    label: 'Montagna, quattro punti',
    note: 'La scelta della 3.1. Quattro cerchi pieni, diametri 0,64 · 0,76 · 0,88 · 1: la montagna a riposo, la salita al passaggio. Geometria in SYMBOL_GEOMETRY.',
    topMiele: false,
    // I punti veri stanno in SYMBOL_GEOMETRY, ognuno nel suo viewBox:
    // symbolDots() li riporta sul 100x100.
    dots: [],
  },
} as const

export type SymbolVariantId = keyof typeof SYMBOL_VARIANTS

/**
 * La variante attiva, dietro un flag. Dalla 3.1 e' V7, i quattro punti: la
 * scelta del brand. Le V0-V6 restano nel laboratorio come archivio.
 * Cambiandola qui cambiano favicon, lockup, sigilli e header
 * (npm run assets:generate per gli asset statici).
 */
export const SYMBOL_VARIANT: SymbolVariantId = 'v7'

// ---------------------------------------------------------------------------
// Il simbolo della 3.1: quattro punti
// ---------------------------------------------------------------------------

/**
 * Quattro cerchi pieni, un solo colore, diametri 0,64 · 0,76 · 0,88 · 1 (1 e'
 * il piu' grande). Tre geometrie, ognuna nel suo viewBox, con [cx, cy, r]:
 *
 * - `montagna`: il simbolo a riposo. Spazio tra i punti: 0,1 del diametro
 *   maggiore.
 * - `salita`: i punti in diagonale a 36 gradi, dal piu' piccolo al piu'
 *   grande. E' la posizione dell'animazione dell'header.
 * - `favicon`: la montagna con lo spazio a 0,2, perche' a 16px i punti non si
 *   impastino. Nel contenitore occupa il 64% del lato (FAVICON_DOTS_SPAN).
 *
 * I punti sono in ordine: dal piu' piccolo al piu' grande. Literal semplici:
 * gli script li leggono come testo.
 */
export const SYMBOL_GEOMETRY = {
  montagna: { width: 213, height: 171.6, dots: [[32, 139.6, 32], [111.8, 133.6, 38], [59.3, 58, 44], [163, 50, 50]] },
  salita: { width: 305.3, height: 244.2, dots: [[32, 212.2, 32], [96.7, 165.2, 38], [171.2, 111.1, 44], [255.3, 50, 50]] },
  favicon: { width: 228.2, height: 180.1, dots: [[32, 148.1, 32], [121.8, 142.1, 38], [64.4, 57.8, 44], [178.2, 50, 50]] },
} as const

export type SymbolPose = keyof typeof SYMBOL_GEOMETRY

/** Nel contenitore (favicon, app icon) i punti occupano il 64% del lato. */
export const FAVICON_DOTS_SPAN = 0.64

/** La salita dell'header: durata, ritardi per punto (dal piu' piccolo), easing. */
export const SALITA_MOTION = {
  durationMs: 520,
  delaysMs: [0, 60, 120, 190],
  easing: 'cubic-bezier(.3,1.45,.5,1)',
  wordmarkMs: 400,
  /** Larghezza massima del wordmark che compare, in em. */
  wordmarkMaxEm: 3.4,
  /** Spazio tra simbolo e wordmark, in em. */
  gapEm: 0.3,
} as const

/**
 * Una geometria del simbolo riportata su un riquadro 100x100: `span` e' la
 * frazione del lato che i punti occupano in larghezza, centrati.
 */
export function poseDots(pose: SymbolPose, span = 1): { cx: number; cy: number; r: number }[] {
  const g = SYMBOL_GEOMETRY[pose]
  const k = (100 * span) / g.width
  const ox = (100 - g.width * k) / 2
  const oy = (100 - g.height * k) / 2
  return g.dots.map(([cx, cy, r]) => ({ cx: ox + cx * k, cy: oy + cy * k, r: r * k }))
}

export const MIELE_HEX = '#FCD589'
export const MIELE_RING_HEX = '#A03B1E'

export interface SymbolDot {
  cx: number
  cy: number
  r: number
  top: boolean
  ghost: boolean
}

/** I punti di una variante, con il raggio assoluto della geometria chiesta. */
export function symbolDots(variant: SymbolVariantId = SYMBOL_VARIANT, geometry: VertexGeometry = 'contained'): SymbolDot[] {
  if (variant === 'v7') {
    // Libero: la montagna a tutta larghezza. Nel contenitore: la geometria del
    // favicon al 64% del lato. Il punto piu' grande (l'ultimo) e' la vetta.
    const dots = geometry === 'free' ? poseDots('montagna') : poseDots('favicon', FAVICON_DOTS_SPAN)
    return dots.map((d, i) => ({ ...d, top: i === dots.length - 1, ghost: false }))
  }
  const base = VERTEX[geometry].r
  const spec: { dots: readonly { x: number; y: number; scale: number; top?: boolean; ghost?: boolean }[] } = SYMBOL_VARIANTS[variant]
  // La geometria libera e' un po' piu' larga: si riscala dal contenitore.
  const spread = geometry === 'free' ? 1.12 : 1
  return spec.dots.map((d) => ({
    cx: 50 + (d.x - 50) * spread,
    cy: 50 + (d.y - 50) * spread,
    r: base * d.scale,
    top: Boolean('top' in d && d.top),
    ghost: Boolean('ghost' in d && d.ghost),
  }))
}

/**
 * Il raggio del contenitore non deve mai scendere sotto i 4px assoluti.
 * Al 24% del lato, a 16px il nominale vale 3.84px: la clamp lo porta a 4.
 */
export function cornerRadiusFor(renderedSizePx: number): number {
  const minUnits = (4 / renderedSizePx) * 100
  return Math.max(ICON_CORNER_RADIUS, Math.min(minUnits, 50))
}

// ---------------------------------------------------------------------------
// Varianti del vertice: quattro
// ---------------------------------------------------------------------------

export interface IconVariantSpec {
  /** Colore del contenitore. `null` = nessun contenitore (vertice libero). */
  background: string | null
  /** Colore dei punti. `flavor` = colore-gusto, risolto a runtime. */
  dots: string | 'flavor'
  label: string
  note: string
}

export const ICON_VARIANTS = {
  ambra: {
    background: '#FFAE34',
    dots: '#3A2A22',
    label: 'Ambra',
    note: 'Primaria (3.1): favicon, app icon, avatar social. Quadrato ambra 400, punti cacao.',
  },
  deep: {
    background: '#A04F06',
    dots: '#FFFFFF',
    label: 'Ambra profondo',
    note: 'Sulle superfici brand scure (ambra 700): toast, tooltip. Niente nero.',
  },
  arancia: {
    background: '#E4572E',
    dots: '#FFFFFF',
    label: 'Arancia',
    note: 'Sulle comunicazioni del gusto 01. Colore del pack, non del brand.',
  },
  lime: {
    background: '#5E9E1F',
    dots: '#FFFFFF',
    label: 'Lime',
    note: 'Sulle comunicazioni del gusto 02.',
  },
  free: {
    background: null,
    dots: 'flavor',
    label: 'Libero',
    note: 'Senza contenitore: ambra 700 su chiaro, cacao su ambra, bianco sugli altri fondi colore. Per il lockup e il sigillo.',
  },
} as const satisfies Record<string, IconVariantSpec>

export type IconVariant = keyof typeof ICON_VARIANTS

export const DEFAULT_ICON_VARIANT: IconVariant = 'ambra'

/** Le misure da esportare per ogni variante di icona. */
export const FAVICON_SIZES = [512, 192, 96, 64, 48, 32, 16] as const

/** Le misure che vanno dentro il favicon.ico multi-risoluzione. */
export const ICO_SIZES = [16, 32, 48] as const

// ---------------------------------------------------------------------------
// Lockup
// ---------------------------------------------------------------------------

/**
 * Il lockup della 3.1: simbolo e wordmark centrati in verticale sulla scritta,
 * con 0,3em di spazio, misurati sul corpo del wordmark. Il simbolo a riposo e'
 * alto quanto la parola (SYMBOL_EM_PER_UNIT: il punto piu' grande vale 0,5em).
 */
export const LOCKUP_GAP_EM = 0.3

/** Unita' di viewBox del simbolo in em del lockup: 100 unita' = 0,5em. */
export const SYMBOL_EM_PER_UNIT = 0.005

// ---------------------------------------------------------------------------
// Il pattern a pallini
// ---------------------------------------------------------------------------

/** Default da pack: punti bianchi dal 18% al 40%, raggio da 1 a 7, righe sfalsate. */
export const DOTFIELD_DEFAULTS = {
  rows: 4,
  cols: 12,
  opacity: [0.18, 0.4],
  radius: [1, 7],
  stagger: true,
  color: '#FFFFFF',
} as const

// ---------------------------------------------------------------------------
// Usi vietati (per lo Showcase e per i doc)
// ---------------------------------------------------------------------------

export const LOGO_FORBIDDEN_USES = [
  { label: 'contorni', reason: 'Il wordmark 2.0 e pieno. Un filo lo riporta alla 1.0.' },
  { label: 'doppio colore', reason: 'Il wordmark ha un solo colore: bianco, oppure ambra su bianco e carta.' },
  { label: 'gradienti', reason: 'Il brand e piatto. Il pieno e un colore solido.' },
  { label: 'ombre o glow', reason: 'Lo sposta nell estetica supplement-tech da cui vuole stare lontano.' },
  { label: 'rotazioni', reason: 'Tranne i 90 gradi sullo stick, dove il logo corre lungo la lunghezza.' },
  { label: 'tracking modificato', reason: 'E fissato a -0.04em nel tracciato. Non esiste una prop per cambiarlo.' },
  { label: 'su foto senza campo pieno', reason: 'Il bianco pieno tiene su una tinta piatta, non su una texture.' },
  { label: 'bianco su fondi chiari', reason: 'Non si vede. Su bianco e carta il wordmark e ambra.' },
  { label: 'cacao o nero', reason: 'Dalla 3.1 il wordmark e solo bianco o ambra. Il cacao resta al simbolo sui fondi ambra.' },
] as const
