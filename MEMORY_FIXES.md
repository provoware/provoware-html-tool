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
**Fix (kurz):** Schreiben über tmp-Datei, dann atomar umbenennen; Backup mit Auswahl ergänzt.
**Geänderte Dateien/Marker:** system-core/json_store.js, system-core/self_repair.js
**Tests/Checks:** node --test, bash start.sh
**Prävention (künftig):** Ab jetzt immer atomar schreiben und Backup-Liste vor Reparatur zeigen.
**Alternative(n):** SQLite mit Transaktionen.
**Risiko/Side-Effects:** Mehr Dateien im data-Ordner.
**Verknüpft:** Patch-ID local-001
