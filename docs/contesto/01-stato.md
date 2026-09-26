# 01 — Stato del progetto

Aggiornato il **2026-09-26**, sessione "ambra, quattro punti, salita", branch
`v3-ambra`. Questo file è importato da `CLAUDE.md`: resta corto e resta vero.
Si aggiorna a ogni commit.

## Dove siamo

| | |
|---|---|
| Versione | **3.1.0** in `package.json` (3.0.0 è quella in produzione) |
| `main` | `f8378bd` "v3: pulizia e documentazione", in produzione su https://drinkpeak.vercel.app (deploy Vercel READY) |
| Branch aperti | `v3-ambra`: la 3.1, aperto da `task/setup-contesto` (3.0.1). Un solo merge porta tutti e due |
| Branch mergiati | `ds-v2`, `v3-home-pdp`: si possono cancellare, in locale e su origin |
| Header | del proprietario. Nella 3.1, su sua richiesta, cambiano solo il simbolo (la salita) e la striscia annunci (ambra, testo cacao) |
| Test | `npm test` verde sul branch |
| Identità git | `user.email` locale = hello@noprob.agency (dal 26/09); i commit precedenti sono di west-marney |

## Cosa c'è, oggi (3.1, sul branch)

- **Colore**: il brand è l'**ambra** `#FFAE34` (fondi, sopra solo cacao) con il
  profondo **ambra 700** `#A04F06` (punti, simbolo, link, testo brand).
  Arancia e lime restano i colori-gusto del pack.
- **Simbolo**: quattro punti a montagna (V7); nell'header la **salita** a 36°
  e poi il wordmark. Favicon ambra con i punti cacao, manifest `#FFAE34`.
- **Wordmark**: quello della **v1** (Rund Display Black), bianco o ambra.
- **Font**: **Denim** (basic) per tutto il testo, titoli a 700.
- **Trial**: Denim e Rund sono in licenza trial. Stanno **solo in locale**
  (file e tracciato fuori da git). Su Vercel, preview e produzione, il sito
  mostra i ripieghi: Nunito/Inter/Fraunces e il wordmark in Gabarito 900.
- Home H1–H15 e PDP P1–P14 sui reference, con l'hero e il footer in ambra; le
  fotografie sono `MediaPlaceholder` con il brief. Laboratori font, simbolo
  (archivio V0–V6), sezioni, pack.
- **Dati**: prezzi da `PRICE_TIERS`; valori di composizione
  `[dal laboratorio]`; recensioni, rating e stock sono esempi con il tag.

## Decisioni aperte, del proprietario

1. **Il wordmark su chiaro**: ambra 400 com'è o ambra 700 (BRAND-05).
2. **Il lockup sull'ambra**: simbolo cacao e parola bianca, o tutto bianco
   (BRAND-06).
3. **Il fondo del rituale (H6)**: lime 700 com'è, oppure carta con i punti.
4. **Le licenze**: Denim web (LIC-01), Rund Display Black desktop (LIC-02).
5. **Lo step packaging**: colori-gusto e wordmark del Neutro (PACK-05).

Il dettaglio è in `03-decisioni.md` (D21–D26), la procedura in
`07-procedure.md`.

## In corso e prossimo

- Merge di `v3-ambra` su `main` (INFRA-06): lo lancia il proprietario. Senza
  le licenze la produzione mostra i ripieghi, non Denim e Rund.
- L'header, per conto del proprietario.
- Le 13 fotografie con Higgsfield: shot list in `#/prototipi`, brief in
  `src/lib/media.ts`.
- Il resto è in `04-backlog.md`, per area.

## Cosa non fare adesso

- Non mergiare su `main` da Claude: i permessi lo bloccano, lo fa il
  proprietario con il comando scritto nella risposta.
- Non committare i font trial né il tracciato `rund.json`: il repo è pubblico.
- Non toccare l'header oltre il simbolo e la striscia annunci.
- Non inventare valori del laboratorio, recensioni o numeri.
