/**
 * peak — le rotte del sito.
 *
 * Il routing e' sull'hash, senza dipendenze: `#/prodotto`. Un'ancora dentro la
 * pagina si scrive dopo un secondo cancelletto: `#/#come-funziona` porta alla
 * home e scorre alla sezione. Le rotte della 1.0 restano come alias.
 */

export type RoutePath = '/' | '/prodotto' | '/formula' | '/design-system' | '/prototipi'

export interface RouteSpec {
  path: RoutePath
  label: string
  /** Il gruppo di navigazione: il sito, o lo studio (design system e prototipi). */
  group: 'sito' | 'studio'
  title: string
}

export const ROUTES: readonly RouteSpec[] = [
  { path: '/', label: 'Home', group: 'sito', title: 'peak — la creatina, evoluta' },
  { path: '/prodotto', label: 'Prodotto', group: 'sito', title: 'peak — Creatina + Glicina + Vitamina D3' },
  { path: '/formula', label: 'La formula', group: 'sito', title: 'peak — la formula CreaVida™' },
  { path: '/design-system', label: 'Design system', group: 'studio', title: 'peak — design system 2.0' },
  { path: '/prototipi', label: 'Prototipi', group: 'studio', title: 'peak — prototipi' },
]

/** Le rotte della 1.0, per i link gia' in giro. */
const ALIASES: Record<string, RoutePath> = {
  '/showcase': '/design-system',
  '/landing': '/',
  '/product': '/prodotto',
}

/** Le voci del menu del sito, con le ancore della home. */
export const SITE_NAV = [
  { href: to('/prodotto'), label: 'Prodotto' },
  { href: to('/formula'), label: 'La formula' },
  { href: to('/', 'come-funziona'), label: 'Come funziona' },
  { href: to('/', 'domande'), label: 'Domande' },
] as const

export const STUDIO_NAV = [
  { href: to('/design-system'), label: 'Design system 2.0' },
  { href: to('/prototipi'), label: 'Prototipi' },
] as const

/** Costruisce un href: `to('/prodotto')` -> `#/prodotto`, `to('/', 'domande')` -> `#/#domande`. */
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
