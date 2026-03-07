# ProvoWare HTML Tool

## Statusanzeige (aktuell)
- Erledigte Punkte gesamt: 8
- Offene Punkte gesamt: 0
- Entwicklungsfortschritt: 100%

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
  - `assets/js/core.js` (Startfluss mit Statusanzeige und Modul-Check)
- Modul-Muster:
  - `modules/datenbank_baukasten/manifest.json`
  - `modules/datenbank_baukasten/config.json`
  - `modules/datenbank_baukasten/texts.json`
  - `modules/datenbank_baukasten/schema.json`
  - `modules/datenbank_baukasten/logic.js`
- Umfang dieser Iteration:
  - Muster-Modul `datenbank_baukasten` als kopierbares Datei-Set angelegt.
  - Startstruktur für Modul-Registrierung auf das Muster-Modul erweitert.
  - Einfacher Hinweis bei unvollständigem Modul im Core ergänzt (Robustheit).

## Aktueller Stand
- Lokaler Offline-Start ist sichtbar und ohne Zusatzdienste nutzbar.
- Dashboard-Skelett ist als stabile Basis vorhanden.
- Modul-Muster ist vollständig und direkt kopierbar.

## Nächste Schritte (kurz)
1. Optional zweites Modul nach gleichem Muster testen.
2. Modul-Liste später von statisch auf dynamisch umstellen.
3. Fehlhinweise je Moduldatei bei Bedarf weiter verfeinern.

## Festgelegter Start-Scope
- Offline-fähiger Start mit statischem Einstiegspunkt.
- Dashboard-Skelett als minimale UI-Basis.
- Schlanker JavaScript-Core für Startfluss und Modul-Registrierung.
- Ein Modul-Muster: `datenbank_baukasten`.
- Modul-Mindestteile: `manifest`, `config`, `texts`, `schema`, `logic`.
- Start-Dokumentation nur in `README.md` und `todo.txt`.

## Empfehlungsliste (kurz)
- Beim nächsten Modul exakt die fünf Mindestteile aus dem Muster übernehmen.
- Erst bei mehreren Modulen auf automatische Verzeichnis-Leselogik erweitern.
- `INDEX.md` weiterhin direkt nach Dateiänderungen aktualisieren.

## Befehle für Laien (einfach)
- Status prüfen: `git status`
- Änderungen ansehen: `git diff`
- Projektdateien auflisten: `find . -maxdepth 4 -type f | sort`
- Letzte Commits sehen: `git log --oneline -n 5`
