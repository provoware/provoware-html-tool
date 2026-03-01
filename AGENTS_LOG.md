PATCHSPEC-2026-03-01-094
1) Ziel: Drei offene Mini-Punkte aus todo.txt abschliessen (Backup-Detailzustand speichern, Suchwort-Markierung, Boot-Debug als Hilfe-Eintrag).
2) Scope IN: templates/dashboard.js, templates/dashboard.css, system-module/dashboard_model.js, passende Tests und Pflicht-Doku.
3) Scope OUT: Keine neuen Abhaengigkeiten, kein Umbau von Registry/Backup-Format, kein grosses Layout-Refactor.
4) Dateien/Marker: data/layout.json->layout.backupDetailOpen, support-history-list Highlight, Boot-Debug-Eintrag im Hilfe-Panel.
5) Risiko: mittel (UI-Text + Persistenz), reduziert durch Validierung und Release-Gates.
6) Akzeptanzkriterien: Detailzustand bleibt pro Projekt erhalten, Suchwort wird als Textmarkierung sichtbar (nicht nur Farbe), letzter Boot-Debug steht als eigener Hilfe-Eintrag.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern gezielt per git checkout -- <datei> zurueck.

2026-03-01 | PATCH-094 | Drei offene Mini-Punkte abgeschlossen: Backup-Detailzustand persistent, Suchwort-Markierung im Support-Verlauf, Boot-Debug als Hilfe-Eintrag | system-module/dashboard_model.js, templates/dashboard.js, templates/dashboard.css, test/dashboard_model.test.js, test/dashboard_lyrics_guidance.test.js, README.txt, docs/HILFE.md, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, todo.txt


PATCHSPEC-2026-03-01-095
1) Ziel: Drei offene Mini-Punkte aus todo.txt abschliessen (Boot-Debug-Status im Footer, optionaler Teilwortmodus in Support-Suche, Backup-Detailhinweis mit Beispiel).
2) Scope IN: templates/dashboard.html, templates/dashboard.js, system-module/dashboard_model.js, relevante Tests und Pflicht-Doku.
3) Scope OUT: Keine neuen Abhaengigkeiten, kein Datenformatwechsel ausser einem optionalen Bool-Feld im Layoutzustand.
4) Dateien/Marker: support-history-partial-toggle, support-history-footer-hint, backup-detail-state, layout.supportHistoryPartialMode.
5) Risiko: mittel (Suchlogik + gespeicherter Layoutzustand), reduziert durch feste Token-Grenzen und Tests.
6) Akzeptanzkriterien: Teilwortmodus ist optional schaltbar (Standard bleibt ganze Woerter), Boot-Debug-Status wird im Footer mit Tastatur-Rueckweg genannt, Backup-Hinweis enthaelt eine kurze Beispielzeile.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern einzelne Dateien rueckgaengig machen und Checks erneut laufen lassen.

PATCHSPEC-2026-03-01-093
1) Ziel: Drei offene Mini-Punkte in Dashboard-Hilfe abschliessen (Boot-Debuglog, kurzer Support-Hinweis, Detailzustand).
2) Scope IN: templates/dashboard.js, templates/dashboard.html, test/dashboard_lyrics_guidance.test.js, README.txt, docs/HILFE.md, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, todo.txt.
3) Scope OUT: Keine Aenderung an Kernspeicher, keine neuen Abhaengigkeiten, kein Layout-Refactor.
4) Dateien/Marker: boot-focus-live, support-history-list, backup-compare-detail, backup-detail-state.
5) Risiko: niedrig (Textlogik + Debugausgabe + Detailhinweis).
6) Akzeptanzkriterien: Debug-Text bei Fokuszielwechsel sichtbar, Support-Hinweis kuerzt bei langen Details, Detailzustandstext wird angezeigt und aktualisiert.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehler Commit verwerfen und letzten stabilen Stand nutzen.

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

2026-03-02 | PATCH-065 | Referenzbild-Datei geloescht, Dashboard-Layout an Vorlage angenaehert und Design-Layout-Manifest mit Validierung eingefuehrt | templates/dashboard.html, templates/dashboard.css, config/design_layout_manifest.json, system-module/design_layout_manifest.js, test/design_layout_manifest.test.js, docs/DESIGN_LAYOUT_MANIFEST.md, todo.txt, Doku-Updates
- PATCH-066 | Ziel: Theme-Kontrast Rail/Banner + Kartenprofile + Boot-Fallback | Dateien: templates/dashboard.css, templates/module_workspace.js, tools/release_readiness_check.js, templates/boot_status.js, system-module/design_layout_manifest.js
2026-03-03 | PATCH-067 | Zwei offene Mini-Punkte abgeschlossen: Lyrics-Kurzguide mit Enter/Space/Escape-Schritten + sichtbare Kopierfehler-Hilfe im Lesemodus | templates/dashboard.html, templates/quick_store_module.js, templates/dashboard.js, test/quick_store_module.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, docs/HILFE.md, PROJEKTBESCHREIBUNG.md, MEMORY_FIXES.md
2026-03-01 | PATCH-068 | Zwei offene Mini-Punkte abgeschlossen: Songtext-Kopieren mit Enter/Space-Hinweis + Kurzguide um Speichern/Rueckweg erweitert | templates/dashboard.html, test/dashboard_lyrics_guidance.test.js, Doku-Updates
2026-03-03 | PATCH-069 | Drei offene Punkte abgeschlossen: 1-Klick-Zufallsinhalt + Interoperabilitaet Songtext↔Zufallsgenerator + Fokus-Ruecksprung im Lesemodus | templates/quick_store_module.js, templates/dashboard.html, templates/dashboard.js, test/quick_store_module.test.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md, MEMORY_FIXES.md
- 2026-03-03 | PATCH-069 | Songtext-Zufallsprofil + Lesemodus-Fokusziel | templates/dashboard.html, templates/dashboard.js, templates/quick_store_module.js, test/quick_store_module.test.js, test/dashboard_lyrics_guidance.test.js, README.txt, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, MEMORY_FIXES.md, docs/HILFE.md, todo.txt
2026-03-03 | PATCH-070 | Zwei offene Mini-Punkte abgeschlossen: gespeichertes Zufallsprofil je Projekt + T/I-Shortcut fuer Lesemodus-Fokusziel | templates/quick_store_module.js, templates/dashboard.html, test/quick_store_module.test.js, test/dashboard_lyrics_guidance.test.js, data/quick_store_lyrics_preferences.json, todo.txt, Doku-Updates
2026-03-03 | PATCH-071 | Zwei offene Mini-Punkte abgeschlossen: sichtbarer Zufallsprofil-Status-Chip + Inline-Fokushilfe beim Lesemodus-Start | templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, templates/quick_store_module.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md, docs/HILFE.md

2026-03-03 | PATCH-072 | Songtext-Profil-Chip mit letzter Nutzung + sichere Alt-Shortcuts fuer Fokusziel inkl. Enter-Bestaetigung | templates/quick_store_module.js, templates/dashboard.html, test/quick_store_module.test.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, docs/HILFE.md, MEMORY_FIXES.md, PROJEKTBESCHREIBUNG.md
2026-03-03 | PATCH-073 | Zwei offene Mini-Punkte abgeschlossen: Alt-Shortcut-Hilfe im Lesemodus-Statuslog + automatischer Shortcut-Konfliktcheck in Start-Routine | templates/quick_store_module.js, tools/start_routine.js, test/start_routine.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, docs/HILFE.md, PROJEKTBESCHREIBUNG.md, AGENTS_LOG.md
2026-03-03 | PATCH-075 | Zwei offene Mini-Punkte abgeschlossen: Lesemodus-Schliessen mit Enter/Alt-Hinweis + Shortcut-Konfliktwarnungen gesammelt im Abschlussbericht | templates/quick_store_module.js, tools/start_routine.js, test/quick_store_module.test.js, test/start_routine.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md, docs/HILFE.md, AGENTS_LOG.md
2026-03-03 | PATCH-076 | Zwei offene Mini-Punkte abgeschlossen: Modul-Control-Tooltips vereinheitlicht + A11y-Kurzbericht in Start-Routine | templates/module_workspace.js, tools/release_readiness_check.js, tools/start_routine.js, test/module_workspace.test.js, test/release_readiness_check.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, PROJEKTBESCHREIBUNG.md, docs/HILFE.md, AGENTS_LOG.md
2026-03-03 | PATCH-077 | Zwei offene Mini-Punkte abgeschlossen: Modul-Pin-Knopf + Fokusmodus mit Snapshot/Restore und ESC-Rueckweg, inkl. Wartbarkeits-Refactor ueber dashboard_model | system-module/dashboard_model.js, templates/module_workspace.js, templates/dashboard.js, templates/dashboard.html, templates/dashboard.css, test/dashboard_model.test.js, test/module_workspace.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJECT_INFO.md, MEMORY_FIXES.md, PROJEKTBESCHREIBUNG.md

PATCHSPEC-2026-03-01-088
1) Ziel: Robustes Dashboard-Layout mit klarer Header/Mitte/Footer-Struktur und drei offene TODO-Punkte abschliessen.
2) Scope IN: templates/dashboard.css, templates/dashboard.html, templates/dashboard.js, templates/backup_restore.js, system-module/dashboard_model.js, test/*, Doku-Dateien.
3) Scope OUT: Keine Aenderung an Kernspeicherformaten ausser bestehendem layout.json-Feldbaum.
4) Dateien/Marker: boot-focus-target, support-history-filter, backup-compare-detail, layout-shell-grid.
5) Risiko: mittel (UI-Layout + Fokuspfad + Dialogtexte), minimiert durch Unit-Tests und start.sh.
6) Akzeptanzkriterien: 3x3 Hauptgrid bleibt stabil, Boot-Fokusziel waehlbar, Support-Verlauf filterbar, Versions-Detailmodus optional aufklappbar.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern Commit verwerfen und letzte stabile Version wiederherstellen.

- PATCH-2026-03-01-78 | Ziel: Fokusmodus-Hinweis + Pin-Persistenz + Footer-Notizmodul | Dateien: templates/module_workspace.js, templates/dashboard.js, templates/dashboard.html, templates/dashboard.css, system-module/project_file_writer.js, test/project_file_writer.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md

- PATCH-081 | Ziel: Drei offene Mini-Punkte abschliessen (Favoritenleiste, Moduloptionen unten, TODO-Template strikt) | Dateien: templates/dashboard.html, templates/dashboard.js, templates/module_workspace.js, tools/start_routine.js, system-module/dashboard_model.js, test/*, README/CHANGELOG/SELFINFO/todo/docs
2026-03-01 | PATCH-082 | Drei offene Mini-Punkte abgeschlossen: Favoritenaktionen mit Modulkontext, kontextsensitive Moduloptionen, TODO-Zeilenhilfe in Start-Routine | templates/dashboard.html, templates/dashboard.js, templates/module_workspace.js, system-module/dashboard_model.js, tools/start_routine.js, test/dashboard_model.test.js, test/module_workspace.test.js, todo.txt, README.txt, CHANGELOG.md, SELFINFO.md, PROJEKTBESCHREIBUNG.md, docs/HILFE.md, MEMORY_FIXES.md
- PATCH-20260301-084 | Ziel: Boot-Gate + Safe-Mode-Reparatur + Current-Pointer-Recovery | Dateien: templates/dashboard.html, templates/dashboard.js, templates/boot_status.js, system-core/plugin_loader.js, system-core/self_repair.js, system-core/json_store.js, test/*, Doku-Dateien

- PATCH-085 | Ziel: Boot-Gate-Hilfe + Safe-Mode-Panel + Versions-Restore | Dateien: system-module/dashboard_model.js, templates/dashboard.js, templates/dashboard.html, templates/backup_restore.js, test/dashboard_model.test.js, test/backup_restore.test.js, test/dashboard_lyrics_guidance.test.js
- 2026-03-01 | Patch-ID iter-86-safe-reset-compare-focus | Ziel: 3 offene Mini-Punkte (Safe-Mode-Reset, Versionsvergleich, Boot-Fokus) | Dateien: templates/dashboard.js, templates/dashboard.html, templates/backup_restore.js, system-core/plugin_loader.js, test/*, docs/*
- 2026-03-03 | Patch-ID: iter-87 | Ziel: Safe-Mode-Verlauf + 3er-Versionsvergleich | Dateien: system-module/safe_mode_support_log.js, templates/dashboard.js, templates/backup_restore.js, test/safe_mode_support_log.test.js, test/backup_restore.test.js, Doku-Updates

2026-03-01 | PATCH-088 | Drei offene Mini-Punkte abgeschlossen: Boot-Fokusziel-Einstellung + Support-Verlauf-Filter + Versionsvergleich-Detailmodus, inkl. robustem Layout-Feinschliff | templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, templates/backup_restore.js, system-module/dashboard_model.js, test/dashboard_model.test.js, test/backup_restore.test.js, todo.txt, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, docs/HILFE.md

PATCHSPEC-2026-03-01-089
1) Ziel: Sidebar auf Button-Links umstellen, Startzustand mit nur Notiz-Modul setzen und mittiges 3x3-Raster mit klappbaren Zeitleisten sauber rahmen.
2) Scope IN: templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, system-module/dashboard_model.js, templates/module_workspace.js, relevante Tests und Pflicht-Doku.
3) Scope OUT: Keine neuen externen Abhaengigkeiten, keine Aenderung am Backup-Datenformat.
4) Dateien/Marker: sidebar-links, left-timebar, right-timebar, auto-start-note-module, module-grid-frame.
5) Risiko: mittel (Layout + Startzustand), reduziert durch Unit-Tests und Release-Gates.
6) Akzeptanzkriterien: Linke Sidebar zeigt nur Button-Links, Dashboard startet mit genau einem Notiz-Modul, 3x3-Raster bleibt mittig mit Liedbereich/Footer und beide Zeitleisten sind ein-/aufklappbar.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern letzten Commit per git revert zuruecknehmen.
2026-03-03 | PATCH-089 | Sidebar als Button-Links, Notizmodul-Autostart, linke/rechte Zeitbar klar klappbar benannt | templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, templates/module_workspace.js, system-module/dashboard_model.js, test/dashboard_model.test.js, Doku-Updates


PATCHSPEC-2026-03-01-090
1) Ziel: Drei offene Mini-Punkte abschliessen (Boot-Gate zeigt Fokusziel, Support-Verlauf mit Freitextsuche, Versions-Detailmodus mit Feldgruppen).
2) Scope IN: templates/dashboard.html, templates/dashboard.js, system-module/dashboard_model.js, templates/backup_restore.js, passende Tests und Pflicht-Doku.
3) Scope OUT: Keine neuen Abhaengigkeiten, kein Eingriff in Registry/Store-Datenformat.
4) Dateien/Marker: boot-gate-hint-focus-target, support-history-query, backup-compare-groups.
5) Risiko: mittel (Filter-/Textlogik), reduziert durch Unit-Tests + Release-Gates.
6) Akzeptanzkriterien: Gate-Hinweis nennt Modul/Hilfe, Support-Verlauf filtert mit Typ+Datum-Freitext, Detailmodus zeigt Gruppen neu/entfernt/gleich.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern letzten Commit via git revert rueckgaengig machen.
2026-03-01 | PATCH-090 | Drei offene Mini-Punkte abgeschlossen: Boot-Gate-Fokusziel im Hint, Support-Freitextsuche (Typ/Datum, UND-Regel), Versions-Detailgruppen Neu/Entfernt/Gleich | system-module/dashboard_model.js, templates/dashboard.html, templates/dashboard.js, templates/backup_restore.js, test/dashboard_model.test.js, test/dashboard_lyrics_guidance.test.js, test/backup_restore.test.js, todo.txt, README.txt, CHANGELOG.md, docs/HILFE.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, AGENTS_LOG.md

PATCHSPEC-2026-03-01-091
1) Ziel: Zwei offene Mini-Punkte abschliessen (Boot-Fokusziel mit aria-live-Ansage + Support-Suche mit Trefferzahl und Enter-Shortcut).
2) Scope IN: templates/dashboard.html, templates/dashboard.js, test/dashboard_lyrics_guidance.test.js, README.txt, CHANGELOG.md, todo.txt, PROJEKTBESCHREIBUNG.md, SELFINFO.md.
3) Scope OUT: Keine Aenderung am Backup-Datenformat, keine neuen Abhaengigkeiten.
4) Dateien/Marker: boot-focus-live, support-history-meta, support-history-query-enter.
5) Risiko: niedrig bis mittel (UI-Text und Event-Handling), reduziert durch Tests und Release-Gates.
6) Akzeptanzkriterien: Fokuszielwechsel meldet klaren Text per aria-live; Support-Suche zeigt Trefferzahl und Enter startet Filter sofort.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern letzten Commit via git revert rueckgaengig machen.
2026-03-01 | PATCH-091 | Zwei offene Mini-Punkte abgeschlossen: Boot-Fokusziel mit aria-live-Ansage + Support-Suche mit Trefferzahl und Enter-Shortcut | templates/dashboard.html, templates/dashboard.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, docs/HILFE.md
## PatchSpec Iteration 92
1. Ziel
- Zwei offene TODO-Punkte abschliessen: (a) Versions-Detailgruppen starten standardmaessig eingeklappt, (b) Support-Trefferliste mit Tastatur-Hinweis je Eintrag erweitern.
2. Scope IN
- templates/dashboard.js, templates/dashboard.html (falls Textanker noetig), relevante Tests, Doku-Statusdateien.
3. Scope OUT
- Keine neuen Module, kein Refactor ausserhalb Hilfe/Backup-Detail.
4. Dateien/Marker
- `updateVersionCompare`, `renderSupportHistory`, Support-Verlauf-Abschnitt, todo/README/CHANGELOG/PROJEKTBESCHREIBUNG/SELFINFO.
5. Risiko
- Niedrig bis mittel: UI-Text kann Tests beeinflussen; Detailmodus-Zustand darf nicht unerwartet offen bleiben.
6. Akzeptanzkriterien
- Detailmodus wird nach Vergleich sichtbar aber eingeklappt gezeigt.
- Jeder Support-Listeneintrag enthaelt klaren Tastatur-Hinweis.
- Pflichtchecks laufen: npm run format, node --test, bash start.sh.
7. Checks + Rollback
- Checks wie oben; bei Fehler: letzte Aenderung rueckgaengig per `git checkout -- <datei>` und erneut laufen lassen.

2026-03-01 | PATCH-095 | Drei offene Mini-Punkte abgeschlossen: Footer-Hinweis fuer Boot-Debug-Status, optionaler Teilwortmodus in Support-Suche, Backup-Detailhinweis mit Beispielzeile | templates/dashboard.html, templates/dashboard.js, system-module/dashboard_model.js, test/dashboard_model.test.js, test/dashboard_lyrics_guidance.test.js, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, todo.txt

PATCHSPEC-2026-03-01-096
1) Ziel: Drei offene Mini-Punkte abschliessen (Footer-Hinweis kurz/lang, Teilwort-Mindestlaenge 3, Suchmodus-Badge pro Treffer) und Wartbarkeit der Support-Filterlogik verbessern.
2) Scope IN: templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, system-module/dashboard_model.js, test/dashboard_lyrics_guidance.test.js, test/dashboard_model.test.js sowie Pflicht-Doku-Dateien.
3) Scope OUT: Keine neuen Abhaengigkeiten, kein Eingriff in Backup-/Store-Datenformat.
4) Dateien/Marker: support-history-footer-toggle, normalizeSupportQueryTokens, support-mode-badge, supportHistoryFooterCompact.
5) Risiko: mittel (Suchlogik und UI-Texte), reduziert durch Unit-Tests und Release-Gates.
6) Akzeptanzkriterien: Footer-Hinweis via Schalter kurz/lang, Teilwortsuche ignoriert Tokens unter 3 Zeichen mit Klartext-Hinweis, Trefferliste zeigt Suchmodus-Badge mit hohem Kontrast.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern letzte Aenderung mit git restore gezielt ruecknehmen.
2026-03-01 | PATCH-097 | Drei offene Mini-Punkte abgeschlossen: Support-Footer kurz/lang schaltbar, Teilwortsuche mit Mindestlaenge 3, Suchmodus-Badge je Treffer inkl. Wartbarkeits-Refactor der Query-Normalisierung | templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, system-module/dashboard_model.js, test/dashboard_model.test.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, docs/HILFE.md, AGENTS_LOG.md


PATCHSPEC-2026-03-01-099
1) Ziel: Drei offene Mini-Punkte abschliessen (A-Z-Sortierung fuer ignorierte Kurzbegriffe, aria-live bei Auto-Kurzmodus-Wechsel, Badge-Kurztext unter 480px mit voller Erklaerung).
2) Scope IN: templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, system-module/dashboard_model.js, test/dashboard_model.test.js, test/dashboard_lyrics_guidance.test.js und Pflicht-Doku-Dateien.
3) Scope OUT: Keine Aenderung am Backup-/Store-Datenformat und keine neuen externen Abhaengigkeiten.
4) Dateien/Marker: support-history-sort-short-toggle, support-history-live, supportHistorySortShortTokens, isVerySmallViewportForSupportBadge.
5) Risiko: mittel (responsive A11y + UI-Text), reduziert durch Modell-Validierung, Delta-Check und Release-Gates.
6) Akzeptanzkriterien: Sortier-Checkbox funktioniert und bleibt pro Projekt gespeichert; aria-live-Ansage kommt nur bei Statuswechsel; Badge zeigt unter 480px Kurztext plus volles aria-label.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern gezielt `git restore <datei>` oder letzten Commit revertieren.
2026-03-01 | PATCH-099 | Drei offene Mini-Punkte abgeschlossen: A-Z-Sortierung ignorierter Kurzbegriffe, aria-live-Wechselansage fuer Auto-Kurzmodus, Badge-Kurzform TW/GW unter 480px mit vollem aria-label | templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, system-module/dashboard_model.js, test/dashboard_model.test.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, docs/HILFE.md, AGENTS_LOG.md

PATCHSPEC-2026-03-01-100
1) Ziel: Drei offene Mini-Punkte abschliessen (Sortier-Hilfetext klarer, doppelte Live-Ansage vermeiden, Badge-Kurzform mit Tooltip erklaeren) und Hilfe-Text fuer Laien verbessern.
2) Scope IN: templates/dashboard.html, templates/dashboard.js, test/dashboard_lyrics_guidance.test.js, todo.txt, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, docs/HILFE.md.
3) Scope OUT: Keine neuen Abhaengigkeiten, keine Datenformat-Aenderung, kein groesserer Refactor.
4) Dateien/Marker: support-history-sort-short-toggle-help, announceLiveRegionText, support-mode-badge-tooltip.
5) Risiko: niedrig (Text + kleine UI-Logik), reduziert durch String-Tests + Release-Gates.
6) Akzeptanzkriterien: Sortier-Schalter erklaert klar den Scope inkl. Beispiel; Live-Region schreibt nur bei neuem Text; Badge-Kurzform zeigt Tooltip mit ausgeschriebenem Suchmodus.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern gezielt `git restore <datei>` und Checks erneut.

PATCHSPEC-2026-03-01-101
1) Ziel: Drei offene Mini-Punkte abschliessen (Badge-Tooltip-Texte zentralisieren, Teilwort-Meta um aktiven Filter erweitern, Hilfeblock fuer 0 Treffer ergaenzen).
2) Scope IN: config/messages_de.json, templates/dashboard.js, templates/dashboard.html, test/dashboard_lyrics_guidance.test.js, docs/HILFE.md und Pflicht-Doku-Dateien.
3) Scope OUT: Keine neuen Abhaengigkeiten, keine Datenformat-Aenderung, kein grosser Refactor.
4) Dateien/Marker: supportModeTooltipPartial, support-history-meta, support-history-empty-help.
5) Risiko: niedrig (hauptsaechlich UI-Texte), reduziert durch String-Tests und Release-Gates.
6) Akzeptanzkriterien: Tooltip-Texte kommen aus config mit Fallback in JS; Teilwort-Meta zeigt Filter als Klartext; Hilfe enthaelt 3 klare Rueckwege bei 0 Treffern.
7) Checks + Rollback: npm run format, node --test, bash start.sh; bei Fehlern gezielt `git restore <datei>` und Checks erneut.
2026-03-01 | PATCH-101 | Drei offene Mini-Punkte abgeschlossen: Suchmodus-Tooltip-Texte zentralisiert, Teilwort-Meta mit Filter-Klartext, 0-Treffer-Hilfeblock mit 3 Rueckwegen | config/messages_de.json, templates/dashboard.js, templates/dashboard.html, test/dashboard_lyrics_guidance.test.js, docs/HILFE.md, todo.txt, README.txt, CHANGELOG.md, PROJEKTBESCHREIBUNG.md, SELFINFO.md, AGENTS_LOG.md
