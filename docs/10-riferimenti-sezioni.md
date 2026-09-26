# 10 — Riferimenti delle sezioni

La mappa di Home e PDP: per ogni sezione il reference, l'URL, cosa è stato
copiato (struttura) e cosa va riscritto (copy). Le sezioni hanno l'attributo
`data-ref`: con `?ref=1` nell'URL (`/?ref=1#/`) compare l'etichetta in alto a
destra di ciascuna, "rif. Create · hero".

**Regola.** Dai reference si copia la **struttura al 100%**: ordine, gerarchia,
proporzioni, numero di elementi, tipo di interazione. Non si copiano immagini,
loghi e marchi (al loro posto `MediaPlaceholder` con il brief) né claim fuori
dalla compliance. Il testo è una bozza tradotta e adattata: **va riscritto**.

Gli screenshot dei siti sono in `docs/references/<brand>/`, fuori dal
versionamento. Dove un sito bloccava il crawler (HIIT mostra un popup, Create
carica il video) si è lavorato dalla descrizione del prompt.

<!-- peak-compliance-ignore-start * — il nome di un sito di terzi contiene un termine vietato: e' una citazione, non un uso -->

**Abbreviazioni.** `TLS` = The Longevity Store (`thelongevitystore.com`): nel
codice si usa la sigla, perché il nome intero contiene un termine che il linter
vieta.

<!-- peak-compliance-ignore-end -->

---

<!-- peak-compliance-ignore-start * — URL e nomi di siti di terzi, e citazioni dei claim che NON si copiano: non sono usi -->

## Homepage (`src/pages/Home.tsx`)

| # | Sezione | Archetipo | Reference | URL | Copiato | Da riscrivere |
|---|---|---|---|---|---|---|
| H1 | Hero campo arancia | A + F | Cure (hero), Dosys (pack gigante), Create (gerarchia + 3 spunte) | curehydration.com · dosys.co · trycreate.co | occhiello → H1 → sub → CTA + link → 3 spunte; pack a destra che sborda; card prezzo di vetro | H1, sub, CTA, spunte |
| H2 | Barra numeri | C | HIIT (striscia "5G CREATINE / …") | hiithydration.com.au | una riga di valori grandi, niente card | etichette |
| H3 | Statement | D | Create ("creatine was a chore" / "never miss a day") | trycreate.co, PDP | una frase manifesto, da sola | la frase |
| H4 | Il gesto in 3 passi | B / E | HIIT (blocco "01"), canvas (Apri. Versa. Bevi.), Create (how it works) | hiithydration.com.au · docs/references/input/canvas-pallini/Home.dc.html | 3 passi numerati + immagine grande; il terzo chiude | i tre passi |
| H5 | Ingredienti | E | HIIT ("five things that work"), TLS (apice numerato + nota) | hiithydration.com.au · thelongevitystore.com/products/longevity-complete | righe a tutta larghezza, dose a destra, apici e note | titolo, ruoli |
| H6 | Il rituale dei 30 punti | A (lime 700) | canvas (Il rituale dei 30 punti), Create (never miss a day) | Home.dc.html | la griglia di 30 punti che si riempie, il contatore | H2, didascalie |
| H7 | Gusti | A (due tile) | Cure (griglia gusti), Create ("Find your flavor", descrittori) | curehydration.com · trycreate.co | due tile grandi, colore pieno + frutta + busta, nome + descrittore + CTA | descrittori |
| H8 | Confronto | E (tabella) | Create (vs tables), Dosys (vs the rest) | trycreate.co · dosys.co | tabella a 3 colonne, righe sì/no, costo al giorno | righe |
| H9 | La co-fondatrice | B | TLS (advisor), Dosys (video per tema), Cure (advisors) | thelongevitystore.com · dosys.co · curehydration.com | ritratto + ruolo + citazione; 3 video brevi per tema | citazione, titoli dei video |
| H10 | Recensioni | F | HIIT (nome e quartiere), TLS (età) | hiithydration.com.au · thelongevitystore.com | recensioni brevi con identità, scelte per obiezione; chip di vetro sulla foto | tutte: sono esempi con il tag |
| H11 | I nostri standard | C / E | Blueprint (Our Standards, COAs), Create (Quality Promise) | blueprint.bryanjohnson.com/pages/our-standards · trycreate.co | promessa di trasparenza + documento del lotto | il testo |
| H12 | Offerta | C + tier | Dosys (prezzo al giorno), TLS (modulo), Create (select your size), canvas (più punti, meno al giorno) | dosys.co · trycreate.co · Social.dc.html | tier impilati, prezzo al giorno grande, preselezione, micro-rassicurazioni, stock a punti | micro-copy |
| H13 | Garanzia | E | Scandinavian Biolabs (money-back in 3 steps) | scandinavianbiolabs.com/pages/money-back-guarantee | 3 passi + 3 condizioni + link | passi e condizioni |
| H14 | FAQ | E | Dosys (FAQ, il tono) | dosys.co | risposte brevi, un'idea per risposta; pallino che si riempie | risposte |
| H15 | Footer | A | awenlab (pannello staccato con i raggi grandi) | awenlab.com | pannello ambra, due colonne, informative e riga legale | note legali |

## PDP (`src/pages/Product.tsx`)

| # | Sezione | Reference | Copiato | Da riscrivere |
|---|---|---|---|---|
| P1 | Breadcrumb | — | invariato | — |
| P2 | Galleria | Create (PDP: immagine grande + miniature, badge), TLS | immagine su tint con la frutta, miniature busta/stick/gesto/dentro/retro/co-fondatrice, badge 30 giorni, switch gusto di vetro | — |
| P3 | Buy box | Create (1. flavor, 2. size, prezzo al giorno, riga di fiducia), GrowthRock (stelle vicino al titolo) | step numerati, micro-descrizione del gusto, prezzo al giorno per taglia, riga di fiducia | micro-copy |
| P4 | È per me? | Create ("Is this right for me?" per profilo) | 3 profili a schede, stessa dose, claim per profilo | i tre profili |
| P5 | Barra numeri | HIIT | come H2, compatta | — |
| P6 | Tab | — | restyle senza mono, sottolineatura a pallini | — |
| P7 | Ingredienti + tabella | HIIT (PDP: uno per uno con dose), TLS (apici) | le righe di H5 + tabella | — |
| P8 | 30/60/90 giorni | Create ("2–3 weeks", "no loading phase") | riga di 90 micro-punti in 3 blocchi, didascalie sul gesto | didascalie |
| P9 | Confronto | Create, Dosys | H8 compatto | — |
| P10 | Co-fondatrice + video | TLS, Dosys | H9 compatto | — |
| P11 | Recensioni con filtri | HIIT, TLS | griglia con filtri a pillola (età · profilo · gusto), tag esempio | — |
| P12 | Garanzia | Scandinavian Biolabs | come H13 | — |
| P13 | FAQ + prima di ordinare | Dosys | accordion restyle | — |
| P14 | Sticky add-to-cart | Create (sticky ATC mobile) | barra di vetro staccata dai bordi: gusto · tier · prezzo/giorno · CTA | — |

---

## Cosa non si copia mai

- Immagini, video, illustrazioni e loghi di terzi.
- Rating, numero di recensioni, percentuali di soddisfazione: nel sito non ce
  ne sono di veri, quindi non ce ne sono. Dove servono, esempi con il tag.
- Claim fuori dalla compliance ("recover faster", "cognition", "longevity"): il
  linter è verde per costruzione.
- Attacchi ai concorrenti con nome: il confronto dice "creatina in barattolo"
  e "gummies", mai un marchio.

<!-- peak-compliance-ignore-end -->
