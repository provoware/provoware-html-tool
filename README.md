# provoware-html-tool

Ein leicht verständliches Start- und Qualitäts-Tool für ein HTML-Dashboard mit Fokus auf Barrierefreiheit, klaren Meldungen und stabilen Standardabläufen.

## Schnellstart
```bash
bash start.sh
```

## Hauptbefehle
```bash
./start.sh --help
./start.sh --check
./start.sh --repair
./start.sh --format
./start.sh --test
./start.sh --dashboard-template
./start.sh --release-check
```

## Automatische Gates (in Reihenfolge)
1. `python -m compileall -q .`
2. `bash tools/run_quality_checks.sh`
3. `python tools/smoke_test.py`
4. `bash start.sh`
5. Mini-UX-Check (manuell, 2 Minuten)

## Start-Routine (vollautomatisch)
`start.sh` prüft Voraussetzungen, versucht fehlende Werkzeuge automatisch zu reparieren (Repair = automatische Behebung) und gibt klare nächste Schritte aus.

### Erwartete Mindestausgabe
- Geprüft: …
- Fehlt: …
- Automatisch gelöst: …
- Nächster Schritt: …

## Projektstruktur (Wartbarkeit)
- `system/` → stabile Kernlogik (in Vorbereitung)
- `config/` → konfigurierbare Einstellungen (`messages.json`, `themes.json`)
- `data/` → variable Laufzeitdaten (`version_registry.json`)
- `templates/` → HTML-Vorlagen für die Oberfläche
- `tools/` → Qualitäts- und Smoke-Checks
- `logs/` → Laufzeitprotokolle

## Theme- und Kontrast-Stand
- Die Oberfläche unterstützt `high-contrast`, `light` und `dark`.
- Theme-Werte sind zentral in `config/themes.json` hinterlegt.
- Template und Start-Routine validieren Theme-Eingaben und geben klare Fehlertexte mit Next Steps aus.

## Debugging und Logging
```bash
./start.sh --check --debug
cat logs/start.log
```

## Best Practices für Teams
1. Vor Änderungen `./start.sh --check` ausführen.
2. Vor Merge `./start.sh --format && ./start.sh --test` ausführen.
3. Für Verbesserungen `./start.sh --doctor` nutzen.
4. Für die GUI-Vorlage `./start.sh --dashboard-template` nutzen.
5. Nach jeder Iteration `todo.txt`, `CHANGELOG.md` und `data/version_registry.json` aktualisieren.

## Release-Status
- Fortschritt: `48%`
- Abgeschlossen:
  - Automatische Repair- und Quality-Routine in `start.sh`
  - Dashboard-Musterseite mit Theme-Umschalter, Fehlerdialog und Ergebnisbereich
  - Theme-Konfiguration in `config/themes.json` mit Validierung in Start- und Smoke-Routine
  - A11y-Erweiterungen: Skip-Link, `aria-modal`, Fokusfreundliche Elemente und klare Next Steps
- Offen:
  - Weitere Auslagerung von Start-Kernlogik in `system/`
  - Automatischer WCAG-Kontrasttest als separater Check
- Nächster Schritt: Theme-Farben aus dem Template in eine gemeinsame Konfigurationsdatei auslagern und automatisch gegen Kontrastregeln prüfen.
