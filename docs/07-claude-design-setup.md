# 07 — Setup di Claude Design

Testi pronti da incollare nei campi del setup. Non riassumerli: sono già alla
lunghezza giusta per quei campi.

---

## Company name

```
peak
```

---

## Blurb

> peak è un brand DTC italiano di integratori. Il primo prodotto è creatina
> monoidrato in stickpack monodose, confezione da 30 giorni, tre grammi per
> stick. Il target è volutamente aperto e non segmentato per genere: chi si
> allena, chi vuole invecchiare bene, chi lavora molto. Il posizionamento non è
> la potenza ma la costanza — il prodotto funziona perché lo prendi tutti i
> giorni, e il brand esiste per rendere quel gesto facile e piacevole. Il tono è
> caldo, goloso, un po' giocoso, mai farmaceutico e mai da palestra. I canali
> previsti sono un sito Shopify, landing page dedicate e creatività social.

---

## Any other notes

> **Palette.** Terracotta `#E9724C` come primario e miele `#FCD589` come
> secondario, con bosco `#2F6E5E` come unico contrasto freddo. I neutri sono
> caldi (`#FAF9F7` → `#1B1A18`): mai grigi neutri puri o freddi, spezzano la
> temperatura di tutto il resto.
>
> **Tipografia.** Display rounded pesante (Rund Display 900, fallback Gabarito)
> **sempre in minuscolo** — il minuscolo è identità, non stile. Testo in Rund
> Text, fallback Inter. Un mono (DM Mono) porta tutti i dati oggettivi —
> dosaggi, grammi, prezzi, conteggi — sempre maiuscolo con tracking 0.14em. Il
> mono non è decorativo: è il contrappeso che impedisce al rounded di diventare
> infantile. Toglilo e peak diventa una caramella.
>
> **Forma.** Raggi generosi (card 22–30px), pulsanti sempre a pillola, spigoli
> vivi solo nelle bande a tutta larghezza. Ombre minime e mai colorate, mai
> glow: il brand è piatto.
>
> **Wordmark.** La parola "peak" minuscola, pieno miele con contorno terracotta
> **esterno** al disegno della lettera (`paint-order="stroke"`), così la lettera
> non si assottiglia. Il filo non scala col logo: sotto i 60px va alleggerito,
> altrimenti chiude le contro-forme di "e" e "a". Il simbolo è una saetta rivolta
> **verso l'alto** — legge come ascesa, non come scarica elettrica.
>
> **Contrasto.** Miele 300 e terracotta 400 non sono mai colore di testo su
> fondo chiaro: vivono come riempimento, fondo o bordo. Per il testo brand su
> chiaro si usa terracotta 600 o 700. Su fondo terracotta 400 il testo è
> terracotta 900; il bianco è ammesso solo per il testo grande.
>
<!-- peak-compliance-ignore-start * — elenco dei termini vietati, non un uso -->

> **⚠ Compliance — il vincolo che viene prima di tutto.** Il prodotto è un
> integratore venduto nell'UE: sono utilizzabili **solo i claim autorizzati
> EFSA**. Sulla creatina ne esistono due, uno sulle prestazioni fisiche in
> sforzi ripetuti ad alta intensità e uno sulla forza muscolare negli over 55
> con allenamento di resistenza. Non sono utilizzabili, in nessuna lingua,
> riferimenti a memoria, concentrazione, focus, lucidità mentale, cervello,
> umore, longevità, invecchiamento, anti-age, telomeri, immunità, sonno,
> capelli, pelle — **e al recupero**, che è l'errore più frequente perché suona
> innocuo ma non ha alcun claim autorizzato. Vietati anche il lessico da
> marketing (potenziale, boost, unlock, game-changer), ogni segmentazione di
> genere e l'estetica da palestra. Frasi come "sentirsi al picco" sono benefici
> generici ai sensi dell'articolo 10(3) e sono ammesse **solo se accompagnate da
> un claim autorizzato nelle immediate vicinanze**, cioè nello stesso blocco
> visivo. Vale anche per placeholder e contenuti di esempio.

<!-- peak-compliance-ignore-end -->

---

## Cosa dare in pasto allo strumento

In ordine di utilità:

| # | File | Perché |
|---|---|---|
| 1 | [`src/pages/Showcase.tsx`](../src/pages/Showcase.tsx) | Ogni token col suo valore, ogni componente in ogni stato. È la mappa. |
| 2 | [`src/tokens/tokens.json`](../src/tokens/tokens.json) | I valori, in una forma leggibile da una macchina. |
| 3 | [`docs/06-compliance.md`](06-compliance.md) | Il vincolo. Se ne legge uno solo, questo. |
| 4 | [`src/lib/copy.ts`](../src/lib/copy.ts) | Il testo già approvato, da riusare invece di inventarne. |
| 5 | [`src/pages/LandingDemo.tsx`](../src/pages/LandingDemo.tsx) | L'ordine in cui il brand racconta sé stesso. |

---

## Cosa verificare su quello che esce

Una checklist corta, in ordine di gravità.

1. **Claim.** Compare un beneficio generico? Allora nello stesso blocco deve
   esserci il claim EFSA letterale. Compare una parola dell'elenco vietato?
   Si riscrive.
2. **Genere.** Nessuna segmentazione, in nessuna forma.
3. **Numeri.** I dati oggettivi sono in mono maiuscolo?
4. **Minuscolo.** I titoli display sono in minuscolo?
5. **Contrasto.** Nessun testo in miele 300 o terracotta 400 su fondo chiaro.
6. **Pulsanti.** Sono pillole?
7. **Ombre.** Nessun glow, nessuna ombra colorata.

Le prime due si verificano da riga di comando:

```bash
npm run lint:compliance
```
