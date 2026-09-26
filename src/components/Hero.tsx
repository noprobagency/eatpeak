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
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 3.0: due regimi di colore. `default` su carta e bianco (testo cacao), `deep`
 * sui campi brand scuri (arancia 600, lime 700: testo bianco). L'occhiello e'
 * nel font display, sentence case, mai in mono.
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

interface HeroBase {
  eyebrow?: ReactNode
  /** Contenuto della colonna visiva: pack, foto, <BustaPack />. */
  visual?: ReactNode
  body?: ReactNode
  actions?: ReactNode
  /** Riga di prove sotto le azioni. In genere <TrustRow /> o un <Badge />. */
  proof?: ReactNode
  tone?: 'default' | 'deep'
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
    tone = 'default', locale = 'it', className, authorizedClaim,
  } = props

  const deep = tone === 'deep'
  const dim = deep ? 'text-neutral-0/90' : 'text-text-secondary'
  const faint = deep ? 'text-neutral-0/80' : 'text-text-muted'
  const strong = deep ? 'text-text-inverse' : 'text-text-primary'
  const eyebrowColor = deep ? 'text-neutral-0/90' : 'text-text-brand'

  return (
    <div className={cn('grid items-center gap-12 lg:grid-cols-2 lg:gap-16', className)}>
      <div className="flex flex-col gap-6">
        {eyebrow && <p className={cn('type-eyebrow', eyebrowColor)}>{eyebrow}</p>}

        <h1 className={cn('type-display-xl', strong)}>{headline}</h1>

        {body && <div className={cn('max-w-prose text-body-lg md:text-heading-md md:font-normal', dim)}>{body}</div>}

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
