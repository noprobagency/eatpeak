/**
 * peak — compliance sui claim.
 *
 * Questo file e' la sorgente di verita' per docs/06-compliance.md e per il
 * linter in scripts/compliance-lint.mjs. Se cambi qualcosa qui, quel documento
 * va riletto.
 *
 * Il prodotto e' un integratore venduto nell'Unione Europea: sono utilizzabili
 * solo i claim autorizzati dal registro EFSA. Tutto il resto — per quanto
 * suoni innocuo — e' pubblicita' ingannevole.
 */

// ---------------------------------------------------------------------------
// I due claim autorizzati sulla creatina
// ---------------------------------------------------------------------------

/**
 * Formulazioni letterali. NON vanno riscritte, abbreviate o rese piu'
 * accattivanti: sono l'unico testo del brand che deve restare tale e quale.
 */
export const EFSA_CLAIMS = {
  'physical-performance': {
    it: 'La creatina aumenta le prestazioni fisiche in caso di serie successive di esercizi brevi e intensi.',
    en: 'Creatine increases physical performance in successive bursts of short-term, high-intensity exercise.',
    condition:
      'Consentito solo per alimenti che apportano un’assunzione giornaliera di 3 g di creatina. Va informato il consumatore che il claim riguarda adulti che praticano esercizio fisico ad alta intensita’.',
  },
  'muscle-strength-55plus': {
    it: 'L’assunzione quotidiana di creatina puo’ aumentare l’effetto dell’allenamento di resistenza sulla forza muscolare negli adulti oltre i 55 anni.',
    en: 'Daily creatine consumption can enhance the effect of resistance training on muscle strength in adults over the age of 55.',
    condition:
      'Consentito solo per alimenti che apportano un’assunzione giornaliera di 3 g di creatina, in combinazione con allenamento di resistenza che consenta un aumento della forza muscolare.',
  },
} as const

export type AuthorizedClaimId = keyof typeof EFSA_CLAIMS
export type Locale = 'it' | 'en'

export function authorizedClaimText(id: AuthorizedClaimId, locale: Locale = 'it'): string {
  return EFSA_CLAIMS[id][locale]
}

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

export interface ForbiddenTerm {
  /** Radice da cercare, minuscola. Il matching e' su parola intera. */
  term: string
  /** Perche' e' vietato. Finisce nel messaggio di errore del linter. */
  reason: string
  group: 'cognitivo' | 'recupero' | 'longevita' | 'salute' | 'marketing' | 'genere' | 'palestra'
  /**
   * Il termine collide con un identificatore tecnico inevitabile.
   * "focus" e' l'unico caso: e' un claim cognitivo vietato in prosa, ma anche
   * una pseudo-classe CSS e un evento del DOM. Quando questo flag e' attivo,
   * il controllo salta le occorrenze incollate a `:`, `-`, `.` o `(` — cioe'
   * `:focus-visible`, `--focus-ring`, `.focus()`, `focus:` — e continua a
   * segnalare la parola isolata, che e' quella che finisce in un testo.
   */
  technicalCollision?: boolean
}

/**
 * Nessuno di questi ha un claim autorizzato per la creatina, in nessuna lingua
 * e in nessuna forma. Vale anche per placeholder, nomi di variabili e commenti.
 */
export const FORBIDDEN_TERMS: readonly ForbiddenTerm[] = [
  // --- claim cognitivi: nessuno autorizzato ---
  { term: 'memoria', reason: 'Claim cognitivo non autorizzato per la creatina.', group: 'cognitivo' },
  { term: 'memory', reason: 'Claim cognitivo non autorizzato per la creatina.', group: 'cognitivo' },
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

  // --- longevita e invecchiamento ---
  { term: 'longevita', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'longevity', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'invecchiamento', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'anti-age', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'antiage', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'aging', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'ageing', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'telomeri', reason: 'Claim non autorizzato.', group: 'longevita' },
  { term: 'telomere', reason: 'Claim non autorizzato.', group: 'longevita' },

  // --- altre aree fisiologiche senza claim ---
  { term: 'immunita', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'immunity', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'immune', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'sonno', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'sleep', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'capelli', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'hair', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'pelle', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },
  { term: 'skin', reason: 'Claim non autorizzato per la creatina.', group: 'salute' },

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
function normalize(input: string): string {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
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

/**
 * Controlla un testo. Gli errori vanno risolti; i warning segnalano un
 * beneficio generico, che e' legittimo solo se un claim autorizzato compare
 * nello stesso blocco.
 */
export function checkCopy(text: string): ComplianceIssue[] {
  const haystack = normalize(text)
  const issues: ComplianceIssue[] = []

  for (const { term, reason, technicalCollision } of FORBIDDEN_TERMS) {
    const needle = normalize(term)
    // Parola intera: evita che "recover" scatti dentro "recoverable" e che
    // "pump" scatti dentro "pumpkin".
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'giu')
    let match: RegExpExecArray | null
    while ((match = pattern.exec(haystack)) !== null) {
      if (!(technicalCollision && isTechnicalUse(haystack, match.index, needle.length))) {
        issues.push({ level: 'error', term, reason, excerpt: excerptAround(text, match.index, needle.length) })
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

/** Vero se il testo contiene, letterale, uno dei due claim autorizzati. */
export function containsAuthorizedClaim(text: string): boolean {
  const haystack = normalize(text)
  return Object.values(EFSA_CLAIMS).some(
    (c) => haystack.includes(normalize(c.it)) || haystack.includes(normalize(c.en)),
  )
}
