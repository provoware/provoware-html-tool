# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 9 (siehe `todo.txt`)
- Offene Punkte: 7 (siehe `todo.txt`)
- Fortschritt: 56%

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `laienstart.html` (**Team-Standard-Einstieg**, transparenter Startpfad)
  - `index.html` (Hauptoberfläche, wird nach erfolgreichem Start automatisch geöffnet)
  - `*_start.html` (Einzelstart pro Modul)
- **Frontend**
  - `css/app.css`
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
- **Adapter und Services**
  - `js/adapters/*`
  - `js/services/*`
- **Module**
  - `modules/backup_funktions_modul`
  - `modules/datenbank_baukasten`
  - `modules/debugging_modul`
  - `modules/logging_modul`
  - `modules/todo_kalender_erinnerung`
  - `modules/wiki_notiz_wissen`
- **Daten**
  - `data/app-config.json`, `data/themes.json`, `data/ui_texts.json`
  - `data/module-registry.json`, `data/project-structure.json`
  - `data/laienstart-required-files.json` (konfigurierbare Dateiliste für den Startcheck)
  - `data/profile-archive.json`, `data/templates-archive.json`
  - `data/dashboard3-notes/`
- **Tests**
  - `tests/services/module-registry.test.js`
  - `tests/services/project-selftest.test.js`
  - `tests/services/ui-action-handlers.smoke.test.js`
  - `tests/services/startup-check.test.js`
  - `tests/start-files/start-import-resolution.test.js`
  - `tests/adapters/desktop-filesystem.test.js`

## Was in dieser Iteration bereinigt wurde
- Beim Start wird die lokale Schreibfreigabe jetzt einmal per Dialog abgefragt und als Entscheidung gemerkt.
- Die Rechteprüfung fragt Schreibrechte nur noch dann aktiv an, wenn diese Entscheidung auf „Ja" steht.
- `runStartupCheck` nutzt denselben Schreibwunsch, damit Startprüfung und Ordneraktion konsistent bleiben.
- Neuer Test prüft, dass der Startup-Check den Schreibwunsch korrekt an die Rechteprüfung weitergibt.
- `README.md`, `TOOL_TUTORIAL.md` und `INDEX.md` auf den neuen Stand gebracht.

## Laien-Befehle (unten)
- Team-Start (empfohlen):
  - `laienstart.html` im Browser öffnen
- App direkt öffnen (nur wenn Startcheck bereits ok ist):
  - `index.html` im Browser öffnen
- Startcheck-Dateiliste anpassen:
  - `data/laienstart-required-files.json` bearbeiten
- Kleiner Testlauf:
  - `node --test tests/services/startup-check.test.js`
- Startdatei-Check:
  - `node --test tests/start-files/start-import-resolution.test.js`

## Kurze Empfehlungsliste
1. Im Team immer zuerst `laienstart.html` nutzen, damit alle denselben transparenten Pfad sehen.
2. Beim ersten Start die Schreibfrage bewusst beantworten; bei „Nein" läuft die App im sicheren Lesemodus.
3. Erweiterungen nur in `data/laienstart-required-files.json` eintragen, nicht direkt im HTML.
