# 08 — Packaging

> **Tutto è parametrico e provvisorio.** Le fustelle del laboratorio non ci sono
> ancora: le proporzioni sono un segnaposto, i valori di composizione sono
> `[dal laboratorio]`, e la 2.0 esiste perché il passo successivo — lo sviluppo
> grafico del packaging con i prototipi finali — parta da un sistema chiuso.

I componenti stanno in [`src/components/BustaPack.tsx`](../src/components/BustaPack.tsx)
e [`StickPack.tsx`](../src/components/StickPack.tsx). Leggono il gusto da
`FLAVORS` e le proporzioni dai token `pack.*` di `tokens.json`. Cambiare il nome
del gusto 02 in `FLAVOR_02_NAME` lo cambia sulla busta, sullo stick, nelle card e
nei prototipi.

---

## La busta da 30 stick — `<BustaPack flavor lot serial />`

| Parametro | Specifica |
|---|---|
| Proporzioni | Prop `ratio`, default **2:3** (segnaposto della fustella) |
| Margini di sicurezza | Token `pack.safe` = 8% del lato corto |
| Fondo | Colore-gusto pieno a tutto campo, raggio 22 |
| Banda superiore | Token `pack.sealBand` = 8% dell'altezza, riservato alla saldatura/zip: colore-gusto con bianco al 14% sopra |
| Wordmark | Token `pack.wordmarkWidth` = 82% della larghezza |

### La gerarchia del fronte, dall'alto

1. **Wordmark bianco**, 82% della larghezza, allineato a sinistra, sotto la
   banda di saldatura.
2. **Descrittore** "creatina + glicina + vitamina D3", Inter 500.
3. **Nome del gusto** "Nº01 Arancia Rossa", Fraunces Italic 500.
4. **Blocco numero**: "3 g" grande (Gabarito 900) + "DI CREATINA AL GIORNO · 30
   STICK" (DM Mono).
5. **Pattern a pallini** nel terzo inferiore, sotto il blocco numero, senza
   attraversarlo. Raggio crescente verso destra.
6. **Piede in mono**: "CON FORMULA CREAVIDA™ · VEGAN" e, sotto, "LOTTO 01 · Nº
   0137/0500". La numerazione è stampata in variabile nel Lotto 01 (prop `lot`
   e `serial`, `PRODUCT.launchLotSize = 500`).

```tsx
<BustaPack flavor="arancia" width={320} />
<BustaPack flavor="lime" lot="01" serial={212} showGuides />
```

`showGuides` disegna i margini di sicurezza, la banda di saldatura e il limite
superiore del pattern: serve nello Showcase e nella pagina prototipi.

### Il testo piccolo sul pack

Sul pack il descrittore, il mono e il piede sono **bianchi sul campo colore**.
È una scelta di stampa, com'è nella direzione: la leggibilità si verifica sulla
prova colore con il laboratorio, non con WCAG. **Sul web vale la regola del
tint**: il testo corrente su colore è inchiostro sul tint del gusto.

### Il retro

Non ora. `<PackBack />` è il segnaposto con l'elenco dei contenuti obbligatori:

- denominazione "integratore alimentare" e nome esteso;
- ingredienti in ordine decrescente di peso `[dal laboratorio]`;
- tabella nutrizionale per stick e per dose giornaliera, con %VNR della vitamina
  D3 `[dal laboratorio]`;
- il claim sulla creatina, letterale;
- uno o più claim sulla vitamina D, solo se la dose supera il 15% dei VNR
  `[dal laboratorio]`;
- dose giornaliera: 3 g di creatina, uno stick al giorno;
- avvertenze di legge;
- conservazione;
- responsabile dell'immissione in commercio `[dal laboratorio]`;
- lotto e scadenza, stampati in variabile;
- contenuto netto `[dal laboratorio]`.

L'etichetta di legge (D.Lgs. 169/2004, Reg. UE 1169/2011) si scrive con il
laboratorio e con chi segue la notifica al Ministero, non partendo da qui.

---

## Lo stick — `<StickPack flavor />`

| Parametro | Specifica |
|---|---|
| Proporzioni | **1:5**, viewBox 100 × 500 (segnaposto) |
| Fondo | Colore-gusto pieno: la "banda parametrica" della 1.0 è diventata l'intero stick |
| Wordmark | Bianco, ruotato di 90°, alto l'80% della larghezza dello stick, verso l'alto |
| Verso il lato di strappo | "3 g" (Gabarito) + nome corto del gusto in corsivo |
| Sigillo | Il vertice libero bianco, in basso |
| Saldature | Zigrinatura bianca al 35% sopra e sotto, tacca di strappo a sinistra |

```tsx
<StickPack flavor="lime" height={320} />
```

---

## Export per il designer

```bash
npm run export:pack -- arancia --busta --size=3000
npm run export:pack -- lime --stick --size=2000
```

Esce in `assets/export/pack/`, fuori dal versionamento:

- **SVG piatto** del fronte, con il wordmark in tracciati e i testi secondari
  come testo con la famiglia dichiarata (`standalone`), così il designer può
  correggerli;
- **PNG trasparente** alla larghezza chiesta (per la busta) o all'altezza (per
  lo stick).

Come funziona: lo script carica i componenti React con il server di Vite in
modalità SSR (nessuna dipendenza in più), li rende in markup statico e scrive
l'SVG; poi passa da Chrome headless, che carica i font da Google, disegna l'SVG
su una tela e ritaglia sull'alfa. Il pattern è fatto di cerchi inline — non di
un `<foreignObject>`, che contaminerebbe la tela.

**Il PNG è per far vedere. L'SVG è il file di lavoro.**

---

## Cosa chiedere al laboratorio, prima di disegnare

Tre cose, in ordine di urgenza.

1. **La fustella della busta e dello stick**, con le zone di saldatura, la
   posizione dello zip e della tacca di strappo, e l'abbondanza di stampa. Da
   quel momento `ratio`, `pack.safe` e `pack.sealBand` diventano i valori veri e
   il fronte si ridisegna da solo.
2. **I valori di composizione**: grammi di glicina, µg e %VNR della vitamina
   D3, kcal, zuccheri, gli aromi di ciascun gusto e il peso netto. Chiudono la
   tabella, il retro e la lista ingredienti, e decidono se i quattro claim sulla
   vitamina D si possono stampare.
3. **La finitura**: il materiale della busta (mono-materiale riciclabile o
   accoppiato), opaco o lucido, e se il colore-gusto pieno a tutto campo va in
   quadricromia o in tinta piatta. L'arancia `#E4572E` e il lime `#5E9E1F` vanno
   convertiti con una prova colore, non a occhio: sono il brand.
