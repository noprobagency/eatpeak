/**
 * peak — la scheda del brand (3.0).
 *
 * Sorgente unica del documento di posizionamento. Da qui nascono due cose:
 * il componente <BrandSheet /> (la versione corta, in una card) e
 * docs/00-brand-overview.md (la versione estesa), generato con
 * `npm run docs:brand`. Se cambi il testo, cambialo qui e rigenera.
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

/** La scheda corta: una riga per voce. E' quella della card nello Showcase. */
export const BRAND_SHEET = [
  {
    label: 'posizionamento',
    text: 'Il prodotto funziona perché lo prendi tutti i giorni. Il brand esiste per rendere quel gesto facile e piacevole.',
  },
  {
    label: 'target',
    text: 'Per chi si allena. Per chi non vuole perdere terreno. Per chi ha trenta secondi la mattina.',
  },
  {
    label: 'tono',
    text: 'Caldo, goloso, preciso.',
  },
  {
    label: 'cosa non siamo',
    text: 'Non siamo da palestra, non siamo una farmacia, non promettiamo quello che non possiamo dichiarare.',
  },
  {
    label: 'direzione visiva',
    text: 'Clinical Joy, umanizzato: base bianco e carta con il testo cacao e i numeri in mono; l ambra come colore del brand, a tutto campo con una grana leggera; i colori-gusto sul pack; logo bianco grande, nome del gusto in corsivo, i punti che contano i giorni.',
  },
] as const

export const BRAND_OVERVIEW: BrandOverviewContent = {
  title: 'peak — Design System 3.1',

  intro:
    'La creatina, evoluta. Creatina + glicina + vitamina D3 in stick monodose, con formula CreaVida™. Due gusti, una busta da 30 stick per 30 giorni, tre grammi al giorno senza fase di carico.',

  claim: {
    label: 'CLAIM',
    lines: [
      'La creatina, evoluta.',
      'Uno stick. Tre grammi. Tutti i giorni.',
      'Il piacere di sentirsi al picco.',
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
        'Peak → picco. Corto, memorabile, internazionale. Il simbolo sono quattro punti che crescono, disposti a montagna: il picco fatto con i punti che contano i giorni. Al passaggio salgono in diagonale, uno dopo l’altro.',
        'Non è il picco della prestazione, è quello della giornata: il momento in cui stai bene e lo senti. Il nome dice una sensazione, non una promessa.',
      ],
    },
    {
      label: 'PRODOTTO',
      paragraphs: [
        'Tre grammi di creatina monoidrato in uno stick, con glicina e vitamina D3 vegana: è la formula CreaVida™, che sul pack è un sigillo di qualità e mai una promessa di risultato.',
        'Una busta, trenta stick, trenta giorni. Senza fase di carico. Due gusti al lancio: Nº01 Arancia Rossa e Nº02 Lime & Menta. Made in Italy.',
      ],
    },
    {
      label: 'TONO',
      paragraphs: [
        'Caldo, goloso, un po’ giocoso. Frasi corte, numeri invece di aggettivi.',
        'Nei dati e nella tabella degli ingredienti il registro cambia: preciso e asciutto. Mai farmaceutico, mai da palestra, mai enfatico.',
      ],
    },
    {
      label: 'LA DOTTORESSA',
      paragraphs: [
        'La co-fondatrice è farmacista. Nel sistema è co-fondatrice ed esperta del brand: spiega ed educa — cos’è la creatina, perché la costanza conta più della dose, come si legge un’etichetta.',
        'Sul pack e nei claim non raccomanda il prodotto. Il Regolamento 1924/2006 vieta i riferimenti alla raccomandazione di singoli professionisti sanitari, e il linter lo verifica.',
      ],
    },
    {
      label: 'COSA NON SIAMO',
      // peak-compliance-ignore * — elenco dei termini che il brand non usa, non un uso
      paragraphs: [
        'Non parliamo di bodybuilding, potenza, limiti da superare o potenziale da sbloccare. Non usiamo Mojito: evoca un cocktail.',
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
