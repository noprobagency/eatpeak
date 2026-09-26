# 04 — Componenti

Un file per componente in [`src/components/`](../src/components), esportati da
[`src/components/index.ts`](../src/components/index.ts).

```tsx
import { Button, Card, PriceTiers, BustaPack } from '@/components'
import { Logo, Icon, Lockup, DotField } from '@/brand'
```

Ogni file si apre con un commento che dice **quando usarlo e quando no**. Quella
seconda parte è la più utile: un design system si degrada quando i componenti
vengono usati fuori dal loro scopo, non quando ne mancano.

Tutti i componenti compaiono nella pagina [Design system](../src/pages/DesignSystem.tsx):
i cinque chiave nella sezione 07, gli altri nel blocco **Dettagli tecnici**, in
fondo, chiuso di default. **Se aggiungi un componente e non lo aggiungi lì —
anche dentro i dettagli — per il sistema non esiste.**

---

## Le regole trasversali

Valgono per tutto e non hanno prop per essere disattivate.

| Regola | Dove vive |
|---|---|
| Solo token semantici, mai colori grezzi | tutti i componenti |
<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
| Anello di focus arancia 700, offset 2px | `globals.css`, `:focus-visible` |
| `outline: none` senza sostituto è un bug | — |
| I pulsanti hanno sempre raggio `full` | `<Button>` non espone `radius` |
| Ogni dato oggettivo passa dal mono | dosaggi, prezzi al giorno, lotti, conteggi |
| I `display-*` sono sempre minuscoli | classi `.type-display-*` |
| Il corsivo è solo per i nomi dei gusti | classi `.type-flavor*` |
| Sui campi colore il testo corrente è inchiostro | `Section`, `Card`, `Marquee` con toni `arancia`/`lime` |
| I gusti si leggono da `FLAVORS` | `FlavorCard`, `FlavorSelector`, `BustaPack`, `StickPack`, `ProductCard` |
| I valori mancanti sono `[dal laboratorio]` | `LabTag`, `IngredientPanel`, `PackBack` |
| Ogni animazione rispetta reduced-motion | `tokens.css` + `<Marquee>` |
| SVG decorativo `aria-hidden`, informativo con `<title>` | `<Logo>`, `<Icon>`, ogni icona inline |

---

## Layout

| Componente | Quando | Quando no |
|---|---|---|
| `<Container>` | Dentro ogni `<Section>`, per riportare il contenuto alla colonna di lettura. | Per le bande a tutta larghezza. |
| `<Section>` | Contenitore di primo livello di ogni blocco. La prop `tone` imposta fondo **e** colori di testo. | Per raggruppare elementi dentro un blocco. Lì basta `<Stack>`. |
| `<Stack>` | Ogni volta che stai per scrivere `margin-bottom` su una serie di elementi. | Per layout a due dimensioni. Quello è `<Grid>`. |
| `<Grid>` | Cataloghi, elenchi di prove, timeline. | Colonne di larghezze diverse. Scrivila a mano. |
| `<Divider>` | Tra due sezioni dello stesso tono, dentro liste lunghe. | Come decorazione. |

`<Section tone>` accetta `page | surface | warm | inverse | arancia | lime |
arancia-tint | lime-tint`. Sui toni pieni il testo di default è inchiostro; il
bianco lo si sceglie a mano per titoli e numeri grandi. **Un solo colore-gusto
per composizione.**

---

## Fondamentali

### `<Button>`

Sei varianti: `primary` (arancia 500, testo inchiostro), `secondary`
(contornato), `ghost`, `link`, `inverse` (la pillola bianca, sui campi colore e
su inchiostro), `ink` (la pillola inchiostro). Tre dimensioni. Stati: default,
hover, active, focus-visible, disabled, loading.

`as="a"` rende un `<a>` vero. **Un pulsante fa qualcosa; un link porta da
qualche parte.** Il raggio è sempre `full`.

### `<Input>`, `<Select>`, `<Checkbox>`, `<RadioGroup>`

L'etichetta è **obbligatoria per tipo**. `<Select>` è un `<select>` nativo di
proposito. `<RadioGroup>` è un `<fieldset>` con `<legend>`.

### `<QuantityStepper>`

Per la quantità che si aggiusta di uno alla volta. **Non** per scegliere il
formato: lì serve `<PriceTiers>`.

### `<Badge>`, `<Tag>`, `<LabTag>`

Il badge è un'etichetta che il sistema mette addosso a qualcosa; il tag
appartiene all'utente. **`<LabTag>`** è il terzo: il segnaposto grigio di un
valore che aspetta il laboratorio. `renderWithPlaceholders(testo)` sostituisce
ogni `[dal laboratorio]` in una stringa col tag.

Toni del badge: `brand | lime | miele | neutral | success | warning | error`.
Nessuna combinazione usa un 500 o il miele 300 come testo su chiaro.

### `<Card>`

Quando un gruppo di elementi va letto come una cosa sola. Toni: gli stessi di
`<Section>`. Raggio `lg` o `xl`, ombre minime.

### `<Accordion>`, `<Tabs>`, `<Tooltip>`, `<Modal>`, `<Toast>`

<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
Invariati dalla 1.0: `<details>` nativo, tastiera completa, focus trap, live
region. Il toast `success` è lime 700 con bianco (6,15:1), non lime 500.

---

## Specifici del brand

### `<BrandSheet>`

La scheda del brand in una card: brand line, product line, posizionamento,
target, tono, cosa non siamo, la gerarchia dei claim. Legge da
`src/lib/brand-overview.ts` e `src/lib/copy.ts`. È la sezione 00 del design
system e sostituisce `BrandOverview` e `BrandPrinciples` della 1.0, il cui testo
esteso resta in [00 — Scheda del brand](00-brand-overview.md).

### `<SectionHeader>` e `<Hero>`

Occhiello mono + titolo display minuscolo. Portano il **vincolo di compliance
nei tipi**: con `genericBenefit` (o `usesShortClaim` sull'hero) la prop
`authorizedClaim` diventa obbligatoria. Tre toni: `default`, `inverse`, `flavor`
(titolo bianco, corpo inchiostro).

### `<Marquee>`

Banda scorrevole, toni `arancia | lime | ink | miele`. Sui campi colore il mono
è inchiostro. Una volta per pagina. Contenuto di default: le prove del prodotto,
compreso "SPEDIZIONE GRATUITA DA 2 BUSTE".

### `<DoseSeal>`

Il bollino del dosaggio: numero in Gabarito, unità in mono. Il miele è il tono
di default; poi `arancia`, `lime`, `ink`, `white`.

### `<WeekTimeline>`

**Il componente narrativo centrale del brand.** I testi descrivono il gesto e il
tempo, mai un effetto. Invariato nel principio.

### `<TrustRow>`

Solo **fatti controllabili**: Made in Italy, 3 g, la formula, senza fase di
carico.

### `<FlavorCard>` e `<FlavorSelector>`

La card presenta un gusto (campo colore, numero grande, stick, nome in
corsivo, con `showSwatches` i tre valori di colore). Il selettore lo fa
scegliere: un `<fieldset>` di radio a pillola. Entrambi leggono da `FLAVORS`.

### `<BustaPack>` e `<StickPack>`

Il fronte della busta da 30 stick e lo stick, parametrici. Leggono il gusto da
`FLAVORS` e le proporzioni dai token `pack.*`. **Provvisori** finché non arriva
la fustella. Con `standalone` dichiarano i font dentro l'SVG, per l'export. Vedi
[08 — Packaging](08-packaging.md).

**Non** nella galleria del PDP al posto della foto vera: un disegno sul prodotto
in vendita è un problema di fiducia. Nel sito dimostrativo il render vale finché
la foto non c'è, e lo dice.

### `<PackBack>`

Il segnaposto del retro: l'elenco dei contenuti obbligatori con i valori dal
laboratorio. Non è l'etichetta.

### `<MediaPlaceholder>`

Dove andrà una fotografia. Legge uno `Shot` da `src/lib/media.ts`: se `src` c'è
mostra l'immagine, altrimenti un campo colore con il vertice e il brief dello
scatto. È il ponte verso i prototipi finali con Higgsfield: quando il file
arriva, si scrive il percorso e la pagina si aggiorna.

### `<ProductCard>`

Il prodotto in una griglia. Il gusto decide il colore del riquadro; il prezzo
per giorno è in mono ed è obbligatorio.

### `<PriceTiers>`

Il selettore delle confezioni. **Prezzo al giorno in grande** (mono), totale in
piccolo. **Il risparmio è calcolato sul prezzo unitario del primo livello, non
scritto a mano.** Il livello `preselected` parte selezionato; il primo, senza
spedizione gratuita, mostra anche il costo al giorno spedizione inclusa. Le
righe `extras` portano Duo, kit e garanzia.

### `<ReviewCard>`, `<FaqAccordion>`, `<StickyAddToCart>`

Invariati nel principio. La barra sticky, nel design system, è montata **solo
quando i dettagli tecnici sono aperti e l'ancora è nella viewport**: nella 1.0
compariva fissa in cima alla pagina e copriva la scheda.

### `<IngredientPanel>`

La tabella nutrizionale, tutta in mono, con la colonna %VNR. Le celle in attesa
del laboratorio sono `<LabTag>`: **non si inventa un numero per far tornare una
tabella.**

---

## Aggiungere un componente

1. Un file in `src/components/`, con il commento **quando sì / quando no** in
   cima.
2. Props tipizzate, tutti gli stati.
3. Solo token semantici. Se mostra un gusto, legge da `FLAVORS`.
4. Export in `src/components/index.ts`.
5. **Una sezione nella pagina Design system**, nei dettagli tecnici se non è uno
   dei cinque chiave.
6. `npm test`.
