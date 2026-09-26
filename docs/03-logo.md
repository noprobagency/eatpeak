# 03 — Logo e simbolo

Tutte le geometrie e le varianti stanno in
[`src/brand/paths.ts`](../src/brand/paths.ts) e nel tracciato generato
[`src/brand/wordmark.json`](../src/brand/wordmark.json). I componenti `<Logo>`,
`<Icon>`, `<Lockup>` e `<DotField>` si limitano a disegnarli, e il generatore in
`scripts/generate-assets.mjs` legge gli **stessi** file: gli SVG statici non
possono andare fuori sincrono col codice.

```bash
npm run brand:vectorize                       # il tracciato di ripiego (Gabarito 900)
npm run brand:vectorize -- --font-id=rund     # il wordmark della v1, solo in locale (Rund trial)
npm run assets:generate                       # logo, lockup, favicon, PNG, ICO, manifest
```

---

## 3.1 — il marchio oggi

Le sezioni dopo questa raccontano la 2.0 e la 3.0 e restano per la storia.
Dove non coincidono, vale questa.

### Il wordmark: quello della v1, bianco o ambra

La parola è **`peak`** in **Rund Display Black**, il wordmark della v1, con il
suo tracking (−2 su un corpo 60, cioè **−0,0333em**): la "e" che entra nella
"a", i tondi pieni. Senza il contorno della v1: **un solo colore, pieno**.

- **Bianco** su ogni fondo colore: ambra 400 e 700, i campi gusto, lime 700,
  le foto con campo pieno. È il logo del packaging e del footer.
- **Ambra** (`#FFAE34`) su bianco e carta: header, documenti.
- Mai cacao, mai nero, mai due colori. Il colore-gusto resta solo al pack
  Neutro.

È un logo, non testo: la soglia del 4,5:1 non lo riguarda. Ambra su bianco e
bianco su ambra fanno entrambi **1,85:1**: è una scelta del brand, e vale solo
per il segno, mai per le parole.

**Rund è in licenza TRIAL** ("evaluation only"). Il tracciato si genera in
locale (`--font-id=rund`, dal file in `assets/fonts/rund-900.otf`) e va in
`src/brand/wordmarks/rund.json`, **fuori da git** come il font. Dove non c'è
— Vercel, un clone pulito — `wordmarkFor()` torna il **ripiego**,
`src/brand/wordmark.json`: lo stesso segno in Gabarito 900, cioè la v1 com'era
senza il font installato. Anche gli asset committati (`assets/logo/`) usano il
ripiego; quelli con il tracciato vero escono in `assets/export/logo-v1/`, fuori
da git. Con la **licenza desktop** di Rund Display Black il tracciato si
committa e il ripiego sparisce: per un logo in tracciati non serve la licenza
web.

### Il simbolo: quattro punti

**Quattro cerchi pieni, un solo colore**, diametri **0,64 · 0,76 · 0,88 · 1**
(1 è il più grande). Tre geometrie in `SYMBOL_GEOMETRY` (`paths.ts`), ognuna
nel suo viewBox, `(cx, cy, r)`:

| Geometria | viewBox | Punti | Spazio fra i punti |
|---|---|---|---|
| **montagna** (a riposo) | 213 × 171,6 | (32, 139.6, 32) · (111.8, 133.6, 38) · (59.3, 58, 44) · (163, 50, 50) | 0,1 del diametro maggiore |
| **salita** (diagonale a 36°) | 305,3 × 244,2 | (32, 212.2, 32) · (96.7, 165.2, 38) · (171.2, 111.1, 44) · (255.3, 50, 50) | 0,1 |
| **favicon** | 228,2 × 180,1 | (32, 148.1, 32) · (121.8, 142.1, 38) · (64.4, 57.8, 44) · (178.2, 50, 50) | 0,2, perché a 16px non si impastino |

Colori: **ambra 700** su chiaro, **cacao** sull'ambra, **bianco** sugli altri
fondi colore. È la variante **V7** dietro `SYMBOL_VARIANT`; le varianti a tre
punti della 3.0 (V0–V6) restano in `#/lab/simbolo`, come archivio.

### La salita

Nell'header, al passaggio del puntatore (o arrivando con la tastiera), i
quattro punti passano dalla montagna alla diagonale, dal più piccolo al più
grande, e poi compare il wordmark. Componente `<SymbolRise />`, stile in
`src/brand/salita.css`, numeri in `SALITA_MOTION`.

- **520ms**, ritardi **0 / 60 / 120 / 190ms** (l'ultimo sale per ultimo),
  easing **`cubic-bezier(.3,1.45,.5,1)`**.
- Tutto in em: i punti sono span con `left` / `bottom`, e il contenitore del
  simbolo si allarga e si alza insieme a loro (100 unità = 0,5em).
- Il wordmark: `max-width` 0 → 3,4em, opacità 0 → 1, `translateX(-6px)` → 0,
  in 400ms, dopo l'ultimo punto; lo spazio dal simbolo è 0,3em.
- All'uscita si torna alla montagna **senza ritardi**. Mai in loop.
- **Touch** (`hover: none`): la salita parte una volta al caricamento e resta;
  un tap la ripete.
- **`prefers-reduced-motion`**: i punti non si muovono, compare solo il
  wordmark.

Nell'header cambia solo il simbolo con la sua animazione (a 28px di corpo) e
il colore della striscia annunci (ambra 400, testo cacao). Il resto è del
proprietario.

### Il lockup

Simbolo a montagna + wordmark, **centrati in verticale sulla scritta**, con
**0,3em** di spazio, misurati sul corpo del wordmark (`size`).

| Fondo | Simbolo | Wordmark |
|---|---|---|
| bianco, carta (`light`) | ambra 700 | ambra |
| ambra 400 (`brand`) | cacao | bianco |
| altri fondi colore (`flavor`, `dark`) | bianco | bianco |

```tsx
<Lockup size={64} />
<Lockup size={56} background="brand" />
<Lockup size={56} orientation="vertical" background="dark" />
```

### Il favicon e gli asset

Quadrato **ambra 400**, raggio **24%** del lato, i quattro punti **cacao** con
la geometria `favicon`, al **64%** del lato. `npm run assets:generate` scrive
`favicon.ico` (16, 32, 48), `favicon.svg`, `apple-touch-icon.png` (180, senza
raggio), `icon-192.png`, `icon-512.png`, i PNG da 16 a 512 in `assets/favicon/`
(`peak-simbolo-*`) e il manifest con **`theme_color #FFAE34`**, che è anche
il `theme-color` di `index.html`.

---

## Il wordmark (2.0–3.0)

La parola è **`peak`**, sempre minuscola, **nel font candidato attivo** (default
**Nunito 900**; Gabarito 800 è il controllo), **vettorializzata in tracciati**. Il logo non dipende più da nessun font: si apre ovunque, si stampa
ovunque, si vede uguale ovunque.

**Un solo colore, pieno, senza contorno.** Via il riempimento miele con il
contorno terracotta, via i tre spessori, via le undici varianti della 1.0.

### Il tracciato

Generato da `scripts/vectorize-wordmark.mjs` con opentype.js, a partire dal TTF
statico del candidato (`--font-id=<id>`, `--all` per tutti, `--download` li
scarica da Google Fonts; tutti SIL OFL). Il file del font non si committa; i
tracciati sì, uno per candidato in `src/brand/wordmarks/<id>.json`. `<Logo>`
legge quello attivo con `useWordmark()`, e `npm run assets:generate` esporta
gli SVG con il default e il simbolo di `SYMBOL_VARIANT`.

| | |
|---|---|
| Font | il candidato attivo: Nunito Black 900 di default, Gabarito 800 come controllo |
| Tracking | **-0.04em** |
| viewBox | per candidato (Gabarito: 201.8 × 87.1) |
| Altezza della "e" | 51.3 (il 59% del blocco, Gabarito) |

### La scelta del tracking

Il generatore misura le distanze fra i tracciati delle lettere per i tre valori
in prova (`npm run brand:vectorize -- --compare`):

| Tracking | Larghezza | p-e | e-a | a-k |
|---|---|---|---|---|
| -0.03em | 204.8 | 0.00 | -0.10 | 4.60 |
| **-0.04em** | **201.8** | **-1.00** | **-1.10** | **3.60** |
| -0.05em | 198.8 | -2.00 | -2.10 | 2.60 |

A -0.03 la "k" galleggia. A -0.05 le pance di "e" e "a" si toccano fino a
fondersi. **-0.04** tiene "p", "e" e "a" quasi a contatto — com'è nella
direzione — e lascia alla "k" l'aria che le serve per le sue aste. È il default
ed è quello nel tracciato di ogni candidato (le misure qui sono di Gabarito).

### Le tre varianti

| Variante | Colore | Quando |
|---|---|---|
| `white` | `#FFFFFF` | **Primaria.** Su ogni campo colore-gusto (arancia, lime) e sui profondi (arancia 600, lime 700). È il logo del packaging. |
| `ink` | `#3A2A22` (cacao 900) | Su bianco e carta: header del sito, documenti. Per la stampa a un colore c'è l'export `print` in `#1B1A18`, fuori dal sito. |
| `flavor` | arancia 500 o lime 500 | Solo su bianco o carta, solo sopra i 48px di altezza. Uso raro: pubblicità su fondo chiaro. |

`<Logo>` accetta `size` (larghezza in px), `variant`, `flavor` e `align`.
`background` (`light | flavor | dark`) sceglie la variante da solo:
`flavor`/`dark` → bianco, `light` → cacao. In sviluppo avvisa se il logo
bianco finisce su un fondo chiaro, se la variante colore-gusto scende sotto i
48px o se la misura è sotto la minima.

```tsx
<Logo size={420} background="flavor" />     // bianco
<Logo size={96} variant="ink" />            // header
<Logo size={300} variant="flavor" flavor="lime" />
```

### Le regole di scala

| Dove | Quanto |
|---|---|
| Fronte della busta | **80–85% della larghezza**, allineato a sinistra, in alto |
| Stick | Lungo la lunghezza, **ruotato di 90°**, alto l'80% della larghezza dello stick |
| Header del sito | Minimo **96px** di larghezza su desktop, **80px** su mobile |
| Hero | XL |

**Misura minima:** 48px di larghezza sullo schermo, 12mm in stampa.

**Area di rispetto:** l'altezza della "e" minuscola su tutti i lati.
`CLEARSPACE_RATIO = 0.59`, calcolato sul tracciato.

### Il contrasto del bianco sui campi colore

| | Rapporto |
|---|---|
| Bianco su arancia 500 | **3,68:1** |
| Bianco su lime 500 | **3,29:1** |

Sopra 3:1: ammesso per il logo e per il testo grande. Il testo corrente sui campi
colore è vietato — si usa inchiostro sul tint. La tabella completa è in
[02 — Token](02-tokens.md).

---

## Il vertice (2.0–3.0)

Il simbolo è il **vertice**: tre cerchi pieni e uguali disposti a triangolo, uno
sopra e due sotto. La saetta della 1.0 è uscita dal sistema.

Cosa significa:

- **il picco** — "peak", senza disegnare una montagna;
- **3 ingredienti** — creatina, glicina, vitamina D3;
- **3 g** — la dose;
- un segno a **particella**, che porta il lato scientifico della direzione senza
  disegnare molecole.

### Geometria

viewBox 100 × 100.

| Versione | Cerchi |
|---|---|
| **Nel contenitore** (`rect x=2 y=2 w=96 h=96 rx=26`) | r = 12, centri (50,33), (33,64), (67,64) |
| **Libero**, senza contenitore | r = 14, centri (50,30), (30,66), (70,66) |
| **Sotto i 24px resi** | r = 13 nel contenitore, per non far fondere i punti |

Il raggio 26 del contenitore non scende mai sotto i 4px assoluti una volta reso.

### Le quattro varianti

| # | Contenitore | Punti | Quando |
|---|---|---|---|
| 1 | arancia 500 | bianchi | **Primaria:** favicon, app icon, avatar social |
| 2 | lime 500 | bianchi | Comunicazioni del gusto 02 |
| 3 | inchiostro | bianchi | Documenti, stampa a un colore, dark mode |
| 4 | nessuno | colore-gusto o inchiostro | Lockup, sigillo sul retro dello stick |

```tsx
<Icon size={64} />                            // arancia
<Icon size={64} variant="lime" />
<Icon size={40} variant="free" color="ink" />
```

Ogni variante è esportata in `assets/favicon/` come SVG a **512, 192, 96, 64,
48, 32 e 16px**; le tre nel contenitore anche in PNG. Il rasterizzatore in
`scripts/lib/raster.mjs` disegna i cerchi con lo stesso supercampionamento 4×4
dei poligoni.

### Usi del vertice

Favicon, app icon, avatar social, sigillo sullo stick, seme del pattern. **Mai
come icona funzionale nell'interfaccia:** il vertice è il marchio, e riusarlo
come pittogramma per "tre" o "ingredienti" lo svaluta.

### I file per il deploy

`npm run assets:generate` scrive in `public/`:

| File | Cosa |
|---|---|
| `favicon.ico` | multi-risoluzione, con 16, 32 e 48 dentro, dalla variante arancia |
| `favicon.svg` | la versione vettoriale, preferita dai browser moderni |
| `apple-touch-icon.png` | 180×180, senza raggio: iOS arrotonda da sé |
| `icon-192.png`, `icon-512.png` | icone PWA |
| `site.webmanifest` | manifest con `theme_color #E4572E` |

---

## Il lockup (2.0–3.0)

Vertice libero e wordmark. **Lo spazio tra i due è pari alla metà dell'altezza
del simbolo.** È l'unica regola di lockup necessaria. Esiste anche la versione
verticale: simbolo sopra, parola sotto, stesso spazio.

Su bianco e carta il lockup è wordmark inchiostro + vertice nel colore-gusto;
su un campo colore o su inchiostro è tutto bianco.

```tsx
<Lockup iconSize={64} />
<Lockup iconSize={64} orientation="vertical" flavor="lime" />
<Lockup iconSize={56} background="dark" />
<Lockup iconSize={56} withClearspace />
```

Gli SVG sono in `assets/logo/peak-lockup-*.svg`, tutti in tracciati.

---

## Il pattern a pallini — `<DotField>`

Una griglia di punti che deriva dal vertice, con **raggio crescente lungo una
direzione**: densità a gradiente, effetto retino.

| Prop | Cosa |
|---|---|
| `rows`, `cols` | la griglia |
| `direction` | `up | down | left | right`: il verso in cui il raggio cresce |
| `color` | il colore dei punti |
| `opacity` | da / a |
| `radius` | da / a, in unità di cella |
| `stagger` | righe sfalsate di mezza cella |
| `stretch` | riempie il contenitore deformando la griglia |

**Default da pack:** punti bianchi con opacità dal 18% al 40%, raggio da 1 a 7,
righe sfalsate.

**Uso:** terzo inferiore del fronte busta e bande hero. **Mai sotto il testo:** il
pattern sta sotto il blocco dati, non lo attraversa. **Statico:** nessuna
animazione.

`dotFieldPoints()` è la geometria pura e `<DotFieldGroup>` la stessa griglia come
`<g>` da mettere dentro un altro SVG: è così che il fronte della busta la disegna
senza `<foreignObject>`, che contaminerebbe la tela nell'export.

---

## Il sistema a pallini (3.0)

Il punto non decora: **conta**. In peak ogni pallino è un giorno fatto. La
creatina lavora per accumulo e il sistema lo rende visibile con tre formati,
uno per compito. Il logo resta pieno: i punti lavorano intorno.

| Formato | Cosa fa | Dove |
|---|---|---|
| **Simbolo** (firma) | Tre punti: la vetta, tre ingredienti, 3 g. L'unico simbolo, accanto al logo, mai dentro le lettere. | favicon, sigillo, lockup, loader |
| **Griglia** (conta) | Punti uguali su passo fisso, tre stati. La disciplina resa visibile. `<DayDot />` | calendario, stick 01–30, tier 30/60/90, stock |
| **Retino** (accumula) | Punti che crescono da radi a densi, in una sola direzione. `<DotField />` | pack, hero, footer (H3) |

**Due famiglie.** I punti **geometrici** — il simbolo, l'interfaccia, il
retino — restano perfetti. I punti **a mano** (`<HandDot />`) sono il segno
del cliente: il calendario da segnare, il rituale dei 30 punti, il retro
busta, le numerazioni 01/02/03, i divisori. Il sistema è preciso, il segno è
a mano.

**I tre stati, sempre gli stessi:** da fare (anello cacao 500 al 40%) · fatto
(arancia 500 su chiaro, bianco su colore) · oggi (miele pieno con anello
arancia 700). Mai inchiostro.

### Le varianti del simbolo

Tre punti uguali a triangolo ricordano Asana. In `SYMBOL_VARIANTS` ci sono sei
cambi minimi — crescendo, punta miele, su griglia, pendio, e le due somme — e
il flag `SYMBOL_VARIANT` sceglie quella attiva (default proposto: **V5**,
crescendo con la punta miele). `#/lab/simbolo` le mostra tutte a 16/32/64/256
px, sui quattro fondi, nel lockup e accanto al "test Asana". **La scelta
finale è del brand.** Cambiato il flag, `npm run assets:generate` rigenera
favicon, lockup e PNG.

### Le sei regole anti-eccesso

1. **Il master "peak" non si puntina mai.** Il wordmark resta pieno; il retino
   lo attraversa solo nel footer, in grande, al passaggio (H3).
2. **Un solo formato di punti per superficie.** Simbolo, griglia o retino: mai
   due insieme.
3. **Retino al massimo su 1/3, mai sotto il testo.**
4. **Un solo punto miele per vista: è sempre "oggi".**
5. **Passo fisso, un colore, un livello: niente moiré.**
6. **Si muove solo se tu fai qualcosa. Mai loop.** Le micro-interazioni
   (respiro del simbolo, punta miele alla conferma, retino al passaggio, il
   punto della CTA che si riempie, la sottolineatura a pallini) durano meno di
   mezzo secondo e partono da un gesto.

---

## Usi vietati

Lo Showcase li mostra barrati nei dettagli tecnici. Qui l'elenco.

| ✗ | Perché |
|---|---|
| **Contorni** | Il wordmark 2.0 è pieno. Un filo lo riporta alla 1.0. |
| **Doppio colore** | Un solo colore, sempre: bianco, inchiostro o colore-gusto. |
| **Gradienti** | Il brand è piatto. Il pieno è un colore solido. |
| **Ombre o glow** | Lo spostano nell'estetica supplement-tech da cui vuole stare lontano. |
| **Rotazioni** | Tranne i 90° sullo stick, dove il logo corre lungo la lunghezza. |
| **Tracking modificato** | È fissato a -0.04em nel tracciato. Non esiste una prop per cambiarlo. |
| **Logo su foto senza campo di colore pieno** | Il bianco pieno tiene su una tinta piatta, non su una texture. |
| **Logo bianco su fondi chiari** | Non si legge. Su bianco e carta il logo è inchiostro. |
| **Il vertice come icona funzionale** | Il vertice è il marchio. |

---

## Esportare il wordmark

```bash
npm run export:logo -- white --size=2400            # bianco su campo arancia, con area di rispetto
npm run export:logo -- ink --size=1200              # cacao su trasparente, ritagliato
npm run export:logo -- lime --bg=#FFFFFF
npm run export:logo -- --list
```

Esce in `assets/export/`, fuori dal versionamento. Passa da Chrome, che disegna
il tracciato con `Path2D` su una tela e ritaglia sull'alfa: nessun font
richiesto.

**Il PNG non è il formato di consegna del logo.** Per stampa, packaging e web
serve l'SVG in tracciati di `assets/logo/`, che è già quello definitivo.
