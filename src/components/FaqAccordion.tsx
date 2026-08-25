/**
 * <FaqAccordion /> — le domande frequenti.
 *
 * QUANDO USARLO: in fondo alla landing e alla pagina prodotto, dove si tolgono
 * gli ultimi ostacoli all'acquisto.
 * QUANDO NO: per parcheggiare informazioni che non hai saputo dove mettere. Se
 * una domanda riguarda il dosaggio o il prezzo, la risposta va anche sopra.
 *
 * E' <Accordion /> con i contenuti gia' approvati e con i dati strutturati
 * FAQPage: le stesse risposte diventano un risultato ricco sui motori di
 * ricerca senza doverle riscrivere.
 */

import { Accordion } from './Accordion'
import { FAQ } from '../lib/copy'

export interface FaqEntry {
  q: string
  a: string
}

export interface FaqAccordionProps {
  entries?: readonly FaqEntry[]
  /** Emette lo schema FAQPage in JSON-LD. Una volta sola per pagina. */
  structuredData?: boolean
  className?: string
}

export function FaqAccordion({ entries = FAQ, structuredData = true, className }: FaqAccordionProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: { '@type': 'Answer', text: e.a },
    })),
  }

  return (
    <>
      <Accordion
        className={className}
        single
        items={entries.map((e) => ({ id: e.q, title: e.q, content: e.a }))}
      />
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </>
  )
}

export default FaqAccordion
