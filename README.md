# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 3 (siehe `todo.txt`)
- Offene Punkte: 12 (siehe `todo.txt`)
- Fortschritt: 20%

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `index.html` (Hauptoberfläche)
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
  - `data/profile-archive.json`, `data/templates-archive.json`
  - `data/dashboard3-notes/`
- **Tests**
  - `tests/services/module-registry.test.js`
  - `tests/services/ui-action-handlers.smoke.test.js`
  - `tests/start-files/start-import-resolution.test.js`

## Was in dieser Iteration bereinigt wurde
- `AGENTS.md` wurde stark fokussiert und laienfreundlich umgebaut.
- Überholte Doku-Reste (sehr lange Historienblöcke) wurden aus `README.md` und `TOOL_TUTORIAL.md` entfernt.
- `INDEX.md` wurde neu auf den aktuellen Stand gebracht.

## Laien-Befehle (unten)
- App lokal öffnen:
  - `index.html` im Browser öffnen
- Kleiner Testlauf:
  - `node --test tests/services/module-registry.test.js`
- Startdatei-Check:
  - `node --test tests/start-files/start-import-resolution.test.js`

## Kurze Empfehlungsliste
1. Erst immer `Ordner wählen`, dann `Selbsttest starten`.
2. Bei Fehlern zuerst in `todo.txt` nach offenem Punkt suchen.
3. Nur kleine, klar begründete Änderungen je Iteration machen.
