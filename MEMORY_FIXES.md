## FIX-20260303-001: Lyrics-Praeferenzen sicher speichern

**Kategorie:** UI/JSON
**Symptom (fuer Laien):** Nach Neustart war Zufallsprofil oder Fokusziel wieder auf Standard.
**Technische Ursache:** Auswahlwerte wurden nur im DOM gehalten, nicht in einer Projektdatei gespeichert.
**Trigger:** Dashboard neu laden oder Projektordner erneut verbinden.
**Fix (kurz):** Neue Preferences-Datei eingefuehrt, Werte normalisiert geladen und bei Aenderung sofort gespeichert.
**Geaenderte Dateien/Marker:** templates/quick_store_module.js, data/quick_store_lyrics_preferences.json
**Tests/Checks:** node --test (quick_store_module + dashboard_lyrics_guidance), bash start.sh
**Praevention (kuenftig):** Ab jetzt immer UI-Profile mit Projektbezug als eigene validierte JSON speichern.
**Alternative(n):** Speicherung in localStorage (verworfen, da nicht projektgebunden).
**Risiko/Side-Effects:** Niedrig, da Fallback auf sichere Standardwerte aktiv ist.
**Verknuepft:** PATCH-070

## FIX-20260303-001: Zufallsprofil und Fokusziel abgesichert

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Zufallsinhalt passte nicht zur gewuenschten Stilrichtung und Fokus sprang immer nur auf den Titel.
**Technische Ursache:** Zufallsgenerator kannte kein Profil-Mapping; Lesemodus hatte festes Fokusziel.
**Trigger:** Klick auf "Zufallsinhalt einfuegen" oder "Vorschau schliessen".
**Fix (kurz):** Profil-Mapping mit Validierung eingefuehrt und Fokusziel-Auswahl (Titel/Inhalt) eingebaut.
**Geaenderte Dateien/Marker:** `templates/quick_store_module.js`, `templates/dashboard.html`, `templates/dashboard.js`.
**Tests/Checks:** `node --test test/quick_store_module.test.js test/dashboard_lyrics_guidance.test.js`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer neue UI-Auswahlwerte direkt validieren und per Test auf gueltige Optionen pruefen.
**Alternative(n):** Profil automatisch aus Bereich ableiten.
**Risiko/Side-Effects:** Niedrig; nur Songtext-UI betroffen.
**Verknuepft:** Iteration-69

## FIX-20260302-065: Referenzbild ohne Datei, aber mit stabilem Layout-Manifest

**Kategorie:** UI/A11y/Docs
**Symptom (fuer Laien):** Das Team wollte das Beispielbild loeschen, aber Designvorgaben trotzdem exakt behalten.
**Technische Ursache:** Es gab keine zentrale, maschinenlesbare Layout-Spezifikation.
**Trigger:** Wunsch nach Referenzbild-Loeschung und gleichzeitiger professioneller Layout-Angleichung.
**Fix (kurz):** Bilddatei entfernt, Dashboard-CSS auf Rail-Layout + Statusbanner angepasst, `design_layout_manifest.json` und Doku eingefuehrt.
**Geaenderte Dateien/Marker:** `templates/dashboard.html`, `templates/dashboard.css`, `config/design_layout_manifest.json`, `docs/DESIGN_LAYOUT_MANIFEST.md`.
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer Layout-Regeln zuerst als Manifest pflegen, dann UI anpassen.
**Alternative(n):** Reines PNG behalten (verworfen: nicht maschinenlesbar).
**Risiko/Side-Effects:** Niedrig, da IDs/Funktionalitaet im Dashboard unveraendert blieb.
**Verknuepft:** PATCH-065

## FIX-20260302-001: Quick-Store pro Bereich physisch trennen

**Kategorie:** Storage/Recovery
**Symptom (fuer Laien):** Songideen und allgemeine Notizen liegen gemischt in einer Datei und sind schwer getrennt wiederherstellbar.
**Technische Ursache:** Persistenz schrieb bisher alle Bereiche gesammelt in `quick_store_entries.json`.
**Trigger:** Bereichswechsel mit spaeterem Restore pro Bereich.
**Fix (kurz):** Drei Bereichsdateien eingefuehrt (`quick_store_inbox/lyrics/research.json`) und Legacy-Migration aus der Sammeldatei eingebaut.
**Geaenderte Dateien/Marker:** `templates/quick_store_module.js`, `tools/start_routine.js`, `data/quick_store_*.json`.
**Tests/Checks:** `node --test`, `bash start.sh`, gezielter Helper-Test fuer Bereichspfad und Vorlagen-Einbau.
**Praevention (kuenftig):** Ab jetzt immer Bereichsdaten physisch trennen, wenn Recovery pro Bereich gefordert ist.
**Alternative(n):** Eine Datei mit mehreren Buckets behalten (abgelehnt wegen Recovery-Komplexitaet).
**Risiko/Side-Effects:** Niedrig, da Legacy-Datei weiter lesbar bleibt.
**Verknuepft:** Iteration-62

## FIX-20260301-060: TODO-Mini-Punkte-Regel automatisiert

**Kategorie:** Update/Docs
**Symptom (für Laien):** Iterationen hatten unklare Anzahl an Mini-Punkten.
**Technische Ursache:** Es gab keinen automatischen Check fuer genau zwei offene Mini-Punkte.
**Trigger:** `todo.txt` enthielt zu viele oder zu wenige `Naechster Mini-Punkt`-Zeilen.
**Fix (kurz):** Start-Routine prueft `todo.txt` und bricht bei Abweichung mit klarer Meldung ab.
**Geänderte Dateien/Marker:** tools/start_routine.js, test/start_routine.test.js
**Tests/Checks:** node --test, bash start.sh
**Prävention (künftig):** Ab jetzt immer genau zwei offene `Naechster Mini-Punkt`-Eintraege pflegen.
**Alternative(n):** Nur Warnung anzeigen (verworfen, da Regel sonst oft uebergangen wird).
**Risiko/Side-Effects:** Niedrig, kann bei falscher Pflege von `todo.txt` den Start blockieren.
**Verknüpft:** PATCH-060

## FIX-20260301-059: Wiki-Eintraege pro Kategorie robust speichern

**Kategorie:** UI/JSON
**Symptom (fuer Laien):** Wiki-Notizen konnten vorher nicht zentral erfasst werden.
**Technische Ursache:** Es gab kein eigenes Modell mit Eingabepruefung und keinen festen Dateipfad.
**Trigger:** Neue Wissensnotiz im Dashboard sollte dauerhaft gespeichert werden.
**Fix (kurz):** `wiki_module_model` + `wiki_module` eingefuehrt, Validierung fuer Kategorie/Titel/Inhalt, Schreiben in `data/wiki_notes.json`.
**Geaenderte Dateien/Marker:** `system-module/wiki_module_model.js`, `templates/wiki_module.js`, `templates/dashboard.html`, `templates/dashboard.js`.
**Tests/Checks:** `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer erst Modell mit Input/Output-Validierung bauen, dann UI anbinden.
**Alternative(n):** Eintrag in bestehendem Todo-Store (verworfen wegen Mischzustand).
**Risiko/Side-Effects:** Niedrig, neues Modul ist isoliert.
**Verknuepft:** PATCH-059

## FIX-20260301-058: Zentraler Projekt-Datei-Schreiber fuer Kanban

**Kategorie:** FS-Access
**Symptom (fuer Laien):** Karte wurde verschoben, aber Speichern war fehleranfaellig bei tieferen Pfaden.
**Technische Ursache:** Direkter Dateizugriff in Dashboard ohne zentralen Pfad-Resolver.
**Trigger:** Speicherung auf `data/kanban_board.json` mit Browser-Directory-Handle.
**Fix (kurz):** Neues Modul `project_file_writer` eingefuehrt und Dashboard auf zentrale Write-Funktion umgestellt.
**Geaenderte Dateien/Marker:** `system-module/project_file_writer.js`, `templates/dashboard.js`, `templates/dashboard.html`.
**Tests/Checks:** `test/project_file_writer.test.js`, `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer Projekt-Dateischreiben ueber zentrale Helper statt Direktzugriff.
**Alternative(n):** Direkter Zugriff pro Modul (abgelehnt wegen Wartbarkeit).
**Risiko/Side-Effects:** Niedrig; API ist klein und nur fuer JSON-Objekte.
**Verknuepft:** PATCH-058

## FIX-20260301-057: JsonStore-Versionierung-mit-Recovery

**Kategorie:** JSON/Backup/Recovery
**Symptom (für Laien):** Nach einem Datenfehler war unklar, welche Version zuletzt gueltig war.
**Technische Ursache:** Der zentrale JSON-Store schrieb nur die aktuelle Datei + ein Backup, aber keine Versionsreihe.
**Trigger:** Mehrere Speicherungen hintereinander und danach defekte oder ueberschriebene Zieldatei.
**Fix (kurz):** Optionale Versionierungsfunktion im JSON-Store eingebaut und Recovery auf "letzte gueltige Version" ergaenzt.
**Geänderte Dateien/Marker:** `system-core/json_store.js`, `test/json_store.test.js`
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`
**Prävention (künftig):** Ab jetzt immer bei Storage-Pfaden pruefen, ob versionierte Writes fuer Recovery sinnvoll sind.
**Alternative(n):** Versionierung nur in einzelnen Modulen (abgelehnt, weil inkonsistent).
**Risiko/Side-Effects:** Niedrig; Version-Dateien wachsen mit jeder Speicherung.
**Verknüpft:** PATCH-057

## FIX-20260301-056: Plugin-Loader-Hardening-und-DnD-Zusatz

**Kategorie:** Plugin/UI/A11y
**Symptom (fuer Laien):** Unsichere Plugin-Pfade oder fehlerhafte Manifestfelder konnten den Start pruefbar stoeren; Kanban hatte nur den Dialogweg.
**Technische Ursache:** Manifestvalidierung war zu locker und der optionale Mausweg fehlte.
**Trigger:** Priorisierung von Option B plus Wunsch nach getrenntem Drag-and-Drop-Patch.
**Fix (kurz):** Manifest-Typ/Version/ID/Pfad strenger validiert, Elternpfadzugriff blockiert und optionales Drag-and-Drop mit Statusmeldung ergaenzt.
**Geaenderte Dateien/Marker:** system-core/plugin_loader.js, templates/kanban_preview.js, test/plugin_loader.test.js, test/kanban_preview.test.js
**Tests/Checks:** npm run format, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Plugin-Manifest + Pfad vor dem Laden hart validieren und bei neuen UI-Aktionen einen barrierefreien Rueckweg behalten.
**Alternative(n):** Nur Dialog ohne Drag-and-Drop (weiter moeglich, aber weniger flexibel).
**Risiko/Side-Effects:** Niedrig, da Fehler frueher abgefangen werden; leichter Mehraufwand in Tests.
**Verknuepft:** PATCH-056

## FIX-20260301-054: Kanban-Kartenverschiebung mit Dialog-Rueckweg

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Karten konnten nur gelesen werden, aber nicht direkt im Dashboard verschoben werden.
**Technische Ursache:** Es fehlte ein Dialog-Flow mit validierter Zielspalte und klarer Tastatursteuerung.
**Trigger:** Klick auf eine Karte mit Wunsch "in andere Spalte".
**Fix (kurz):** Verschieben-Button + Dialog + Eingabepruefung (Validierung) ueber `moveKanbanItem` eingebaut.
**Geaenderte Dateien/Marker:** templates/kanban_preview.js, templates/dashboard.css, test/kanban_preview.test.js
**Tests/Checks:** node --test test/kanban_preview.test.js, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei neuen Listenkarten eine direkte Tastatur-Aktion mit Rueckweg einplanen.
**Alternative(n):** Drag-and-Drop only (verworfen wegen Tastaturbarriere).
**Risiko/Side-Effects:** Karte wird aktuell nur im UI verschoben und noch nicht in JSON gespeichert.
**Verknuepft:** PATCH-054

## FIX-20260301-052: Referenzbild-vorlage ohne A11y-Verlust

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Dashboard sah modern aus, aber wichtige Bereiche waren zu leer und nicht klar am Beispielbild orientiert.
**Technische Ursache:** Es fehlte eine feste Uebersetzung der Bildanalyse in konkrete UI-Bloecke.
**Trigger:** Wunsch nach professioneller Bildanalyse mit direkter Umsetzung im Tool.
**Fix (kurz):** KPI-Schnellbild, Kanban-Schnellansicht und Textstatus fuer Team/Kalender in Dashboard-Template + CSS eingebaut.
**Geaenderte Dateien/Marker:** templates/dashboard.html, templates/dashboard.css
**Tests/Checks:** npm run format, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Bildanalyse in konkrete, testbare UI-Bloecke mit Textstatus uebersetzen.
**Alternative(n):** Nur Doku-Vorgaben ohne UI-Aenderung (verworfen).
**Risiko/Side-Effects:** Niedrig, da nur Darstellung erweitert.
**Verknuepft:** PATCH-052

# MEMORY_FIXES.md – Erinnerungsoptimierung (Fix‑Wissensbasis)

Stand: 2026-02-28

## Top-10 Fix-Regeln (kurz, 1 Zeile je Regel)

1. JSON immer atomar schreiben (tmp-Datei + rename).
2. Vor Reparatur immer Backup-Liste anzeigen.
3. UI-Hinweise immer mit nächstem Schritt.
4. Tests zuerst lokal laufen lassen.
5. Fokus-Stil für Tastatur sichtbar halten.
6. Logs immer in festen Ordner schreiben.
7. Fehlertext mit "Erneut versuchen" ergänzen.
8. Für Laien kurze Sätze nutzen.
9. Dateipfade immer validieren.
10. Startskript soll Checks in fester Reihenfolge ausführen.

## Fix‑Einträge

## FIX-20260228-001: Atomarer-Store-und-Reparaturfluss

**Kategorie:** JSON/Backup
**Symptom (für Laien):** Daten konnten nach Absturz beschädigt sein.
**Technische Ursache:** Direktes Überschreiben ohne sichere Zwischenstufe.
**Trigger:** Schreibvorgang bricht mitten im Speichern ab.
**Fix (kurz):** Schreiben über tmp-Datei, dann atomar umbenennen;
Backup mit Auswahl ergänzt.
**Geänderte Dateien/Marker:** system-core/json_store.js,
system-core/self_repair.js
**Tests/Checks:** node --test, bash start.sh
**Prävention (künftig):** Ab jetzt immer atomar schreiben und
Backup-Liste vor Reparatur zeigen.
**Alternative(n):** SQLite mit Transaktionen.
**Risiko/Side-Effects:** Mehr Dateien im data-Ordner.
**Verknüpft:** Patch-ID local-001

## FIX-20260228-002: Start-Routine-zentralisiert

**Kategorie:** Update/Docs
**Symptom (für Laien):** Startablauf war schwer erweiterbar.
**Technische Ursache:** Logik lag direkt in `start.sh` ohne klare Module.
**Trigger:** Neue Checks und Systemtest sollten ergänzt werden.
**Fix (kurz):** Startlogik nach `tools/start_routine.js` verschoben,
inklusive Strukturprüfung und klarer Fehlertexte.
**Geänderte Dateien/Marker:** start.sh, tools/start_routine.js,
test/start_routine.test.js
**Tests/Checks:** npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer Startlogik zentral in `tools/`
halten und mit Tests absichern.
**Alternative(n):** Komplett in Bash mit Functions.
**Risiko/Side-Effects:** `start.sh` hängt von Node-Laufzeit ab.
**Verknüpft:** Patch-ID local-002

## FIX-20260228-003: Registry-Versionierung-mit-Manifest

**Kategorie:** JSON/Boot
**Symptom (für Laien):** Registry-Stand war nicht klar und schwer wiederherstellbar.
**Technische Ursache:** Es gab keinen festen Standard für Registry-Prüfung und Versionen.
**Trigger:** Bei mehreren Änderungen fehlte ein sauberer Versionszeiger.
**Fix (kurz):** Registry-Manifest eingeführt, Write-Pfad validiert,
Versionen als `registry_vXXXX.json` plus `registry.current.json` ergänzt.
**Geänderte Dateien/Marker:** system-core/registry_service.js,
config/manifests/\*.json, tools/start_routine.js
**Tests/Checks:** npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer Manifest-Check vor Registry-Write.
**Alternative(n):** Datenbank mit Migrationen.
**Risiko/Side-Effects:** Mehr Dateien im data/registry_versions-Ordner.
**Verknüpft:** Patch-ID local-003

## FIX-20260228-004: Dashboard-Start-mit-Auto-Reconnect

**Kategorie:** UI/FS-Access
**Symptom (für Laien):** Nach Neustart musste der Projektordner immer neu gewählt werden.
**Technische Ursache:** Es gab keinen gespeicherten Directory-Handle und keine Wiederanfrage der Berechtigung.
**Trigger:** Browser neu gestartet oder Seite neu geladen.
**Fix (kurz):** Handle in IndexedDB speichern, Berechtigung beim Start erneut anfragen, Ordnerstruktur automatisch prüfen/erstellen.
**Geänderte Dateien/Marker:** templates/dashboard.html, templates/dashboard.js, system-module/dashboard_model.js
**Tests/Checks:** npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer Auto-Reconnect + Permission-Check für Ordner-Workflows einbauen.
**Alternative(n):** Nur Session-Speicher ohne Persistenz.
**Risiko/Side-Effects:** Funktioniert nur in Browsern mit File-System-Access.
**Verknüpft:** Patch-ID local-004

## FIX-20260228-005: Start-Debug-und-Log-Hinweis

**Kategorie:** Debugging/Logging
**Symptom (fuer Laien):** Bei Startfehlern war der naechste Schritt nicht immer klar.
**Technische Ursache:** Fehler wurden nur auf der Konsole gezeigt, ohne festen Log-Pfad.
**Trigger:** `start.sh` oder `tools/start_routine.js` bricht mit Fehler ab.
**Fix (kurz):** Startfehler werden in `data/logs/start_routine.log` geschrieben; Ausgabe nennt immer den naechsten Schritt.
**Geaenderte Dateien/Marker:** tools/start_routine.js, test/start_routine.test.js
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Startfehler mit Log-Pfad und klarer Aktion ausgeben.
**Alternative(n):** Externer Logger mit JSON-Ausgabe.
**Risiko/Side-Effects:** Log-Datei waechst bei vielen Fehlern.
**Verknuepft:** Patch-ID local-005

## FIX-20260228-006: Plugin-Loader-Health-Check

**Kategorie:** Plugin/Boot
**Symptom (fuer Laien):** Plugins konnten fehlen und Startfehler waren schwer zuzuordnen.
**Technische Ursache:** Es gab keinen zentralen Plugin-Manifest-Check vor dem Systemtest.
**Trigger:** Plugin-Datei fehlt oder Plugin liefert ungueltiges Ergebnis.
**Fix (kurz):** Plugin-Manifest eingefuehrt, Loader mit isolierter Fehlerbehandlung und Health-Check eingebaut.
**Geaenderte Dateien/Marker:** system-core/plugin_loader.js, config/manifests/plugins.manifest.json, tools/start_routine.js
**Tests/Checks:** npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Plugin-Manifest und Plugin-Ausgabe vor Systemtest pruefen.
**Alternative(n):** Dynamischer Loader mit VM-Sandbox.
**Risiko/Side-Effects:** Mehr Strukturdateien im Projekt.
**Verknuepft:** Patch-ID local-006

## FIX-20260301-001: Registry-Debug-Details-im-Startlauf

**Kategorie:** Debugging/Boot
**Symptom (fuer Laien):** Start meldete Registry-Fehler ohne klare Ursache.
**Technische Ursache:** Health-Check gab nur Sammelmeldung, keine Detailursache zurueck.
**Trigger:** Defekte `data/registry.json` oder ungueltige Registry-Felder.
**Fix (kurz):** Optionaler Debug-Modus liefert Details, Standardmodus bleibt kurz und laienfreundlich.
**Geaenderte Dateien/Marker:** system-core/registry_service.js, tools/start_routine.js, test/registry_service.test.js
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Debug-Detailpfad fuer Health-Checks mit testen.
**Alternative(n):** Immer alle Details ausgeben (abgelehnt wegen Laienfokus).
**Risiko/Side-Effects:** Mehr Fehlerdetails im Debug-Modus, keine Aenderung im Normalmodus.
**Verknuepft:** Patch-ID local-007

## FIX-20260301-002: Schema-Check-und-Backup-Hook-im-JSON-Store

**Kategorie:** JSON/Backup
**Symptom (fuer Laien):** Falsche Felder konnten gespeichert werden und Folgeaktionen nach Backup waren schwer automatisierbar.
**Technische Ursache:** Write-Pfad pruefte nur Objektform, aber nicht Pflichtfelder/Datentypen und bot keinen Hook nach Backup-Erstellung.
**Trigger:** Speichern mit unvollstaendigen oder falsch typisierten Daten.
**Fix (kurz):** `atomicWriteJson` um optionale Schema-Pruefung (`requiredKeys`, `types`) und `onBackupCreated`-Hook erweitert.
**Geaenderte Dateien/Marker:** system-core/json_store.js, test/json_store.test.js
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Schema-Check am Write-Einstieg und Backup-Folgeaktionen ueber Hook anbinden.
**Alternative(n):** Vollstaendiger JSON-Schema-Validator als zusaetzliche Abhaengigkeit.
**Risiko/Side-Effects:** Strengere Validation kann alte, ungueltige Daten sofort blockieren.
**Verknuepft:** Patch-ID local-008

## FIX-20260301-003: Dashboard-Autostart-mit-Headless-Fallback

**Kategorie:** UI/Boot
**Symptom (fuer Laien):** Nach erfolgreichem Start wurde das Dashboard nicht automatisch geoeffnet.
**Technische Ursache:** Es gab kein Kernmodul fuer den Dashboard-Start im Ende der Start-Routine.
**Trigger:** `bash start.sh` lief erfolgreich durch, aber UI blieb manuell zu oeffnen.
**Fix (kurz):** Neues Core-Modul `dashboard_core` erstellt, Plattform-Startbefehl validiert und in Schritt 8/9 der Start-Routine eingebunden.
**Geaenderte Dateien/Marker:** system-core/dashboard_core.js, tools/start_routine.js, test/dashboard_core.test.js
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Boot-Ende mit eigenem Core-Modul und Headless-Fallback testen.
**Alternative(n):** Dashboard nur als manueller Link in Hilfe anzeigen.
**Risiko/Side-Effects:** In Headless-Umgebungen wird nur Hinweis statt Browserstart gezeigt.
**Verknuepft:** Patch-ID local-009

## FIX-20260301-004: Dashboard-Mockup-fuer-Aktuellen-Flow

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Es gab keine schnelle visuelle Uebersicht, wie Start-Routine und Dashboard-Logik zusammenarbeiten.
**Technische Ursache:** Nur das produktive Dashboard war vorhanden, aber kein leicht lesbares Mockup fuer Review und Abstimmung.
**Trigger:** Wunsch nach schneller Mockup-Ansicht im Projektordner.
**Fix (kurz):** Neues `templates/dashboard_mockup.html` mit 9 Start-Schritten, Theme-Umschaltung, klaren Fehleraktionen und Tastaturhinweisen erstellt.
**Geaenderte Dateien/Marker:** templates/dashboard_mockup.html, CHANGELOG.md, SELFINFO.md, todo.txt
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei neuen UI-Flows ein kompaktes Mockup fuer schnelle Laien-Pruefung mitliefern.
**Alternative(n):** Mockup nur als Bilddatei statt klickbarer HTML-Datei.
**Risiko/Side-Effects:** Zusaetzliche Template-Datei muss bei UI-Aenderungen mitgedacht werden.
**Verknuepft:** Patch-ID local-010

## FIX-20260301-005: Dashboard-Referenzlayout-mit-A11y-Grundstruktur

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Dashboard wirkte funktional, aber optisch nicht nah genug am Zielbild.
**Technische Ursache:** Vorheriges Template hatte einfache Einspalten-Struktur und zu wenig visuelle Gruppierung.
**Trigger:** Wunsch nach professioneller Layout-Angleichung an Referenzbild.
**Fix (kurz):** `templates/dashboard.html` auf Topbar + 3-Spalten-Layout mit Kalender, Workspace, Quick-Links und klaren Karten umgestellt.
**Geaenderte Dateien/Marker:** templates/dashboard.html, config/messages_de.json, docs/HILFE.md
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei UI-Redesign zuerst Raster (Layout-Grid) und A11y-Mindestwerte festlegen.
**Alternative(n):** Nur Farben anpassen ohne Strukturwechsel (abgelehnt, nicht ausreichend).
**Risiko/Side-Effects:** Reines Template-Update, JS-Logik bleibt unveraendert.
**Verknuepft:** Patch-ID local-011

## FIX-20260301-006: Flexible-Modulraster-im-Hauptbereich

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Der Hauptbereich war statisch und bot keine klare Modulsteuerung.
**Technische Ursache:** Es gab nur feste Beispiel-Kacheln ohne Modulzustand.
**Trigger:** Wunsch nach leer startender Modulflache mit Panel-Steuerung.
**Fix (kurz):** Modul-Workspace als eigenes Template-Skript ergänzt: Auswahl-Reihenfolge, Maximieren, Minimieren, Ausblenden, flexible Rastergröße und Position.
**Geaenderte Dateien/Marker:** templates/dashboard.html, templates/module_workspace.js, templates/dashboard.css, templates/dashboard.js
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer interaktive UI-Zustaende in eigenes Modul auslagern und leeren Initialzustand testen.
**Alternative(n):** Vollstaendig in dashboard.js belassen (abgelehnt wegen Dateigroesse/Wartbarkeit).
**Risiko/Side-Effects:** Zusätzliche Template-JS-Datei muss beim Laden enthalten sein.
**Verknuepft:** Patch-ID local-012

## FIX-20260301-007: Kompaktes-Dashboard-ohne-Platzhalter

**Kategorie:** UI/A11y/Docs
**Symptom (fuer Laien):** Viele Beispieltexte wirkten unruhig und verdeckten den echten Arbeitsbereich.
**Technische Ursache:** Statische Demo-Inhalte waren direkt im HTML verteilt.
**Trigger:** Wunsch nach maximal kompakter, uebersichtlicher und modularer Ansicht.
**Fix (kurz):** Demo-Listen entfernt, leere Bereiche als freie Flaechen belassen, Abstaende/Font/Button-Verhaeltnisse verdichtet und Kurztexte zentral in `config/messages_de.json` ausgelagert.
**Geaenderte Dateien/Marker:** templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, config/messages_de.json
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer UI-Kurztexte zentral halten und Platzhalter vor Release entfernen.
**Alternative(n):** Platzhalter nur ausblenden (abgelehnt, nicht wartbar).
**Risiko/Side-Effects:** Leere Bereiche koennen ohne echte Daten zunaechst schlicht wirken.
**Verknuepft:** Patch-ID local-013

## FIX-20260301-008: Modulare-Hilfe-und-feste-Fehleraktionen

**Kategorie:** UI/A11y/Docs
**Symptom (fuer Laien):** Hilfe war verteilt und der naechste Schritt nicht immer sofort klar.
**Technische Ursache:** Kein zentraler Hilfeblock mit einheitlichen Aktionen.
**Trigger:** Wunsch nach maximal klarer Laienfuehrung im Dashboard.
**Fix (kurz):** Gefuehrte Hilfe als eigenes Panel, Topbar-Hilfen und feste 3 Fehleraktionen eingebaut.
**Geaenderte Dateien/Marker:** templates/dashboard.html, templates/dashboard.css, templates/dashboard.js, config/messages_de.json, README.txt, docs/HILFE.md, todo.txt
**Tests/Checks:** npm run format, npm test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer Hilfeschritte zentral halten und Fehlerwege mit festen 3 Aktionen abbilden.
**Alternative(n):** Nur Tooltips statt Hilfebereich (abgelehnt, zu versteckt).
**Risiko/Side-Effects:** Mehr sichtbare Hilfetexte im Dashboard.
**Verknuepft:** Patch-ID local-014

## FIX-20260301-009: Release-Readiness-Guard-vor-Systemtest

**Kategorie:** UI/A11y/Update
**Symptom (für Laien):** Start lief weiter, obwohl wichtige Hilfe- oder Theme-Bausteine fehlen konnten.
**Technische Ursache:** Es gab keinen festen Vorab-Check für A11y-/Theme-Mindestregeln.
**Trigger:** Änderungen an Dashboard-HTML/CSS oder Texten ohne direkten Warnschritt.
**Fix (kurz):** Neuer Release-Readiness-Check prüft aria-live, Hilfe-Aktionen und 3 Themes vor dem Systemtest.
**Geänderte Dateien/Marker:** tools/release_readiness_check.js, tools/start_routine.js, test/release_readiness_check.test.js, todo.txt
**Tests/Checks:** npm run format, npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer vor Systemtest Release-Readiness mit klaren Mindestregeln ausführen.
**Alternative(n):** Nur manuelle Sichtprüfung (abgelehnt, zu fehleranfällig).
**Risiko/Side-Effects:** Bei fehlenden Pflichtbausteinen bricht Start früher ab (gewollt).
**Verknüpft:** Patch-ID local-015

## FIX-20260301-010: Modul-Backlog-zentralisiert

**Kategorie:** Docs/UX
**Symptom (für Laien):** Neue Modulideen waren verteilt und dadurch schwer planbar.
**Technische Ursache:** Es gab keine zentrale, aktuelle Liste aller Tool-Module in README/TODO.
**Trigger:** Viele neue Modulwünsche in einer Iteration.
**Fix (kurz):** README um Tool-Module-Liste erweitert und TODO in konkrete P1-Module aufgeteilt.
**Geänderte Dateien/Marker:** README.txt (Tool-Module), todo.txt (Neue Modul-Implementierung planen), CHANGELOG.md
**Tests/Checks:** npm test
**Prävention (künftig):** Ab jetzt immer neue Modulwünsche zuerst zentral in README + TODO strukturieren.
**Alternative(n):** Nur Ticketliste außerhalb des Repos.
**Risiko/Side-Effects:** Mehr Planungsaufgaben im TODO sichtbar.
**Verknüpft:** Patch-ID local-016

## FIX-20260301-011: Start-Routine-Formatnachweis-und-Ordner-Selbstheilung

**Kategorie:** Update/FS-Access/Tests
**Symptom (für Laien):** Start lief nicht stabil, wenn Logs-Ordner fehlte oder Formatierung unbemerkt fehlerhaft war.
**Technische Ursache:** Es gab keine feste Erstellung der Datenordner und keinen separaten Format-Validierungsschritt.
**Trigger:** Neuer Rechner, bereinigtes Repo oder manuelle Dateiaenderungen.
**Fix (kurz):** Start-Routine legt benoetigte Ordner automatisch an und fuehrt nach `format` immer `format:check` aus.
**Geänderte Dateien/Marker:** tools/start_routine.js, package.json, test/start_routine.test.js
**Tests/Checks:** npm run format, npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer nach automatischer Formatierung einen expliziten Format-Check laufen lassen.
**Alternative(n):** Nur manuelle Sichtpruefung (abgelehnt, zu unsicher).
**Risiko/Side-Effects:** Start hat einen kurzen Zusatzschritt fuer Pruefung.
**Verknüpft:** Patch-ID local-017

## FIX-20260301-018: Genres-Archiv mit CSV und Duplikatpruefung

**Kategorie:** Export/JSON/Docs
**Symptom (fuer Laien):** Komma-Eingaben landeten nicht sauber einzeln im Archiv und Favoriten waren nicht eindeutig markierbar.
**Technische Ursache:** Es fehlte ein zentraler Importpfad mit Normalisierung (Linux-Slug), Duplikatcheck und Favoriten-Marker.
**Trigger:** Mehrere Eintraege in einem Feld, z. B. `*Techno*, House, techno`.
**Fix (kurz):** Neues Kernmodul fuer Genres/Moods/Stile angelegt: CSV-Split, Profil/Kategorie-Pruefung, Duplikatfilter, Sternchen-Favoriten, Import/Export und JSON-Logging.
**Geänderte Dateien/Marker:** system-core/genre_mood_style_archive.js, test/genre_mood_style_archive.test.js, docs/HILFE.md
**Tests/Checks:** npm run format, npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer bei Listenimporten zuerst normalisieren, dann Duplikate pruefen, danach loggen.
**Alternative(n):** Freitext ohne Regeln (abgelehnt, zu fehleranfällig).
**Risiko/Side-Effects:** Neue Datei und Tests erhoehen nur minimal die Laufzeit.
**Verknüpft:** Patch-ID local-018

## FIX-20260301-019: Enter-Escape-Hinweis-gegen-Tastaturluecke

**Kategorie:** UI/A11y/Tests
**Symptom (fuer Laien):** Hilfe nannte Escape, aber Enter als Starttaste war nicht klar genug beschrieben.
**Technische Ursache:** Der gefuehrte Guide hatte keinen expliziten Enter/Escape-Schritt und der Release-Check pruefte Enter nicht.
**Trigger:** Neue Nutzer arbeiten nur mit Tastatur und suchen den naechsten Schritt.
**Fix (kurz):** Guide um Enter/Escape-Schritt erweitert und Release-Readiness um Enter-Textpruefung ergaenzt.
**Geänderte Dateien/Marker:** config/messages_de.json (dashboardCompact.guideSteps), tools/release_readiness_check.js, docs/HILFE.md
**Tests/Checks:** npm test
**Prävention (künftig):** Ab jetzt immer Enter + Escape gemeinsam als Aktion + Rueckweg in Hilfeschritten nennen und automatisch pruefen.
**Alternative(n):** Nur Hinweis im Handbuch (abgelehnt, zu spaet sichtbar).
**Risiko/Side-Effects:** Ein zusaetzlicher Guide-Schritt, keine Logik-Aenderung.
**Verknüpft:** Patch-ID local-019

## FIX-20260301-020: Lockfile-Fingerprint-fuer-Abhaengigkeits-Sync

**Kategorie:** Update/Tests
**Symptom (fuer Laien):** Start wirkt erfolgreich, spaeter treten aber Paketfehler auf.
**Technische Ursache:** Es wurde nur geprueft, ob `node_modules` existiert, nicht ob Paketstaende veraltet sind.
**Trigger:** `package-lock.json` oder `package.json` wurde geaendert.
**Fix (kurz):** Start-Routine vergleicht einen Fingerprint (Hash) vom Lockfile/Paketstand und installiert bei Abweichung automatisch neu.
**Geänderte Dateien/Marker:** tools/start_routine.js, test/start_routine.test.js
**Tests/Checks:** npm test, bash start.sh
**Prävention (künftig):** Ab jetzt immer Paketstand gegen Lockfile-Fingerprint pruefen, nicht nur Ordner-Existenz.
**Alternative(n):** Immer `npm ci` ausfuehren (strenger, aber langsamer).
**Risiko/Side-Effects:** Niedrig, da nur Install-Entscheidung in der Start-Routine erweitert wurde.
**Verknüpft:** Patch-ID local-020

## FIX-20260301-021: Iterations-Doku-Drift zwischen Regeln und Einstieg

**Kategorie:** Docs/Workflow
**Symptom (fuer Laien):** Regeln und README liefen auseinander, dadurch war der aktuelle Stand nicht immer gleich klar sichtbar.
**Technische Ursache:** README-Update pro Iteration war nicht als Pflicht in AGENTS fest verankert.
**Trigger:** Iterationen mit Regel-Updates, aber ohne gleichzeitige README-Pflege.
**Fix (kurz):** AGENTS-Doku-Pflicht um README-Update erweitert und README um feste Iterations-Checkliste ergaenzt.
**Geänderte Dateien/Marker:** AGENTS.md (Schritt 4 + 16.8), README.txt (Iterations-Doku), CHANGELOG.md, SELFINFO.md, todo.txt
**Tests/Checks:** npm test
**Prävention (künftig):** Ab jetzt immer AGENTS- und README-Status im selben Patch aktualisieren.
**Alternative(n):** Nur Team-Absprache ohne feste Regel (abgelehnt, zu fehleranfällig).
**Risiko/Side-Effects:** Niedrig, betrifft nur Dokumentation und Ablaufklarheit.
**Verknüpft:** Patch-ID local-021

## FIX-20260301-001: Theme-Hilfe mit Rueckweg

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Beim Theme-Wechsel war unklar, wie man zur alten Ansicht zurueckgeht.
**Technische Ursache:** Der Theme-Select hatte keinen verknuepften Hilfetext und keine Rueckweg-Ansage.
**Trigger:** Nutzer wechselt Theme und verliert Orientierung.
**Fix (kurz):** Tooltip-Text in `messages_de.json` ergänzt, in `dashboard.html` per `aria-describedby` verknuepft und in `dashboard.js` dynamisch aktualisiert.
**Geaenderte Dateien/Marker:** templates/dashboard.html (theme-select), templates/dashboard.js (theme change), config/messages_de.json (dashboardCompact), templates/dashboard.css (field-tip).
**Tests/Checks:** `npm test`, `node tools/release_readiness_check.js`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer bei neuen Select-Feldern einen kurzen Hilfetext mit Rueckweg hinterlegen.
**Alternative(n):** Statischer Hinweis ohne Dynamik (weniger hilfreich).
**Risiko/Side-Effects:** Niedrig; nur Text und A11y-Verknuepfung betroffen.
**Verknuepft:** PATCH-027

## FIX-20260301-004: Platzhalter-Scan im Startlauf

**Kategorie:** Boot/Docs
**Symptom (fuer Laien):** Start wirkt erfolgreich, obwohl im Code noch offene TODO/FIXME-Marker stehen.
**Technische Ursache:** Es gab keinen automatischen Suchlauf nach Platzhaltern im Standard-Startpfad.
**Trigger:** Neue Iteration startet, aber offene Marker bleiben unbemerkt.
**Fix (kurz):** Start-Routine scannt Kernordner auf `TODO`, `FIXME`, `PLACEHOLDER`, `DUMMY` und stoppt mit Fundstelle.
**Geaenderte Dateien/Marker:** tools/start_routine.js, test/start_routine.test.js
**Tests/Checks:** npm test; gezielter Unit-Test mit temp-Datei im dummys-Ordner.
**Praevention (kuenftig):** Ab jetzt immer Platzhalter-Scan als Pflichtschritt vor Systemtest ausfuehren.
**Alternative(n):** Optional zusaetzlich als separaten npm Script-Check nutzen.
**Risiko/Side-Effects:** Gering; kann Start absichtlich blockieren, wenn Marker offen sind (gewollt).
**Verknuepft:** PATCH-029

## FIX-20260301-001: Hilfe-Panel-Leitfaden im UI sichtbar

**Kategorie:** UI/A11y
**Symptom (für Laien):** Hilfe war vorhanden, aber der schnelle 3-Schritt-Start war nicht direkt im Hilfe-Panel sichtbar.
**Technische Ursache:** README und Help-Panel waren inhaltlich nicht voll synchron.
**Trigger:** Neue Nutzer starten im Hilfe-Panel statt im README.
**Fix (kurz):** Mini-Leitfaden als Liste im Help-Panel ergänzt und im Modell auf 3 gültige Schritte validiert.
**Geänderte Dateien/Marker:** `system-module/help_panel.js`, `templates/help-panel.html`, `templates/help-panel.js`
**Tests/Checks:** `node --test test/help_panel.test.js`, `bash start.sh`
**Prävention (künftig):** Ab jetzt immer zentrale 3-Schritt-Leitfäden in README und Hilfe-UI gleichzeitig pflegen.
**Alternative(n):** Leitfaden nur im README lassen (abgelehnt, da schlechter sichtbar).
**Risiko/Side-Effects:** Niedrig, da nur Hilfetext und Validierung ergänzt wurden.
**Verknüpft:** Patch-ID iter33-help-panel-guide

## FIX-20260301-001: README-Fortschritt automatisch aus TODO

**Kategorie:** Docs/Start
**Symptom (für Laien):** Die Prozentzahl im README war manchmal nicht aktuell.
**Technische Ursache:** Fortschritt wurde manuell gepflegt und nicht bei jedem Start neu berechnet.
**Trigger:** TODO-Punkte aendern sich, README bleibt unveraendert.
**Fix (kurz):** Start-Routine berechnet erledigt/offen/prozent aus `todo.txt` und schreibt den README-Fortschrittsblock automatisch.
**Geänderte Dateien/Marker:** `tools/start_routine.js`, `test/start_routine.test.js`, `README.txt`.
**Tests/Checks:** `npm test`, `bash start.sh`.
**Prävention (künftig):** Ab jetzt immer den README-Fortschritt aus `todo.txt` ableiten, nie manuell zaehlen.
**Alternative(n):** Externes Script nur fuer Doku-Updates.
**Risiko/Side-Effects:** Niedrig; betrifft nur den Fortschrittsblock im README.
**Verknüpft:** Iteration-34

## FIX-20260301-010: Info-Dateien-Sync-fuer-Strategie

**Kategorie:** Docs/Prozess
**Symptom (fuer Laien):** Projektstand war schwer erfassbar, weil Strategie-Hinweise nicht in allen Info-Dateien gleich standen.
**Technische Ursache:** Iterative Doku wuchs, aber wurde nicht immer als gemeinsamer Block synchronisiert.
**Trigger:** Auftrag, Vorgehen und Strategie optimal auf den Projektstand auszurichten.
**Fix (kurz):** Einheitlichen Strategie-Block in SELFINFO, README, PROJECT_INFO, CHANGELOG und TODO nachgezogen sowie Folgefrage in QUESTIONS_TODO dokumentiert.
**Geaenderte Dateien/Marker:** SELFINFO.md, README.txt, PROJECT_INFO.md, CHANGELOG.md, todo.txt, QUESTIONS_TODO.md, AGENTS_LOG.md
**Tests/Checks:** bash start.sh
**Praevention (kuenftig):** Ab jetzt immer nach jedem Abschluss-Check einen kompakten Strategie-Sync in allen Info-Dateien in derselben Iteration ausfuehren.
**Alternative(n):** Nur CHANGELOG pflegen (abgelehnt, zu wenig sichtbar fuer Laien).
**Risiko/Side-Effects:** Kein Laufzeitrisiko, nur bessere Transparenz und Planung.
**Verknuepft:** Patch-ID PATCH-036

## FIX-20260301-011: Plugin-Loader-Pfadschutz-und-ID-Guard

**Kategorie:** Plugin/Security
**Symptom (fuer Laien):** Plugins konnten bei falscher Konfiguration verwirrende Fehler zeigen oder aus unsicheren Pfaden geladen werden.
**Technische Ursache:** Es gab keinen Check auf doppelte Plugin-IDs und keinen harten Projektgrenzen-Check fuer `modulePath`.
**Trigger:** Duplizierte IDs im Manifest oder relativer Pfad wie `../...` im Modulpfad.
**Fix (kurz):** Manifest validiert IDs eindeutig; Loader erlaubt nur Modulpfade innerhalb des Projektordners.
**Geaenderte Dateien/Marker:** `system-core/plugin_loader.js`, `test/plugin_loader.test.js`, `dummys/unsafe-plugin-manifest.json`
**Tests/Checks:** `npm test -- test/plugin_loader.test.js`, `bash start.sh`
**Praevention (kuenftig):** Ab jetzt immer ID-Eindeutigkeit und Projektgrenzen fuer Dateipfade in Loadern pruefen.
**Alternative(n):** Blockliste fuer einzelne Pfade (abgelehnt, zu fehleranfaellig).
**Risiko/Side-Effects:** Niedrig; strengere Validierung kann fehlerhafte Altmanifeste frueher stoppen (gewollt).
**Verknuepft:** PATCH-037

## FIX-20260301-039: Backup-Dialog-Readiness sichtbar

**Kategorie:** UI/A11y/Docs
**Symptom (für Laien):** Es war unklar, wann ein einzelner Punkt wirklich release-fertig ist.
**Technische Ursache:** Der 5-Punkte-Check war nur in README und nicht direkt bei der Backup-Aktion sichtbar.
**Trigger:** Nutzer oeffnet Hilfe-Aktionen im Dashboard und sucht Freigabe-Regeln.
**Fix (kurz):** Backup-Dialog mit Inline-Check eingefuegt und Release-Readiness um Doku-Regel erweitert.
**Geänderte Dateien/Marker:** templates/dashboard.html, templates/dashboard.js, templates/dashboard.css, tools/release_readiness_check.js
**Tests/Checks:** node --test test/release_readiness_check.test.js, bash start.sh
**Prävention (künftig):** Ab jetzt immer Freigabe-Check direkt an der relevanten UI-Aktion anzeigen.
**Alternative(n):** Nur README-Text ohne Dialoghilfe (schlechter fuer schnelle Bedienung).
**Risiko/Side-Effects:** Niedrig, da nur statische Checks und Dialog-UI erweitert wurden.
**Verknüpft:** PATCH-039

## FIX-20260301-040: Sichtbarkeit mit 5-Theme-Standard

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Drei Themes reichten nicht fuer alle Sehbeduerfnisse; manche Nutzer brauchten weichere Kontrastvarianten.
**Technische Ursache:** Theme-Auswahl und Release-Check waren auf 3 Themes begrenzt.
**Trigger:** Wunsch nach optimaler Lesbarkeit fuer sehschwache Nutzer und mehr Theme-Flexibilitaet.
**Fix (kurz):** Zwei neue Themes (`warm`, `camo`) in HTML/CSS ergänzt und Release-Readiness darauf erweitert.
**Geaenderte Dateien/Marker:** `templates/dashboard.html`, `templates/dashboard.css`, `tools/release_readiness_check.js`, `README.txt`, `docs/HILFE.md`
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`
**Praevention (kuenftig):** Ab jetzt immer bei Theme-Aenderung HTML, CSS, Release-Check und Doku im gleichen Patch synchronisieren.
**Alternative(n):** Nur Kontrast+ verbessern (abgelehnt, zu wenig Auswahl fuer lange Nutzung).
**Risiko/Side-Effects:** Niedrig; nur Styles, Auswahloptionen und Doku angepasst.
**Verknuepft:** PATCH-040

## FIX-20260301-041: Theme-Kontrast im Release-Check automatisiert

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Ein Theme wirkt schoen, aber Text ist zu schwer lesbar.
**Technische Ursache:** Kontrast wurde bisher nur ueber feste String-Checks validiert, nicht berechnet.
**Trigger:** Neue Theme-Farben werden eingepflegt oder bestehende Farben geaendert.
**Fix (kurz):** Kontrastberechnung (WCAG) fuer `--fg/--bg` und `--topbar-fg/--topbar` in allen 5 Themes eingebaut.
**Geaenderte Dateien/Marker:** `tools/release_readiness_check.js`, `test/release_readiness_check.test.js`.
**Tests/Checks:** `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer jede Theme-Aenderung ueber den automatischen Kontrast-Check laufen lassen.
**Alternative(n):** Externes A11y-Tool im Browser nutzen.
**Risiko/Side-Effects:** Bei ungueltigen Farbformaten wird der Release-Check bewusst frueh abbrechen.
**Verknuepft:** PATCH-041

## FIX-20260301-001: Backup-Hook-Log fuer Dialogauswahl

**Kategorie:** Backup/UI
**Symptom (für Laien):** Im Backup-Dialog war keine echte Datei-Auswahl sichtbar.
**Technische Ursache:** Backup-Hook lieferte Ereignisse, aber kein zentrales Event-Log für die UI.
**Trigger:** Backup wird beim Schreiben erzeugt, danach soll der Dialog die Datei direkt anbieten.
**Fix (kurz):** Neues Modul `backup_hook_log` speichert Backup-Ereignisse in `data/backup_events.json`; Registry-Write nutzt den Hook.
**Geänderte Dateien/Marker:** `system-core/backup_hook_log.js`, `system-core/registry_service.js`, `templates/dashboard.html`, `templates/dashboard.js`
**Tests/Checks:** `node --test`, `bash start.sh`, neuer Registry-Test für Backup-Hook-Log.
**Prävention (künftig):** Ab jetzt immer Hook-Ereignisse zentral speichern, wenn UI daraus Auswahlfelder fuellt.
**Alternative(n):** Direktes Dateisystem-Listing im Browser (aber unzuverlaessig ohne Berechtigung).
**Risiko/Side-Effects:** Niedrig, da nur Backup-Pfad erweitert.
**Verknüpft:** PATCH-042

## FIX-20260301-043: Backup-Restore ueber Projektordner

**Kategorie:** Backup
**Symptom (für Laien):** "Backup wiederherstellen" zeigte nur eine Vorbereitung, aber schrieb keine Datei.
**Technische Ursache:** Im Dashboard gab es keinen echten Dateisystem-Schreibpfad fuer den Backup-Button.
**Trigger:** Backup im Dialog auswaehlen und auf "Backup wiederherstellen" klicken.
**Fix (kurz):** Restore-Logik in `templates/backup_restore.js` ausgelagert und mit Projektordner-Handle, JSON-Pruefung und Write-Verify verbunden.
**Geänderte Dateien/Marker:** templates/backup_restore.js, templates/dashboard.js (restoreSelectedBackup), templates/dashboard.html (Script + Hilfetext).
**Tests/Checks:** node --test test/backup_restore.test.js; node --test test/release_readiness_check.test.js; bash start.sh.
**Prävention (künftig):** Ab jetzt immer jeden UI-Button auf echten Ende-zu-Ende-Schreibpfad plus Validierung pruefen.
**Alternative(n):** Restore ueber Backend/CLI statt Browser-Dateisystem.
**Risiko/Side-Effects:** Browser ohne File-System-API brauchen den bestehenden Reparaturweg.
**Verknüpft:** PATCH-043

## FIX-20260301-044: Ziel-Datei im Restore-Dialog explizit waehlen

**Kategorie:** UI/Backup
**Symptom (fuer Laien):** Es war unklar, welche Datei bei Wiederherstellung wirklich ueberschrieben wird.
**Technische Ursache:** Ziel-Datei wurde aus dem Backup-Dateinamen abgeleitet statt im Dialog gewaehlt.
**Trigger:** Backup-Datei auswaehlen und auf "Backup wiederherstellen" klicken.
**Fix (kurz):** Neuer Ziel-Datei-Select im Dialog + Validierung vor Restore; Todo-Modul mit Kalender und Archiv als sichtbare UX-Verbesserung.
**Geaenderte Dateien/Marker:** `templates/dashboard.html`, `templates/dashboard.js`, `templates/backup_restore.js`, `templates/todo_module.js`, `system-module/todo_list_model.js`.
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer kritische Zielpfade im Dialog explizit waehlbar machen und vor Ausfuehrung validieren.
**Alternative(n):** Automatische Zielerkennung mit Sicherheitsfrage (spaeter moeglich).
**Risiko/Side-Effects:** Niedrig; ein zusaetzlicher Auswahlschritt im Dialog.
**Verknuepft:** PATCH-044

## FIX-20260301-045: Todo-Persistenz mit Modell-Validierung

**Kategorie:** UI/Storage
**Symptom (fuer Laien):** Aufgaben waren nach Neustart weg.
**Technische Ursache:** Todo-Liste lebte nur im Arbeitsspeicher, ohne Speichern in Projektdatei.
**Trigger:** Seite neu laden oder Browser neu starten.
**Fix (kurz):** Todo-Modul schreibt optional nach `data/store.json` und laedt beim Start; Modell bekam `exportState/importState` mit Strukturpruefung.
**Geaenderte Dateien/Marker:** `templates/todo_module.js`, `system-module/todo_list_model.js`, `templates/dashboard.js`, `data/store.json`.
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer bei neuen UI-Listen frueh einen optionalen Persistenzpfad + Importvalidierung mitplanen.
**Alternative(n):** Nur SessionStorage (verworfen, da nicht projektordnerbasiert).
**Risiko/Side-Effects:** Niedrig; ohne Projektordner bleibt Verhalten wie vorher (nur im Speicher).
**Verknuepft:** PATCH-045

## FIX-20260301-012: Todo-Filter-ohne-Umwege

**Kategorie:** UI/A11y
**Symptom (für Laien):** Offene Aufgaben waren bei vielen Tagen schwer zu finden.
**Technische Ursache:** Es gab nur einen Tagesblick ohne schnellen Listenfilter.
**Trigger:** Mehrere offene Aufgaben ueber verschiedene Tage.
**Fix (kurz):** Filteroptionen (Kalendertag/Heute/Offen/Archiv) + Escape-Rueckweg eingebaut.
**Geänderte Dateien/Marker:** templates/dashboard.html, templates/todo_module.js, system-module/todo_list_model.js
**Tests/Checks:** npm run format, node --test, bash start.sh
**Prävention (künftig):** Ab jetzt immer bei Listenmodulen einen klaren Filter + Tastatur-Rueckweg mitplanen.
**Alternative(n):** Nur Suchfeld (abgelehnt, fuer Laien weniger klar).
**Risiko/Side-Effects:** Mehr UI-Elemente im Aufgabenbereich, aber mit Hilfetext abgefedert.
**Verknüpft:** Patch-ID PATCH-046

## FIX-20260301-001: Restore-Ziel vertauscht

**Kategorie:** Backup/UI
**Symptom (fuer Laien):** Falsche Ziel-Datei konnte ausgewaehlt werden.
**Technische Ursache:** Restore-Plan hatte keine harte Paar-Pruefung zwischen Backup und Ziel.
**Trigger:** Backup `store.backup.json` mit Ziel `registry.json` kombiniert.
**Fix (kurz):** Auto-Zielerkennung aus Backup-Name + erlaubte Ziel-Liste + Sicherheitsabfrage vor Schreibvorgang.
**Geaenderte Dateien/Marker:** `templates/backup_restore.js`, `templates/dashboard.js`, `test/backup_restore.test.js`
**Tests/Checks:** `node --test`, `bash start.sh`
**Praevention (kuenftig):** Ab jetzt immer Restore-Paare vor dem Schreiben hart validieren und Nutzerbestaetigung verlangen.
**Alternative(n):** Dialog mit doppeltem Dropdown ohne Auto-Ziel.
**Risiko/Side-Effects:** Prompt kann im sehr restriktiven Browser blockiert sein.
**Verknuepft:** PATCH-047

## FIX-20260301-049: Prompt-Sicherheitsabfrage-testbar-gemacht

**Kategorie:** Backup/UI/Test
**Symptom (fuer Laien):** Die Sicherheitsabfrage vor Restore war vorhanden, aber nicht automatisiert pruefbar.
**Technische Ursache:** Prompt-Pruefung lag direkt im UI-Code ohne wiederverwendbare Funktion.
**Trigger:** Backup-Dialog fragt Dateiname ab, aber Tests konnten nur indirekt pruefen.
**Fix (kurz):** Neue Funktion `isRestoreConfirmationValid` in `templates/backup_restore.js`; Dashboard nutzt diese Funktion; Test deckt gueltig/ungueltig-Faelle ab.
**Geaenderte Dateien/Marker:** `templates/backup_restore.js`, `templates/dashboard.js`, `test/backup_restore.test.js`
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`
**Praevention (kuenftig):** Ab jetzt immer Sicherheitsabfragen als eigene pure Funktion bauen und direkt testen.
**Alternative(n):** Prompt-Pruefung nur E2E testen (abgelehnt, zu fragil).
**Risiko/Side-Effects:** Niedrig; nur Vergleichslogik wurde zentralisiert.
**Verknuepft:** PATCH-049

## FIX-20260301-053: Kanban-Dummytexte-durch-echte-Daten

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Kanban zeigt nur Beispieltexte und ist nicht produktiv nutzbar.
**Technische Ursache:** Spalten waren statisch direkt im HTML verdrahtet und hatten keine Datenanbindung.
**Trigger:** Dashboard laden ohne dynamisches Kanban-Modul.
**Fix (kurz):** Kanban-Modul eingefuehrt, JSON-Daten aus `data/kanban_board.json` geladen, Tastaturpfad mit links/rechts + Fokuszustand aktiviert.
**Geaenderte Dateien/Marker:** `templates/kanban_preview.js`, `templates/dashboard.html`, `templates/dashboard.js`, `templates/dashboard.css`, `data/kanban_board.json`.
**Tests/Checks:** `node --test`, `bash start.sh`, neuer Test `test/kanban_preview.test.js`.
**Praevention (kuenftig):** Ab jetzt immer UI-Schnellansichten erst als Datenmodul bauen, nie als statischen Blindtext.
**Alternative(n):** Kanban im HTML lassen und nur Text tauschen (abgelehnt: nicht wartbar).
**Risiko/Side-Effects:** Bei fehlender JSON-Datei zeigt das UI jetzt klaren Fehler mit naechstem Schritt statt stiller Dummyanzeige.
**Verknuepft:** Patch-ID PATCH-053

## FIX-20260301-007: Kanban-Verschiebung-persistent-mit-Speicher-Validierung

**Kategorie:** UI/JSON
**Symptom (fuer Laien):** Nach Neustart war die verschobene Karte wieder an alter Stelle.
**Technische Ursache:** Karten wurden nur im Arbeitsspeicher verschoben, aber nicht in `data/kanban_board.json` gespeichert.
**Trigger:** Karte im Kanban-Dialog verschieben und Seite neu laden.
**Fix (kurz):** Save-Pfad in Kanban-Modul eingebaut, vor Write Schema geprueft, Ergebnis auf Erfolg validiert.
**Geaenderte Dateien/Marker:** templates/kanban_preview.js, templates/dashboard.js, test/kanban_preview.test.js
**Tests/Checks:** npm run format, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei UI-Zustandsaenderung pruefen: wird nur angezeigt oder auch dauerhaft gespeichert?
**Alternative(n):** Nur LocalStorage nutzen (abgelehnt, da Projektdatei als Quelle gewuenscht).
**Risiko/Side-Effects:** File-Write braucht gueltigen Projektordner-Handle.
**Verknuepft:** Patch-ID PATCH-055

## FIX-20260301-061: Quick-Store-Bereichstrennung

**Kategorie:** UI/JSON
**Symptom (fuer Laien):** Notizen aus unterschiedlichen Themen waren gemischt.
**Technische Ursache:** Ein einziger Listenpfad ohne Bereichsmodell.
**Trigger:** Mehrere Notiztypen wurden nacheinander gespeichert.
**Fix (kurz):** Bereichsmodell mit `inbox|lyrics|research` eingefuehrt und Persistenz als `areas`-Objekt gespeichert.
**Geaenderte Dateien/Marker:** `system-module/quick_store_model.js`, `templates/quick_store_module.js`, `templates/dashboard.html`, `templates/dashboard.js`.
**Tests/Checks:** `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer Bereichsfeld im Modell vor Persistenz validieren.
**Alternative(n):** Drei Einzeldateien pro Bereich (spaeter moeglich).
**Risiko/Side-Effects:** Alte Dateien ohne `areas` werden als inbox importiert.
**Verknuepft:** PATCH-061

## FIX-20260302-002: Songtext-Vorlagen-und-Lesemodus

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Im Songtext-Bereich fehlten wichtige Abschnitte (Bridge/Sonstiges) und es gab keine ruhige Leseflaeche.
**Technische Ursache:** Es gab nur Intro/Refrain-Buttons und keine zentrale Vorschau-Funktion mit Eingabepruefung.
**Trigger:** Schreiben laengerer Songideen im Bereich `lyrics`.
**Fix (kurz):** Zwei neue Vorlagen plus Lesemodus-Datenmodell (`Titel`, `Zeilenanzahl`, bereinigter Text) eingefuehrt.
**Geaenderte Dateien/Marker:** `templates/quick_store_module.js`, `templates/dashboard.html`, `templates/dashboard.js`, `test/quick_store_module.test.js`.
**Tests/Checks:** `npm run format`, `node --test`, `bash start.sh`.
**Praevention (kuenftig):** Ab jetzt immer Vorlagen und Lesemodus als zentrale Helper bauen, statt UI-Strings mehrfach zu verteilen.
**Alternative(n):** Externe Editor-Seite (verworfen, zu hoher Wechselaufwand fuer Laien).
**Risiko/Side-Effects:** Niedrig, da nur das Quick-Store-Panel erweitert wurde.
**Verknuepft:** Iteration-63

## FIX-20260302-001: Lyrics-Preview-Rueckweg

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Lesemodus im Songtext blieb offen und hatte keinen klaren Schliessen-Knopf.
**Technische Ursache:** Vorschau hatte nur einen Oeffnen-Flow, aber keinen dedizierten Close-Handler.
**Trigger:** Nutzer oeffnet Lesemodus und will per Tastatur schnell zurueck.
**Fix (kurz):** Close-Button plus Escape-Logik eingebaut; Vorschau setzt `aria-hidden` wieder auf `true`.
**Geaenderte Dateien/Marker:** `templates/dashboard.html`, `templates/quick_store_module.js`, `templates/dashboard.js`
**Tests/Checks:** `node --test`, `bash start.sh`
**Praevention (kuenftig):** Ab jetzt immer fuer jedes Overlay/Panel einen sichtbaren Schliessen-Knopf + Escape-Rueckweg mit Statusmeldung einbauen.
**Alternative(n):** Automatisches Schliessen bei Bereichswechsel ohne extra Knopf.
**Risiko/Side-Effects:** Niedrig, da nur Lyrics-Preview-Flow betroffen.
**Verknuepft:** patch-064

## FIX-20260303-001: Theme-Kontrast fuer Rail/Banner/Karten

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Einige Rahmen und Banner wirkten je Theme unterschiedlich stark und teils zu schwach.
**Technische Ursache:** Kontrast-Checks deckten nur Haupttext + Topbar ab, nicht Rail/Banner/Karten.
**Trigger:** Theme-Wechsel auf warm/camo mit Referenzbild-Abgleich.
**Fix (kurz):** Zentrale Tokens fuer Rail/Banner/Kartenprofile eingefuehrt und Release-Check auf diese Flaechen erweitert.
**Geaenderte Dateien/Marker:** templates/dashboard.css, tools/release_readiness_check.js, templates/module_workspace.js.
**Tests/Checks:** node --test, npm run format, bash start.sh, Screenshot-Abgleich.
**Praevention (kuenftig):** Ab jetzt immer Kontrast fuer Text + Banner + Rail + Kartenprofile je Theme automatisiert pruefen.
**Alternative(n):** Einzelwerte je Karte hart codieren (verworfen wegen Wartbarkeit).
**Risiko/Side-Effects:** Gering, da nur Stil-Tokens und Checks erweitert wurden.
**Verknuepft:** Iteration 66

## FIX-20260303-003: Lyrics-Copy-Guide-Flow

**Kategorie:** UI/A11y
**Symptom (für Laien):** Im Lesemodus konnte Text nicht direkt uebernommen werden, und Hilfe war nicht einklappbar.
**Technische Ursache:** Es gab keinen Clipboard-Pfad und keine eigene Guide-Toggle-Logik mit Fokusziel.
**Trigger:** Nutzer oeffnet Lesemodus und will Text in ein anderes Modul uebernehmen.
**Fix (kurz):** Kopieren-Knopf mit Validierung + Statusmeldung ergaenzt, dazu einklappbaren Kurzguide mit `aria-expanded` und Fokusziel eingebaut.
**Geänderte Dateien/Marker:** templates/dashboard.html, templates/quick_store_module.js, templates/dashboard.js
**Tests/Checks:** node --test test/quick_store_module.test.js; node --test; bash start.sh
**Prävention (künftig):** Ab jetzt immer bei Lesemodus-Funktionen direkten Copy-Pfad plus Rueckweg-Hilfe anbieten.
**Alternative(n):** Nur manuelles Markieren/Kopieren (nicht empfohlen).
**Risiko/Side-Effects:** Clipboard kann browserabhaengig blockiert sein, daher klare Fehlermeldung mit manuellem Rueckweg.
**Verknüpft:** Iteration-65

## FIX-20260303-004: Lyrics-Kurzguide-und-Kopierhilfe

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Bei Songtexten war unklar, wie Enter/Space genutzt wird; bei Clipboard-Sperre fehlte eine sichtbare Hilfe.
**Technische Ursache:** Guide hatte keine Schrittliste und Lesemodus zeigte keinen eigenen Hilfetext fuer den Fehlerpfad.
**Trigger:** Nutzer nutzt Vorlagen nur per Tastatur oder Browser blockiert `clipboard.writeText`.
**Fix (kurz):** Kurzguide um 2-Schritt-Liste erweitert und Lesemodus um einblendbare Kopierhilfe mit manuellem Rueckweg ergaenzt.
**Geaenderte Dateien/Marker:** templates/dashboard.html, templates/quick_store_module.js, templates/dashboard.js
**Tests/Checks:** npm run format, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei Copy-Aktionen einen sichtbaren manuellen Rueckweg im gleichen Dialog anbieten.
**Alternative(n):** Nur Statusmeldung ohne Inline-Hilfe (verworfen).
**Risiko/Side-Effects:** Niedrig, da nur Lyrics-Bereich betroffen.
**Verknuepft:** PATCH-067

## FIX-20260301-067: Songtext-Kurzguide-mit-Rueckweg

**Kategorie:** UI/A11y
**Symptom (für Laien):** Im Songtext-Bereich war nicht klar, dass Speichern ein eigener Schritt mit Rueckweg ist.
**Technische Ursache:** Kurzguide hatte nur zwei Schritte und der Kopieren-Knopf nannte keinen Tastaturweg direkt im Label.
**Trigger:** Nutzer arbeitet ohne Maus im Lesemodus und will sichere Reihenfolge.
**Fix (kurz):** Kopieren-Knopf auf "Songtext kopieren (Enter/Space)" erweitert und Kurzguide auf drei Schritte inkl. Speichern + Rueckweg angehoben.
**Geänderte Dateien/Marker:** `templates/dashboard.html` (Lyrics-Kurzguide + Lesemodus-Knopf), `test/dashboard_lyrics_guidance.test.js`.
**Tests/Checks:** node --test dashboard_lyrics_guidance + Volltestlauf + start.sh.
**Prävention (künftig):** Ab jetzt immer bei neuen Buttons den Tastaturweg direkt im sichtbaren Label nennen, wenn er zentral fuer den Ablauf ist.
**Alternative(n):** Nur Tooltip statt Label (verworfen, weil weniger sichtbar bei Screenreader-Flow).
**Risiko/Side-Effects:** Niedrig, nur UI-Texte und ein gezielter Test.
**Verknüpft:** PATCH-067

## FIX-20260303-068: Songtext-Zufallsimpuls-mit-Fokus-Rueckweg

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Es gab keinen 1-Klick-Start fuer Songideen und nach dem Lesemodus war der Fokusweg unklar.
**Technische Ursache:** Zufallsimpuls fehlte im Lyrics-Editor; Vorschau-Schliessen fokussierte nicht das wichtigste Eingabefeld.
**Trigger:** Nutzer startet Songideen ohne Vorlage und arbeitet nur mit Tastatur.
**Fix (kurz):** Zufallsimpuls-Button integriert, Generatorblock eingebaut und Lesemodus-Ruecksprung auf Titel-Feld gesetzt.
**Geaenderte Dateien/Marker:** templates/quick_store_module.js, templates/dashboard.html, templates/dashboard.js
**Tests/Checks:** npm run format, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei neuen Dialog-/Vorschaupfaden den Ziel-Fokus nach dem Schliessen explizit definieren und testen.
**Alternative(n):** Ruecksprung auf Vorschau-Knopf (verworfen, weniger hilfreich fuer direkte Bearbeitung).
**Risiko/Side-Effects:** Niedrig, da nur Lyrics-Teilbereich geaendert.
**Verknuepft:** PATCH-068

## FIX-20260303-073: Shortcut-Konflikthinweis-im-Startcheck

**Kategorie:** UI/A11y
**Symptom (fuer Laien):** Tastaturkuerzel wirken je Betriebssystem unterschiedlich und das war vor dem Start nicht sichtbar.
**Technische Ursache:** Die Start-Routine pruefte Shortcuts bisher nicht auf bekannte OS-Besonderheiten.
**Trigger:** Lesemodus nutzt Alt+T/Alt+I fuer Fokusziel und kann auf manchen Tastaturen Sonderzeichen ausloesen.
**Fix (kurz):** Neuer Shortcut-Konfliktcheck in `tools/start_routine.js` meldet Hinweise mit naechstem Schritt; Statuslog im Lesemodus nennt Alt+T/Alt+I sichtbar.
**Geaenderte Dateien/Marker:** tools/start_routine.js, templates/quick_store_module.js, test/start_routine.test.js
**Tests/Checks:** npm run format, node --test, bash start.sh
**Praevention (kuenftig):** Ab jetzt immer bei neuen Shortcuts einen Startcheck-Hinweis und eine sichtbare In-App-Hilfe zusammen ausliefern.
**Alternative(n):** Nur Doku-Hinweis ohne Startcheck (verworfen, zu spaet sichtbar).
**Risiko/Side-Effects:** Niedrig, da nur Hinweislogik erweitert wurde.
**Verknuepft:** PATCH-073
