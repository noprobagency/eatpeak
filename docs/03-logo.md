# 03 — Logo e icone

Tutte le geometrie e le varianti stanno in
[`src/brand/paths.ts`](../src/brand/paths.ts). I componenti `<Logo>`, `<Icon>` e
`<Lockup>` si limitano a disegnarle, e il generatore in
`scripts/generate-assets.mjs` legge lo **stesso** file: gli SVG statici non
possono andare fuori sincrono col codice.

```bash
npm run assets:generate
```

---

## Il wordmark

La parola è **`peak`**, sempre minuscola, Rund Display peso 900, tracking
`-0.033em` (cioè `-2` su un font-size di 60).

Il trattamento è **pieno miele con contorno terracotta**, dove il contorno sta
**all'esterno** del disegno della lettera — in SVG: `paint-order="stroke"` con
`stroke-linejoin="round"`. Questo è il dettaglio che conta: se il contorno fosse
centrato sul tracciato, la lettera si assottiglierebbe e il peso Black andrebbe
sprecato.

### La regola critica sullo spessore

**Il filo non scala proporzionalmente al logo.**

Se rimpicciolisci tutto insieme, sotto una certa soglia il contorno entra nelle
contro-forme di "e" e "a" e il nome diventa una macchia. Non è una questione di
gusto: è il limite fisico del disegno.

Servono **tre versioni disegnate**, non una scalata:

| Versione | Uso | Rapporto stroke / font-size | Spessore su 60px |
|---|---|---|---|
| `lg` | oltre 120px di larghezza | 0.117 | 7.02 |
| `md` | 60–120px | 0.100 | 6.00 |
| `sm` | sotto 60px | 0.067 | 4.02 |

`<Logo>` sceglie la versione da solo in base a `size`. La prop `strokeSize` la
forza, e serve praticamente solo per le esportazioni di stampa.

```tsx
<Logo size={200} />                    // usa lg
<Logo size={90} />                     // usa md
<Logo size={40} />                     // usa sm
<Logo size={200} strokeSize="sm" />    // forzata, sai quello che fai
```

### Il peso della lettera conta più del filo

Con un contorno spesso serve il peso pieno sotto. Il Black regge, il Bold è al
limite, il Semibold si impasta. È il motivo per cui il wordmark è bloccato sul
900 e non espone una prop per cambiarlo.

### Allineamento

Il viewBox del wordmark è più largo dell'inchiostro, quindi di default la parola
risulta **rientrata** rispetto al testo che le sta accanto o sotto. Quando il
logo apre una colonna, serve `align="left"`:

```tsx
<Logo size={420} align="left" />
```

L'origine del testo va a `x=0`: il filo esce di metà spessore verso sinistra e
copre quasi esattamente l'avvicinamento sinistro della "p", così il bordo
visibile del marchio cade sulla colonna al pixel. L'SVG ha `overflow="visible"`,
quindi con un font di ripiego dalle metriche diverse sborda invece di perdere un
pezzo di lettera.

### Le undici varianti colore

| # | Nome | Pieno | Contorno | Quando |
|---|---|---|---|---|
| 1 | `honey-terracotta` | `#FCD589` | `#E9724C` | **Primaria.** Ovunque, di default. |
| 2 | `honey-terracotta-deep` | `#FCD589` | `#8F3A20` | Sopra un fondo terracotta 400. |
| 3 | `honey-forest` | `#FCD589` | `#2F6E5E` | Sezioni bosco, secondo prodotto. |
| 4 | `honey-forest-deep` | `#FCD589` | `#174036` | Sopra un fondo bosco 500. |
| 5 | `honey-plum` | `#FFCF7A` | `#8A3D6B` | Fuori palette. Riserva per edizioni limitate. |
| 6 | `cream-terracotta` | `#FDE3B0` | `#E9724C` | Stampa e packaging. La più elegante, la meno visibile in un feed. |
| 7 | `amber-deep` | `#F7B733` | `#B4491F` | Fondi molto chiari. |
| 8 | `outline-only` | — | `#E9724C` sp. 2.4 | Filigrane, watermark. **Mai sotto i 120px.** |
| 9 | `solid-terracotta` | `#E9724C` | — | Stampa a un colore. |
| 10 | `solid-ink` | `#1B1A18` | — | Incisioni, timbri, documenti legali. |
| 11 | `solid-white` | `#FFFFFF` | — | Negativo su fondi scuri. |

Ogni variante è esportata in `assets/logo/` nelle tre versioni di filo — tranne
quelle senza contorno e la `outline-only`, che a spessore fisso sono identiche
in tutti gli step e vengono scritte una volta sola.

### Su fondo colorato

Il contorno risolve un problema pratico: **il logo resta leggibile su qualsiasi
fondo senza bisogno di una versione in negativo**. Basta cambiare il colore del
filo, non il disegno.

`<Logo>` accetta una prop `background` (`light | warm | brand | forest | dark`) e
sceglie da sé la variante che ci si legge sopra.

---

## L'icona

Il simbolo è una **saetta che punta verso l'alto** — orientata all'insù invece
che all'ingiù, così legge come ascesa e non come scarica elettrica, e lega il
segno al significato di "peak" senza disegnare una montagna.

```
BOLT_UP   = "M 55 95 L 20 45 L 42 45 L 35 5 L 72 58 L 50 58 Z"
BOLT_PEAK = "M 50 6 L 84 62 L 62 62 L 68 94 L 30 94 L 38 62 L 16 62 Z"
```

`BOLT_PEAK` è la variante a base allargata: la saetta è anche una vetta. Più
stabile e più leggibile alle dimensioni minime, meno dinamica.

**Contenitore:** `<rect x="2" y="2" width="96" height="96" rx="26"/>` per la
versione squadrata, `<circle cx="50" cy="50" r="48"/>` per la tonda.

Il raggio 26 non deve mai scendere sotto i **4px assoluti** una volta reso. A
16px il raggio nominale vale 4.16px, quindi la clamp non morde quasi mai: esiste
per proteggere i rendering più piccoli del previsto.

### Le dodici varianti

| # | Fondo | Saetta | Contorno | Forma | Path |
|---|---|---|---|---|---|
| 1 | `#E9724C` | `#FCD589` | — | rect | BOLT_UP |
| 2 | `#E9724C` | `#FCD589` | `#8F3A20` sp. 5 | rect | BOLT_UP |
| 3 | `#2F6E5E` | `#FCD589` | — | rect | BOLT_UP |
| 4 | `#2F6E5E` | `#E9724C` | `#174036` sp. 5 | rect | BOLT_UP |
| 5 | `#FCD589` | `#E9724C` | `#8F3A20` sp. 4 | rect | BOLT_UP |
| 6 | `#E9724C` | `#FCD589` | — | circle | BOLT_UP |
| 7 | `#2F6E5E` | `#FCD589` | — | circle | BOLT_UP |
| 8 | `#E9724C` | `#FCD589` | — | rect | BOLT_PEAK |
| 9 | `#2F6E5E` | `#FCD589` | — | rect | BOLT_PEAK |
| 10 | `#FCD589` | `#E9724C` | — | rect | BOLT_PEAK |
| 11 | `#1B1A18` | `#FCD589` | — | rect | BOLT_UP |
| 12 | trasparente | `#E9724C` | — | — | BOLT_UP |

Ognuna è esportata in `assets/favicon/` come SVG a **512, 192, 96, 64, 48, 32 e
16px**.

### La regola del contorno

**Il contorno esiste solo sopra i 48px.** Sotto, il filo scuro si mangia la
saetta e l'icona diventa una macchia.

`<Icon>` lo toglie da solo: non serve ricordarselo. La prop `forceOutline` esiste
unicamente perché lo Showcase possa mostrare il difetto affiancato al
comportamento corretto — non usarla in produzione.

### I file per il deploy

`npm run assets:generate` scrive in `public/`:

| File | Cosa |
|---|---|
| `favicon.ico` | multi-risoluzione, con 16, 32 e 48 dentro, dalla variante 1 |
| `favicon.svg` | la versione vettoriale, preferita dai browser moderni |
| `apple-touch-icon.png` | 180×180, senza raggio: iOS arrotonda da sé |
| `icon-192.png`, `icon-512.png` | icone PWA |
| `site.webmanifest` | manifest con i colori del brand |

Il rasterizzatore in `scripts/lib/raster.mjs` è scritto a mano e non ha
dipendenze: disegna le forme con supercampionamento 4×4 e codifica PNG e ICO
direttamente. Non è un motore SVG generico e non prova a esserlo — i path del
marchio usano solo `M`, `L` e `Z` con coordinate assolute, e quello basta.

---

## Il lockup

Icona e wordmark affiancati. **Lo spazio tra i due è pari alla metà dell'altezza
dell'icona.** È l'unica regola di lockup necessaria.

Esiste anche la versione verticale — icona sopra, wordmark sotto, stesso spazio.

```tsx
<Lockup iconSize={64} />
<Lockup iconSize={64} orientation="vertical" />
<Lockup iconSize={56} withClearspace />
```

**Area di rispetto:** attorno al lockup, un margine libero pari all'altezza della
"p" minuscola su tutti i lati. Nel componente è `CLEARSPACE_RATIO = 0.46`, cioè
il 46% dell'altezza del blocco del wordmark.

---

## Usi vietati

Lo Showcase li mostra barrati, alla sezione **06 — wordmark**. Qui l'elenco.

| ✗ | Perché |
|---|---|
| **Ruotare** il logo | Il minuscolo e l'orizzontalità sono l'identità. Un logo inclinato è un logo diverso. |
| **Inclinare** o applicare skew | Deforma il disegno delle lettere, che è la cosa che stai proteggendo. |
| **Aggiungere ombre o glow** | Il brand è piatto. Un glow lo sposta nell'estetica supplement-tech da cui vuole stare lontano. |
| **Cambiare il tracking** | È fissato a `-0.033em`. Aprirlo o chiuderlo rompe il rapporto fra le contro-forme e il filo. |
| **Usare un contorno chiaro sfumato** | Il contorno serve a staccare dal fondo: sfumato non stacca e basta. |
| **Riempire con gradienti** | Il pieno è un colore solido. Sempre. |
| **Mettere il wordmark su fotografia** senza un campo di colore pieno sotto | Il contorno tiene su tinte piatte, non su una texture. |
| **Scalare il filo insieme al logo** | Vedi la regola critica sopra: sotto la soglia le contro-forme si chiudono. |
| **Usare `outline-only` sotto i 120px** | Il filo da 2.4 sparisce. Il componente lo segnala in console in sviluppo. |
| **Usare la saetta come icona funzionale** nell'interfaccia | La saetta è il marchio. Riusarla come pittogramma per "veloce" o "energia" la svaluta. |

---

## Esportare il wordmark in PNG

```bash
npm run export:logo -- honey-terracotta --size=2400
npm run export:logo -- --list
```

Esce in `assets/export/`, fondo trasparente, ritagliato al pixel. La cartella è
fuori dal versionamento: gli export si rigenerano, e sono prodotti con un font
in licenza trial.

Perché passa da Chrome e non dal rasterizzatore di casa: il wordmark è **testo**,
non un tracciato. Per rasterizzarlo serve un motore tipografico che sappia cosa
fare di Rund Display, del tracking negativo e del contorno esterno.
`scripts/lib/raster.mjs` disegna poligoni — va benissimo per la saetta, di testo
non sa niente.

Il ritaglio non è calcolato: si disegna su una tela abbondante, si legge il
canale alfa e si taglia sull'ultimo pixel non trasparente. Nessun margine
residuo, nessuna lettera tagliata.

**Il PNG non è il formato di consegna del logo.** È comodo per una slide o per
mandarlo a qualcuno al volo. Per stampa, packaging e web serve l'SVG con il
testo vettorializzato — vedi qui sotto.

---

## Il font, prima della produzione

Gli SVG in `assets/logo/` contengono **testo non vettorializzato**: senza Rund
Display installato si vede il fallback.

Una volta comprata la licenza desktop, il wordmark va **vettorializzato una volta
sola** — testo convertito in tracciati — e quei file sostituiscono questi. Da
quel momento il logo non dipende più da nessun font.

Vedi [`assets/fonts/README.md`](../assets/fonts/README.md).
