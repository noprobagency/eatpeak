# Font

> **I file dei font non vanno committati in questo repo.**
> `.gitignore` blocca `.woff`, `.woff2`, `.otf` e `.ttf` in questa cartella e in
> `public/fonts/`. Non aggirare il blocco.

---

## ⚠ Rund è in versione trial

**Rund Display e Rund Text sono attualmente in licenza trial e non sono
utilizzabili in produzione.** Vale per il sito, per il packaging, per le
creatività e per qualunque file destinato a uscire dallo studio.

Finché la licenza non è comprata, il progetto gira sui fallback gratuiti. Non è
un ripiego temporaneo mal fatto: è configurato apposta e non si rompe.

---

## Le famiglie

| Ruolo | Font | Fonderia | Fallback |
|---|---|---|---|
| Display | **Rund Display** peso 900 | Letters from Sweden | `Gabarito`, `system-ui`, sans-serif |
| Testo | **Rund Text** 400/500/600 | Letters from Sweden | `Inter`, `system-ui`, sans-serif |
| Utility / numeri | **DM Mono** 400/500 | Colophon (Google Fonts) | `ui-monospace`, monospace |

DM Mono è su Google Fonts con licenza SIL Open Font: nessun costo, nessuna
pratica. È già caricato in `index.html`.

---

## Le due licenze da comprare

Servono **due licenze separate**, e la seconda si tariffa diversamente dalla
prima. È l'errore di budget più comune con le fonderie indipendenti.

### 1. Desktop

Per il packaging, i vettoriali, le creatività, tutto ciò che si apre in un
programma di grafica.

Si tariffa a **numero di postazioni**. Serve a chiunque tocchi i file:
designer interni, agenzia, studio di packaging.

### 2. Web

Per il sito e le landing.

Si tariffa sulle **visite mensili** ed è quindi una spesa ricorrente che cresce
col traffico. Va stimata sul traffico previsto a dodici mesi, non su quello di
oggi.

### Cosa chiedere alla fonderia

- Il numero di postazioni desktop e la soglia di pageview web
- Se la licenza web copre i **sottodomini** e gli ambienti di staging
- Se copre le **email transazionali** (spesso no: lì si usano i fallback)
- Se il logo vettorializzato ricade sotto la licenza desktop — **normalmente sì,
  ed è quello che serve**

---

## Il wordmark va vettorializzato

Gli SVG in [`../logo/`](../logo/) contengono **testo non vettorializzato**: senza
Rund Display installato mostrano il fallback.

Appena la licenza desktop è attiva:

1. Apri il wordmark in un editor vettoriale con Rund Display installato
2. Converti il testo in tracciati **una volta sola**
3. Sostituisci i file in `assets/logo/`
4. Da quel momento il logo non dipende più da nessun font

Questo passaggio va fatto **prima** di mandare qualsiasi cosa in stampa.

---

## Come installare i file, quando ci sono

Metti i `.woff2` in `public/fonts/` con questi nomi esatti — sono quelli che
`src/styles/globals.css` si aspetta:

```
public/fonts/
├── RundDisplay-Black.woff2
├── RundText-Regular.woff2
├── RundText-Medium.woff2
└── RundText-Semibold.woff2
```

Non serve toccare il CSS: le regole `@font-face` ci sono già.

---

## Perché non si rompe se mancano

Le regole `@font-face` puntano a file che possono non esistere. Se mancano, la
richiesta fallisce e il browser scende sul font successivo nello stack.

```css
--font-display: 'Rund Display', 'Gabarito', system-ui, sans-serif;
--font-text:    'Rund Text', 'Inter', system-ui, sans-serif;
```

`vite build` avvisa che i file non si risolvono. **È previsto**: significa che la
configurazione sta funzionando come deve.

Gabarito e Inter sono scelti apposta: Gabarito è un rounded geometrico con una
metrica vicina a Rund Display, Inter è neutro e non combatte col resto. Il
layout tiene, cambia la voce.

---

## Come si vede se i font veri ci sono

Lo Showcase, sezione **04 — tipografia**, mostra le tre famiglie con lo stack
completo. Se vedi Gabarito al posto di Rund Display, i file non sono installati.
