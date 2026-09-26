# 00 — Indice del contesto

`docs/contesto/` è il **contesto vivo** del progetto: quello che cambia a ogni
task e che una sessione nuova deve sapere prima di toccare una riga. La
documentazione di sistema (cos'è il brand, i token, il logo, la voce, la
compliance, il pack, il sito) sta in `docs/00`–`10` e cambia solo quando
cambia il sistema.

| File | Cosa contiene | Quando si legge | Quando si aggiorna |
|---|---|---|---|
| [01-stato.md](01-stato.md) | Dove siamo: versione, `main`, branch aperti, cosa c'è, decisioni aperte, cosa non fare | Sempre: `CLAUDE.md` lo importa da solo | A ogni commit |
| [02-storico.md](02-storico.md) | La linea del tempo: sessioni, commit, versioni | Per capire come si è arrivati qui | A ogni sessione |
| [03-decisioni.md](03-decisioni.md) | Il registro delle decisioni, con il perché e le alternative scartate | Prima di rimettere in discussione una scelta | Quando si decide qualcosa |
| [04-backlog.md](04-backlog.md) | I task per area del progetto, con lo stato | Per scegliere il prossimo task | A ogni task aperto o chiuso |
| [05-memo-progetto.md](05-memo-progetto.md) | I fatti da ricordare che non stanno nel codice: account, ambienti, preferenze del proprietario, convenzioni, trappole | Sempre: `CLAUDE.md` lo importa da solo | Quando si scopre un fatto nuovo |
| [06-mappa.md](06-mappa.md) | La mappa del repo, cartella per cartella | Per trovare un file | Quando cambia la struttura |
| [07-procedure.md](07-procedure.md) | Le procedure: aprire e chiudere un task, merge, versione, screenshot, asset, cosa fare quando arrivano foto, valori del laboratorio, recensioni | Prima di un'operazione che non si fa tutti i giorni | Quando cambia il modo di lavorare |
| [sessioni/](sessioni/) | Un file per sessione di lavoro: cosa si è fatto, cosa è andato storto, cosa resta | Per il dettaglio di un giorno | Alla fine di ogni sessione |

## L'ordine di lettura per tipo di task

- **Un task sul sito** (una sezione della home, del PDP, una pagina):
  `01-stato` → `04-backlog` → `docs/09-sito.md` e `docs/10-riferimenti-sezioni.md`
  → il file della pagina in `src/pages/`.
- **Un task sul sistema** (token, componente, brand):
  `01-stato` → `03-decisioni` → `docs/02-tokens.md`, `docs/03-logo.md`,
  `docs/04-components.md`.
- **Un task sul copy**: `docs/06-compliance.md` → `docs/05-voice-and-copy.md`
  → `src/lib/copy.ts`. Niente testo fuori da `copy.ts`.
- **Un task sul pack**: `docs/08-packaging.md` → `#/lab/pack` →
  `src/components/BustaPack.tsx`, `BustaBack.tsx`, `pack/Fruit.tsx`.
- **Una decisione del proprietario arrivata** (font, simbolo, fondo del
  rituale): `07-procedure.md`, sezione "Quando arriva una decisione".

## Gli altri registri

- [`CHANGELOG.md`](../../CHANGELOG.md), alla radice: una voce per commit.
- [`docs/CHANGELOG-v2.md`](../CHANGELOG-v2.md) e
  [`docs/CHANGELOG-v3.md`](../CHANGELOG-v3.md): il racconto per fase delle due
  versioni maggiori.
- [`CLAUDE.md`](../../CLAUDE.md), alla radice: le istruzioni che ogni
  sessione carica.
