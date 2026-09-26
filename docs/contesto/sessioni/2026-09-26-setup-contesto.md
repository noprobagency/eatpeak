# 2026-09-26 — Setup del contesto

**Versione** 3.0.1 · **branch** `task/setup-contesto` · in attesa di merge.

**Richiesta.** Un setup ultra preciso della cartella: `CLAUDE.md`, uno
storico, changelog e memo, in più documenti ordinati, con versionamento e
changelog a ogni modifica, così che una sessione nuova sia già pronta e si
possa lavorare task per task su ogni sezione del progetto. Poi pushare.

**Fatto.**
- `CLAUDE.md` alla radice: il progetto in cinque righe, le sette regole, il
  ciclo di un task, dove sta cosa, i comandi, le trappole. Importa da solo
  `01-stato.md` e `05-memo-progetto.md`.
- `CHANGELOG.md` alla radice: una voce per commit, per versione, dalla 1.0.
- `docs/contesto/`: indice, stato, storico, decisioni (D01–D20), backlog per
  area, memo di progetto, mappa del repo, procedure, e i log di sessione
  (1.0, 2.0, header, 3.0, questo).
- README aggiornato, `package.json` a 3.0.1.

**Scelte.** Il file dei fatti si chiama "memo di progetto" perché il termine
più ovvio è un claim vietato dal linter, che scansiona anche `docs/`. Il
merge su `main` resta al proprietario (D20): i permessi della sessione lo
bloccano e non si aggirano.

**Prossimo.** Il proprietario lancia il merge; alla sessione dopo si chiude
lo stato (INFRA-01) e si prende un task dal backlog.
