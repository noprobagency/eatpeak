/**
 * <SiteFooter /> — il piede del sito (H15, archetipo A), forma awenlab.
 *
 * Il riferimento e' il piede di awenlab.com: non una fascia a tutta larghezza ma un
 * pannello staccato, con i raggi grandi e un margine di carta attorno, che
 * chiude la pagina come una scheda. Dentro, due colonne: a sinistra il
 * marchio con la firma e i social, a destra le liste; sotto, la riga delle
 * informative e la riga legale con la firma dello studio.
 *
 * Della forma awenlab prendiamo la struttura, non i colori: il pannello e' ambra
 * 400 con la grana e tutto il testo e' cacao 900 (7,4:1). Sull'ambra i grigi
 * e il bianco non reggono; il marchio invece resta bianco, perche' la regola
 * del logo (3.1) e' bianco su ogni fondo colore. Niente nero.
 *
 * I claim autorizzati stanno nello stesso blocco della firma (articolo
 * 10(3)). Contatti e dati d'impresa sono segnaposto in parentesi quadre: il
 * sito e' dimostrativo e non si inventano numeri.
 */

import type { ReactNode } from 'react'
import { Grain, Lockup } from '../brand'
import { authorizedClaimText } from '../lib/compliance'
import { CLAIMS, PRODUCT } from '../lib/copy'
import { LAB_NAV, SITE_NAV, STUDIO_NAV, to } from '../lib/routes'

/**
 * Le pagine di servizio e i profili social non esistono nel sito simulato:
 * il link riporta in home invece di rompersi.
 */
const SEGNAPOSTO = to('/')

const INFORMATIVE = [
  'Informativa sulla privacy',
  'Informativa sui rimborsi',
  'Recapiti',
  'Termini e condizioni',
  'Informativa sulle spedizioni',
  'Informativa legale',
  'Preferenze cookie',
] as const

/** Il titolo di una lista: etichetta piccola e un filo che arriva a fondo colonna. */
function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-cacao-900/25 pb-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-text-on-brand">
      {children}
    </h2>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a href={href} className="peak-link w-fit font-display text-body-sm font-bold uppercase tracking-[0.04em] text-text-on-brand">
        {children}
      </a>
    </li>
  )
}

/** Un contatto: il segno e la riga, allineati sulla prima linea di testo. */
function Contact({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <li>
      <a href={href} className="inline-flex items-center gap-2 text-body-sm text-text-on-brand underline-offset-4 hover:underline">
        <span aria-hidden="true" className="shrink-0">{icon}</span>
        {children}
      </a>
    </li>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z" />
    </svg>
  )
}

/** Un profilo social: il cerchio vuoto del riferimento, 44px di bersaglio. */
function Social({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li>
      <a
        href={SEGNAPOSTO}
        aria-label={label}
        className="inline-flex h-control-md w-control-md items-center justify-center rounded-full border border-cacao-900/30 text-text-on-brand transition-colors duration-base ease-standard hover:bg-cacao-900 hover:text-ambra-400"
      >
        <span aria-hidden="true">{children}</span>
      </a>
    </li>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-bg-page px-4 pb-4" data-ref="awenlab · footer">
      <div className="relative overflow-hidden rounded-2xl bg-bg-brand text-text-on-brand">
        <Grain />
        <div className="relative mx-auto max-w-container px-6 pb-8 pt-16 md:px-12 md:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] lg:gap-16">
            {/* Il marchio: logo, firma, claim, social. */}
            <div>
              <a href={to('/')} aria-label="peak" className="inline-block">
                <Lockup size={32} background="brand" title="peak" />
              </a>
              <p className="mb-5 mt-6 max-w-[16ch] type-display-sm normal-case text-text-on-brand">
                {CLAIMS.signOff.it}
              </p>
              <p className="mb-2 max-w-prose text-body-sm text-text-on-brand" data-compliance="authorized-claim">
                {authorizedClaimText('physical-performance')} {authorizedClaimText('muscle-strength-55plus')}
              </p>
              <p className="max-w-prose text-body-sm text-text-on-brand">{CLAIMS.audience.it}</p>
              <ul className="mt-8 flex gap-3">
                <Social label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                    <circle cx="12" cy="12" r="3.8" />
                    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
                  </svg>
                </Social>
                <Social label="TikTok">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3v11.2a3.3 3.3 0 1 1-2.6-3.2" />
                    <path d="M14 3c.5 2.4 2 3.8 4.4 4" />
                  </svg>
                </Social>
              </ul>
            </div>

            {/* Le liste. */}
            <div className="grid gap-8 sm:grid-cols-3">
              <nav aria-label="Il sito">
                <GroupTitle>Il sito</GroupTitle>
                <ul className="flex flex-col gap-3">
                  {SITE_NAV.map((l) => (
                    <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
                  ))}
                  <FooterLink href={to('/', 'garanzia')}>Garanzia</FooterLink>
                </ul>
              </nav>

              <nav aria-label="Aiuto">
                <GroupTitle>Aiuto</GroupTitle>
                <ul className="flex flex-col gap-3">
                  {['Spedizioni', 'Resi e rimborsi', 'Il mio account'].map((l) => (
                    <FooterLink key={l} href={SEGNAPOSTO}>{l}</FooterLink>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Lo studio">
                <GroupTitle>Lo studio</GroupTitle>
                <ul className="flex flex-col gap-3">
                  {STUDIO_NAV.map((l) => (
                    <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
                  ))}
                  {LAB_NAV.map((l) => (
                    <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
                  ))}
                  <FooterLink href={to('/prototipi', 'archivio-v1')}>Archivio 1.0</FooterLink>
                </ul>
              </nav>

              <div className="sm:col-span-3">
                <GroupTitle>Contatti</GroupTitle>
                <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10">
                  <Contact href={SEGNAPOSTO} icon={<IconChat />}>WhatsApp [numero]</Contact>
                  <Contact href={SEGNAPOSTO} icon={<IconMail />}>ciao@[dominio]</Contact>
                  <Contact href={SEGNAPOSTO} icon={<IconMail />}>assistenza@[dominio]</Contact>
                </ul>
              </div>
            </div>
          </div>

          {/* La chiusura: avvertenze, informative, riga legale. */}
          <div className="mt-16 border-t border-cacao-900/20 pt-6">
            <p className="max-w-prose text-body-sm text-text-on-brand">
              Integratore alimentare · {PRODUCT.formulaLine} · vegan. Gli integratori non vanno intesi come sostituti di
              una dieta variata ed equilibrata e di uno stile di vita sano. Non superare la dose giornaliera consigliata.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {INFORMATIVE.map((l) => (
                <li key={l}>
                  <a href={SEGNAPOSTO} className="text-[11px] text-text-on-brand underline-offset-4 hover:underline">{l}</a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <p className="text-[12px] text-text-on-brand">
                peak · [Ragione sociale] · P. IVA [numero] · notificato al Ministero della Salute
              </p>
              <p className="text-[12px] text-text-on-brand">
                © {new Date().getFullYear()} peak. Sito dimostrativo, nessun ordine viene evaso.
              </p>
              <a
                href="https://noprob.agency"
                target="_blank"
                rel="noopener"
                className="inline-flex flex-col rounded-md border border-cacao-900/25 px-4 py-2 leading-tight transition-colors duration-base ease-standard hover:bg-cacao-900 hover:text-ambra-400"
              >
                <span className="text-[10px] uppercase tracking-[0.12em]">eCommerce partner</span>
                <span className="font-display text-body-sm font-bold">noprob.agency</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
