# 01 — Stato del progetto

Aggiornato il **2026-09-26**, sessione "piazza pulita", branch
`task/ds-radice`. Questo file è importato da `CLAUDE.md`: resta corto e
resta vero. Si aggiorna a ogni commit.

## Dove siamo

| | |
|---|---|
| Versione | **3.3.1** in `package.json` (3.3.0 è quella su `main` e in produzione) |
| `main` | `2f25a4c` "ds: piazza pulita — la radice è il design system", in produzione su https://drinkpeak.vercel.app (deploy Vercel READY): l'indirizzo apre sul design system. Il merge l'ha lanciato il proprietario (INFRA-08, chiusa) |
| Branch aperti | `task/ds-radice`: mergiato, resta solo per la chiusura dello stato (3.3.1) |
| Branch mergiati | `ds-v2`, `v3-home-pdp`, `task/setup-contesto`, `v3-ambra`, `task/ds-footer-panel`, `task/ds-radice`: si possono cancellare, in locale e su origin (INFRA-02) |
| Header | del proprietario. Non toccato: dalla 3.3 compare solo sulle tre pagine del sito, e il suo logo punta alla radice, che ora è il design system (HEADER-04) |
| Test | `npm test` verde sul branch |
| Identità git | `user.email` locale = hello@noprob.agency; i commit precedenti al 26/09 sono di west-marney |

## Cosa c'è, oggi (3.3, su `main` e in produzione)

- **Colore**: il brand è l'**ambra** `#FFAE34` (fondi, sopra solo cacao 900)
  con il profondo **ambra 700** `#A04F06` (punti, simbolo, link, testo brand).
  Arancia e lime restano i colori-gusto del pack.
- **Simbolo**: quattro punti a montagna (V7); nell'header la **salita** a 36°
  e poi il wordmark. Favicon ambra con i punti cacao, manifest `#FFAE34`.
- **Wordmark**: quello della **v1** (Rund Display Black), bianco o ambra.
- **Font**: **Denim** (basic) per tutto il testo, titoli a 700.
- **Trial**: Denim e Rund sono in licenza trial. Stanno **solo in locale**
  (file e tracciato fuori da git). Su Vercel, preview e produzione, il sito
  mostra i ripieghi: Nunito/Inter/Fraunces e il wordmark in Gabarito 900.
- **Struttura (nuova, 3.3)**: la **radice `#/` è il design system**, ed è la
  home. Il sito simulato scende a `#/sito` (più `#/prodotto` e `#/formula`)
  ed è l'unico gruppo che mostra l'**header**. Prototipi e quattro laboratori
  restano dov'erano. Le rotte vecchie sono alias: niente si rompe. Il
  **footer è l'indice del progetto** — quattro liste (Il sistema con le
  undici sezioni, Laboratori, Il sito, Aiuto), contatti, informative, riga
  legale — ed è uguale su ogni pagina. Regola: se una pagina o una sezione
  non ha il suo link lì, non la trova nessuno.
- **Footer (forma, dalla 3.2)**: awenlab.com — un **pannello staccato** in
  ambra 400, raggio 40px con 16px di carta attorno; a sinistra lockup,
  sign-off, claim autorizzati e due cerchi social; a destra tre liste e la
  riga dei contatti; sotto avvertenze, informative e riga legale con la firma
  dello studio. Tutto il testo in cacao 900 pieno (D28). Il wordmark enorme
  con il retino (H3) è uscito dal footer e non ha ancora un posto (D29).
- Home del sito H1–H15 e PDP P1–P14 sui reference, con l'hero in ambra; le fotografie
  sono `MediaPlaceholder` con il brief. Laboratori font, simbolo (archivio
  V0–V6), sezioni, pack.
- **Dati**: prezzi da `PRICE_TIERS`; valori di composizione
  `[dal laboratorio]`; recensioni, rating e stock sono esempi con il tag;
  contatti e dati d'impresa del footer sono segnaposto in parentesi quadre.

## Decisioni aperte, del proprietario

1. **Il wordmark su chiaro**: ambra 400 com'è o ambra 700 (BRAND-05).
2. **Il lockup sull'ambra**: simbolo cacao e parola bianca, o tutto bianco
   (BRAND-06).
3. **Il fondo del rituale (H6)**: lime 700 com'è, oppure carta con i punti.
4. **Dove va il wordmark con il retino**, uscito dal footer (D29, DS-04).
5. **I contatti veri del footer**: numero, indirizzi, profili social, pagine
   di servizio (DS-05).
6. **Le licenze**: Denim web (LIC-01), Rund Display Black desktop (LIC-02).
7. **Lo step packaging**: colori-gusto e wordmark del Neutro (PACK-05).

7. **Il logo dell'header**: punta alla radice, che ora è il design system.
   Va portato a `to('/sito')`, ma l'header è suo (HEADER-04).

Il dettaglio è in `03-decisioni.md` (D21–D32), la procedura in
`07-procedure.md`.

## In corso e prossimo

- Niente in corso. Senza le licenze la produzione mostra i ripieghi
  (Nunito/Inter/Fraunces, wordmark Gabarito 900), non Denim e Rund.
- L'header, per conto del proprietario.
- Le 13 fotografie con Higgsfield: shot list in `#/prototipi`, brief in
  `src/lib/media.ts`.
- Il resto è in `04-backlog.md`, per area.

## Cosa non fare adesso

- Non mergiare su `main` da Claude: i permessi lo bloccano, lo fa il
  proprietario con il comando scritto nella risposta.
- Non committare i font trial né il tracciato `rund.json`: il repo è pubblico.
- Non toccare l'header, nemmeno per il logo che punta alla radice.
- Non inventare valori del laboratorio, recensioni, numeri o contatti.
