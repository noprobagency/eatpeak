/**
 * peak — geometrie e varianti del marchio.
 *
 * Qui stanno i dati puri: path SVG, combinazioni di colore, regole di
 * spessore. I componenti Logo e Icon si limitano a disegnarli.
 */

// ---------------------------------------------------------------------------
// Il simbolo
// ---------------------------------------------------------------------------

/**
 * La saetta che punta verso l'alto.
 * L'orientamento all'insu' e' il punto: legge come ascesa, non come scarica
 * elettrica, e lega il segno al significato di "peak" senza disegnare una
 * montagna. Coordinate su viewBox 0 0 100 100.
 */
export const BOLT_UP = 'M 55 95 L 20 45 L 42 45 L 35 5 L 72 58 L 50 58 Z'

/**
 * La variante a base allargata: la saetta e' anche una vetta.
 * Piu' stabile e piu' leggibile alle dimensioni minime, meno dinamica.
 */
export const BOLT_PEAK = 'M 50 6 L 84 62 L 62 62 L 68 94 L 30 94 L 38 62 L 16 62 Z'

export const BOLT_PATHS = {
  up: BOLT_UP,
  peak: BOLT_PEAK,
} as const

export type BoltPath = keyof typeof BOLT_PATHS

// ---------------------------------------------------------------------------
// Il contenitore dell'icona
// ---------------------------------------------------------------------------

export const ICON_VIEWBOX = '0 0 100 100'

/** Raggio del contenitore squadrato, in unita' di viewBox. */
export const ICON_CORNER_RADIUS = 26

/**
 * Il raggio non deve mai scendere sotto i 4px assoluti una volta reso.
 * A 16px il raggio nominale vale 4.16px, quindi la clamp non morde quasi mai:
 * esiste per proteggere i rendering piu' piccoli del previsto.
 */
export function cornerRadiusFor(renderedSizePx: number): number {
  const nominal = ICON_CORNER_RADIUS
  const minUnits = (4 / renderedSizePx) * 100
  return Math.max(nominal, Math.min(minUnits, 50))
}

/**
 * Sotto questa soglia il contorno scuro si mangia la saetta e l'icona diventa
 * una macchia. Regola vincolante, non un suggerimento estetico.
 */
export const ICON_OUTLINE_MIN_PX = 48

// ---------------------------------------------------------------------------
// Il wordmark
// ---------------------------------------------------------------------------

export const WORDMARK_TEXT = 'peak'
export const WORDMARK_VIEWBOX = { width: 210, height: 74 } as const
export const WORDMARK_FONT_SIZE = 60
export const WORDMARK_BASELINE_Y = 56
/** -0.033em su 60px. Il tracking non si tocca: e' un uso vietato del marchio. */
export const WORDMARK_LETTER_SPACING = -2

/**
 * Il filo NON scala proporzionalmente al logo.
 * Se rimpicciolisci tutto insieme, sotto una certa soglia il contorno entra
 * nelle contro-forme di "e" e "a" e il nome diventa una macchia. Servono tre
 * versioni disegnate, non una scalata.
 */
export const STROKE_RATIO = {
  lg: 0.117, // oltre 120px di larghezza
  md: 0.1, // 60–120px
  sm: 0.067, // sotto 60px
} as const

export type StrokeSize = keyof typeof STROKE_RATIO

export const STROKE_BREAKPOINTS = { lgAbove: 120, smBelow: 60 } as const

/** Sceglie la versione di filo giusta per una larghezza resa. */
export function strokeSizeFor(widthPx: number): StrokeSize {
  if (widthPx > STROKE_BREAKPOINTS.lgAbove) return 'lg'
  if (widthPx < STROKE_BREAKPOINTS.smBelow) return 'sm'
  return 'md'
}

/** Spessore del filo in unita' di viewBox, dato lo step scelto. */
export function strokeWidthFor(size: StrokeSize): number {
  return Math.round(WORDMARK_FONT_SIZE * STROKE_RATIO[size] * 100) / 100
}

// ---------------------------------------------------------------------------
// Varianti colore del wordmark
// ---------------------------------------------------------------------------

export interface LogoVariantSpec {
  /** Riempimento della lettera. `null` = solo contorno. */
  fill: string | null
  /** Contorno esterno. `null` = nessun filo (versioni piene). */
  stroke: string | null
  /** Override dello spessore in unita' di viewBox, per le varianti speciali. */
  strokeWidth?: number
  label: string
  note: string
}

export const LOGO_VARIANTS = {
  'honey-terracotta': {
    fill: '#FCD589',
    stroke: '#E9724C',
    label: 'Miele / Terracotta',
    note: 'Primaria. Il giallo caldo tiene il tono goloso, il terracotta si legge senza gridare.',
  },
  'honey-terracotta-deep': {
    fill: '#FCD589',
    stroke: '#8F3A20',
    label: 'Miele / Terracotta scuro',
    note: 'Per il logo sopra un fondo terracotta 400: il filo scuro lo stacca.',
  },
  'honey-forest': {
    fill: '#FCD589',
    stroke: '#2F6E5E',
    label: 'Miele / Bosco',
    note: 'Il contrasto freddo. Per le sezioni bosco e per il secondo prodotto.',
  },
  'honey-forest-deep': {
    fill: '#FCD589',
    stroke: '#174036',
    label: 'Miele / Bosco profondo',
    note: 'Per il logo sopra un fondo bosco 500.',
  },
  'honey-plum': {
    fill: '#FFCF7A',
    stroke: '#8A3D6B',
    label: 'Miele / Prugna',
    note: 'Fuori palette. Tenuta come riserva per edizioni limitate, non per il sistema.',
  },
  'cream-terracotta': {
    fill: '#FDE3B0',
    stroke: '#E9724C',
    label: 'Crema / Terracotta',
    note: 'La piu elegante e la meno visibile in un feed. Per stampa e packaging.',
  },
  'amber-deep': {
    fill: '#F7B733',
    stroke: '#B4491F',
    label: 'Ambra / Terracotta profondo',
    note: 'Piu carica, regge meglio i fondi molto chiari.',
  },
  'outline-only': {
    fill: null,
    stroke: '#E9724C',
    strokeWidth: 2.4,
    label: 'Solo contorno',
    note: 'Filigrane, watermark, sovrastampe. Non usare sotto i 120px.',
  },
  'solid-terracotta': {
    fill: '#E9724C',
    stroke: null,
    label: 'Pieno terracotta',
    note: 'Stampa a un colore.',
  },
  'solid-ink': {
    fill: '#1B1A18',
    stroke: null,
    label: 'Pieno inchiostro',
    note: 'Monocromatica: incisioni, timbri, fax, documenti legali.',
  },
  'solid-white': {
    fill: '#FFFFFF',
    stroke: null,
    label: 'Pieno bianco',
    note: 'Negativo su fondi scuri o fotografie con campo di colore sotto.',
  },
} as const satisfies Record<string, LogoVariantSpec>

export type LogoVariant = keyof typeof LOGO_VARIANTS

export const DEFAULT_LOGO_VARIANT: LogoVariant = 'honey-terracotta'

// ---------------------------------------------------------------------------
// Varianti dell'icona
// ---------------------------------------------------------------------------

export interface IconVariantSpec {
  background: string | null
  bolt: string
  outline: string | null
  outlineWidth?: number
  shape: 'rect' | 'circle'
  path: BoltPath
  label: string
}

export const ICON_VARIANTS = {
  'terracotta-honey': {
    background: '#E9724C', bolt: '#FCD589', outline: null,
    shape: 'rect', path: 'up', label: 'Terracotta / Miele — primaria',
  },
  'terracotta-honey-outline': {
    background: '#E9724C', bolt: '#FCD589', outline: '#8F3A20', outlineWidth: 5,
    shape: 'rect', path: 'up', label: 'Terracotta / Miele con contorno',
  },
  'forest-honey': {
    background: '#2F6E5E', bolt: '#FCD589', outline: null,
    shape: 'rect', path: 'up', label: 'Bosco / Miele',
  },
  'forest-terracotta-outline': {
    background: '#2F6E5E', bolt: '#E9724C', outline: '#174036', outlineWidth: 5,
    shape: 'rect', path: 'up', label: 'Bosco / Terracotta con contorno',
  },
  'honey-terracotta-outline': {
    background: '#FCD589', bolt: '#E9724C', outline: '#8F3A20', outlineWidth: 4,
    shape: 'rect', path: 'up', label: 'Invertita — per fondi scuri',
  },
  'terracotta-honey-round': {
    background: '#E9724C', bolt: '#FCD589', outline: null,
    shape: 'circle', path: 'up', label: 'Tonda terracotta — social',
  },
  'forest-honey-round': {
    background: '#2F6E5E', bolt: '#FCD589', outline: null,
    shape: 'circle', path: 'up', label: 'Tonda bosco — social',
  },
  'terracotta-honey-peak': {
    background: '#E9724C', bolt: '#FCD589', outline: null,
    shape: 'rect', path: 'peak', label: 'Terracotta / Miele — saetta a picco',
  },
  'forest-honey-peak': {
    background: '#2F6E5E', bolt: '#FCD589', outline: null,
    shape: 'rect', path: 'peak', label: 'Bosco / Miele — saetta a picco',
  },
  'honey-terracotta-peak': {
    background: '#FCD589', bolt: '#E9724C', outline: null,
    shape: 'rect', path: 'peak', label: 'Invertita — saetta a picco',
  },
  'ink-honey': {
    background: '#1B1A18', bolt: '#FCD589', outline: null,
    shape: 'rect', path: 'up', label: 'Inchiostro / Miele — dark mode',
  },
  'symbol-only': {
    background: null, bolt: '#E9724C', outline: null,
    shape: 'rect', path: 'up', label: 'Solo simbolo, fondo trasparente',
  },
} as const satisfies Record<string, IconVariantSpec>

export type IconVariant = keyof typeof ICON_VARIANTS

export const DEFAULT_ICON_VARIANT: IconVariant = 'terracotta-honey'

/** Le misure da esportare per ogni variante di icona. */
export const FAVICON_SIZES = [512, 192, 96, 64, 48, 32, 16] as const

/** Le misure che vanno dentro il favicon.ico multi-risoluzione. */
export const ICO_SIZES = [16, 32, 48] as const

// ---------------------------------------------------------------------------
// Lockup
// ---------------------------------------------------------------------------

/**
 * Lo spazio tra icona e parola e' pari alla meta' dell'altezza dell'icona.
 * E' l'unica regola di lockup che serve davvero.
 */
export const LOCKUP_GAP_RATIO = 0.5

/**
 * Area di rispetto: un margine libero pari all'altezza della "p" minuscola.
 * Sul viewBox del wordmark la x-height della "p" vale circa 34 unita' su 74,
 * cioe' il 46% dell'altezza del blocco.
 */
export const CLEARSPACE_RATIO = 0.46
