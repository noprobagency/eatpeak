/**
 * <SiteFooter /> — il piede del sito (H15, archetipo A).
 *
 * Fondo ambra 400 con la grana (3.1), il wordmark bianco a tutta larghezza
 * che si scompone in retino al passaggio (H3, solo desktop), il sign-off del
 * brand con i claim autorizzati nello stesso blocco (articolo 10(3)), i
 * link, le note legali. Sull'ambra il testo e' tutto cacao 900 (7,4:1): i
 * grigi e il bianco non reggono. Il wordmark resta bianco: e' un logo, e la
 * regola del logo (3.1) e' bianco su ogni fondo colore. Niente nero.
 */

import { Grain, VertexBreath, WordmarkHalftone } from '../brand'
import { authorizedClaimText } from '../lib/compliance'
import { CLAIMS, PRODUCT } from '../lib/copy'
import { LAB_NAV, SITE_NAV, STUDIO_NAV, to } from '../lib/routes'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-bg-brand text-text-on-brand" data-ref="Dosys · footer">
      <Grain />
      <div className="relative mx-auto flex max-w-container flex-col gap-12 px-6 pb-12 pt-20 md:px-[28px]">
        {/* Il wordmark enorme, in chiusura. Desktop: il retino al passaggio. */}
        <div className="hidden md:block">
          <WordmarkHalftone color="#FFFFFF" />
        </div>
        <div className="md:hidden">
          <VertexBreath size={48} variant="free" color="cacao" title="peak" />
        </div>

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="type-display-sm normal-case text-text-on-brand">{CLAIMS.signOff.it}</p>
            <p className="max-w-prose text-body-sm text-text-on-brand" data-compliance="authorized-claim">
              {authorizedClaimText('physical-performance')} {authorizedClaimText('muscle-strength-55plus')}
            </p>
            <p className="max-w-prose text-body-sm text-text-on-brand">{CLAIMS.audience.it}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-label text-text-on-brand">Il sito</p>
            {SITE_NAV.map((l) => (
              <a key={l.href} href={l.href} className="peak-link w-fit text-body-sm font-display font-bold text-text-on-brand">
                {l.label}
              </a>
            ))}
            <a href={to('/', 'garanzia')} className="peak-link w-fit text-body-sm font-display font-bold text-text-on-brand">Garanzia Rituale Completo</a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-label text-text-on-brand">Aiuto</p>
            {['Spedizioni', 'Assistenza su WhatsApp', 'Il mio account'].map((l) => (
              <a key={l} href={to('/prodotto')} className="peak-link w-fit text-body-sm font-display font-bold text-text-on-brand">{l}</a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-label text-text-on-brand">Lo studio</p>
            {STUDIO_NAV.map((l) => (
              <a key={l.href} href={l.href} className="peak-link w-fit text-body-sm font-display font-bold text-text-on-brand">{l.label}</a>
            ))}
            {LAB_NAV.map((l) => (
              <a key={l.href} href={l.href} className="w-fit text-body-sm text-text-on-brand underline-offset-4 hover:underline">{l.label}</a>
            ))}
            <a href={to('/prototipi', 'archivio-v1')} className="w-fit text-body-sm text-text-on-brand underline-offset-4 hover:underline">Archivio 1.0 · agosto 2026</a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-cacao-900/20 pt-8 text-body-sm text-text-on-brand">
          <p>Integratore alimentare · {PRODUCT.formulaLine} · vegan. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano. Non superare la dose giornaliera consigliata.</p>
          <p className="text-text-on-brand">[Ragione sociale] · P. IVA [numero] · integratore alimentare notificato al Ministero della Salute · sito dimostrativo, nessun ordine viene evaso.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
