## 2026-02-22 – Robuste GUI-Portsuche mit Zufall + Fallback im Fehlerfall
- Scope-Kontrolle:
  - Problem: Der GUI-Start nutzte einen statischen Standardport und suchte bei belegtem Port keinen automatischen Alternativ-Port.
  - Ziel: Portbesorgung robust machen: freie Nicht-Systemports zufällig wählen, belegte Wunschports automatisch abfangen und klare Next Steps ausgeben.
  - Dateien: `start.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Portauswahl/Fallback/Fehlerhandling in `start.sh`, 2) Laienhilfe zur Portwahl in README, 3) Fortschritt und Versionen aktualisieren.
  - Abnahme: `bash start.sh` nutzt einen freien Port im Bereich 20000–60999; bei belegtem `GUI_PORT` wird automatisch ein Alternativ-Port genutzt.
- Was:
  1) `start.sh` erweitert: valide Portgrenzen (`20000–60999`), Zufallswahl freier Ports und automatische Fallback-Suche bei belegtem Wunschport.
  2) Fehler- und Hilfetexte in einfacher Sprache ergänzt, inklusive konkreter Next Steps für erneuten Start und optional festen Port.
  3) README/To-do/Versionsregister aktualisiert, damit Verhalten und Bedienung transparent dokumentiert sind.
- Warum: Portkonflikte sind ein häufiger Startfehler; automatische Fallbacks erhöhen Stabilität und senken Einstiegshürden.
- Wirkung: Höhere Release-Reife, robustere Startautomatik und verständlichere Nutzerführung im Fehlerfall.

## 2026-02-22 – Modul-Starter an konfigurierbare Backend-Datenquellen gekoppelt
- Scope-Kontrolle:
  - Problem: Der Modul-Starter konnte Module öffnen, zeigte aber keine echte Datenquellen-Kopplung und zu wenig transparente Nutzerdetails.
  - Ziel: Modulstart an konfigurierbare Datenquellen anbinden, Kurzdetails interaktiv anzeigen und Fehlerhinweise in einfacher Sprache verbessern.
  - Dateien: `start.sh`, `templates/dashboard_musterseite.html`, `config/module_sources.json`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Start-Routine lädt/validiert Datenquellen-Konfiguration und injiziert sie ins Dashboard, 2) Modul-Starter zeigt Datenquelle + Detail + Next Step, 3) Doku/To-do/Version aktualisiert.
  - Abnahme: `bash start.sh` startet GUI ohne Crash; beim Modul-Öffnen erscheint Datenquelle plus Kurzdetail im Status und Debug-Bereich.
- Was:
  1) Neue Datei `config/module_sources.json` als zentrale, wartbare Datenquellen-Kopplung für alle Module ergänzt.
  2) `start.sh` um robuste Input-Validierung für Modulquellen erweitert und Daten transparent in die Dashboard-Vorlage übernommen.
  3) Modul-Starter im Dashboard zeigt jetzt kurze, klare Infos zu Datenquelle und nächsten Schritten (A11y-Hilfetextpunkt).
- Warum: Nutzer sollen beim Modulstart sofort verstehen, welche echte Datenbasis genutzt wird und was als nächstes zu tun ist.
- Wirkung: Bessere Release-Reife, klarere Bedienung für Laien und saubere Trennung von Systemlogik, Konfiguration und UI.

## 2026-02-22 – GMS-Archiv-Untermodul als Plugin-Karte integriert
- Scope-Kontrolle:
  - Problem: Es fehlte eine laienfreundliche Sammelstelle für Genres, Stimmungen und Stile mit Zufallsausgabe, Verlauf und Export/Import-Anbindung im Hauptmodul.
  - Ziel: Ein GMS-Archiv als Plugin-Karte im Main-Content bereitstellen, inkl. Bulk-Adding, Random-Generator, Verlauf und robuster Validierung ohne neue Abhängigkeiten.
  - Dateien: `templates/dashboard_musterseite.html`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) UI + Plugin-API + Validierung/Feedback, 2) Hilfe-/Fortschrittsdoku aktualisiert, 3) DONE/NEXT + Versionsregister aktualisiert.
  - Abnahme: `OFFLINE_ARTIFACT_MODE=warn python tools/smoke_test.py` und `bash start.sh` laufen erfolgreich; Sidebar zeigt „GMS-Archiv“ und Plugin-Aktionen reagieren mit verständlichen Statusmeldungen.
- Was:
  1) Dashboard um neues Untermodul „GMS-Archiv“ erweitert (Sidebar, Modulstarter, Hauptkarte) mit großer, tastaturfreundlicher Bedienung und klaren Labels.
  2) Plugin-Vertrag im Frontend ergänzt (`mount/unmount`, `getState/setState`, `exportPayload/importPayload`) inkl. Services für Storage, Profile, UI, Exportzentrum und Logging.
  3) Funktionen für Bulk-Adding (Komma), Duplikat-Schutz (case-insensitive), Zufallserzeugung, Verlauf (begrenzt), Kopieren/Löschen/Export/Import-Merge und laienfeste Fehlermeldungen ergänzt.
- Warum: Das Projekt braucht ein integriertes, barrierearmes Archiv-Modul statt verstreuter Einzelfunktionen.
- Wirkung: Höhere Release-Reife, bessere Profil-Integration und klarere Einsteiger-Bedienung direkt im Hauptmodul.

## 2026-02-22 – Offline-Warnmodus + Projektpfad-Spiegelung abgeschlossen
- Scope-Kontrolle:
  - Problem: Zwei offene Punkte blockierten Release-Reife: Offline-Smoke ohne Artefakte brach hart ab, und der Projektpfad lag nur in `data/` statt zusätzlich editierbar in `config/`.
  - Ziel: Offline-Smoke optional als Warnung erlauben, Projektpfad robust in `config/project_settings.json` spiegeln und die Hilfe dafür laienverständlich dokumentieren.
  - Dateien: `start.sh`, `tools/smoke_test.py`, `README.md`, `todo.txt`, `CHANGELOG.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Projektpfad-Spiegelung + JSON-Validierung, 2) `OFFLINE_ARTIFACT_MODE=warn`, 3) Doku/Fortschritt/NEXT-Status aktualisieren.
  - Abnahme: `OFFLINE_ARTIFACT_MODE=warn python tools/smoke_test.py --profile full` läuft bei fehlenden Offline-Artefakten nicht mehr auf Fehler und `config/project_settings.json` wird beim Start geschrieben.
- Was:
  1) `start.sh` speichert den Projektordner jetzt in `data/project_context.json` **und** `config/project_settings.json` und prüft beide Dateien sofort als gültiges JSON.
  2) `tools/smoke_test.py` unterstützt den Modus `OFFLINE_ARTIFACT_MODE=warn` für reine Offline-Situationen mit klaren Next Steps.
  3) README/To-do wurden in einfacher Sprache ergänzt (Befehl, Bedeutung, Fortschritt auf 100%).
- Warum: Stabilere Offline-Arbeitsabläufe und wartbare, editierbare Konfiguration erhöhen Release-Reife und Nutzerverständnis.
- Wirkung: Weniger unnötige Abbrüche, klarere Konfigurationsstruktur und bessere Hilfetexte für Einsteiger.

## 2026-02-22 – Shellcheck-Blocker im Offline-Paket behoben + robustere Qualitätshinweise
- Scope-Kontrolle:
  - Problem: `start.sh --check` scheiterte durch Shellcheck-Hinweis SC2155 im Offline-Paket-Modus.
  - Ziel: Shellcheck-konforme Variablenzuweisung nutzen, die Start-Routine gegen ähnliche Fälle härten und Hilfetexte für Laien klarer machen.
  - Dateien: `start.sh`, `README.md`, `todo.txt`, `CHANGELOG.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) SC2155-Fix per getrennter Deklaration/Zuweisung, 2) Doku-Hinweis für Fehlerbild + Next Steps, 3) To-do/Gates-Status + Versionsregister aktualisiert.
  - Abnahme: `./start.sh --check` meldet keinen SC2155-Fehler mehr an der Offline-Paket-Zuweisung.
- Was:
  1) `start.sh` im Offline-Paket-Modus auf Shellcheck-Best-Practice angepasst (`local package_file` und separate Zuweisung).
  2) README um leicht verständlichen Hilfehinweis „SC2155 erkennen und beheben“ mit konkreten Befehlen ergänzt.
  3) To-do und Versionsregister aktualisiert; Gate-Status mit transparentem Hinweis auf Offline-Einschränkung dokumentiert.
- Warum: Ein einzelner Lint-Blocker darf die autonome Start-Routine nicht stoppen.
- Wirkung: Check/Repair laufen robuster, Fehler sind einfacher reproduzierbar und Laien erhalten klare Next Steps.

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

## 2026-02-22 – Feinanpassung für sehr kleine Displays (A11y + Hilfe)
- Scope-Kontrolle:
  - Problem: Auf sehr kleinen Displays (z. B. 320–420px) waren Abstände, Statuszeile und Karten für Touch/Fokus zu dicht.
  - Ziel: Lesbarkeit, Fokusfreundlichkeit und Bedienbarkeit für sehr kleine Screens verbessern, ohne neue Abhängigkeiten.
  - Dateien: `templates/dashboard_musterseite.html`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) neues CSS-Breakpoint ≤420px inkl. Topbar/Footer/Karten/Buttons, 2) Hilfehinweis für Kleinst-Displays ergänzt, 3) Doku- und Versionsstand aktualisiert.
  - Abnahme: Dashboard bleibt bei ≤420px ohne horizontales Chaos bedienbar; Fokus und Status bleiben sichtbar; Hilfehinweis ist vorhanden.
- Was:
  1) Neuer Media-Query-Bereich für `max-width: 420px` mit kompakteren Abständen, umbruchfähiger Topbar und besser lesbarer Footer-Struktur.
  2) Interaktive Elemente auf kleinen Displays weiter fokus- und touchfreundlich gehalten (Mindesthöhe, klare Textgröße).
  3) Schnellhilfe um einen verständlichen Hinweis für sehr kleine Displays erweitert (Zoom + Skip-Link + Hochformat).
- Warum: Mobile Kleinstgeräte brauchen robustere Mikro-Layouts, damit Barrierefreiheit auch unter engem Platz erhalten bleibt.
- Wirkung: Bessere Nutzbarkeit auf sehr kleinen Bildschirmen, weniger Überlauf-Risiko und klarere Hilfe für Laien.
