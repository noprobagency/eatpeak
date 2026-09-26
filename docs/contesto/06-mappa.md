# 06 — Mappa del repo

Cartella per cartella. Quando cambia la struttura, cambia questo file.

```
eatpeak/
├── CLAUDE.md                 istruzioni per ogni sessione (importa stato e memo)
├── CHANGELOG.md              una voce per commit, per versione
├── README.md                 presentazione del progetto, comandi, documenti
├── package.json              versione semver, script npm
├── index.html                titolo e meta del sito, theme-color ambra
├── vite.config.ts            React + il plugin peak-trial-fonts (i @font-face di Denim, solo se i file ci sono)
├── .claude/launch.json       dev server "peak" (npm run dev, :5173)
├── v1/                       la 1.0 intera, eseguibile da sola. Non si tocca
├── assets/
│   ├── logo/                 wordmark e lockup in SVG, generati (assets:generate)
│   ├── favicon/              il simbolo a quattro punti a tutte le misure (peak-simbolo-*), generato
│   ├── fonts/                README: i font trial (Denim, Rund) e OFL; i file non si committano
│   └── export/               (ignorato) export di pack e logo; logo-v1/ con il wordmark Rund
├── public/                   favicon, manifest, media/ per le foto; fonts/denim/ (ignorato, trial)
├── docs/
│   ├── 00-brand-overview.md  GENERATO da src/lib/brand-overview.ts (docs:brand)
│   ├── 01-brand.md           posizionamento, Clinical Joy, la 3.0 più umana
│   ├── 02-tokens.md          colore, tipografia, spazio, vetro, grana, sezione
│   ├── 03-logo.md            3.1 in testa (wordmark v1, quattro punti, salita, favicon), poi 2.0–3.0
│   ├── 04-components.md      quando usare ogni componente, e quando no
│   ├── 05-voice-and-copy.md  voce, claim, prezzi, la 3.0 in breve
│   ├── 06-compliance.md      i sei claim EFSA, i termini vietati, il linter
│   ├── 07-claude-design-setup.md  testi pronti per Claude Design e Higgsfield (2.0)
│   ├── 08-packaging.md       busta, retro, stick, varianti, export
│   ├── 09-sito.md            rotte, interruttori, home H1–H15, PDP P1–P14, archetipi
│   ├── 10-riferimenti-sezioni.md  il reference di ogni sezione
│   ├── CHANGELOG-v2.md, CHANGELOG-v3.md  il racconto per fase
│   ├── contesto/             QUESTA cartella: stato, storico, decisioni, backlog, memo, mappa, procedure, sessioni/
│   ├── screens/              screenshot del sito (docs:screens)
│   └── references/           (ignorato) screenshot e materiali dei siti reference
├── scripts/
│   ├── build-tokens.mjs      tokens.json → tokens.css
│   ├── contrast-report.mjs   rapporti di contrasto, aggiorna docs/02, fallisce se serve
│   ├── compliance-lint.mjs   termini vietati e claim letterali, con auto-test
│   ├── check-utilities.mjs   classi Tailwind fuori scala
│   ├── generate-assets.mjs   logo, lockup, favicon ambra con i quattro punti, manifest
│   ├── vectorize-wordmark.mjs  TTF di un candidato → src/brand/wordmarks/<id>.json (rund: solo locale)
│   ├── export-logo.mjs       wordmark in PNG
│   ├── export-pack.mjs       busta, retro, stick in SVG + PNG (Vite SSR + Chrome)
│   ├── screenshots.mjs       gli screenshot di docs/screens
│   ├── build-brand-doc.mjs   docs/00 dalla scheda del brand
│   └── lib/raster.mjs        aiuti per i PNG
└── src/
    ├── main.tsx              monta App, chiama initFontLab()
    ├── App.tsx               router sull'hash, mappa delle pagine
    ├── styles/globals.css    base, .peak-em, etichette ?ref=1, grana
    ├── tokens/               tokens.json (sorgente) → tokens.css (generato), tokens.ts (tipi)
    ├── lib/
    │   ├── copy.ts           TUTTO il copy e i dati di prodotto
    │   ├── compliance.ts     claim EFSA, termini vietati
    │   ├── fontlab.ts        candidati font, ?font ?italic ?body ?ref
    │   ├── media.ts          la shot list (13 scatti, src null finché non ci sono)
    │   ├── routes.ts         rotte, nav, titoli
    │   ├── contrast.ts       calcolo dei rapporti
    │   ├── brand-overview.ts la scheda del brand (alimenta docs/00 e <BrandSheet>)
    │   └── cn.ts             classi
    ├── brand/
    │   ├── paths.ts          wordmark (v1 + ripiego), SYMBOL_GEOMETRY, SALITA_MOTION, SYMBOL_VARIANT, lockup, usi vietati
    │   ├── wordmarks/        un JSON per candidato font; rund.json (wordmark v1) fuori da git
    │   ├── Logo, Icon, Lockup, SymbolRise, DotField, HandDot, DayDot, Grain, VertexBreath, WordmarkHalftone
    │   ├── salita.css        la salita del simbolo (header)
    │   └── dots.css          micro-interazioni dei punti
    ├── components/           la libreria (42 file) + glass.css + pack/Fruit.tsx
    ├── site/
    │   ├── SiteHeader.tsx, site-header.css   DEL PROPRIETARIO, non toccare (3.1: solo simbolo e annunci, su sua richiesta)
    │   ├── SiteFooter.tsx    footer ambra 400 con il wordmark bianco a retino
    │   ├── Ritual.tsx        il rituale dei 30 punti
    │   └── sections/         gli archetipi A–E (ColorField, Editorial, Numbers, Statement, Rows)
    └── pages/
        ├── Home.tsx (H1–H15), Product.tsx (P1–P14), Formula.tsx, DesignSystem.tsx, Prototypes.tsx
        └── lab/              LabShell, FontLab, SymbolLab, BoxLab, PackLab
```

## Le rotte

`#/` **design system (è la home)** · `#/prototipi` · `#/lab/font` ·
`#/lab/simbolo` · `#/lab/box` · `#/lab/pack` · `#/sito` home del sito ·
`#/prodotto` · `#/formula`. Le ancore vanno dopo un secondo cancelletto
(`#/colore`, `#/sito#domande`); i parametri prima dell'hash
(`/?font=nunito&ref=1#/`). Solo il gruppo `sito` mostra l'header; tutto il
resto si naviga dal footer, che è l'indice del progetto.
