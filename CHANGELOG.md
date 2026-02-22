## 2026-02-22 – Offline-Abhängigkeitsauflösung mit Playwright verbessert + To-do-Status geschärft
- Scope-Kontrolle:
  - Problem: Offline-Umgebungen scheitern häufig bei Playwright-Modul/Browserverfügbarkeit und To-do zeigte keine Fortschrittszahl.
  - Ziel: Repair und Bootstrap sollen Offline-Artefakte berücksichtigen, klare Next Steps liefern und To-do mit Status-Prozent priorisieren.
  - Dateien: `start.sh`, `system/start_core.sh`, `README.md`, `todo.txt`, `data/version_registry.json`.
  - Abnahme: `bash start.sh --repair` zeigt klare Playwright-Offline-Hinweise; Doku enthält Offline-Befehle; todo enthält Prozentstatus + offene Punkte.
- Was:
  1) `start.sh` erweitert den Repair-Modus um `prepare_playwright_offline_assets` (lokale Wheels zuerst, dann optional online, plus Browsercache-Pfad).
  2) `system/start_core.sh` prüft Playwright-Modul und Browsercache bereits im Bootstrap und gibt einfache Next Steps für Online-Vorbereitung/Offline-Nutzung.
  3) `todo.txt` wurde auf Status-Prozent + priorisierte offene Punkte umgestellt; `README.md` dokumentiert die Offline-Strategie mit Befehlen.
- Warum: Maximale Offline-Fähigkeit reduziert Ausfälle in restriktiven Netzwerken und macht Start-/Testabläufe robuster.
- Wirkung: Bessere automatische Selbstheilung, verständlichere Hinweise für Laien und klarer sichtbarer Projektfortschritt.

## 2026-02-22 – Start öffnet jetzt das Hauptmodul statt nur die Statusseite
- Was: `start.sh` nutzt standardmäßig `GUI_ENTRY=dashboard` und kopiert die Hauptmodul-Datei `templates/dashboard_musterseite.html` als GUI-Startseite; optional bleibt `GUI_ENTRY=status` verfügbar.
- Warum: Nutzer landeten trotz „GUI gestartet“ nur in einer Statuskarte und nicht im eigentlichen ModulTool.
- Wirkung: Direkter Einstieg in die Hauptoberfläche, validierter GUI-Eingang mit klarer Fehlermeldung und weiterhin barrierefreundlicher Fallback auf die Statusseite.

## 2026-02-22 – Dashboard-UX mit klarerer Struktur und sichtbarem Pluginstatus verbessert
- Was: Neues Standard-Theme „balanced“, Kartenhierarchie mit Prioritäts-Tags und gruppierte Sidebar-Navigation inkl. sichtbarem Pluginstatus ergänzt.
- Warum: Nutzer sollen schneller erkennen, was wichtig ist, wo sie klicken und welches Modul aktiv ist – ohne Farbchaos.
- Wirkung: Ruhigeres UI, bessere Orientierung, klarere Navigation und barrierefreundlichere Statuskommunikation mit Text + Form.

## 2026-02-22 – Backlog in todo-Liste strukturiert ergänzt
- Was: Alle vom Nutzer genannten offenen Punkte in `todo.txt` in die Bereiche Struktur, Design, UX, Barrierefreiheit, Funktional und Zukunftssicherheit übernommen.
- Warum: Die nächsten Iterationen sollen klar priorisiert, nachvollziehbar und ohne Informationsverlust planbar sein.
- Wirkung: Das Team hat jetzt eine vollständige, einheitlich strukturierte To-do-Grundlage für die nächsten drei-Punkte-Iterationen.

## 2026-02-22 – README und AGENTS für klare Standards und Laienverständnis geschärft
- Was: README komplett sprachlich vereinfacht, Befehle mit Klartext-Erklärung ergänzt und AGENTS.md als projektoptimierte Arbeitsrichtlinie (Version 2.5) überarbeitet.
- Warum: Team und Einsteiger sollen dieselben, verständlichen Qualitätsregeln nutzen und schneller mit Start, Prüfung und Fehlerbehebung zurechtkommen.
- Wirkung: Konsistente Arbeitsweise, bessere Barrierefreiheit in der Kommunikation und weniger Reibung bei Iteration, Testing und Übergabe.
