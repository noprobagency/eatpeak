# Changelog

Tutte le modifiche del progetto, **una voce per commit**, dalla più recente.
Formato: `ambito · commit · cosa`. Le versioni seguono semver in
`package.json`: patch per correzioni e documenti, minor per una sezione o un
componente nuovo, major per un cambio di sistema. I racconti per fase della
2.0 e della 3.0 stanno in `docs/CHANGELOG-v2.md` e `docs/CHANGELOG-v3.md`;
qui c'è il registro. Ogni commit aggiunge la sua riga qui, nello stesso
commit.

## [3.3.1] · 2026-09-26 · chiusura dello stato

Branch `task/ds-radice`.

- **docs** · verificato il merge della 3.3.0: `main` è a `2f25a4c` e il
  deploy di produzione è READY — https://drinkpeak.vercel.app apre sul design
  system. Stato, storico e backlog chiusi (INFRA-08).

## [3.3.0] · 2026-09-26 · piazza pulita: la radice è il design system

Branch `task/ds-radice`.

- **ds** · **la home è il design system.** La radice `#/` non è più la home
  del sito simulato ma la scheda del brand per intero: è lei il lavoro. Il
  sito scende a `#/sito` (Home), con `#/prodotto` e `#/formula`; prototipi e
  quattro laboratori restano dov'erano. Le rotte vecchie diventano alias
  (`#/design-system` e `#/showcase` → `#/`, `#/landing` e `#/home` →
  `#/sito`, `#/product` → `#/prodotto`), quindi nessun link in giro si rompe.
  I gruppi di rotta passano da `sito`/`studio`/`lab` a
  `sistema`/`lab`/`sito`.
- **ds** · **l'header solo sul sito.** `App.tsx` monta `<SiteHeader />` solo
  se `routeSpec(path).group === 'sito'`: design system, prototipi e
  laboratori non ce l'hanno. Il `padding-top` che `site-header.css` riserva
  alla barra fissa si spegne con `#contenuto[data-header='0']` in
  `globals.css` — più specificità, senza toccare il file dell'header.
- **ds** · **il footer è l'indice del progetto.** Quattro liste al posto di
  tre: **Il sistema** (le undici sezioni del design system, da `SYSTEM_NAV`,
  le stesse della colonna laterale della pagina), **Laboratori** (i quattro
  lab, i prototipi, l'archivio 1.0), **Il sito** (home, prodotto, formula,
  come funziona, domande, garanzia), **Aiuto**; poi contatti, informative e
  riga legale. Regola nuova: se una pagina o una sezione non ha il suo link
  qui, non la trova nessuno.
- **docs** · `SYSTEM_NAV` esce da `DesignSystem.tsx` ed entra in `routes.ts`,
  perché la legge anche il footer; i link interni della pagina passano da
  `#/design-system#id` a `to('/', id)`. Titolo e descrizione di `index.html`
  parlano del design system. `scripts/screenshots.mjs` aggiornato sulle rotte
  nuove. README, CLAUDE.md, docs 09 e mappa riscritti.
- **Da sistemare, quando l'header lo riprende il proprietario**: il logo
  dell'header punta a `to('/')`, che ora è il design system e non più la home
  del sito (HEADER-04). Claude non tocca l'header.

## [3.2.1] · 2026-09-26 · chiusura dello stato

Branch `task/ds-footer-panel`.

- **docs** · verificato il merge della 3.2.0: `main` è a `588a9fa` e il deploy
  di produzione è READY. Stato, storico e backlog chiusi (INFRA-07).

## [3.2.0] · 2026-09-26 · il footer a pannello

Branch `task/ds-footer-panel`.

- **ds** · il **footer** (H15) rifatto sulla forma di awenlab.com: non più una
  fascia a tutta larghezza ma un **pannello staccato** in ambra 400, raggio
  40px (`rounded-2xl`) con 16px di carta attorno, che chiude la pagina come
  una scheda. Dentro, due colonne: a sinistra il lockup, il sign-off in
  display, i claim autorizzati nello stesso blocco (articolo 10(3)) e i due
  cerchi social da 44px; a destra tre liste (Il sito, Aiuto, Lo studio) con il
  titolo in etichetta maiuscola e il filo sotto, e la riga larga dei contatti
  con i segni. Sotto, l'avviso "integratore alimentare", la riga delle sette
  informative e la riga legale con la firma dello studio (testo, non il logo
  di terzi). Tutto il testo è **cacao 900 pieno** (7,4:1): l'opacità del
  riferimento non regge sull'ambra (cacao 900 al 75% scende a 4,27:1), quindi
  la gerarchia si fa con corpo, peso e crenatura. Contatti e dati d'impresa
  sono segnaposto in parentesi quadre, le pagine di servizio riportano in
  home: il sito è dimostrativo e non si inventano numeri.
  Esce dal footer il **wordmark a tutta larghezza con il retino** (H3,
  `<WordmarkHalftone />`), che resta senza posto: decisione aperta D27.
  Docs 09 e 10 aggiornati, screenshot rigenerati.

## [3.1.0] · 2026-09-26 · ambra, quattro punti, salita, wordmark v1, Denim

Branch `v3-ambra`, aperto da `task/setup-contesto`, in attesa di merge.

- **brand** · il colore del brand passa all'**ambra** `#FFAE34` (scala 50–900):
  il 400 per i fondi con sopra solo il cacao 900 (7,4:1), il 700 `#A04F06`
  per punti, simbolo, link, testo brand e anello della tastiera. Semantici
  rimappati e nuovi (`bg-brand-hover`, `bg-brand-tint`, `text-on-brand-deep`,
  `symbol-*`, `logo-on-color`), report di contrasto riscritto. Primario
  ambra/cacao, secondario ambra 700; hero, footer, badge e striscia annunci in
  ambra. Arancia e lime restano i colori-gusto del pack.
  Il **simbolo a quattro punti** (V7, `SYMBOL_GEOMETRY`) con la **salita**
  nell'header (`<SymbolRise />`, 520ms, 0/60/120/190ms, touch e reduced
  motion); lockup centrato con 0,3em; favicon ambra con i punti cacao, ICO
  16/32/48, PNG 16–512, apple-touch, manifest e `theme-color` `#FFAE34`. Il
  **wordmark della v1** (Rund Display Black), bianco o ambra. **Denim** per
  tutto il testo, titoli a 700. Denim e Rund sono in trial: file e tracciato
  fuori da git, plugin `peak-trial-fonts` in `vite.config.ts`, ripieghi su
  Vercel. Corretto il retino del wordmark nel footer (il `clipPath` scalato
  mostrava solo l'angolo). Docs 00, 02, 03, README dei font, CLAUDE.md,
  contesto (D21–D26, backlog BRAND-05/06/07, HEADER-03, PACK-05, LIC-01/02),
  screenshot.

## [3.0.1] · 2026-09-26 · setup del contesto

Branch `task/setup-contesto`, in attesa di merge.

- **docs** · `CLAUDE.md` alla radice con l'import automatico di stato e memo;
  `CHANGELOG.md` per commit; `docs/contesto/` con indice, stato, storico,
  decisioni, backlog, memo di progetto, mappa del repo, procedure e i log di
  sessione; README aggiornato; versione 3.0.1.

## [3.0.0] · 2026-09-26 · design system 3.0, home e PDP sui reference

In produzione dal 26/09/2026: merge fast-forward su `main` lanciato dal
proprietario, deploy Vercel `f8378bd` READY. Branch `v3-home-pdp`.

- **docs** · `f8378bd` · pulizia e documentazione: Formula, Design system
  (dieci sezioni, laboratori) e Prototipi allineati alla 3.0; mono maiuscolo
  nel sorgente da 97 a 11; docs 01–05, 08, 09 aggiornati, 10 nuovo,
  CHANGELOG-v3, README, scheda 00, screenshot 3.0.
- **pdp** · `2850715` · Product.tsx riscritta P1–P14: galleria con la frutta e
  lo switch gusto di vetro, buy box a passi, "È per me?", tab a pallini,
  30/60/90 giorni, recensioni con filtri, sticky di vetro. PriceTiers con
  `legend`.
- **home** · `4cc8e74` · Home.tsx riscritta H1–H15 sui reference, `data-ref`
  e `?ref=1`, Kit Rituale via, footer con il wordmark a retino.
- **pack** · `3d07f6c` · frutta placeholder stile Cure, variante Neutro,
  BustaBack con i 30 cerchi, `#/lab/pack`, export `--retro --neutro --font`.
- **ds** · `b2c3a32` · sei archetipi di sezione in `src/site/sections/`,
  Glass con i fallback, Grain, `#/lab/box`.
- **brand** · `d3b9eeb` · il sistema a pallini: HandDot, DayDot, dots.css,
  VertexBreath, WordmarkHalftone, StockCounter, varianti del simbolo V1–V6 con
  `SYMBOL_VARIANT`, `#/lab/simbolo`, sei regole anti-eccesso.
- **brand** · `40b1877` · tipografia e font lab: sette candidati, `?font=`,
  `?italic=0`, `?body=display`, wordmark per candidato, `#/lab/font`, titoli
  700–800, occhielli display 600.
- **token** · `6918d10` · niente nero: scala cacao, profondi arancia 600 e
  lime 700, `print.ink` fuori da Tailwind, token dot/glass/grain/section,
  report di contrasto riscritto.

## [2.1.0] · 2026-09-26 · header sul modello Nazzi (versione retroattiva)

- **header** · `c19c716` · barra annunci arancia e barra di vetro, il vertice
  che ruota e rivela il wordmark. Da qui l'header è del proprietario.

## [2.0.0] · 2026-09-26 · design system 2.0 e sito simulato

Branch `ds-v2`, poi su `main`. Il racconto è in `docs/CHANGELOG-v2.md`.

- **docs** · `59eff31` · documentazione e export.
- **pagine** · `514944c` · Home, PDP, Formula, Prototipi.
- **ds** · `b0736c5` · showcase in nove sezioni + dettagli tecnici.
- **componenti** · `662eae1` · la libreria 2.0.
- **copy** · `b8f14b4` · copy e prodotto in `copy.ts`.
- **brand** · `9ef5104` · vertice e pattern a pallini.
- **brand** · `65ba8e3` · wordmark in tracciati.
- **compliance** · `acde882` · sei claim, allowlist, linter con auto-test.
- **token** · `79dac88` · token e palette 2.0.
- **infra** · `7604bd9` · la 1.0 archiviata intera in `v1/`.

## [1.0.0] · 2026-08-25 · design system 1.0

Nove commit da `9972cdc` a `aaefc88`: token, componenti, brand, compliance,
scheda del brand, export del wordmark, galleria dei prototipi. Oggi in `v1/`,
eseguibile da sola.
