# 04 — Componenti

Un file per componente in [`src/components/`](../src/components), esportati da
[`src/components/index.ts`](../src/components/index.ts).

```tsx
import { Button, Card, PriceTiers } from '@/components'
import { Logo, Icon, Lockup } from '@/brand'
```

Ogni file si apre con un commento che dice **quando usarlo e quando no**. Quella
seconda parte è la più utile: un design system si degrada quando i componenti
vengono usati fuori dal loro scopo, non quando ne mancano.

Tutti i componenti compaiono nello [Showcase](../src/pages/Showcase.tsx) in ogni
stato. **Se aggiungi un componente e non lo aggiungi lì, per il sistema non
esiste.**

---

## Le regole trasversali

Valgono per tutto e non hanno prop per essere disattivate.

| Regola | Dove vive |
|---|---|
| Solo token semantici, mai colori grezzi | tutti i componenti |
<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
| Anello di focus terracotta 700, offset 2px | `globals.css`, `:focus-visible` |
| `outline: none` senza sostituto è un bug | — |
| I pulsanti hanno sempre raggio `full` | `<Button>` non espone `radius` |
| Ogni dato oggettivo passa dal mono | dosaggi, prezzi, lotti, conteggi |
| I `display-*` sono sempre minuscoli | classi `.type-display-*` |
| Ogni animazione rispetta reduced-motion | `tokens.css` + `<Marquee>` |
| SVG decorativo `aria-hidden`, informativo con `<title>` | `<Logo>`, `<Icon>`, ogni icona inline |

---

## Layout

| Componente | Quando | Quando no |
|---|---|---|
| `<Container>` | Dentro ogni `<Section>`, per riportare il contenuto alla colonna di lettura. | Per le bande a tutta larghezza. Quelle escono di proposito. |
| `<Section>` | Contenitore di primo livello di ogni blocco di pagina. La prop `tone` imposta fondo **e** colori di testo corretti. | Per raggruppare elementi dentro un blocco. Lì basta `<Stack>`. |
| `<Stack>` | Ogni volta che stai per scrivere `margin-bottom` su una serie di elementi. | Per layout a due dimensioni. Quello è `<Grid>`. |
| `<Grid>` | Cataloghi, elenchi di prove, timeline. | Quando le colonne devono avere larghezze diverse. Scrivila a mano. |
| `<Divider>` | Tra due sezioni dello stesso tono, dentro liste lunghe. | Come decorazione. Se non separa niente, togli il divider e aumenta lo spazio. |

`<Section tone>` accetta `page | surface | warm | brand | forest | inverse`.
**Ogni tono porta con sé il colore di testo che ci si legge sopra**: è il punto
in cui il sistema garantisce il contrasto invece di sperarci.

Due sezioni con lo stesso tono, una sotto l'altra, senza `<Divider>`: il confine
sparisce. È l'errore più comune.

---

## Fondamentali

### `<Button>`

Quattro varianti — `primary` terracotta pieno, `secondary` contornato, `ghost`,
`link` — e tre dimensioni. Stati: default, hover, active, focus-visible,
disabled, loading.

`as="a"` rende un `<a>` vero, che resta navigabile da tastiera e col tasto
destro. **Un pulsante fa qualcosa; un link porta da qualche parte.**

Il raggio è sempre `full` e non c'è una prop per cambiarlo.

### `<Input>`, `<Select>`, `<Checkbox>`, `<RadioGroup>`

L'etichetta è **obbligatoria per tipo**. Un placeholder non è un'etichetta:
sparisce appena scrivi e non viene letto in modo affidabile. Se non deve
vedersi, `hideLabel` la tiene per gli screen reader.

`<Select>` è un `<select>` nativo di proposito: tastiera, mobile e screen reader
funzionano già, e nessuna reimplementazione li batte. Sopra le cinque opzioni, o
quando le opzioni sono note e noiose. Sotto le cinque con un peso reale nella
decisione, `<RadioGroup>` mostra tutto senza un click e converte meglio.

`<RadioGroup>` è un `<fieldset>` con `<legend>`: è così che uno screen reader
capisce che le opzioni appartengono alla stessa domanda.

### `<QuantityStepper>`

Per la quantità che si aggiusta di uno alla volta. **Non** per scegliere il
formato d'acquisto: lì il numero non è una quantità neutra, è un'offerta, e
serve `<PriceTiers>`.

### `<Badge>` e `<Tag>`

La differenza è **chi decide**. Il badge è un'etichetta che il sistema mette
addosso a qualcosa — "spedizione gratuita", "esaurito". Il tag appartiene
all'utente: si seleziona, si toglie.

Nessuna combinazione di `<Badge>` usa miele 300 o terracotta 400 come colore di
testo su fondo chiaro.

### `<Card>`

Quando un gruppo di elementi va letto come una cosa sola. **Non** per dare
soltanto un fondo a una sezione: se non c'è un confine concettuale la card è una
scatola vuota, e serve `<Section tone>`.

Raggio `lg` o `xl`, ombre minime.

### `<Accordion>`, `<Tabs>`, `<Tooltip>`

`<Accordion>` è costruito su `<details>`/`<summary>`: apre e chiude senza
JavaScript e la tastiera funziona da sola. Non metterci dentro informazioni che
servono a decidere — se il prezzo o il dosaggio stanno in un accordion, li stai
nascondendo, non ordinando.

`<Tabs>` ha la navigazione da tastiera completa: frecce, Home, End. Le tab
suggeriscono che l'ordine non conta; se conta, servono passi numerati.

<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
`<Tooltip>` si apre anche col focus da tastiera e si chiude con Escape. Ma non
esiste su touch, non si copia e sparisce: **se l'informazione conta, scrivila in
pagina.**

### `<Modal>`

<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
Interrompe tutto e chiede una cosa sola. Chiude con Escape e col click fuori; il
focus entra nel dialogo, resta dentro finché è aperto e torna dove stava alla
chiusura.

Usala quando togliere il controllo è il punto. Per contenuti lunghi, no.

### `<Toast>` e `<ToastStack>`

<!-- peak-compliance-ignore focus — focus da tastiera, non un claim -->
Conferma breve, non bloccante. Lo stack è un live region: gli screen reader
annunciano senza spostare il focus.

**Non** per errori che richiedono un'azione: un toast sparisce.

---

## Specifici del brand

### `<SectionHeader>` e `<Hero>`

Occhiello mono + titolo display minuscolo.

Portano il **vincolo di compliance nei tipi**: passando `genericBenefit` (o
`usesShortClaim` sull'hero), la prop `authorizedClaim` diventa obbligatoria e il
claim EFSA viene stampato nello stesso blocco. Vedi
[06 — Compliance](06-compliance.md).

Entrambi distinguono tre regimi di colore — chiaro, `brand`, `inverse` — perché
su terracotta 400 il bianco arriva solo a 3:1: va bene per il titolo, non per il
corpo.

### `<Marquee>`

Banda scorrevole a tutta larghezza, fondo terracotta o bosco, testo mono
maiuscolo, pausa su hover. Una volta per pagina.

Il testo visibile è duplicato per chiudere il ciclo, quindi è `aria-hidden`: la
versione per gli screen reader è un elenco statico in `.sr-only`, letto una
volta sola. Con `prefers-reduced-motion: reduce` l'animazione si ferma e la
banda diventa una riga fissa che va a capo — non una riga ferma a metà.

### `<DoseSeal>`

Il bollino del dosaggio: numero in Rund Display, unità in mono sotto. È il segno
che porta il numero.

Non usarlo per numeri che non sono dosaggi: un bollino "-30%" con questa forma
confonde un dato di prodotto con una promozione.

### `<WeekTimeline>`

**Il componente narrativo centrale del brand.** Racconta la saturazione
progressiva e, con essa, il posizionamento: il prodotto non funziona perché è
potente, funziona perché lo prendi tutti i giorni.

I testi descrivono il gesto e il tempo, **mai un effetto**. La barra di
riempimento è decorativa e non dichiara una percentuale di efficacia: è
l'immagine del serbatoio che si riempie.

### `<StickPack>`

Rappresentazione SVG dello stickpack, con banda colore parametrica. Per i
mockup. **Non** nella galleria della pagina prodotto, dove serve la foto vera: un
disegno al posto di una foto sul prodotto in vendita è un problema di fiducia,
non di stile.

### `<ProductCard>`

Il prezzo per giorno è obbligatorio ed è in mono: è il numero che rende
confrontabile uno stickpack con un barattolo.

### `<PriceTiers>`

Il selettore delle confezioni. **Il risparmio è calcolato sul prezzo unitario del
primo livello, non dichiarato a mano: così non può mentire.** La soglia di
spedizione gratuita è segnalata sul livello, non in una nota a fondo pagina.

Non metterlo insieme a un `<QuantityStepper>` per lo stesso prodotto: due
comandi che fanno la stessa cosa fanno perdere l'acquisto.

### `<ReviewCard>`

L'etichetta del beneficio è in mono e nomina **un fatto del prodotto** — il
formato, la costanza, l'assenza di grumi — non un effetto sul corpo.

### `<FaqAccordion>`

`<Accordion>` con i contenuti approvati e i dati strutturati `FAQPage`: le stesse
risposte diventano un risultato ricco sui motori senza doverle riscrivere.
`structuredData` una volta sola per pagina.

### `<StickyAddToCart>`

Compare quando l'elemento osservato esce dallo schermo — non a una soglia di
pixel, così resta corretta a qualunque altezza di viewport.

Pagina prodotto su mobile, sì. Landing, no: una barra fissa prima che l'utente
sappia cosa sta comprando è solo un ostacolo.

### `<TrustRow>`

Solo **fatti controllabili**: dove si produce, quanti grammi, quali analisi. Un
beneficio in questa riga sembra un fatto, ed è esattamente il tipo di errore che
la compliance punisce.

### `<IngredientPanel>`

Tabella nutrizionale, tutta in mono, intestazioni comprese. È la versione
leggibile: **l'etichetta di legge sta sul pack e non si riscrive.**

---

## Aggiungere un componente

1. Un file in `src/components/`, con il commento **quando sì / quando no** in
   cima. Se non riesci a scrivere il "quando no", il componente probabilmente
   non serve.
2. Props tipizzate, tutti gli stati: `default, hover, active, focus-visible,
   disabled, loading`.
3. Solo token semantici.
4. Export in `src/components/index.ts`.
5. **Una sezione nello Showcase**, con tutte le varianti e tutti gli stati.
6. `npm test` — typecheck, compliance, contrasto.
