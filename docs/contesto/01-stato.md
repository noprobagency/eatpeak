# 01 — Stato del progetto

Aggiornato il **2026-09-26**, sessione "setup del contesto", branch
`task/setup-contesto`. Questo file è importato da `CLAUDE.md`: resta corto e
resta vero. Si aggiorna a ogni commit.

## Dove siamo

| | |
|---|---|
| Versione | **3.0.1** in `package.json` (3.0.0 è quella in produzione) |
| `main` | `f8378bd` "v3: pulizia e documentazione", in produzione su https://drinkpeak.vercel.app (deploy Vercel READY) |
| Branch aperti | `task/setup-contesto`: questo setup, in attesa del merge del proprietario |
| Branch mergiati | `ds-v2`, `v3-home-pdp`: si possono cancellare, in locale e su origin |
| Header | del proprietario, in rifacimento per conto suo. Non toccare |
| Test | `npm test` verde su `main` e sul branch |
| Identità git | `user.email` locale = hello@noprob.agency (dal 26/09); i commit precedenti sono di west-marney |

## Cosa c'è, oggi (3.0)

- **Home H1–H15** e **PDP P1–P14** ricostruite sui reference (`docs/10`); le
  fotografie sono `MediaPlaceholder` con il brief.
- **Formula**, **Design system** (dieci sezioni + dettagli tecnici),
  **Prototipi** con la shot list, e quattro **laboratori**: font, simbolo,
  sezioni, pack.
- **Sistema 3.0**: cacao al posto del nero; profondi arancia 600 e lime 700;
  i pallini (simbolo, griglia, retino; geometrici e a mano); vetro sopra il
  colore; grana 3–5%; sei archetipi di sezione; font lab con sette candidati
  e Nunito di default; simbolo V5 dietro `SYMBOL_VARIANT`; pack con la frutta
  placeholder, il Neutro e il retro con i trenta cerchi.
- **Dati**: prezzi da `PRICE_TIERS` (Inizio 32 €, Abitudine 59 €, Rituale
  Completo 85 € preselezionato); valori di composizione `[dal laboratorio]`;
  recensioni, rating e stock sono esempi con il tag.

## Decisioni aperte, del proprietario

1. **Il font**: `#/lab/font`, scorecard. Default Nunito finché non decide.
2. **Il simbolo**: `#/lab/simbolo`, V1–V6, V5 proposta.
3. **Il fondo del rituale (H6)**: lime 700 com'è, oppure carta con i punti
   arancia.

Il dettaglio è in `03-decisioni.md`, la procedura per applicarle in
`07-procedure.md`.

## In corso e prossimo

- Merge di `task/setup-contesto` su `main` (comando in `07-procedure.md`).
- L'header, per conto del proprietario.
- Le 13 fotografie con Higgsfield: shot list in `#/prototipi`, brief in
  `src/lib/media.ts`.
- Il resto è in `04-backlog.md`, per area.

## Cosa non fare adesso

- Non mergiare su `main` da Claude: i permessi lo bloccano, lo fa il
  proprietario con il comando scritto nella risposta.
- Non toccare l'header. Non scegliere font, simbolo o fondo del rituale.
- Non inventare valori del laboratorio, recensioni o numeri.
