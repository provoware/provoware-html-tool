## 2026-02-22 – Check-Status gehärtet + Start-Failfast + Reduced-Motion-Hilfe
- Was: `start.sh` prüft `--check` jetzt mit gesammeltem Fehlerstatus und beendet `start` bei fehlgeschlagenem Selbsttest; Mini-UX-Check fordert zusätzlich Fokus-Hinweis und Reduced-Motion-Text.
- Warum: Fehler durften nicht still in den nächsten Schritt laufen, und Barrierefreiheit sollte auch für reduzierte Bewegung klar abgesichert sein.
- Wirkung: Verlässlichere Exitcodes für Automatisierung, verständlichere Next Steps bei Abbruch und bessere A11y-Unterstützung für sensible Nutzer:innen.

# CHANGELOG

## 2026-02-22 – Start-Kernlogik ausgelagert + Auto-Bootstrap + Quality-Update
- Was: Neue Datei `system/start_core.sh` eingeführt und Kernfunktionen für Status, Fehlerdialoge, barrierearmen Statusbericht sowie Dependency-Bootstrap aus `start.sh` ausgelagert; `tools/run_quality_checks.sh` prüft nun zusätzlich `system/start_core.sh`; Smoke-Test validiert die neue Kernlogik-Datei.
- Warum: Die Startlogik sollte wartbarer strukturiert werden (Systemkern getrennt), automatische Voraussetzungen klarer kommunizieren und Qualitätsprüfungen beide Shell-Komponenten abdecken.
- Wirkung: Bessere Trennung der Tool-Logik, robustere automatische Vorbereitung fehlender Werkzeuge und stabilere Lint-/Format-Absicherung für den ausgelagerten Start-Kern.

## 2026-02-22 – WCAG-Kontrasttest + Full-Gates 1-5 + Smoke-Update
- Was: Neues Tool `tools/check_theme_contrast.py` ergänzt, `tools/run_quality_checks.sh` um automatische Kontrastprüfung erweitert und `start.sh --full-gates` auf Gates 1-5 (inklusive `--ux-check-auto`) ausgebaut.
- Warum: Kontrast, UX und Gate-Konsistenz sollten ohne manuelle Zwischenschritte automatisch abgesichert werden.
- Wirkung: Qualitäts- und Smoke-Läufe erkennen Theme-Kontrastprobleme früher und liefern laienverständliche Next Steps direkt im Terminal.

## 2026-02-22 – Mini-UX-Autocheck + Theme-Hilfe + Smoke-Erweiterung
- Was: `start.sh` um `--ux-check-auto` erweitert, Template um `aria-describedby` + erklärenden Theme-Hilfetext ergänzt und `tools/smoke_test.py` um den neuen Check erweitert.
- Warum: UX-/A11y-Pflichtpunkte sollten automatisch testbar sein, damit Next Steps, Hilfetexte und Theme-Hinweise nicht versehentlich fehlen.
- Wirkung: Mini-UX-Check ist jetzt automatisiert, Fehlermeldungen bleiben laienverständlich und die Theme-Auswahl ist für Screenreader klarer beschrieben.

## 2026-02-22 – Full-Gates + Statusbericht + Hilfebereich
- Was: `start.sh` um den Modus `--full-gates` (Gates 1-4 in fixer Reihenfolge) und eine barrierearme Statusdatei `logs/status_summary.txt` erweitert; `tools/smoke_test.py` prüft beide neuen Funktionen automatisch; `templates/dashboard_musterseite.html` um einen klaren Hilfebereich mit Next Steps ergänzt.
- Warum: Qualitäts-Gates sollten vollständig automatisiert laufen, Ergebnisse auch für Screenreader lesbar sein und Nutzer bei Fehlern klare Sofort-Schritte sehen.
- Wirkung: Start-Routine ist release-näher, testet mehr autonom und verbessert Bedienbarkeit/Barrierefreiheit mit konkreten Lösungswegen.
