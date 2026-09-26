/**
 * peak — le rotte del sito.
 *
 * Il routing e' sull'hash, senza dipendenze: `#/prodotto`. Un'ancora dentro la
 * pagina si scrive dopo un secondo cancelletto: `#/sito#come-funziona` porta
 * alla home del sito e scorre alla sezione.
 *
 * Dalla 3.3 la **radice e' il design system**: e' lui il lavoro, e il sito
 * simulato e' la prova che gli sta sotto. Il sito vive da `/sito` in giu' ed
 * e' l'unico gruppo che porta l'header; tutto il resto si raggiunge dai link
 * in fondo alla pagina. Le rotte vecchie restano come alias.
 */

export type RoutePath =
  | '/'
  | '/prototipi'
  | '/lab/font'
  | '/lab/simbolo'
  | '/lab/box'
  | '/lab/pack'
  | '/sito'
  | '/prodotto'
  | '/formula'

export interface RouteSpec {
  path: RoutePath
  label: string
  /**
   * Il gruppo: il sistema (design system e prototipi), il laboratorio, o il
   * sito simulato. Solo il gruppo `sito` mostra l'header.
   */
  group: 'sistema' | 'lab' | 'sito'
  title: string
}

export const ROUTES: readonly RouteSpec[] = [
  { path: '/', label: 'Design system', group: 'sistema', title: 'peak — design system' },
  { path: '/prototipi', label: 'Prototipi', group: 'sistema', title: 'peak — prototipi' },
  { path: '/lab/font', label: 'Lab · font', group: 'lab', title: 'peak — laboratorio font' },
  { path: '/lab/simbolo', label: 'Lab · simbolo', group: 'lab', title: 'peak — laboratorio simbolo' },
  { path: '/lab/box', label: 'Lab · sezioni', group: 'lab', title: 'peak — laboratorio sezioni' },
  { path: '/lab/pack', label: 'Lab · pack', group: 'lab', title: 'peak — laboratorio pack' },
  { path: '/sito', label: 'Home', group: 'sito', title: 'peak — la creatina, evoluta' },
  { path: '/prodotto', label: 'Prodotto', group: 'sito', title: 'peak — Creatina + Glicina + Vitamina D3' },
  { path: '/formula', label: 'La formula', group: 'sito', title: 'peak — la formula CreaVida™' },
]

export const LAB_NAV = ROUTES.filter((r) => r.group === 'lab').map((r) => ({ href: to(r.path), label: r.label }))

/** Le rotte vecchie, per i link gia' in giro. */
const ALIASES: Record<string, RoutePath> = {
  '/design-system': '/',
  '/showcase': '/',
  '/home': '/sito',
  '/landing': '/sito',
  '/product': '/prodotto',
}

/** Le voci del sito, con le ancore della sua home. Le legge l'header. */
export const SITE_NAV = [
  { href: to('/prodotto'), label: 'Prodotto' },
  { href: to('/formula'), label: 'La formula' },
  { href: to('/sito', 'come-funziona'), label: 'Come funziona' },
  { href: to('/sito', 'domande'), label: 'Domande' },
] as const

export const STUDIO_NAV = [
  { href: to('/'), label: 'Design system' },
  { href: to('/prototipi'), label: 'Prototipi' },
] as const

/**
 * Le sezioni del design system, cioe' della home. Stanno qui e non nella
 * pagina perche' le legge anche il footer: senza header, i link in fondo sono
 * l'unico indice del sistema.
 */
export const SYSTEM_NAV = [
  { id: 'scheda', label: '00 · La scheda' },
  { id: 'logo', label: '01 · Logo' },
  { id: 'simbolo', label: '02 · Simbolo' },
  { id: 'colore', label: '03 · Colore' },
  { id: 'tipografia', label: '04 · Tipografia' },
  { id: 'gusti', label: '05 · Gusti' },
  { id: 'packaging', label: '06 · Packaging' },
  { id: 'componenti', label: '07 · Componenti chiave' },
  { id: 'voce', label: '08 · Voce in breve' },
  { id: 'laboratori', label: '09 · Laboratori' },
  { id: 'dettagli', label: 'Dettagli tecnici' },
] as const

/** Costruisce un href: `to('/prodotto')` -> `#/prodotto`, `to('/', 'colore')` -> `#/#colore`. */
export function to(path: RoutePath, anchor?: string): string {
  return anchor ? `#${path}#${anchor}` : `#${path}`
}

export interface ParsedHash {
  path: RoutePath
  anchor: string | null
}

export function parseHash(hash: string): ParsedHash {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const [pathPart, anchorPart] = raw.split('#')
  const candidate = (pathPart || '/').replace(/\/+$/, '') || '/'
  const resolved = (ALIASES[candidate] ?? candidate) as RoutePath
  const known = ROUTES.some((r) => r.path === resolved)
  return { path: known ? resolved : '/', anchor: anchorPart || null }
}

export function routeSpec(path: RoutePath): RouteSpec {
  return ROUTES.find((r) => r.path === path) ?? ROUTES[0]
}
