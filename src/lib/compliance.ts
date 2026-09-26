/**
 * peak — compliance sui claim (2.0).
 *
 * Questo file e' la sorgente di verita' per docs/06-compliance.md e per il
 * linter in scripts/compliance-lint.mjs. Se cambi qualcosa qui, quel documento
 * va riletto.
 *
 * Il prodotto e' un integratore venduto nell'Unione Europea: sono utilizzabili
 * solo i claim autorizzati dal registro EFSA. Tutto il resto — per quanto
 * suoni innocuo — e' pubblicita' ingannevole.
 *
 * Con la formula CreaVida (creatina + glicina + vitamina D3) i claim
 * autorizzati sono sei: due sulla creatina, quattro sulla vitamina D. La
 * glicina non ne ha nessuno e si descrive solo come "il mattone naturale della
 * creatina".
 */

// ---------------------------------------------------------------------------
// I claim autorizzati
// ---------------------------------------------------------------------------

export interface AuthorizedClaim {
  it: string
  en: string
  /** Condizione d'uso dal registro. Dove serve un valore, e' [dal laboratorio]. */
  condition: string
  ingredient: 'creatina' | 'vitamina D'
}

/**
 * Formulazioni letterali. NON vanno riscritte, abbreviate o rese piu'
 * accattivanti: sono l'unico testo del brand che deve restare tale e quale.
 * Il linter le ammette per intero anche quando contengono un termine vietato
 * (es. "sistema immunitario"): fuori dalla frase letterale il termine resta
 * vietato.
 */
export const EFSA_CLAIMS = {
  'physical-performance': {
    it: 'La creatina aumenta le prestazioni fisiche in caso di serie successive di esercizi brevi e intensi.',
    en: 'Creatine increases physical performance in successive bursts of short-term, high-intensity exercise.',
    condition:
      'Consentito solo per alimenti che apportano un’assunzione giornaliera di 3 g di creatina. Va informato il consumatore che il claim riguarda adulti che praticano esercizio fisico ad alta intensita’.',
    ingredient: 'creatina',
  },
  'muscle-strength-55plus': {
    it: 'L’assunzione quotidiana di creatina può aumentare l’effetto dell’allenamento di resistenza sulla forza muscolare negli adulti oltre i 55 anni.',
    en: 'Daily creatine consumption can enhance the effect of resistance training on muscle strength in adults over the age of 55.',
    condition:
      'Consentito solo per alimenti che apportano un’assunzione giornaliera di 3 g di creatina, in combinazione con allenamento di resistenza che consenta un aumento della forza muscolare.',
    ingredient: 'creatina',
  },
  'vitd-muscle': {
    it: 'La vitamina D contribuisce al mantenimento della normale funzione muscolare.',
    en: 'Vitamin D contributes to the maintenance of normal muscle function.',
    condition:
      'Solo se il prodotto apporta una quantità significativa di vitamina D (almeno il 15% dei VNR per dose giornaliera) — valore [dal laboratorio].',
    ingredient: 'vitamina D',
  },
  'vitd-bones': {
    it: 'La vitamina D contribuisce al mantenimento di ossa normali.',
    en: 'Vitamin D contributes to the maintenance of normal bones.',
    condition:
      'Solo se il prodotto apporta una quantità significativa di vitamina D (almeno il 15% dei VNR per dose giornaliera) — valore [dal laboratorio].',
    ingredient: 'vitamina D',
  },
  'vitd-immune': {
    it: 'La vitamina D contribuisce alla normale funzione del sistema immunitario.',
    en: 'Vitamin D contributes to the normal function of the immune system.',
    condition:
      'Solo se il prodotto apporta una quantità significativa di vitamina D (almeno il 15% dei VNR per dose giornaliera) — valore [dal laboratorio].',
    ingredient: 'vitamina D',
  },
  'vitd-calcium': {
    it: 'La vitamina D contribuisce al normale assorbimento/utilizzo del calcio e del fosforo.',
    en: 'Vitamin D contributes to normal absorption/utilisation of calcium and phosphorus.',
    condition:
      'Solo se il prodotto apporta una quantità significativa di vitamina D (almeno il 15% dei VNR per dose giornaliera) — valore [dal laboratorio].',
    ingredient: 'vitamina D',
  },
} as const satisfies Record<string, AuthorizedClaim>

export type AuthorizedClaimId = keyof typeof EFSA_CLAIMS
export type Locale = 'it' | 'en'

export function authorizedClaimText(id: AuthorizedClaimId, locale: Locale = 'it'): string {
  return EFSA_CLAIMS[id][locale]
}

/** Tutte le frasi letterali, IT ed EN: l'allowlist del linter. */
export const AUTHORIZED_CLAIM_TEXTS: readonly string[] = Object.values(EFSA_CLAIMS).flatMap((c) => [c.it, c.en])

// ---------------------------------------------------------------------------
// Benefici generici — articolo 10(3)
// ---------------------------------------------------------------------------

/**
 * Frasi come "sentirsi al picco" sono benefici generici e non specifici.
 * Sono ammesse SOLO se accompagnate da un claim autorizzato nelle immediate
 * vicinanze. Non sono vietate: sono condizionate.
 *
 * Nei componenti questo vincolo e' espresso nei tipi — dove compare un claim
 * generico, la prop del claim autorizzato e' obbligatoria.
 */
export const GENERIC_BENEFIT_PHRASES = [
  'sentirsi al picco',
  'al picco',
  'stare bene',
  'dare il massimo',
  'feel your peak',
  'peak feels good',
  'feeling your peak',
] as const

// ---------------------------------------------------------------------------
// Termini vietati
// ---------------------------------------------------------------------------

export type ForbiddenGroup =
  | 'cognitivo'
  | 'recupero'
  | 'longevita'
  | 'salute'
  | 'glicina'
  | 'esperti'
  | 'marketing'
  | 'genere'
  | 'palestra'

export interface ForbiddenTerm {
  /** Radice da cercare, minuscola. Il matching e' su parola intera; `*` finale = prefisso. */
  term: string
  /** Perche' e' vietato. Finisce nel messaggio di errore del linter. */
  reason: string
  group: ForbiddenGroup
  /**
   * Il termine collide con un identificatore tecnico inevitabile.
   * "focus" e' il caso classico: e' un claim cognitivo vietato in prosa, ma
   * anche una pseudo-classe CSS e un evento del DOM. Quando questo flag e'
   * attivo, il controllo salta le occorrenze incollate a `:`, `-`, `.` o `(`
   * — cioe' `:focus-visible`, `--focus-ring`, `.focus()`, `focus:` — e continua
   * a segnalare la parola isolata, che e' quella che finisce in un testo.
   */
  technicalCollision?: boolean
}

/**
 * Nessuno di questi ha un claim autorizzato per il prodotto, in nessuna lingua
 * e in nessuna forma. Vale anche per placeholder, nomi di variabili e commenti.
 *
 * Eccezione unica: le frasi letterali di EFSA_CLAIMS. "immune" e' vietato, ma
 * "La vitamina D contribuisce alla normale funzione del sistema immunitario."
 * e' un claim autorizzato e passa per intero.
 */
export const FORBIDDEN_TERMS: readonly ForbiddenTerm[] = [
  // --- claim cognitivi: nessuno autorizzato ---
  { term: 'memoria', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'memory', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'concentrazione', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'focus', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo', technicalCollision: true },
  { term: 'lucidita', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'cervello', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'brain', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'mentale', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'mental', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'cognitivo', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'cognitive', reason: 'Claim cognitivo non autorizzato.', group: 'cognitivo' },
  { term: 'umore', reason: 'Claim sull umore non autorizzato.', group: 'cognitivo' },
  { term: 'mood', reason: 'Claim sull umore non autorizzato.', group: 'cognitivo' },

  // --- recupero: l errore piu frequente, perche suona innocuo ---
  { term: 'recupero', reason: 'Non esiste un claim autorizzato sul recupero per la creatina. Suona innocuo ma va trattato come i claim cognitivi.', group: 'recupero' },
  { term: 'recovery', reason: 'Non esiste un claim autorizzato sul recupero per la creatina.', group: 'recupero' },
  { term: 'recover', reason: 'Non esiste un claim autorizzato sul recupero per la creatina.', group: 'recupero' },
  { term: 'recuperare', reason: 'Non esiste un claim autorizzato sul recupero per la creatina.', group: 'recupero' },

  // --- longevita e invecchiamento: i claim USA del fornitore, non autorizzati in UE ---
  { term: 'longevita', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'longevity', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'invecchiamento', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'anti-age', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'antiage', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'aging', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'ageing', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'healthy aging', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },
  { term: 'telomer*', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },
  { term: 'metilazione', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },
  { term: 'methylation', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },
  { term: 'epigenetic*', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },
  { term: 'mitocondri*', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },
  { term: 'mitochondri*', reason: 'Claim USA del fornitore, non autorizzato in UE.', group: 'longevita' },

  // --- altre aree fisiologiche senza claim ---
  { term: 'immunita', reason: 'Ammesso solo dentro il claim letterale della vitamina D.', group: 'salute' },
  { term: 'immunity', reason: 'Ammesso solo dentro il claim letterale della vitamina D.', group: 'salute' },
  // `immune` e' anche dentro l'id tecnico del claim, `vitd-immune`: incollato a `-` e' un identificatore.
  { term: 'immune', reason: 'Ammesso solo dentro il claim letterale della vitamina D.', group: 'salute', technicalCollision: true },
  { term: 'sonno', reason: 'Claim non autorizzato.', group: 'salute' },
  { term: 'sleep', reason: 'Claim non autorizzato.', group: 'salute' },
  { term: 'capelli', reason: 'Claim non autorizzato.', group: 'salute' },
  { term: 'hair', reason: 'Claim non autorizzato.', group: 'salute' },
  { term: 'pelle', reason: 'Claim non autorizzato.', group: 'salute' },
  { term: 'skin', reason: 'Claim non autorizzato.', group: 'salute' },
  { term: 'zero ritenzione', reason: 'Promessa di effetto non autorizzata. Si dice "senza fase di carico".', group: 'salute' },
  { term: 'non gonfia', reason: 'Promessa di effetto non autorizzata. Si dice "senza fase di carico".', group: 'salute' },
  { term: 'senza gonfiore', reason: 'Promessa di effetto non autorizzata. Si dice "senza fase di carico".', group: 'salute' },
  { term: 'no bloating', reason: 'Promessa di effetto non autorizzata. Si dice "senza fase di carico".', group: 'salute' },
  { term: 'water retention', reason: 'Promessa di effetto non autorizzata. Si dice "senza fase di carico".', group: 'salute' },

  // --- glicina: nessun claim autorizzato, si descrive solo come "il mattone naturale della creatina" ---
  { term: 'collagene', reason: 'La glicina non ha claim autorizzati: si descrive solo come "il mattone naturale della creatina".', group: 'glicina' },
  { term: 'collagen', reason: 'La glicina non ha claim autorizzati: si descrive solo come "il mattone naturale della creatina".', group: 'glicina' },
  { term: 'glutatione', reason: 'La glicina non ha claim autorizzati: si descrive solo come "il mattone naturale della creatina".', group: 'glicina' },
  { term: 'glutathione', reason: 'La glicina non ha claim autorizzati: si descrive solo come "il mattone naturale della creatina".', group: 'glicina' },

  // --- esperti: Reg. 1924/2006 art. 12, vietati i riferimenti alla raccomandazione di singoli professionisti sanitari ---
  { term: 'raccomandato dalla dott', reason: 'Reg. 1924/2006 art. 12: vietati i riferimenti alla raccomandazione di singoli professionisti sanitari. La dottoressa spiega, non raccomanda.', group: 'esperti' },
  { term: 'consigliato dalla dott', reason: 'Reg. 1924/2006 art. 12: vietati i riferimenti alla raccomandazione di singoli professionisti sanitari. La dottoressa spiega, non raccomanda.', group: 'esperti' },
  { term: 'recommended by dr', reason: 'Reg. 1924/2006 art. 12: vietati i riferimenti alla raccomandazione di singoli professionisti sanitari.', group: 'esperti' },
  { term: 'doctor recommended', reason: 'Reg. 1924/2006 art. 12: vietati i riferimenti alla raccomandazione di singoli professionisti sanitari.', group: 'esperti' },

  // --- lessico di marketing bandito dalla voce del brand ---
  { term: 'potenziale', reason: 'Parola bandita dalla voce di peak. Numeri, non aggettivi.', group: 'marketing' },
  { term: 'potential', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'boost', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'unlock', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'rivoluzionaria', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'rivoluzionario', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'revolutionary', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'game-changer', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'gamechanger', reason: 'Parola bandita dalla voce di peak.', group: 'marketing' },
  { term: 'miracoloso', reason: 'Claim implicito di cura. Vietato per legge sugli integratori.', group: 'marketing' },
  { term: 'mojito', reason: 'Evoca un cocktail alcolico. Il gusto 02 si chiama Lime & Menta.', group: 'marketing' },

  // --- segmentazione di genere: il target e volutamente aperto ---
  { term: 'per lei', reason: 'Il target di peak non e segmentato per genere.', group: 'genere' },
  { term: 'per lui', reason: 'Il target di peak non e segmentato per genere.', group: 'genere' },
  { term: 'for her', reason: 'Il target di peak non e segmentato per genere.', group: 'genere' },
  { term: 'for him', reason: 'Il target di peak non e segmentato per genere.', group: 'genere' },
  { term: 'for men', reason: 'Il target di peak non e segmentato per genere.', group: 'genere' },
  { term: 'for women', reason: 'Il target di peak non e segmentato per genere.', group: 'genere' },

  // --- estetica da palestra: fuori tono ---
  { term: 'bodybuilding', reason: 'Estetica da palestra, fuori dal tono di peak.', group: 'palestra' },
  { term: 'bodybuilder', reason: 'Estetica da palestra, fuori dal tono di peak.', group: 'palestra' },
  { term: 'massa muscolare', reason: 'Estetica da palestra e claim non autorizzato in questa forma.', group: 'palestra' },
  { term: 'gains', reason: 'Estetica da palestra, fuori dal tono di peak.', group: 'palestra' },
  { term: 'shredded', reason: 'Estetica da palestra, fuori dal tono di peak.', group: 'palestra' },
  { term: 'pump', reason: 'Estetica da palestra, fuori dal tono di peak.', group: 'palestra' },
  { term: 'hardcore', reason: 'Estetica da palestra, fuori dal tono di peak.', group: 'palestra' },
]

/** Solo le stringhe, per chi vuole l'array nudo in un test. */
export const FORBIDDEN_WORDS: readonly string[] = FORBIDDEN_TERMS.map((t) => t.term)

// ---------------------------------------------------------------------------
// Il controllo
// ---------------------------------------------------------------------------

export interface ComplianceIssue {
  level: 'error' | 'warning'
  term: string
  reason: string
  /** Estratto del testo attorno al match, per ritrovarlo. */
  excerpt: string
}

/** Toglie accenti e normalizza, cosi' "lucidità" trova "lucidita". */
export function normalize(input: string): string {
  return input.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Vero se l'occorrenza e' incollata a un carattere che la rende un
 * identificatore tecnico invece che una parola di un testo.
 */
export function isTechnicalUse(haystack: string, index: number, length: number): boolean {
  const before = index > 0 ? haystack[index - 1] : ''
  const after = haystack[index + length] ?? ''
  return ':-.'.includes(before) || ':-('.includes(after)
}

function excerptAround(text: string, index: number, length: number): string {
  const from = Math.max(0, index - 24)
  const to = Math.min(text.length, index + length + 24)
  return `${from > 0 ? '…' : ''}${text.slice(from, to).trim()}${to < text.length ? '…' : ''}`
}

/** La regex di parola intera per un termine; `*` finale = prefisso. */
export function termPattern(term: string): RegExp {
  const prefix = term.endsWith('*')
  const needle = normalize(prefix ? term.slice(0, -1) : term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\p{L}\\p{N}])${needle}${prefix ? '\\p{L}*' : ''}(?![\\p{L}\\p{N}])`, 'giu')
}

/**
 * Gli intervalli del testo occupati da un claim autorizzato letterale: dentro,
 * i termini vietati non scattano.
 */
export function literalClaimRanges(haystack: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  for (const claim of AUTHORIZED_CLAIM_TEXTS) {
    const needle = normalize(claim)
    let from = 0
    let idx: number
    while ((idx = haystack.indexOf(needle, from)) !== -1) {
      ranges.push([idx, idx + needle.length])
      from = idx + needle.length
    }
  }
  return ranges
}

/**
 * Controlla un testo. Gli errori vanno risolti; i warning segnalano un
 * beneficio generico, che e' legittimo solo se un claim autorizzato compare
 * nello stesso blocco.
 */
export function checkCopy(text: string): ComplianceIssue[] {
  const haystack = normalize(text)
  const issues: ComplianceIssue[] = []
  const literal = literalClaimRanges(haystack)
  const insideLiteral = (i: number) => literal.some(([a, b]) => i >= a && i < b)

  for (const { term, reason, technicalCollision } of FORBIDDEN_TERMS) {
    const pattern = termPattern(term)
    let match: RegExpExecArray | null
    while ((match = pattern.exec(haystack)) !== null) {
      const skip =
        (technicalCollision && isTechnicalUse(haystack, match.index, match[0].length)) ||
        insideLiteral(match.index)
      if (!skip) {
        issues.push({ level: 'error', term, reason, excerpt: excerptAround(text, match.index, match[0].length) })
      }
      if (match.index === pattern.lastIndex) pattern.lastIndex++
    }
  }

  for (const phrase of GENERIC_BENEFIT_PHRASES) {
    const idx = haystack.indexOf(normalize(phrase))
    if (idx !== -1) {
      issues.push({
        level: 'warning',
        term: phrase,
        reason:
          'Beneficio generico, articolo 10(3) del Regolamento UE 1924/2006. Ammesso solo se un claim autorizzato compare nelle immediate vicinanze.',
        excerpt: excerptAround(text, idx, phrase.length),
      })
    }
  }

  return issues
}

/** Vero se il testo contiene, letterale, uno dei claim autorizzati. */
export function containsAuthorizedClaim(text: string): boolean {
  const haystack = normalize(text)
  return AUTHORIZED_CLAIM_TEXTS.some((c) => haystack.includes(normalize(c)))
}
