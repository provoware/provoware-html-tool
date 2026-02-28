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
