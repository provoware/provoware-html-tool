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
