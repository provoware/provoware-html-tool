# ProvoWare HTML Tool

## Statusanzeige (aktuell)
- Erledigte Punkte gesamt: 6
- Offene Punkte gesamt: 2
- Entwicklungsfortschritt: 75%

## Aktuelle Toolstruktur und Toolumfang (fehlerfrei umgesetzt)
- Steuerdateien:
  - `AGENTS.md` (Arbeitsregeln)
  - `todo.txt` (offene/erledigte Punkte)
  - `README.md` (Projektstatus)
  - `TOOL_TUTORIAL.md` (Kurzanleitung)
  - `INDEX.md` (aktueller Verzeichnisbaum + Dateiliste)
- Startdateien:
  - `index.html` (offline ladbarer Einstieg mit Dashboard-Skelett)
  - `assets/css/base.css` (Basislayout und einfache Lesbarkeit)
  - `assets/js/core.js` (minimaler Startfluss mit Statusanzeige)
- Umfang dieser Iteration:
  - Arbeitspaket 1 minimal umgesetzt.
  - Startdateien mit klarer Funktion angelegt.
  - Doku- und Indexstand auf neuen Zustand aktualisiert.

## Aktueller Stand
- Lokaler Offline-Start ist sichtbar und ohne Zusatzdienste nutzbar.
- Dashboard-Skelett ist als stabile Basis vorhanden.
- Basis-Statuswechsel im JavaScript-Core ist aktiv.

## Nächste Schritte (kurz)
1. Muster-Modul `datenbank_baukasten` im Mindestumfang anlegen.
2. Startstruktur für Modul-Registrierung auf das Muster-Modul erweitern.
3. P5 weiter klein halten und nur verhaltensrelevante Doku pflegen.

## Festgelegter Start-Scope
- Offline-fähiger Start mit statischem Einstiegspunkt.
- Dashboard-Skelett als minimale UI-Basis.
- Schlanker JavaScript-Core für Startfluss und Modul-Registrierung.
- Ein Modul-Muster: `datenbank_baukasten`.
- Modul-Mindestteile: `manifest`, `config`, `texts`, `schema`, `logic`.
- Start-Dokumentation nur in `README.md` und `todo.txt`.

## Empfehlungsliste (kurz)
- Nächstes Patchziel auf P4 begrenzen, damit das Modulmuster sauber entsteht.
- In `core.js` eine kleine Modul-Liste erst nach P4 ergänzen, nicht vorher.
- `INDEX.md` weiterhin direkt nach Dateiänderungen aktualisieren.

## Befehle für Laien (einfach)
- Status prüfen: `git status`
- Änderungen ansehen: `git diff`
- Projektdateien auflisten: `find . -maxdepth 3 -type f | sort`
- Letzte Commits sehen: `git log --oneline -n 5`
