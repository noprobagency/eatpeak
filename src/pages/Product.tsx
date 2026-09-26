/**
 * Product — la pagina prodotto (PDP).
 *
 * Chi arriva qui ha gia' deciso di valutare il prodotto: sopra ci sono il
 * gusto, il formato, il prezzo al giorno e il pulsante; sotto i dettagli per
 * chi li cerca. La galleria e' fatta di segnaposto con il brief degli scatti,
 * piu' il render della busta che vale finche' non c'e' la foto.
 *
 * La barra sticky compare quando il pulsante principale esce dallo schermo.
 */

import { useRef, useState } from 'react'
import {
  Accordion, Badge, BustaPack, Button, Container, FaqAccordion, FlavorSelector, Grid,
  IngredientPanel, MediaPlaceholder, PackBack, PriceTiers, ReviewCard, Section, SectionHeader,
  StickyAddToCart, Tabs, Toast, ToastStack, TrustRow,
} from '../components'
import { DotField } from '../brand'
import { authorizedClaimText } from '../lib/compliance'
import {
  CLAIMS, DEFAULT_TIER, PRICE_TIERS, PRODUCT, REVIEWS, flavorById, flavorLabel, formatEur,
  pricePerDay, type FlavorId,
} from '../lib/copy'
import { shotById } from '../lib/media'
import { cn } from '../lib/cn'
import { to } from '../lib/routes'

const GALLERY_SHOTS = ['pdp-busta-fronte', 'pdp-busta-retro', 'pdp-stick-mano', 'pdp-bicchiere'] as const

export function Product() {
  const [flavor, setFlavor] = useState<FlavorId>('arancia')
  const [tier, setTier] = useState(DEFAULT_TIER)
  const [view, setView] = useState<'render' | (typeof GALLERY_SHOTS)[number]>('render')
  const [toast, setToast] = useState(false)
  const buyButton = useRef<HTMLDivElement>(null)

  const f = flavorById(flavor)
  const selected = PRICE_TIERS.find((t) => t.units === tier) ?? PRICE_TIERS[0]

  return (
    <>
      <Section tone="page" spacing="tight">
        <Container>
          <nav aria-label="Percorso" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-mono-sm uppercase text-text-muted">
              <li><a href={to('/')} className="transition-colors hover:text-text-brand">peak</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-primary">{PRODUCT.descriptor}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* --- galleria --------------------------------------------- */}
            <div className="flex flex-col gap-4">
              {view === 'render' ? (
                <div className={cn('relative flex items-center justify-center overflow-hidden rounded-xl p-10 md:p-16', f.tintToken)}>
                  <DotField
                    rows={4}
                    cols={12}
                    direction="right"
                    color={f.hex}
                    opacity={[0.08, 0.28]}
                    stretch
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 w-full"
                  />
                  <Badge tone={flavor === 'lime' ? 'lime' : 'brand'} variant="solid" className="absolute left-6 top-6">
                    {PRODUCT.days} giorni
                  </Badge>
                  <BustaPack flavor={flavor} width={300} className="relative" />
                  <p className="absolute bottom-4 right-6 type-mono-sm text-text-muted">render · foto in arrivo</p>
                </div>
              ) : (
                <MediaPlaceholder shot={shotById(view)} radius="xl" />
              )}

              <div className="grid grid-cols-5 gap-3" role="tablist" aria-label="Immagini del prodotto">
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === 'render'}
                  onClick={() => setView('render')}
                  className={cn(
                    'flex aspect-[4/5] items-center justify-center rounded-md border p-2 transition-colors duration-base',
                    f.tintToken,
                    view === 'render' ? 'border-arancia-600' : 'border-border-subtle hover:border-border-strong',
                  )}
                >
                  <BustaPack flavor={flavor} width={40} title={`Render della busta ${flavorLabel(f)}`} />
                </button>
                {GALLERY_SHOTS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={view === id}
                    onClick={() => setView(id)}
                    className={cn(
                      'overflow-hidden rounded-md border transition-colors duration-base',
                      view === id ? 'border-arancia-600' : 'border-border-subtle hover:border-border-strong',
                    )}
                  >
                    <MediaPlaceholder shot={shotById(id)} compact radius="none" className="!p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* --- acquisto --------------------------------------------- */}
            <div className="flex flex-col gap-6">
              <SectionHeader
                as="h1"
                eyebrow={`integratore alimentare · ${PRODUCT.format}`}
                title={PRODUCT.extendedName.toLowerCase()}
                size="md"
                body={CLAIMS.product.it}
              />

              <p className="type-flavor text-text-primary">{flavorLabel(f)}</p>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-display-sm tabular-nums text-text-primary">{pricePerDay(selected.priceEur, selected.days)}</span>
                <span className="font-mono text-mono-md uppercase text-text-secondary">al giorno · {formatEur(selected.priceEur)} · {selected.name}</span>
              </div>

              <FlavorSelector value={flavor} onChange={setFlavor} />

              <PriceTiers value={tier} onChange={setTier} />

              <div ref={buyButton} className="flex flex-col gap-3">
                <Button size="lg" fullWidth onClick={() => setToast(true)}>
                  Aggiungi al carrello — {formatEur(selected.priceEur)}
                </Button>
                <p className="text-center font-mono text-mono-sm uppercase text-text-muted">
                  Spedizione gratuita da {PRODUCT.freeShippingFromUnits} buste · consegna in 2-4 giorni
                  {selected.units === 1 && ` · +${formatEur(PRODUCT.shippingEur)} per una busta`}
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
                          conta: conta che sia tutti i giorni. Senza fase di carico.
                        </p>
                      </div>
                    ),
                  },
                  {
                    id: 'cosa',
                    label: 'Cosa contiene',
                    content: (
                      <p>
                        {PRODUCT.formulaLine}: creatina monoidrato ({PRODUCT.dose} {PRODUCT.doseUnit} per stick), glicina e
                        vitamina D3 vegana. Aromi naturali del gusto {f.name}. La tabella completa è qui sotto, con i
                        valori del laboratorio dove già ci sono.
                      </p>
                    ),
                  },
                  {
                    id: 'spedizione',
                    label: 'Spedizione',
                    content: (
                      <p>
                        Consegna in 2-4 giorni lavorativi in Italia. Spedizione gratuita da{' '}
                        {PRODUCT.freeShippingFromUnits} buste; per una busta {formatEur(PRODUCT.shippingEur)}. Reso entro
                        14 giorni sui prodotti sigillati. Il Rituale Completo ha la garanzia di 90 giorni.
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
          <SectionHeader
            eyebrow="composizione"
            title="tutto quello che c’è dentro"
            body="Dove il numero non c’è ancora, lo dice il tag grigio. Non si inventa un valore per far tornare una tabella."
          />
          <div className="mt-10">
            <IngredientPanel />
          </div>
          <div className="mt-8">
            <Accordion
              items={[
                { title: 'Il retro della busta: cosa conterrà', content: <PackBack flavor={flavor} className="mt-2" /> },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* --- prima di ordinare -------------------------------------------- */}
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
                  title: 'Il Duo',
                  content: `Nel formato Abitudine puoi scegliere una busta per gusto: una ${flavorById('arancia').name} e una ${flavorById('lime').name}. Sessanta giorni, due colori.`,
                },
                {
                  title: 'Garanzia 90 giorni',
                  content: 'Solo sul Rituale Completo: tre buste, novanta giorni. Se a fine ciclo non vuoi continuare, ti rimborsiamo. È l’unico formato con la garanzia perché è l’unico in cui la costanza ha il tempo di fare il suo lavoro.',
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

      {/* --- domande ----------------------------------------------------- */}
      <Section tone="surface">
        <Container width="narrow">
          <SectionHeader eyebrow="domande" title="quello che ci chiedono" />
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </Container>
      </Section>

      <StickyAddToCart
        name={`peak · ${flavorLabel(f, 'short')}`}
        detail={`${selected.name} · ${pricePerDay(selected.priceEur, selected.days)} al giorno`}
        priceEur={selected.priceEur}
        watch={buyButton}
        onAddToCart={() => setToast(true)}
      />

      {toast && (
        <ToastStack position="bottom-center">
          <Toast tone="success" onDismiss={() => setToast(false)}>
            Aggiunto al carrello — {selected.name}, {flavorLabel(f, 'short')}. Sito dimostrativo: nessun ordine viene evaso.
          </Toast>
        </ToastStack>
      )}
    </>
  )
}

export default Product
