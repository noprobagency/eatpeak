# Font

> **I file dei font non vanno committati in questo repo.**
> `.gitignore` blocca `.woff`, `.woff2`, `.otf` e `.ttf` in questa cartella e in
> `public/fonts/`. Non aggirare il blocco.

---

## Rund abbandonato

**Rund Display e Rund Text sono usciti dal sistema con la 2.0.** Motivo: costi e
licenze. Rund era in trial e avrebbe richiesto due licenze separate — desktop
per il packaging e i vettoriali, web per il sito, quest'ultima ricorrente sulle
visite mensili. Il wordmark, per giunta, dipendeva da un font installato.

**Gabarito è il display definitivo.** È SIL Open Font License: gratis per web,
packaging e logo, senza pratiche. Il wordmark è stato vettorializzato da
Gabarito 900 una volta per tutte e non dipende più da nessun font.

I file di Rund della 1.0 restano nell'archivio `v1/public/fonts/`, fuori dal
versionamento.

---

## Le quattro famiglie

| Ruolo | Font | Pesi | Licenza | Da dove |
|---|---|---|---|---|
| Display + wordmark | **Gabarito** | 900 (700/800 dove serve) | SIL OFL | Google Fonts |
| Testo | **Inter** | 400 / 500 / 600 | SIL OFL | Google Fonts |
| Numeri e dati | **DM Mono** | 400 / 500 | SIL OFL | Google Fonts |
| Accento (solo i nomi dei gusti) | **Fraunces** Italic | 500 | SIL OFL | Google Fonts |

Tutte caricate da un solo `<link>` in `index.html`. Nessun `@font-face` locale,
nessun file in `public/fonts/`.

---

## Il TTF di Gabarito, solo in locale

Serve a una cosa sola: **rigenerare il tracciato del wordmark** con
`npm run brand:vectorize`. Non serve per far girare il sito.

```bash
npm run brand:vectorize -- --download     # scarica assets/fonts/Gabarito-900.ttf e rigenera
npm run brand:vectorize -- --compare      # confronta i tracking -0.03 / -0.04 / -0.05
```

Il download prende da Google Fonts l'istanza statica a peso 900 (un browser che
non dichiara il supporto ai font variabili riceve un TTF statico). Il file resta
in `assets/fonts/`, ignorato da git. Il risultato — `src/brand/wordmark.json` —
è committato ed è quello che il sistema usa.

---

## Se un font non carica

Gli stack hanno i fallback di sistema:

```css
--font-display: 'Gabarito', system-ui, sans-serif;
--font-text:    'Inter', system-ui, sans-serif;
--font-mono:    'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
--font-accent:  'Fraunces', Georgia, 'Times New Roman', serif;
```

Il wordmark non è toccato: è un tracciato. Cambia la voce del testo, non il
marchio.
