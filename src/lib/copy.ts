/**
 * peak — copy approvato e dati di prodotto (2.0).
 *
 * Ogni testo che compare nei componenti, nelle pagine o nei placeholder viene
 * da qui. Non scrivere lorem ipsum e non inventare frasi al volo: il linter di
 * compliance gira su tutto il sorgente, e questo file e' l'unico posto dove il
 * testo e' gia' stato controllato.
 *
 * Regole di voce, per esteso in docs/05-voice-and-copy.md: frasi che stanno in
 * un respiro, numeri invece di aggettivi, mai la parola bandita.
 *
 * Regola sui dati: NON si inventano valori di laboratorio. Dove serve un numero
 * che solo il laboratorio puo' dare, si usa LAB_PLACEHOLDER e lo si mostra
 * come tag grigio.
 */

import { EFSA_CLAIMS, type Locale } from './compliance'

// ---------------------------------------------------------------------------
// Il placeholder del laboratorio
// ---------------------------------------------------------------------------

/**
 * Grammi di glicina, microgrammi e %VNR della vitamina D3, kcal, zuccheri,
 * aromi, dimensioni della fustella: valori che arrivano dal laboratorio e che
 * finche' non arrivano restano visibili come tag grigio. Non si scrive un
 * numero plausibile per far tornare un layout.
 */
export const LAB_PLACEHOLDER = '[dal laboratorio]'

export function isLabPlaceholder(value: string): boolean {
  return value.includes(LAB_PLACEHOLDER)
}

// ---------------------------------------------------------------------------
// I gusti
// ---------------------------------------------------------------------------

export type FlavorId = 'arancia' | 'lime'

export interface Flavor {
  id: FlavorId
  /** Il numero progressivo, come sul pack: "Nº01". */
  number: string
  /** Il nome per esteso, in corsivo Fraunces: "Arancia Rossa". */
  name: string
  /** Il nome corto, per stick e selettori stretti. */
  shortName: string
  /** La utility del campo colore pieno: il token semantico `bg-flavor-*` come classe di fondo. */
  colorToken: 'bg-bg-flavor-arancia' | 'bg-bg-flavor-lime'
  /** La utility della versione profonda, per testo e bordi sul chiaro. */
  deepToken: 'text-text-brand' | 'text-lime-700'
  /** La utility del tint, il fondo del testo piccolo su colore. */
  tintToken: 'bg-bg-flavor-arancia-tint' | 'bg-bg-flavor-lime-tint'
  /** L'hex del 500, per gli SVG e gli script che non leggono le classi. */
  hex: string
  deepHex: string
  tintHex: string
  /** Gli aromi. Valore [dal laboratorio] finche' la ricetta non e' chiusa. */
  aroma: string
  /** Il descrittore sensoriale, una riga (stile Create: "Nostalgic, tangy, juicy"). Bozza. */
  taste: string
  /** Il brief della frutta sul pack, per la generazione dei prototipi. Oggi e' un placeholder SVG piatto. */
  fruitBrief: string
}

/**
 * Il nome del gusto 02 vive in UNA costante: potrebbe diventare
 * "Mela Verde & Lime" in base all'aroma definitivo. Cambiandola qui cambia
 * ovunque: pack, stick, card, selettore, prototipi.
 */
export const FLAVOR_02_NAME = 'Lime & Menta'
export const FLAVOR_02_SHORT_NAME = 'Lime & Menta'

/**
 * Solo due gusti al lancio. Tutti i componenti che mostrano un gusto leggono
 * da qui: aggiungere un gusto = aggiungere una riga.
 */
export const FLAVORS: readonly Flavor[] = [
  {
    id: 'arancia',
    number: 'Nº01',
    name: 'Arancia Rossa',
    shortName: 'Arancia Rossa',
    colorToken: 'bg-bg-flavor-arancia',
    deepToken: 'text-text-brand',
    tintToken: 'bg-bg-flavor-arancia-tint',
    hex: '#E4572E',
    deepHex: '#C24926',
    tintHex: '#FDF2EE',
    aroma: LAB_PLACEHOLDER,
    taste: 'Quella siciliana di febbraio: dolce, poi amara quanto basta.',
    fruitBrief: 'Mezze arance rosse e fette, sovradimensionate, dietro e sopra il wordmark; due o tre elementi tagliati dai bordi, come i lamponi di Cure. Polpa rosso sangue, buccia opaca, nessun riflesso lucido.',
  },
  {
    id: 'lime',
    number: 'Nº02',
    name: FLAVOR_02_NAME,
    shortName: FLAVOR_02_SHORT_NAME,
    colorToken: 'bg-bg-flavor-lime',
    deepToken: 'text-lime-700',
    tintToken: 'bg-bg-flavor-lime-tint',
    hex: '#5E9E1F',
    deepHex: '#406D15',
    tintHex: '#F2F7ED',
    aroma: LAB_PLACEHOLDER,
    taste: 'Acida al punto giusto, poi la menta pulisce.',
    fruitBrief: 'Lime tagliati a metà e a fette con due foglie di menta, sovradimensionati, tagliati dai bordi. Polpa verde chiara, buccia opaca, foglie con la nervatura in vista.',
  },
]

export function flavorById(id: FlavorId): Flavor {
  const found = FLAVORS.find((f) => f.id === id)
  if (!found) throw new Error(`Gusto sconosciuto: ${id}`)
  return found
}

/** "Nº01 Arancia Rossa" — la riga in corsivo, come sul pack. */
export function flavorLabel(flavor: Flavor, variant: 'full' | 'short' = 'full'): string {
  return `${flavor.number} ${variant === 'short' ? flavor.shortName : flavor.name}`
}

// ---------------------------------------------------------------------------
// La gerarchia dei claim (voce)
// ---------------------------------------------------------------------------

/**
 * Cinque ruoli, con la copertura di compliance di ciascuno. Solo il sign-off
 * e' un beneficio generico (art. 10(3)): sempre con un claim autorizzato vicino.
 */
export const CLAIMS = {
  /** Brand line: descrittiva, non promette effetti. Hero e documenti. */
  brand: { it: 'La creatina, evoluta.', en: 'Creatine, evolved.' },
  /** Product line: il gesto e il numero. */
  product: { it: 'Uno stick. Tre grammi. Tutti i giorni.', en: 'One stick. Three grams. Every day.' },
  /** Sign-off: beneficio generico, sempre accompagnato. */
  signOff: { it: 'Il piacere di sentirsi al picco.', en: 'Peak feels good.' },
  /** Rituale: card, email, CTA. */
  ritual: { it: 'Hai preso la tua peak oggi?', en: 'Did you take your peak today?' },
  /** Anti-barattolo, protocollo: descrive il formato, non un effetto. */
  noLoading: { it: 'Senza fase di carico. Senza barattoli.', en: 'No loading. No tubs.' },

  // --- gli altri, gia' approvati nella 1.0 ---
  narrative: { it: 'Settimana 1: niente. Settimana 3: tutto.', en: 'Week 1: nothing. Week 3: everything.' },
  againstTheTub: { it: 'Niente misurini. Niente grumi. Niente scuse.', en: 'No scoops. No clumps. No excuses.' },
  gesture: { it: 'Si apre, si beve, si va.', en: 'Tear it, drink it, go.' },
  audience: {
    it: 'Per chi si allena. Per chi non vuole perdere terreno. Per chi ha trenta secondi la mattina.',
    en: 'For people who train. For people who don’t want to lose ground. For people with thirty seconds in the morning.',
  },
} as const

export type ClaimRole = keyof typeof CLAIMS

/** La gerarchia per lo Showcase e per i doc: ruolo, testo, nota di uso. */
export const CLAIM_HIERARCHY = [
  { role: 'Brand line', key: 'brand', note: 'Descrittiva, non promette effetti. Hero e documenti.' },
  { role: 'Product line', key: 'product', note: 'Il gesto e il numero. Sotto la brand line, sul pack.' },
  { role: 'Sign-off', key: 'signOff', note: 'Beneficio generico, art. 10(3): sempre con un claim autorizzato vicino.' },
  { role: 'Rituale', key: 'ritual', note: 'Card, email, notifiche, CTA.' },
  { role: 'Anti-barattolo', key: 'noLoading', note: 'Il protocollo come fatto. Affianca "Niente misurini. Niente grumi. Niente scuse."' },
] as const satisfies ReadonlyArray<{ role: string; key: ClaimRole; note: string }>

/** Beneficio generico: ricade nell'articolo 10(3). */
export const SHORT_CLAIM = CLAIMS.signOff

/** Alternative EN approvate per il sign-off, in ordine di preferenza. */
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
    'Tre grammi di creatina in uno stick, con glicina e vitamina D3. Da aprire, non da misurare.',
    `${EFSA_CLAIMS['physical-performance'].it.replace(/\.$/, '')} — ma solo se la prendi tutti i giorni.`,
    'Noi abbiamo reso facile quella parte.',
  ],
  en: [
    'Three grams of creatine in a single stick, with glycine and vitamin D3. Tear it, drink it, go.',
    `${EFSA_CLAIMS['physical-performance'].en.replace(/\.$/, '')} — but only if you actually take it every day.`,
    'We made that part easy.',
  ],
} as const

// ---------------------------------------------------------------------------
// Dati di prodotto
// ---------------------------------------------------------------------------

export const PRODUCT = {
  /** Il nome commerciale. */
  name: 'peak',
  /** Il descrittore: sul pack sotto il wordmark, nel PDP come sottotitolo. */
  descriptor: 'creatina + glicina + vitamina D3',
  /** Il nome esteso, per il PDP e lo schema del prodotto. */
  extendedName: 'peak — Creatina + Glicina + Vitamina D3',
  /** L'ingrediente brand: sigillo di qualita', mai promessa di risultato. */
  formula: 'CreaVida™',
  formulaLine: 'con formula CreaVida™',
  format: '30 stick monodose',
  formatShort: '30 stick',
  dose: 3,
  doseUnit: 'g',
  days: 30,
  sticksPerBag: 30,
  priceEur: 32,
  shippingEur: 6.9,
  freeShippingFromUnits: 2,
  /** Il lotto di lancio: numerazione stampata in variabile. */
  launchLot: '01',
  launchLotSize: 500,
  origin: 'Prodotta e confezionata in Italia',
} as const

export interface PriceTier {
  id: 'inizio' | 'abitudine' | 'rituale'
  name: string
  units: number
  days: number
  priceEur: number
  /** 0 = gratuita. */
  shippingEur: number
  badge: string | null
  /** Selezionato al caricamento. */
  preselected?: boolean
  /** Righe extra sotto il prezzo: garanzia, omaggi, il Duo. */
  extras: readonly string[]
  /** Il Duo: 1 Arancia + 1 Lime. Solo dove le buste sono due. */
  duo?: boolean
}

/**
 * Tre livelli. Il risparmio NON sta qui: lo calcola <PriceTiers /> sul prezzo
 * unitario del primo livello, cosi' non puo' mentire.
 */
export const PRICE_TIERS: readonly PriceTier[] = [
  {
    id: 'inizio',
    name: 'Inizio',
    units: 1,
    days: 30,
    priceEur: 32,
    shippingEur: 6.9,
    badge: null,
    extras: [],
  },
  {
    id: 'abitudine',
    name: 'Abitudine',
    units: 2,
    days: 60,
    priceEur: 59,
    shippingEur: 0,
    badge: 'spedizione gratuita',
    extras: ['Anche Duo: 1 Arancia Rossa + 1 ' + FLAVOR_02_NAME],
    duo: true,
  },
  {
    id: 'rituale',
    name: 'Rituale Completo',
    units: 3,
    days: 90,
    priceEur: 85,
    shippingEur: 0,
    badge: 'il più scelto',
    preselected: true,
    extras: ['Kit Rituale in omaggio', 'Garanzia 90 giorni'],
  },
]

export const DEFAULT_TIER = PRICE_TIERS.find((t) => t.preselected)?.units ?? 1

/** Tabella nutrizionale. Tutti i numeri passano dal mono; i placeholder dal tag. */
export const NUTRITION_ROWS = [
  { label: 'Creatina monoidrato', perStick: '3 g', perDay: '3 g', vnr: '—' },
  { label: 'Glicina', perStick: LAB_PLACEHOLDER, perDay: LAB_PLACEHOLDER, vnr: '—' },
  { label: 'Vitamina D3 (vegana)', perStick: LAB_PLACEHOLDER, perDay: LAB_PLACEHOLDER, vnr: LAB_PLACEHOLDER },
  { label: 'Valore energetico', perStick: LAB_PLACEHOLDER, perDay: LAB_PLACEHOLDER, vnr: '—' },
  { label: 'Zuccheri', perStick: LAB_PLACEHOLDER, perDay: LAB_PLACEHOLDER, vnr: '—' },
] as const

/** L'elenco ingredienti in chiaro. L'ordine definitivo lo da' il laboratorio. */
export const INGREDIENTS_LINE = `Creatina monoidrato, glicina, aromi naturali ${LAB_PLACEHOLDER}, vitamina D3 (colecalciferolo da lichene) ${LAB_PLACEHOLDER}.`

/**
 * I tre ingredienti della formula, come si raccontano. La glicina si descrive
 * SOLO come "il mattone naturale della creatina": non ha claim autorizzati.
 */
export const INGREDIENTS = [
  {
    id: 'creatina',
    name: 'Creatina monoidrato',
    amount: '3 g',
    role: 'La dose dello studio, ogni giorno.',
    body: 'La forma piu studiata. Tre grammi al giorno portano alla saturazione in tre o quattro settimane, senza fase di carico.',
    claims: ['physical-performance', 'muscle-strength-55plus'] as const,
  },
  {
    id: 'glicina',
    name: 'Glicina',
    amount: LAB_PLACEHOLDER,
    role: 'Il mattone naturale della creatina.',
    body: 'Un amminoacido semplice, tra quelli da cui il corpo costruisce la creatina. Sta nella formula per quello che e: un ingrediente, non una promessa.',
    claims: [] as const,
  },
  {
    id: 'vitamina-d3',
    name: 'Vitamina D3',
    amount: LAB_PLACEHOLDER,
    role: 'Vegana, da lichene.',
    body: 'I claim autorizzati valgono solo se la dose giornaliera apporta almeno il 15% dei VNR: il valore arriva dal laboratorio.',
    claims: ['vitd-muscle', 'vitd-bones', 'vitd-immune', 'vitd-calcium'] as const,
  },
] as const

// ---------------------------------------------------------------------------
// Il marquee
// ---------------------------------------------------------------------------

/** Le prove del prodotto. Fatti verificabili, non aggettivi. */
export const MARQUEE_ITEMS = [
  'MADE IN ITALY',
  '3 G DI CREATINA IN UNO STICK',
  'SENZA FASE DI CARICO',
  'CON FORMULA CREAVIDA™',
  'VEGAN',
  'SPEDIZIONE GRATUITA DA 2 BUSTE',
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
  { week: 1, title: 'niente', body: 'Apri il primo stick. Non senti nulla, ed è normale: i muscoli si stanno riempiendo.' },
  { week: 2, title: 'quasi', body: 'Il gesto è diventato automatico. Trenta secondi la mattina, senza pensarci.' },
  { week: 3, title: 'tutto', body: 'La saturazione è completa. Da qui in poi conta solo continuare.' },
  { week: 4, title: 'e poi', body: 'Ultimo stick della busta. Il prodotto funziona finché lo prendi.' },
] as const

// ---------------------------------------------------------------------------
// Prove oggettive
// ---------------------------------------------------------------------------

export const TRUST_ITEMS = [
  { label: 'Made in Italy', detail: 'Prodotta e confezionata in Italia.' },
  { label: '3 g di creatina', detail: 'La dose dello studio, in uno stick.' },
  { label: 'Con formula CreaVida™', detail: 'Creatina + glicina + vitamina D3, vegana.' },
  { label: 'Senza fase di carico', detail: 'Uno stick al giorno, dal primo giorno.' },
] as const

// ---------------------------------------------------------------------------
// La dottoressa
// ---------------------------------------------------------------------------

/**
 * Co-fondatrice, farmacista. Nel sistema spiega ed educa; sul pack e nei
 * claim non "raccomanda" il prodotto (Reg. 1924/2006 art. 12).
 */
export const EXPERT = {
  role: 'Co-fondatrice ed esperta del brand',
  title: 'Farmacista',
  intro: 'La creatina non è una scorciatoia: è un’abitudine. Il mio lavoro è spiegarla bene, non venderla.',
  topics: [
    'Perché tre grammi al giorno e non una fase di carico.',
    'Cosa fanno glicina e vitamina D3 dentro la formula.',
    'Come si legge un’etichetta senza farsi ingannare.',
  ],
} as const

// ---------------------------------------------------------------------------
// Recensioni
// ---------------------------------------------------------------------------

export const REVIEWS = [
  { stars: 5, text: 'Il barattolo lo saltavo un giorno su tre. Lo stick no: sta in tasca e lo apro sul tram.', author: 'Giulia R.', benefit: 'COSTANZA' },
  { stars: 5, text: 'Nessun grumo sul fondo del bicchiere, e l’arancia si beve volentieri. È il motivo per cui ho smesso col misurino.', author: 'Marco T.', benefit: 'GUSTO' },
  { stars: 4, text: 'Trenta giorni, trenta stick. Sai sempre a che punto sei e quando riordinare.', author: 'Anna P.', benefit: 'FORMATO' },
] as const

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const FAQ = [
  {
    q: 'Cosa c’è in uno stick?',
    a: `Tre grammi di creatina monoidrato, glicina e vitamina D3 vegana: è la formula CreaVida™. Le quantità di glicina e vitamina D3 sono in tabella, appena arrivano dal laboratorio.`,
  },
  {
    q: 'Devo fare la fase di carico?',
    a: 'No. Tre grammi al giorno portano alla saturazione in tre o quattro settimane, senza dosi iniziali più alte. Uno stick al giorno, dal primo giorno.',
  },
  {
    q: 'Quando la prendo?',
    a: 'Quando ti viene comodo. Conta la costanza, non l’orario: la creatina si accumula nel tempo.',
  },
  {
    q: 'Che gusti ci sono?',
    a: `Due: Nº01 Arancia Rossa e Nº02 ${FLAVOR_02_NAME}. Con il formato Abitudine puoi prendere il Duo, una busta per gusto.`,
  },
  {
    q: 'Perché uno stick invece di un barattolo?',
    a: 'Perché il barattolo richiede un misurino, un calcolo a occhio e un gesto in più. Lo stick è già dosato: si apre, si beve, si va.',
  },
  {
    q: 'Cosa succede se salto un giorno?',
    a: 'Niente di grave, riprendi il giorno dopo. Ma il prodotto è pensato per l’uso quotidiano: il claim autorizzato vale per l’assunzione di tutti i giorni.',
  },
  {
    q: 'È vegana?',
    a: 'Sì. La vitamina D3 è da lichene, non di origine animale. Nessun ingrediente animale nella formula.',
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

/** Prezzo per giorno, in mono nelle schede prodotto: "1,07 €". */
export function pricePerDay(priceEur: number, days: number): string {
  return `${(priceEur / days).toFixed(2).replace('.', ',')} €`
}

/** Prezzo per giorno con la spedizione dentro, per il livello senza spedizione gratuita. */
export function pricePerDayShipped(tier: PriceTier): string {
  return pricePerDay(tier.priceEur + tier.shippingEur, tier.days)
}

export function formatEur(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}

/** Il numero di serie stampato in variabile: "Nº 0137/0500". */
export function serialLabel(serial: number, lotSize: number = PRODUCT.launchLotSize): string {
  return `Nº ${String(serial).padStart(4, '0')}/${String(lotSize).padStart(4, '0')}`
}
