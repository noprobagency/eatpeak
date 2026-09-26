# Changelog — design system 3.0

Branch `v3-home-pdp`, 26 settembre 2026. **Non mergiato su `main`**: la
preview la crea Vercel dal branch,
<https://eatpeak-git-v3-home-pdp-noprobagency.vercel.app> (protetta dal login
del team). La produzione (`drinkpeak.vercel.app`) resta la 2.0 con l'header
nuovo.

L'header — `src/site/SiteHeader.tsx` e `site-header.css` — **non è stato
toccato**: lo rifà il brand. Riceve di riflesso i token e i dati della 3.0
(§4).

---

## 1. Cosa è cambiato, per fase

**1 — Niente nero, cacao e vetro** (`6918d10`). La scala **cacao** 50–900
come neutri del testo; `neutral` fermato al 400; `color.print.ink` solo per la
stampa, mai in Tailwind. I **profondi** `bg-brand-deep` (arancia 600) e
`bg-lime-deep` (lime 700) per ogni superficie scura. Pulsante primario bianco
su arancia 600 (4,91:1); sui campi la pillola bianca con il testo arancia 700.
Token `dot-*`, `glass`, `grain`, `section`; raggio `2xl` a 40px. Il report di
contrasto riscritto sulle coppie nuove, e fallisce se compare l'inchiostro.

**2 — Tipografia e font lab** (`40b1877`). Sette candidati OFL — Gabarito
senza il 900, Nunito, M PLUS Rounded 1c, Fredoka, Baloo 2, Rubik, Varela Round
— con `?font=<id>` che cambia display e wordmark in tutto il sito (default
Nunito), `?italic=0`, `?body=display`. Un wordmark vettorializzato per
candidato (`src/brand/wordmarks/`, `brand:vectorize --font-id | --all |
--download`). `#/lab/font` con la scorecard da compilare. Titoli 700–800 e mai
900, una parola in corsivo per titolo (`<Em>`), occhielli in display 600 e
frase normale, `mono-md` senza maiuscolo.

**3 — Pallini** (`d3b9eeb`). Il sistema a tre formati — simbolo, griglia,
retino — e le due famiglie, geometrici e a mano: `<HandDot>`, `<DayDot>`,
`dots.css` (il respiro del simbolo, il punto della CTA, la sottolineatura a
pallini, il retino al passaggio), `<VertexBreath>`, `<WordmarkHalftone>`,
`<StockCounter>`. Le varianti del simbolo V1–V6 in `SYMBOL_VARIANTS`, il flag
`SYMBOL_VARIANT = 'v5'`, `#/lab/simbolo`; asset rigenerati. Le sei regole
anti-eccesso in docs/03.

**4 — Archetipi e vetro** (`b2c3a32`). `src/site/sections/` con i sei
archetipi A–F (`ColorField`, `Editorial`, `Numbers`, `Statement`, `Rows`, più
`<Glass tone liquid>` con i fallback) e `<Grain>` in `feTurbulence`;
`#/lab/box` con la sequenza anche a 390px.

**5 — Pack** (`3d07f6c`). La frutta sovradimensionata stile Cure come
placeholder con il brief (`pack/Fruit.tsx`, `FLAVORS[].fruitBrief`), la
variante Neutro, `<BustaBack>` con i trenta cerchi da segnare e lo spazio per
la foto della garanzia, `#/lab/pack`; export `--retro --marked`, `--neutro`,
`--font`.

**6 — Homepage** (`4cc8e74`). H1–H15 sui reference (docs/10): hero arancia
600 con la busta che sborda e la card prezzo di vetro, barra numeri,
statement, il gesto in tre passi, ingredienti, il rituale dei 30 punti su lime
700, i due gusti, il confronto, la co-fondatrice con tre video, le recensioni
(esempi), gli standard, l'offerta con lo stock a punti, la garanzia, le
domande, il footer con il wordmark a retino. `data-ref` su ogni sezione,
`?ref=1` per le etichette. Il Kit Rituale è uscito; niente quiz.

**7 — PDP** (`2850715`). P1–P14: galleria su tint con la frutta, sei
miniature e lo switch gusto di vetro; buy box a passi numerati con la riga di
fiducia a punti; "È per me?" a profili; barra numeri compatta; tab con la
sottolineatura a pallini; ingredienti e tabella; i 30/60/90 giorni a
micro-punti; confronto e co-fondatrice compatti; recensioni con i filtri;
garanzia; FAQ con conservazione e avvertenze; la barra sticky di vetro
staccata dai bordi.

**8 — Pulizia e documentazione** (questo commit). `#/formula`,
`#/design-system` e `#/prototipi` allineati: niente nero, niente occhielli in
mono, il font dal laboratorio, il simbolo attivo, i link ai laboratori. Il
design system ha dieci sezioni: il laboratorio font dentro la tipografia, il
retro dentro il packaging, DayDot, HandDot e Glass tra i componenti chiave, la
09 con i quattro laboratori. **Mono maiuscolo nel sorgente: da 97 (`main`) a
11**, −89%; restano le definizioni in `tokens.css`, due righe di
`site-header.css` e il campo `mono` di `<Input>`. Docs 01, 02, 03, 04, 05, 08,
09 aggiornati, 10 nuovo, README, scheda 00 rigenerata, screenshot nuovi in
`docs/screens/`.

---

## 2. I riferimenti, sezione per sezione

Sono in [10 — Riferimenti delle sezioni](10-riferimenti-sezioni.md): per
ogni sezione di home e PDP il reference, l'URL, cosa si è copiato (la
struttura) e cosa va riscritto. Gli screenshot dei siti stanno in
`docs/references/`, fuori dal versionamento. Nessuna immagine, video, logo o
claim di terzi è entrato nel sito.

---

## 3. Le scelte fatte

- **Campi con testo corrente = profondi.** Il 500 porta solo logo, testo grande
  e vetro: cacao su arancia 500 si ferma a 3,72:1, non basta.
- **Recensioni, rating, stock: esempi con il tag**, mai finti in pubblico.
- **La garanzia si prova con la foto dei tre retri**, e il retro lo dice.
- **Le tab hanno la sottolineatura a pallini**, niente mono.
- **Il mono fa i numeri e i codici**, gli occhielli sono display 600.
- **Nessuna dipendenza nuova**; font solo da Google Fonts.
- **La FAQ del PDP** aggiunge conservazione e avvertenze; il Duo resta nella
  risposta sui gusti, senza una voce a parte.
- **Header e footer**: il footer è arancia 600 con il retino sul wordmark;
  l'header è del brand.

---

## 4. L'header, di riflesso

Non toccato. Cambia solo perché cambiano token e dati:

- il wordmark è nel candidato attivo (Nunito di default; `?font=` lo cambia);
- il simbolo `<Icon>` è la variante V5, con la punta miele;
- il logo e il testo su chiaro sono cacao 900 invece di inchiostro;
- la voce di menu è "Design system 3.0" (`STUDIO_NAV`);
- la barra annunci arancia è invariata.

---

## 5. Le tre decisioni per il brand

1. **Il font.** `#/lab/font`: sette candidati, la scorecard. Nunito è il
   default finché non si decide; si cambia `DEFAULT_FONT_ID` in
   `src/lib/fontlab.ts` e si rigenerano gli asset.
2. **Il simbolo.** `#/lab/simbolo`: V1–V6, V5 proposta. Si cambia
   `SYMBOL_VARIANT` in `src/brand/paths.ts` e `npm run assets:generate`.
3. **Il fondo del rituale (H6).** Lime 700 com'è, oppure carta con i punti
   arancia. È un `tone` di `<ColorField>` in `Home.tsx`.

---

## 6. Cosa resta fuori

- Le fotografie: la shot list è in `#/prototipi`, i brief in `src/lib/media.ts`.
- La fustella e i valori dal laboratorio (`[dal laboratorio]`).
- Le recensioni vere: si toglie `example: true` e il tag sparisce.
- Il merge su `main`: non fatto, per istruzione.
