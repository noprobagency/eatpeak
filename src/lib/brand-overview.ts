/**
 * peak — la scheda del brand.
 *
 * Sorgente unica del documento di posizionamento. Da qui nascono due cose:
 * il componente <BrandOverview /> e docs/00-brand-overview.md, generato con
 * `npm run docs:brand`. Se cambi il testo, cambialo qui e rigenera: il
 * documento non si modifica a mano.
 *
 * ─── NOTA DI COMPLIANCE ──────────────────────────────────────────────────
 * Questo e' un documento di POSIZIONAMENTO INTERNO, non copy destinato al
 * cliente. Descrive a chi parliamo e come, e per farlo nomina termini che il
 * brand non puo' usare in comunicazione. I blocchi che li contengono portano
 * una `compliance` esplicita, riportata anche nel markdown generato.
 *
 * Nessuna riga di questo file va copiata in una pagina di vendita cosi' com'e'.
 * Il copy pubblicabile sta in src/lib/copy.ts, ed e' un altro insieme.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface BrandOverviewBlock {
  /** Etichetta in mono maiuscolo. E' l'intestazione della riga. */
  label: string
  paragraphs: readonly string[]
  /**
   * Dichiarazione per il linter di compliance, riportata nel markdown.
   * `term` accetta `*` per l'intero blocco.
   */
  compliance?: { term: string; reason: string }
}

export interface BrandOverviewContent {
  title: string
  intro: string
  claim: { label: string; lines: readonly string[] }
  blocks: readonly BrandOverviewBlock[]
}

export const BRAND_OVERVIEW: BrandOverviewContent = {
  title: 'PEAK creatine drink — Design System 1.0',

  intro:
    'Creatina in stickpack monodose. Un prodotto solo multigusto, fatto bene, da prendere tutti i giorni.',

  claim: {
    label: 'CLAIM',
    lines: [
      'Il piacere di sentirsi al picco.',
      'The pleasure of feeling your peak.',
      'Peak feels good.',
    ],
  },

  blocks: [
    {
      label: 'POSIZIONAMENTO',
      paragraphs: [
        'La creatina oggi è raccontata come roba da palestra, e per questo la maggior parte delle persone che ne trarrebbe vantaggio non la prende nemmeno in considerazione. peak la sposta dove sta davvero: nella routine quotidiana.',
        'Il nostro terreno non è la prestazione estrema, è la costanza. Il prodotto funziona perché lo prendi tutti i giorni, e il brand esiste per rendere quel gesto facile e piacevole.',
      ],
    },
    // peak-compliance-ignore-start massa muscolare — descrizione interna del target, non un claim pubblicabile
    {
      label: 'TARGET',
      paragraphs: [
        'Aperto per scelta, mai segmentato per genere. Chi si allena senza essere un atleta. Chi vuole mantenere massa muscolare andando avanti con l’età. Chi cerca semplicemente un’abitudine che funzioni.',
        'È il pubblico più grande della categoria, ed è quello a cui in Italia non parla ancora nessuno.',
      ],
      compliance: {
        term: 'massa muscolare',
        reason:
          'Descrizione interna del target, non un claim pubblicabile. In comunicazione non si dice: l’unico claim autorizzato vicino a questo territorio riguarda la FORZA muscolare negli over 55 in combinazione con allenamento di resistenza, ed è quello letterale.',
      },
    },
    // peak-compliance-ignore-end
    {
      label: 'PERCHÉ PEAK',
      paragraphs: [
        'Peak → picco. Corto, memorabile, internazionale.',
        'Il claim è il piacere di sentirsi al picco. Peak feels good.',
        'Non è il picco della prestazione, è quello della giornata: il momento in cui stai bene e lo senti. Il nome dice una sensazione, non una promessa.',
      ],
    },
    {
      label: 'PRODOTTO',
      paragraphs: [
        'Tre grammi di creatina in uno stick. Da aprire, non da misurare.',
        'Niente misurini, niente grumi, niente barattolo. Made in Italy.',
      ],
    },
    {
      label: 'TONO',
      paragraphs: [
        'Caldo, goloso, un po’ giocoso. Frasi corte, numeri invece di aggettivi.',
        'Mai farmaceutico, mai da palestra, mai enfatico.',
      ],
    },
    {
      label: 'COSA NON SIAMO',
      // peak-compliance-ignore * — elenco dei termini che il brand non usa, non un uso
      paragraphs: [
        'Non parliamo di bodybuilding, potenza, limiti da superare o potenziale da sbloccare.',
        'Non usiamo un linguaggio maschile né uno femminile: usiamo quello di tutti.',
        'E non promettiamo benefici che non possiamo dichiarare.',
      ],
      compliance: {
        term: '*',
        reason: 'Elenco dei termini che il brand non usa. È una citazione, non un uso.',
      },
    },
  ],
}

export default BRAND_OVERVIEW
