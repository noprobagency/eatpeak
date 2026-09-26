# 09 — Il sito

La 2.0 non è più solo uno Showcase: è **un sito simulato**, con la homepage in
apertura e le pagine di un negozio vero, più due pagine di studio — il design
system e i prototipi — che sono le sue quinte. Nessun ordine viene evaso, e il
piede di pagina lo dice.

Il routing è sull'hash, senza dipendenze (`src/lib/routes.ts`). Un'ancora dentro
la pagina si scrive dopo un secondo cancelletto: `#/#come-funziona`.

| Rotta | Pagina | Cosa |
|---|---|---|
| `#/` | **Home** | La brand line, le due buste, il protocollo, la formula, i gusti, le quattro settimane, la dottoressa, il rituale, i prezzi, le domande |
| `#/prodotto` | **Prodotto (PDP)** | Galleria (render + segnaposto), selettore del gusto, prezzo al giorno, i tre formati, tabella nutrizionale, il retro, garanzia, recensioni, barra sticky |
| `#/formula` | **La formula** | CreaVida™ ingrediente per ingrediente con i claim autorizzati, il protocollo senza fase di carico, le risposte della dottoressa, la tabella |
| `#/design-system` | **Design system 2.0** | La scheda del brand in nove sezioni e i dettagli tecnici chiusi in fondo |
| `#/prototipi` | **Prototipi** | Busta e stick dai componenti, la shot list per Higgsfield, l'archivio della 1.0 |

Le rotte della 1.0 (`#/showcase`, `#/landing`, `#/product`) restano come alias.

---

## La navigazione

**Header** sticky su carta: il wordmark inchiostro (96px desktop, 80 mobile), il
menu del sito — Prodotto, La formula, Come funziona, Domande — la pillola
"Compra" e, in mono, i link dello studio: Design system 2.0 e Prototipi. Su
mobile un menu a scomparsa con tutto.

**Footer** su inchiostro: il lockup bianco, il sign-off con i claim autorizzati
nello stesso blocco (articolo 10(3)), i link del sito e dello studio, l'avviso
"integratore alimentare", la riga "sito dimostrativo".

---

## L'ordine della home

Non è casuale. Si parte dalla brand line e si arriva al prezzo passando dal
motivo per cui il prodotto esiste.

```
hero (brand line + product line + le due buste)
→ marquee delle prove
→ il protocollo: senza fase di carico, senza barattoli
→ la formula: tre ingredienti, con i claim
→ i gusti: due FlavorCard
→ come funziona: le quattro settimane, su inchiostro
→ la dottoressa, su tint lime
→ il rituale: "Hai preso la tua peak oggi?" + le recensioni
→ i prezzi: PriceTiers con il Rituale Completo preselezionato
→ le domande
```

---

## Le fotografie che non ci sono ancora

Ogni immagine del sito è uno **scatto** in [`src/lib/media.ts`](../src/lib/media.ts):
id, titolo, brief (luce, ambiente, gesto), proporzione, fondo (campo colore,
carta o inchiostro) e dove lo usa il sito. Finché `src` è `null`,
`<MediaPlaceholder />` tiene il posto con un campo colore, il vertice e il
brief. Quando il file arriva:

1. si mette in `public/media/`;
2. si scrive il percorso in `src` dello scatto;
3. la pagina mostra la foto, senza altre modifiche.

La pagina prototipi elenca tutti gli scatti: è la **shot list** per i prototipi
finali con Higgsfield, e il contatore in cima dice quanti ne mancano.

### I brief, in breve

| id | Cosa | Fondo |
|---|---|---|
| `hero-busta-arancia`, `hero-busta-lime` | Le due buste, tre quarti, stessa inquadratura | campo colore |
| `gesto-stick` | Una mano apre uno stick sopra un bicchiere, cucina, mattino | carta |
| `pdp-busta-fronte`, `pdp-busta-retro`, `pdp-stick-mano`, `pdp-bicchiere` | Le foto di catalogo del PDP | carta / campo colore |
| `duo` | Le due buste insieme: l'unica composizione con due colori | carta |
| `ambiente-scrivania` | La busta e uno stick sulla scrivania di chi lavora | carta |
| `dottoressa` | La co-fondatrice, mezzo busto, camicia chiara, nessun camice | campo lime |
| `formula-ingredienti` | Tre mucchi di polvere in fila, macro | carta |
| `meta-quadrato-arancia`, `meta-quadrato-lime` | I quadrati per il feed | campo colore |

Le regole valgono per tutti: **mai una palestra**, le foto stanno su carta o
dentro un campo colore pieno, un solo colore-gusto per scatto (tranne il Duo),
la dottoressa spiega e non raccomanda.

---

## Cosa è simulato e cosa no

- **Il carrello** non esiste: "Aggiungi al carrello" mostra un toast che lo
  dice. Il passo successivo è Shopify, e i componenti sono pronti a diventare
  sezioni di un tema.
- **I prezzi** sono quelli della strategia Round 2 e vengono da `PRICE_TIERS`.
- **I valori di composizione** sono `[dal laboratorio]` e si vedono come tag
  grigi, anche nel PDP: meglio un tag che un numero inventato in produzione.
- **Le recensioni** sono esempi approvati, scelti perché parlano del formato e
  dell'abitudine, mai del corpo.

---

## Screenshot di riferimento

```bash
npm run dev            # in un terminale
npm run docs:screens   # in un altro: scrive docs/screens/*.png
```

Le viste sono quelle dei criteri di accettazione: design system a 1440×900,
logo e simbolo, home desktop e mobile, PDP, prototipi 2.0. Per i singoli pack
isolati si usa `npm run export:pack`.
