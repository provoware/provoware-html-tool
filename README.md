# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 49
- Offene Punkte: 2
- Fortschritt: 96%

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
  - `js/services/profile-archive.js` (neues Profil-Archiv)
- Zentrale Daten:
  - `data/app-config.json`
  - `data/themes.json`
  - `data/ui_texts.json`
  - `data/project-structure.json`
  - `data/profile-archive.json` (JSON-Archiv für Profile)

## Erledigte Kernpunkte
- Neues Profil-Modul für Genres, Stimmungen und Stile im Hauptbereich ergänzt.
- Profilbasiertes Speichern (HardTechno, Chill, Hörspiele) mit JSON-Persistenz ergänzt.
- Duplikatprüfung für Eingabe und Import/Normalisierung ergänzt.
- Enter als Bestätigung plus Speichern-Buttons ergänzt.
- Bearbeiten, Löschen und Sortieren (alphabetisch / Erstellzeit) ergänzt.
- Import/Export als JSON-Textbereich ergänzt.
- Statistik je Kategorie plus Gesamtmenge ergänzt.
- Zufallsmix-Generator mit Bereichs-Auswahl, Mengenfeldern und Schnellbuttons ergänzt.
- Mix-Ausgabe wird automatisch in Zwischenablage kopiert (wenn Browser erlaubt) und geloggt.

## Offene Punkte
1. Diagnose-Export als optionales Modul ergänzen.
2. Erweiterte Rechteanzeige (nur Lesen) visuell deutlicher machen.

## Laien-Befehle unten
- Status prüfen: `git status`
- Änderungen sehen: `git diff --stat`
- Projektdateien auflisten: `find . -path './.git' -prune -o -type f -print | sort`
- Letzte Commits: `git log --oneline -n 5`

## Kurze Empfehlungsliste
- Erst immer „Ordner wählen“, dann „Selbsttest starten“.
- Danach das Profil oben im Archiv wählen und Einträge je Bereich ergänzen.
- Für schnellen Mix zuerst Schnellbutton (1/3/5) klicken, dann Ergebnis nutzen.
- Empfehlung 1: Vor großem Import erst Export machen (Backup als JSON).
- Empfehlung 2: Bei vielen Einträgen Sortierung auf „Alphabetisch“ lassen.

## Iterationsprotokoll (kompakt)
- Patchgrund 1: Nutzerwunsch nach persistentem Profil-Archiv inkl. Duplikatprüfung und Bearbeitung.
- Patchgrund 2: Nutzerwunsch nach Zufallsmix, Mengensteuerung, Auto-Copy und Logging.
- Betroffene Dateien: `index.html`, `css/app.css`, `js/app.js`, `js/ui.js`, `js/state.js`, `js/services/profile-archive.js`, `data/project-structure.json`, `data/profile-archive.json`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS/JSON-Syntax und direkt betroffene UI-Ausgabe geprüft.
