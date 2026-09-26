/**
 * <SectionHeader /> — occhiello mono + titolo display minuscolo.
 *
 * QUANDO USARLO: in apertura di ogni sezione di pagina.
 * QUANDO NO: dentro una card. Li' basta un <h3> con la classe type-heading-lg:
 * l'occhiello mono a quella scala diventa rumore.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Se il titolo e' un beneficio generico — "il piacere di sentirsi al picco",
 * "stare bene", "dare il massimo" — ricade nell'articolo 10(3) ed e' ammesso
 * SOLO se un claim autorizzato compare nelle immediate vicinanze. Qui il
 * vincolo e' nei tipi: passando `genericBenefit`, `authorizedClaim` diventa
 * obbligatoria e il claim EFSA viene stampato sotto il titolo.
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
   * `inverse` su inchiostro, `flavor` su un campo colore-gusto pieno (titolo
   * bianco, corpo inchiostro), `default` su bianco, carta e tint.
   */
  tone?: 'default' | 'inverse' | 'flavor'
  size?: 'sm' | 'md' | 'lg'
  locale?: Locale
  className?: string
  /** Il tag del titolo. `h2` di default; `h1` quando apre la pagina. */
  as?: 'h1' | 'h2' | 'h3'
}

export type SectionHeaderProps = SectionHeaderBase &
  (
    | { genericBenefit: true; authorizedClaim: AuthorizedClaimId }
    | { genericBenefit?: false; authorizedClaim?: AuthorizedClaimId }
  )

const TITLE_SIZE = { sm: 'type-display-sm', md: 'type-display-md', lg: 'type-display-lg' } as const

export function SectionHeader(props: SectionHeaderProps) {
  const {
    eyebrow, title, body, align = 'left', tone = 'default',
    size = 'md', locale = 'it', className, authorizedClaim, as: Title = 'h2',
  } = props

  const onFlavor = tone === 'flavor'
  const inverse = tone === 'inverse'
  const faint = onFlavor ? 'text-neutral-900/75' : inverse ? 'text-neutral-0/70' : 'text-text-muted'
  const dim = onFlavor ? 'text-neutral-900/85' : inverse ? 'text-neutral-0/85' : 'text-text-secondary'
  const strong = onFlavor ? 'text-text-on-flavor' : inverse ? 'text-text-inverse' : 'text-text-primary'

  return (
    <header className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && <p className={cn('type-mono-md', faint)}>{eyebrow}</p>}

      <Title className={cn(TITLE_SIZE[size], strong)}>{title}</Title>

      {body && <div className={cn('max-w-prose text-body-lg', dim)}>{body}</div>}

      {authorizedClaim && (
        <p className={cn('max-w-prose text-body-sm', faint)} data-compliance="authorized-claim">
          {authorizedClaimText(authorizedClaim, locale)}
        </p>
      )}
    </header>
  )
}

export default SectionHeader
