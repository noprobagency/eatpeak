# peak — design system

Il sistema di design di **peak**, brand DTC di integratori. Primo prodotto:
creatina monoidrato in stickpack monodose, confezione da 30 giorni.

Il posizionamento non è la potenza, è **la costanza**: il prodotto funziona
perché lo prendi tutti i giorni, e il brand esiste per rendere quel gesto facile
e piacevole. Tutto qui dentro — i colori caldi, il minuscolo, il mono sui numeri,
il vincolo sui claim — discende da quella frase.

---

## ⚠ Prima di generare qualsiasi contenuto

Il prodotto è un **integratore alimentare venduto nell'Unione Europea**. Sono
utilizzabili **solo i claim autorizzati EFSA**.

<!-- peak-compliance-ignore-start * — elenco dei termini vietati, non un uso -->

Non sono utilizzabili, in nessuna forma e in nessuna lingua, riferimenti a
memoria, concentrazione, focus, lucidità mentale, cervello, umore, longevità,
invecchiamento, anti-age, telomeri, immunità, sonno, capelli, pelle — **e al
recupero**, che è l'errore più frequente perché suona innocuo ma non ha alcun
claim autorizzato.

<!-- peak-compliance-ignore-end -->

Vale per il copy, per i placeholder, per i contenuti demo, per i nomi delle
variabili e per i commenti nel codice.

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

Tre pagine, sull'hash:

| Rotta | Cosa |
|---|---|
| `#/showcase` | **Ogni token, ogni componente, ogni stato.** La mappa del sistema. |
| `#/landing` | Landing completa con contenuti reali. |
| `#/product` | Pagina prodotto. |

---

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Typecheck + build di produzione |
| `npm test` | Typecheck + compliance + contrasto |
| `npm run lint:compliance` | Cerca claim non autorizzati in tutto il sorgente |
| `npm run tokens:contrast` | Calcola i rapporti e aggiorna la tabella nei doc |
| `npm run tokens:build` | Rigenera `tokens.css` da `tokens.json` |
| `npm run check:utilities` | Verifica che ogni utility usata generi davvero CSS |
| `npm run docs:brand` | Rigenera `docs/00-brand-overview.md` dalla sua sorgente |
| `npm run assets:generate` | Rigenera logo, favicon, PNG e `favicon.ico` |
| `npm run export:logo` | Esporta il wordmark in PNG ad alta risoluzione |

---

## Dove stanno i token

**Sorgente unica di verità: [`src/tokens/tokens.json`](src/tokens/tokens.json).**

| Formato | File | Come nasce |
|---|---|---|
| JSON | `src/tokens/tokens.json` | scritto a mano — **è qui che si cambia un valore** |
| CSS | `src/tokens/tokens.css` | **generato** da `npm run tokens:build` |
| TypeScript | `src/tokens/tokens.ts` | ri-esporta il JSON con i tipi |
| Tailwind | `tailwind.config.js` | legge il JSON a build time |

Non modificare `tokens.css` a mano: viene sovrascritto.

Nei componenti si usano **solo i token semantici**:

```tsx
<div className="bg-bg-surface text-text-primary border-border-subtle" />  // sì
<div className="bg-neutral-0 text-neutral-900 border-neutral-200" />       // no
```

**→ [docs/02-tokens.md](docs/02-tokens.md)**

---

## Aggiungere un componente

1. Un file in `src/components/`, col commento **quando usarlo e quando no** in
   cima. Se non riesci a scrivere il "quando no", probabilmente non serve.
<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
2. Props tipizzate, tutti gli stati: default, hover, active, focus-visible,
   disabled, loading.
3. Solo token semantici.
4. Export in `src/components/index.ts`.
5. **Una sezione nello Showcase.** Se non è lì, per il sistema non esiste.
6. `npm test`.

**→ [docs/04-components.md](docs/04-components.md)**

---

## ⚠ Licenze dei font

**Rund è in versione trial e non è utilizzabile in produzione.** I file dei font
**non sono nel repo** e `.gitignore` li blocca.

Servono **due licenze separate**: desktop per il packaging e i vettoriali
(tariffata a postazioni), web per il sito (tariffata sulle visite mensili, quindi
è una spesa ricorrente).

Se i file mancano il progetto gira sui fallback gratuiti — Gabarito e Inter — e
non si rompe: cambia la voce tipografica, non il funzionamento. L'avviso di
`vite build` sui font non risolti è previsto.

**→ [assets/fonts/README.md](assets/fonts/README.md)**

---

## Struttura

```
├── docs/                    la documentazione, sotto
├── scripts/                 generatori e verifiche, senza dipendenze
│   ├── build-tokens.mjs     tokens.json → tokens.css
│   ├── compliance-lint.mjs  cerca claim non autorizzati
│   ├── check-utilities.mjs  scova le classi fuori scala, che non generano CSS
│   ├── contrast-report.mjs  calcola i rapporti, aggiorna i doc, fallisce se serve
│   ├── build-brand-doc.mjs  brand-overview.ts → docs/00-brand-overview.md
│   ├── generate-assets.mjs  logo, favicon, PNG, favicon.ico
│   └── lib/                 rasterizzatore e utility di contrasto
├── src/
│   ├── tokens/              JSON, CSS generato, TS tipizzato
│   ├── brand/               Logo, Icon, Lockup, paths
│   ├── components/          un file per componente
│   ├── lib/                 compliance, copy, contrasto, cn
│   ├── pages/               Showcase, LandingDemo, ProductDemo
│   └── styles/              globals.css, @font-face, focus-ring, sr-only
├── assets/
│   ├── logo/                SVG del wordmark, per variante e spessore
│   ├── favicon/             SVG dell'icona, per variante e misura
│   └── fonts/               solo istruzioni: i file non si committano
└── public/                  favicon.ico, PNG, manifest
```

---

## I documenti

| # | Documento | Cosa contiene |
|---|---|---|
| 00 | [**Scheda del brand**](docs/00-brand-overview.md) | Claim, posizionamento, target, tono. **Comincia da qui.** |
| 01 | [Brand](docs/01-brand.md) | Posizionamento, target, tono, le tensioni da tenere |
| 02 | [Token](docs/02-tokens.md) | Colore, tipografia, spazio, forma, movimento, contrasto |
| 03 | [Logo e icone](docs/03-logo.md) | Wordmark, spessori, icona, lockup, usi vietati |
| 04 | [Componenti](docs/04-components.md) | Quando usarli e quando no |
| 05 | [Voce e copy](docs/05-voice-and-copy.md) | Claim approvati, registro, cosa non si dice |
| 06 | [**Compliance**](docs/06-compliance.md) | Claim EFSA, termini vietati, il linter |
| 07 | [Setup Claude Design](docs/07-claude-design-setup.md) | Testi pronti da incollare |

---

## Note tecniche

- **React 18 + TypeScript + Tailwind 3 + Vite.** Nessuna dipendenza runtime oltre
  a React: il routing delle tre pagine demo è un `hashchange` di dodici righe.
- **Gli script non hanno dipendenze.** Il rasterizzatore che produce PNG e
  `favicon.ico` è scritto a mano in `scripts/lib/raster.mjs`: disegna le forme
  con supercampionamento 4×4 e codifica PNG e ICO direttamente.
- **Il generatore di asset legge `src/brand/paths.ts`**, lo stesso file dei
  componenti React: gli SVG statici non possono andare fuori sincrono col codice.
<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
- **Accessibilità:** target WCAG AA. Focus visibile ovunque (anello terracotta
  700, offset 2px), navigazione da tastiera completa su Modal, Accordion, Tabs e
  Select, marquee duplicato in un blocco `sr-only` statico, `prefers-reduced-motion`
  rispettato a livello di token.
