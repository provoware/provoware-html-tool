# ProvoWare HTML Tool

## Statusanzeige (aktuell)
- Erledigte Punkte gesamt: 8
- Offene Punkte gesamt: 1
- Entwicklungsfortschritt: 90%

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
  - Startstatus reagiert jetzt auf Online-/Offline-Wechsel in `assets/js/core.js`.
  - Statustext passt sich automatisch an die Verbindungsart an.
  - Doku- und Indexstand auf aktuellen Zustand aktualisiert.

## Aktueller Stand
- Lokaler Offline-Start ist sichtbar und ohne Zusatzdienste nutzbar.
- Dashboard-Skelett ist als stabile Basis vorhanden.
- Basis-Statuswechsel im JavaScript-Core ist aktiv und reagiert auf Verbindungswechsel.

## Nächste Schritte (kurz)
1. Muster-Modul `datenbank_baukasten` im Mindestumfang anlegen.
2. Startstruktur für Modul-Registrierung auf das Muster-Modul erweitern.
3. Kleine Fehlerhinweise für fehlende Modulelemente ergänzen.

## Festgelegter Start-Scope
- Offline-fähiger Start mit statischem Einstiegspunkt.
- Dashboard-Skelett als minimale UI-Basis.
- Schlanker JavaScript-Core für Startfluss und Modul-Registrierung.
- Ein Modul-Muster: `datenbank_baukasten`.
- Modul-Mindestteile: `manifest`, `config`, `texts`, `schema`, `logic`.
- Start-Dokumentation nur in `README.md` und `todo.txt`.

## Empfehlungsliste (kurz)
- Nächstes Patchziel auf P4 begrenzen, damit das Modulmuster sauber entsteht.
- Verbindungsstatus-Texte in einfacher Sprache beibehalten.
- `INDEX.md` weiterhin direkt nach Dateiänderungen aktualisieren.

## Befehle für Laien (einfach)
- Status prüfen: `git status`
- Änderungen ansehen: `git diff`
- Projektdateien auflisten: `find . -maxdepth 3 -type f | sort`
- Letzte Commits sehen: `git log --oneline -n 5`
