/**
 * peak — copy approvato.
 *
 * Ogni testo che compare nei componenti, nelle demo o nei placeholder viene da
 * qui. Non scrivere lorem ipsum e non inventare frasi al volo: il linter di
 * compliance gira su tutto il sorgente, e questo file e' l'unico posto dove il
 * testo e' gia' stato controllato.
 *
 * Regole di voce, per esteso in docs/05-voice-and-copy.md:
 * frasi che stanno in un respiro, numeri invece di aggettivi, e mai la parola
 * bandita che trovi in cima a FORBIDDEN_TERMS, gruppo "marketing".
 */

import { EFSA_CLAIMS, type Locale } from './compliance'

// ---------------------------------------------------------------------------
// Il claim corto
// ---------------------------------------------------------------------------

/**
 * Beneficio generico: ricade nell'articolo 10(3). Ovunque compaia, deve
 * comparire anche un claim autorizzato nelle immediate vicinanze.
 * I componenti che lo accettano richiedono il claim autorizzato per tipo.
 */
export const SHORT_CLAIM = {
  it: 'Il piacere di sentirsi al picco.',
  en: 'Peak feels good.',
} as const

/** Alternative EN approvate, in ordine di preferenza. */
export const SHORT_CLAIM_EN_ALTERNATIVES = [
  'The pleasure of feeling your peak.',
  'Feel your peak.',
] as const

// ---------------------------------------------------------------------------
// Il claim lungo
// ---------------------------------------------------------------------------

/**
 * Blocco esplicativo in tre righe. La riga centrale e' la formulazione EFSA e
 * non va riscritta: e' l'unico testo del brand che deve restare letterale.
 */
export const LONG_CLAIM = {
  it: [
    'Tre grammi di creatina in uno stick. Da aprire, non da misurare.',
    `${EFSA_CLAIMS['physical-performance'].it.replace(/\.$/, '')} — ma solo se la prendi tutti i giorni.`,
    'Noi abbiamo reso facile quella parte.',
  ],
  en: [
    'Three grams of creatine in a single stick. Tear it, drink it, go.',
    `${EFSA_CLAIMS['physical-performance'].en.replace(/\.$/, '')} — but only if you actually take it every day.`,
    'We made that part easy.',
  ],
} as const

// ---------------------------------------------------------------------------
// Altri claim approvati
// ---------------------------------------------------------------------------

export const CLAIMS = {
  product: { it: 'Uno stick. Tre grammi. Tutti i giorni.', en: 'One stick. Three grams. Every day.' },
  narrative: { it: 'Settimana 1: niente. Settimana 3: tutto.', en: 'Week 1: nothing. Week 3: everything.' },
  againstTheTub: { it: 'Niente misurini. Niente grumi. Niente scuse.', en: 'No scoops. No clumps. No excuses.' },
  gesture: { it: 'Si apre, si beve, si va.', en: 'Tear it, drink it, go.' },
  audience: {
    it: 'Per chi si allena. Per chi non vuole perdere terreno. Per chi ha trenta secondi la mattina.',
    en: 'For people who train. For people who don’t want to lose ground. For people with thirty seconds in the morning.',
  },
} as const

// ---------------------------------------------------------------------------
// Il marquee
// ---------------------------------------------------------------------------

/** Le prove del prodotto. Fatti verificabili, non aggettivi. */
export const MARQUEE_ITEMS = [
  'MADE IN ITALY',
  'DOSE PIENA IN UNO STICK',
  'NIENTE MISURINI',
  'TESTATA IN LABORATORIO',
  'SPEDIZIONE GRATUITA DA 2 PEZZI',
] as const

// ---------------------------------------------------------------------------
// Dati di prodotto
// ---------------------------------------------------------------------------

export const PRODUCT = {
  name: 'creatina monoidrato',
  format: '30 stickpack monodose',
  dose: 3,
  doseUnit: 'g',
  days: 30,
  priceEur: 29,
  freeShippingFromUnits: 2,
} as const

export const PRICE_TIERS = [
  { units: 1, label: '1 confezione', days: 30, priceEur: 29, badge: null },
  { units: 2, label: '2 confezioni', days: 60, priceEur: 52, badge: 'spedizione gratuita' },
  { units: 3, label: '3 confezioni', days: 90, priceEur: 72, badge: 'la scelta piu conveniente' },
] as const

/** Tabella nutrizionale. Tutti i numeri passano dal mono. */
export const NUTRITION_ROWS = [
  { label: 'Creatina monoidrato', perStick: '3 g', perDay: '3 g' },
  { label: 'di cui creatina', perStick: '2,64 g', perDay: '2,64 g' },
  { label: 'Valore energetico', perStick: '0 kcal', perDay: '0 kcal' },
  { label: 'Zuccheri', perStick: '0 g', perDay: '0 g' },
  { label: 'Additivi', perStick: 'nessuno', perDay: 'nessuno' },
] as const

// ---------------------------------------------------------------------------
// La narrazione delle quattro settimane
// ---------------------------------------------------------------------------

/**
 * Il componente narrativo centrale del brand: racconta la saturazione
 * progressiva. Nessuno di questi testi promette un effetto: descrivono il
 * gesto e il tempo. L'effetto lo dice il claim autorizzato, altrove.
 */
export const WEEK_TIMELINE = [
  { week: 1, title: 'niente', body: 'Apri il primo stick. Non senti nulla, ed e’ normale: i muscoli si stanno riempiendo.' },
  { week: 2, title: 'quasi', body: 'Il gesto e’ diventato automatico. Trenta secondi la mattina, senza pensarci.' },
  { week: 3, title: 'tutto', body: 'La saturazione e’ completa. Da qui in poi conta solo continuare.' },
  { week: 4, title: 'e poi', body: 'Ultimo stick della confezione. Il prodotto funziona finche’ lo prendi.' },
] as const

// ---------------------------------------------------------------------------
// Prove oggettive
// ---------------------------------------------------------------------------

export const TRUST_ITEMS = [
  { label: 'Made in Italy', detail: 'Prodotta e confezionata in Italia.' },
  { label: '3 g pieni', detail: 'La dose dello studio, in uno stick.' },
  { label: 'Testata in laboratorio', detail: 'Analisi su ogni lotto.' },
  { label: 'Zero additivi', detail: 'Solo creatina monoidrato.' },
] as const

// ---------------------------------------------------------------------------
// Recensioni
// ---------------------------------------------------------------------------

export const REVIEWS = [
  { stars: 5, text: 'Il barattolo lo saltavo un giorno su tre. Lo stick no: sta in tasca e lo apro sul tram.', author: 'Giulia R.', benefit: 'COSTANZA' },
  { stars: 5, text: 'Nessun grumo sul fondo del bicchiere. Sembra una sciocchezza, ma e’ il motivo per cui ho smesso col misurino.', author: 'Marco T.', benefit: 'NIENTE GRUMI' },
  { stars: 4, text: 'Trenta giorni, trenta stick. Sai sempre a che punto sei e quando riordinare.', author: 'Anna P.', benefit: 'FORMATO' },
] as const

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const FAQ = [
  {
    q: 'Quanta creatina c’e’ in uno stick?',
    a: 'Tre grammi di creatina monoidrato. E’ la quantita’ giornaliera a cui si riferisce il claim autorizzato: uno stick al giorno, tutti i giorni.',
  },
  {
    q: 'Quando la prendo?',
    a: 'Quando ti viene comodo. Conta la costanza, non l’orario: la creatina si accumula nel tempo.',
  },
  {
    q: 'Devo fare la fase di carico?',
    a: 'No. Tre grammi al giorno portano alla saturazione in tre o quattro settimane, senza dosi iniziali piu’ alte.',
  },
  {
    q: 'Perche’ uno stick invece di un barattolo?',
    a: 'Perche’ il barattolo richiede un misurino, un calcolo a occhio e un gesto in piu’. Lo stick e’ gia’ dosato: si apre, si beve, si va.',
  },
  {
    q: 'Si scioglie bene?',
    a: 'Si scioglie in acqua a temperatura ambiente mescolando qualche secondo. Non lascia grumi sul fondo.',
  },
  {
    q: 'Cosa succede se salto un giorno?',
    a: 'Niente di grave, riprendi il giorno dopo. Ma il prodotto e’ pensato per l’uso quotidiano: il claim autorizzato vale per l’assunzione di tutti i giorni.',
  },
] as const

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

export function shortClaim(locale: Locale = 'it'): string {
  return SHORT_CLAIM[locale]
}

export function longClaim(locale: Locale = 'it'): readonly string[] {
  return LONG_CLAIM[locale]
}

/** Prezzo per giorno, in mono nelle schede prodotto. */
export function pricePerDay(priceEur: number, days: number): string {
  return `${(priceEur / days).toFixed(2).replace('.', ',')} €`
}

export function formatEur(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}
