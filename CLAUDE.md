# peak — istruzioni per Claude Code

Questo file si carica da solo a ogni sessione. Dice cos'è il progetto, dove
sta ogni cosa, come si lavora e cosa non si tocca. Il contesto vivo (stato,
backlog, decisioni, memo, storico) sta in `docs/contesto/`; i due file che
servono subito sono importati qui sotto e arrivano in contesto da soli.

@docs/contesto/01-stato.md
@docs/contesto/05-memo-progetto.md

## Il progetto in cinque righe

- **peak** è un brand DTC di integratori. Primo prodotto: creatina + glicina +
  vitamina D3 in stick monodose, formula CreaVida™, una busta da 30 stick per
  30 giorni, 3 g al giorno senza fase di carico, due gusti (Nº01 Arancia Rossa,
  Nº02 Lime & Menta). Posizionamento: la costanza, non la potenza.
- Questo repo è il **design system** e il **sito simulato** che lo mette alla
  prova. Dalla 3.3 la **radice `#/` è il design system**: è lui il lavoro. Il
  sito (Home `#/sito`, PDP, Formula) sta sotto ed è l'unico gruppo di rotte
  che mostra l'header; prototipi e quattro laboratori completano il quadro.
  **Tutto si naviga dal footer**, che è uguale su ogni pagina e ne è l'indice:
  se una pagina o una sezione non ha il suo link lì, non la trova nessuno.
  Vite + React 18 + TypeScript + Tailwind 3, nessuna dipendenza runtime oltre
  React, routing sull'hash.
- **Produzione**: https://drinkpeak.vercel.app = branch `main` (Vercel, team
  `noprobagency`, progetto `eatpeak`). Ogni branch ha una preview, dietro il
  login del team.
- La 1.0 è archiviata intera in `v1/` e non si tocca. La 2.0 è la base chiusa;
  la 3.0 la umanizza ed è quella in produzione.
- Lingua di lavoro: **italiano**, anche nei commit, nei commenti e nei
  documenti. Le domande si fanno come testo normale nella risposta.

## Regole che non si negoziano

1. **Compliance prima di tutto.** Integratore venduto in UE: solo i sei claim
   EFSA, letterali, definiti in `src/lib/compliance.ts`. Il linter
   (`npm run lint:compliance`) gira su `src/`, `docs/`, `README.md` e
   `index.html` e vale per copy, placeholder, commenti, nomi di variabili e
   documenti: la lista dei termini vietati sta nello stesso file. Non si
   inventano dati di prodotto: dove manca un valore si scrive
   `[dal laboratorio]`. Leggi `docs/06-compliance.md` prima di scrivere una
   riga di testo pubblico.
2. **L'header è del proprietario.** `src/site/SiteHeader.tsx` e
   `src/site/site-header.css` non si toccano. Si riporta cosa cambia di
   riflesso via token e dati.
3. **Le decisioni di brand le prende il proprietario**. Nella 3.1 ha scelto:
   ambra come colore del brand, il simbolo a quattro punti con la salita
   (`SYMBOL_VARIANT = 'v7'`), il wordmark della v1 bianco o ambra, Denim per
   tutto il testo. Resta aperto il fondo del rituale. Claude prepara le
   alternative nei laboratori, non sceglie.
4. **Sistema visivo**: il brand è l'**ambra** (400 per i fondi, 700 per punti,
   simbolo, link e testo brand); **sull'ambra 400 solo cacao 900**, mai bianco
   né grigi; niente nero (i neutri del testo sono cacao); arancia e lime sono i
   colori-gusto del pack; titoli 700 (con Denim; mai 900) con una parola in
   corsivo; occhielli in display 600 e frase normale; mono solo per numeri e
   codici; vetro solo sopra colore; solo token semantici nei componenti. Tutto
   in `docs/02-tokens.md` e `docs/03-logo.md`.
5. **Recensioni, numeri, rating mai finti in pubblico**: esempi con il tag
   "esempio". Niente Kit Rituale (dopo il lancio), niente quiz.
6. **Nessuna dipendenza runtime nuova.** Font da Google Fonts (OFL), oppure
   file con licenza che **non entrano in git**: il repo è pubblico. Denim e
   Rund sono in trial e stanno solo in locale (`assets/fonts/README.md`).
   Immagini, loghi e claim di terzi mai: i reference stanno in
   `docs/references/`, fuori dal versionamento.
7. **`npm test` verde prima di ogni commit**: typecheck, compliance, contrasto,
   build, utility fuori scala.

## Come si lavora: il ciclo di un task

Il dettaglio è in `docs/contesto/07-procedure.md`. In breve:

1. **Apri.** Lo stato è già in contesto; leggi il backlog
   (`docs/contesto/04-backlog.md`). `git fetch` e verifica che `origin/main`
   sia dove lo stato dice; se no, aggiorna prima lo stato.
2. **Branch** `task/<ambito>-<slug>` da `main`. Mai lavorare su `main`.
3. **Fai** un task per volta, nell'ambito dichiarato. Un'immagine che non c'è
   è un `MediaPlaceholder` con il brief in `src/lib/media.ts`.
4. **Verifica.** `npm test`. Se la modifica si vede, controllala nel browser
   (dev server "peak" in `.claude/launch.json`, http://localhost:5173) e
   rigenera gli screenshot toccati (`npm run docs:screens`).
5. **Documenta nello stesso commit**: una voce in `CHANGELOG.md`;
   `docs/contesto/01-stato.md`; il task in `04-backlog.md`; se c'è una scelta,
   `03-decisioni.md`; il log di sessione in `docs/contesto/sessioni/`. Se
   cambia il sistema, anche il documento di dominio in `docs/0x-*.md`.
6. **Versione** in `package.json`, semver: patch per correzioni e documenti,
   minor per una sezione o un componente nuovo, major per un cambio di sistema.
7. **Commit** `<ambito>: <cosa>`, in italiano. Ambiti: `home`, `pdp`,
   `formula`, `ds`, `lab`, `pack`, `brand`, `token`, `copy`, `docs`, `infra`.
   Autore hello@noprob.agency (è nel `git config` locale). Push del branch.
8. **Merge.** Lo lancia il proprietario dal terminale, con il comando che
   Claude scrive nella risposta: i permessi della sessione bloccano il push su
   `main` perché pubblica in produzione.
   `git checkout main && git merge --ff-only task/<slug> && git push origin main && git checkout task/<slug>`
   Alla sessione dopo, Claude verifica il merge e chiude lo stato.

## Dove sta cosa

La mappa completa è in `docs/contesto/06-mappa.md`. I punti d'ingresso:

- **Copy e dati di prodotto**: `src/lib/copy.ts`, unico posto. Claim e termini
  vietati: `src/lib/compliance.ts`.
- **Token**: `src/tokens/tokens.json` → `npm run tokens:build` → `tokens.css`.
  Tailwind li legge all'avvio: dopo un cambio si riavvia il dev server.
- **Brand**: `src/brand/` (Logo, Icon, Lockup, SymbolRise con `salita.css`,
  DotField, HandDot, DayDot, Grain; `paths.ts` con `SYMBOL_VARIANT`,
  `SYMBOL_GEOMETRY`, `SALITA_MOTION` e i wordmark in `wordmarks/`, dove
  `rund.json` resta fuori da git).
- **Componenti**: `src/components/`. Archetipi di sezione:
  `src/site/sections/`. Pagine: `src/pages/`, laboratori in `src/pages/lab/`.
- **Font lab**: `src/lib/fontlab.ts` (`?font=`, `?italic=0`, `?body=display`,
  `?ref=1`).
- **Documentazione di sistema**: `docs/00`–`10`. Contesto vivo:
  `docs/contesto/`. Registro delle modifiche: `CHANGELOG.md` (per commit);
  racconti per fase in `docs/CHANGELOG-v2.md` e `docs/CHANGELOG-v3.md`.
- **Script**: `scripts/` (token, contrasto, compliance, asset, vectorize,
  export pack e logo, screenshot, scheda del brand).

## Comandi

```bash
npm run dev                                   # dev server su :5173
npm test                                      # tutta la catena, verde prima di ogni commit
npm run docs:screens                          # screenshot in docs/screens (dev server acceso)
npm run export:pack -- arancia --busta        # busta | --stick | --retro --marked=12 | --neutro | --font=<id>
npm run assets:generate                       # logo, lockup, favicon (simbolo v7, favicon ambra)
npm run brand:vectorize -- --font-id=rund     # il wordmark della v1, solo in locale (Rund trial)
npm run brand:vectorize -- --font-id=nunito   # tracciato di un candidato OFL (--all, --download)
npm run docs:brand                            # rigenera docs/00 da src/lib/brand-overview.ts
```

## Cose che ingannano

- Chrome headless non stringe la finestra sotto i 500px e, con un'ancora
  nell'URL, rende vuota la pagina sotto la barra di vetro: finestre alte,
  niente ancore.
- Il pannello browser dell'app può essere nascosto: gli screenshot vanno in
  timeout. Chrome headless per le immagini, JavaScript per le misure.
- Tailwind non protesta per una classe fuori scala; `npm run check:utilities`
  sì (gira dentro `npm test`).
- Un heredoc chiuso male ingoia il file successivo: un file per heredoc.
- I commit escono con l'identità git del repo: `git config user.email` deve
  essere hello@noprob.agency.
- Il `Write` dell'editor rifiuta un file modificato da shell dopo l'ultima
  lettura: rileggere, oppure scrivere da shell.
