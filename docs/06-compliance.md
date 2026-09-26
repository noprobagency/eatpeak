# 06 — Compliance

> **Questo è il documento più importante del repo.**
> Qualunque strumento generi contenuti a valle — Claude Design, Higgsfield, un
> copywriter, un'agenzia media — deve averlo letto prima di scrivere una riga.

Il prodotto è un **integratore alimentare venduto nell'Unione Europea**. Si
applicano il Regolamento (CE) 1924/2006 sui claim nutrizionali e sulla salute e
il Regolamento (UE) 432/2012 che elenca i claim autorizzati.

La regola di fondo è semplice e non ha eccezioni: **sono utilizzabili solo i
claim autorizzati**. Non "claim veri". Non "claim ragionevoli". Non "claim che
tutti fanno". Autorizzati.

Sorgente eseguibile: [`src/lib/compliance.ts`](../src/lib/compliance.ts).
Verifica: `npm run lint:compliance`.

---

## I sei claim autorizzati

La formula CreaVida™ è creatina monoidrato + glicina + vitamina D3. I claim
autorizzati sono **due sulla creatina e quattro sulla vitamina D**. La glicina
non ne ha nessuno.

### Creatina

**1. Prestazioni fisiche in sforzi ripetuti ad alta intensità** — `physical-performance`

> **IT** — La creatina aumenta le prestazioni fisiche in caso di serie
> successive di esercizi brevi e intensi.
>
> **EN** — Creatine increases physical performance in successive bursts of
> short-term, high-intensity exercise.

Condizione d'uso: consentito solo per alimenti che apportano un'assunzione
giornaliera di **3 g di creatina**. Va informato il consumatore che il claim
riguarda adulti che praticano esercizio fisico ad alta intensità.

**2. Forza muscolare negli over 55** — `muscle-strength-55plus`

> **IT** — L'assunzione quotidiana di creatina può aumentare l'effetto
> dell'allenamento di resistenza sulla forza muscolare negli adulti oltre i
> 55 anni.
>
> **EN** — Daily creatine consumption can enhance the effect of resistance
> training on muscle strength in adults over the age of 55.

Condizione d'uso: 3 g al giorno, **in combinazione con allenamento di
resistenza** che consenta un aumento della forza muscolare.

### Vitamina D

Tutti e quattro con la stessa condizione: **solo se il prodotto apporta una
quantità significativa di vitamina D**, cioè almeno il 15% dei VNR per dose
giornaliera. Il valore è `[dal laboratorio]`: finché non arriva, questi claim
nel sito sono mostrati con il tag grigio del placeholder e non vanno stampati.

| id | IT | EN |
|---|---|---|
| `vitd-muscle` | La vitamina D contribuisce al mantenimento della normale funzione muscolare. | Vitamin D contributes to the maintenance of normal muscle function. |
| `vitd-bones` | La vitamina D contribuisce al mantenimento di ossa normali. | Vitamin D contributes to the maintenance of normal bones. |
| `vitd-immune` | La vitamina D contribuisce alla normale funzione del sistema immunitario. | Vitamin D contributes to the normal function of the immune system. |
| `vitd-calcium` | La vitamina D contribuisce al normale assorbimento/utilizzo del calcio e del fosforo. | Vitamin D contributes to normal absorption/utilisation of calcium and phosphorus. |

### Glicina

**Nessun claim autorizzato.** Nel sistema si descrive solo come **"il mattone
naturale della creatina"**: un fatto di composizione, non un effetto. Collagene,
glutatione e ogni altro territorio sono vietati dal linter.

### Non si riscrivono

Queste formulazioni **non vanno riscritte, abbreviate o rese più accattivanti**.
Sono l'unico testo del brand che deve restare letterale. Se una riga suona
scomoda in un layout, si cambia il layout.

Stanno in `EFSA_CLAIMS` e si leggono con `authorizedClaimText(id, locale)`.

---

## Cosa è vietato

**Non sono utilizzabili, in nessuna forma e in nessuna lingua**, riferimenti a:

| Gruppo | Termini | Perché |
|---|---|---|
| Cognitivo | memoria, concentrazione, focus, lucidità, cervello, mentale, umore | Nessun claim autorizzato |
| **Recupero** | recupero, recover, recovery | Nessun claim autorizzato. È l'errore più frequente |
| Longevità | longevità, invecchiamento, anti-age, healthy aging, `telomer*`, metilazione, `epigenetic*`, `mitocondri*` | Claim USA del fornitore, non autorizzati in UE |
| Salute | immunità, immune, sonno, capelli, pelle | Nessun claim autorizzato. `immune` è ammesso **solo dentro il claim letterale della vitamina D** |
| Salute | zero ritenzione, non gonfia, senza gonfiore, no bloating, water retention | Promessa di effetto non autorizzata. Si dice **"senza fase di carico"** |
| Glicina | collagene, glutatione | La glicina non ha claim autorizzati |
| Esperti | raccomandato dalla dott…, consigliato dalla dott…, recommended by dr, doctor recommended | Reg. 1924/2006 art. 12 |
| Marketing | potenziale, boost, unlock, rivoluzionario, game-changer, miracoloso, **mojito** | Fuori dalla voce del brand; mojito evoca un cocktail alcolico |
| Genere | per lei, per lui, for her, for him, for men, for women | Il target è volutamente aperto |
| Palestra | bodybuilding, massa muscolare, gains, pump, shredded, hardcore | Fuori tono |

L'elenco eseguibile, con il motivo di ogni voce, è `FORBIDDEN_TERMS`. Se lo
duplichi qui e lì diverge, mente uno dei due: fa fede il codice.

### ⚠ Attenzione particolare al recupero

"Recupero più rapido", "recover faster" e simili sono **l'errore più frequente**,
perché suonano innocui e sembrano una descrizione neutra di come funziona un
integratore sportivo. Non lo sono. **Non esiste un claim autorizzato sul
recupero per la creatina.**

### ⚠ La "fase di carico"

La 2.0 comunica **3 g al giorno, senza fase di carico**. È una descrizione del
protocollo, non un effetto. Da qui non si scivola in "niente ritenzione" o "non
gonfia": quelle sono promesse di effetto, non autorizzate, e il linter le
blocca.

---

## La dottoressa

La co-fondatrice del brand è farmacista. Nel sistema è **"co-fondatrice ed
esperta del brand"**, e il suo ruolo è **spiegare ed educare**: cos'è la
creatina, perché la costanza conta più della dose, come si legge un'etichetta.

Sul pack, nei claim e nelle creatività la dottoressa **non "raccomanda" il
prodotto**. Il Regolamento 1924/2006, articolo 12, vieta i riferimenti a
raccomandazioni di singoli medici o professionisti della salute: "consigliato
dalla dott.ssa …" è un claim vietato anche se è vero. Il linter blocca le
formule più comuni, in italiano e in inglese.

Quello che può fare: firmare un articolo, spiegare la formula in un video,
comparire come volto del brand con il suo ruolo. Quello che non può fare:
essere la ragione per cui comprare.

---

## Benefici generici — articolo 10(3)

Frasi come **"sentirsi al picco"**, "stare bene", "dare il massimo" sono
benefici generici e non specifici. Ricadono nell'**articolo 10(3)** del
Regolamento 1924/2006.

**Non sono vietate. Sono condizionate.** Sono ammesse solo se accompagnate da un
claim autorizzato **nelle immediate vicinanze**: nello stesso blocco visivo, non
in fondo alla pagina e non una volta per dominio.

La **brand line** "La creatina, evoluta." e la **product line** "Uno stick. Tre
grammi. Tutti i giorni." sono descrittive e non promettono effetti: non sono
benefici generici. Il **sign-off** "Il piacere di sentirsi al picco." lo è, e
resta sempre accompagnato.

### Come il sistema lo rende impossibile da sbagliare

Il vincolo è nel **sistema dei tipi**:

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

Stessa cosa su `<Hero>`, con la prop `usesShortClaim`. Le props sono union
discriminate: passando il flag, `authorizedClaim` diventa obbligatoria e il
componente stampa il claim EFSA nello stesso blocco con
`data-compliance="authorized-claim"`.

Il linter tratta i benefici generici come **warning**, non come errori: segnala
dove sono e chiede di verificare che la copertura ci sia.

---

## Il linter

```bash
npm run lint:compliance
```

Scandaglia `src/`, `docs/`, `README.md` e `index.html` — codice, commenti,
nomi di variabili, placeholder, contenuti demo — e classifica in tre livelli:

| Livello | Significato | Effetto |
|---|---|---|
| **Errore** | Termine vietato. | Esce con codice 1. |
| **Warning** | Beneficio generico, art. 10(3). | Passa, ma va verificata la copertura. |
| **Soppressione** | Collisione tecnica dichiarata. | Passa, ed è elencata nel report. |

L'archivio `v1/` non è nel perimetro: è storia, non sistema.

### L'allowlist delle frasi letterali

Le stringhe esatte di `EFSA_CLAIMS`, in italiano e in inglese, sono **sempre
ammesse**. È l'unico modo per scrivere "sistema immunitario" in una pagina: il
claim `vitd-immune` passa per intero, la parola `immune` fuori da quella frase
resta vietata con il messaggio "ammesso solo dentro il claim letterale della
vitamina D".

Il linter verifica questo comportamento su se stesso a ogni avvio, con un caso
positivo (il claim letterale passa) e uno negativo (la parola da sola fallisce).
Se l'auto-test fallisce, il linter non parte.

```bash
npm run lint:compliance -- --self-test
```

### Le soppressioni

Un termine vietato può collidere con un concetto tecnico legittimo. `focus` è il
caso reale: claim cognitivo vietato in prosa, ma anche pseudo-classe CSS
(`:focus-visible`), token (`--focus-ring`) ed evento del DOM.

1. **Automatico.** I termini marcati `technicalCollision` non scattano quando
   sono incollati a `:`, `-`, `.` o `(`.
2. **Esplicito.** Per la prosa tecnica serve una riga di soppressione, sulla
   stessa riga o su quella sopra, con il termine **e** la motivazione:

   ```ts
   // peak-compliance-ignore focus — anello di focus da tastiera, non un claim
   ```

   Una soppressione senza spiegazione viene ignorata. Tutte le soppressioni sono
   elencate nel report, così restano visibili.

---

## L'array esportabile

```ts
import { FORBIDDEN_TERMS, FORBIDDEN_WORDS, EFSA_CLAIMS, checkCopy } from '@/lib/compliance'

checkCopy('Recupero più rapido')
// [{ level: 'error', term: 'recupero', reason: '…', excerpt: '…' }]

checkCopy(EFSA_CLAIMS['vitd-immune'].it)
// []  — la frase letterale passa
```

```ts
type ForbiddenGroup =
  | 'cognitivo' | 'recupero' | 'longevita' | 'salute' | 'glicina'
  | 'esperti' | 'marketing' | 'genere' | 'palestra'
```

---

## Vale anche per il codice

Questo non è un documento per il reparto copy. Vale per **i testi di esempio, i
placeholder, i nomi delle variabili e i commenti nel codice**: i placeholder
finiscono in produzione, i nomi delle variabili nei log, i commenti nei prompt
degli strumenti generativi. Un `const recoveryBoost` diventa, tre passaggi dopo,
una headline.

Se un componente ha bisogno di testo segnaposto, usa il copy approvato di
[`src/lib/copy.ts`](../src/lib/copy.ts).

### I placeholder `[dal laboratorio]`

Dove serve un valore che solo il laboratorio può dare — grammi di glicina, µg e
%VNR della vitamina D3, kcal, zuccheri, aromi, dimensioni della fustella — il
sistema usa la costante `LAB_PLACEHOLDER` e lo mostra come **tag grigio**. Non si
inventa un numero per far tornare un layout.

---

## Cosa questo documento non copre

- **L'etichetta di legge sul pack.** Ha requisiti propri (D.Lgs. 169/2004,
  Reg. UE 1169/2011) e non si scrive partendo da qui. Il retro della busta è un
  segnaposto con l'elenco dei contenuti obbligatori: vedi [08 — Packaging](08-packaging.md).
- **Le notifiche al Ministero della Salute** per l'immissione in commercio.
- **La pubblicità sanitaria** e le regole delle singole piattaforme
  pubblicitarie, che sono più restrittive della legge.
- **Le altre giurisdizioni.** Questi claim valgono nell'UE. Per il Regno Unito,
  la Svizzera o gli Stati Uniti il quadro cambia.

Per l'espansione europea il registro EFSA resta lo stesso, ma le traduzioni
ufficiali dei claim vanno prese dal registro, non tradotte a mano.
