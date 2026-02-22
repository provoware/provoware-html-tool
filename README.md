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
./start.sh --full-gates
./start.sh --release-check
```

## Automatische Gates (in Reihenfolge)
1. `python -m compileall -q .`
2. `bash tools/run_quality_checks.sh`
3. `python tools/smoke_test.py`
4. `bash start.sh`
5. Mini-UX-Check (manuell, 2 Minuten)

## Start-Routine (vollautomatisch)
`start.sh` prüft Voraussetzungen, versucht fehlende Werkzeuge automatisch zu reparieren (Repair = automatische Behebung), kann die Pflicht-Gates 1-5 strikt automatisch ausführen und gibt klare nächste Schritte aus.

### Erwartete Mindestausgabe
- Geprüft: …
- Fehlt: …
- Automatisch gelöst: …
- Nächster Schritt: …
- Statusbericht: logs/status_summary.txt (einfache Sprache für Screenreader)

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
- Fortschritt: `66%`
- Abgeschlossen:
  - Automatische Repair- und Quality-Routine in `start.sh`
  - Dashboard-Musterseite mit Theme-Umschalter, Fehlerdialog und Ergebnisbereich
  - Theme-Konfiguration in `config/themes.json` mit Validierung in Start- und Smoke-Routine
  - A11y-Erweiterungen: Skip-Link, `aria-modal`, Fokusfreundliche Elemente und klare Next Steps
  - Automatischer Mini-UX-Check (`--ux-check-auto`) prüft Hilfe-Texte, Next Steps und wichtige A11y-Marker im Template
  - Neuer WCAG-Kontrasttest (`python tools/check_theme_contrast.py`) als fester Teil von Repo-Quality und Smoke-Test
  - Full-Gates führen jetzt automatisiert Gates 1-5 aus (inklusive Mini-UX-Check)
- Offen:
  - Weitere Auslagerung von Start-Kernlogik in `system/`
  - CI-Anbindung für den neuen WCAG-Kontrasttest
  - CI-Anbindung für den neuen Mini-UX-Check
- Nächster Schritt: Die neuen Full-Gates in einer CI-Pipeline automatisch bei jedem Commit ausführen und bei Fehlern mit Statusbericht abbrechen.
