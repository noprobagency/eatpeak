# 2026-09-26 — L'header sul modello Nazzi

**Versione** 2.1.0 (retroattiva) · **commit** `c19c716` su `main`.

**Richiesta.** "Modifiche una a una": l'header come quello di Farmacia Nazzi
(screenshot e HTML incollati): barra annunci sopra, barra di vetro sotto, il
logo come i tre pallini arancioni che ruotano al passaggio e rivelano il
wordmark più piccolo; colori e testi di peak.

**Fatto.** `src/site/SiteHeader.tsx` e `site-header.css`: due strisce fisse
staccate dai bordi, gli annunci con le prove del prodotto che scorrono
(arancia 600 al 90%, testo bianco 4,91:1), la barra di vetro, il vertice che
ruota. Pubblicato su drinkpeak.vercel.app.

**Da qui in poi.** L'header è del proprietario: lo rifà lui, Claude non lo
tocca e riporta solo cosa cambia di riflesso via token e dati.
