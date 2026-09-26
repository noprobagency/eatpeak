# 05 — Memo di progetto

I fatti da ricordare che non stanno nel codice né in git. Questo file è
importato da `CLAUDE.md`: corto, vero, aggiornato quando si scopre un fatto
nuovo. Niente segreti: token e password non si scrivono qui.

## Account e ambienti

| | |
|---|---|
| Repo | `noprobagency/eatpeak` su GitHub, remote `origin` via https |
| Account per commit e push | **hello@noprob.agency** = account GitHub `noprobagency`, loggato in `gh`. `user.email` locale del repo impostata; la globale della macchina è personale e non si usa |
| Vercel | team `noprobagency`, progetto `eatpeak`, id `prj_96iIFymDSEcim8MKccmPpz6A0Yrm` |
| Produzione | https://drinkpeak.vercel.app = `main`, deploy automatico a ogni push |
| Preview | `https://eatpeak-git-<branch>-noprobagency.vercel.app`, dietro il login del team (SSO). Da Claude si verifica lo stato con lo strumento Vercel `list_deployments`, non aprendo l'URL |
| Dev server | `.claude/launch.json`, configurazione "peak", `npm run dev` su http://localhost:5173 |
| Chrome headless | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, usato da `docs:screens` ed `export:pack` |

## Il proprietario e come lavora

- Parla e scrive in italiano. Le domande gli si fanno come testo nella
  risposta, mai con strumenti di dettatura.
- Chiede modifiche **una alla volta** e le vuole vedere online (preview o
  produzione). Le decisioni di brand le prende lui, sui laboratori.
- Vuole **un changelog per ogni modifica**, il versionamento e il contesto
  sempre pronto per una sessione nuova: da qui `docs/contesto/`.
- L'header lo rifà lui. Non si tocca.
- Il merge su `main` lo lancia lui dal terminale: i permessi della sessione di
  Claude bloccano il push su `main` come deploy in produzione. Il branch,
  invece, Claude lo pusha.

## Convenzioni

- Commit `<ambito>: <cosa>` in italiano; ambiti in `CLAUDE.md`.
- Una voce in `CHANGELOG.md` per commit, `package.json` in semver.
- Nel codice e nei documenti si cita il reference con la sigla **TLS** (il nome
  intero del sito contiene un termine che il linter vieta; vedi `docs/10`).
- Le citazioni di termini vietati nei documenti si chiudono tra
  `<!-- peak-compliance-ignore-start * — motivo -->` e
  `<!-- peak-compliance-ignore-end -->`; nel codice `// peak-compliance-ignore
  <termine> — motivo`. Sempre con il motivo.
- I placeholder di dati mancanti sono `[dal laboratorio]` via `<LabTag>`; gli
  esempi pubblici (recensioni, rating, stock) portano il tag "esempio".
- Gli screenshot dei siti reference stanno in `docs/references/` e non si
  committano; gli screenshot del sito in `docs/screens/` sì.

## Trappole già incontrate

- Chrome headless non scende sotto i 500px di larghezza e rende vuota una
  pagina scorsa sotto la barra di vetro se l'URL ha un'ancora.
- Il pannello browser dell'app può essere nascosto: screenshot in timeout;
  misure via JavaScript, immagini via Chrome headless.
- Tailwind legge i token all'avvio: dopo `tokens:build` si riavvia il dev
  server. Una classe fuori scala non genera CSS e non protesta:
  `check:utilities` la trova.
- Un heredoc chiuso male ingoia il file successivo. Un file per heredoc.
- `<foreignObject>` in un SVG contamina la tela di Chrome: negli export si
  usano solo forme inline.
- Il classificatore dei permessi blocca anche script che *parlano* di merge e
  push su `main`, non solo i comandi: le note su questo tema si scrivono con
  l'editor, non con uno script.
- **Il repo GitHub è pubblico.** I font in licenza trial (Denim in
  `~/Downloads/Denim Collection`, Rund in `v1/public/fonts/`) e il tracciato
  che ne deriva (`src/brand/wordmarks/rund.json`) restano fuori da git: in
  locale si vedono, su Vercel no. Dopo un clone vanno rimessi a mano
  (`assets/fonts/README.md`) e il dev server va riavviato.
<!-- peak-compliance-ignore-start focus — citazione del termine vietato per spiegare la regola, non un uso -->
- Il linter di compliance vieta anche "focus" nei commenti: per la tastiera si
  scrive "anello della tastiera" o `:focus-visible` (i selettori passano).
<!-- peak-compliance-ignore-end -->
- Se la 5173 è occupata dal dev server di un'altra sessione, si usa una
  configurazione su un'altra porta e `npm run docs:screens -- --url=...`.
- Il pannello browser nascosto ferma le animazioni CSS a 0 ms: per vedere una
  transizione si fa uno screenshot (forza il rendering) o si usa Chrome
  headless via CDP (con Node 20 serve `node --experimental-websocket`).
- Stessa causa, trappola peggiore: **con il pannello nascosto
  `requestAnimationFrame` non scatta mai**. Lo scorrimento alle ancore di
  `App.tsx` passa da un rAF, quindi misurato da lì sembra rotto quando non lo
  è. Si verifica facendo prima uno screenshot (forza il rendering) e poi la
  misura. Chrome headless non serve: con un'ancora nell'URL rende la pagina
  vuota.
- `StickyAddToCart` sulla PDP e sul design system è fissato in basso: negli
  screenshot a finestra alta l'ultima riga di pixel non è mai il fondo della
  pagina. Per ritagliare il footer conviene chiedere al browser la posizione
  di `<footer>` e tagliare su quella, non cercare l'ultimo pixel colorato.
