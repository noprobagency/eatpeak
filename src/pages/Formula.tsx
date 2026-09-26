/**
 * Formula — la pagina della formula CreaVida™.
 *
 * E' la pagina dell'esperta: spiega i tre ingredienti, il protocollo senza
 * fase di carico e cosa il brand puo' dire per legge. Ogni ingrediente porta
 * i suoi claim autorizzati, letterali; la glicina non ne ha e si descrive
 * solo come "il mattone naturale della creatina".
 */

import {
  Card, Container, IngredientPanel, LabTag, MediaPlaceholder, Section, SectionHeader,
  WeekTimeline, Button,
} from '../components'
import { Icon } from '../brand'
import { EFSA_CLAIMS, authorizedClaimText } from '../lib/compliance'
import { CLAIMS, EXPERT, INGREDIENTS, PRODUCT, isLabPlaceholder } from '../lib/copy'
import { shotById } from '../lib/media'
import { to } from '../lib/routes'

export function Formula() {
  return (
    <>
      <Section tone="page" spacing="loose">
        <Container>
          <SectionHeader
            as="h1"
            size="lg"
            eyebrow={PRODUCT.formulaLine}
            title="creatina, glicina, vitamina d3"
            body={`${CLAIMS.brand.it} La formula CreaVida™ mette insieme la dose dello studio, un amminoacido semplice e una vitamina vegana. Sul pack è un sigillo di qualità, non una promessa di risultato.`}
          />
          <div className="mt-12">
            <MediaPlaceholder shot={shotById('formula-ingredienti')} radius="xl" />
          </div>
        </Container>
      </Section>

      {/* --- gli ingredienti, uno per volta ------------------------------- */}
      <Section tone="surface" id="ingredienti">
        <Container>
          <div className="flex flex-col gap-10">
            {INGREDIENTS.map((ing, i) => (
              <article key={ing.id} className="grid gap-6 border-t border-border-subtle pt-10 lg:grid-cols-[220px_1fr_1fr] lg:gap-12">
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-mono-sm uppercase text-text-muted">0{i + 1}</p>
                  <h2 className="type-display-sm text-text-primary">{ing.name.toLowerCase()}</h2>
                  <p className="font-mono text-heading-lg text-text-primary">
                    {isLabPlaceholder(ing.amount) ? <LabTag size="md" what={ing.name} /> : `${ing.amount} al giorno`}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-heading-md text-text-primary">{ing.role}</p>
                  <p className="text-body-md text-text-secondary">{ing.body}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-mono-sm uppercase text-text-muted">
                    {ing.claims.length > 0 ? `claim autorizzati · ${ing.claims.length}` : 'nessun claim autorizzato'}
                  </p>
                  {ing.claims.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {ing.claims.map((id) => (
                        <li key={id} className="flex items-start gap-3 text-body-sm text-text-secondary" data-compliance="authorized-claim">
                          <Icon variant="free" color={i === 2 ? 'lime' : 'arancia'} size={16} title="" className="mt-1 shrink-0" />
                          <span>
                            {authorizedClaimText(id)}
                            {EFSA_CLAIMS[id].ingredient === 'vitamina D' && (
                              <> <LabTag what="%VNR per dose giornaliera" /></>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-body-sm text-text-secondary">
                      La glicina si descrive per quello che è nella formula. Non le attribuiamo effetti: non ne ha di
                      autorizzati, e il nostro linter blocca ogni tentativo.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- il protocollo ------------------------------------------------ */}
      <Section tone="arancia-tint" id="protocollo">
        <Container>
          <SectionHeader
            eyebrow="il protocollo"
            title={CLAIMS.noLoading.it.toLowerCase()}
            body="Tre grammi al giorno portano alla saturazione in tre o quattro settimane. La fase di carico — venti grammi al giorno per una settimana — arriva prima allo stesso punto, ma è il motivo per cui la creatina ha fama di essere scomoda. Noi partiamo da uno stick al giorno, dal primo giorno."
            authorizedClaim="physical-performance"
          />
          <div className="mt-12">
            <WeekTimeline />
          </div>
        </Container>
      </Section>

      {/* --- la dottoressa ------------------------------------------------ */}
      <Section tone="page" id="dottoressa">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
            <MediaPlaceholder shot={shotById('dottoressa')} className="max-w-[420px]" />
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow={`${EXPERT.role} · ${EXPERT.title}`}
                title="le domande che mi fanno"
                body={`“${EXPERT.intro}”`}
              />
              <div className="flex flex-col gap-4">
                {[
                  {
                    q: 'Perché tre grammi e non la fase di carico?',
                    a: 'Perché arrivano allo stesso punto. Il carico ci arriva prima, ma chiede venti grammi al giorno per una settimana: è scomodo, ed è il motivo per cui molti smettono. Tre grammi al giorno, ogni giorno, sono il protocollo che si tiene.',
                  },
                  {
                    q: 'Cosa fa la glicina nella formula?',
                    a: 'È un amminoacido semplice, tra quelli da cui il corpo costruisce la creatina. Sta nella formula per questo. Non le attribuiamo altro, perché non c’è un claim autorizzato che lo permetta.',
                  },
                  {
                    q: 'E la vitamina D3?',
                    a: `È vegana, da lichene. I quattro claim autorizzati valgono solo se la dose giornaliera apporta almeno il 15% dei valori di riferimento: quel numero lo dà il laboratorio, e finché non arriva lo lasciamo in grigio.`,
                  },
                  {
                    q: 'Come si legge un’etichetta?',
                    a: 'Si cerca la dose per stick, non per busta. Si guarda la tabella, non la frase in copertina. E si diffida di chi promette quello che nessuna tabella può contenere.',
                  },
                ].map((item) => (
                  <Card key={item.q} tone="surface" padding="md">
                    <h3 className="text-heading-md text-text-primary">{item.q}</h3>
                    <p className="mt-2 text-body-md text-text-secondary">{item.a}</p>
                  </Card>
                ))}
              </div>
              <p className="text-body-sm text-text-muted">
                Spiega ed educa. Sul pack e nei claim non raccomanda il prodotto: il Regolamento 1924/2006 vieta i
                riferimenti alla raccomandazione di singoli professionisti sanitari.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- la tabella --------------------------------------------------- */}
      <Section tone="surface" id="tabella">
        <Container width="narrow">
          <SectionHeader eyebrow="la tabella" title="i numeri, dove ci sono" body="Tutto in mono. I placeholder in grigio sono i valori che aspettiamo dal laboratorio." />
          <div className="mt-10">
            <IngredientPanel />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href={to('/prodotto')}>Vai al prodotto</Button>
            <Button variant="ghost" as="a" href={to('/design-system', 'voce')}>Cosa possiamo dire e cosa no</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default Formula
