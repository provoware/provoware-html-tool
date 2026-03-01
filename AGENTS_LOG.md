2026-03-01 | PATCH-060 | Zwei offene Punkte abgeschlossen: Start-Check fuer genau zwei offene Mini-Punkte + Schnellspeicher-Modul mit JSON-Speicherung | tools/start_routine.js, test/start_routine.test.js, system-module/quick_store_model.js, templates/quick_store_module.js, templates/dashboard.html, templates/dashboard.js, test/quick_store_model.test.js, Doku-Updates
# AGENTS_LOG

- local-021 | Ziel: Doku-Pflicht README je Iteration fest verankern | Dateien: AGENTS.md, README.txt, CHANGELOG.md, SELFINFO.md, todo.txt, MEMORY_FIXES.md
2026-03-01 | PATCH-027 | Theme-Tooltip mit Rueckweg + A11y-Verknuepfung | templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, config/messages_de.json, tools/release_readiness_check.js, Doku-Updates

2026-03-01 | PATCH-028 | Release-Check erweitert + Mockup-Theme-Tipp mit Screenreader-Hinweis | tools/release_readiness_check.js, test/release_readiness_check.test.js, templates/dashboard_mockup.html, Doku-Updates

2026-03-01 | PATCH-029 | Start-Routine Platzhalter-Scan als Pflichtcheck + Unit-Test | tools/start_routine.js, test/start_routine.test.js, Doku-Updates
- 2026-03-01 | Patch-ID: ITER-030 | Ziel: Iterations-Pipeline um neuen Pflichtschritt erweitern | Dateien: AGENTS.md, CHANGELOG.md, SELFINFO.md, README.txt, todo.txt
2026-03-01 | PATCH-031 | README-Leitfaden (3 Schritte) + TODO-Scan-Fix ohne Fehlalarm bei todo-title | README.txt, tools/start_routine.js, test/start_routine.test.js, todo.txt, CHANGELOG.md, SELFINFO.md
2026-03-01 | PATCH-033 | Help-Panel zeigt 3-Schritt-Mini-Leitfaden und validiert Schritte | system-module/help_panel.js, templates/help-panel.html, templates/help-panel.js, test/help_panel.test.js, Doku-Updates
2026-03-01 | PATCH-035 | Platzhalter-Scan rekursiv + nur Kommentar-Marker, Help-Panel mit Theme-Tastaturhinweis | tools/start_routine.js, test/start_routine.test.js, system-module/help_panel.js, templates/help-panel.js, test/help_panel.test.js, Doku-Updates
2026-03-01 | PATCH-036 | Strategie und Vorgehen auf Projektziel geschärft, alle Info-Dateien synchronisiert | SELFINFO.md, README.txt, PROJECT_INFO.md, CHANGELOG.md, todo.txt, MEMORY_FIXES.md, QUESTIONS_TODO.md

2026-03-01 | PATCH-037 | Plugin-Loader-Hardening: doppelte IDs ablehnen + Pfadschutz gegen externe Modulpfade | system-core/plugin_loader.js, test/plugin_loader.test.js, dummys/unsafe-plugin-manifest.json, Doku-Updates
2026-03-01 | PATCH-038 | Doku-Entscheidung: Einzelne offene Punkte koennen release-fertig sein (5-Punkte-Check) | README.txt, CHANGELOG.md, SELFINFO.md, todo.txt

2026-03-01 | PATCH-039 | Backup-Dialog zeigt 5-Punkte-Inline-Check, Release-Readiness prueft Doku-Regel | templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, tools/release_readiness_check.js, test/release_readiness_check.test.js, Doku-Updates

PATCH-040 | Ziel: Sehschwaeche-Sichtbarkeit verbessern (5 Themes + Doku-Sync) | Dateien: templates/dashboard.html, templates/dashboard.css, tools/release_readiness_check.js, README.txt, docs/HILFE.md, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, PROJEKTBESCHREIBUNG.md, todo.txt, MEMORY_FIXES.md
2026-03-01 | PATCH-041 | Release-Readiness mit automatischer Kontrastmessung (5 Themes, WCAG-AA 4.5) erweitert | tools/release_readiness_check.js, test/release_readiness_check.test.js, README.txt, docs/HILFE.md, CHANGELOG.md, SELFINFO.md, todo.txt, PROJEKTBESCHREIBUNG.md
2026-03-01 | PATCH-042 | Backup-Hook-Log mit Backup-Dialog verbunden | system-core/backup_hook_log.js,system-core/registry_service.js,templates/dashboard.html,templates/dashboard.js,test/registry_service.test.js
2026-03-01 | PATCH-043 | Backup-Dialog mit echter Wiederherstellung via Projektordner-Handle verbunden | templates/backup_restore.js, templates/dashboard.js, templates/dashboard.html, tools/release_readiness_check.js, test/backup_restore.test.js, test/release_readiness_check.test.js
- PATCH-044 | Todo-Liste + klare Ziel-Datei-Auswahl fuer Restore | templates/dashboard.html, templates/dashboard.js, templates/todo_module.js, system-module/todo_list_model.js, test/todo_list_model.test.js
2026-03-01 | PATCH-045 | Todo-Eintraege optional persistent in data/store.json speichern und beim Start laden | templates/todo_module.js,system-module/todo_list_model.js,templates/dashboard.js,test/todo_list_model.test.js,data/store.json,Doku-Updates

2026-03-01 | PATCH-046 | Todo-Filter (heute/offen/archiv) mit Enter/Escape + Inline-Hilfe releasefertig | templates/dashboard.html, templates/dashboard.js, templates/todo_module.js, system-module/todo_list_model.js, test/todo_list_model.test.js, Doku-Updates
2026-03-01 | PATCH-047 | Restore-Flow fuer store/registry mit Auto-Zielerkennung + Sicherheitsabfrage abgeschlossen | templates/backup_restore.js, templates/dashboard.js, test/backup_restore.test.js, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md, MEMORY_FIXES.md, todo.txt
2026-03-01 | PATCH-048 | Offenen TODO-Punkt Backup-Dialog E2E-Test vollstaendig abgeschlossen (Hook-Log -> Restore) | test/backup_restore_e2e.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, MEMORY_FIXES.md, PROJEKTBESCHREIBUNG.md

2026-03-01 | PATCH-050 | Boot-View-Statusbereich mit 4 Phasen + Ampeltexten stabilisiert | templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, templates/boot_status.js, tools/release_readiness_check.js, tools/start_routine.js, test/boot_status.test.js, test/release_readiness_check.test.js, test/start_routine.test.js, Doku-Updates

2026-03-01 | PATCH-051 | Offenen TODO-Punkt abgeschlossen: Help-Panel zeigt Referenzbild-Rhythmus (alle 5 Iterationen) inkl. Validierung | templates/help-panel.js, system-module/help_panel.js, test/help_panel.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md, MEMORY_FIXES.md
2026-03-01 | PATCH-052 | Referenzbild professionell analysiert und als Dashboard-Vorgabe umgesetzt (KPI/Kanban/Team/Kalender + A11y-Textstatus) | templates/dashboard.html, templates/dashboard.css, README.txt, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, PROJEKTBESCHREIBUNG.md, MEMORY_FIXES.md, todo.txt

2026-03-01 | PATCH-053 | Kanban-Schnellansicht an echte JSON-Daten gebunden + Keyboard-A11y (Pfeil links/rechts, Fokusring) | templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, templates/kanban_preview.js, data/kanban_board.json, tools/start_routine.js, test/kanban_preview.test.js, test/start_routine.test.js, Doku-Updates
2026-03-01 | PATCH-054 | Offenen TODO-Punkt abgeschlossen: Kanban-Dialog fuer Kartenverschiebung (Enter/Escape, Statushilfe, Validierung) | templates/kanban_preview.js, templates/dashboard.css, test/kanban_preview.test.js, Doku-Updates

2026-03-01 | PATCH-055 | Kanban-Kartenverschiebung dauerhaft in data/kanban_board.json speichern (Schema-Check + Validierung) | templates/kanban_preview.js, templates/dashboard.js, test/kanban_preview.test.js, Doku-Updates
2026-03-01 | PATCH-056 | Option B priorisiert: Plugin-Loader minimal absichern + Drag-and-Drop als kleiner Zusatzpatch, Dummy-Daten bereinigt | system-core/plugin_loader.js, templates/kanban_preview.js, test/plugin_loader.test.js, test/kanban_preview.test.js, dummys/unsafe-plugin-manifest.json, Doku-Updates

2026-03-01 | PATCH-057 | Option C: JSON-Store mit versionierten Writes + Recovery-Pfad gehaertet | system-core/json_store.js, test/json_store.test.js, docs/HILFE.md, README.txt, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, PROJEKTBESCHREIBUNG.md, MEMORY_FIXES.md, todo.txt
2026-03-01 | PATCH-058 | Zwei offene Punkte abgeschlossen: zentraler Projekt-Datei-Schreiber fuer Kanban + AGENTS-Regel fuer zwei offene Punkte je Iteration | system-module/project_file_writer.js, templates/dashboard.js, templates/dashboard.html, test/project_file_writer.test.js, AGENTS.md, Doku-Updates
2026-03-01 | PATCH-059 | Zwei offene Punkte abgeschlossen: Wiki-Modul + Wiki-Grundgeruest mit Validierung, UI-Panel und JSON-Speicher | system-module/wiki_module_model.js, templates/wiki_module.js, templates/dashboard.html, templates/dashboard.js, test/wiki_module_model.test.js, data/wiki_notes.json, Doku-Updates
2026-03-01 | PATCH-061 | Zwei offene Punkte abgeschlossen: Mehrfach-Schnellspeicherbereiche + Bereichsauswahl mit eigener Datei, inkl. Persistenz-Laden und Validierung | system-module/quick_store_model.js, templates/quick_store_module.js, templates/dashboard.html, templates/dashboard.js, test/quick_store_model.test.js, data/quick_store_entries.json, Doku-Updates
- 2026-03-02 | Patch-062 | Songtext-Editor auf Lyrics + Quick-Store-Dateien getrennt | templates/dashboard.html, templates/dashboard.js, templates/quick_store_module.js, tools/start_routine.js, test/quick_store_module.test.js, data/quick_store_*.json, Doku-Updates
2026-03-02 | PATCH-063 | Zwei offene Mini-Punkte abgeschlossen: Songtext-Editor um Bridge/Sonstiges-Vorlagen und Lesemodus-Vorschau erweitert | templates/quick_store_module.js, templates/dashboard.html, templates/dashboard.js, test/quick_store_module.test.js, Doku-Updates
2026-03-02 | patch-064 | Lesemodus-Schliessen + Inline-Hilfe Songtext | templates/dashboard.html,templates/dashboard.js,templates/quick_store_module.js,test/quick_store_module.test.js,README.txt,docs/HILFE.md,todo.txt,CHANGELOG.md,SELFINFO.md,PROJEKTBESCHREIBUNG.md
