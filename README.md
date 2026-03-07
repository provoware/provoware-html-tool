# ProvoWare HTML Tool

## Statusanzeige (aktuell)
- Erledigte Punkte gesamt: 12
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
  - `assets/css/base.css` (Layout im Panel-Stil mit Rasterfläche)
  - `assets/js/core.js` (Startfluss, Modul-Check und Todo-Logik)
- Module:
  - `modules/datenbank_baukasten/*` (Muster-Modul)
  - `modules/todo_kalender_erinnerung/*` (Todo, Kalenderdatum, Erinnerung)
- Umfang dieser Iteration:
  - Dashboard visuell am Bildbeispiel ausgerichtet (runde Panels, Verlauf, Rasterfläche).
  - Todo-Bereich klarer segmentiert (Statusblock, Eingabe, Liste, Footer-Chips).
  - Nutzerfreundlichkeit verbessert (bessere Leseflächen und klarere optische Reihenfolge).

## Aktueller Stand
- Lokaler Offline-Start ist sichtbar und ohne Zusatzdienste nutzbar.
- Modulprofil-Check prüft zwei Modulprofile konsistent.
- Todo-Eingabe ist direkt im Dashboard nutzbar.
- Aufgaben zeigen Fälligkeitsdatum und Erinnerungszeit.
- Erreichte Erinnerungen werden in der Liste markiert.

## Nächste Schritte (kurz)
1. Aufgaben lokal speichern (z. B. `localStorage`), damit sie nach Neustart bleiben.
2. Kleine Filter ergänzen (heute, diese Woche, erledigt).
3. Optional später Browser-Hinweis (Notification API) ergänzen.

## Festgelegter Start-Scope
- Offline-fähiger Start mit statischem Einstiegspunkt.
- Dashboard-Skelett als minimale UI-Basis.
- Schlanker JavaScript-Core für Startfluss und Modul-Registrierung.
- Modul-Mindestteile: `manifest`, `config`, `texts`, `schema`, `logic`.
- Start-Dokumentation nur in `README.md` und `todo.txt`.

## Empfehlungsliste (kurz)
- Bei neuen UI-Blöcken zuerst Kontrast prüfen, dann Farben anpassen.
- Interaktive Bereiche (Formular/Liste) visuell als eigene Segmente halten.
- Modulprofil-Liste erst dynamisieren, wenn mehr Module da sind.
- `INDEX.md` weiterhin direkt nach Dateiänderungen aktualisieren.

## Befehle für Laien (einfach)
- Status prüfen: `git status`
- Änderungen ansehen: `git diff`
- Projektdateien auflisten: `find . -maxdepth 4 -type f | sort`
- Letzte Commits sehen: `git log --oneline -n 5`
