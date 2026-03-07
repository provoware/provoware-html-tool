# ProvoWare HTML Tool

## Statusanzeige (aktuell)
- Erledigte Punkte gesamt: 4
- Offene Punkte gesamt: 4
- Entwicklungsfortschritt: 50%

## Aktuelle Toolstruktur und Toolumfang (fehlerfrei umgesetzt)
- Steuerdateien:
  - `AGENTS.md` (Arbeitsregeln)
  - `todo.txt` (offene/erledigte Punkte)
  - `README.md` (Projektstatus)
  - `TOOL_TUTORIAL.md` (Kurzanleitung)
  - `INDEX.md` (aktueller Verzeichnisbaum + Dateiliste)
- Umfang dieser Iteration:
  - Struktur von `AGENTS.md` optimiert.
  - `todo.txt` auf nächste offene Punkte fokussiert.
  - Indexpflege eingeführt und dokumentiert.

## Aktueller Stand
- Werkzustand hergestellt.
- Projekt neu initialisiert.
- Arbeitsregeln präzisiert und strukturiert.
- Offene Punkte priorisiert und umsetzbar gehalten.
- Indexdatei für den aktuellen Projektbaum eingeführt.

## Nächste Schritte (kurz)
1. Arbeitspaket 1 minimal umsetzen (`index.html`, `assets/css/base.css`, `assets/js/core.js`).
2. Startdateien mit klaren Ein-Satz-Zwecken dokumentieren.
3. Muster-Modul `datenbank_baukasten` im Mindestumfang anlegen.

## Festgelegter Start-Scope
- Offline-fähiger Start mit statischem Einstiegspunkt.
- Dashboard-Skelett als minimale UI-Basis.
- Schlanker JavaScript-Core für Startfluss und Modul-Registrierung.
- Ein Modul-Muster: `datenbank_baukasten`.
- Modul-Mindestteile: `manifest`, `config`, `texts`, `schema`, `logic`.
- Start-Dokumentation nur in `README.md` und `todo.txt`.

## Empfehlungsliste (kurz)
- Nächstes Patchziel nur auf Arbeitspaket 1 begrenzen.
- Nach jedem Patch `INDEX.md` sofort mitziehen, damit nichts veraltet.
- Für jede neue Datei einen Ein-Satz-Zweck direkt in `README.md` ergänzen.

## Befehle für Laien (einfach)
- Status prüfen: `git status`
- Änderungen ansehen: `git diff`
- Projektdateien auflisten: `find . -maxdepth 3 -type f | sort`
- Letzte Commits sehen: `git log --oneline -n 5`
