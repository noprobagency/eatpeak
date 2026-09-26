# 05 — Voce e copy

Tutto il testo approvato sta in [`src/lib/copy.ts`](../src/lib/copy.ts). I
componenti e le pagine importano da lì. Non si scrive copy direttamente in un
componente: il linter gira su tutto il sorgente, e `copy.ts` è l'unico posto dove
il testo è già stato controllato.

---

## Le tre regole

**1. Frasi che stanno in un respiro.**
Se devi prendere fiato a metà, spezzala. *"Si apre, si beve, si va."*

**2. Numeri invece di aggettivi.**
Non "una dose generosa": **3 g**. Non "dura a lungo": **30 giorni**. Non
"conveniente": **0,94 € al giorno**. È anche il motivo per cui il mono esiste nel
sistema.

**3. Mai la parola bandita.**
<!-- peak-compliance-ignore * — elenco dei termini vietati, non un uso -->
Quelle del gruppo `marketing` in `FORBIDDEN_TERMS`: potenziale, boost, unlock,
rivoluzionario, game-changer, e da questa versione **mojito**. Il linter le
blocca.

---

## La gerarchia dei claim

Cinque ruoli, in `CLAIMS` e `CLAIM_HIERARCHY`:

| Ruolo | IT | EN | Note |
|---|---|---|---|
| **Brand line** | La creatina, evoluta. | Creatine, evolved. | Descrittiva, non promette effetti. Hero e documenti. |
| **Product line** | Uno stick. Tre grammi. Tutti i giorni. | One stick. Three grams. Every day. | Il gesto e il numero. Sul pack, sotto la brand line. |
| **Sign-off** | Il piacere di sentirsi al picco. | Peak feels good. | **Beneficio generico, art. 10(3):** sempre con un claim autorizzato vicino. |
| **Rituale** | Hai preso la tua peak oggi? | Did you take your peak today? | Card, email, notifiche, CTA. |
| **Anti-barattolo** | Senza fase di carico. Senza barattoli. | No loading. No tubs. | Il protocollo come fatto. Affianca "Niente misurini. Niente grumi. Niente scuse." |

### ⚠ Il sign-off: vincolo di impaginazione, non negoziabile

"Il piacere di sentirsi al picco" è un **beneficio generico e non specifico**, e
ricade nell'articolo 10(3) del Regolamento UE 1924/2006. È ammesso **solo se
accompagnato da un claim autorizzato nelle immediate vicinanze**: hero, pack,
footer, creatività.

Nel codice non è una regola da ricordare, è un errore di compilazione:

```tsx
<Hero headline="il piacere di sentirsi al picco" usesShortClaim />
//                                               ^^^^^^^^^^^^^^
// Errore: manca authorizedClaim
```

La brand line e la product line **non** sono benefici generici: descrivono il
prodotto e il gesto. Si possono usare da sole.

---

## Il claim lungo

> Tre grammi di creatina in uno stick, con glicina e vitamina D3. Da aprire, non
> da misurare.
>
> La creatina aumenta le prestazioni fisiche in caso di serie successive di
> esercizi brevi e intensi — ma solo se la prendi tutti i giorni.
>
> Noi abbiamo reso facile quella parte.

**La seconda riga è la formulazione del claim autorizzato EFSA e non va
riscritta.** In `copy.ts` non è scritta a mano: è composta da `EFSA_CLAIMS`.

---

## Il prodotto, come si nomina

| Cosa | Testo |
|---|---|
| Nome | **peak** |
| Descrittore | creatina + glicina + vitamina D3 |
| Nome esteso (PDP, schema) | peak — Creatina + Glicina + Vitamina D3 |
| La formula | **con formula CreaVida™** — sigillo di qualità, mai promessa di risultato |
| Il formato | 30 stick monodose · una busta = 30 giorni |
| La dose | 3 g di creatina al giorno, **senza fase di carico** |
| I gusti | Nº01 Arancia Rossa · Nº02 Lime & Menta |

**Da non scrivere più:** "creatina monoidrato 100%", "zero additivi", "solo
creatina monoidrato", "di cui creatina 2,64 g". Sono usciti con la 1.0.

### La glicina

<!-- peak-compliance-ignore * — citazione dei termini vietati, non un uso -->
Si descrive **solo** come "il mattone naturale della creatina". Non ha claim
autorizzati e il linter blocca collagene e glutatione.

### La vitamina D3

Vegana, da lichene. I quattro claim autorizzati valgono solo sopra il 15% dei VNR
per dose giornaliera: finché il laboratorio non conferma il valore, i claim nel
sito portano il tag `[dal laboratorio]` accanto.

---

## La riga sul target

> Per chi si allena. Per chi non vuole perdere terreno. Per chi ha trenta secondi
> la mattina.

Tre pubblici, nessuna categoria. Il terzo non parla di sport: è intenzionale.

---

## Il marquee

```
MADE IN ITALY · 3 G DI CREATINA IN UNO STICK · SENZA FASE DI CARICO ·
CON FORMULA CREAVIDA™ · VEGAN · SPEDIZIONE GRATUITA DA 2 BUSTE
```

Tutte **prove verificabili**, non benefici. Se una voce non è controllabile da
un terzo, non ci va.

---

## I prezzi, come si dicono

Sempre **il prezzo al giorno in grande** e il totale in piccolo, in mono. Il
risparmio lo calcola il componente. Il tier 1 dice anche il costo al giorno con
la spedizione dentro: **1,30 €**. I tier 2 e 3 sono già a spedizione inclusa:
**0,98 €** e **0,94 €**.

| Tier | Nome | Buste | Prezzo | Badge |
|---|---|---|---|---|
| 1 | Inizio | 1 | 32,00 € + 6,90 € di spedizione | — |
| 2 | Abitudine | 2 (anche Duo) | 59,00 € | spedizione gratuita |
| 3 | Rituale Completo | 3 | 85,00 € | il più scelto · preselezionato · Kit Rituale · Garanzia 90 giorni |

---

## Come si parla dell'effetto

**Il prodotto non promette un effetto. Descrive un gesto e un tempo.**
L'effetto lo dice il claim autorizzato, letterale, accanto.

`WEEK_TIMELINE` non dice "inizi a sentire i benefici". Dice cosa fai e cosa
<!-- peak-compliance-ignore * — citazione dei termini vietati, non un uso -->
succede nel tempo. "Senza fase di carico" descrive il protocollo, e da lì non si
scivola in "niente ritenzione" o "non gonfia": quelle sono promesse, e il linter
le blocca.

Stessa cosa per le recensioni: **il testo va scelto, non copiato in blocco.** In
`REVIEWS` nessuna voce parla del corpo — parlano del formato, dell'abitudine,
del gusto.

---

## La dottoressa

Co-fondatrice ed esperta del brand, farmacista. **Spiega ed educa**: firma
articoli, risponde alle domande sulla formula, insegna a leggere un'etichetta.
<!-- peak-compliance-ignore * — citazione dei termini vietati, non un uso -->
**Non raccomanda** il prodotto: "consigliato dalla dott.ssa" è vietato per legge
(Reg. 1924/2006 art. 12), e il linter lo verifica. Il suo testo sta in `EXPERT`.

---

## Il registro, in pratica

<!-- peak-compliance-ignore-start * — la colonna "Non fare" cita i termini vietati per mostrarli, non e' un uso -->

| Fai | Non fare |
|---|---|
| "3 g in uno stick" | "una dose generosa" |
| "Senza fase di carico" | "Non gonfia", "zero ritenzione" |
| "Il mattone naturale della creatina" | Glicina e collagene o altro |
| "Co-fondatrice ed esperta del brand" | "Consigliato dalla dott.ssa" |
| "Nº02 Lime & Menta" | "Mojito" |
| Il claim EFSA letterale, accanto al sign-off | "Sentirsi al picco" da solo |
| "Non senti nulla, ed è normale" | "i primi risultati arrivano presto" |
| "Made in Italy" | "qualità italiana certificata" |

<!-- peak-compliance-ignore-end -->

La colonna di destra non è sbagliata perché è falsa. È sbagliata perché è vaga,
o perché è una promessa, e in questa categoria entrambe sono il primo sintomo di
un claim che non regge.
