## Iteration 60 – Patchstatus

- Hauptziel 1 abgeschlossen: Start-Routine prueft AGENTS-Regel "genau zwei offene Mini-Punkte" direkt gegen `todo.txt`.
- Hauptziel 2 abgeschlossen: Schnellspeicher-Modul mit Validierung, UI-Panel und Dateischreiben (`data/quick_store_entries.json`) integriert.
- Status: releasebereit nach `bash start.sh` und gruenen Tests.

PATCH-059: Wiki-Modul (Kategorie/Titel/Inhalt) als getrenntes System-Modul eingefuehrt, inklusive Validierung und JSON-Speicherpfad `data/wiki_notes.json`.

## Update 2026-03-01 – Patch 058

- System/Tool-Trennung verbessert: neuer Helper `system-module/project_file_writer.js` kapselt Datei-Schreiblogik.
- Dashboard nutzt diese zentrale Logik jetzt fuer `data/kanban_board.json` statt direktem Dateizugriff.
- Qualitaet: neuer Unit-Test `test/project_file_writer.test.js` prueft Pfad-Validierung und Schreib-Output.

## 2026-03-01 – Storage-Standard erweitert (Option C)

- JSON-Store unterstuetzt jetzt optional versionierte Writes (`*_versions/*_v0001.json`).
- Wiederherstellung kann direkt aus der letzten gueltigen Version erfolgen (`recoverJsonFromLatestVersion`).
- Standard bleibt: vor jedem Schreiben Eingabe pruefen, nach jedem Schreiben Output pruefen.

## Update 2026-03-01 (Iteration 56)

- Kernschritt B ist stabil abgeschlossen: Plugin-Loader ist minimal gehaertet und faengt unsichere Manifest-/Pfadfaelle frueh ab.
- Kanban hat nun optionales Drag-and-Drop als kleinen Zusatzweg; fuer A11y bleibt der Dialog der Standard.
- Naechster Schritt bleibt C: Storage-Service robust weiter absichern.

## Iteration 52 – Referenzbild-Vorgaben aktiv

- Analyse-Ergebnis aus der Bildvorlage direkt in `templates/dashboard.html` und `templates/dashboard.css` umgesetzt.
- Neue Vorgabe-Bloecke: KPI-Schnellbild, Kanban-Schnellansicht, Team-Status, Kalenderblick.
- A11y-Regel eingehalten: Status wird ueber Text erklaert, nicht nur ueber Farbe.

- Backup-Dialog-E2E-Test nutzt jetzt echten Hook-Log -> Restore-Fluss fuer robuste Freigabe.

## Update 2026-03-01 (Iteration 40)

- A11y/Sichtbarkeit: Theme-System erweitert auf 5 Themes (inkl. Rötlich/Camouflage).
- Qualitaetscheck: Release-Readiness prueft jetzt Theme-Vollstaendigkeit in HTML/CSS.
- Doku: README, docs/HILFE und todo wurden auf denselben Stand synchronisiert.

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
- Release-Readiness prueft Doku-Pflicht: README, CHANGELOG und todo muessen mit jedem abgeschlossenen Punkt aktualisiert sein.

- Start-Routine prueft Format jetzt doppelt: schreiben (`format`) und danach validieren (`format:check`).
- Start-Routine erstellt fehlende Datenordner (`data`, `data/logs`) automatisch vor den Checks.

## 2026-03-01 – Platzhalter-Scan als Pflichtcheck

- Start-Routine erhielt einen automatischen Platzhalter-Scan fuer `TODO`, `FIXME`, `PLACEHOLDER`, `DUMMY` in Kernordnern.
- Fehlerfall zeigt Laienmeldung mit Fundstelle (Datei + Zeile) und klaren Folgeaktionen.
- Risiko: niedrig, da nur Prueflogik und ein Unit-Test erweitert wurden.

## Iteration 36: Vorgehen und Strategie

### Zielbild (kurz)

- Stabiler Start ohne Crash.
- Vollautomatischer Abschluss-Check ueber `bash start.sh`.
- Kleine, reviewbare Patches statt grosser Sammelaenderungen.

### Patch-Reihenfolge (Pflicht)

1. PatchSpec schreiben (Scope IN/OUT + Akzeptanz).
2. Nur betroffene Dateien aendern.
3. `bash start.sh` als Freigabe ausfuehren.
4. Doku synchronisieren (`README.txt`, `todo.txt`, `CHANGELOG.md`, `SELFINFO.md`).

### Naechste technische Prioritaet

- **B:** Plugin-Loader weiter absichern (Manifest lesen, isolieren, Fehler melden).
- **C:** Storage-Service robust machen (Schema-Pruefung, versioniertes Schreiben, Backup-Hook).

### Laien-Standard

- Fehlertext immer mit den 3 Aktionen: Erneut versuchen, Reparatur starten, Protokoll oeffnen.
- Fachwoerter kurz erklaeren, z. B. Validierung (Eingabepruefung).

## 2026-03-01 – Neuer Sicherheitsstandard Plugin-Loader

- Plugin-Manifest darf keine doppelte `id` enthalten.
- Plugin-Modulpfade muessen innerhalb des Projektordners liegen.
- Fehlertexte bleiben laienklar mit naechstem Schritt (Erneut versuchen, Reparatur starten, Protokoll oeffnen).

## Iteration 44

- Todo-Liste mit Kalender und Archiv im Dashboard integriert.
- Backup-Restore-Zieldatei ist jetzt im Dialog explizit auswaehlbar.

## 2026-03-01 – Neuer Standard Boot-Status

- Dashboard-Bootstatus nutzt jetzt 4 feste Phasen (UI, Ordner, Module, Backup) mit Ampel + Klartext.
- Ampel bleibt immer textgestuetzt (Gruen/Gelb/Rot + naechster Schritt), damit Status nicht nur ueber Farbe laeuft.
