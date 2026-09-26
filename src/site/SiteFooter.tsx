/**
 * <SiteFooter /> — il piede del sito (H15, archetipo A).
 *
 * Fondo arancia 600 con la grana, il wordmark bianco a tutta larghezza che
 * si scompone in retino al passaggio (H3, solo desktop), il sign-off del
 * brand con i claim autorizzati nello stesso blocco (articolo 10(3)), i
 * link, le note legali. Niente nero, da nessuna parte.
 */

import { Grain, VertexBreath, WordmarkHalftone } from '../brand'
import { authorizedClaimText } from '../lib/compliance'
import { CLAIMS, PRODUCT } from '../lib/copy'
import { LAB_NAV, SITE_NAV, STUDIO_NAV, to } from '../lib/routes'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-bg-brand-deep text-text-inverse" data-ref="Dosys · footer">
      <Grain />
      <div className="relative mx-auto flex max-w-container flex-col gap-12 px-6 pb-12 pt-20 md:px-[28px]">
        {/* Il wordmark enorme, in chiusura. Desktop: il retino al passaggio. */}
        <div className="hidden md:block">
          <WordmarkHalftone color="#FFFFFF" />
        </div>
        <div className="md:hidden">
          <VertexBreath size={48} variant="free" color="white" title="peak" />
        </div>

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="type-display-sm normal-case text-neutral-0">{CLAIMS.signOff.it}</p>
            <p className="max-w-prose text-body-sm text-neutral-0/85" data-compliance="authorized-claim">
              {authorizedClaimText('physical-performance')} {authorizedClaimText('muscle-strength-55plus')}
            </p>
            <p className="max-w-prose text-body-sm text-neutral-0/85">{CLAIMS.audience.it}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-label text-neutral-0/70">Il sito</p>
            {SITE_NAV.map((l) => (
              <a key={l.href} href={l.href} className="peak-link w-fit text-body-sm font-display font-bold text-neutral-0">
                {l.label}
              </a>
            ))}
            <a href={to('/', 'garanzia')} className="peak-link w-fit text-body-sm font-display font-bold text-neutral-0">Garanzia Rituale Completo</a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-label text-neutral-0/70">Aiuto</p>
            {['Spedizioni', 'Assistenza su WhatsApp', 'Il mio account'].map((l) => (
              <a key={l} href={to('/prodotto')} className="peak-link w-fit text-body-sm font-display font-bold text-neutral-0">{l}</a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-label text-neutral-0/70">Lo studio</p>
            {STUDIO_NAV.map((l) => (
              <a key={l.href} href={l.href} className="peak-link w-fit text-body-sm font-display font-bold text-neutral-0">{l.label}</a>
            ))}
            {LAB_NAV.map((l) => (
              <a key={l.href} href={l.href} className="w-fit text-body-sm text-neutral-0/80 hover:text-neutral-0">{l.label}</a>
            ))}
            <a href={to('/prototipi', 'archivio-v1')} className="w-fit text-body-sm text-neutral-0/70 hover:text-neutral-0">Archivio 1.0 · agosto 2026</a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/25 pt-8 text-body-sm text-neutral-0/85">
          <p>Integratore alimentare · {PRODUCT.formulaLine} · vegan. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano. Non superare la dose giornaliera consigliata.</p>
          <p className="text-neutral-0/70">[Ragione sociale] · P. IVA [numero] · integratore alimentare notificato al Ministero della Salute · sito dimostrativo, nessun ordine viene evaso.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
