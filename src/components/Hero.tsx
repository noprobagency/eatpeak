/**
 * <Hero /> — la prima schermata.
 *
 * QUANDO USARLO: in cima a una landing o a una pagina prodotto.
 * QUANDO NO: piu' di una volta per pagina. Due hero significano nessuna hero.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Il sign-off di peak — "Il piacere di sentirsi al picco" — e' un beneficio
 * generico ai sensi dell'articolo 10(3). Se lo usi come headline, la prop
 * `authorizedClaim` e' obbligatoria e il claim EFSA viene stampato nella stessa
 * schermata. La brand line "La creatina, evoluta." non lo e': e' descrittiva.
 * Vedi docs/06-compliance.md.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

interface HeroBase {
  eyebrow?: string
  /** Contenuto della colonna visiva: pack, foto, <BustaPack />. */
  visual?: ReactNode
  body?: ReactNode
  actions?: ReactNode
  /** Riga di prove sotto le azioni. In genere <TrustRow /> o un <Badge />. */
  proof?: ReactNode
  /**
   * Il tono del fondo. `flavor` e' un campo colore-gusto: il titolo va bianco
   * (testo grande), il corpo resta inchiostro.
   */
  tone?: 'page' | 'warm' | 'flavor' | 'inverse'
  locale?: Locale
  className?: string
}

export type HeroProps = HeroBase &
  (
    | { headline: ReactNode; usesShortClaim: true; authorizedClaim: AuthorizedClaimId }
    | { headline: ReactNode; usesShortClaim?: false; authorizedClaim?: AuthorizedClaimId }
  )

export function Hero(props: HeroProps) {
  const {
    eyebrow, headline, body, actions, proof, visual,
    tone = 'page', locale = 'it', className, authorizedClaim,
  } = props

  const onFlavor = tone === 'flavor'
  const inverse = tone === 'inverse'
  const dim = onFlavor ? 'text-neutral-900/85' : inverse ? 'text-neutral-0/85' : 'text-text-secondary'
  const faint = onFlavor ? 'text-neutral-900/75' : inverse ? 'text-neutral-0/70' : 'text-text-muted'
  const strong = onFlavor ? 'text-text-on-flavor' : inverse ? 'text-text-inverse' : 'text-text-primary'

  return (
    <div className={cn('grid items-center gap-12 lg:grid-cols-2 lg:gap-16', className)}>
      <div className="flex flex-col gap-6">
        {eyebrow && <p className={cn('type-mono-md', faint)}>{eyebrow}</p>}

        <h1 className={cn('type-display-lg xl:text-display-xl', strong)}>{headline}</h1>

        {body && <div className={cn('max-w-prose text-body-lg', dim)}>{body}</div>}

        {authorizedClaim && (
          <p className={cn('max-w-prose text-body-sm', faint)} data-compliance="authorized-claim">
            {authorizedClaimText(authorizedClaim, locale)}
          </p>
        )}

        {actions && <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>}
        {proof && <div className="pt-2">{proof}</div>}
      </div>

      {visual && <div className="flex justify-center lg:justify-end">{visual}</div>}
    </div>
  )
}

export default Hero
