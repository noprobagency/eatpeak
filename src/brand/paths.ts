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
export function wordmarkHeightFor(widthPx: number): number {
  return (widthPx * WORDMARK_VIEWBOX.height) / WORDMARK_VIEWBOX.width
}

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
