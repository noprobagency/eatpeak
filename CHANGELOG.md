# Changelog

Tutte le modifiche del progetto, **una voce per commit**, dalla più recente.
Formato: `ambito · commit · cosa`. Le versioni seguono semver in
`package.json`: patch per correzioni e documenti, minor per una sezione o un
componente nuovo, major per un cambio di sistema. I racconti per fase della
2.0 e della 3.0 stanno in `docs/CHANGELOG-v2.md` e `docs/CHANGELOG-v3.md`;
qui c'è il registro. Ogni commit aggiunge la sua riga qui, nello stesso
commit.

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
