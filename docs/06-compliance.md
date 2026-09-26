# 06 — Compliance

> **Questo è il documento più importante del repo.**
> Qualunque strumento generi contenuti a valle — Claude Design, un copywriter,
> un'agenzia media — deve averlo letto prima di scrivere una riga.

Il prodotto è un **integratore alimentare venduto nell'Unione Europea**. Si
applicano il Regolamento (CE) 1924/2006 sui claim nutrizionali e sulla salute e
il Regolamento (UE) 432/2012 che elenca i claim autorizzati.

La regola di fondo è semplice e non ha eccezioni: **sono utilizzabili solo i
claim autorizzati**. Non "claim veri". Non "claim ragionevoli". Non "claim che
tutti fanno". Autorizzati.

Sorgente eseguibile: [`src/lib/compliance.ts`](../src/lib/compliance.ts).
Verifica: `npm run lint:compliance`.

---

## I due claim autorizzati sulla creatina

### 1. Prestazioni fisiche in sforzi ripetuti ad alta intensità

> **IT** — La creatina aumenta le prestazioni fisiche in caso di serie
> successive di esercizi brevi e intensi.
>
> **EN** — Creatine increases physical performance in successive bursts of
> short-term, high-intensity exercise.

**Condizione d'uso:** consentito solo per alimenti che apportano un'assunzione
giornaliera di **3 g di creatina**. Va informato il consumatore che il claim
riguarda adulti che praticano esercizio fisico ad alta intensità.

### 2. Forza muscolare negli over 55

> **IT** — L'assunzione quotidiana di creatina può aumentare l'effetto
> dell'allenamento di resistenza sulla forza muscolare negli adulti oltre i
> 55 anni.
>
> **EN** — Daily creatine consumption can enhance the effect of resistance
> training on muscle strength in adults over the age of 55.

**Condizione d'uso:** 3 g al giorno, **in combinazione con allenamento di
resistenza** che consenta un aumento della forza muscolare.

### Non si riscrivono

Queste formulazioni **non vanno riscritte, abbreviate o rese più accattivanti**.
Sono l'unico testo del brand che deve restare letterale. Se una riga suona
scomoda in un layout, si cambia il layout.

Stanno in `EFSA_CLAIMS` e si leggono con `authorizedClaimText(id, locale)`.

---

## Cosa è vietato

**Non sono utilizzabili, in nessuna forma e in nessuna lingua**, riferimenti a:

| Area | Termini |
|---|---|
| Cognitivo | memoria, concentrazione, focus, lucidità, cervello, energia mentale, umore |
| **Recupero** | recupero, recover, recovery |
| Longevità | longevità, invecchiamento, anti-age, telomeri |
| Altre aree | immunità, sonno, capelli, pelle |

### ⚠ Attenzione particolare al recupero

"Recupero più rapido", "recover faster" e simili sono **l'errore più frequente**,
perché suonano innocui e sembrano una descrizione neutra di come funziona un
integratore sportivo.

Non lo sono. **Non esiste un claim autorizzato sul recupero per la creatina.**
Vanno trattati esattamente come i claim cognitivi: vietati.

### Vietato anche per la voce del brand

Oltre alla legge, ci sono parole bandite perché contraddicono il tono:

- **Lessico da marketing:** potenziale, boost, unlock, formula rivoluzionaria,
  game-changer
- **Segmentazione di genere:** "per lei" / "per lui" e ogni equivalente. Il
  target di peak è volutamente aperto.
- **Estetica da palestra:** bodybuilding, massa muscolare, gains, pump, shredded,
  hardcore

---

## Benefici generici — articolo 10(3)

Frasi come **"sentirsi al picco"**, "stare bene", "dare il massimo" sono
benefici generici e non specifici. Ricadono nell'**articolo 10(3)** del
Regolamento 1924/2006.

**Non sono vietate. Sono condizionate.** Sono ammesse solo se accompagnate da un
claim autorizzato **nelle immediate vicinanze**.

"Nelle immediate vicinanze" significa nello stesso blocco visivo, non in fondo
alla pagina e non una volta per dominio. Nell'hero significa nell'hero; nel
footer significa nel footer.

### Come il sistema lo rende impossibile da sbagliare

Il vincolo non è una regola da ricordare: è nel **sistema dei tipi**.

```tsx
// ✗ Non compila: manca authorizedClaim
<SectionHeader title="il piacere di sentirsi al picco" genericBenefit />

// ✓ Compila, e stampa il claim autorizzato sotto il titolo
<SectionHeader
  title="il piacere di sentirsi al picco"
  genericBenefit
  authorizedClaim="physical-performance"
/>
```

Stessa cosa su `<Hero>`, con la prop `usesShortClaim`.

Le props sono union discriminate: passando il flag, `authorizedClaim` diventa
obbligatoria, e il componente stampa il claim EFSA nello stesso blocco con
`data-compliance="authorized-claim"`.

Il linter tratta i benefici generici come **warning**, non come errori: segnala
dove sono e chiede di verificare che la copertura ci sia.

---

## Il linter

```bash
npm run lint:compliance
```

Scandaglia `src/` e `docs/` — codice, commenti, nomi di variabili, placeholder,
contenuti demo — e classifica in tre livelli:

| Livello | Significato | Effetto |
|---|---|---|
| **Errore** | Termine vietato. | Esce con codice 1. |
| **Warning** | Beneficio generico, art. 10(3). | Passa, ma va verificata la copertura. |
| **Soppressione** | Collisione tecnica dichiarata. | Passa, ed è elencata nel report. |

### Le soppressioni

Un termine vietato può collidere con un concetto tecnico legittimo. `focus` è il
caso reale: è un claim cognitivo vietato in prosa, ma anche una pseudo-classe
CSS (`:focus-visible`), un token (`--focus-ring`) e un evento del DOM.

Due meccanismi, in ordine:

1. **Automatico.** I termini marcati `technicalCollision` non scattano quando
   sono incollati a `:`, `-`, `.` o `(` — cioè quando sono identificatori, non
   parole. `:focus-visible` passa, "migliora il focus" no.

2. **Esplicito.** Per la prosa tecnica legittima serve una riga di soppressione,
   sulla stessa riga o su quella sopra:

   ```ts
   // peak-compliance-ignore focus — anello di focus da tastiera, non un claim
   ```

   Richiede **il termine e la motivazione**: una soppressione senza spiegazione
   viene ignorata e l'errore resta. Tutte le soppressioni sono elencate nel
   report, così restano visibili invece di sparire.

---

## L'array esportabile

L'elenco canonico vive in [`src/lib/compliance.ts`](../src/lib/compliance.ts) ed
è già pronto per un test o un linter:

```ts
import { FORBIDDEN_TERMS, FORBIDDEN_WORDS, checkCopy } from '@/lib/compliance'

// tutte le stringhe, nude
FORBIDDEN_WORDS  // readonly string[]

// con motivazione e gruppo
FORBIDDEN_TERMS  // readonly ForbiddenTerm[]

// il controllo su un testo
checkCopy('Recupero più rapido')
// [{ level: 'error', term: 'recupero', reason: '…', excerpt: '…' }]
```

Un elenco solo, in un posto solo. Se lo duplichi in questo documento, il giorno
in cui aggiungi un termine ne aggiorni uno dei due e l'altro mente.

```ts
// Il gruppo di appartenenza, per filtrare o raggruppare gli errori:
type ForbiddenGroup =
  | 'cognitivo' | 'recupero' | 'longevita'
  | 'salute' | 'marketing' | 'genere' | 'palestra'
```

---

## Vale anche per il codice

Questo non è un documento per il reparto copy. Vale per **i testi di esempio, i
placeholder, i nomi delle variabili e i commenti nel codice**.

Il motivo è pratico: i placeholder finiscono in produzione, i nomi delle
variabili finiscono nei log e negli screenshot, e i commenti finiscono nei
prompt degli strumenti generativi. Un `const recoveryBoost = …` in un file
qualsiasi diventa, tre passaggi dopo, una headline.

Se un componente ha bisogno di testo segnaposto, usa i claim approvati della
[sezione 05](05-voice-and-copy.md), che stanno tutti in
[`src/lib/copy.ts`](../src/lib/copy.ts).

---

## Cosa questo documento non copre

- **L'etichetta di legge sul pack.** Ha requisiti propri (D.Lgs. 169/2004,
  Reg. UE 1169/2011) e non si scrive partendo da qui.
- **Le notifiche al Ministero della Salute** per l'immissione in commercio.
- **La pubblicità sanitaria** e le regole delle singole piattaforme
  pubblicitarie, che sono più restrittive della legge.
- **Le altre giurisdizioni.** Questi due claim valgono nell'UE. Per il Regno
  Unito, la Svizzera o gli Stati Uniti il quadro cambia.

Per l'espansione europea il registro EFSA resta lo stesso, ma le traduzioni
ufficiali dei claim vanno prese dal registro, non tradotte a mano.
