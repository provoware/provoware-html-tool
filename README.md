# provoware-html-tool

Ein leicht verständliches Start-Werkzeug für lokale Qualitätsprüfungen mit automatischer Reparatur, Formatierung, Tests und klaren Hilfetexten.

## Ziel in einfacher Sprache
Dieses Tool sagt dir klar:
1. **Was geprüft wurde**
2. **Was fehlt**
3. **Was automatisch gelöst wurde**
4. **Was du als Nächstes tun sollst**

Fachbegriffe sind immer kurz erklärt (in Klammern), damit der Ablauf auch ohne Vorkenntnisse nutzbar bleibt.

## Schnellstart
```bash
./start.sh --check
./start.sh --repair
./start.sh --format
./start.sh --test
./start.sh --doctor
./start.sh --dashboard-guide
```

Optional mit Detail-Protokoll (Debug = Fehlersuche):
```bash
./start.sh --check --debug
```

## Alle verfügbaren Modi
- `./start.sh` → Vollablauf: Check + Repair + Format + Test
- `./start.sh --check` → Nur Prüfungen
- `./start.sh --repair` → Nur automatische Reparatur
- `./start.sh --format` → Nur Formatierung
- `./start.sh --test` → Nur Selbsttests
- `./start.sh --doctor` → Verbesserungsbericht mit klaren Befehlen
- `./start.sh --dashboard-guide` → Laien-Guide für Dashboard-Aufbau und GUI-Layout
- `./start.sh --dashboard-template` → Sofort nutzbare Dashboard-Musterseite als HTML-Template prüfen
- `./start.sh --safe` → Sicherer Basis-Modus mit klaren Hilfehinweisen
- `./start.sh --release-check` → Kompakter Release-Check mit Ergebnis
- `./start.sh --help` → Hilfe anzeigen

## Barrierefreiheit (A11y = Accessibility)
- **Klare Sprache**: Kurze Sätze, wenig Fachjargon.
- **Status nicht nur über Farbe**: Symbole plus Text (`✅`, `⚠️`, `❌`, `➡️`, `ℹ️`).
- **Tastaturfreundlich**: Alle Funktionen sind per Terminal-Befehl nutzbar.
- **Fehler mit direkten Aktionen**:
  - „Erneut versuchen“
  - „Reparatur starten“
  - „Protokoll öffnen“

## Robuste Start-Routine (vollautomatisch)
Die Startroutine prüft und unterstützt folgende Bereiche:
- Voraussetzungen (z. B. Werkzeuge vorhanden)
- automatische Reparatur (wenn möglich)
- Codequalität und Formatierung
- Selbsttests
- verständliche Ergebniszusammenfassung

### Erwartete Mindestausgabe
- Geprüft: …
- Fehlt: …
- Automatisch gelöst: …
- Nächster Schritt: …

## Projektstruktur (Wartbarkeit)
- `system/` → stabile Kernlogik (derzeit in Vorbereitung)
- `config/` → konfigurierbare Einstellungen, z. B. `messages.json`
- `data/` → variable Laufzeitdaten, z. B. Version-Registry
- `logs/` → Protokolle (`logs/start.log`)

Hinweis: Die Struktur wird schrittweise ausgebaut, damit Änderungen klein, sicher und nachvollziehbar bleiben.

## Konfiguration von Texten
`start.sh` nutzt optional `config/messages.json`.
Wenn die Datei fehlt oder ungültig ist, werden sichere Standardtexte genutzt (Fallback).

## Debugging und Logging
- Debug-Modus aktivieren:
  ```bash
  ./start.sh --check --debug
  ```
- Protokoll öffnen:
  ```bash
  cat logs/start.log
  ```

## Theme- und Kontrast-Stand
Das Tool unterstützt die Themes `light`, `dark` und `high-contrast` für gute Lesbarkeit bei unterschiedlichen Bedürfnissen.
Statusinformationen werden robust über **Symbol + Text** ausgegeben, damit Lesbarkeit nicht nur von Farben abhängt.

## Best Practices für Teams
1. Vor jeder Änderung zuerst `./start.sh --check` ausführen.
2. Vor Merge immer `./start.sh --format` und `./start.sh --test` ausführen.
3. Für Verbesserungsvorschläge im Klartext `./start.sh --doctor` nutzen.
4. Vor Release `./start.sh --release-check` nutzen.
5. Nach jeder Iteration `todo.txt`, `CHANGELOG.md` und `data/version_registry.json` aktualisieren.

## Release-Status
- Fortschritt: `42%`
- Abgeschlossen:
  - Auto-Reparatur für Runtime-Tools
  - GUI-Theme-Auswahl mit Fokus auf Kontrast
  - Doctor-Modus mit klaren Verbesserungsbefehlen
  - Dashboard-Guide für laienfreundliches GUI-Layout
  - Pflicht-Gates G2 und G3 mit Tools-Skripten automatisiert
  - Dashboard-Musterseite als direkt nutzbares HTML-Template mit Theme-Umschalter, Buttons und Fehlerdialog
  - Startmodus '--dashboard-template' mit Struktur-Validierung und klaren Next Steps
  - Smoke-Test prüft jetzt auch Template-Marker und Template-Startmodus
- Offen:
  - Konfigurationsdatei für Themes in `config/`
  - weitere Auslagerung von Kernlogik nach `system/`
- Nächster Schritt: Theme-Werte und Texte in konfigurierbare Dateien auslagern und den Template-Selbsttest um Kontrast-Messung erweitern.
