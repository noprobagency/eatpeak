# 02 — Storico

La linea del tempo del progetto, dal più vecchio al più recente. Ogni riga
rimanda al log di sessione in `sessioni/` e al registro in `CHANGELOG.md`.

| Data | Sessione | Versione | Cosa è successo | Commit |
|---|---|---|---|---|
| 2026-08-25 | [Design system 1.0](sessioni/2026-08-25-ds-v1.md) | 1.0.0 | Il primo sistema: token, componenti, logo con contorno e saetta, palette terracotta e bosco, tre gusti, galleria dei prototipi. Oggi in `v1/` | `9972cdc` → `aaefc88` (9) |
| 2026-09-26 | [Design system 2.0](sessioni/2026-09-26-ds-v2.md) | 2.0.0 | La 1.0 archiviata in `v1/`; alla radice la 2.0 come sito simulato: Clinical Joy, wordmark in tracciati, vertice, compliance con linter, Home/PDP/Formula/Design system/Prototipi. Branch `ds-v2`, poi su `main` e su drinkpeak.vercel.app | `7604bd9` → `59eff31` (10) |
| 2026-09-26 | [Header Nazzi](sessioni/2026-09-26-header-nazzi.md) | 2.1.0 | L'header rifatto sul modello di Farmacia Nazzi: barra annunci, barra di vetro, il vertice che ruota e rivela il wordmark. Da qui l'header è del proprietario | `c19c716` |
| 2026-09-26 | [3.0: home e PDP](sessioni/2026-09-26-v3-home-pdp.md) | 3.0.0 | Otto fasi: niente nero, font lab, pallini, archetipi e vetro, pack, home, PDP, pulizia e documentazione. Branch `v3-home-pdp`; il merge su `main` lo ha lanciato il proprietario e la 3.0 è in produzione | `6918d10` → `f8378bd` (8) |
| 2026-09-26 | [Setup del contesto](sessioni/2026-09-26-setup-contesto.md) | 3.0.1 | `CLAUDE.md`, `CHANGELOG.md`, `docs/contesto/`: l'impianto per lavorare task per task con il contesto sempre pronto. Branch `task/setup-contesto` | in attesa di merge |
| 2026-09-26 | [Ambra, quattro punti, salita](sessioni/2026-09-26-v3-ambra.md) | 3.1.0 | Il brand passa all'ambra; il simbolo diventa quattro punti con la salita nell'header; torna il wordmark della v1, bianco o ambra; Denim per tutto il testo. Denim e Rund sono in trial: solo in locale, in produzione i ripieghi. Branch `v3-ambra` | in attesa di merge |

## Le versioni maggiori, in una riga ciascuna

- **1.0** — il sistema nasce: molto materiale, poco chiuso.
- **2.0** — il sistema si chiude: una palette, un wordmark in tracciati, un
  linter che non lascia passare un claim, un sito simulato al posto dello
  showcase.
- **3.0** — il sistema si umanizza: via il nero, i punti che contano i giorni,
  il vetro e la grana, il font e il simbolo messi in laboratorio perché li
  scelga il brand, home e PDP rifatte sezione per sezione sui reference.
- **3.1** — il brand sceglie: l'ambra, i quattro punti che salgono, il
  wordmark della v1, Denim. Due font in trial, tenuti in locale finché non ci
  sono le licenze.
