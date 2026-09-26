# Font

> **I file dei font non vanno committati in questo repo.** Il repo è pubblico.
> `.gitignore` blocca `.woff`, `.woff2`, `.otf` e `.ttf` in questa cartella e in
> `public/fonts/` (sottocartelle comprese), e il tracciato del wordmark che
> deriva da un font in trial. Non aggirare il blocco.

---

## 3.1: due font in licenza TRIAL, solo in locale

Nella 3.1 il proprietario ha scelto:

| Ruolo | Font | Fonderia | Licenza oggi | Dove sta |
|---|---|---|---|---|
| Tutto il testo del sito (titoli, testo, corsivo) | **Denim**, versione basic | Displaay Type Foundry | **TRIAL** | `public/fonts/denim/*.woff2`, fuori da git |
| Il wordmark (quello della v1) | **Rund Display Black** | Letters from Sweden | **TRIAL** ("evaluation only") | `assets/fonts/rund-900.otf` e il tracciato `src/brand/wordmarks/rund.json`, fuori da git |

La licenza trial di Denim, scritta nei file, vieta di tenerli "su server
accessibili al pubblico" e di rinominarli o modificarli; quella di Rund li
limita alla valutazione. Il repo su GitHub è pubblico e la produzione
(drinkpeak.vercel.app) pure: **i file trial non ci vanno, nemmeno sotto forma di
tracciato**.

### Come funziona finché sono in trial

- **In locale** (`npm run dev`, `npm run build`, gli screenshot) il sito usa
  Denim e il wordmark Rund, se i file ci sono.
- **Su Vercel** (preview e produzione) i file non ci sono: il sito scende sui
  ripieghi e **non fa nessuna richiesta a vuoto**.
  - Denim → Nunito per i titoli, Inter per il testo, Fraunces Italic per il
    corsivo (gli stack sono in `tokens.json` e in `src/lib/fontlab.ts`);
  - wordmark Rund → il tracciato di ripiego `src/brand/wordmark.json`,
    Gabarito 900, cioè la v1 com'era senza il font installato.

I `@font-face` di Denim non sono nel CSS: li scrive il plugin
`peak-trial-fonts` in `vite.config.ts`, **solo se** trova i file in
`public/fonts/denim/`. Riconosce i nomi `Denim-TRIAL-<Peso>[Italic].woff2` e
`Denim-<Peso>[Italic].woff2`, quindi con i file della licenza non cambia
niente nel codice. Pesi: Light 300, Regular 400, Medium 500, SemiBold 600, Bold
700, Heavy 900. **Denim non ha l'800**: i titoli vanno a 700 (Bold), il 900
(Heavy) resta vietato nei titoli.

### Rimettere i file in locale (una macchina nuova)

```bash
mkdir -p public/fonts/denim
cp ~/Downloads/"Denim Collection/Denim/Web package (WOFF2)/WOFF2/"*.woff2 public/fonts/denim/
# il wordmark della v1: dal file trial dell'archivio v1
python3 -c "from fontTools.ttLib import TTFont; f=TTFont('v1/public/fonts/RundDisplay-Black.woff2'); f.flavor=None; f.save('assets/fonts/rund-900.otf')"
npm run brand:vectorize -- --font-id=rund
npm run assets:generate
```

Poi riavvia il dev server: il plugin legge la cartella all'avvio.

### Le licenze da comprare, prima della produzione

1. **Denim, licenza web** (Displaay): per servire i `.woff2` dal sito. Si
   tariffa in genere sulle visite mensili. Da chiedere: se copre le preview e
   i sottodomini, e **se ammette i file in un repo pubblico** (di solito no:
   servono un repo privato o i file aggiunti al deploy da fuori git).
2. **Denim, licenza desktop**, se il font va anche su pack e creatività.
3. **Rund Display Black, licenza desktop** (Letters from Sweden): basta per
   vettorializzare il wordmark una volta e usare il tracciato ovunque, sito
   compreso. Non serve la licenza web: il logo è un tracciato, non testo.

Con la licenza di Rund: si toglie `src/brand/wordmarks/rund.json` da
`.gitignore`, si committa il tracciato, e il ripiego non si vede più. Con la
licenza web di Denim: si decide come far arrivare i file al deploy (vedi sopra)
e i ripieghi restano solo come rete di sicurezza.

---

## Storia

- **1.0**: Rund Display e Rund Text, in trial, con i ripieghi Gabarito e Inter.
- **2.0**: Rund uscito dal sistema per costi e licenze; wordmark vettorializzato
  da Gabarito 900, tutto su Google Fonts (OFL).
- **3.0**: il laboratorio font con sette candidati OFL, default Nunito.
- **3.1**: Denim per il testo e il wordmark Rund della v1, entrambi in trial.

---

## I font OFL che restano

| Ruolo | Font | Licenza | Da dove |
|---|---|---|---|
| Numeri e codici | **DM Mono** 400 / 500 | SIL OFL | Google Fonts |
| Ripieghi | **Nunito**, **Inter**, **Fraunces** Italic | SIL OFL | Google Fonts |
| Laboratorio font (`?font=<id>`) | Gabarito, Nunito, M PLUS Rounded 1c, Fredoka, Baloo 2, Rubik, Varela Round | SIL OFL | Google Fonts |

Tutti da un solo `<link>` in `index.html`. I TTF in questa cartella servono
solo a `npm run brand:vectorize` per rigenerare i tracciati dei candidati.
