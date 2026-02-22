# provoware-html-tool

Leicht verständliches Werkzeug für ein barrierearmes HTML-Dashboard.

Das Projekt liefert eine **vollautomatische Start-Routine**, die Voraussetzungen prüft, Probleme möglichst selbst behebt und klare Nutzerhinweise ausgibt.

## Entwicklungsstand
- Fortschritt: **99%**
- **Abgeschlossen**
  - Start-Routine mit Auto-Check, Auto-Reparatur, Auto-Tests und Auto-Formatierung.
  - Feste Qualitäts-Gates (Syntax, Qualität, Smoke, End-to-End-Start, Mini-UX-Check).
  - Barrierefreiheit mit Tastaturfokus, Kontrast-Checks und verständlichen Fehlermeldungen.
  - Saubere Projektstruktur: System, Konfiguration, Werkzeuge und variable Daten sind getrennt.
  - Mehrere Themes für robustes Farb- und Kontrastverhalten.

- Responsive Feinanpassung für sehr kleine Displays (bis 420px) mit besserem Fokus, klaren Abständen und stabiler Lesbarkeit.

- Projekt-Routine beim GUI-Start: fragt den Projektordner ab, validiert den Pfad, erstellt fehlende Ordner automatisch im Nutzerverzeichnis und zeigt den aktiven Pfad im Dashboard.
- **Offen**
  - Optionaler CI-Job für Offline-Simulation (ohne Internet).
  - Optionale Kopplung des Modul-Starters an echte Backend-Module (Datenquellen).


## Hinweis zum GUI-Start (Hauptmodul)
Standardmäßig öffnet `bash start.sh` jetzt direkt die Hauptmodul-Ansicht (Dashboard) statt nur der Startstatus-Seite.

- Standard: `GUI_ENTRY=dashboard` (Hauptmodul)
- Alternative: `GUI_ENTRY=status` (nur Startstatus)
- Ungültige Werte werden validiert und mit klarer Fehlermeldung + Next Step abgewiesen.

## Schnellstart (für Einsteiger)
```bash
bash start.sh
```

Wenn etwas nicht funktioniert:
1. `bash start.sh --check` (prüft alle Voraussetzungen)
2. `bash start.sh --repair` (versucht Probleme automatisch zu beheben)
3. `bash start.sh --full-gates` (führt alle Pflichtprüfungen komplett aus)

## Wichtige Befehle mit einfacher Erklärung
```bash
bash start.sh --help            # zeigt alle Optionen
bash start.sh --check           # Auto-Prüfung (Checks)
bash start.sh --repair          # Auto-Reparatur (abhängige Pakete/Fehlerpfade)
bash start.sh --format          # Auto-Formatierung (einheitlicher Code-Stil)
bash start.sh --test            # automatische Tests
bash start.sh --full-gates      # alle Pflicht-Gates in Reihenfolge
bash start.sh --weakness-report # Bericht zu Schwachstellen
bash start.sh --release-check   # Release-Checkliste ausführen
python tools/smoke_test.py      # schneller Funktionstest
bash tools/run_quality_checks.sh # Qualitätsprüfungen für Repo
```

## Pflicht-Gates (Reihenfolge)
1. `python -m compileall -q .`
2. `bash tools/run_quality_checks.sh`
3. `python tools/smoke_test.py`
4. `bash start.sh`
5. Mini-UX-Check (deutsche Dialoge, Next Steps, Kontrast/Fokus)

## Nutzerfeedback der Start-Routine
Die Start-Routine meldet immer verständlich:
- **Geprüft:** Was wurde getestet?
- **Fehlt:** Was fehlt noch?
- **Gelöst:** Was wurde automatisch behoben?
- **Nächster Schritt:** Was soll ich jetzt tun?

## Ordnerstruktur (für Wartbarkeit)
- `system/` = stabile Kernlogik
- `config/` = Einstellungen und Themes
- `tools/` = Prüf- und Testskripte
- `templates/` = HTML-Vorlagen
- `data/` = variable Daten (z. B. Versionsregister)
- `logs/` = Protokolle für Debugging

## Barrierefreiheit (Accessibility)
- Einfache Sprache in Dialogen.
- Bedienung per Tastatur ohne Maus.
- Kontrast-Checks über mehrere Themes.
- Fehlertexte mit klaren, direkten Lösungsschritten.


## Professionelle Abhängigkeitsauflösung (neu)
Die Start-Routine kann Abhängigkeiten jetzt über eine zentrale Zuordnung in `config/dependency_map.json` auflösen.

- Vorteil: Paketnamen sind pro Paketmanager sauber gepflegt (apt, brew, pip).
- Praxis: `--repair` und Auto-Checks nutzen diese Zuordnung automatisch.
- Hilfe für Einsteiger: Bei Fehlern werden immer klare Next Steps ausgegeben (erneut versuchen, Reparatur starten, Protokoll öffnen).

## Offline-Fähigkeit (inklusive Playwright)
Die Start-Routine nutzt jetzt einen robusteren Offline-Weg:
- Browsercache-Ordner: `data/playwright-browsers`
- Wheel-Ordner für Python-Pakete: `data/offline_wheels`
- Repair-Logik: zuerst offline aus lokalen Artefakten, danach optional online

Beispiel (online vorbereiten, später offline nutzen):
```bash
python3 -m pip download playwright -d data/offline_wheels
PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 -m playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 tools/browser_e2e_test.py
```

## Debugging und Logging
```bash
bash start.sh --check --debug
cat logs/start.log
cat logs/status_summary.txt
```

## Team-Standardablauf
1. Vor jeder Änderung: `bash start.sh --check`
2. Vor Commit: `bash start.sh --format && bash start.sh --test`
3. Vor Merge: `bash start.sh --full-gates`
4. Nach jeder Iteration: `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json` aktualisieren

## Zwei kurze Laienvorschläge
- Starten Sie immer zuerst mit `--check`, das spart Zeit bei der Fehlersuche.
- Nutzen Sie bei Unsicherheit `--repair`; danach erneut `--check` ausführen.

## Detaillierter nächster Schritt (einfach erklärt)
Führen Sie `bash start.sh --full-gates` aus und lesen Sie danach `logs/status_summary.txt`.
So sehen Sie in Klartext, welche Prüfung erfolgreich war und welche nächste Aktion empfohlen wird.

## Projektordner-Routine (neu)
Beim Start der GUI läuft jetzt zuerst eine Projekt-Routine:
- Fragt den Projektordner ab (Interaktion im Terminal oder über `PROJECT_FOLDER=/pfad`).
- Prüft den Pfad per Input-Validierung.
- Erstellt fehlende Ordner transparent im Nutzerverzeichnis.
- Speichert den aktiven Pfad in `data/project_context.json` und zeigt ihn im Dashboard an.

Beispiele:
```bash
bash start.sh
PROJECT_FOLDER=/home/$USER/Provoware-Projekte/MeinProjekt bash start.sh
```


## Offline-Paket in einem Befehl (neu)
Für Systeme ohne Internet gibt es jetzt einen direkten Export:

```bash
bash start.sh --offline-pack
```

Was passiert automatisch:
1. Prüft und ergänzt Playwright-Artefakte (Wheels + Browsercache), soweit möglich.
2. Bündelt `data/offline_wheels` und `data/playwright-browsers` als Archiv in `data/`.
3. Zeigt klare Next Steps in einfacher Sprache.

Typischer Einsatz:
```bash
# Online vorbereiten
bash start.sh --offline-pack

# Archiv auf Offline-Rechner kopieren und dort entpacken
tar -xzf data/offline_bundle_YYYYMMDD_HHMMSS.tar.gz -C .
```
