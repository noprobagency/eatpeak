# 02 — Token

> Sorgente unica di verità: [`src/tokens/tokens.json`](../src/tokens/tokens.json).
> `tokens.css` è **generato** da quel file (`npm run tokens:build`), `tokens.ts` lo
> ri-esporta con i tipi, `tailwind.config.js` lo legge a build time. Un valore si
> cambia in un posto solo.

---

## Come si usano

Nei componenti si usano **solo i token semantici**, mai i colori grezzi:

```tsx
// sì
<div className="bg-bg-surface text-text-primary border-border-subtle" />
<div className="bg-bg-flavor-arancia text-text-on-flavor" />

// no
<div className="bg-neutral-0 text-neutral-900 border-neutral-200" />
<div className="bg-arancia-500" />
```

Il motivo è banale e concreto: il giorno in cui l'arancia cambia sfumatura, nel
primo caso si tocca una riga di `tokens.json`, nel secondo si aprono trecento
file.

---

## Colore

La regola della 2.0: **3 neutri + 2 colori-gusto + 1 accento**. Tutto il resto è
uscito (terracotta, bosco, plum, amber, cream, honey) o è finito nei dettagli
tecnici (il rosso di stato).

| | Nome | Hex | Quando |
|---|---|---|---|
| neutro | **bianco** | `#FFFFFF` | superfici, pieni, il logo su colore |
| neutro | **carta** | `#FAF7F2` | il fondo del sito e della stampa (`neutral.50`) |
| neutro | **inchiostro** | `#1B1A18` | testo, il logo su chiaro, pulsanti scuri (`neutral.900`) |
| colore-gusto 01 | **arancia** | `#E4572E` | campi pieni, pulsanti; è anche il **primario del brand** |
| colore-gusto 02 | **lime** | `#5E9E1F` | campi pieni delle comunicazioni del gusto 02 |
| accento | **miele** | `#FCD589` | DoseSeal, badge, evidenziazioni. Mai testo su chiaro |

### Arancia — colore-gusto 01 e primario

Base **500 `#E4572E`**.

| Step | Hex | Uso tipico |
|---|---|---|
| 50 | `#FDF2EE` | `bg-brand-soft`, `bg-flavor-arancia-tint`, fondo dei badge |
| 100 | `#FAE1D9` | — |
| 200 | `#F5C3B4` | — |
| 300 | `#F0A18A` | stato active del pulsante primario |
| 400 | `#E97958` | hover del pulsante primario |
| **500** | **`#E4572E`** | `bg-brand`, `bg-flavor-arancia`, `border-brand`, il campo pieno |
| 600 | `#C24926` | `text-brand` — 4,91:1 su bianco |
<!-- peak-compliance-ignore focus — anello di focus da tastiera, non un claim -->
| 700 | `#A03B1E` | anello di focus da tastiera, badge brand soft |
| 800 | `#7E2E16` | — |
| 900 | `#5C200E` | — |

### Lime — colore-gusto 02

Base **500 `#5E9E1F`**.

| Step | Hex | Uso tipico |
|---|---|---|
| 50 | `#F2F7ED` | `bg-flavor-lime-tint`, fondo dei badge lime |
| 100 | `#E2EED7` | — |
| 200 | `#C5DCAE` | — |
| 300 | `#A5C982` | — |
| 400 | `#7EB14C` | — |
| **500** | **`#5E9E1F`** | `bg-flavor-lime`, il campo pieno |
| 600 | `#4F861A` | — |
| 700 | `#406D15` | `state.success`, testo verde su chiaro — 6,15:1 |
| 800 | `#315511` | — |
| 900 | `#223C0C` | — |

### Miele — l'accento

Base **300 `#FCD589`**. È l'unico accento. Vive come riempimento (DoseSeal,
badge solid) e fondo (`bg-warm` è il 50). **Mai come colore di testo su fondo
chiaro.**

### Neutri caldi

| Step | Hex | | Step | Hex |
|---|---|---|---|---|
| 0 | `#FFFFFF` | | 500 | `#928C84` |
| **50** | **`#FAF7F2`** carta | | 600 | `#6E6862` |
| 100 | `#F5F4F2` | | 700 | `#4A443E` |
| 200 | `#E8E5E0` | | 800 | `#33312E` |
| 300 | `#DFDCD7` | | **900** | **`#1B1A18`** inchiostro |
| 400 | `#BDB8B0` | | 1000 | `#0F0E0D` |

I neutri sono **caldi di proposito**. Non usare mai grigi neutri puri o freddi:
un solo `#888888` in mezzo a questi spezza la temperatura di tutto il resto.
`tailwind.config.js` **sostituisce** la palette di default invece di estenderla:
i grigi di Tailwind non sono raggiungibili per sbaglio.

### Errore

Solo il rosso che serve a `state.error`: `errore.50 #FDECEA`, `errore.500
#C0392B`, `errore.700 #7F2418`. Non è un colore brand.

### Stato

`success #406D15` (lime 700) · `warning #D9922A` (miele 600) · `error #C0392B` · `info #4A443E`

---

## Token semantici

Gli unici che i componenti devono conoscere.

| Token | Riferimento | Note |
|---|---|---|
| `--bg-page` | neutral 50 | carta |
| `--bg-surface` | neutral 0 | |
| `--bg-raised` | neutral 100 | |
| `--bg-warm` | miele 50 | |
| `--bg-inverse` | neutral 900 | |
| `--bg-brand` | arancia 500 | |
| `--bg-brand-soft` | arancia 50 | |
| `--bg-flavor-arancia` | arancia 500 | il campo pieno del gusto 01 |
| `--bg-flavor-arancia-tint` | arancia 50 | |
| `--bg-flavor-lime` | lime 500 | il campo pieno del gusto 02 |
| `--bg-flavor-lime-tint` | lime 50 | |
| `--bg-danger` | errore 50 | |
| `--text-primary` | neutral 900 | |
| `--text-secondary` | neutral 700 | |
| `--text-muted` | neutral 600 | il 500 non arriva a 4,5:1 |
| `--text-inverse` | neutral 0 | |
| `--text-brand` | arancia 600 | 4,91:1 su bianco |
| `--text-on-brand` | neutral 900 | inchiostro sui pulsanti arancia: 4,72:1 |
| `--text-on-flavor` | neutral 0 | **solo testo grande** sui campi colore |
| `--text-on-flavor-small` | neutral 900 | il testo piccolo, sul tint |
| `--text-danger` | errore 700 | |
| `--border-subtle` / `-default` / `-strong` | neutral 200 / 300 / 400 | |
| `--border-brand` | arancia 500 | |
| `--border-danger` | errore 500 | |
| `--logo-on-flavor` | neutral 0 | |
| `--logo-on-light` | neutral 900 | |
| `--focus-ring` | arancia 700 | |

**Rimossi dalla 1.0:** `logo-fill`, `logo-stroke`, `logo-stroke-deep`,
`bg-forest`, `text-on-brand-large` e ogni token `bosco`.

### Perché i pulsanti hanno il testo inchiostro

Il bianco su arancia 500 dà **3,68:1**: passa per il testo grande (≥ 24px in
grassetto), non per l'etichetta di un pulsante. L'inchiostro sullo stesso
fondo dà **4,72:1**. Il colore del brand resta identico: cambia l'inchiostro
sopra, non il fondo. Sui campi colore e su inchiostro il pulsante è la pillola
bianca (`variant="inverse"`).

---

## Regole di contrasto — vincolanti

Non sono consigli. Un componente che le viola è un bug.

1. **Su un campo colore-gusto (arancia 500, lime 500) sono ammessi solo il logo
   e il testo grande** — ≥ 24px in grassetto o ≥ 32px regular. Bianco su
   arancia 500 = 3,68:1, bianco su lime 500 = 3,29:1.
2. **Il testo corrente su un campo colore è vietato:** si usa inchiostro sul
   `tint` del gusto (`bg-flavor-*-tint` + `text-on-flavor-small`).
3. **Il testo piccolo sui pieni arancia** — pulsanti, badge — è inchiostro
   (`text-on-brand`), mai bianco.
4. **Arancia 500, lime 500 e miele 300 non sono mai colore di testo su fondo
   chiaro.** Per il testo brand su chiaro si usa arancia 600 o 700; per il
   verde, lime 700.
5. Ogni testo sotto i 18px deve raggiungere almeno **4,5:1**.

> Sul **pack** il testo piccolo è bianco sul campo colore: è stampa, non
> interfaccia, e la leggibilità si verifica sulla prova colore con il
> laboratorio. Vedi [08 — Packaging](08-packaging.md).

### La tabella dei rapporti

<!-- CONTRAST:START -->

_Tabella generata da `npm run tokens:contrast`. Non modificarla a mano._

| Testo | Fondo | Coppia | Rapporto | Esito | Stato nel sistema |
|---|---|---|---|---|---|
| `#3A2A22` | `#FAF7F2` | `text-primary` (cacao 900) su carta | 12.81:1 | AAA | Consentita. |
| `#3A2A22` | `#FFFFFF` | `text-primary` su bianco | 13.69:1 | AAA | Consentita. |
| `#6E5F55` | `#FAF7F2` | `text-secondary` (cacao 600) su carta | 5.73:1 | AA | Consentita. |
| `#7A6A5F` | `#FAF7F2` | `text-muted` (cacao 500) su carta | 4.85:1 | AA | Consentita. |
| `#7A6A5F` | `#FFFFFF` | `text-muted` su bianco | 5.18:1 | AA | Consentita. |
| `#3A2A22` | `#FDF2EE` | `text-on-flavor-small` (cacao 900) su tint arancia | 12.46:1 | AAA | Consentita. |
| `#3A2A22` | `#F2F7ED` | `text-on-flavor-small` su tint lime | 12.58:1 | AAA | Consentita. |
| `#7A6A5F` | `#FDF2EE` | cacao 500 su tint arancia | 4.71:1 | AA | Consentita. |
| `#6E5F55` | `#FEFAF0` | `text-secondary` su `bg-warm` | 5.87:1 | AA | Consentita. |
| `#3A2A22` | `#FCD589` | cacao 900 su miele 300 (accento, badge) | 9.79:1 | AAA | Consentita. |
| `#C24926` | `#FFFFFF` | `text-brand` (arancia 600) su bianco — occhielli | 4.91:1 | AA | Consentita. |
| `#C24926` | `#FAF7F2` | arancia 600 su carta — occhielli | 4.60:1 | AA | Consentita. |
| `#A03B1E` | `#FFFFFF` | arancia 700 su bianco — pillola bianca sui campi | 6.69:1 | AA | Consentita. |
| `#A03B1E` | `#FDF2EE` | arancia 700 su arancia 50 (badge) | 6.09:1 | AA | Consentita. |
| `#406D15` | `#FFFFFF` | lime 700 (`success`) su bianco | 6.15:1 | AA | Consentita. |
| `#406D15` | `#F2F7ED` | lime 700 su lime 50 (badge) | 5.65:1 | AA | Consentita. |
| `#FFFFFF` | `#C24926` | **bianco su arancia 600** — pulsante primario, footer, toast, `bg-brand-deep` | 4.91:1 | AA | Consentita. |
| `#FFFFFF` | `#406D15` | **bianco su lime 700** — `bg-lime-deep` | 6.15:1 | AA | Consentita. |
| `#FFFFFF` | `#A03B1E` | bianco su arancia 700 (hover del primario) | 6.69:1 | AA | Consentita. |
| `#FFFFFF` | `#E4572E` | **logo bianco** e testo grande su arancia 500 | 3.68:1 | AA | Consentita solo per logo e testo grande. Solo logo, titoli display e numeri grandi (>= 24px bold o >= 32px regular). |
| `#FFFFFF` | `#5E9E1F` | **logo bianco** e testo grande su lime 500 | 3.29:1 | AA | Consentita solo per logo e testo grande. Solo logo, titoli display e numeri grandi. |
| `#3A2A22` | `#F6EFEA` | cacao 900 sul vetro con velo (bianco 62% su arancia) | 12.03:1 | AAA | Consentita. |
| `#C0392B` | `#FFFFFF` | `error` su bianco | 5.44:1 | AA | Consentita. |
| `#855717` | `#FDF2DC` | miele 800 su miele 100 (badge warning) | 5.61:1 | AA | Consentita. |
| `#7F2418` | `#FDECEA` | `text-danger` su `bg-danger` | 8.47:1 | AAA | Consentita. |
| `#FFFFFF` | `#E4572E` | bianco come **testo corrente** su arancia 500 | 3.68:1 | AA | **Vietata.** Si ferma a 3,68:1. Il testo corrente sta sul deep (arancia 600) o, in cacao, sul tint. |
| `#3A2A22` | `#E4572E` | cacao 900 come **testo corrente** su arancia 500 | 3.72:1 | AA | **Vietata.** Si ferma a 3,72:1: nemmeno il cacao regge sul 500. Sul 500 stanno solo logo e testo grande. |
| `#FFFFFF` | `#5E9E1F` | bianco come **testo corrente** su lime 500 | 3.29:1 | AA | **Vietata.** Si ferma a 3,29:1. Il testo corrente sta su lime 700. |
| `#E4572E` | `#FFFFFF` | arancia 500 come **testo** su bianco | 3.68:1 | FAIL | **Vietata.** Per il testo brand su fondo chiaro si usa il 600 o il 700. Il 500 e un campo, non un inchiostro. |
| `#FCD589` | `#FFFFFF` | miele 300 come **testo** su bianco | 1.40:1 | FAIL | **Vietata.** Il miele e l accento: bollino, badge, il punto di oggi. Mai come testo su fondo chiaro. |
| `#A08B7E` | `#FFFFFF` | cacao 400 come **testo** su bianco | 3.24:1 | FAIL | **Vietata.** Non raggiunge 4,5:1: e il colore degli anelli da fare, non un inchiostro. text-muted parte dal 500. |

<!-- CONTRAST:END -->

Le ultime righe sono le combinazioni **vietate**. Stanno nella tabella apposta:
un divieto senza il numero accanto non viene rispettato.

Lo script è anche un test — se una coppia dichiarata valida scende sotto la sua
soglia (4,5:1, o 3:1 se marcata solo-grande), `npm run tokens:contrast` esce con
errore. Il logo bianco sui due campi colore-gusto è nel report per criterio di
accettazione.

---

## Tipografia

### Famiglie

| Ruolo | Font | Pesi | Note |
|---|---|---|---|
| Display + wordmark | **Gabarito** | 900 (700/800 dove serve) | sempre minuscolo. Rund è uscito dal sistema. |
| Testo | **Inter** | 400 / 500 / 600 | |
| Numeri e dati | **DM Mono** | 400 / 500 | tutti i numeri, maiuscolo, tracking 0.14em |
| **Accento** | **Fraunces Italic** | 500 | **solo i nomi dei gusti**: pack, card gusto, selettore. Mai titoli, mai testo. |

Tutte e quattro sono su Google Fonts con licenza SIL OFL: nessun file locale,
nessuna licenza da comprare. Vedi [`assets/fonts/README.md`](../assets/fonts/README.md).

### Il ruolo del mono

Il mono **non è decorativo**. Porta tutti i dati oggettivi: dosaggi, grammi,
numero di stick, lotti, prezzi al giorno, conteggi. È il contrappeso che
impedisce al rounded di diventare infantile. Sempre maiuscolo, `letter-spacing:
0.14em`, mai sotto i 10px.

### Il ruolo del corsivo

Fraunces Italic è il tocco "italiano" del sistema, ed esiste per una cosa sola:
il nome del gusto. `Nº01 Arancia Rossa`. Se compare in un titolo o in un
paragrafo, è un errore.

### La scala

| Token | Size | Line-height | Tracking | Uso |
|---|---|---|---|---|
| `display-xl` | 84px | 0.92 | -0.05em | Hero desktop |
| `display-lg` | 60px | 0.96 | -0.045em | Hero mobile, titoli sezione grandi |
| `display-md` | 42px | 1.0 | -0.04em | Titoli sezione |
| `display-sm` | 32px | 1.05 | -0.035em | Sottotitoli forti |
| `heading-lg` | 26px | 1.15 | -0.03em | Titoli card |
| `heading-md` | 21px | 1.2 | -0.02em | Titoli minori |
| `heading-sm` | 18px | 1.3 | -0.015em | Etichette forti |
| `body-lg` | 18px | 1.6 | 0 | Introduzioni |
| `body-md` | 16px | 1.6 | 0 | Corpo |
| `body-sm` | 14px | 1.55 | 0 | Note, didascalie |
| `mono-md` | 12px | 1.4 | 0.14em | Dati |
| `mono-sm` | 10px | 1.4 | 0.16em | Micro-etichette |
| `flavor-lg` | 32px | 1.15 | -0.01em | Il nome del gusto, sul pack e nelle hero |
| `flavor` | 24px | 1.2 | -0.01em | Il nome del gusto, nelle card |
| `flavor-sm` | 20px | 1.25 | 0 | Il nome del gusto, nei selettori |

I `display-*` usano sempre **Gabarito 900** e sono sempre in **minuscolo**. I
`flavor-*` sono sempre **Fraunces Italic 500**. Le classi `.type-display-xl`,
`.type-flavor` e simili sono generate in `tokens.css` e portano già famiglia,
peso, stile e `text-transform`.

---

## Spazio

Base 4px.

`0` · `1` 4px · `2` 8px · `3` 12px · `4` 16px · `5` 20px · `6` 24px · `8` 32px ·
`10` 40px · `12` 48px · `16` 64px · `20` 80px · `24` 96px · `32` 128px

Lo spazio appartiene al contenitore, non ai figli: usa `<Stack gap="6">`, non
`margin-bottom` sugli elementi.

### ⚠ La scala sostituisce quella di Tailwind, non la estende

`tailwind.config.js` imposta `spacing` con questi valori **al posto** di quelli
di default. È voluto: `p-7` o `p-14` non esistono. Ma Tailwind non protesta: una
classe fuori scala non genera CSS e la pagina resta in piedi lo stesso. Per
questo esiste `npm run check:utilities`, che gira dentro `npm test` dopo la
build e fallisce sulla differenza.

Quando serve una misura fuori scala si usa un valore arbitrario, `w-[208px]`,
che compila sempre ed è visibilmente un'eccezione.

---

## Altezze dei controlli

`control-sm` 36px · `control-md` 44px (il minimo per un bersaglio touch) ·
`control-lg` 56px. Disponibili come `h-control-md`, `w-control-sm`.

---

## Forma

**Raggi** — `sm` 8px · `md` 14px · `lg` 22px · `xl` 30px · `2xl` 44px · `full`.
I pulsanti usano **sempre** `full`. Le card `lg` o `xl`. Spigoli vivi solo nelle
bande a tutta larghezza.

**Ombre** — `sm` · `md` · `lg`, tutte inchiostro a bassa opacità. Mai ombre
colorate, mai glow.

---

## Movimento

`fast` 120ms · `base` 200ms · `slow` 360ms · `marquee` 24s. Easing
`cubic-bezier(.2,.8,.2,1)`. **Ogni animazione rispetta
`prefers-reduced-motion: reduce`.** Il pattern a pallini è statico per scelta.

---

## Packaging

Nuovo gruppo `pack` in `tokens.json`, provvisorio finché non arriva la fustella:

| Token | Valore | Cosa |
|---|---|---|
| `pack.safe` | 0.08 | margine di sicurezza: l'8% del lato corto |
| `pack.sealBand` | 0.08 | la banda di saldatura in alto: l'8% dell'altezza |
| `pack.wordmarkWidth` | 0.82 | il wordmark sul fronte: l'82% della larghezza |
| `pack.bustaRatio` | 2:3 | segnaposto della fustella della busta |
| `pack.stickRatio` | 1:5 | segnaposto dello stick |

---

## Breakpoint

`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Container 1200px,
padding 28px; `<Container width>` offre `narrow` 760, `media` 1100 e `wide` 1440.
