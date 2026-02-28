# Entwicklerdoku (strukturiert und praxisnah)

Diese Datei ist die zentrale Infodatei für das Tool.
Sie zeigt die Ordnerstruktur, wichtige Dateien und den empfohlenen Ablauf.

## 1) Ziel

- Klare Struktur für Wartbarkeit (leichte Pflege).
- Einfache, barrierefreie Texte.
- Vollautomatische Prüfung per `start.sh`.
- Einheitliche Standards für Qualität und Tests.

## 2) Ordner- und Dateistruktur

```text
provoware-html-tool/
├─ system-core/
│  ├─ json_store.js
│  ├─ registry_service.js
│  └─ self_repair.js
├─ system-module/
│  ├─ dashboard_model.js
│  └─ help_panel.js
├─ config/
│  ├─ messages_de.json
│  └─ manifests/
│     ├─ global.manifest.json
│     ├─ kernel.manifest.json
│     └─ registry.manifest.json
├─ data/
│  ├─ registry.json
│  └─ store.json
├─ tools/
│  ├─ help_cli.js
│  └─ start_routine.js
├─ templates/
│  ├─ dashboard.html
│  ├─ dashboard.js
│  ├─ help-panel.html
│  └─ help-panel.js
├─ test/
│  ├─ dashboard_model.test.js
│  ├─ json_store.test.js
│  ├─ registry_service.test.js
│  └─ start_routine.test.js
├─ docs/
│  ├─ ENTWICKLERDOKU.md
│  ├─ HILFE.md
│  └─ PROMPT_OPTIMIERT.md
├─ start.sh
├─ package.json
├─ README.txt
├─ CHANGELOG.md
├─ PROJECT_INFO.md
├─ SELFINFO.md
├─ MEMORY_FIXES.md
├─ QUESTIONS_TODO.md
└─ todo.txt
```

## 3) Kurz-Erklärung je Bereich

- `system-core/`: Kernlogik (stabil, nur gezielt ändern).
- `system-module/`: feste Module mit klarer Aufgabe.
- `config/`: Konfiguration (Einstellungen) und Prüfregeln.
- `data/`: veränderliche Daten (nicht als feste Logik nutzen).
- `tools/`: Start, Checks, Hilfswerkzeuge.
- `templates/`: Oberfläche (UI) und Interaktionen.
- `test/`: automatische Tests für Qualität.
- `docs/`: Hilfe und Entwicklerwissen.

## 4) Standard-Ablauf für Entwickler

1. Starten und alles prüfen:
   ```bash
   bash start.sh
   ```
2. Nur bei Bedarf manuell testen:
   ```bash
   npm test
   ```
3. Code formatieren:
   ```bash
   npm run format
   ```
4. Hilfe und Logs öffnen:
   ```bash
   node tools/help_cli.js logs
   ```

## 5) Vollständige Befehle (schnell kopierbar)

```bash
# 1) Komplettlauf mit Auto-Checks, Auto-Install und Feedback
bash start.sh

# 2) Unit-Tests (Einzeltests für Funktionen)
npm test

# 3) Formatierung (einheitlicher Stil)
npm run format

# 4) Test-Hilfe anzeigen
node tools/help_cli.js test

# 5) Logs prüfen
node tools/help_cli.js logs

# 6) Backups anzeigen
node tools/help_cli.js backups store

# 7) Reparatur starten
node tools/help_cli.js repair data/store.json data/store.backup.json
```

## 6) Was kann noch optimiert werden?

1. **Plugin-Loader minimal bauen**
   - Manifest lesen, Fehler isolieren, Kern schützen.
2. **Debug-Modus verbessern**
   - Fehlertext für Laien + technische Details im Log.
3. **Schema-Checks ausbauen**
   - Vor jedem Schreiben zusätzlich Strukturprüfung erzwingen.
4. **A11y-Tests automatisieren**
   - Tastaturpfade (Tab/Enter/Escape) per UI-Test prüfen.
5. **Theme-Tests ergänzen**
   - Kontrastwerte (Farbabstand) automatisiert messen.
6. **Daten-Backup sichtbarer machen**
   - Backup-Dialog in der UI mit klaren Schritten.
7. **CI-Pipeline ergänzen**
   - Gleiche Checks bei jedem Commit automatisch ausführen.

## 7) Laien-Vorschläge für sichere Nutzung

- Immer zuerst `bash start.sh` nutzen.
- Bei Fehlern zuerst „Erneut versuchen“.
- Wenn das nicht hilft: „Protokoll öffnen“.
- Danach erst „Reparatur starten“.
- Für bessere Lesbarkeit das Theme „Kontrast+“ wählen.
