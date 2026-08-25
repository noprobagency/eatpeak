# 05 — Voce e copy

Tutto il testo approvato sta in [`src/lib/copy.ts`](../src/lib/copy.ts). I
componenti e le pagine demo importano da lì. Non si scrive copy direttamente in
un componente: il linter gira su tutto il sorgente, e `copy.ts` è l'unico posto
dove il testo è già stato controllato.

---

## Le tre regole

**1. Frasi che stanno in un respiro.**
Se devi prendere fiato a metà, spezzala. *"Si apre, si beve, si va."* — tre
respiri corti, non una frase.

**2. Numeri invece di aggettivi.**
Non "una dose generosa": **3 g**. Non "dura a lungo": **30 giorni**. Non
"conveniente": **0,97 € al giorno**. È anche il motivo per cui il mono esiste nel
sistema — i numeri hanno una voce tipografica propria.

**3. Mai la parola bandita.**
<!-- peak-compliance-ignore * — elenco dei termini vietati, non un uso -->
Quella del gruppo `marketing` in `FORBIDDEN_TERMS`, insieme a boost, unlock,
formula rivoluzionaria e game-changer. Il linter la blocca.

---

## Il claim corto

| | |
|---|---|
| **IT** | Il piacere di sentirsi al picco. |
| **EN** | Peak feels good. |

Alternative EN approvate, in ordine di preferenza:

1. *The pleasure of feeling your peak.*
2. *Feel your peak.*

### ⚠ Vincolo di impaginazione, non negoziabile

Il claim corto è un **beneficio generico e non specifico**, e ricade
nell'articolo 10(3) del Regolamento UE 1924/2006. È ammesso **solo se
accompagnato da un claim autorizzato nelle immediate vicinanze**.

Quindi: ovunque compaia il claim corto — hero, pack, footer, creatività — deve
comparire anche il claim autorizzato.

Nel codice questo non è una regola da ricordare, è un errore di compilazione:

```tsx
<Hero headline="il piacere di sentirsi al picco" usesShortClaim />
//                                               ^^^^^^^^^^^^^^
// Errore: manca authorizedClaim
```

Vedi [06 — Compliance](06-compliance.md).

---

## Il claim lungo

### IT

> Tre grammi di creatina in uno stick. Da aprire, non da misurare.
>
> La creatina aumenta le prestazioni fisiche in caso di serie successive di
> esercizi brevi e intensi — ma solo se la prendi tutti i giorni.
>
> Noi abbiamo reso facile quella parte.

### EN

> Three grams of creatine in a single stick. Tear it, drink it, go.
>
> Creatine increases physical performance in successive bursts of short-term,
> high-intensity exercise — but only if you actually take it every day.
>
> We made that part easy.

**La seconda riga è la formulazione del claim autorizzato EFSA e non va
riscritta, abbreviata o resa più accattivante.** È l'unico testo del brand che
deve restare letterale.

In `copy.ts` quella riga non è scritta a mano: è composta a partire da
`EFSA_CLAIMS`, così non può divergere dal testo ufficiale.

---

## La riga sul target

Opzionale, mai segmentante:

> Per chi si allena. Per chi non vuole perdere terreno. Per chi ha trenta secondi
> la mattina.

Tre pubblici, nessuna categoria. Nota che il terzo non parla di sport: è
intenzionale.

---

## Gli altri claim approvati

| Ruolo | IT | EN |
|---|---|---|
| Prodotto | Uno stick. Tre grammi. Tutti i giorni. | One stick. Three grams. Every day. |
| Narrativo | Settimana 1: niente. Settimana 3: tutto. | Week 1: nothing. Week 3: everything. |
| Contro il barattolo | Niente misurini. Niente grumi. Niente scuse. | No scoops. No clumps. No excuses. |
| Gesto | Si apre, si beve, si va. | Tear it, drink it, go. |

### Contenuto di default del Marquee

```
MADE IN ITALY · DOSE PIENA IN UNO STICK · NIENTE MISURINI ·
TESTATA IN LABORATORIO · SPEDIZIONE GRATUITA DA 2 PEZZI
```

Sono tutte **prove verificabili**, non benefici. È la regola della banda: se una
voce non è controllabile da un terzo, non ci va.

---

## Come si parla dell'effetto

Questa è la parte delicata, ed è dove la maggior parte degli errori nasce.

**Il prodotto non promette un effetto. Descrive un gesto e un tempo.**
L'effetto lo dice il claim autorizzato, letterale, accanto.

Guarda `WEEK_TIMELINE` in `copy.ts`:

> **Settimana 1 — niente.** Apri il primo stick. Non senti nulla, ed è normale: i
> muscoli si stanno riempiendo.

Non dice "inizi a sentire i benefici". Dice cosa fai e cosa succede nel tempo.
La differenza sembra sottile e non lo è: la prima formulazione è un claim, la
seconda è una descrizione.

Stessa cosa per le recensioni. Una recensione che parla di effetti fisiologici è
un claim anche se l'ha scritta un cliente: **il testo va scelto, non copiato in
blocco**. In `REVIEWS` nessuna voce parla del corpo — parlano tutte del formato,
dell'abitudine, dei grumi.

---

## Vietato ovunque

Nel codice, nei placeholder, nei contenuti demo, nei nomi delle variabili e nei
commenti:

- Il lessico da marketing del gruppo `marketing` in `FORBIDDEN_TERMS`
- Qualsiasi segmentazione di genere
<!-- peak-compliance-ignore * — elenco dei termini vietati, non un uso -->
- Estetica o linguaggio da palestra, bodybuilding, sport agonistico

L'elenco eseguibile e il perché di ogni voce stanno in
[`src/lib/compliance.ts`](../src/lib/compliance.ts).

---

## Il registro, in pratica

| Fai | Non fare |
|---|---|
| "3 g in uno stick" | "una dose generosa" |
| "30 giorni" | "una scorta che dura" |
| "Si scioglie in qualche secondo" | "solubilità superiore" |
| "Niente misurini" | "esperienza d'uso semplificata" |
| "Non senti nulla, ed è normale" | "i primi risultati arrivano presto" |
| "Made in Italy" | "qualità italiana certificata" |

La colonna di destra non è sbagliata perché è falsa. È sbagliata perché è vaga,
e la vaghezza in questa categoria è il primo sintomo di un claim che non regge.
