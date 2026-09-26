/**
 * peak — geometrie e varianti del marchio (2.0).
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
import { candidate, useFontLab } from '../lib/fontlab'

// ---------------------------------------------------------------------------
// Il wordmark
// ---------------------------------------------------------------------------

export const WORDMARK_TEXT = 'peak'

/**
 * Il tracciato della parola, vettorializzato da Gabarito 900 con
 * scripts/vectorize-wordmark.mjs. Non dipende piu' da nessun font.
 */
export const WORDMARK_PATH: string = wordmark.path
export const WORDMARK_VIEWBOX = wordmark.viewBox as { width: number; height: number }

/** Tracking con cui e' stato generato: -0.04em. Non si tocca (uso vietato). */
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

/** Larghezza minima nell'header del sito. */
export const HEADER_LOGO_WIDTH = { desktop: 96, mobile: 80 } as const

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
 * Il wordmark del font attivo nel laboratorio (`?font=`). Reattivo.
 * Con `override` si forza un candidato: serve alla pagina #/lab/font, che
 * mostra tutti i font insieme.
 */
export function useWordmark(override?: string): WordmarkSpec {
  const { font } = useFontLab()
  return wordmarkFor(candidate(override ?? font).id)
}

export const WORDMARK_FONT_IDS = Object.keys(CANDIDATE_WORDMARKS).map((k) => k.replace('./wordmarks/', '').replace('.json', ''))

// ---------------------------------------------------------------------------
// Varianti colore del wordmark: tre, piene, senza contorno
// ---------------------------------------------------------------------------

export interface LogoVariantSpec {
  /** `flavor` risolve a runtime nel colore-gusto 500. */
  fill: string | 'flavor'
  label: string
  note: string
}

export const LOGO_VARIANTS = {
  white: {
    fill: '#FFFFFF',
    label: 'Bianco',
    note: 'Primaria. Su ogni campo colore-gusto (arancia, lime) e su inchiostro. E il logo del packaging.',
  },
  ink: {
    fill: '#3A2A22',
    label: 'Cacao',
    note: 'Su bianco e carta: header del sito e documenti. E cacao 900, non nero: il nero e uscito dall interfaccia. La stampa a un colore usa print.ink dai token.',
  },
  flavor: {
    fill: 'flavor',
    label: 'Colore-gusto',
    note: 'Arancia 500 o lime 500, solo su bianco o carta, solo sopra i 48px di altezza. Uso raro: pubblicita su fondo chiaro.',
  },
} as const satisfies Record<string, LogoVariantSpec>

export type LogoVariant = keyof typeof LOGO_VARIANTS

export const DEFAULT_LOGO_VARIANT: LogoVariant = 'white'

/** Il colore-gusto 500 di un gusto, per il logo e per il vertice libero. */
export function flavorHex(flavor: FlavorId): string {
  return FLAVORS.find((f) => f.id === flavor)?.hex ?? '#E4572E'
}

// ---------------------------------------------------------------------------
// Il vertice
// ---------------------------------------------------------------------------

export const ICON_VIEWBOX = '0 0 100 100'

/** Raggio del contenitore squadrato, in unita' di viewBox. */
export const ICON_CORNER_RADIUS = 26

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
} as const

export type SymbolVariantId = keyof typeof SYMBOL_VARIANTS

/**
 * La variante attiva, dietro un flag. V5 e' il default proposto; la scelta
 * finale e' del brand, dopo #/lab/simbolo. Cambiandola qui cambiano favicon,
 * lockup, sigilli e header (npm run assets:generate per gli asset statici).
 */
export const SYMBOL_VARIANT: SymbolVariantId = 'v5'

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
  const base = VERTEX[geometry].r
  const spec = SYMBOL_VARIANTS[variant]
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
 * A 16px il nominale vale 4.16px, quindi la clamp non morde quasi mai.
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
  arancia: {
    background: '#E4572E',
    dots: '#FFFFFF',
    label: 'Arancia',
    note: 'Primaria: favicon, app icon, avatar social.',
  },
  lime: {
    background: '#5E9E1F',
    dots: '#FFFFFF',
    label: 'Lime',
    note: 'Sulle comunicazioni del gusto 02.',
  },
  deep: {
    background: '#C24926',
    dots: '#FFFFFF',
    label: 'Arancia profondo',
    note: 'Sulle superfici brand scure: toast, badge, footer. Niente nero.',
  },
  free: {
    background: null,
    dots: 'flavor',
    label: 'Libero',
    note: 'Senza contenitore, nel colore-gusto o in inchiostro. Per il lockup e il sigillo sul retro dello stick.',
  },
} as const satisfies Record<string, IconVariantSpec>

export type IconVariant = keyof typeof ICON_VARIANTS

export const DEFAULT_ICON_VARIANT: IconVariant = 'arancia'

/** Le misure da esportare per ogni variante di icona. */
export const FAVICON_SIZES = [512, 192, 96, 64, 48, 32, 16] as const

/** Le misure che vanno dentro il favicon.ico multi-risoluzione. */
export const ICO_SIZES = [16, 32, 48] as const

// ---------------------------------------------------------------------------
// Lockup
// ---------------------------------------------------------------------------

/**
 * Lo spazio tra il vertice e la parola e' pari alla meta' dell'altezza del
 * simbolo. E' l'unica regola di lockup che serve davvero.
 */
export const LOCKUP_GAP_RATIO = 0.5

/** Il wordmark sta bene a circa 2.4 volte il lato del vertice libero. */
export const LOCKUP_WORDMARK_TO_ICON = 2.4

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
  { label: 'doppio colore', reason: 'Un solo colore, sempre. Bianco, inchiostro o colore-gusto.' },
  { label: 'gradienti', reason: 'Il brand e piatto. Il pieno e un colore solido.' },
  { label: 'ombre o glow', reason: 'Lo sposta nell estetica supplement-tech da cui vuole stare lontano.' },
  { label: 'rotazioni', reason: 'Tranne i 90 gradi sullo stick, dove il logo corre lungo la lunghezza.' },
  { label: 'tracking modificato', reason: 'E fissato a -0.04em nel tracciato. Non esiste una prop per cambiarlo.' },
  { label: 'su foto senza campo pieno', reason: 'Il bianco pieno tiene su una tinta piatta, non su una texture.' },
  { label: 'bianco su fondi chiari', reason: 'Non si legge. Su bianco e carta il logo e cacao o arancia 600.' },
  { label: 'nero', reason: 'L inchiostro nero e uscito dall interfaccia: il logo scuro e cacao 900, la stampa a un colore usa print.ink.' },
] as const
