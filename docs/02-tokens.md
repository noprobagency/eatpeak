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

La regola della 3.0: **carta e cacao + 2 colori-gusto + 1 accento, e niente
nero**. I neutri del testo sono la scala **cacao**; le superfici scure sono i
profondi dei due gusti, arancia 600 e lime 700. L'inchiostro `#1B1A18`
sopravvive solo come `color.print.ink`, per la stampa a un colore, e non
arriva a Tailwind.

| | Nome | Hex | Quando |
|---|---|---|---|
| neutro | **bianco** | `#FFFFFF` | superfici, pieni, il logo su colore |
| neutro | **carta** | `#FAF7F2` | il fondo del sito e della stampa (`neutral.50`) |
| neutro | **cacao** | `#3A2A22` | testo, il logo su chiaro (`cacao.900`) |
| colore-gusto 01 | **arancia** | `#E4572E` | campi pieni; il **profondo** `#C24926` (600) per pulsanti, footer e ogni campo con testo corrente bianco |
| colore-gusto 02 | **lime** | `#5E9E1F` | campi pieni del gusto 02; il profondo `#406D15` (700) per il rituale |
| accento | **miele** | `#FCD589` | il punto di oggi, DoseSeal, badge. Mai testo su chiaro |

Sui campi 500 stanno solo il logo, il testo grande e le chip di vetro. Sopra i
campi e sul vetro si posa una **grana** al 3–5% (`grain`, sotto), spenta sotto
i 480px e con `prefers-reduced-transparency`.

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

### Cacao — i neutri del testo

| Step | Hex | Uso |
|---|---|---|
| 50 | `#F6F0EB` | — |
| 100 | `#EDE3DB` | — |
| 200 | `#DCCDC2` | — |
| 300 | `#C4B0A3` | i punti spenti nei tier |
| 400 | `#A08B7E` | l'anello del giorno da fare; **mai testo** (3,24:1) |
| **500** | **`#7A6A5F`** | `text-muted`, `dot-todo` — 4,85:1 su carta |
| **600** | **`#6E5F55`** | `text-secondary` — 5,73:1 su carta |
| 700 | `#55463D` | — |
| 800 | `#47372E` | — |
| **900** | **`#3A2A22`** | `text-primary`, `logo-on-light` — 12,8:1 su carta |

### Neutri caldi — solo superfici e bordi

| Step | Hex | Uso |
|---|---|---|
| 0 | `#FFFFFF` | `bg-surface` |
| **50** | **`#FAF7F2`** | carta, `bg-page` |
| 100 | `#F5F4F2` | `bg-raised` |
| 200 | `#E8E5E0` | `border-subtle` |
| 300 | `#DFDCD7` | `border-default` |
| 400 | `#BDB8B0` | `border-strong` |

La scala si ferma al 400: **non esistono più neutri da testo**, e i grigi di
Tailwind non sono raggiungibili per sbaglio (`tailwind.config.js` sostituisce
la palette). I neutri restano caldi di proposito: un solo grigio freddo spezza
la temperatura di tutto.

### L'inchiostro di stampa

`color.print.ink` = `#1B1A18`. Solo per il wordmark a un colore in stampa
(l'export `print` di `generate-assets.mjs`). Non è un token semantico, non è in
Tailwind, e `npm run tokens:contrast` fallisce se compare in una coppia.

### Errore

Solo il rosso che serve a `state.error`: `errore.50 #FDECEA`, `errore.500
#C0392B`, `errore.700 #7F2418`. Non è un colore brand.

### Stato

`success #406D15` (lime 700) · `warning #D9922A` (miele 600) · `error #C0392B` · `info #6E5F55` (cacao 600)

---

## Token semantici

Gli unici che i componenti devono conoscere.

| Token | Riferimento | Note |
|---|---|---|
| `--bg-page` | neutral 50 | carta |
| `--bg-surface` | neutral 0 | |
| `--bg-raised` | neutral 100 | |
| `--bg-warm` | miele 50 | |
| `--bg-brand` | arancia 500 | il campo: logo, testo grande, vetro |
| `--bg-brand-deep` | arancia 600 | **il profondo**: pulsante primario, footer, toast, ogni campo con testo corrente bianco |
| `--bg-brand-soft` | arancia 50 | |
| `--bg-flavor-arancia` / `-tint` | arancia 500 / 50 | il campo pieno del gusto 01 e il suo tint |
| `--bg-flavor-lime` / `-tint` | lime 500 / 50 | il campo pieno del gusto 02 e il suo tint |
| `--bg-lime-deep` | lime 700 | il profondo del gusto 02: il rituale dei 30 punti |
| `--bg-danger` | errore 50 | |
| `--text-primary` | cacao 900 | 12,8:1 su carta |
| `--text-secondary` | cacao 600 | 5,7:1 su carta |
| `--text-muted` | cacao 500 | 4,85:1 su carta; il 400 non arriva a 4,5:1 |
| `--text-inverse` | neutral 0 | il bianco sui profondi |
| `--text-brand` | arancia 600 | 4,91:1 su bianco: occhielli, link |
| `--text-on-brand` | neutral 0 | bianco sul pulsante arancia 600: 4,91:1 |
| `--text-on-flavor` | neutral 0 | **solo testo grande** sui campi 500 |
| `--text-on-flavor-small` | cacao 900 | il testo piccolo, sul tint |
| `--text-danger` | errore 700 | |
| `--border-subtle` / `-default` / `-strong` | neutral 200 / 300 / 400 | |
| `--border-brand` | arancia 500 | |
| `--border-danger` | errore 500 | |
| `--logo-on-flavor` | neutral 0 | |
| `--logo-on-light` | cacao 900 | |
| `--dot-todo` | cacao 500 | l'anello del giorno da fare, al 40% |
| `--dot-done` | arancia 500 | il giorno fatto; bianco sul colore |
| `--dot-today` / `--dot-today-ring` | miele 300 / arancia 700 | oggi: un solo punto miele per vista |
| `--focus-ring` | arancia 700 | |

**Rimossi dalla 2.0:** `bg-inverse`, il `text-on-brand` inchiostro e ogni
neutro dal 500 in su. **Nuovi:** i profondi, i quattro `dot-*`, i gruppi
`glass`, `grain` e `section`.

### Perché il pulsante primario è arancia 600

Il bianco su arancia 500 dà **3,68:1**: passa per il testo grande, non per
l'etichetta di un pulsante. Invece di scurire il testo, la 3.0 scurisce il
fondo: il pulsante primario sta su **arancia 600** (`bg-brand-deep`) con il
testo bianco, **4,91:1**, e resta un pieno del brand. Sui campi 500 e sui
profondi il pulsante è la pillola bianca con il testo arancia 700
(`variant="inverse"`, 6,69:1).

---

## Regole di contrasto — vincolanti

Non sono consigli. Un componente che le viola è un bug.

1. **Su un campo colore-gusto (arancia 500, lime 500) sono ammessi solo il logo
   e il testo grande** — ≥ 24px in grassetto o ≥ 32px regular. Bianco su
   arancia 500 = 3,68:1, bianco su lime 500 = 3,29:1.
2. **Il testo corrente su un campo 500 è vietato:** cacao sul `tint` del gusto
   (`bg-flavor-*-tint` + `text-on-flavor-small`) o bianco sul profondo
   (`bg-brand-deep` arancia 600, `bg-lime-deep` lime 700).
3. **Il testo piccolo sui pulsanti** è bianco su arancia 600 (`text-on-brand`,
   4,91:1); sui campi 500 e sui profondi la pillola è bianca con il testo
   arancia 700.
4. **Arancia 500, lime 500 e miele 300 non sono mai colore di testo su fondo
   chiaro.** Per il testo brand su chiaro si usa arancia 600 o 700; per il
   verde, lime 700.
5. Ogni testo sotto i 18px deve raggiungere almeno **4,5:1**.
6. **Niente nero.** `color.print.ink` non è esposto a Tailwind e il report
   fallisce se compare in una coppia.

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
| Display + wordmark | **il candidato del laboratorio font**, default **Nunito** | 700 / 800 nei titoli, mai 900 | sempre minuscolo, una parola in corsivo per titolo. `?font=<id>` lo cambia in tutto il sito; la scelta è del brand (`#/lab/font`) |
| Occhielli ed etichette | lo stesso display | 600 | frase normale: mai maiuscolo, mai mono |
| Testo | **Inter** | 400 / 500 / 600 | |
| Numeri e codici | **DM Mono** | 500 | dosaggi, prezzi, lotti, hex, token. Mai occhielli |
| Accento | **Fraunces Italic** | 500 | **solo i nomi dei gusti**: pack, card gusto, selettore. Mai titoli, mai testo |

I sette candidati, tutti SIL OFL su Google Fonts: Gabarito (il controllo, senza
il 900), Nunito, M PLUS Rounded 1c, Fredoka, Baloo 2, Rubik, Varela Round. Lo
stack sta in `font.display`; a runtime `src/lib/fontlab.ts` imposta
`--font-display` e `--display-weight`, e le classi `.type-display-*` li
leggono. Ogni candidato ha il suo wordmark in tracciati
(`src/brand/wordmarks/<id>.json`).

### Il ruolo del mono

Il mono **non è decorativo**, ma nella 3.0 fa una cosa sola: **i numeri e i
codici**. Dosaggi, grammi, stick, lotti, prezzi al giorno, hex, token. Non porta
più occhielli, etichette e didascalie: quelle sono display 600 in frase normale
(`type-eyebrow`, `type-label`). `mono-md` non è più maiuscolo; `mono-sm` (11px,
maiuscolo) resta per le micro-etichette di codice. Le occorrenze di mono
maiuscolo nel sorgente sono passate da 97 a 11.

### Il ruolo del corsivo

Due corsivi, due compiti. **Fraunces Italic** per il nome del gusto: `Nº01
Arancia Rossa`. **Il corsivo del display** (`<Em>`, classe `.peak-em`) per una
parola sola in ogni titolo: "la creatina, *evoluta*". Mai due, mai nel testo.
`?italic=0` lo spegne per confrontare.

### La scala

| Token | Size | Line-height | Tracking | Peso | Uso |
|---|---|---|---|---|---|
| `display-xl` | clamp(48px, 7.6vw, 112px) | 1.02 | -0.02em | 800 | Hero |
| `display-lg` | clamp(40px, 4.6vw, 64px) | 1.06 | -0.02em | 800 | Titoli sezione grandi, statement |
| `display-md` | clamp(30px, 3vw, 40px) | 1.1 | -0.02em | 700 | Titoli sezione |
| `display-sm` | 28px | 1.1 | -0.02em | 700 | Sottotitoli forti |
| `heading-lg` | 24px | 1.2 | -0.015em | 700 | Titoli card |
| `heading-md` | 20px | 1.25 | -0.01em | 700 | Titoli minori |
| `heading-sm` | 17px | 1.3 | 0 | 700 | Righe, tab |
| `eyebrow` | 15px | 1.3 | 0 | 600 | Occhielli, in frase normale |
| `label` | 13px | 1.4 | 0 | 600 | Etichette |
| `body-lg` | 18px | 1.6 | 0 | 400 | Introduzioni |
| `body-md` | 17px | 1.6 | 0 | 400 | Corpo |
| `body-sm` | 15px | 1.55 | 0 | 400 | Note, didascalie |
| `mono-lg` | clamp(40px, 4vw, 64px) | 1 | -0.02em | 500 | I numeri grandi |
| `mono-md` | 13px | 1.4 | 0.06em | 500 | Numeri e codici |
| `mono-sm` | 11px | 1.4 | 0.1em | 500 | Micro-etichette di codice, maiuscolo |
| `flavor-lg` | 32px | 1.15 | -0.01em | 500 | Il nome del gusto, sul pack e nelle hero |
| `flavor` | 24px | 1.2 | -0.01em | 500 | Il nome del gusto, nelle card |
| `flavor-sm` | 20px | 1.25 | 0 | 500 | Il nome del gusto, nei selettori |

I `display-*` sono sempre in **minuscolo** e prendono il peso da
`--display-weight` (700 o 800 secondo il candidato). I `flavor-*` sono sempre
**Fraunces Italic 500**. Le classi `.type-*` sono generate in `tokens.css` e
portano già famiglia, peso, stile e `text-transform`.

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

**Raggi** — `sm` 8px · `md` 14px · `lg` 22px · `xl` 30px · `2xl` 40px · `full`.
I pulsanti usano **sempre** `full`. Le card `lg` o `xl`. Spigoli vivi solo nelle
bande a tutta larghezza.

**Ombre** — `sm` · `md` · `lg`, tutte cacao a bassa opacità. Mai ombre
colorate, mai glow.

---

## Movimento

`fast` 120ms · `base` 200ms · `slow` 360ms · `marquee` 24s. Easing
`cubic-bezier(.2,.8,.2,1)`. **Ogni animazione rispetta
`prefers-reduced-motion: reduce`.** Le micro-interazioni dei punti (`dots.css`)
durano meno di mezzo secondo e partono da un gesto: niente loop.

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

## Vetro

Gruppo `glass` in `tokens.json`, esposto come `--glass-*`: blur 21px, saturate
140%, un gradiente da bianco 40% a bianco 5%, bordo bianco 10%, highlight 35%,
un velo bianco al 62% sotto il testo cacao, fallback bianco 85% senza
`backdrop-filter`, raggio 14px. `<Glass tone="light|onColor" liquid>` lo
disegna. **Solo sopra colore o immagine, mai su carta.** Il cacao sul velo:
12,0:1.

---

## Grana

`grain.opacity` 0.04 (3–5%), `grain.minWidthPx` 480. `<Grain />` è un
`feTurbulence` in multiply sopra i campi colore e il vetro; si spegne sotto i
480px e con `prefers-reduced-transparency`. È il modo in cui la 3.0 toglie al
pieno l'aria di "supplement tech" senza rinunciare al piatto.

---

## Sezione

`section.desktop` 144px, `section.mobile` 88px: il passo verticale delle
sezioni (`p-section`, `p-section-mobile` in Tailwind). I sei archetipi di
sezione stanno in `src/site/sections/` e in `#/lab/box`.

---

## Breakpoint

`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Container 1200px,
padding 28px; `<Container width>` offre `narrow` 760, `media` 1100 e `wide` 1440.
