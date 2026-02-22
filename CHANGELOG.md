# CHANGELOG

## 2026-02-22 – Full-Gates + Statusbericht + Hilfebereich
- Was: `start.sh` um den Modus `--full-gates` (Gates 1-4 in fixer Reihenfolge) und eine barrierearme Statusdatei `logs/status_summary.txt` erweitert; `tools/smoke_test.py` prüft beide neuen Funktionen automatisch; `templates/dashboard_musterseite.html` um einen klaren Hilfebereich mit Next Steps ergänzt.
- Warum: Qualitäts-Gates sollten vollständig automatisiert laufen, Ergebnisse auch für Screenreader lesbar sein und Nutzer bei Fehlern klare Sofort-Schritte sehen.
- Wirkung: Start-Routine ist release-näher, testet mehr autonom und verbessert Bedienbarkeit/Barrierefreiheit mit konkreten Lösungswegen.
