# 04 — Backlog per area

I task del progetto, per area, con lo stato. Si lavora **un task per volta**,
su un branch `task/<ambito>-<slug>`. Quando un task si apre o si chiude, si
aggiorna la riga qui e la voce in `CHANGELOG.md`, nello stesso commit.

Stati: `aperto` · `in corso` · `in attesa di <chi/cosa>` · `fatto (versione)`.

## Brand: le decisioni del proprietario

| Id | Task | Stato | Note |
|---|---|---|---|
| BRAND-01 | Scegliere il font | fatto (3.1.0) | Denim, versione basic, per tutto il testo (D24). In trial: vedi LIC-01 |
| BRAND-02 | Scegliere il simbolo | fatto (3.1.0) | i quattro punti con la salita, V7 (D22) |
| BRAND-05 | Il wordmark su bianco e carta: ambra 400 `#FFAE34` (com'è, 1,85:1) o ambra 700 `#A04F06` (5,4:1, come il simbolo)? | in attesa del proprietario | un valore in `LOGO_VARIANTS.ambra` (`paths.ts`) e `logo-on-light` in `tokens.json`. Nell'header, quando sotto passa l'hero ambra, la parola ambra quasi sparisce |
| BRAND-06 | Il lockup sull'ambra: simbolo cacao (brief) + wordmark bianco (regola del logo), oppure tutto bianco? | in attesa del proprietario | `COLORS.brand` in `Lockup.tsx`, `lockups.ambra` in `generate-assets.mjs`, il `VertexBreath` del footer mobile |
| BRAND-07 | Il ColorField dell'hero e il footer: ambra 400 pieno com'è, o ambra con la frutta del gusto ridotta? | aperto | oggi nell'hero ci sono ancora le arance del gusto Nº01 sopra l'ambra |
| BRAND-03 | Decidere il fondo del rituale H6 (lime 700 o carta) | in attesa del proprietario | `tone` del `ColorField` in `Home.tsx` |
| BRAND-04 | Nome autore dei commit (oggi "west-marney") ed eventuale riscrittura degli 8 commit della 3.0 | in attesa del proprietario | Solo su richiesta esplicita: richiede force push |

## Header

| Id | Task | Stato | Note |
|---|---|---|---|
| HEADER-01 | Rifacimento dell'header | in corso, per conto del proprietario | `SiteHeader.tsx`, `site-header.css`. Claude non tocca |
| HEADER-02 | Dopo il rifacimento: verificare cosa cambia di riflesso, rigenerare `home.png` e `pdp.png` | aperto | dipende da HEADER-01 |
| HEADER-03 | Nell'header 3.1 sono cambiati, su richiesta del proprietario, solo il simbolo (salita) e la striscia annunci (ambra 400, testo cacao). Di riflesso via token: il pulsante "Cerca" del pannello (ambra, cacao). Da decidere: le voci del menu mobile hanno `font-weight: 900`, che con Denim diventa Heavy | in attesa del proprietario | `site-header.css`, `.peak-header__panel-link` |

## Fotografie e prototipi

| Id | Task | Stato | Note |
|---|---|---|---|
| FOTO-01 | Produrre i 13 scatti con Higgsfield e metterli in `public/media/` | aperto | shot list in `#/prototipi`, brief in `src/lib/media.ts`; ids: hero-busta-arancia, hero-busta-lime, gesto-stick, pdp-busta-fronte, pdp-busta-retro, pdp-stick-mano, pdp-bicchiere, duo, ambiente-scrivania, dottoressa, formula-ingredienti, meta-quadrato-arancia, meta-quadrato-lime |
| FOTO-02 | Illustrazione definitiva della frutta sul pack al posto del placeholder SVG | aperto | brief in `FLAVORS[].fruitBrief`; `pack/Fruit.tsx` |
| FOTO-03 | I tre video della co-fondatrice (per tema) | aperto | `EXPERT_VIDEOS` in `copy.ts`; oggi segnaposto |

## Pack e laboratorio

| Id | Task | Stato | Note |
|---|---|---|---|
| PACK-01 | Fustella di busta e stick dal laboratorio | in attesa del laboratorio | poi `ratio`, `pack.safe`, `pack.sealBand` diventano veri |
| PACK-02 | Valori di composizione: glicina, vitamina D3 in µg e %VNR, kcal, zuccheri, aromi, peso netto | in attesa del laboratorio | chiudono tabella, retro, `[dal laboratorio]` e decidono i claim sulla vitamina D |
| PACK-03 | Finitura e prova colore (arancia `#E4572E`, lime `#5E9E1F`) | in attesa del laboratorio | — |
| PACK-04 | Etichetta di legge del retro con laboratorio e notifica al Ministero | in attesa di PACK-02 | `PackBack` resta l'elenco |
| PACK-05 | Step packaging 3.1: i colori-gusto (Nº01 arancia, Nº02 lime) con l'ambra, e il wordmark del Neutro (oggi arancia 600; per la regola del logo sarebbe ambra) | aperto, lo decide il proprietario | il wordmark del pack è già quello della v1; `BustaPack`, `StickPack`, `DoseSeal` (numero a 900 = Denim Heavy) |

## Home

| Id | Task | Stato | Note |
|---|---|---|---|
| HOME-00 | H1–H15 sui reference | fatto (3.0.0) | `docs/09`, `docs/10` |
| HOME-01 | Fondo del rituale H6 | in attesa di BRAND-03 | — |
| HOME-02 | Foto al posto dei placeholder (hero, gesto, recensioni, co-fondatrice) | in attesa di FOTO-01 | — |
| HOME-03 | Revisione su dispositivi reali (iPhone, Android) dopo l'header nuovo | aperto | in emulazione a 375px non c'è overflow |

## PDP

| Id | Task | Stato | Note |
|---|---|---|---|
| PDP-00 | P1–P14 sui reference | fatto (3.0.0) | — |
| PDP-01 | Recensioni vere al posto degli esempi | in attesa di recensioni | togliere `example: true` in `REVIEWS`, il tag sparisce |
| PDP-02 | Foto della galleria (gesto, co-fondatrice) | in attesa di FOTO-01 | — |
| PDP-03 | Revisione su dispositivi reali | aperto | — |

## Formula, Design system, Prototipi, Laboratori

| Id | Task | Stato | Note |
|---|---|---|---|
| DS-00 | Allineamento alla 3.0 | fatto (3.0.0) | — |
| DS-01 | Aggiungere `Ritual` e le sezioni A–F ai dettagli tecnici del Design system | aperto | oggi stanno solo in `#/lab/box` |
| DS-02 | Chiudere il font lab dopo BRAND-01: tenere il candidato scelto come default, lasciare gli altri raggiungibili con `?font=` | in attesa di BRAND-01 | — |
| DS-03 | **Footer a pannello** sulla forma di awenlab.com (D27) | fatto (3.2.0) | `SiteFooter.tsx`; docs 09 e 10 aggiornati |
| DS-04 | Dove va il wordmark a tutta larghezza con il retino (H3, `<WordmarkHalftone />`), uscito dal footer (D29) | in attesa del proprietario | oggi il componente resta in `src/brand/` e non lo usa nessuno: chiusura pagina altrove, pagina del design system, o si toglie |
| DS-05 | Contatti, social e pagine di servizio del footer: oggi sono segnaposto (`[numero]`, `ciao@[dominio]`, link in home) | in attesa del proprietario | `SEGNAPOSTO` e i blocchi Contatti/Informative in `SiteFooter.tsx` |

## Copy e compliance

| Id | Task | Stato | Note |
|---|---|---|---|
| COPY-01 | Rileggere tutto il copy 3.0 con il proprietario (è una bozza tradotta e adattata dai reference) | aperto | `docs/10`, colonna "Da riscrivere" |
| COPY-02 | Nota legale della garanzia (condizioni, 90 giorni) da validare | aperto | `GUARANTEE` in `copy.ts` |

## Infrastruttura

| Id | Task | Stato | Note |
|---|---|---|---|
| INFRA-01 | Merge di `task/setup-contesto` su `main` | fatto | arrivato con `v3-ambra` (INFRA-06) |
| INFRA-02 | Cancellare i branch mergiati `ds-v2` e `v3-home-pdp` (locale e origin) | aperto, lo fa il proprietario | `git branch -d`, `git push origin --delete` |
| INFRA-03 | Tag git `v3.0.0` su `f8378bd` | aperto, lo fa il proprietario | `git tag v3.0.0 f8378bd && git push origin v3.0.0` |
| INFRA-04 | Carrello vero (Shopify) al posto del toast | aperto, dopo il lancio | i componenti sono pronti a diventare sezioni di un tema |
| INFRA-05 | Dominio definitivo e meta per i social | aperto | `index.html` |
| INFRA-06 | Merge di `v3-ambra` su `main` (porta anche `task/setup-contesto`) | fatto | `origin/main` è a `811242c`: il proprietario l'ha lanciato. Chiude anche INFRA-01 |
| INFRA-07 | Merge di `task/ds-footer-panel` su `main` | fatto | `588a9fa`, deploy di produzione READY |

## Licenze

| Id | Task | Stato | Note |
|---|---|---|---|
| LIC-01 | Licenza **web** di Denim (Displaay), più la desktop se va sul pack. Chiedere se i file possono stare in un repo pubblico | in attesa del proprietario | finché manca, Denim solo in locale; in produzione Nunito + Inter + Fraunces. Procedura in `07-procedure.md` |
| LIC-02 | Licenza **desktop** di Rund Display Black (Letters from Sweden) per il wordmark in tracciati | in attesa del proprietario | finché manca, in produzione il ripiego Gabarito 900. Procedura in `07-procedure.md` |

## Documentazione

| Id | Task | Stato | Note |
|---|---|---|---|
| DOCS-00 | Setup del contesto | fatto (3.0.1) | questa cartella |
| DOCS-01 | `docs/07-claude-design-setup.md` è ancora 2.0 | aperto | aggiornare i testi pronti alla 3.0 |
| DOCS-02 | `docs/04-components.md`: schede complete per i componenti nuovi della 3.0 | aperto | oggi c'è solo la tabella "Nuovi nella 3.0" |
