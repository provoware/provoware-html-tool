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
