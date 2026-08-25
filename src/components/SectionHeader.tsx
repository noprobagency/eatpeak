/**
 * <SectionHeader /> — occhiello mono + titolo display minuscolo.
 *
 * QUANDO USARLO: in apertura di ogni sezione di pagina.
 * QUANDO NO: dentro una card. Li' basta un <h3> con la classe type-heading-lg:
 * l'occhiello mono a quella scala diventa rumore.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Se il titolo e' un beneficio generico — "il piacere di sentirsi al picco",
 * "stare bene", "dare il massimo" — ricade nell'articolo 10(3) del Regolamento
 * UE 1924/2006 ed e' ammesso SOLO se un claim autorizzato compare nelle
 * immediate vicinanze.
 *
 * Qui il vincolo e' nei tipi: passando `genericBenefit`, `authorizedClaim`
 * diventa obbligatoria e il claim EFSA viene stampato sotto il titolo. Non c'e'
 * modo di usare il claim corto senza la sua copertura.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

interface SectionHeaderBase {
  /** Occhiello in mono maiuscolo. Breve: due o tre parole. */
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  /**
   * `inverse` sui fondi scuri (bosco, inchiostro), `brand` su terracotta 400.
   * Sono due toni distinti perche' su terracotta il bianco arriva solo a 3:1:
   * va bene per il titolo, non per il corpo. Vedi docs/02-tokens.md.
   */
  tone?: 'default' | 'inverse' | 'brand'
  size?: 'md' | 'lg'
  locale?: Locale
  className?: string
}

/**
 * Union discriminata: `genericBenefit: true` rende `authorizedClaim`
 * obbligatoria. E' il punto in cui la compliance smette di essere una regola
 * da ricordare e diventa un errore di compilazione.
 */
export type SectionHeaderProps = SectionHeaderBase &
  (
    | { genericBenefit: true; authorizedClaim: AuthorizedClaimId }
    | { genericBenefit?: false; authorizedClaim?: AuthorizedClaimId }
  )

const TITLE_SIZE = { md: 'type-display-md', lg: 'type-display-lg' } as const

export function SectionHeader(props: SectionHeaderProps) {
  const {
    eyebrow, title, body, align = 'left', tone = 'default',
    size = 'md', locale = 'it', className, authorizedClaim,
  } = props

  const onBrand = tone === 'brand'
  const inverse = tone === 'inverse'
  const faint = onBrand ? 'text-terracotta-900/70' : inverse ? 'text-neutral-0/70' : 'text-text-muted'
  const dim = onBrand ? 'text-terracotta-900/85' : inverse ? 'text-neutral-0/85' : 'text-text-secondary'
  const strong = onBrand ? 'text-text-on-brand-large' : inverse ? 'text-text-inverse' : 'text-text-primary'

  return (
    <header
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className={cn('type-mono-md', faint)}>{eyebrow}</p>
      )}

      <h2 className={cn(TITLE_SIZE[size], strong)}>{title}</h2>

      {body && (
        <div className={cn('max-w-prose text-body-lg', dim)}>{body}</div>
      )}

      {authorizedClaim && (
        <p
          className={cn('max-w-prose text-body-sm', faint)}
          data-compliance="authorized-claim"
        >
          {authorizedClaimText(authorizedClaim, locale)}
        </p>
      )}
    </header>
  )
}

export default SectionHeader
