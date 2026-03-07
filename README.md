# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 52
- Offene Punkte: 0
- Fortschritt: 100%

## Aktuelle Toolstruktur und Toolumfang
- Kernstart:
  - `index.html`
  - `css/app.css`
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
- Adapter-Layer:
  - `js/adapters/filesystem-adapter.js`
  - `js/adapters/browser-filesystem.js`
  - `js/adapters/desktop-filesystem.js`
- Services:
  - `js/services/config-loader.js`
  - `js/services/startup-check.js`
  - `js/services/project-selftest.js`
  - `js/services/logger.js`
  - `js/services/module-registry.js` (Modul- und Vorlagenstatus)
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
- Klare Trennung in UI, State, Adapter, Services, Daten.
- Startreihenfolge fest eingebaut: Config -> Theme -> Adapter -> Startup-Check -> UI.
- Selbsttest als erster Kernschritt umgesetzt.
- Projektstruktur-Regeln zentral in `data/project-structure.json`.
- Einheitliche Adapter-API mit Standardantwort (`ok`, `code`, `message`, `data`).
- Fünf Themes als Tokens und zentrale UI-Texte aus JSON.
- Statuspanel und Logpanel für laienfreundliche Sicht.
- Letzter gewählter Ordnername wird lokal gemerkt und beim Start angezeigt.
- Neue Tool-Optik als Standard aktiviert (Größen, Raster, Karten-Look).
- Vollautomatische Text-Formatierung für Checks, Logs und Start-Hinweise ergänzt.
- Lesbarkeit in Check- und Log-Karten gezielt verbessert (Zeilenfluss, Umbruch, Zeitspalten).
- Statussymbole ergänzt: Ampelstatus zeigt jetzt zusätzlich ✔ / ⚠ / ✖ für klare Erkennung bei schwachem Kontrast.
- Statusbereich Lesen/Schreiben/Struktur nutzt jetzt ebenfalls einheitlich ✔ / ⚠ / ✖.
- Status-Visuals wurden in `js/status-visuals.js` ausgelagert, damit weitere UI-Teile dieselbe Ampel-Logik nutzen können.
- Layout und Kartenoptik wurden näher an die Vorlagenstruktur angepasst (Titelband, linke Leiste, großes Rasterfeld, rechte Statuskachel, Segment-Fußleiste).
- Standardprofil wird jetzt beim Start und beim Archivladen klar gesetzt, damit kein verstecktes Profil `undefined` entstehen kann.
- Optionaler Diagnose-Export als JSON ergänzt (inklusive Status, Selbsttest, Profil-Statistik und letzter Meldungen).
- Modernere UI mit ruhigerem Farbsystem, klareren Karten und besserem Kontrast ergänzt.
- Nutzerführung verbessert durch klarere Fokus- und Hover-Zustände bei Schaltflächen und Eingabefeldern.
- 3x3 Panel-Grid im Mittelbereich mit Fensterkarten und Maximize-Funktion ergänzt.
- Linke und rechte Seitenleiste sind jetzt ein- und ausklappbar, damit mehr Platz für Module entsteht.
- Modul-Registry-Check ergänzt: Das Dashboard zeigt jetzt direkt, wie viele Module vollständig verbunden sind (z. B. 2/2).
- Vorlagen-Design-Status ergänzt: Das Dashboard zeigt jetzt klar, dass die Asset-Vorlage aktuell nicht eingebunden ist.
- Robuste, inhaltliche Modulprüfung ergänzt: Zusätzlich zur Dateiprüfung werden jetzt Manifest- und JSON-Grundfelder geprüft.

## Offene Punkte
- Aktuell keine offenen Pflichtpunkte.

## Laien-Befehle unten
- Status prüfen: `git status`
- Änderungen sehen: `git diff --stat`
- Projektdateien auflisten: `find . -path './.git' -prune -o -type f -print | sort`
- Letzte Commits: `git log --oneline -n 5`

## Kurze Empfehlungsliste
- Bei vielen Modulen zuerst Seitenleisten einklappen, dann im 3x3-Raster arbeiten.
- Erst immer „Ordner wählen“, dann „Selbsttest starten“.
- Danach das Profil oben im Archiv wählen und Einträge je Bereich ergänzen.
- Für schnellen Mix zuerst Schnellbutton (1/3/5) klicken, dann Ergebnis nutzen.
- Empfehlung 1: Vor großem Import erst Export machen (Backup als JSON).
- Empfehlung 2: Bei vielen Einträgen Sortierung auf „Alphabetisch“ lassen.
- Empfehlung 3: Für Vorlagen-Look die Fensterbreite möglichst über 1200 px halten.
- Empfehlung 4: Wenn die Fußleiste zu voll wirkt, erst über „Selbsttest starten“ neue klare Log-Einträge erzeugen.
- Empfehlung 5: Vor dem ersten Speichern kurz prüfen, ob oben im Archiv ein Profil ausgewählt ist.

## Iterationsprotokoll (kompakt)
- Patchgrund 1: Nutzerwunsch nach persistentem Profil-Archiv inkl. Duplikatprüfung und Bearbeitung.
- Patchgrund 2: Nutzerwunsch nach Zufallsmix, Mengensteuerung, Auto-Copy und Logging.
- Betroffene Dateien: `index.html`, `css/app.css`, `js/app.js`, `js/ui.js`, `js/state.js`, `js/services/profile-archive.js`, `data/project-structure.json`, `data/profile-archive.json`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS/JSON-Syntax und direkt betroffene UI-Ausgabe geprüft.
- Patchgrund 1: Einheitliches Muster für Statussymbole auch bei Lesen/Schreiben/Struktur.
- Patchgrund 2: Wartbarkeit verbessert durch Auslagerung der Status-Visuals in eine kleine Hilfsdatei.
- Betroffene Dateien: `js/ui.js`, `js/status-visuals.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene UI-Ausgabe geprüft.
- Patchgrund 1: Nutzerwunsch nach stärkerer Übereinstimmung mit der Design-Vorlage (Layout, Darstellung, Struktur).
- Patchgrund 2: Nutzerfreundlichkeit verbessert durch klarere Kachelbereiche und visuell getrennte Aktionszonen.
- Betroffene Dateien: `index.html`, `css/app.css`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur direkt betroffene HTML/CSS-Ausgabe sowie relevante Syntax geprüft.
- Patchgrund 1: Robustheit im Profil-Archiv verbessert, damit Aktionen nie in ein implizites `undefined`-Profil schreiben.
- Patchgrund 2: Nutzerführung verbessert durch klaren Profil-Standardwert im App-Start.
- Betroffene Dateien: `js/app.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Profil-Logik geprüft.
- Patchgrund 1: Rechteanzeige bei `nur lesen` klarer gemacht, damit der Status ohne Rückfrage verständlich bleibt.
- Patchgrund 2: Hilfe für Laien erweitert, damit die neue Anzeige direkt geprüft werden kann.
- Betroffene Dateien: `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Status-Ausgabe geprüft.
- Patchgrund 1: Letzten offenen Punkt abgeschlossen: optionaler Diagnose-Export als eigene Aktion ergänzt.
- Patchgrund 2: Nutzerhilfe erweitert, damit Diagnose-JSON direkt erzeugt und geprüft werden kann.
- Betroffene Dateien: `index.html`, `js/app.js`, `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/JS-Syntax sowie direkt betroffene Ausgabe geprüft.

- Patchgrund 1: Nutzerwunsch nach modernem, übersichtlichem Layout bei gleicher Funktion.
- Patchgrund 2: Nutzerfreundlichkeit verbessert durch klarere Kontraste, Fokusrahmen und Hover-Feedback.
- Betroffene Dateien: `css/app.css`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene CSS-Syntax und direkt betroffene UI-Ausgabe geprüft.

- Patchgrund 1: Konkrete Nutzerforderung nach neuem Layout mit 3x3-Modulraster und ein/ausklappbaren Seitenleisten.
- Patchgrund 2: Nutzbarkeit verbessert durch Fensterkarten mit Standardoptionen und Maximize auf Toolgröße.
- Betroffene Dateien: `index.html`, `css/app.css`, `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/CSS/JS-Syntax und direkt betroffene UI-Ausgabe geprüft.

- Patchgrund 1: Ursache für „Module funktionieren nicht“ sichtbar machen (fehlende Laufzeit-Verdrahtung war bisher nicht transparent).
- Patchgrund 2: Ursache für „Vorlagen-Design nicht umgesetzt“ im UI klar erklären (Assets existieren, sind aber nicht eingebunden).
- Betroffene Dateien: `js/services/module-registry.js`, `js/app.js`, `js/state.js`, `js/ui.js`, `index.html`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/JS-Syntax und direkt betroffene UI-Ausgabe geprüft.
- Patchgrund 1: Modulstatus robuster gemacht, damit nicht nur Dateiexistenz, sondern auch inhaltlich valide JSON/Manifest-Felder geprüft werden.
- Patchgrund 2: Laientaugliche Fehlersicht verbessert durch klare Kurzmeldung je defektem Modul.
- Betroffene Dateien: `js/services/module-registry.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Status-Ausgabe geprüft.
