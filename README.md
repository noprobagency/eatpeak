# peak — design system 3.0 e sito

Il sistema di design di **peak**, brand DTC di integratori, e il sito che lo
mette alla prova. Primo prodotto: **peak — Creatina + Glicina + Vitamina D3**,
con formula CreaVida™, in stick monodose. Una busta, trenta stick, trenta
giorni. Tre grammi al giorno, senza fase di carico. Due gusti.

Il posizionamento non è la potenza, è **la costanza**: il prodotto funziona
perché lo prendi tutti i giorni, e il brand esiste per rendere quel gesto facile
e piacevole. La direzione visiva è **Clinical Joy**: base bianco e carta con il
testo cacao e i numeri in mono; colore-gusto pieno a tutto campo con una grana
leggera, logo bianco grande, nome del gusto in corsivo, i punti che contano i
giorni. La 3.0 la umanizza: niente nero, una parola in corsivo per titolo, il
font e il simbolo si scelgono nei laboratori.

> La 1.0 — logo con contorno, saetta, palette terracotta e bosco, tre gusti —
> è archiviata intera in [`v1/`](v1/) e gira da sola.

---

## Per lavorare con Claude Code

Il contesto del progetto è nel repo, pronto per ogni sessione:

- [`CLAUDE.md`](CLAUDE.md) — le istruzioni che ogni sessione carica: regole,
  ciclo di un task, dove sta cosa. Importa da solo lo stato e il memo.
- [`docs/contesto/`](docs/contesto/00-indice.md) — il contesto vivo: stato,
  storico, decisioni, backlog per area, memo di progetto, mappa, procedure,
  log di sessione.
- [`CHANGELOG.md`](CHANGELOG.md) — una voce per commit, per versione.

---

## ⚠ Prima di generare qualsiasi contenuto

Il prodotto è un **integratore alimentare venduto nell'Unione Europea**. Sono
utilizzabili **solo i claim autorizzati EFSA**: due sulla creatina, quattro
sulla vitamina D. La glicina non ne ha.

<!-- peak-compliance-ignore-start * — elenco dei termini vietati, non un uso -->

Non sono utilizzabili, in nessuna forma e in nessuna lingua, riferimenti a
memoria, concentrazione, focus, cervello, umore, longevità, invecchiamento,
telomeri, metilazione, mitocondri, sonno, capelli, pelle, collagene,
glutatione, ritenzione e gonfiore — **e al recupero**, che è l'errore più
frequente. Vietata ogni raccomandazione di un professionista sanitario.

<!-- peak-compliance-ignore-end -->

Vale per il copy, per i placeholder, per i contenuti demo, per i nomi delle
variabili e per i commenti nel codice. E **non si inventano dati di prodotto**:
dove manca un valore del laboratorio si scrive `[dal laboratorio]`.

**→ [docs/06-compliance.md](docs/06-compliance.md)** — leggilo prima di scrivere
una riga.

```bash
npm run lint:compliance
```

---

## Partire

```bash
npm install
npm run dev
```

Nove pagine sull'hash. **La radice è il design system**: è lui il lavoro. Il
sito simulato sta sotto, da `#/sito` in giù, ed è l'unico che porta l'header;
tutto il resto si raggiunge dai link in fondo alla pagina.

| Rotta | Pagina |
|---|---|
| `#/` | **Design system** — la scheda del brand, i laboratori, i dettagli tecnici in fondo. È la home |
| `#/prototipi` | **Prototipi** — busta e stick dai componenti, la shot list, l'archivio 1.0 |
| `#/lab/font` · `#/lab/simbolo` · `#/lab/box` · `#/lab/pack` | **Laboratori** — font, simbolo, sezioni, pack: le alternative fianco a fianco, la scelta al brand |
| `#/sito` | **Home del sito** — la prima pagina del sito simulato |
| `#/prodotto` | **Prodotto** — il PDP con gusto, formati, tabella |
| `#/formula` | **La formula** — CreaVida™ ingrediente per ingrediente |

Le rotte vecchie restano come alias: `#/design-system` e `#/showcase` → `#/`,
`#/landing` e `#/home` → `#/sito`, `#/product` → `#/prodotto`.

Gli interruttori nell'URL: `?font=<id>`, `?italic=0`, `?body=display`, `?ref=1`
(vedi [docs/09-sito.md](docs/09-sito.md)).

---

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Typecheck + build di produzione |
| `npm test` | Typecheck + compliance + contrasto + build + utility |
| `npm run lint:compliance` | Cerca claim non autorizzati in tutto il sorgente (con auto-test) |
| `npm run tokens:contrast` | Calcola i rapporti e aggiorna la tabella nei doc |
| `npm run tokens:build` | Rigenera `tokens.css` da `tokens.json` |
| `npm run check:utilities` | Verifica che ogni utility usata generi davvero CSS |
| `npm run brand:vectorize` | Rigenera il tracciato del wordmark di un candidato (`-- --font-id=nunito`, `--all`) |
| `npm run assets:generate` | Rigenera logo, lockup, favicon, PNG, ICO, manifest |
| `npm run export:logo` | Esporta il wordmark in PNG ad alta risoluzione |
| `npm run export:pack` | Esporta busta o stick in SVG piatto + PNG, per il designer |
| `npm run docs:brand` | Rigenera `docs/00-brand-overview.md` |
| `npm run docs:screens` | Salva gli screenshot di riferimento in `docs/screens/` |

---

## Dove stanno le cose

**Token:** [`src/tokens/tokens.json`](src/tokens/tokens.json) è la sorgente
unica. `tokens.css` è generato, `tokens.ts` lo ri-esporta con i tipi,
`tailwind.config.js` lo legge a build time. Nei componenti solo i token
semantici.

**Copy e dati:** [`src/lib/copy.ts`](src/lib/copy.ts). I gusti in `FLAVORS`
(aggiungere un gusto = aggiungere una riga; il nome del gusto 02 vive in
`FLAVOR_02_NAME`), i prezzi in `PRICE_TIERS`, la gerarchia dei claim in
`CLAIMS`, il placeholder in `LAB_PLACEHOLDER`.

**Marchio:** [`src/brand/`](src/brand/). Il wordmark in tracciati
(`wordmark.json`), il vertice e le varianti (`paths.ts`), i componenti `Logo`,
`Icon`, `Lockup`, `DotField`.

**Media:** [`src/lib/media.ts`](src/lib/media.ts) è la shot list. Ogni foto che
manca è un `<MediaPlaceholder />` con il brief; quando il file arriva si scrive
il percorso.

---

## Aggiungere un componente

1. Un file in `src/components/`, col commento **quando usarlo e quando no** in
   cima.
2. Props tipizzate, tutti gli stati.
3. Solo token semantici. Se mostra un gusto, legge da `FLAVORS`.
4. Export in `src/components/index.ts`.
5. **Una sezione nella pagina Design system** — nei dettagli tecnici se non è
   uno dei cinque chiave. Se non è lì, per il sistema non esiste.
6. `npm test`.

**→ [docs/04-components.md](docs/04-components.md)**

---

## Font

Il display viene dal laboratorio font: sette candidati SIL OFL da Google Fonts
(Nunito di default; Gabarito, M PLUS Rounded 1c, Fredoka, Baloo 2, Rubik, Varela
Round), più Inter, DM Mono e Fraunces Italic. Nessun file locale, nessuna
licenza da comprare. I TTF servono solo in locale per rigenerare i wordmark, e
non si committano.

**→ [assets/fonts/README.md](assets/fonts/README.md)**

---

## Struttura

```
├── v1/                      l'archivio della 1.0, intero, eseguibile da solo
├── docs/                    la documentazione, sotto
│   └── screens/             gli screenshot di riferimento
├── scripts/                 generatori e verifiche
│   ├── build-tokens.mjs     tokens.json → tokens.css
│   ├── compliance-lint.mjs  cerca claim non autorizzati, con auto-test
│   ├── contrast-report.mjs  calcola i rapporti, aggiorna i doc, fallisce se serve
│   ├── check-utilities.mjs  scova le classi fuori scala
│   ├── vectorize-wordmark.mjs  font candidato → brand/wordmarks/<id>.json
│   ├── generate-assets.mjs  logo, lockup, favicon, PNG, ICO, manifest
│   ├── export-logo.mjs      il wordmark in PNG
│   ├── export-pack.mjs      busta e stick in SVG + PNG (Vite SSR + Chrome)
│   ├── screenshots.mjs      gli screenshot di riferimento
│   ├── build-brand-doc.mjs  brand-overview.ts → docs/00
│   └── lib/                 rasterizzatore (poligoni e cerchi) e contrasto
├── src/
│   ├── tokens/              JSON, CSS generato, TS tipizzato
│   ├── brand/               Logo, Icon, Lockup, DotField, paths, wordmark.json
│   ├── components/          un file per componente
│   ├── lib/                 compliance, copy, media, routes, brand-overview
│   ├── site/                header e footer del sito
│   ├── pages/               Home, Product, Formula, DesignSystem, Prototypes
│   └── styles/              globals.css
├── assets/
│   ├── logo/                il wordmark e i lockup, in tracciati
│   ├── favicon/             il vertice, per variante e misura
│   ├── fonts/               solo istruzioni: i file non si committano
│   └── export/              (ignorata) PNG e SVG esportati
└── public/                  favicon.ico, PNG, manifest, i prototipi della 1.0
```

---

## I documenti

| # | Documento | Cosa contiene |
|---|---|---|
| 00 | [**Scheda del brand**](docs/00-brand-overview.md) | Claim, posizionamento, target, tono. **Comincia da qui.** |
| 01 | [Brand](docs/01-brand.md) | Posizionamento, target, Clinical Joy, la 3.0 più umana, le tensioni da tenere |
| 02 | [Token](docs/02-tokens.md) | Colore, tipografia, spazio, forma, contrasto, packaging |
| 03 | [Logo e simbolo](docs/03-logo.md) | Wordmark in tracciati, vertice, lockup, pattern, usi vietati |
| 04 | [Componenti](docs/04-components.md) | Quando usarli e quando no |
| 05 | [Voce e copy](docs/05-voice-and-copy.md) | La gerarchia dei claim, il registro, cosa non si dice |
| 06 | [**Compliance**](docs/06-compliance.md) | I sei claim EFSA, i termini vietati, il linter, la dottoressa |
| 07 | [Setup Claude Design e Higgsfield](docs/07-claude-design-setup.md) | Testi pronti da incollare |
| 08 | [Packaging](docs/08-packaging.md) | Busta, stick, retro, export, cosa chiedere al laboratorio |
| 09 | [Il sito](docs/09-sito.md) | Le pagine, gli interruttori, home H1–H15, PDP P1–P14, gli archetipi |
| 10 | [Riferimenti delle sezioni](docs/10-riferimenti-sezioni.md) | Per ogni sezione il reference, cosa si copia e cosa no |
| — | [Contesto](docs/contesto/00-indice.md) | Stato, storico, decisioni, backlog, memo, mappa, procedure, sessioni |
| — | [Changelog](CHANGELOG.md) | Una voce per commit, per versione |
| — | [Changelog 3.0](docs/CHANGELOG-v3.md) | Home e PDP sui reference, i laboratori, le tre decisioni aperte |
| — | [Changelog 2.0](docs/CHANGELOG-v2.md) | La 2.0, per fase |

---

## Note tecniche

- **React 18 + TypeScript + Tailwind 3 + Vite.** Nessuna dipendenza runtime
  oltre a React: il routing è un `hashchange`. Una sola devDependency in più
  rispetto alla 1.0, `opentype.js`, per vettorializzare il wordmark.
- **Gli script leggono la stessa sorgente dei componenti.** `paths.ts` e
  `wordmark.json` alimentano `<Logo>`, `<Icon>` e il generatore di asset: gli
  SVG statici non possono andare fuori sincrono col codice.
- **L'export del packaging passa da Vite SSR e Chrome headless**, senza librerie
  in più: i componenti React diventano SVG piatti, e Chrome li rasterizza con i
  font di Google.
<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
- **Accessibilità:** target WCAG AA. Focus visibile ovunque (anello arancia
  700, offset 2px), navigazione da tastiera completa, marquee duplicato in un
  blocco `sr-only`, `prefers-reduced-motion` rispettato a livello di token, il
  pattern a pallini statico per scelta.
