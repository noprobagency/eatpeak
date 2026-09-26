# 09 — Il sito

La 3.0 è **un sito simulato, umanizzato**: la home e la pagina prodotto sono
ricostruite sezione per sezione sui reference ([10 — Riferimenti delle
sezioni](10-riferimenti-sezioni.md)), con le fotografie ancora da fare al loro
posto. Nessun ordine viene evaso, e il piede di pagina lo dice.

Il routing è sull'hash, senza dipendenze (`src/lib/routes.ts`). Un'ancora si
scrive dopo un secondo cancelletto: `#/#come-funziona`. I parametri stanno
prima dell'hash: `/?font=nunito&ref=1#/`.

| Rotta | Pagina | Cosa |
|---|---|---|
| `#/` | **Home** | H1–H15, sotto |
| `#/prodotto` | **Prodotto (PDP)** | P1–P14, sotto |
| `#/formula` | **La formula** | CreaVida™ ingrediente per ingrediente con i claim autorizzati, il protocollo, le risposte della co-fondatrice, la tabella |
| `#/design-system` | **Design system 3.0** | La scheda del brand in dieci sezioni, i laboratori, i dettagli tecnici chiusi in fondo |
| `#/prototipi` | **Prototipi** | Busta e stick dai componenti, la shot list per Higgsfield, l'archivio della 1.0 |
| `#/lab/font` | **Laboratorio font** | Sette candidati per titoli e wordmark, la scorecard da compilare |
| `#/lab/simbolo` | **Laboratorio simbolo** | Le sei varianti del vertice, a quattro misure e su quattro fondi |
| `#/lab/box` | **Laboratorio sezioni** | I sei archetipi, uno sotto l'altro, e la stessa sequenza a 390px |
| `#/lab/pack` | **Laboratorio pack** | Le tre varianti della busta, i retri, gli stick |

Le rotte della 1.0 (`#/showcase`, `#/landing`, `#/product`) restano come alias.

---

## Gli interruttori nell'URL

| Parametro | Cosa fa |
|---|---|
| `?font=<id>` | Cambia il font display e il wordmark in tutto il sito: `gabarito`, `nunito` (default), `mplus`, `fredoka`, `baloo`, `rubik`, `varela`. Resta in `localStorage`. |
| `?italic=0` | Spegne la parola in corsivo nei titoli, per confrontare. |
| `?body=display` | Mette anche il testo corrente nel font display. |
| `?ref=1` | Mostra in alto a destra di ogni sezione l'etichetta del reference (`data-ref`). |

---

## La navigazione

**Header** — `src/site/SiteHeader.tsx` e `site-header.css`, fuori da questo
lavoro (barra annunci arancia + barra di vetro, il simbolo che ruota e rivela
il wordmark). Riceve di riflesso i token della 3.0: il wordmark nel font
attivo, il simbolo V5 con la punta miele, il testo cacao.

**Footer** (`SiteFooter.tsx`), forma awenlab dalla 3.2: non una fascia a tutta
larghezza ma un **pannello staccato** in ambra 400, raggio 40px (`rounded-2xl`)
e un margine di carta di 16px attorno, che chiude la pagina come una scheda.
Dentro, due colonne: a sinistra il lockup, il sign-off in display, i claim
autorizzati nello stesso blocco (articolo 10(3)) e i due cerchi social; a
destra tre liste (Il sito, Aiuto, Lo studio) con il titolo in etichetta
maiuscola e il filo sotto, e la riga larga dei contatti con i segni. Sotto,
l'avviso "integratore alimentare", la riga delle informative e la riga legale
con la firma dello studio. Tutto il testo è cacao 900 (7,4:1): sull'ambra i
grigi e il bianco non reggono, e per questo la gerarchia si fa con corpo,
peso e crenatura, non con l'opacità. Il wordmark a tutta larghezza con il
retino (H3, `<WordmarkHalftone />`) esce dal footer e resta senza posto: è una
decisione aperta.

---

## L'ordine della home (H1–H15)

| # | Sezione | Archetipo | Cosa fa |
|---|---|---|---|
| H1 | Hero | A campo arancia 600 + F | occhiello, H1 con la parola in corsivo, sub, CTA a pillola bianca, tre prove; la busta che sborda nella sezione dopo; la card prezzo di vetro con lo stock (esempio) |
| H2 | Barra numeri | C | 3 g · D3 · 30 · 0, in mono grande |
| H3 | Statement | D | "La creatina funziona. *Il difficile* è prenderla ogni giorno." |
| H4 | Il gesto | B + E | tre passi numerati con il punto a mano, l'immagine grande |
| H5 | Ingredienti | E | righe a tutta larghezza, dose a destra, claim letterale sotto |
| H6 | Il rituale dei 30 punti | A lime 700 | trenta punti a mano che si riempiono allo scroll, il contatore di vetro |
| H7 | Gusti | A (due tile) | colore pieno, frutta, busta che sborda, chip di vetro col gusto, CTA |
| H8 | Confronto | E tabella | stick vs barattolo vs gummies, righe sì/no con `<DayDot>` |
| H9 | La co-fondatrice | B | ritratto, citazione, tre video per tema |
| H10 | Recensioni | F | foto ambiente + chip di vetro, ognuna con il tag esempio |
| H11 | Standard | C/E | la promessa di trasparenza, il documento del lotto |
| H12 | Offerta | C + tier | `<StockCounter>`, `<PriceTiers>` con i giorni a punti, CTA, note |
| H13 | Garanzia | E | tre passi a mano, tre condizioni |
| H14 | FAQ | E | `<Accordion>` con il punto che si riempie |
| H15 | Footer | A | pannello awenlab, vedi sopra |

Il fondo del rituale (H6) è lime 700 per proposta: l'alternativa è carta con i
punti arancia. È una delle tre decisioni aperte.

---

## La pagina prodotto (P1–P14)

| # | Sezione | Cosa fa |
|---|---|---|
| P1 | Breadcrumb | peak · descrittore |
| P2 | Galleria | immagine grande su tint con la frutta e il badge "30 giorni"; sei miniature (busta, stick, gesto, cosa c'è dentro, retro, co-fondatrice); lo switch gusto di vetro, flottante |
| P3 | Buy box | titolo, rating come esempio, i passi "1. Il gusto" e "2. Quanti giorni" (`<PriceTiers legend>`), CTA arancia 600 "Aggiungi · €", riga di fiducia con i punti, micro-copy, il claim con la nota |
| P4 | È per me? | tre profili a schede (`PROFILES`): stessa dose, claim autorizzato per profilo |
| P5 | Barra numeri | come H2, compatta |
| P6 | Tab | come si prende, cosa contiene, spedizione; sottolineatura a pallini, niente mono |
| P7 | Ingredienti + tabella | le righe di H5, `<IngredientPanel>`, il retro in un accordion |
| P8 | 30/60/90 giorni | tre blocchi da trenta micro-punti, si accendono con il tier scelto; didascalie sul gesto |
| P9 | Confronto | H8 compatto |
| P10 | Co-fondatrice + video | H9 compatto |
| P11 | Recensioni con filtri | pillole tutte · sotto i 45 · oltre i 45 · gusto; griglia, ogni card col tag esempio |
| P12 | Garanzia | come H13 |
| P13 | FAQ + prima di ordinare | le domande, più conservazione e avvertenze |
| P14 | Sticky add-to-cart | barra di vetro staccata dai bordi, dopo che il pulsante esce dallo schermo: gusto · tier · €/giorno · CTA |

---

## I sei archetipi di sezione

`src/site/sections/`, tutti in `#/lab/box`. Le pagine usano solo questi.

| | Archetipo | Quando |
|---|---|---|
| A | `<ColorField>` campo colore | hero, gusti, il rituale, footer: arancia 600 o lime 700 con testo bianco; il 500 solo con logo, testo grande e vetro |
| B | `<Editorial>` editoriale | il gesto, la co-fondatrice: immagine da una parte, testo dall'altra |
| C | `<Numbers>` numeri | la barra numeri, il prezzo al giorno |
| D | `<Statement>` statement | una frase manifesto, da sola |
| E | `<Rows>` righe | ingredienti, passi, garanzia: righe a tutta larghezza con il punto a mano |
| F | `<Glass>` vetro | chip e card sopra colore o immagine, mai su carta |

Tre regole: mai due sezioni consecutive con lo stesso archetipo e lo stesso
allineamento; almeno un elemento che sborda per pagina; le card bianche col
bordo solo dove gli elementi si confrontano (tier, recensioni, profili).

---

## Le fotografie che non ci sono ancora

Ogni immagine del sito è uno **scatto** in [`src/lib/media.ts`](../src/lib/media.ts):
id, brief (luce, ambiente, gesto), proporzione, fondo (campo colore, carta o
profondo) e dove lo usa il sito. Finché `src` è `null`, `<MediaPlaceholder />`
tiene il posto con il campo, il vertice e il brief. Quando il file arriva:

1. si mette in `public/media/`;
2. si scrive il percorso in `src` dello scatto;
3. la pagina mostra la foto, senza altre modifiche.

La pagina prototipi elenca tutti gli scatti: è la **shot list** per i
prototipi finali con Higgsfield, e il contatore in cima dice quanti ne mancano.
Le regole valgono per tutti: **mai una palestra**, le foto stanno su carta o
dentro un campo colore, un solo colore-gusto per scatto (tranne il Duo), la
co-fondatrice spiega e non raccomanda. Le immagini, i video e i loghi dei
reference non si copiano mai.

---

## Cosa è simulato e cosa no

- **Il carrello** non esiste: "Aggiungi" mostra un toast che lo dice. Il passo
  successivo è Shopify.
- **I prezzi** vengono da `PRICE_TIERS`. Il Kit Rituale non c'è: dopo il lancio.
- **I valori di composizione** sono `[dal laboratorio]`, tag grigi anche nel
  PDP.
- **Recensioni, rating, stock del lotto** sono esempi e portano il tag
  "esempio". Mai finti in pubblico.
- **La garanzia** si prova con la foto dei tre retri segnati: è scritto sul
  retro della busta.

---

## Screenshot di riferimento

```bash
npm run dev            # in un terminale
npm run docs:screens   # in un altro: scrive docs/screens/*.png
```

Le viste: home e PDP (prima schermata, intera, con le etichette `?ref=1`,
stretta), design system, formula, prototipi, il laboratorio font con tre
candidati (Nunito, Gabarito, M PLUS), simbolo, sezioni, pack; i pack isolati
(busta dei due gusti, Neutro, retro, stick) da `npm run export:pack`.

Due limiti di Chrome headless: la finestra non scende sotto i 500px, quindi le
viste "mobile" sono a 500px; una pagina scorsa sotto la barra di vetro esce
vuota, quindi si allunga la finestra invece di scorrere.
