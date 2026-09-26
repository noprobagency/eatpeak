# 07 — Setup di Claude Design e Higgsfield

Testi pronti da incollare nei campi del setup. Non riassumerli: sono già alla
lunghezza giusta per quei campi. Valgono anche come brief per Higgsfield, per i
prototipi finali.

---

## Company name

```
peak
```

---

## Blurb

> peak è un brand DTC italiano di integratori. Il primo prodotto è peak —
> Creatina + Glicina + Vitamina D3, con formula CreaVida™, in stick monodose:
> una busta da 30 stick per 30 giorni, tre grammi di creatina al giorno senza
> fase di carico. Due gusti: Nº01 Arancia Rossa e Nº02 Lime & Menta. Il target
> è volutamente aperto e non segmentato per genere. Il posizionamento non è la
> potenza ma la costanza — il prodotto funziona perché lo prendi tutti i
> giorni, e il brand esiste per rendere quel gesto facile e piacevole. La
> direzione visiva è "Clinical Joy": base bianco, carta e inchiostro con i dati
> in mono; colore-gusto pieno a tutto campo, logo bianco grande, nome del gusto
> in corsivo. Il tono è caldo, goloso, un po' giocoso, mai farmaceutico e mai da
> palestra; nei dati è preciso e asciutto. I canali previsti sono un sito
> Shopify, landing dedicate e creatività social.

---

## Any other notes

> **Palette.** Tre neutri — bianco, carta `#FAF7F2`, inchiostro `#1B1A18` — due
> colori-gusto — arancia `#E4572E` (anche primario del brand) e lime `#5E9E1F`
> — e un accento, miele `#FCD589`. I neutri sono caldi: mai grigi freddi. Un
> solo colore-gusto per composizione, sempre pieno e piatto: niente gradienti.
>
> **Tipografia.** Gabarito 900 per i display e il wordmark, **sempre in
> minuscolo**. Inter per il testo. DM Mono per ogni numero e ogni dato,
> maiuscolo con tracking 0.14em. Fraunces Italic **solo per i nomi dei gusti**
> ("Nº01 Arancia Rossa"): mai titoli, mai testo.
>
> **Wordmark.** La parola "peak" minuscola, **bianca, piena, senza contorno**,
> grande: sul fronte della busta occupa l'82% della larghezza, allineata a
> sinistra in alto; sullo stick corre lungo la lunghezza ruotata di 90°. Su
> bianco e carta è inchiostro. Il simbolo è il **vertice**: tre cerchi pieni a
> triangolo, uno sopra e due sotto — il picco, i tre ingredienti, i tre grammi.
> Dal vertice deriva il pattern a pallini con raggio crescente, nel terzo
> inferiore del pack e nelle bande, mai sotto il testo.
>
> **Forma.** Raggi generosi, pulsanti sempre a pillola, spigoli vivi solo nelle
> bande. Ombre minime, mai glow: il brand è piatto.
>
> **Contrasto.** Sui campi colore-gusto stanno solo il logo bianco e il testo
> grande; il testo corrente è inchiostro sul tint. Arancia 500, lime 500 e
> miele 300 non sono mai colore di testo su fondo chiaro.
>
> **Fotografia.** Le foto stanno su carta o dentro un campo colore pieno. Luce
> naturale, cucine, scrivanie, un bicchiere d'acqua. **Mai una palestra.** La
> co-fondatrice compare come esperta del brand — farmacista che spiega — mai
> in camice, mai come chi raccomanda.
>
<!-- peak-compliance-ignore-start * — elenco dei termini vietati, non un uso -->

> **⚠ Compliance — il vincolo che viene prima di tutto.** Il prodotto è un
> integratore venduto nell'UE: sono utilizzabili **solo i claim autorizzati
> EFSA**. Sei in tutto: due sulla creatina (prestazioni fisiche in sforzi
> ripetuti ad alta intensità; forza muscolare negli over 55 con allenamento di
> resistenza) e quattro sulla vitamina D (funzione muscolare, ossa, sistema
> immunitario, assorbimento di calcio e fosforo — validi solo sopra il 15% dei
> VNR, valore dal laboratorio). La glicina non ne ha: si descrive solo come "il
> mattone naturale della creatina". Non sono utilizzabili, in nessuna lingua,
> riferimenti a memoria, concentrazione, focus, cervello, umore, longevità,
> invecchiamento, telomeri, metilazione, mitocondri, immunità fuori dal claim
> letterale, sonno, capelli, pelle, collagene, glutatione — **e al recupero**,
> che è l'errore più frequente. Vietati "zero ritenzione", "non gonfia", "no
> bloating": si dice "senza fase di carico". Vietato "consigliato dalla
> dott.ssa" e ogni raccomandazione di un professionista sanitario. Vietati il
> lessico da marketing (potenziale, boost, unlock, game-changer, mojito), ogni
> segmentazione di genere e l'estetica da palestra. "Sentirsi al picco" è un
> beneficio generico e va **sempre accompagnato da un claim autorizzato nello
> stesso blocco visivo**. Vale anche per placeholder e contenuti di esempio.

<!-- peak-compliance-ignore-end -->

---

## Cosa dare in pasto allo strumento

In ordine di utilità:

| # | File | Perché |
|---|---|---|
| 1 | [`src/pages/DesignSystem.tsx`](../src/pages/DesignSystem.tsx) | La scheda del brand e, nei dettagli, ogni componente in ogni stato. |
| 2 | [`src/tokens/tokens.json`](../src/tokens/tokens.json) | I valori, in una forma leggibile da una macchina. |
| 3 | [`docs/06-compliance.md`](06-compliance.md) | Il vincolo. Se ne legge uno solo, questo. |
| 4 | [`src/lib/copy.ts`](../src/lib/copy.ts) | Il testo già approvato, i gusti, i prezzi. |
| 5 | [`src/lib/media.ts`](../src/lib/media.ts) | La shot list con i brief: è il piano dei prototipi finali. |
| 6 | [`src/pages/Home.tsx`](../src/pages/Home.tsx) | L'ordine in cui il brand racconta sé stesso. |
| 7 | [`assets/logo/`](../assets/logo/) e [`assets/export/pack/`](../assets/export/pack/) | Il wordmark in tracciati e i fronti esportati (`npm run export:pack`). |

---

## Cosa verificare su quello che esce

Una checklist corta, in ordine di gravità.

1. **Claim.** Compare un beneficio generico? Nello stesso blocco deve esserci il
   claim EFSA letterale. Compare una parola dell'elenco vietato? Si riscrive.
2. **Genere.** Nessuna segmentazione, in nessuna forma.
3. **Dati.** Nessun numero inventato: dove manca il valore del laboratorio, il
   tag grigio.
4. **Numeri.** I dati oggettivi sono in mono maiuscolo?
5. **Minuscolo.** I titoli display sono in minuscolo? Il corsivo è solo sul
   nome del gusto?
6. **Colore.** Un solo colore-gusto per composizione, pieno e piatto? Il logo
   bianco solo su colore o inchiostro?
7. **Contrasto.** Nessun testo corrente bianco sui campi colore.
8. **Pulsanti.** Sono pillole?
9. **Ombre.** Nessun glow, nessuna ombra colorata.
10. **Foto.** Nessuna palestra. La dottoressa spiega, non raccomanda.

Le prime tre si verificano da riga di comando:

```bash
npm run lint:compliance
```
