# Changelog — design system 2.0

Branch `ds-v2`, 26 settembre 2026. Non mergiato su `main`: la preview la crea
Vercel dal branch.

---

## 1. Cosa è cambiato, per fase

**0 — Archivio.** Tutto il progetto 1.0 — docs, sorgente, script, asset,
prototipi, i font Rund in trial — si sposta intero in `v1/`, dove resta
eseguibile da solo (`cd v1 && npm install && npm run dev`). La radice del repo
ospita la 2.0, che questa volta è un sito simulato e non solo uno Showcase.

**1 — Token e palette.** 3 neutri (bianco, carta `#FAF7F2`, inchiostro) + 2
colori-gusto (arancia `#E4572E`, lime `#5E9E1F`) + 1 accento (miele). Escono
terracotta, bosco, rosso (resta `errore` per lo stato), `logo-fill`,
`logo-stroke`, `bg-forest`, `text-on-brand-large`. Nuovi token per i campi
colore-gusto e i loro tint. Regola di contrasto nuova nel report: bianco su
arancia 3,68:1 e su lime 3,29:1, ammessi solo per logo e testo grande; il testo
piccolo sui pieni arancia è inchiostro (4,72:1). Tipografia: Gabarito, Inter, DM
Mono, Fraunces Italic (`type.flavor*`, solo i nomi dei gusti). Rund esce.

**2 — Compliance.** Quattro claim autorizzati sulla vitamina D con la condizione
del 15% dei VNR `[dal laboratorio]`. Allowlist delle frasi letterali nel linter,
con auto-test (caso positivo: il claim `vitd-immune` passa; negativo: "immune" da
solo fallisce). Nuovi termini vietati: longevità (`telomer*`, metilazione,
`epigenetic*`, `mitocondri*`, healthy aging), salute (zero ritenzione, non gonfia,
no bloating, water retention), glicina (collagene, glutatione), esperti
(raccomandato/consigliato dalla dott, doctor recommended), mojito. Doc 06 con il
ruolo della dottoressa.

**3 — Wordmark.** "peak" vettorializzato da Gabarito 900 con
`scripts/vectorize-wordmark.mjs` (opentype.js, unica devDependency nuova),
tracking -0.04em, in `src/brand/wordmark.json`. Un solo colore, pieno, tre
varianti (`white`, `ink`, `flavor`). `<Logo size variant flavor align>` con
`background` che sceglie da solo. Area di rispetto = altezza della "e" (0.59).
`assets/logo` con i quattro wordmark e gli otto lockup in tracciati.

**4 — Vertice e pattern.** Via la saetta. Il vertice: tre cerchi a triangolo,
quattro varianti, favicon e manifest rigenerati (`theme_color #E4572E`).
`<Lockup>` con la regola dello spazio a metà simbolo. `<DotField>` con raggio
crescente lungo una direzione, statico, e `<DotFieldGroup>` per il pack.

**5 — Copy e prodotto.** `FLAVORS`, `FLAVOR_02_NAME`, la gerarchia dei cinque
claim, `PRODUCT` e `PRICE_TIERS` (Inizio 32 + 6,90; Abitudine 59, anche Duo;
Rituale Completo 85 preselezionato con Kit e Garanzia 90 giorni), tabella e
ingredienti con `LAB_PLACEHOLDER`, FAQ, trust, marquee, `EXPERT`. Nuova shot
list in `src/lib/media.ts`: tredici scatti con brief.

**6 — Componenti.** Toni colore-gusto su Section, Card, Marquee, Badge,
DoseSeal, Hero, SectionHeader. Button con `inverse` e `ink`. PriceTiers con il
prezzo al giorno in grande. Nuovi: BustaPack, StickPack 2.0, PackBack,
FlavorCard, FlavorSelector, LabTag, MediaPlaceholder, BrandSheet. Via
BrandOverview e BrandPrinciples.

**7 — Design system.** Nove sezioni sopra la piega, un solo `<details>` chiuso
di default con i dettagli tecnici, nav 00–08 + dettagli. StickyAddToCart montata
solo con i dettagli aperti e l'ancora nella viewport.

**8 — Pagine.** Router con ancore e alias 1.0; header e footer del sito; Home,
Prodotto, La formula, Prototipi (v2 dai componenti + shot list + archivio v1 con
banner grigio).

**9 — Documentazione ed export.** Docs 00–09 riscritti (08 packaging e 09 sito
nuovi), README, `export:pack` (Vite SSR + Chrome: SVG piatto + PNG),
`docs:screens`, screenshot in `docs/screens/`.

---

## 2. Le scelte fatte dove il prompt lasciava margine

- **Tracking -0.04em.** Confrontato con -0.03 e -0.05 misurando le distanze fra i
  tracciati (`--compare`): a -0.05 le pance di "e" e "a" si fondono, a -0.03 la
  "k" galleggia. -0.04 tiene p-e-a quasi a contatto e lascia aria alla k.
- **Cerchi nel rasterizzatore (strada b).** `raster.mjs` sa disegnare i cerchi
  con lo stesso supercampionamento 4×4; `paths.ts` resta geometria vera, non
  poligoni a 64 lati.
- **Pulsanti primari con testo inchiostro.** Il bianco su arancia 500 non passa
  per il testo piccolo (3,68:1); l'inchiostro sì (4,72:1). Il fondo resta arancia
  500. Sui campi colore c'è la pillola bianca `inverse`.
- **Sul pack il testo piccolo resta bianco**, com'è nella direzione: è stampa,
  si verifica sulla prova colore. Sul web vale la regola del tint.
- **Il sito, non solo lo Showcase.** Cinque pagine sull'hash con ancore
  (`#/#domande`), header con menu del sito e link dello studio in mono, footer
  con il sign-off coperto dai claim. Il carrello è simulato e lo dice.
- **`wordmark.json` invece di scrivere il path dentro `paths.ts`:** JSON letto
  sia dal TypeScript sia dagli script, senza parsing di sorgente.
- **Le utility dei gusti in `FLAVORS`** sono le classi Tailwind complete
  (`bg-bg-flavor-arancia`), non i nomi dei token: così i componenti le usano
  direttamente e non ci sono classi fantasma.
- **La shot list.** `src/lib/media.ts` + `<MediaPlaceholder />`: ogni foto
  mancante è un campo colore con il vertice e il brief; è il ponte verso i
  prototipi finali con Higgsfield.
- **Commit per fase, verifica alla fine.** I commit 3–8 sono stati staged per
  gruppo di file: presi singolarmente non compilano, perché le vecchie pagine
  dipendevano dalla vecchia API del brand e sono state riscritte in fase 8.
  `npm test` è verde dal commit 8 in poi (e sulla punta del branch).
- **Prima schermata del design system.** A 1440×900 si vedono header, titolo e
  la scheda intera; la sezione 01 (logo) comincia subito sotto la scheda, non
  dentro i 900px: la scheda con la gerarchia dei claim occupa quello spazio.

---

## 3. File eliminati e nuovi

**Eliminati dalla radice** (restano in `v1/`): `src/pages/Showcase.tsx`,
`LandingDemo.tsx`, `ProductDemo.tsx`, `src/components/BrandOverview.tsx`,
`BrandPrinciples.tsx`, tutti gli `assets/logo/peak-wordmark-*-{lg,md,sm}.svg` e
gli `assets/favicon/peak-icon-*` della saetta, `public/fonts/Rund*`.

**Nuovi:** `src/brand/wordmark.json`, `src/brand/DotField.tsx`,
`src/lib/media.ts`, `src/lib/routes.ts`, `src/site/SiteHeader.tsx`,
`SiteFooter.tsx`, `src/pages/Home.tsx`, `Product.tsx`, `Formula.tsx`,
`DesignSystem.tsx`, `Prototypes.tsx`, `src/components/BustaPack.tsx`,
`PackBack.tsx`, `FlavorCard.tsx`, `FlavorSelector.tsx`, `LabTag.tsx`,
`MediaPlaceholder.tsx`, `BrandSheet.tsx`, `scripts/vectorize-wordmark.mjs`,
`export-pack.mjs`, `screenshots.mjs`, `docs/08-packaging.md`, `docs/09-sito.md`,
`docs/screens/*`, `public/prototypes/v1/*`, `assets/logo/peak-lockup-*.svg`,
`assets/favicon/peak-vertice-*`.

---

## 4. I placeholder `[dal laboratorio]` rimasti

| Dove | Cosa manca |
|---|---|
| `src/lib/copy.ts` → `FLAVORS[*].aroma` | gli aromi di ciascun gusto |
| `src/lib/copy.ts` → `NUTRITION_ROWS` | glicina (g), vitamina D3 (µg e %VNR), kcal, zuccheri |
| `src/lib/copy.ts` → `INGREDIENTS_LINE` | aromi e forma della vitamina D3, ordine per peso |
| `src/lib/copy.ts` → `INGREDIENTS` | quantità di glicina e vitamina D3 |
| `src/lib/compliance.ts` → `EFSA_CLAIMS.vitd-*` | la conferma del 15% dei VNR, che decide se i claim si stampano |
| `src/components/PackBack.tsx` | ingredienti, tabella, claim vitamina D, responsabile, lotto/scadenza, contenuto netto |
| `src/components/BustaPack.tsx`, `StickPack.tsx` | le proporzioni (2:3 e 1:5 sono segnaposto della fustella) |
| `src/pages/Formula.tsx`, `Home.tsx`, `Product.tsx` | mostrano i tag grigi dei punti sopra |

Nel sito si vedono come `<LabTag />`: tag grigio tratteggiato.

---

## 5. La preview

Vercel crea la preview dal branch al push. Progetto `eatpeak`, team
`noprobagency`:

- **https://eatpeak-git-ds-v2-noprobagency.vercel.app**
- sorgente: [github.com/noprobagency/eatpeak, branch `ds-v2`](https://github.com/noprobagency/eatpeak/tree/ds-v2)

`main` non è toccato: `drinkpeak.vercel.app` resta la 1.0 finché non si decide
il merge.

---

## 6. Tre suggerimenti per lo step packaging

1. **Chiedere subito al laboratorio la fustella** di busta e stick con zone di
   saldatura, zip, tacca di strappo e abbondanza: `ratio`, `pack.safe` e
   `pack.sealBand` diventano i valori veri e il fronte si ridisegna da solo.
   Con la fustella, `export:pack` produce il file di lavoro al primo colpo.
2. **Chiudere i valori di composizione prima del retro:** glicina, D3 (µg e
   %VNR), kcal, zuccheri, aromi, peso netto. Decidono se i quattro claim sulla
   vitamina D si possono stampare, e chiudono tabella e lista ingredienti. Il
   retro si disegna dopo, non prima.
3. **La finitura e la prova colore.** Mono-materiale riciclabile o accoppiato,
   opaco o lucido, e soprattutto se l'arancia `#E4572E` e il lime `#5E9E1F` a
   tutto campo vanno in quadricromia o in tinta piatta: sono il brand, e si
   convertono con una prova stampata, non a occhio. Verificare sulla stessa
   prova la leggibilità del testo piccolo bianco sul campo colore.
