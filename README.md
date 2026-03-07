# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 4 (siehe `todo.txt`)
- Offene Punkte: 11 (siehe `todo.txt`)
- Fortschritt: 27%

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `index.html` (Hauptoberfläche)
  - `laienstart.html` (automatischer, transparenter Startpfad für Einsteiger)
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
- Neue Datei `laienstart.html` ergänzt: prüft automatisch Kerndateien, zeigt Fortschritt/Status und bietet Auto-Korrektur mit Nutzerwahl per Dialog.
- `README.md`, `TOOL_TUTORIAL.md` und `INDEX.md` auf den neuen Startpfad aktualisiert.

## Laien-Befehle (unten)
- Empfohlener Start:
  - `laienstart.html` im Browser öffnen
- App lokal öffnen:
  - `index.html` im Browser öffnen
- Kleiner Testlauf:
  - `node --test tests/services/module-registry.test.js`
- Startdatei-Check:
  - `node --test tests/start-files/start-import-resolution.test.js`

## Kurze Empfehlungsliste
1. Für den sicheren Einstieg zuerst immer `laienstart.html` öffnen.
2. In der Startseite bei Problemen die Option `Automatisch korrigieren` nutzen.
3. Danach in der GUI `Ordner wählen` und `Selbsttest starten` ausführen.
