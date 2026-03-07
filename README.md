# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 42
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
- Zentrale Daten:
  - `data/app-config.json`
  - `data/themes.json`
  - `data/ui_texts.json`
  - `data/project-structure.json` (Single Source of Truth)

## Tool-Optik-Vorgabe (aus Designanalyse übernommen)
### 1) Designcharakter
- Kartenoptik (Panel-Look): jedes Hauptelement wirkt wie eine eigene Kachel.
- Weiche Rundungen: große Eckradien für ruhige, moderne Wirkung.
- Leichte Tiefe: dezenter Schatten für Trennung ohne harte Kanten.
- Ruhiger Hintergrund: heller Verlauf statt flacher Vollfarbe.

### 2) Layout und Struktur
- Drei Hauptspalten im Standardmodus:
  - links Aktionen,
  - Mitte Hauptinhalt,
  - rechts Status.
- Breitenlogik:
  - Mitte ist dominant (Mindestbreite 560px),
  - Seitenbereiche bleiben kompakt.
- Feste visuelle Ordnung durch klare Flächen pro Bereich (Header, Navigation, Main, Status, Footer).

### 3) Optische Rasterführung
- Panels bekommen ein schwaches Raster-Overlay.
- Ziel: technische, geordnete Oberfläche ohne Überladung.
- Raster bleibt absichtlich transparent, damit Inhalte klar lesbar bleiben.

### 4) Farb- und Größenvorgaben
- Standardtheme: `tool-optik-vorgabe-2026`.
- Eckradius: 18px.
- Primäre Tiefe: `0 10px 26px rgba(35,47,74,0.24)`.
- Buttons: Mindesthöhe 48px für bessere Trefffläche (Maus/Finger).
- Hauptbereich: Mindesthöhe 380px für stabile Inhaltswirkung.

### 5) Nutzerfreundlichkeit (Laientauglichkeit)
- Primäraktion bleibt farblich klar hervorgehoben.
- Sekundäraktionen bleiben neutral, aber deutlich klickbar.
- Titel und Untertitel sind oben zentral sichtbar und leicht erfassbar.

## Erledigte Kernpunkte
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
- Bei ⚠ Gelb oder ✖ Rot zuerst Rechte und fehlende Struktur lösen.
- Nach Neustart auf den Hinweis „zuletzt gewählt“ im Ordner-Status achten.
- Empfehlung 1: Für sehr kleine Bildschirme zuerst den Main-Bereich prüfen, dann Navigation öffnen.
- Empfehlung 2: Bei eigener Farbwahl den Kontrast von Überschrift und Buttontext immer gegenprüfen.

## Iterationsprotokoll (kompakt)
- Patchgrund 1: Statusfarben allein waren bei schwachem Kontrast nicht robust genug.
- Patchgrund 2: Wartbarkeit verbessert durch zentrales Status-Mapping für Symbol + Label.
- Betroffene Dateien: `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene UI-Ausgabe geprüft.
