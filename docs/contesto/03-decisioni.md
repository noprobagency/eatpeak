# 03 — Registro delle decisioni

Ogni decisione con la data, il perché, le alternative scartate e lo stato.
Le decisioni **aperte** sono del proprietario: Claude prepara le alternative
nei laboratori e non sceglie. Quando una decisione aperta si chiude, si
aggiorna la riga e si applica la procedura in `07-procedure.md`.

| # | Data | Decisione | Perché | Alternative scartate | Stato |
|---|---|---|---|---|---|
| D01 | 2026-09-26 | La 1.0 va in `v1/`, intera ed eseguibile; la radice ospita la 2.0 | Tenere la storia senza che pesi sul sistema | Cancellare la 1.0; tenerla mescolata | chiusa |
| D02 | 2026-09-26 | Il progetto è un **sito simulato**, non uno showcase: Home, PDP, Formula, più le pagine di studio | Il sistema si prova solo dove deve funzionare | Solo showcase dei componenti | chiusa |
| D03 | 2026-09-26 | Un solo posto per il copy (`copy.ts`) e un linter di compliance su tutto il sorgente e i documenti | Integratore UE: un claim sbagliato è un problema legale, non di stile | Controllo a mano | chiusa |
| D04 | 2026-09-26 | Header sul modello Nazzi (annunci + vetro, vertice che ruota); **da lì in poi l'header è del proprietario** | Lo vuole rifare lui | — | chiusa |
| D05 | 2026-09-26 | **Niente nero.** Testo in cacao 900/600/500; superfici scure = arancia 600 e lime 700; l'inchiostro `#1B1A18` solo in stampa | Il nero fa farmacia; il cacao è caldo come il resto e regge 12,8:1 | Grigio neutro scuro; nero solo per i titoli | chiusa |
| D06 | 2026-09-26 | Il testo corrente non sta mai sui campi 500: cacao sul tint o bianco sul profondo | Cacao su arancia 500 = 3,72:1, non basta; bianco su 500 = 3,68:1 | Scurire l'arancia 500 | chiusa |
| D07 | 2026-09-26 | Pulsante primario bianco su **arancia 600**; pillola bianca con testo arancia 700 sui campi | 4,91:1 e resta un pieno del brand | Testo cacao su arancia 500 (2.0) | chiusa |
| D08 | 2026-09-26 | **Font lab** con sette candidati OFL, `?font=<id>` globale, default Nunito, wordmark vettorializzato per candidato. Titoli 700–800, mai 900 | Il 900 di Gabarito gridava; la scelta è del brand e va fatta vedendo Home e PDP | Decidere subito Nunito | **aperta**: il font lo sceglie il proprietario |
| D09 | 2026-09-26 | **Simbolo** in sei varianti (`SYMBOL_VARIANTS`), V5 proposta (crescendo con la punta miele), dietro `SYMBOL_VARIANT` | Tre punti uguali a triangolo ricordano Asana | Tenere il vertice della 2.0 | **aperta**: la variante la sceglie il proprietario |
| D10 | 2026-09-26 | Il **sistema a pallini**: simbolo, griglia, retino; punti geometrici e punti a mano; tre stati (da fare, fatto, oggi); sei regole anti-eccesso | Il punto conta i giorni: è il posizionamento reso visibile | Pallini solo decorativi | chiusa |
| D11 | 2026-09-26 | **Vetro solo sopra colore o immagine**, mai su carta; grana 3–5% sui campi | Il vetro su carta sparisce; sul colore dà materia | Vetro ovunque | chiusa |
| D12 | 2026-09-26 | Occhielli in display 600 e frase normale; mono solo per numeri e codici; una parola in corsivo per titolo | Il mono maiuscolo ovunque faceva "supplement tech" | Tenere il mono per le etichette | chiusa |
| D13 | 2026-09-26 | Sei archetipi di sezione e basta; mai due consecutivi uguali; un elemento che sborda per pagina | Ritmo e riconoscibilità | Sezioni libere | chiusa |
| D14 | 2026-09-26 | Pack con la frutta sovradimensionata (placeholder con brief), variante Neutro, retro con 30 cerchi da segnare | La frutta è il gusto; il retro è la prova della garanzia | Foto della frutta subito | chiusa |
| D15 | 2026-09-26 | Recensioni, rating e stock sono **esempi con il tag**; niente Kit Rituale (dopo il lancio); niente quiz; la garanzia si prova con la foto dei tre retri | Mai finti in pubblico | Recensioni "verosimili" senza tag | chiusa |
| D16 | 2026-09-26 | Home e PDP: struttura copiata al 100% dai reference (docs/10), testo riscritto, mai immagini o claim di terzi | Efficacia provata, senza rischi | Layout da zero | chiusa |
| D17 | 2026-09-26 | Il **fondo del rituale (H6)**: lime 700 proposto | Il lime è il secondo gusto e stacca dall'arancia dell'hero | Carta con i punti arancia | **aperta**: lo decide il proprietario |
| D18 | 2026-09-26 | La 3.0 va su `main` e in produzione (richiesta in chat, dopo che il prompt chiedeva di non mergiare) | Lo ha deciso il proprietario | Restare sulla preview | chiusa, merge lanciato da lui |
| D19 | 2026-09-26 | Commit e push sempre con hello@noprob.agency; `user.email` locale del repo impostata | Il repo è dell'agenzia | Rinominare i commit vecchi (solo se lo chiede) | chiusa |
| D20 | 2026-09-26 | **Il modo di lavorare**: branch `task/<ambito>-<slug>`, un task per volta, `npm test` verde, una voce in `CHANGELOG.md` per commit, semver in `package.json`, stato e backlog aggiornati nello stesso commit, il merge su `main` lo lancia il proprietario | Contesto sempre pronto per una sessione nuova; i permessi bloccano il push su `main` | Lavorare su `main` | chiusa |
