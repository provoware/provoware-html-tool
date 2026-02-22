## 2026-02-22 – Professionellere Abhängigkeitsauflösung über zentrale Mapping-Konfiguration
- Scope-Kontrolle:
  - Problem: Paketnamen unterscheiden sich je Paketmanager und führten zu unnötigen Reparaturfehlern in der Start-Routine.
  - Ziel: Abhängigkeiten zentral konfigurieren, automatisch je Umgebung korrekt installieren und Hinweise laienverständlich ausgeben.
  - Dateien: `start.sh`, `system/start_core.sh`, `config/dependency_map.json`, `README.md`, `todo.txt`, `CHANGELOG.md`, `data/version_registry.json`.
  - Abnahme: `bash start.sh --repair` kann hinterlegte Tools über apt/brew/pip per Mapping auflösen und liefert bei Fehlern klare Next Steps.
- Was:
  1) `start.sh` um eine zentral geladene Abhängigkeits-Konfiguration erweitert (`config/dependency_map.json`) inkl. Input-Validierung für Tool-/Managernamen.
  2) Auto-Reparatur nutzt jetzt paketmanager-spezifische Paketnamen und unterstützt für geeignete Tools zusätzlich pip-Installation.
  3) README und To-do um Hilfeelemente in einfacher Sprache ergänzt, damit auch Laien den neuen Ablauf sicher nutzen können.
- Warum: Einheitliche, konfigurierbare Abhängigkeitsauflösung macht die Start-Routine wartbarer und verlässlicher.
- Wirkung: Weniger Installationsfehler, bessere Wiederholbarkeit und klarere Nutzerführung bei Reparatur und Debugging.

## 2026-02-22 – Projekt-Routine mit persistentem Projektpfad im Dashboard
- Scope-Kontrolle:
  - Problem: Beim GUI-Start fehlte eine klare Projektordner-Routine mit Prüfung, automatischer Erstellung und sichtbarer Pfadanzeige im Dashboard.
  - Ziel: Beim Start zuerst Projektordner abfragen/validieren, bei Fehlen transparent anlegen und den Pfad persistent im Hauptmodul anzeigen.
  - Dateien: `start.sh`, `templates/dashboard_musterseite.html`, `README.md`, `todo.txt`, `CHANGELOG.md`, `data/version_registry.json`.
  - Abnahme: `bash start.sh` legt bei fehlendem Ordner den Standardpfad an und Dashboard zeigt den aktiven Projektpfad mit Hilfeelement.
- Was:
  1) `start.sh` erweitert um Projekt-Routine mit Input-Validierung, Auto-Erstellung und Speicherung in `data/project_context.json`.
  2) Dashboard ergänzt um Projekt-Routine-Karte + Dialog für Pfadpflege (lokal persistent) und klare Next Steps in einfacher Sprache.
  3) Dokumentation und To-do auf neuen Stand gebracht.
- Warum: Nutzer sollen ohne technische Hürden direkt mit einem gültigen Projektordner starten.
- Wirkung: Höhere Release-Reife, transparenter Startablauf und besseres Verständnis im Dashboard.

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


## 2026-02-22 – Offline-Paket-Export + Smoke-Offline-Validierung ergänzt
- Scope-Kontrolle:
  - Problem: Zwei offene Kernpunkte fehlten noch: Offline-Bundle per Ein-Befehl und eine feste Playwright-Offline-Validierung im Smoke-Test.
  - Ziel: Start-Routine soll Offline-Artefakte als Archiv bereitstellen, Smoke-Test soll Offline-Bereitschaft mit klaren Next Steps prüfen, und die Hilfe soll den neuen Befehl zeigen.
  - Dateien: `start.sh`, `tools/smoke_test.py`, `README.md`, `todo.txt`, `CHANGELOG.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) neuer `--offline-pack`-Modus + Hilfezeile, 2) neuer Smoke-Check `run_playwright_offline_validation`, 3) Doku-/Fortschrittsupdate.
  - Abnahme: `bash start.sh --offline-pack` erzeugt ein Archiv unter `data/` und `python tools/smoke_test.py --profile full` enthält die Playwright-Offline-Validierung.
- Was:
  1) `start.sh` um Modus `--offline-pack` erweitert, der Playwright-Artefakte vorbereitet und als `offline_bundle_*.tar.gz` bündelt.
  2) `tools/smoke_test.py` um festen Schritt „Playwright-Offline-Validierung“ ergänzt (inkl. klarer Fehlerhilfe/Next Steps).
  3) Hilfe-/Doku-Texte für Laien erweitert (README + To-do-Fortschritt aktualisiert).
- Warum: Offline-Betrieb wird damit reproduzierbar, transparent und ohne manuelle Einzelarbeit möglich.
- Wirkung: Höhere Release-Reife, klarere Nutzerführung und robusterer Qualitätssicherungsablauf für Offline-Szenarien.
