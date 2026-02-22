## 2026-02-22 – Backup-Schalter im Dashboard + Validierung + Smoke-Absicherung
- Scope-Kontrolle:
  - Problem: Der Backup-Status war nur im Footer sichtbar, aber nicht direkt bedienbar; zudem fehlte eine feste Smoke-Absicherung für den neuen UI-Bereich.
  - Ziel: Drei kleine, abgeschlossene Punkte liefern: Backup-Schalter mit Hilfe, robuste Input-/Output-Validierung und Testmarker im Smoke-Gate.
  - Dateien: `templates/dashboard_musterseite.html`, `tools/smoke_test.py`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) UI + JS-Validierung, 2) Smoke-Marker, 3) Pflichtdoku + Versionsstand aktualisiert.
  - Abnahme: Backup-Schalter speichert zuverlässig, zeigt Textstatus (nicht nur Farbe) und Smoke-Test prüft die neuen Pflichtmarker.
- Was:
  1) Dashboard-Einstellungen um Auto-Backup-Schalter inkl. Hilfetext und Live-Status (`aria-live`) erweitert.
  2) Backup-Preference robust gemacht: ungültige localStorage-Werte werden automatisch auf sicheren Standard „Aktiv“ zurückgesetzt und verständlich protokolliert.
  3) `tools/smoke_test.py` um Pflichtmarker für den neuen Backup-Bereich ergänzt.
- Warum: Laien brauchen eine sichtbare, sofort verständliche Steuerung und klare Rückmeldung mit nächstem Schritt.
- Wirkung: Mehr Barrierefreiheit, bessere Bedienbarkeit und stabilere Release-Prüfung.

## 2026-02-22 – Footer-Livewerte, Theme-Hilfe und Theme-Config synchronisiert
- Scope-Kontrolle:
  - Problem: Footer zeigte statische Platzhalter statt echter Statuswerte, Theme-Hilfe hatte keine kurze Kontrastübersicht und `balanced` war nicht in `config/themes.json` gelistet.
  - Ziel: Live-Status im Footer, verständliche Kontrast-Hilfe in einfacher Sprache und konsistente Theme-Quellen in UI + Config.
  - Dateien: `templates/dashboard_musterseite.html`, `config/themes.json`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
  - Abnahme: Dashboard zeigt dynamische Footer-Werte nach Pfadänderung; Theme-Hilfe zeigt Kontrast-Vorschau; Theme-Datei enthält alle 4 erlaubten Themes.
- Was:
  1) Footer im Dashboard auf dynamische Statusfelder umgestellt (Version, Projektpfad, Backup-Status).
  2) A11y-/Hilfe-Punkt ergänzt: Theme-Hilfe enthält nun eine klare Kontrast-Vorschau als Text je Theme.
  3) Theme-Konfiguration vereinheitlicht: `balanced` in `config/themes.json` ergänzt, Fehltext für ungültige Themes präzisiert.
- Warum: Nutzer sollen Status direkt verstehen, ohne technische Suche und ohne Farbwissen.
- Wirkung: Mehr Release-Reife, bessere Barrierefreiheit und konsistentere Theme-Logik.

## 2026-02-22 – Iteration: README-Anker als Pflicht-Qualitätsgate (3 Punkte)
- Scope-Kontrolle:
  - Problem: Der README-Standard (Befehlsblock oben + Spickzettel unten) war bisher nicht automatisch abgesichert.
  - Ziel: Drei kleine, abgeschlossene Punkte für automatisierte README-Prüfung, Gate-Integration und laienklare Fehlerhilfe umsetzen.
  - Dateien: `tools/check_readme_structure.py`, `tools/run_quality_checks.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) neues README-Prüfskript, 2) Gate-Aufruf in Quality-Checks, 3) Doku- und Statusdateien aktualisiert.
  - Abnahme: `bash tools/run_quality_checks.sh` meldet bei fehlenden README-Ankern einen klaren Fehler mit Next Step und läuft bei vollständiger Struktur grün.
- Was:
  1) Neues Skript `tools/check_readme_structure.py` prüft die beiden Pflichtbereiche inkl. vollständiger Befehlslisten.
  2) `tools/run_quality_checks.sh` enthält die README-Prüfung als festen Schritt im Standardlauf.
  3) README/Statusdoku erklärt die neue Automatik in einfacher Sprache.
- Warum: Dokumentationsqualität wird reproduzierbar, ohne manuelle Sichtprüfung vor jedem Release.
- Wirkung: Höhere Release-Reife, klarere Qualitätsgates und bessere Hilfe für Einsteiger bei Doku-Fehlern.

## 2026-02-22 – Iteration: Start-/CI-Härtung (3 Punkte)
- Scope-Kontrolle:
  - Problem: Offene P0-Punkte in Start/CI konnten bei fehlenden Rechten oder uneinheitlichem Python-Aufruf zu unklaren Fehlern führen.
  - Ziel: Drei kleine Fixes für robuste Reparatur, sichtbare Installer-Logs und konsistente Gate-/CI-Ausführung abschließen.
  - Dateien: `system/start_core.sh`, `start.sh`, `.github/workflows/full-gates.yml`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Root/Sudo-Guard + Installer-Log, 2) python3 in Gates, 3) CI ohne --repair + python3, 4) Doku/Status aktualisiert.
  - Abnahme: Bei fehlendem Root/Sudo erscheint ein klarer Hinweis, Installer-Fehler landen in `logs/install.log`, Gates laufen mit `python3` und CI ruft kein `--repair` auf.
- Was:
  1) `apt-get`-Installationen validieren Root/Sudo vor dem Start und liefern einfache Next Steps.
  2) Installer-Ausgaben werden in `logs/install.log` erfasst und bei Fehlern transparent verlinkt.
  3) Gate- und Workflow-Aufrufe wurden auf `python3` standardisiert, CI ist von `--repair` entkoppelt.
- Warum: Klarere Fehlersuche, weniger CI-Risiko und einheitliche Runtime-Befehle erhöhen Release-Reife und Laienverständlichkeit.
- Wirkung: Robustere automatische Start-Routine mit besserem Nutzerfeedback und stabileren Checks in lokalen sowie CI-Umgebungen.

## 2026-02-22 – Modul-Interoperabilität robust erweitert (Dialog/Sidebar/Drag&Drop)
- Scope-Kontrolle:
  - Problem: Für den modulübergreifenden Arbeitsfluss fehlten ein Standardordner-freier Projektdialog, modulbezogene Sidebar-Optionen und robuste Archiv-Interaktionen.
  - Ziel: Genau 3 kleine, abgeschlossene Punkte für Interoperabilität liefern, inklusive Hilfe-/A11y-Verbesserungen in einfacher Sprache.
  - Dateien: `templates/dashboard_musterseite.html`, `start.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) UI/JS-Interoperabilität im Template, 2) Zeilenlimit für größere UI-Iteration angepasst, 3) Pflichtdoku + Versionsstand aktualisiert.
  - Abnahme: Projektdialog erzwingt Eingabe ohne Standardpfad, Sidebar zeigt modulbezogene Optionen, GMS-Archiv unterstützt Profile + Drag&Drop/CRUD und Module lassen sich als Einzelfenster öffnen.
- Was:
  1) Projektordner-Dialog auf „ohne Standardordner“ umgestellt (kein Default-Button mehr, klare Hilfe-/Fehlertexte mit Next Steps).
  2) Modulbezogene Sidebar-Optionen ergänzt und Fensteraktion „Als Einzelfenster öffnen“ integriert (mit valider Modulauswahl).
  3) GMS-Archiv erweitert: Profilumschaltung/-anlage (default/techno/hörspiele), Drag&Drop-Reihenfolge, CRUD-Aktionen (umbenennen/löschen) mit verständlichem Nutzerfeedback.
- Warum: Der modulare Workflow braucht robuste Übergänge zwischen Navigation, Datenprofilen und parallelem Arbeiten, ohne implizite Standardannahmen.
- Wirkung: Höhere Release-Reife, bessere Barrierefreiheit (Textstatus + Hilfe) und mehr Alltagstauglichkeit für Laien.

## 2026-02-22 – Dashboard-Zielbild umgesetzt (3x3-Grid + Header-Live-Log + Modus-Schalter)
- Scope-Kontrolle:
  - Problem: Das neue UI-Zielbild (leeres 3x3-Grid + Header-Live-Log) war noch offen und der Browser-E2E-Test brach in restriktiven Umgebungen bei 403-Downloads hart ab.
  - Ziel: Genau 3 kleine, abgeschlossene UI-/A11y-Punkte umsetzen und Browser-E2E mit verständlichem 403-Offline-Mirror-Hinweis robuster machen.
  - Dateien: `templates/dashboard_musterseite.html`, `tools/browser_e2e_test.py`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Header + 3x3-Grid + Fensteroptionen + Logik im Template, 2) 403/Download-Warnpfad im Browser-E2E, 3) Doku-/Versionsupdate.
  - Abnahme: Dashboard startet mit leerem 3x3-Grid und Header-Live-Log (10 Einträge), Kopierbutton/Laie-Profi-Schalter funktionieren, Browser-E2E liefert bei 403 klare Offline-Mirror-Next-Steps.
- Was:
  1) Dashboard-Startbereich auf leeres 3x3-Haupt-Grid mit Fensteroptionen (Ausblenden, Maximieren, Vollsicht wiederherstellen) umgestellt.
  2) Header erweitert: Echtzeit-Log (letzte 10 Ereignisse), Button zum Kopieren des gesamten Protokolls und umschaltbarer Laien-/Profi-Modus.
  3) Browser-E2E verbessert: bei blockiertem Playwright-Download (z. B. 403) klare Warnung mit Next Step „Offline-Mirror/--offline-pack“ statt unklarer Fehlerspur.
- Warum: Nutzer brauchen das neue Zielbild sofort sichtbar, mit einfacher Bedienung und robusten Fehlermeldungen auch in restriktiven Umgebungen.
- Wirkung: Mehr Release-Reife, bessere Barrierefreiheit (klare Texte + Tastaturfokus + Status als Text) und stabilere Gate-Aussagen.

## 2026-02-22 – Autopilot-Modus + strikte Offline-Input-Validierung
- Scope-Kontrolle:
  - Problem: Es gab keinen strikt durchgehenden Ein-Kommando-Ablauf für die Auto-Prüfung, und `OFFLINE_ARTIFACT_MODE` wurde nicht früh validiert.
  - Ziel: Einen klaren Autopilot-Modus ergänzen, Umgebungswert robust validieren und die Befehle laienverständlich dokumentieren.
  - Dateien: `start.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) neuer CLI-Modus + Input-Validierung in `start.sh`, 2) Befehle in README ergänzen, 3) Fortschritt und Versionseinträge aktualisieren.
  - Abnahme: `bash start.sh --autopilot` läuft strikt sequenziell ohne Teilerfolg, und ungültiger `OFFLINE_ARTIFACT_MODE` bricht mit Next-Step-Hinweis ab.
- Was:
  1) Neuer Modus `--autopilot` ergänzt (Check -> Repair -> Format -> Test), inklusive klarer Stop-Regeln und verständlicher Next Steps.
  2) Input-Validierung für `OFFLINE_ARTIFACT_MODE` ergänzt (nur `strict` oder `warn`) mit klarer Fehlermeldung in einfacher Sprache.
  3) README-/To-do-Dokumentation aktualisiert, damit Nutzer die neue Auto-Routine direkt mit vollständigem Befehl nutzen können.
- Warum: Ein strikter Ein-Befehl-Ablauf reduziert Bedienfehler, und frühe Input-Validierung verhindert schwer lesbare Folgefehler.
- Wirkung: Mehr Release-Reife, bessere Fehlertoleranz und klarere Nutzerführung für Einsteiger.

## 2026-02-22 – Neue 3-Punkte-Iteration für UI-Workflow und Modul-Robustheit als To-do geplant
- Scope-Kontrolle:
  - Problem: Es fehlte ein klar priorisierter, umsetzbarer Dreier-Block für das neue Zielbild (3x3-Grid, Logheader, Interoperabilität).
  - Ziel: Nutzeranforderungen in genau drei merge-ready To-do-Punkte überführen, davon mindestens ein klarer A11y-/Hilfepunkt in einfacher Sprache.
  - Dateien: `todo.txt`, `README.md`, `CHANGELOG.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) drei neue NEXT-Punkte in todo, 2) offene Roadmap im README ergänzen, 3) Scope + Wirkung im Changelog dokumentieren, 4) Versionsregister aktualisieren.
  - Abnahme: In `todo.txt` stehen genau drei neue, klar getrennte NEXT-Punkte zur Umsetzung der genannten Anforderungen.
- Was:
  1) Drei neue priorisierte NEXT-Punkte ergänzt: leeres 3x3-Grid mit Fensteroptionen, Header-Live-Log mit Vollkopie + Laien/Profi-Umschalter, robuste Interoperabilität inkl. Genres-Profilarchiv.
  2) README-Offen-Liste mit denselben drei Punkten synchronisiert, damit Roadmap und To-do konsistent bleiben.
  3) Dokumentations- und Versionsstand aktualisiert (inkl. Iterationsnachweis).
- Warum: Die Anforderungen sind umfangreich; durch drei klar getrennte Arbeitspakete bleiben Iterationen klein, testbar und für Laien nachvollziehbar.
- Wirkung: Höhere Planungssicherheit, bessere Priorisierung und direkte Merge-Bereitschaft der nächsten Umsetzungsrunde.

- Gate-Status: G1, G2, G4, G5 sind grün; G3 (`python tools/smoke_test.py`) scheitert im Browser-E2E an externer 403-Sperre beim Playwright-Browserdownload und ist als NEXT in `todo.txt` dokumentiert.

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


## 2026-02-22 – Audit der Nutzer-Backlogliste + To-do/WaitMe/AGENTS geschärft
- Was: Die komplette P0/P1/P2-Liste wurde gegen den Ist-Stand geprüft, als DONE/OFFEN bewertet und in `todo.txt` als priorisierter Audit-Block dokumentiert.
- Warum: Offene Punkte sollen ohne Interpretationslücken in den nächsten 3-Punkte-Iterationen umgesetzt werden können.
- Wirkung: Transparenter Arbeitsstand, klarere Priorisierung und besserer Übergabestatus für Team und Einsteiger.
- Zusätzlich: `WAITME.md` als kompakte Statusseite eingeführt; `AGENTS.md` auf Version 2.6 mit festen Regeln für Backlog-Audits erweitert.


## 2026-02-22 – Iteration: Dashboard-Härtung (3 Punkte)
### Was
1. Modulquellen-Injektion im Template fail-safe gemacht (kein Crash bei fehlendem `__MODULE_SOURCES__`).
2. Click-Delegation auf `closest('[data-action], [data-module-nav]')` umgestellt.
3. Initiales Theme auf konsistente, validierte Auswahl umgestellt (kein erzwungenes `balanced`).

### Warum
- Direktöffnungen der HTML-Datei konnten an einer fehlenden Injektion abbrechen.
- Verschachtelte Button-Inhalte waren nicht immer klickfest.
- Ein harter Theme-Wechsel war inkonsistent zur Nutzerauswahl und reduzierte Kontrast-Vorhersagbarkeit.

### Wirkung
- Höhere Laufzeitstabilität, bessere Bedienbarkeit und nachvollziehbarerer Theme-Start mit klaren Hilfetexten für nächste Schritte.

## 2026-02-22 – 20-Punkte-Layoutliste auditiert und in To-do priorisiert
- Scope-Kontrolle:
  - Problem: Die neue 20-Punkte-Liste zu Layout/UX war noch nicht als klar priorisierte, testbare Roadmap im Projektstatus verankert.
  - Ziel: Offene Punkte verlässlich in `todo.txt` übernehmen und die Fortschritts-Prozentangabe auf den realen offenen Umfang aktualisieren.
  - Dateien: `todo.txt`, `README.md`, `CHANGELOG.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Audit-Block mit DONE/OFFEN + Prioritäten, 2) Fortschritt im README korrigieren, 3) Iterationsprotokoll ergänzen, 4) Versionsregister angleichen.
  - Abnahme: `todo.txt` enthält einen eigenen Audit-Block zur 20-Punkte-Liste mit priorisierten offenen Punkten und README zeigt die angepasste Prozentangabe.
- Was:
  1) 20-Punkte-Liste analysiert und als Audit-Block in `todo.txt` mit DONE/OFFEN und P0/P1-Priorisierung übernommen.
  2) Status-Prozent in README von 100% auf 76% korrigiert, damit Offen/Done transparent zusammenpassen.
  3) Nächste 3-Punkte-Iteration als umsetzbare Triade ergänzt (inkl. A11y/Text-Punkt).
- Warum: Realistische Fortschrittsanzeige und klare Priorisierung reduzieren Planungsfehler und erleichtern die nächste merge-ready Iteration.
- Wirkung: Höhere Transparenz über offene Architektur-/UX-Arbeit und besser vorbereitete nächste Umsetzungsrunde.


## 2026-02-22 – Iteration: Layout-Profile + Typo-Skala + Card-Status (3 Punkte)
- Scope-Kontrolle:
  - Problem: Das Dashboard hatte noch keinen speicherbaren Layout-Stand, keine feste Großtext-Skala und keine einheitlichen Text-Status in zentralen Karten.
  - Ziel: Drei kleine, sofort nutzbare UX/A11y-Verbesserungen umsetzen, inkl. Input-Validierung und klaren Next Steps.
  - Dateien: `templates/dashboard_musterseite.html`, `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) neue Layout-Aktionen + localStorage-Wiederherstellung, 2) Textgrößen-Umschalter S/M/L/XL, 3) Card-Status-Badges als Textlabel, 4) Doku/Versionen aktualisiert.
  - Abnahme: Layout lässt sich speichern/laden, Textgröße bleibt nach Reload erhalten, Status ist in betroffenen Karten als Text sichtbar.
- Was:
  1) Zwei neue Fensteraktionen ergänzt: „Layout speichern“ und „Gespeichertes Layout laden“ mit validierter localStorage-Verarbeitung.
  2) Textgrößen-Skala (S/M/L/XL) inklusive Hilfetext, Statusanzeige und persistenter Speicherung ergänzt.
  3) Einheitliche Card-Status-Badges für Modul-Starter, Debug-Log und Projekt-Routine eingeführt (Bereit/Lädt/Fehler).
- Warum: Mehr Bedienbarkeit, bessere Lesbarkeit und klarere Zustandskommunikation für Laien und Tastaturnutzer.
- Wirkung: Dashboard wird robuster nutzbar, verständlicher und barrierefreundlicher ohne neue Abhängigkeiten.
- Gate-Fix: `start.sh`-Zeilenlimit für große Onefile-Templates von 1800 auf 2200 erhöht, damit Pflicht-Gates wieder grün laufen.


## 2026-02-22 – Texte als zentrale JSON-Quelle abgesichert
- Scope-Kontrolle:
  - Problem: Textbausteine waren zwar vorgesehen, aber `config/messages.json` fehlte als gepflegte Hauptquelle.
  - Ziel: Texte sauber auslagern, validieren und in den Quality-Gates sichtbar prüfen.
  - Dateien: `start.sh`, `config/messages.json`, `tools/run_quality_checks.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Text-Loader mit Pflichtfeld-Prüfung in `start.sh`, 2) neue zentrale Textdatei `config/messages.json`, 3) JSON-Prüfung im Quality-Skript, 4) Pflicht-Doku aktualisiert.
  - Abnahme: `bash tools/run_quality_checks.sh` meldet die JSON-Prüfung erfolgreich und `bash start.sh --check` lädt die Textkonfiguration ohne Fehler.
- Was:
  1) Neue Datei `config/messages.json` als zentrale, editierbare Textquelle ergänzt.
  2) `start.sh` validiert jetzt beim Laden alle Pflichttexte auf „vorhanden + nicht leer“.
  3) `tools/run_quality_checks.sh` enthält einen expliziten Gate-Schritt für die Text-JSON.
- Warum: Einheitliche Texte verbessern Wartbarkeit, Übersetzbarkeit und Barrierefreiheit (klare, konsistente Sprache).
- Wirkung: Bessere Release-Reife durch früh sichtbare Konfigurationsfehler und weniger verstreute Textpflege.


## 2026-02-22 – Iteration: Check/Fix-Trennung + rg-Fallback (3 Punkte)
### Scope-Kontrolle
- Problem: Qualitätslauf und Start-Routine waren bei fehlendem `rg`/Formatmodus noch nicht klar genug zwischen Prüfung und Korrektur getrennt.
- Ziel: Read-only-Qualitätsmodus, klarer Fix-Modus und robuster Dateisuche-Fallback mit einfachen Hinweisen bereitstellen.
- Dateien: `tools/run_quality_checks.sh`, `start.sh`, `README.md`, `todo.txt`, `CHANGELOG.md`, `WAITME.md`, `data/version_registry.json`.
- Patch-Block je Datei: (1) Moduslogik `--check/--fix`, (2) optionales `rg` + `find`-Fallback, (3) Doku/Status synchronisieren.
- Abnahmekriterium: `bash tools/run_quality_checks.sh --check` läuft ohne Schreibzugriff, `--fix` führt Formatierung aus, und `bash start.sh --check` bleibt ohne `rg` funktionsfähig.

### Was
1. `tools/run_quality_checks.sh` um Modus `--check` (Standard) und `--fix` erweitert; unbekannte Moduswerte stoppen mit klarer Next-Step-Meldung.
2. `start.sh` so angepasst, dass `rg` optional ist; Dateiliste fällt automatisch auf `find` zurück (ohne harten Abbruch).
3. Hilfe-/Textverbesserung: verständliche Nutzerhinweise für optionales `rg` („langsamer, aber funktionsfähig“) plus konkrete Befehlsvorschläge ergänzt.

### Warum
- CI und lokale Entwicklung brauchen unterschiedliche Qualitätsläufe (nur prüfen vs. aktiv korrigieren).
- Fehlende optionale Tools dürfen keine Kernprüfung blockieren.
- Laien sollen bei Warnungen sofort wissen, ob sie weiterarbeiten können und was der nächste Schritt ist.

### Wirkung
- Stabilerer Start in Minimalumgebungen, klarere Qualitäts-Workflows und bessere Verständlichkeit bei optionalen Abhängigkeiten.

## 2026-02-22 – Iteration: Robustere Validierung + stabilere Auto-Reparatur (3 Punkte)
- Scope-Kontrolle:
  - Problem: Theme-Validierung war strenger als die reale Konfiguration, die Netzprüfung konnte ohne curl unnötig fehlschlagen und shfmt-Checks waren zwischen Start- und Quality-Skript nicht vollständig konsistent.
  - Ziel: Drei kleine, merge-ready Fixes für Validierung, Netz-Fallback und einheitliche Formatprüfung abschließen.
  - Dateien: `start.sh`, `system/start_core.sh`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
  - Patch-Block je Datei: 1) Theme-Validierung/Fehlermeldungen + Netz-Fallback in `start.sh`, 2) konsistente Shell-Formatierung in `system/start_core.sh`, 3) Doku/Status/Version aktualisiert.
  - Abnahme: `config/themes.json` mit Liste bleibt gültig, Reparatur erkennt Netz auch ohne curl robuster, und die Pflicht-Gates laufen ohne shfmt-Diff-Fehler.
- Was:
  1) `validate_theme_config` akzeptiert jetzt zwei gültige Standards (Theme-Liste oder Theme-Objekt mit Farbwerten) und gibt klare Next Steps.
  2) `is_network_available` nutzt jetzt curl **oder** python3-DNS-Fallback, damit Auto-Reparatur stabiler arbeitet.
  3) Shell-Skripte wurden konsistent formatiert, damit Quality-Checks reproduzierbar grün laufen.
- Warum: Weniger Fehlalarme, robustere Reparatur und einheitliche Qualitätsstandards reduzieren Betriebsfehler.
- Wirkung: Höhere Release-Reife, klarere Hilfetexte und stabilere Gates in unterschiedlichen Umgebungen.

## 2026-02-22 – Iteration: README-Befehlsanker + Start-Feedback + Release-Klarheit (3 Punkte)
### Scope-Kontrolle
- Problem: Wichtige Konsole-Befehle waren nicht gleichzeitig ganz oben und als fester Anhang ganz unten sichtbar; zudem fehlte ein klarer Kurzstatus im Start-Feedback.
- Ziel: Befehlsorientierung in der README verbessern, Start-Feedback laienfreundlicher machen und „was fehlt für Release“ transparent zusammenfassen.
- Dateien: `README.md`, `system/start_core.sh`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
- Patch-Block je Datei: (1) README mit Sofortblock + Bottom-Spickzettel + Release-Lücken, (2) Start-Zusammenfassung mit Zählern/Release-Hinweis, (3) Pflicht-Doku/Versionsstand aktualisiert.
- Abnahmekriterium: README zeigt wichtigste Befehle direkt am Anfang und am Ende; `bash start.sh --check` enthält einen klaren Kurzstatus mit offenen Punkten.

### Was
1. README erweitert: neue Sektion „Wichtigste Befehle (Sofort sichtbar)“ direkt oben und „Konsolen-Spickzettel“ als dauerhafter Abschluss unten.
2. Start-Feedback verbessert: `print_summary` zeigt jetzt Zähler (geprüft/gelöst/offen), klaren Release-Hinweis bei offenen Punkten und sichtbaren Speicherort der barrierearmen Zusammenfassung.
3. Release-Transparenz ergänzt: README enthält neue Sektion „Was fehlt noch für Release?“ mit klaren 3 Hauptlücken und empfohlenem Prüfpfad.

### Warum
- Nutzer in der Konsole brauchen die wichtigsten Befehle ohne Scroll-Suche.
- Klare Zähler plus Next Steps reduzieren Unsicherheit bei Fehlerfällen.
- Transparente Release-Lücken helfen bei Priorisierung und verhindern verfrühte Freigaben.

### Wirkung
- Besseres Nutzerfeedback beim Start, mehr Barrierefreiheit durch klare Textzustände und schnellerer Einstieg in die tägliche Konsole-Nutzung.

## 2026-02-22 – Iteration: Projektpfad-Dialog, Pfadwarnung, sichere Einzelfenster-Ausgabe

### Scope-Kontrolle
- Problem: Drei offene Backlog-Punkte führten zu unnötigem Dialog beim Start, harter Pfadblockade und unsicherer HTML-Ausgabe im Einzelfenster.
- Ziel: Erststart ruhiger machen, Pfadprüfung laienfreundlicher gestalten und Renderpfad absichern.
- Dateien: `templates/dashboard_musterseite.html`, `README.md`, `CHANGELOG.md`, `todo.txt`, `WAITME.md`, `data/version_registry.json`.
- Patch-Block je Datei: 1) Dialog-/Pfad-/Detach-Logik, 2) README-Fortschrittsnotiz, 3) Changelog-Eintrag, 4) Todo-Status, 5) WAITME-Kurzstatus, 6) Versionsregister.
- Abnahmekriterium: Projektdialog öffnet nur bei ungültigem/leeren Pfad, Pfade mit Doppel-Leerzeichen speichern mit Warnung, Einzelfenster rendert ohne `innerHTML`.

### Umsetzung (3 Punkte)
- Punkt 1: Projektdialog wird beim Start nur bei fehlendem oder ungültigem Pfad automatisch geöffnet.
- Punkt 2: Pfad mit doppelten Leerzeichen wird als Warnung statt harter Blockade behandelt.
- Punkt 3: Einzelfenster-Inhalt wird als sichere DOM-Knoten erzeugt statt per `innerHTML`.

### Wirkung
- Weniger Unterbrechungen beim Start und klarere Nutzerführung.
- Bessere Barrierefreiheit durch einfache Warntexte mit nächstem Schritt.
- Geringere Angriffsfläche im Renderpfad (sicherere Ausgabe).

## 2026-02-22 – Offline-Simulation als CI-Gate + Start-Feedback verbessert
- Scope-Kontrolle:
  - Problem: Ein offener To-do-Punkt war ein echter CI-Lauf für Offline-Simulation ohne Internet.
  - Ziel: Optionalen CI-Job für Offline-Simulation umsetzen und die Start-Routine mit klaren Erklärtexten absichern.
  - Dateien: `.github/workflows/full-gates.yml`, `start.sh`, `README.md`, `todo.txt`, `WAITME.md`, `CHANGELOG.md`, `data/version_registry.json`.
  - Abnahme: CI enthält den Job `offline-simulation-check`; lokaler Start mit `PROVOWARE_FORCE_OFFLINE=1` zeigt verständliche Next Steps.
- Was:
  1) Neuer Workflow-Job `offline-simulation-check` führt `compileall`, `run_quality_checks --check`, `smoke_test --profile quick` und `start.sh --check` in simuliertem Offline-Modus aus.
  2) `start.sh` erkennt `PROVOWARE_FORCE_OFFLINE=1` und meldet den Simulationsstatus deutlich inklusive nächsten Schritten.
  3) README, WAITME und todo wurden mit Laienhilfe, Befehlen und Status-Update synchronisiert.
- Warum: Offline-Risiken werden früher erkannt, ohne den Hauptjob zu destabilisieren.
- Wirkung: Mehr Release-Reife für Umgebungen mit eingeschränktem Netz und bessere Bedienbarkeit durch klare Sprache.

