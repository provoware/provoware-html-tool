# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 34
- Offene Punkte: 3
- Fortschritt: 92%

## Aktuelle Toolstruktur und Toolumfang
- Kernstart:
  - `index.html`
  - `css/app.css`
  - `js/app.js`, `js/ui.js`, `js/state.js`
- Adapter-Layer:
  - `js/adapters/filesystem-adapter.js`
  - `js/adapters/browser-filesystem.js`
  - `js/adapters/desktop-filesystem.js`
- Services:
  - `js/services/config-loader.js`
  - `js/services/startup-check.js`
  - `js/services/project-selftest.js`
  - `js/services/logger.js`
- Zentrale Daten:
  - `data/app-config.json`
  - `data/themes.json`
  - `data/ui_texts.json`
  - `data/project-structure.json` (Single Source of Truth)

## Erledigte Kernpunkte
- Klare Trennung in UI, State, Adapter, Services, Daten.
- Startreihenfolge fest eingebaut: Config -> Theme -> Adapter -> Startup-Check -> UI.
- Selbsttest als erster Kernschritt umgesetzt.
- Projektstruktur-Regeln zentral in `data/project-structure.json`.
- Einheitliche Adapter-API mit Standardantwort (`ok`, `code`, `message`, `data`).
- Vier Themes als Tokens und zentrale UI-Texte aus JSON.
- Statuspanel und Logpanel für laienfreundliche Sicht.

## Offene Punkte
1. Persistenz „letzten Projektordner merken“ vorbereiten.
2. Diagnose-Export als optionales Modul ergänzen.
3. Erweiterte Rechteanzeige (nur Lesen) visuell deutlicher machen.

## Laien-Befehle unten
- Status prüfen: `git status`
- Änderungen sehen: `git diff --stat`
- Projektdateien auflisten: `find . -path './.git' -prune -o -type f -print | sort`
- Letzte Commits: `git log --oneline -n 5`

## Kurze Empfehlungsliste
- Erst immer „Ordner wählen“, dann „Selbsttest starten“.
- Bei Gelb/Rot zuerst Rechte und fehlende Struktur lösen.
