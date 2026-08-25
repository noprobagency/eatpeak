/**
 * <Hero /> — la prima schermata.
 *
 * QUANDO USARLO: in cima a una landing o a una pagina prodotto.
 * QUANDO NO: piu' di una volta per pagina. Due hero significano nessuna hero.
 *
 * ─── VINCOLO DI COMPLIANCE ───────────────────────────────────────────────
 * Il claim corto di peak — "Il piacere di sentirsi al picco" — e' un beneficio
 * generico ai sensi dell'articolo 10(3). Se lo usi come headline, la prop
 * `authorizedClaim` e' obbligatoria e il claim EFSA viene stampato nella stessa
 * schermata. Vedi docs/06-compliance.md.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { authorizedClaimText, type AuthorizedClaimId, type Locale } from '../lib/compliance'

interface HeroBase {
  eyebrow?: string
  /** Contenuto della colonna visiva: pack, foto, <StickPack />. */
  visual?: ReactNode
  body?: ReactNode
  actions?: ReactNode
  /** Riga di prove sotto le azioni. In genere <TrustRow /> o un <Badge />. */
  proof?: ReactNode
  tone?: 'page' | 'warm' | 'brand' | 'forest'
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
    tone = 'warm', locale = 'it', className, authorizedClaim,
  } = props

  // Tre regimi, non due. Su terracotta 400 il bianco arriva solo a 3:1: passa
  // per il titolo, che e' grande, ma non per il corpo. Su bosco il bianco e'
  // a 5.98:1 e va bene ovunque. Vedi docs/02-tokens.md.
  const onBrand = tone === 'brand'
  const inverse = tone === 'forest'
  const dim = onBrand ? 'text-terracotta-900/80' : inverse ? 'text-neutral-0/85' : 'text-text-secondary'
  const faint = onBrand ? 'text-terracotta-900/70' : inverse ? 'text-neutral-0/70' : 'text-text-muted'
  const strong = onBrand ? 'text-text-on-brand' : inverse ? 'text-text-inverse' : 'text-text-primary'

  return (
    <div className={cn('grid items-center gap-12 lg:grid-cols-2 lg:gap-16', className)}>
      <div className="flex flex-col gap-6">
        {eyebrow && (
          <p className={cn('type-mono-md', faint)}>{eyebrow}</p>
        )}

        <h1
          className={cn(
            'type-display-lg xl:text-display-xl',
            // Il titolo e' testo grande: su terracotta il bianco e' ammesso.
            onBrand ? 'text-text-on-brand-large' : strong,
          )}
        >
          {headline}
        </h1>

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

        {actions && <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>}
        {proof && <div className="pt-2">{proof}</div>}
      </div>

      {visual && <div className="flex justify-center lg:justify-end">{visual}</div>}
    </div>
  )
}

export default Hero
