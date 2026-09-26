/**
 * <SiteFooter /> — il piede del sito.
 *
 * Su inchiostro, con il lockup bianco. Porta il sign-off del brand — che e'
 * un beneficio generico — e quindi porta anche i claim autorizzati nello
 * stesso blocco: l'articolo 10(3) chiede che la copertura sia nelle immediate
 * vicinanze, non una volta per dominio. In fondo, le quinte: design system e
 * prototipi, e l'archivio della 1.0.
 */

import { Lockup } from '../brand'
import { Badge } from '../components'
import { authorizedClaimText } from '../lib/compliance'
import { CLAIMS, PRODUCT } from '../lib/copy'
import { SITE_NAV, STUDIO_NAV, to } from '../lib/routes'

export function SiteFooter() {
  return (
    <footer className="bg-bg-brand-deep text-text-inverse">
      <div className="mx-auto flex max-w-container flex-col gap-10 px-6 py-16 md:px-[28px]">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Lockup iconSize={40} background="dark" />
            <p className="type-display-sm normal-case text-text-inverse">{CLAIMS.signOff.it}</p>
            <p className="max-w-prose text-body-sm text-neutral-0/70">{CLAIMS.audience.it}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-mono-sm text-neutral-0/50">Il sito</p>
            {SITE_NAV.map((l) => (
              <a key={l.href} href={l.href} className="text-body-sm text-neutral-0/80 transition-colors duration-fast hover:text-neutral-0">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-mono-sm text-neutral-0/50">Lo studio</p>
            {STUDIO_NAV.map((l) => (
              <a key={l.href} href={l.href} className="text-body-sm text-neutral-0/80 transition-colors duration-fast hover:text-neutral-0">
                {l.label}
              </a>
            ))}
            <a href={to('/prototipi', 'archivio-v1')} className="type-mono-sm text-neutral-0/50 transition-colors duration-fast hover:text-neutral-0/80">
              archivio 1.0 · agosto 2026
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-8">
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral" variant="soft">integratore alimentare</Badge>
            <Badge tone="neutral" variant="soft">{PRODUCT.formulaLine}</Badge>
            <Badge tone="neutral" variant="soft">vegan</Badge>
          </div>
          <p className="max-w-prose text-body-sm text-neutral-0/60" data-compliance="authorized-claim">
            {authorizedClaimText('physical-performance')} {authorizedClaimText('muscle-strength-55plus')}
          </p>
          <p className="max-w-prose text-body-sm text-neutral-0/50">
            Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno
            stile di vita sano. Non superare la dose giornaliera consigliata.
          </p>
          <p className="type-mono-sm text-neutral-0/40">peak · design system 2.0 · sito dimostrativo, nessun ordine viene evaso</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
