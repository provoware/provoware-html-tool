# provoware-html-tool

## Entwicklungsstand (Iteration-Übersicht)
- Fortschritt: **94%**
- Erledigte Aufgaben:
  - Live-Sync-Status zwischen Topbar und Footer ergänzt, damit Speichermeldungen konsistent und besser sichtbar sind.
  - Debug-Log zeigt jetzt letztes Ereignis mit Zeitstempel und klaren nächsten Schritt in einfacher Sprache.
  - Dashboard-Layout auf Referenzstruktur mit Topbar, linker Navigation, mittlerem Modulraster und rechter Einstellungsleiste umgestellt.
  - Neon-/Glas-Design in drei Themes (`high-contrast`, `light`, `dark`) mit robusten Fokus- und Kontrastrahmen vereinheitlicht.
  - Hilfe- und A11y-Elemente (Skip-Link, Next Steps, Tastaturkürzel, Fehlerdialog) erweitert und im Smoke-Test abgesichert.
  - Fehlerdialog erhielt Fokusfang (Tab/Shift+Tab) und Fokus-Rückgabe auf auslösendes Element für stabilere Tastaturnutzung.
  - Fokus-Checker validiert nun zusätzlich Dialog-Fokusfang und Fokus-Rückgabe als feste A11y-Qualitätsregel.
  - Neuer Modus `--weakness-report` zeigt verbleibende Schwachstellen mit direkten Befehlen und klaren Next Steps in einfacher Sprache.
- Offene Aufgaben:
  - CI soll Browser-E2E später auf Firefox/WebKit erweitern.
  - Optionaler Lint-Schritt für Python-Dateien (z. B. Ruff) soll langfristig als weiche Warnung in CI laufen.
  - Optional: Pixelgenauer Bildvergleich (Diff-Metrik) als zweiter Visual-Guard zusätzlich zur Artefakt-Prüfung.
  - Browser-E2E soll später als CI-Matrix auch mit Firefox/WebKit laufen (derzeit nur Chromium als Pflichtlauf).

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
./start.sh --visual-baseline-check
./start.sh --weakness-report
./start.sh --full-gates
./start.sh --release-check
python tools/browser_e2e_test.py --browser chromium
python tools/browser_e2e_test.py --browser firefox
python tools/browser_e2e_test.py --browser webkit
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
- Fortschritt: `88%`
- Abgeschlossen:
  - Automatische Repair- und Quality-Routine in `start.sh`
  - Dashboard-Musterseite mit Theme-Umschalter, Fehlerdialog und Ergebnisbereich
  - Theme-Konfiguration in `config/themes.json` mit Validierung in Start- und Smoke-Routine
  - A11y-Erweiterungen: Skip-Link, `aria-modal`, Fokusfreundliche Elemente und klare Next Steps
  - Automatischer Mini-UX-Check (`--ux-check-auto`) prüft Hilfe-Texte, Next Steps und wichtige A11y-Marker im Template
  - Neuer WCAG-Kontrasttest (`python tools/check_theme_contrast.py`) als fester Teil von Repo-Quality und Smoke-Test
  - Full-Gates führen jetzt automatisiert Gates 1-5 aus (inklusive Mini-UX-Check)
  - Start-Kernlogik weiter in `system/start_core.sh` ausgelagert (Statusausgabe, Fehlerdialoge, Statusbericht und Dependency-Bootstrap)
  - GUI-Erzeugung und Theme-Farbberechnung nach `system/start_gui.sh` ausgelagert (klare Trennung von Startsteuerung und GUI-Bausteinen)
  - Start-Routine erweitert um automatisches Werkzeug-Bootstrap mit klarer Nutzer-Rückmeldung (`python3`, `rg`, `curl`, `shfmt`, `shellcheck`)
  - Repo-Quality prüft jetzt `start.sh` und `system/start_core.sh` gemeinsam (Format + Lint + WCAG-Kontrasttest)
  - Check-Modus gibt jetzt einen klaren Gesamtstatus mit Exitcode, damit Fehler nicht still weiterlaufen
  - Startmodus stoppt jetzt bei fehlgeschlagenem Selbsttest mit klaren Next Steps
  - Dashboard-Template respektiert reduzierte Bewegung (prefers-reduced-motion) und erklärt den Hinweis für Laien
  - Barrierefreie Tastatur-Kürzel (Alt+S/Alt+R/Alt+P/Alt+L) mit erklärendem Hilfe-Text und Screenreader-Attributen im Dashboard
  - Dashboard-Template optisch auf Referenzbild angenähert: Drei-Spalten-Layout, Modul-Kartenraster, Einstellungen rechts und klarer Footer-Status
  - Repo-Quality führt jetzt zusätzlich eine harte Syntaxprüfung (`python -m compileall -q .`) und einen Smoke-Kurzlauf aus, damit Fehler früher sichtbar werden
  - Selbsttest (`./start.sh --test`) integriert jetzt compileall + Repo-Quality automatisch mit klaren Next Steps bei Fehlern
- Offen:
  - Zusätzlicher Browser-E2E-Test für Fokus-Reihenfolge und Dialog-Fokusfang
  - CI-Artefakte für Fehlerfall (Logdateien und optional Screenshot) ergänzen
- Nächster Schritt: Optionalen Browser-E2E-Test mit Screenshot-Artefakten ergänzen und in CI als zusätzlichen Prüfpfad einbinden.



## Iteration 2026-02-22 (Visual-Baseline-Schutz integriert)
### A) Fundstelle (beobachten)
- Problem: Layout-Drift war als offener Punkt vorhanden, aber es gab noch keinen festen Soll-Ist-Screenshot-Check.
- Risiko: Visuelle Regressionen werden spät erkannt, obwohl Browser-E2E bereits ein Artefakt erzeugt.
- Erwartung: Full-Smoke prüft das Screenshot-Artefakt automatisch und gibt klare Next Steps aus.

### B) Change-Scope (vor Patch)
- Ziel: Drei kleine, sofort nutzbare Punkte liefern: neues Visual-Check-Tool, Startmodus, Smoke-Integration.
- Dateien: `tools/visual_baseline_check.py`, `start.sh`, `tools/smoke_test.py`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`
- Patch-Block je Datei: jeweils ein zusammenhängender Block.
- Abnahmekriterium: `python3 tools/visual_baseline_check.py`, `./start.sh --visual-baseline-check` und `python3 tools/smoke_test.py --profile full` laufen erfolgreich durch und melden klare Erfolgstexte.

### C) Patch (kurz)
- Punkt 1 – Änderung: Neues Tool `tools/visual_baseline_check.py` validiert PNG-Artefakt, Dateigröße und Eingabewerte mit klaren Fehlermeldungen.
- Punkt 2 – Änderung: `start.sh` unterstützt jetzt `--visual-baseline-check` inkl. Hilfeeintrag und verständlichen Next Steps.
- Punkt 3 – Änderung: `tools/smoke_test.py --profile full` ruft den Visual-Baseline-Check nach Browser-E2E auf.

### D) Gates
- G1: `python -m compileall -q .`
- G2: `bash tools/run_quality_checks.sh`
- G3: `python tools/smoke_test.py`
- G4: `bash start.sh`
- G5: Mini-UX-Check (deutsche Dialoge, Fehlerdialog mit Next Steps, kein Crash, Kontrast/Theme geprüft)

### E) Ergebnis
- Status: DONE
- Doku: README + CHANGELOG + todo aktualisiert
- Laienvorschläge:
  1. Führen Sie nach visuellen Änderungen immer zuerst `python3 tools/browser_e2e_test.py` und danach `./start.sh --visual-baseline-check` aus.
  2. Wenn der Baseline-Check fehlschlägt, prüfen Sie zuerst, ob das Dashboard vollständig geladen war und erstellen Sie den Screenshot neu.
- Nächster Schritt: Ergänzen Sie als nächsten Ausbau einen pixelgenauen Bildvergleich (Differenzwert in Prozent), damit auch kleine Layout-Verschiebungen automatisch messbar werden.

## Iteration 2026-02-22 (Effiziente Smoke-Profile + optionaler Ruff-Lint + zielgerichtete Gates)
### A) Fundstelle (beobachten)
- Problem: Python-Lint fehlte als vorbereiteter Schritt ohne Pflichtabhängigkeit und die Smoke-Ausführung war für schnelle Iterationen zu schwergewichtig.
- Risiko: Langsame Rückmeldung senkt praktische Effizienz und wichtige Python-Probleme bleiben optional unklar.
- Erwartung: Ein schneller Standardlauf mit optionalem Ruff-Lint und ein klarer Vollmodus für tiefe Absicherung.

### B) Change-Scope (vor Patch)
- Ziel: Drei kleine, vollständige Punkte für effiziente Quality-Gates inkl. Hilfehinweisen umsetzen.
- Dateien: `tools/smoke_test.py`, `tools/run_quality_checks.sh`, `start.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`
- Patch-Block je Datei: jeweils ein zusammenhängender Block.
- Abnahmekriterium: Quality-Check nutzt Smoke-Profil `quick`, optionaler Ruff-Lint läuft ohne Pflichtabhängigkeit und Full-Gates nutzen explizit `--profile full`.

### C) Patch (kurz)
- Punkt 1 – Änderung: `tools/smoke_test.py` um Profilsteuerung `--profile quick|full` erweitert, damit Kurzlauf und Vollprüfung sauber getrennt sind.
- Punkt 2 – Änderung: `tools/run_quality_checks.sh` auf effizienten Kurzlauf mit optionalem Ruff-Lint (nur wenn vorhanden) umgestellt.
- Punkt 3 – Änderung: Hilfe-/Text-Erweiterung in `start.sh` für optionalen Python-Lint und klare Gate-Kommunikation ergänzt (Barrierefrei: einfache Sprache + Next Steps).

### D) Gates
- G1: `python -m compileall -q .`
- G2: `bash tools/run_quality_checks.sh`
- G3: `python tools/smoke_test.py --profile full`
- G4: `bash start.sh`
- G5: `bash start.sh --ux-check-auto`

### E) Ergebnis
- Status: DONE
- Doku: README + CHANGELOG + todo aktualisiert
- Laienvorschläge:
  1. Für schnelle tägliche Prüfung immer zuerst `bash tools/run_quality_checks.sh` ausführen.
  2. Vor einem Merge zusätzlich `python tools/smoke_test.py --profile full` starten, damit alle Startmodi geprüft werden.
- Nächster Schritt: Ergänzen Sie als nächstes einen Browser-E2E-Szenariotest mit Fokus-Fang im Fehlerdialog und speichern Sie bei Fehlern automatisch ein Screenshot-Artefakt.

## Iteration 2026-02-22 (Dialog-Fokus robust gemacht)
### A) Fundstelle (beobachten)
- Problem: Der Fehlerdialog hatte keinen expliziten Fokusfang und keine sichere Fokus-Rückgabe nach dem Schließen.
- Risiko: Tastaturnutzende können Fokus verlieren oder in der Seite „springen“, besonders bei Fehlerfällen.
- Erwartung: Dialog bleibt per Tab steuerbar, Fokus kehrt danach sauber zum Auslöser zurück.

### B) Change-Scope (vor Patch)
- Ziel: Dialog-A11y stabilisieren und automatisiert absichern.
- Dateien: `templates/dashboard_musterseite.html`, `tools/focus_order_check.py`
- Patch-Block je Datei: 1 zusammenhängender Block (Dialog-Fokuslogik; Checker-Regeln).
- Abnahmekriterium: Fokus-Check und Smoke-Test bestätigen Fokusfang + Fokus-Rückgabe ohne Fehler.

### C) Patch (kurz)
- Punkt 1 – Änderung: Fehlerdialog erhält Fokusfang (Tab/Shift+Tab) im offenen Zustand.
- Punkt 2 – Änderung: Beim Schließen wird der Fokus auf das zuvor aktive Auslöser-Element zurückgesetzt.
- Punkt 3 – Änderung: `tools/focus_order_check.py` prüft zusätzlich Fokusfang und Fokus-Rückgabe als A11y-Pflicht.

### D) Gates
- G1: `python -m compileall -q .`
- G2: `bash tools/run_quality_checks.sh`
- G3: `python tools/smoke_test.py`
- G4: `bash start.sh`
- G5: `bash start.sh --ux-check-auto`

### E) Ergebnis
- Status: DONE
- Doku: README + CHANGELOG + todo aktualisiert
- Laienvorschläge: (1) Bei Fehlermeldungen zuerst „Erneut versuchen“, dann „Reparatur“ nutzen. (2) Bei unklaren Meldungen `cat logs/start.log` öffnen und letzte ❌-Zeile lesen.
- Nächster Schritt: Einen echten Browser-E2E-Dialogtest ergänzen, der den Fokusweg mit Tab-Tasten automatisch durchklickt und bei Fehlern ein Bild als Nachweis speichert.

