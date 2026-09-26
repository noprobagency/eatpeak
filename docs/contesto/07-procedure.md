# 07 — Procedure

Le operazioni che non si fanno tutti i giorni, scritte una volta. Se una
procedura cambia, cambia qui.

## Aprire una sessione

1. `CLAUDE.md` ha già caricato `01-stato.md` e `05-memo-progetto.md`.
2. `git fetch origin` e confronto: `git log --oneline -1 origin/main` deve
   essere il commit che lo stato dice in produzione. Se il proprietario ha
   mergiato un branch nel frattempo, si chiude quella riga dello stato e del
   backlog nel primo commit utile.
3. `git status` pulito? Branch giusto? `git config user.email` =
   hello@noprob.agency?
4. Si legge `04-backlog.md` e si sceglie un task, uno.

## Il ciclo di un task

```bash
git checkout main && git pull --ff-only
git checkout -b task/<ambito>-<slug>
```

1. Si fa il task, dentro l'ambito. Testo solo in `src/lib/copy.ts`.
2. `npm test` verde.
3. Se si vede: dev server acceso, controllo nel browser, e
   `npm run docs:screens` per rigenerare gli screenshot toccati (o un solo
   scatto con Chrome headless, vedi sotto).
4. Documentazione nello stesso commit:
   - `CHANGELOG.md`: una voce sotto la versione corrente (o una versione
     nuova, se cambia);
   - `package.json`: la versione;
   - `docs/contesto/01-stato.md`: versione, branch, cosa cambia;
   - `docs/contesto/04-backlog.md`: il task chiuso, i task aperti da lui;
   - `docs/contesto/03-decisioni.md`, se si è deciso qualcosa;
   - `docs/contesto/sessioni/AAAA-MM-GG-<slug>.md`: il log della sessione;
   - il documento di dominio in `docs/0x-*.md`, se cambia il sistema.
5. `git add -A && git commit -m "<ambito>: <cosa>"` con la riga di
   attribuzione in coda, poi `git push -u origin task/<ambito>-<slug>`.
6. Nella risposta: cosa è cambiato, la preview, e il comando di merge.

## Il merge su `main` (lo lancia il proprietario)

Claude non può: i permessi della sessione bloccano il push su `main` perché
pubblica in produzione. Il comando, pronto da incollare:

```bash
git checkout main && git merge --ff-only task/<slug> && git push origin main && git checkout task/<slug>
```

Se non è un fast-forward (main è andato avanti), prima sul branch:
`git merge main`, si risolve, `npm test`, push del branch, poi il comando
sopra. Dopo il merge, Vercel pubblica da solo; lo stato si verifica con lo
strumento Vercel `list_deployments` (target `production`).

## Versione e tag

- `package.json` è la verità: patch (3.0.x) per correzioni e documenti, minor
  (3.x.0) per una sezione o un componente nuovo, major per un cambio di
  sistema.
- Il tag lo mette il proprietario dopo il merge, sui rilasci che contano:
  `git tag v3.0.0 f8378bd && git push origin v3.0.0`.

## Screenshot

```bash
npm run docs:screens                 # tutti, dev server acceso
```

Uno solo, a mano:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=8000 --window-size=1440,9000 --screenshot=docs/screens/home-full.png "http://localhost:5173/#/"
```

Niente ancore nell'URL, finestre alte invece dello scroll, minimo 500px di
larghezza. I parametri (`?font=`, `?ref=1`) stanno prima dell'hash.

## Quando arriva una decisione del proprietario

**Il font (BRAND-01).** `DEFAULT_FONT_ID` in `src/lib/fontlab.ts`; il
default del `font.display` in `tokens.json` e `npm run tokens:build`;
`npm run assets:generate` (i lockup e i wordmark statici usano il default);
`npm run docs:screens`; docs 02 e 03; D08 chiusa in `03-decisioni.md`.

**Il simbolo (BRAND-02).** `SYMBOL_VARIANT` in `src/brand/paths.ts`;
`npm run assets:generate` (favicon, lockup, PNG, `public/`); screenshot; docs
03; D09 chiusa.

**Il fondo del rituale (BRAND-03).** In `Home.tsx` il `tone` del
`ColorField` di H6: `lime-deep` oppure `page` con i punti arancia (i colori
dei `DayDot` seguono da soli); screenshot; docs 09; D17 chiusa.

## Quando arrivano le fotografie (FOTO-01)

1. Il file in `public/media/<id>.<ext>`.
2. In `src/lib/media.ts` lo scatto prende `src: '/media/<id>.<ext>'`.
3. Niente altro: `MediaPlaceholder` mostra la foto. Regole in `docs/09`:
   mai una palestra, su carta o dentro un campo, un solo colore-gusto per
   scatto.

## Quando arrivano i valori del laboratorio (PACK-02)

In `src/lib/copy.ts`: `INGREDIENTS[].amount`, `NUTRITION_ROWS`, gli aromi in
`FLAVORS`. I `[dal laboratorio]` spariscono da soli dove il valore c'è. Se la
vitamina D3 supera il 15% dei VNR, i claim sulla vitamina D si possono
stampare; altrimenti restano fuori dal pack. Poi `BustaBack`, `PackBack`,
docs 08.

## Quando arrivano le recensioni vere (PDP-01)

In `REVIEWS` si tolgono le voci di esempio e si mettono quelle vere con
`example: false` (o senza il campo): il tag "esempio" sparisce. Il testo va
scelto: mai frasi sul corpo, il linter le blocca. Stesso principio per il
rating e per lo stock del lotto (`StockCounter`).

## Aggiungere un componente, una sezione, un gusto

- **Componente**: `docs/04-components.md`, "Aggiungere un componente".
- **Sezione**: solo con uno dei sei archetipi (`src/site/sections/`), con il
  `data-ref` del reference, una riga in `docs/10` e in `docs/09`.
- **Gusto**: una riga in `FLAVORS` (`copy.ts`), i colori-gusto in
  `tokens.json`, la frutta in `pack/Fruit.tsx`. Cambia ovunque da solo.

## Se qualcosa non torna

- `npm test` rosso su compliance: leggere il termine e il file; se è una
  citazione, chiudere tra i commenti di soppressione con il motivo; se è un
  uso, riscrivere.
- Contrasto rosso: una coppia dichiarata valida è scesa sotto la soglia.
  Non si abbassa la soglia: si cambia il colore o la coppia.
- Utility fuori scala: `npm run check:utilities` dice il file e la riga.
- Il dev server non vede un token nuovo: riavviarlo.
