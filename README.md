# ProvoWare HTML Tool

## Statusanzeige (aktuell)
- Erledigte Punkte gesamt: 11
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
  - `assets/css/base.css` (Basislayout und Formularstil)
  - `assets/js/core.js` (Startfluss, Modul-Check und Todo-Logik)
- Module:
  - `modules/datenbank_baukasten/*` (Muster-Modul)
  - `modules/todo_kalender_erinnerung/*` (Todo, Kalenderdatum, Erinnerung)
- Umfang dieser Iteration:
  - Neues Modul `todo_kalender_erinnerung` mit allen Mindestteilen angelegt.
  - Dashboard um eine einfache Todo-Liste mit Fälligkeitsdatum und Erinnerungszeit erweitert.
  - Reminder-Markierung ergänzt (nach Erreichung der Erinnerungszeit).
  - Doku- und Indexstand auf aktuellen Zustand aktualisiert.

## Aktueller Stand
- Lokaler Offline-Start ist sichtbar und ohne Zusatzdienste nutzbar.
- Modulprofil-Check prüft jetzt zwei Modulprofile konsistent.
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
- Erinnerungsintervall nur ändern, wenn es einen klaren Grund gibt.
- Bei neuen Formularfeldern einfache Validierung beibehalten.
- Modulprofil-Liste erst dynamisieren, wenn mehr Module da sind.
- `INDEX.md` weiterhin direkt nach Dateiänderungen aktualisieren.

## Befehle für Laien (einfach)
- Status prüfen: `git status`
- Änderungen ansehen: `git diff`
- Projektdateien auflisten: `find . -maxdepth 4 -type f | sort`
- Letzte Commits sehen: `git log --oneline -n 5`
