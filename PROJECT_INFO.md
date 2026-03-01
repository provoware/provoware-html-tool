# PROJECT_INFO

## Aktive Standards

- Kernel nur bei klar begründetem Risiko-Fix ändern.
- Registry immer per Manifest validieren vor jedem Write.
- Registry-Schreiben immer versioniert (`registry_vXXXX.json`).
- JSON-Schreiben nur atomar (tmp + rename).
- Vor jedem UI-Release: Tastaturtest (Tab/Enter/Escape).
- Hilfe-Texte in einfacher Sprache, Fachwörter kurz erklärt.
- Start-Routine läuft zentral über `tools/start_routine.js`.
- Startfehler immer in data/logs/start_routine.log ablegen (Debug nutzbar mit START_DEBUG=1).
- Start-Routine prueft pro Lauf Platzhalter-Marker in Kernordnern und stoppt bei offenen Stellen mit Datei/Zeile + naechstem Schritt.
- Plugin-Loader immer ueber `config/manifests/plugins.manifest.json` pruefen.
- Registry-Debug nur bei START_DEBUG=1 mit Detailursachen anzeigen.
- JSON-Store validiert Pflichtfelder und Typen vor jedem Schreiben (Schema-Check).
- JSON-Store bietet `onBackupCreated` als Backup-Hook fuer Folgeaktionen.
- Start-Routine versucht am Ende immer den Dashboard-Autostart (bei Headless mit Hinweis statt Abbruch).
- Vor dem Systemtest immer Release-Readiness pruefen (A11y-Basis + 3 Themes + Hilfe-Aktionen).

- Start-Routine prueft Format jetzt doppelt: schreiben (`format`) und danach validieren (`format:check`).
- Start-Routine erstellt fehlende Datenordner (`data`, `data/logs`) automatisch vor den Checks.

## 2026-03-01 – Platzhalter-Scan als Pflichtcheck

- Start-Routine erhielt einen automatischen Platzhalter-Scan fuer `TODO`, `FIXME`, `PLACEHOLDER`, `DUMMY` in Kernordnern.
- Fehlerfall zeigt Laienmeldung mit Fundstelle (Datei + Zeile) und klaren Folgeaktionen.
- Risiko: niedrig, da nur Prueflogik und ein Unit-Test erweitert wurden.
