/**
 * <SectionHeader /> — occhiello + titolo display minuscolo.
 *
 * QUANDO USARLO: in apertura di ogni sezione di pagina.
 * QUANDO NO: dentro una card. Li' basta un <h3> con la classe type-heading-lg.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Se il titolo e' un beneficio generico — "il piacere di sentirsi al picco",
 * "stare bene", "dare il massimo" — ricade nell'articolo 10(3) ed e' ammesso
 * SOLO se un claim autorizzato compare nelle immediate vicinanze. Qui il
 * vincolo e' nei tipi: passando `genericBenefit`, `authorizedClaim` diventa
 * obbligatoria e il claim EFSA viene stampato sotto il titolo.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 3.0: l'occhiello e' nel font display, peso 600, sentence case, arancia 600.
 * Niente mono, niente maiuscolo tracciato. Il titolo accetta JSX: la parola in
 * corsivo si scrive con <Em>.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

interface SectionHeaderBase {
  /** Occhiello, sentence case, due o tre parole. */
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  /** `deep` sui campi brand scuri (arancia 600, lime 700): testo bianco. */
  tone?: 'default' | 'deep'
  size?: 'sm' | 'md' | 'lg' | 'xl'
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

const TITLE_SIZE = { sm: 'type-display-sm', md: 'type-display-md', lg: 'type-display-lg', xl: 'type-display-xl' } as const

export function SectionHeader(props: SectionHeaderProps) {
  const {
    eyebrow, title, body, align = 'left', tone = 'default',
    size = 'lg', locale = 'it', className, authorizedClaim, as: Title = 'h2',
  } = props

  const deep = tone === 'deep'
  const faint = deep ? 'text-neutral-0/80' : 'text-text-muted'
  const dim = deep ? 'text-neutral-0/90' : 'text-text-secondary'
  const strong = deep ? 'text-text-inverse' : 'text-text-primary'
  const eyebrowColor = deep ? 'text-neutral-0/90' : 'text-text-brand'

  return (
    <header className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && <p className={cn('type-eyebrow', eyebrowColor)}>{eyebrow}</p>}

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

/**
 * <Em /> — la parola in corsivo. Al massimo una per titolo: e' quella
 * emotiva, in Fraunces Italic. `?italic=0` la spegne (html[data-italic="0"]).
 */
export function Em({ children }: { children: ReactNode }) {
  return <em className="peak-em">{children}</em>
}

export default SectionHeader
