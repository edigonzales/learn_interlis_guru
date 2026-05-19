# INTERLIS Lab Demo mit Biblios


Dieses Demo zeigt die `interlis-lab-web-component` in einer kleinen Biblios-Doku mit fünf aufeinander aufbauenden INTERLIS-Lernfragen.

- Biblios-Quelle: aktuelles Thoth-Repo via `--use-local-working-tree`
- Component-Version: `0.1.11`

## Starten


## Inhalt

Die Übungen werden bewusst schrittweise anspruchsvoller:

1. Erstes Attribut in einer Klasse
2. Pflichtfeld und Zahlenbereich
3. Eigene `DOMAIN` plus Enumeration
4. Debugging von `END`-Blöcken
5. Erste `ASSOCIATION`

## Hinweise

- Die Biblios-Quelle zeigt auf `file:///Users/stefan/sources/thoth` und verwendet `start_path: .demo-ili-lab/docs-src`.
- Das Demo ist auf den aktuellen Git-Branch `main` konfiguriert.
- Beim Build wird `thoth-biblios` mit `-PinterlisLabVersion=0.1.11` gebaut, damit genau diese veröffentlichte Package-Version verwendet wird.
- `build.sh` nutzt intern einen kurzen `serve`-Lauf, weil Biblios den lokalen Working Tree nur dort direkt rendert.
