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

// no
<div className="bg-neutral-0 text-neutral-900 border-neutral-200" />
```

Il motivo è banale e concreto: il giorno in cui il terracotta cambia sfumatura,
nel primo caso si tocca una riga di `tokens.json`, nel secondo si aprono
trecento file.

---

## Colore

Quattro scale a dieci step. I valori **base** sono fissi; gli altri step sono
derivati per luminosità mantenendo la temperatura calda.

### Terracotta — primario

Bordi, pulsanti, accenti. Base: **400 `#E9724C`**.

| Step | Hex | Uso tipico |
|---|---|---|
| 50 | `#FDF1EC` | `bg-brand-soft`, fondo dei badge |
| 100 | `#FADCD1` | stato active dei pulsanti secondari |
| 200 | `#F5BCA8` | — |
| 300 | `#F09A7F` | — |
| **400** | **`#E9724C`** | `bg-brand`, `border-brand`, `logo-stroke` |
| 500 | `#D45E39` | hover del pulsante primario |
| 600 | `#B54A2A` | `text-brand` — il primo step leggibile su fondo chiaro |
<!-- peak-compliance-ignore focus — anello di focus da tastiera, non un claim -->
| 700 | `#8F3A20` | `logo-stroke-deep`, anello di focus da tastiera |
| 800 | `#6B2B18` | — |
| 900 | `#47190E` | testo su fondo terracotta 400 |

### Miele — secondario

Pieno del logo, superfici calde. Base: **300 `#FCD589`**.

| Step | Hex | Uso tipico |
|---|---|---|
| 50 | `#FEFAF0` | `bg-warm` |
| 100 | `#FDF2DC` | fondo dei badge warning |
| 200 | `#FCE7BE` | — |
| **300** | **`#FCD589`** | `logo-fill`, `DoseSeal`, banda dello stickpack |
| 400 | `#F7C463` | — |
| 500 | `#EFAE3D` | — |
| 600 | `#D9922A` | colore di stato `warning` |
| 700 | `#B0741F` | — |
| 800 | `#855717` | testo sui badge warning |
| 900 | `#5A3A0F` | — |

### Bosco — contrasto freddo

Sezioni, secondo prodotto. Base: **500 `#2F6E5E`**, profondo: **700 `#174036`**.

| Step | Hex | Uso tipico |
|---|---|---|
| 50 | `#EFF5F3` | fondo dei badge success |
| 100 | `#D6E5E0` | — |
| 200 | `#ADCBC2` | — |
| 300 | `#7FAEA1` | — |
| 400 | `#4F8B7B` | — |
| **500** | **`#2F6E5E`** | `bg-forest`, colore di stato `success` |
| 600 | `#26594C` | testo verde su fondo chiaro |
| **700** | **`#174036`** | contorno del logo su fondo bosco |
| 800 | `#102D26` | — |
| 900 | `#081915` | — |

### Neutri caldi

| Step | Hex | | Step | Hex |
|---|---|---|---|---|
| 0 | `#FFFFFF` | | 500 | `#928C84` |
| 50 | `#FAF9F7` | | 600 | `#6E6862` |
| 100 | `#F5F4F2` | | 700 | `#4A443E` |
| 200 | `#E8E5E0` | | 800 | `#33312E` |
| 300 | `#DFDCD7` | | 900 | `#1B1A18` |
| 400 | `#BDB8B0` | | 1000 | `#0F0E0D` |

I neutri sono **caldi di proposito**. Non usare mai grigi neutri puri o freddi:
un solo `#888888` in mezzo a questi spezza la temperatura di tutto il resto, e
la cosa si nota prima di riuscire a spiegarsela.

Per la stessa ragione `tailwind.config.js` **sostituisce** la palette di
default invece di estenderla: i grigi di Tailwind non sono raggiungibili per
sbaglio.

### Stato

`success #2F6E5E` (riusa Bosco) · `warning #D9922A` · `error #C0392B` · `info #4A443E`

---

## Token semantici

Gli unici che i componenti devono conoscere.

| Token | Riferimento |
|---|---|
| `--bg-page` | neutral 50 |
| `--bg-surface` | neutral 0 |
| `--bg-raised` | neutral 100 |
| `--bg-warm` | miele 50 |
| `--bg-inverse` | neutral 900 |
| `--bg-brand` | terracotta 400 |
| `--bg-brand-soft` | terracotta 50 |
| `--bg-forest` | bosco 500 |
| `--text-primary` | neutral 900 |
| `--text-secondary` | neutral 700 ⚠ |
| `--text-muted` | neutral 600 ⚠ |
| `--text-inverse` | neutral 0 |
| `--text-brand` | terracotta 600 |
| `--text-on-brand` | terracotta 900 ⚠ |
| `--text-on-brand-large` | neutral 0 — solo ≥24px ⚠ |
| `--border-subtle` | neutral 200 |
| `--border-default` | neutral 300 |
| `--border-strong` | neutral 400 |
| `--border-brand` | terracotta 400 |
| `--logo-fill` | miele 300 |
| `--logo-stroke` | terracotta 400 |
| `--logo-stroke-deep` | terracotta 700 |
| `--focus-ring` | terracotta 700 |

### ⚠ Le tre deviazioni dal brief

Il brief chiedeva due cose che, insieme, non stanno in piedi. `npm run tokens:contrast`
le ha fatte emergere con i numeri. Sono documentate qui invece di essere risolte
in silenzio, perché la scelta è reversibile e va vista.

**1. `--text-muted` punta a neutral 600, non a neutral 500.**
Neutral 500 (`#928C84`) su bianco dà **3.33:1**. Il brief chiede almeno 4.5:1 per
ogni testo sotto i 18px, e `text-muted` è proprio il colore delle micro-etichette
in mono da 10px — il caso peggiore. Ha vinto la regola di contrasto.

**2. `--text-secondary` è slittato a neutral 700** per non collassare sul muted e
mantenere tre livelli di gerarchia distinti.

**3. `--text-on-brand` è terracotta 900, non bianco.**
Il bianco su terracotta 400 dà **3.01:1**: sotto la soglia per qualunque testo di
interfaccia, pulsanti compresi. Il brief autorizzava esplicitamente due colori su
terracotta 400 — `neutral-0` o `terracotta-900` — e solo il secondo passa. Il
colore del brand resta identico: cambia l'inchiostro sopra, non il fondo.

Il bianco resta disponibile come **`--text-on-brand-large`**, per il solo testo
grande (≥24px, o ≥18.66px in grassetto), dove WCAG AA si accontenta di 3:1. È il
token che usano `<Hero>` e `<SectionHeader>` per il titolo su fondo terracotta,
mentre il corpo scende su terracotta 900.

Se il brand preferisce il bianco sui pulsanti, la strada pulita è portare il
fondo del pulsante a **terracotta 600** (bianco a 5.28:1) lasciando il 400 a
bordi, riempimenti e logo. È una decisione di marchio, non di codice.

---

## Regole di contrasto — vincolanti

Non sono consigli. Un componente che le viola è un bug.

1. **Miele 300 e Terracotta 400 non sono mai colore di testo su fondo chiaro.**
   Contrasto insufficiente. Vivono come riempimento, fondo o bordo.
2. Il testo su fondo **Terracotta 400** deve essere `neutral-0` o `terracotta-900`,
   **mai miele**.
3. Il testo su fondo **Miele 300** deve essere `neutral-900` o `terracotta-700`.
4. Per il testo di colore brand su fondo chiaro si usa **Terracotta 600 o 700**,
   mai il 400.
5. Ogni testo sotto i 18px deve raggiungere almeno **4.5:1**.

> Nota sul wordmark. La regola 2 vale per il **testo**, non per il marchio: il
> logo è miele su terracotta e funziona perché il contorno esterno lo stacca dal
> fondo. È una soluzione grafica, non un'eccezione alla regola di leggibilità —
> e non si estende a nessun testo.

### La tabella dei rapporti

<!-- CONTRAST:START -->

_Tabella generata da `npm run tokens:contrast`. Non modificarla a mano._

| Testo | Fondo | Coppia | Rapporto | Esito | Stato nel sistema |
|---|---|---|---|---|---|
| `#1B1A18` | `#FAF9F7` | `text-primary` su `bg-page` | 16.53:1 | AAA | Consentita. |
| `#1B1A18` | `#FFFFFF` | `text-primary` su `bg-surface` | 17.39:1 | AAA | Consentita. |
| `#4A443E` | `#FAF9F7` | `text-secondary` su `bg-page` | 9.12:1 | AAA | Consentita. |
| `#6E6862` | `#FFFFFF` | `text-muted` su `bg-surface` | 5.50:1 | AA | Consentita. |
| `#6E6862` | `#FAF9F7` | `text-muted` su `bg-page` | 5.23:1 | AA | Consentita. |
| `#4A443E` | `#FEFAF0` | `text-secondary` su `bg-warm` | 9.21:1 | AAA | Consentita. |
| `#B54A2A` | `#FFFFFF` | `text-brand` (terracotta 600) su bianco | 5.28:1 | AA | Consentita. |
| `#8F3A20` | `#FFFFFF` | terracotta 700 su bianco | 7.52:1 | AAA | Consentita. |
| `#8F3A20` | `#FCD589` | terracotta 700 su miele 300 | 5.38:1 | AA | Consentita. |
| `#8F3A20` | `#FDF1EC` | terracotta 700 su terracotta 50 | 6.79:1 | AA | Consentita. |
| `#47190E` | `#E9724C` | `text-on-brand` (terracotta 900) su terracotta 400 | 4.94:1 | AA | Consentita. |
| `#FFFFFF` | `#D45E39` | bianco su terracotta 500 (hover del pulsante) | 3.85:1 | AA | Consentita solo per il testo grande. Solo per il testo grande. |
| `#1B1A18` | `#FCD589` | inchiostro su miele 300 | 12.44:1 | AAA | Consentita. |
| `#FFFFFF` | `#2F6E5E` | bianco su bosco 500 | 5.98:1 | AA | Consentita. |
| `#FFFFFF` | `#174036` | bianco su bosco 700 | 11.52:1 | AAA | Consentita. |
| `#FFFFFF` | `#1B1A18` | `text-inverse` su `bg-inverse` | 17.39:1 | AAA | Consentita. |
| `#FCD589` | `#1B1A18` | miele 300 su inchiostro | 12.44:1 | AAA | Consentita. |
| `#C0392B` | `#FFFFFF` | `error` su bianco | 5.44:1 | AA | Consentita. |
| `#26594C` | `#FFFFFF` | bosco 600 (success testuale) su bianco | 8.03:1 | AAA | Consentita. |
| `#855717` | `#FDF2DC` | miele 800 su miele 100 (badge warning) | 5.61:1 | AA | Consentita. |
| `#FCD589` | `#FFFFFF` | miele 300 come **testo** su bianco | 1.40:1 | FAIL | **Vietata.** Il miele vive come riempimento, fondo o bordo. Mai come testo su fondo chiaro. |
| `#E9724C` | `#FFFFFF` | terracotta 400 come **testo** su bianco | 3.01:1 | FAIL | **Vietata.** Per il testo brand su fondo chiaro si usa il 600 o il 700, mai il 400. |
| `#FCD589` | `#E9724C` | miele 300 su terracotta 400 | 2.15:1 | FAIL | **Vietata.** E la combinazione del wordmark, dove il contorno risolve. Nel testo no: il testo su terracotta 400 e bianco o terracotta 900. |
| `#FFFFFF` | `#E9724C` | `text-on-brand-large` (bianco) su terracotta 400 | 3.01:1 | AA | **Vietata.** Raggiunge 3:1: ammesso SOLO per il testo grande (24px, o 18.66px in grassetto). Sotto quella misura si usa `text-on-brand`, che e terracotta 900. |
| `#928C84` | `#FFFFFF` | neutral 500 come **testo** su bianco | 3.33:1 | FAIL | **Vietata.** Non raggiunge 4.5:1. E il motivo per cui `--text-muted` punta al 600 e non al 500, come sarebbe stato naturale. |

<!-- CONTRAST:END -->

Le ultime righe sono le combinazioni **vietate**. Stanno nella tabella apposta:
un divieto senza il numero accanto non viene rispettato.

Lo script è anche un test — se una coppia dichiarata valida scende sotto 4.5:1,
`npm run tokens:contrast` esce con errore.

---

## Tipografia

### Famiglie

| Ruolo | Font | Fallback |
|---|---|---|
| Display | Rund Display | `Gabarito`, `system-ui`, sans-serif |
| Testo | Rund Text | `Inter`, `system-ui`, sans-serif |
| Utility / numeri | DM Mono | `ui-monospace`, monospace |

I file dei font **non stanno nel repo**: vedi [`assets/fonts/README.md`](../assets/fonts/README.md).
Se mancano, il sistema scende sui fallback gratuiti e non si rompe: cambia la
voce tipografica, non il funzionamento.

### Il ruolo del mono

Il mono **non è decorativo**. Porta tutti i dati oggettivi: dosaggi, grammi,
numero di stick, lotti, prezzi unitari, conteggi giorni. È il contrappeso che
impedisce al rounded di diventare infantile.

Si usa sempre maiuscolo, con `letter-spacing: 0.14em`, mai sotto i 10px.

### La scala

Base 16px, rapporto 1.25 arrotondato.

| Token | Size | Line-height | Tracking | Uso |
|---|---|---|---|---|
| `display-xl` | 76px | 0.95 | -0.05em | Hero desktop |
| `display-lg` | 58px | 0.98 | -0.045em | Hero mobile, titoli sezione grandi |
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

I `display-*` usano sempre **Rund Display peso 900** e sono sempre in
**minuscolo**. Mai maiuscolo, mai capitalizzato titolo per titolo: il minuscolo
è parte dell'identità, non uno stile applicato dopo.

Le classi `.type-display-xl`, `.type-mono-md` e simili sono generate in
`tokens.css` e portano già famiglia, peso e `text-transform` corretti.

---

## Spazio

Base 4px.

`0` · `1` 4px · `2` 8px · `3` 12px · `4` 16px · `5` 20px · `6` 24px · `8` 32px ·
`10` 40px · `12` 48px · `16` 64px · `20` 80px · `24` 96px · `32` 128px

Lo spazio appartiene al contenitore, non ai figli: usa `<Stack gap="6">`, non
`margin-bottom` sugli elementi.

### ⚠ La scala sostituisce quella di Tailwind, non la estende

`tailwind.config.js` imposta `spacing` con questi valori **al posto** di quelli
di default. È voluto: `p-7` o `gap-1.5` non esistono, e non si possono scrivere
per distrazione.

Il rovescio è che **Tailwind non protesta**. Una classe fuori scala non genera
CSS e la pagina resta in piedi lo stesso: un pulsante senza altezza si regge sul
padding, e il difetto passa inosservato per settimane. È già successo in questo
repo — `h-11`, `h-9` e `h-14` non hanno mai prodotto una riga di CSS.

Per questo esiste `npm run check:utilities`: confronta ogni utility di
dimensione usata nel sorgente con il CSS costruito e fallisce sulla differenza.
Gira dentro `npm test`, dopo la build.

Quando serve una misura che non sta nella scala e non è uno spazio — la
larghezza di una barra laterale, l'altezza di un segnaposto — si usa un valore
arbitrario, `w-[208px]`, che compila sempre ed è visibilmente un'eccezione.

---

## Altezze dei controlli

Non sono spazi e non stanno nella scala di spaziatura: sono decisioni sulla
dimensione dei bersagli.

| Token | Valore | Uso |
|---|---|---|
| `control-sm` | 36px | Pulsanti piccoli, chiudi di una modale |
| `control-md` | 44px | Pulsanti, campi, select. **Il minimo per un bersaglio touch.** |
| `control-lg` | 56px | La chiamata all'azione principale |

Disponibili come `h-control-md`, `w-control-sm`, `min-h-control-md`.

---

## Forma

**Raggi** — generosi, è un brand morbido.

`sm` 8px · `md` 14px · `lg` 22px · `xl` 30px · `2xl` 44px · `full` 9999px

I pulsanti usano **sempre** `full`: nel sistema di peak sono pillole, senza
eccezioni. `<Button>` non espone una prop per cambiarlo, di proposito. Le card
usano `lg` o `xl`. Spigoli vivi solo nelle bande a tutta larghezza.

**Ombre** — minime, il brand è piatto.

`sm` `0 1px 2px rgba(27,26,24,.06)` · `md` `0 4px 12px rgba(27,26,24,.08)` ·
`lg` `0 12px 32px rgba(27,26,24,.10)`

Mai ombre colorate, mai glow. L'ombra dice solo cosa sta sopra cosa.

---

## Movimento

`fast` 120ms · `base` 200ms · `slow` 360ms · `marquee` 24s linear infinite

Easing standard: `cubic-bezier(.2,.8,.2,1)`.

**Ogni animazione rispetta `prefers-reduced-motion: reduce`.** Il blocco è già in
`tokens.css` e azzera le durate a livello globale; il `<Marquee>` fa un passo in
più e diventa una riga fissa che va a capo, invece di restare fermo a metà.

---

## Breakpoint

`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536

Container: larghezza massima 1200px, padding 28px.
