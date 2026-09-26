# 2026-09-26 — Il footer a pannello

**Versione** 3.2.0 · **branch** `task/ds-footer-panel` (da `main`, che nel
frattempo ha ricevuto la 3.1) · in attesa di merge.

**Richiesta.** Del proprietario, in chat: «Cambiamo drasticamente il footer.
Mettiamo quello di awenlab. Però con contenuti, logo, palette di peak», con
incollato il markup del piede di awenlab.com.

**Fatto.**
- Letto il riferimento dal vivo (stili calcolati, non solo il markup): il
  piede di awenlab è un **pannello staccato**, raggio 40px, con 16px di carta
  attorno; dentro, due colonne (marchio 1,4fr / liste 2fr, gap 64px), titoli
  di lista a 11px maiuscoli con crenatura 0,12em e un filo sotto, cerchi
  social da 40px con il bordo a 1px, e una chiusura in tre righe:
  informative, riga legale, firma dello studio.
- `src/site/SiteFooter.tsx` riscritto su quella forma, con i contenuti peak:
  lockup a 32px su fondo brand, il sign-off in `type-display-sm`, i due claim
  autorizzati nello stesso blocco (articolo 10(3)), l'aggancio di pubblico,
  due cerchi social da 44px (bersaglio touch); a destra Il sito, Aiuto, Lo
  studio (dalle costanti di `routes.ts`) e la riga larga dei contatti; sotto
  l'avvertenza "integratore alimentare", sette informative e la riga legale
  con il badge `noprob.agency` in testo.
- Colore: **niente pannello scuro**. Il riferimento è blu notte; peak ha
  l'ambra, e un fondo cacao 900 sarebbe stato un fondo nuovo fuori dalle
  regole della 3.1. Pannello ambra 400 con la grana, testo tutto cacao 900.
- Contrasto: i grigi attenuati del riferimento non si possono copiare. Cacao
  900 al 75% su ambra 400 fa 4,27:1 e al 70% fa 3,79:1, sotto la soglia; al
  100% fa 7,40:1. La gerarchia si fa con corpo, peso e crenatura (D28).
  L'opacità resta solo sui bordi.
- Esce dal footer il wordmark a tutta larghezza con il retino (H3,
  `<WordmarkHalftone />`): il riferimento non ha un marchio grande. Il
  componente resta in `src/brand/` e per ora non lo usa nessuno (D29, DS-04).
- Segnaposto: contatti (`WhatsApp [numero]`, `ciao@[dominio]`,
  `assistenza@[dominio]`), social e pagine di servizio riportano in home. Il
  sito è dimostrativo e non si inventano numeri (DS-05).

**Trovato per strada.** `origin/main` era già a `811242c`: il proprietario
aveva lanciato il merge di `v3-ambra`, mentre `01-stato.md` diceva ancora
`f8378bd`. Stato e backlog corretti (INFRA-01 e INFRA-06 chiuse).

**Verificato.** `npm test` verde (typecheck, compliance, contrasto, build,
utility). Footer guardato a 1440px e a 375px: nessun trabocco orizzontale,
il pannello mobile impila le liste e resta leggibile. `npm run docs:screens`
rigenerato.

**Aperto.** DS-04 (dove va il retino del wordmark), DS-05 (i contatti veri),
INFRA-07 (il merge).
