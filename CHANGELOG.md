# CHANGELOG

## 2026-02-22 – Mini-UX-Autocheck + Theme-Hilfe + Smoke-Erweiterung
- Was: `start.sh` um `--ux-check-auto` erweitert, Template um `aria-describedby` + erklärenden Theme-Hilfetext ergänzt und `tools/smoke_test.py` um den neuen Check erweitert.
- Warum: UX-/A11y-Pflichtpunkte sollten automatisch testbar sein, damit Next Steps, Hilfetexte und Theme-Hinweise nicht versehentlich fehlen.
- Wirkung: Mini-UX-Check ist jetzt automatisiert, Fehlermeldungen bleiben laienverständlich und die Theme-Auswahl ist für Screenreader klarer beschrieben.

## 2026-02-22 – Full-Gates + Statusbericht + Hilfebereich
- Was: `start.sh` um den Modus `--full-gates` (Gates 1-4 in fixer Reihenfolge) und eine barrierearme Statusdatei `logs/status_summary.txt` erweitert; `tools/smoke_test.py` prüft beide neuen Funktionen automatisch; `templates/dashboard_musterseite.html` um einen klaren Hilfebereich mit Next Steps ergänzt.
- Warum: Qualitäts-Gates sollten vollständig automatisiert laufen, Ergebnisse auch für Screenreader lesbar sein und Nutzer bei Fehlern klare Sofort-Schritte sehen.
- Wirkung: Start-Routine ist release-näher, testet mehr autonom und verbessert Bedienbarkeit/Barrierefreiheit mit konkreten Lösungswegen.
