## 2026-02-22 – Visual-Baseline-Schutz
- Was: Neues Tool `tools/visual_baseline_check.py` ergänzt, neuen `start.sh`-Modus `--visual-baseline-check` eingebaut und Full-Smoke um den Check erweitert.
- Warum: Der offene Punkt „Soll-Ist-Screenshot gegen Layout-Drift“ sollte als fester, automatischer Qualitätsbaustein abgeschlossen werden.
- Wirkung: Visuelle Artefakte werden jetzt aktiv geprüft; bei Problemen erscheinen klare Next Steps in einfacher Sprache.

## 2026-02-22 – Browser-E2E + CI-Artefakte + Smoke-Integration
- Was: Neues Tool `tools/browser_e2e_test.py` prüft den Fehlerdialog im Browser (Fokusfang, Fokus-Rückgabe) und erstellt ein Screenshot-Artefakt; `tools/smoke_test.py` ruft den Lauf im Full-Profil auf; `.github/workflows/full-gates.yml` lädt Logs/Screenshots als Artefakte hoch.
- Warum: Der offene Nachweis für echte Browser-Interaktion und reproduzierbare Fehlerdiagnose in CI sollte vollständig geschlossen werden.
- Wirkung: Höhere Release-Reife durch automatischen Dialog-E2E-Check, bessere A11y-Absicherung und sofort verfügbare CI-Artefakte bei Erfolg/Fehler.

## 2026-02-22 – Live-Status-Sync + Debug-Nächste-Schritte + Smoke-Härtung
- Was: Dashboard synchronisiert den Speicherstatus jetzt in Topbar und Footer, ergänzt Debug-Details (letztes Ereignis + Zeitstempel + nächster Schritt) und erweitert Smoke-Marker für die neuen Hilfselemente.
- Warum: Nutzer:innen brauchen konsistente Rückmeldung über den Zustand und klarere Hilfe direkt im Fehlerfall.
- Wirkung: Bessere Barrierefreiheit/Orientierung, verständlichere Debug-Hinweise und stabilere automatische Absicherung der UI-Hilfen.

# CHANGELOG

## 2026-02-22 – Effiziente Tests + optionaler Ruff-Lint + Smoke-Profile
- Was: `tools/smoke_test.py` unterstützt jetzt `--profile quick|full`, `tools/run_quality_checks.sh` nutzt den effizienten Quick-Lauf und führt Ruff-Lint nur optional aus, wenn Ruff vorhanden ist.
- Warum: Qualität soll schnell prüfbar sein, ohne neue Pflichtabhängigkeit, und trotzdem mit klarer Vollprüfung für Merge-Sicherheit.
- Wirkung: Kürzere Feedback-Zyklen im Alltag, gezieltere Volltests vor Merge und bessere Hilfeausgaben in einfacher Sprache.

## 2026-02-22 – Repo-Quality gehärtet + Selbsttest erweitert + klare Fehlerhilfen
- Was: `tools/run_quality_checks.sh` um `run_checked_command`, Pflichtprüfung `python -m compileall -q .` und Smoke-Kurzlauf (`SKIP_FULL_GATES=1 python3 tools/smoke_test.py`) erweitert; `start.sh --test` führt nun zusätzlich compileall und Repo-Quality aus.
- Warum: Qualitätsfehler sollten früher und automatisiert erkannt werden, ohne dass Nutzer mehrere manuelle Befehle kennen müssen.
- Wirkung: Höhere Wartbarkeit durch wiederverwendete Prüf-Helferfunktion, robustere automatische Gates und verständliche Next Steps bei jedem Fehlerpfad.

## 2026-02-22 – CI-Full-Gates + Fokusreihenfolge-Autocheck + Quality-Integration
- Was: Neue CI-Workflow-Datei `.github/workflows/full-gates.yml` führt bei Push/PR automatisch `bash start.sh --repair` und danach `bash start.sh --full-gates` aus; neuer Checker `tools/focus_order_check.py` prüft Skip-Link, Pflichtaktionen und Theme-Fokusreihenfolge.
- Warum: Die offenen Punkte „Full-Gates in CI“ und „automatische Fokusprüfung“ sollten in eine robuste, wiederholbare Standardprüfung überführt werden.
- Wirkung: Höhere Release-Reife durch automatische Pipeline-Prüfung, bessere A11y-Absicherung der Tastaturbedienung und klarere Fehlerhinweise mit Next Steps.

## 2026-02-22 – GUI-Auslagerung nach system/start_gui.sh
- Was: GUI-HTML-Erzeugung und Theme-Farbberechnung aus `start.sh` in `system/start_gui.sh` ausgelagert, inklusive Eingabevalidierung und klaren Fehlermeldungen mit Next Steps.
- Warum: Die Startdatei sollte weiter verschlankt werden, damit GUI-Logik getrennt wartbar bleibt und Themes zentral berechnet werden.
- Wirkung: Bessere Struktur in `system/`, robustere Theme-Verarbeitung und leichter testbare GUI-Bausteine für künftige Erweiterungen.

## 2026-02-22 – Check-Status gehärtet + Start-Failfast + Reduced-Motion-Hilfe
- Was: `start.sh` prüft `--check` jetzt mit gesammeltem Fehlerstatus und beendet `start` bei fehlgeschlagenem Selbsttest; Mini-UX-Check fordert zusätzlich Fokus-Hinweis und Reduced-Motion-Text.
- Warum: Fehler durften nicht still in den nächsten Schritt laufen, und Barrierefreiheit sollte auch für reduzierte Bewegung klar abgesichert sein.
- Wirkung: Verlässlichere Exitcodes für Automatisierung, verständlichere Next Steps bei Abbruch und bessere A11y-Unterstützung für sensible Nutzer:innen.

## 2026-02-22 – Referenznahes Dashboard-Layout + Neon-Design + A11y-Absicherung
- Was: `templates/dashboard_musterseite.html` wurde auf ein referenznahes Drei-Spalten-Layout (Topbar/Navigation/Karten/Einstellungen/Footer) mit Neon-Panel-Stil umgebaut; `tools/smoke_test.py` prüft dafür zusätzliche Layout-Marker.
- Warum: Das Projekt sollte in Design, Layout und Darstellung deutlich näher an der bereitgestellten Zielansicht liegen, ohne Barrierefreiheit und Theme-Robustheit zu verlieren.
- Wirkung: Klarere visuelle Struktur, bessere Wiedererkennbarkeit, weiterhin starke A11y-Hilfen und automatische Absicherung der neuen Oberfläche.

## 2026-02-22 – Tastatur-Kürzel + A11y-Hilfe + Smoke-Absicherung
- Was: Dashboard erhielt Alt-Kürzel für Speichern/Retry/Reparatur/Log inklusive `aria-keyshortcuts` und Hilfe-Text; Smoke-Test prüft die Marker automatisch.
- Warum: Bedienung ohne Maus und klare Screenreader-Hinweise sollten robuster und schneller nutzbar werden.
- Wirkung: Bessere Barrierefreiheit im Alltag, weniger Klickaufwand und automatische Qualitätssicherung für die neuen Hilfselemente.

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

## 2026-02-22 – Dialog-Fokusfang + Fokus-Rückgabe + A11y-Check geschärft
- Was: `templates/dashboard_musterseite.html` ergänzt jetzt Fokusfang (Tab/Shift+Tab) im offenen Fehlerdialog und gibt den Fokus nach dem Schließen zurück auf das auslösende Element.
- Warum: Tastaturbedienung und Screenreader-Fluss im Dialog sollten stabil ohne Fokusverlust funktionieren.
- Wirkung: Bessere Barrierefreiheit im Fehlerfall; der Fokus bleibt nachvollziehbar und der A11y-Check erkennt fehlende Dialog-Fokuslogik frühzeitig.

