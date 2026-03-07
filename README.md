# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 13 (siehe `todo.txt`)
- Offene Punkte: 3 (siehe `todo.txt`)
- Fortschritt: 84%

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `laienstart.html` (**Team-Standard-Einstieg**, transparenter Startpfad)
  - `index.html` (Hauptoberfläche, wird nach erfolgreichem Start automatisch geöffnet)
  - `*_start.html` (Einzelstart pro Modul)
- **Frontend**
  - `css/app.css` (inkl. farbliche Hilfehinweise, Tastatur- und Drag&Drop-Stati)
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
  - `js/modules/guide-tools-module.js` (intuitive Führung für Anleitungsliste)
- **Module und Services**
  - `js/adapters/*`, `js/services/*`, `js/modules/*`
  - `modules/*` (fachliche Module)
- **Daten**
  - `data/app-config.json`, `data/themes.json`, `data/ui_texts.json`
  - `data/module-registry.json`, `data/project-structure.json`
  - `data/laienstart-required-files.json` (konfigurierbare Dateiliste für den Startcheck)
  - `data/profile-archive.json`, `data/templates-archive.json`
- **Tests und Checks**
  - `tests/services/*.test.js` (inkl. Import-/Export-Konsistenzcheck), `tests/adapters/*.test.js`, `tests/start-files/*.test.js`
  - `scripts/minimal-check.sh` (kleiner reproduzierbarer Syntax-/Struktur-Schnellcheck)
- **GitHub Workflows (Basis aktiv)**
  - `.github/workflows/ci.yml` (frühe Fehler durch Tests)
  - `.github/workflows/lint.yml` (frühe Syntax-/Stilfehler)
  - `.github/workflows/codeql.yml` (Sicherheitsanalyse)
  - Noch bewusst **nicht aktiv**: `dependabot.yml`, `release.yml`

## Was in dieser Iteration bereinigt wurde
- Hilfeelemente im Guide-Bereich verbessert: kurzer Bedienhinweis direkt am Index, klare ARIA-Beschriftung.
- Intuitive Toolführung ergänzt: Tastaturnavigation (Pfeile, Enter/Leertaste), visuelle Auswahlfarben, verständliche Statusfarben.
- Drag&Drop für die Reihenfolge ergänzt und direktes Feedback eingebaut.
- Dynamische Anpassung erweitert: Guide-Ansicht wechselt zwischen Split- und Stapelmodus je Fensterbreite.
- `README.md`, `TOOL_TUTORIAL.md` und `INDEX.md` aktualisiert.

## Wichtiger Hinweis zu Platzhaltern
- `assets/css/base.css` und `assets/js/core.js` liegen im Projekt als Vorlagen-Stand.
- Diese Vorlagen sind in `index.html` derzeit **nicht** aktiv eingebunden.
- Maßgeblich für den Live-Start sind weiter `css/app.css` und `js/app.js`.

## Laien-Befehle (unten)
- Team-Start (empfohlen):
  - `laienstart.html` im Browser öffnen
- App direkt öffnen (nur wenn Startcheck bereits ok ist):
  - `index.html` im Browser öffnen
- Lokale Tests starten:
  - `node --test`
- Lokalen Minimal-Check ausführen (empfohlen):
  - `bash scripts/minimal-check.sh`
- Nur JS-Syntax prüfen (direkt):
  - `find js tests -type f -name '*.js' -print0 | xargs -0 -n1 node --check`

## Kurze Empfehlungsliste
1. Erst die drei Basis-Workflows 1–2 Wochen stabil beobachten.
2. Danach erst `dependabot.yml` aktivieren, damit PR-Last klein bleibt.
3. Release-Workflow erst einführen, wenn Versionierung (Tags) klar geregelt ist.
4. Bei CI-Fehlern zuerst `node --test` lokal ausführen, dann gezielt nachbessern.
