# provoware-html-tool

Ein Werkzeug für ein barrierearmes HTML-Dashboard mit klarer Start-Routine, automatischen Prüfungen und verständlichen Fehlermeldungen in einfacher Sprache.

## Entwicklungsstand
- Fortschritt: **100%**
- Abgeschlossen:
  - Vollautomatische Start-Routine mit Check, Reparatur (automatische Behebung), Tests und Formatierung.
  - Pflicht-Gates 1–5 als feste Reihenfolge mit klaren Statusmeldungen.
  - Fokus auf Barrierefreiheit: Skip-Link, Tastatur-Navigation, Kontrasthinweise, klare Next Steps.
  - Modularer HTML-Hauptbereich mit Modul-Starter (Auswahl + validierter Start + Next-Step-Hinweis).
  - Debug-Log mit Verlauf (letzte 5 Ereignisse) für transparentes Nutzerfeedback.
  - Getrennte Struktur für Wartbarkeit: `system/`, `config/`, `tools/`, `templates/`, `data/`.
- Offen:
  - Optional: CI-Artefakte für alle Browser langfristig archivieren.
  - Optional: Theme-Farbwerte weiter feinjustieren.
  - Optional: Modul-Starter später an echte Backend-Module koppeln.

## Schnellstart (für Laien)
```bash
bash start.sh
```

Wenn etwas nicht klappt:
1. `bash start.sh --check`
2. `bash start.sh --repair`
3. `bash start.sh --full-gates`

## Wichtige Befehle
```bash
bash start.sh --help
bash start.sh --check
bash start.sh --repair
bash start.sh --format
bash start.sh --test
bash start.sh --full-gates
bash start.sh --weakness-report
bash start.sh --release-check
python tools/smoke_test.py
bash tools/run_quality_checks.sh
```

## Pflicht-Gates (automatisch)
1. `python -m compileall -q .`
2. `bash tools/run_quality_checks.sh`
3. `python tools/smoke_test.py`
4. `bash start.sh`
5. Mini-UX-Check (deutsche Texte, klare Fehlerwege, Kontrast/Fokus)

## Start-Routine mit Nutzerfeedback
Die Start-Routine prüft automatisch Voraussetzungen (Dependencies = benötigte Pakete), zeigt fehlende Teile an und versucht sinnvolle automatische Reparaturen.

Klare Rückmeldung:
- Geprüft: Was wurde getestet?
- Fehlt: Was fehlt noch?
- Gelöst: Was wurde automatisch behoben?
- Nächster Schritt: Was soll ich jetzt tun?

## Projektstruktur
- `system/` → stabile Kernlogik
- `config/` → Konfigurationen (Themes, Einstellungen)
- `data/` → variable Daten (z. B. Versionsregister)
- `templates/` → HTML-Vorlagen
- `tools/` → Prüf- und Testskripte
- `logs/` → Protokolle für Analyse

## Barrierefreiheit (A11y = Accessibility)
- Klare, einfache Sprache in Meldungen.
- Tastatur-Bedienung ohne Maus.
- Kontrast-Checks für verschiedene Themes.
- Fehlertexte mit soforten Next Steps.

## Debugging und Logging
```bash
bash start.sh --check --debug
cat logs/start.log
cat logs/status_summary.txt
```

## Kurzleitfaden für Teams
1. Vor jeder Änderung: `bash start.sh --check`
2. Vor Commit: `bash start.sh --format && bash start.sh --test`
3. Vor Merge: `bash start.sh --full-gates`
4. Nach Iteration immer aktualisieren: `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`

## Laienvorschläge
- Nutzen Sie immer zuerst `--check`, bevor Sie länger nach Fehlern suchen.
- Bei Problemen mit Anzeige/Farben starten Sie `--weakness-report`; dort stehen direkte Befehle als Hilfe.
