/**
 * ProductDemo — la pagina prodotto.
 *
 * Differenza di intento rispetto alla landing: qui chi legge ha gia' deciso di
 * valutare il prodotto. Quindi niente racconto lungo — sopra ci sono il prezzo,
 * il formato e il pulsante; sotto ci sono i dettagli per chi li cerca.
 *
 * La barra sticky compare quando il pulsante principale esce dallo schermo.
 * Su mobile e' l'unico modo per non perdere l'acquisto a meta' scroll.
 */

import { useRef, useState } from 'react'
import {
  Accordion, Badge, Button, Container, DoseSeal, Grid, IngredientPanel,
  PriceTiers, ReviewCard, Section, SectionHeader, StickPack, StickyAddToCart,
  Tabs, Toast, ToastStack, TrustRow,
} from '../components'
import { CLAIMS, PRICE_TIERS, PRODUCT, REVIEWS, formatEur, pricePerDay } from '../lib/copy'
import { authorizedClaimText } from '../lib/compliance'
import { cn } from '../lib/cn'

/** Le viste della galleria. Un disegno vale finche' non c'e' la foto vera. */
const GALLERY = [
  { id: 'pack', label: 'La confezione', band: '#E9724C', body: '#FCD589', ink: '#47190E' },
  { id: 'stick', label: 'Lo stick', band: '#D45E39', body: '#FDF2DC', ink: '#47190E' },
  { id: 'forest', label: 'In viaggio', band: '#2F6E5E', body: '#D6E5E0', ink: '#102D26' },
] as const

export function ProductDemo() {
  const [tier, setTier] = useState(1)
  const [shot, setShot] = useState<(typeof GALLERY)[number]['id']>('pack')
  const [toast, setToast] = useState(false)
  const buyButton = useRef<HTMLDivElement>(null)

  const selected = PRICE_TIERS.find((t) => t.units === tier) ?? PRICE_TIERS[0]
  const view = GALLERY.find((g) => g.id === shot) ?? GALLERY[0]

  return (
    <>
      <Section tone="page" spacing="tight">
        <Container>
          <nav aria-label="Percorso" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-mono-sm uppercase text-text-muted">
              <li><a href="#/landing" className="transition-colors hover:text-text-brand">peak</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="#" className="transition-colors hover:text-text-brand">Integratori</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-primary">Creatina monoidrato</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* --- galleria --------------------------------------------- */}
            <div className="flex flex-col gap-4">
              <div className="relative flex items-center justify-center rounded-xl bg-bg-warm p-12">
                <Badge tone="honey" variant="solid" className="absolute left-6 top-6">
                  {PRODUCT.days} giorni
                </Badge>
                <StickPack height={400} band={view.band} body={view.body} ink={view.ink} title={view.label} />
                <DoseSeal
                  value={PRODUCT.dose}
                  unit={PRODUCT.doseUnit}
                  caption="per stick"
                  size={104}
                  className="absolute bottom-6 right-6"
                />
              </div>

              <div className="flex gap-3" role="tablist" aria-label="Immagini del prodotto">
                {GALLERY.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={g.id === shot}
                    onClick={() => setShot(g.id)}
                    className={cn(
                      'flex flex-1 items-center justify-center rounded-md border bg-bg-warm p-4 transition-colors duration-base',
                      g.id === shot ? 'border-border-brand' : 'border-border-subtle hover:border-border-strong',
                    )}
                  >
                    <StickPack height={72} band={g.band} body={g.body} ink={g.ink} title={g.label} />
                  </button>
                ))}
              </div>
            </div>

            {/* --- acquisto --------------------------------------------- */}
            <div className="flex flex-col gap-6">
              <SectionHeader
                eyebrow={`integratore alimentare · ${PRODUCT.format}`}
                title="creatina monoidrato"
                size="md"
                body={CLAIMS.product.it}
              />

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="type-display-sm text-text-primary">{formatEur(selected.priceEur)}</span>
                <span className="font-mono text-mono-md uppercase text-text-secondary">
                  {pricePerDay(selected.priceEur, selected.days)} al giorno
                </span>
              </div>

              <PriceTiers value={tier} onChange={setTier} />

              <div ref={buyButton} className="flex flex-col gap-3">
                <Button size="lg" fullWidth onClick={() => setToast(true)}>
                  Aggiungi al carrello
                </Button>
                <p className="text-center font-mono text-mono-sm uppercase text-text-muted">
                  Spedizione gratuita da {PRODUCT.freeShippingFromUnits} confezioni · consegna in 2-4 giorni
                </p>
              </div>

              <TrustRow variant="compact" />

              {/*
                Il claim autorizzato sta sopra la piega, accanto al prezzo: e'
                il punto in cui l'utente decide, ed e' li' che l'articolo 10(3)
                vuole la copertura.
              */}
              <p className="text-body-sm text-text-muted" data-compliance="authorized-claim">
                {authorizedClaimText('physical-performance')}
              </p>

              <Tabs
                items={[
                  {
                    id: 'come',
                    label: 'Come si prende',
                    content: (
                      <div className="flex flex-col gap-3">
                        <p>{CLAIMS.gesture.it}</p>
                        <p>
                          Uno stick al giorno in un bicchiere d’acqua a temperatura ambiente. L’orario non
                          conta: conta che sia tutti i giorni.
                        </p>
                      </div>
                    ),
                  },
                  {
                    id: 'cosa',
                    label: 'Cosa contiene',
                    content: (
                      <p>
                        Creatina monoidrato al 100%. Nessun additivo, nessun dolcificante, nessun aroma.
                        {' '}{PRODUCT.dose} g per stick, {PRODUCT.days} stick per confezione.
                      </p>
                    ),
                  },
                  {
                    id: 'spedizione',
                    label: 'Spedizione',
                    content: (
                      <p>
                        Consegna in 2-4 giorni lavorativi in Italia. Spedizione gratuita da{' '}
                        {PRODUCT.freeShippingFromUnits} confezioni. Reso entro 14 giorni sui prodotti sigillati.
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- composizione ------------------------------------------------ */}
      <Section tone="surface">
        <Container width="narrow">
          <SectionHeader eyebrow="composizione" title="tutto quello che c’e’ dentro" />
          <div className="mt-10">
            <IngredientPanel />
          </div>
        </Container>
      </Section>

      {/* --- domande ----------------------------------------------------- */}
      <Section tone="page">
        <Container width="narrow">
          <SectionHeader eyebrow="dettagli" title="prima di ordinare" />
          <div className="mt-10">
            <Accordion
              single
              items={[
                {
                  title: 'Conservazione',
                  content: 'A temperatura ambiente, al riparo dalla luce diretta. Gli stick sono sigillati singolarmente: una volta aperto uno, gli altri restano protetti.',
                },
                {
                  title: 'Spedizioni e resi',
                  content: `Consegna in 2-4 giorni lavorativi in Italia. Spedizione gratuita da ${PRODUCT.freeShippingFromUnits} confezioni. Reso entro 14 giorni sui prodotti sigillati.`,
                },
                {
                  title: 'Avvertenze',
                  content: 'Non superare la dose giornaliera consigliata. Tenere fuori dalla portata dei bambini sotto i tre anni. Gli integratori non vanno intesi come sostituti di una dieta variata ed equilibrata e di uno stile di vita sano.',
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* --- recensioni -------------------------------------------------- */}
      <Section tone="warm">
        <Container>
          <SectionHeader eyebrow="recensioni" title="chi la prende da un po’" />
          <div className="mt-10">
            <Grid cols={3}>
              {REVIEWS.map((r) => (
                <ReviewCard key={r.author} stars={r.stars as 4 | 5} text={r.text} author={r.author} benefit={r.benefit} verified />
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      <StickyAddToCart
        name="creatina monoidrato"
        detail={`${selected.label} · ${pricePerDay(selected.priceEur, selected.days)} al giorno`}
        priceEur={selected.priceEur}
        watch={buyButton}
        onAddToCart={() => setToast(true)}
      />

      {toast && (
        <ToastStack position="bottom-center">
          <Toast tone="success" onDismiss={() => setToast(false)}>
            Aggiunto al carrello — {selected.label}.
          </Toast>
        </ToastStack>
      )}
    </>
  )
}

export default ProductDemo
