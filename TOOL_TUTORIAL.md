# TOOL_TUTORIAL.md

## Ziel
Kurzanleitung für die Pflege dieses Repositories in kleinen, sicheren Schritten.

## Minimalablauf pro Iteration
1. Kurzplanung schreiben (Ziel, Dateien, Risiken, Nicht-Änderungen, Schritte).
2. Kleine, begründete Patches umsetzen.
3. Nur relevante Endprüfung machen.
4. `README.md`, `todo.txt` und `INDEX.md` aktualisieren.

## INDEX.md aktualisieren
1. Aktuelle Projektdateien prüfen (ohne `.git`).
2. Verzeichnisbaum in `INDEX.md` anpassen.
3. Dateiliste in `INDEX.md` anpassen.
4. Änderungen kurz in `README.md` und `todo.txt` spiegeln.

## Offline-Start schnell prüfen
1. Datei `index.html` direkt im Browser öffnen.
2. Auf den Statustext achten: „Offline-Start aktiv. Basis geladen.“
3. Wenn der Text sichtbar ist, ist der Minimalstart erfolgreich.

## Robustheits-Check für Startstatus
1. `index.html` normal im Browser öffnen.
2. Seite einmal direkt neu laden (Strg+R).
3. Prüfen, dass der Text weiterhin „Offline-Start aktiv. Basis geladen.“ zeigt.
4. Ergebnis: Der Starttext bleibt stabil, auch wenn das DOM später fertig ist.

## Verbindungsstatus schnell prüfen (neu)
1. `index.html` im Browser öffnen.
2. Browser kurz in den Offline-Modus setzen (DevTools Netzwerk: Offline).
3. Prüfen: Text zeigt „Offline-Start aktiv. Basis geladen.“
4. Offline-Modus beenden.
5. Prüfen: Text wechselt auf „Start aktiv. Verbindung verfügbar.“
## Muster-Modul `datenbank_baukasten` prüfen (neu)
1. Prüfen, dass genau diese Dateien existieren:
   - `manifest.json`
   - `config.json`
   - `texts.json`
   - `schema.json`
   - `logic.js`
2. `index.html` öffnen.
3. Im Kasten „Modulübersicht“ muss stehen: „1 Modulprofil bereit: datenbank_baukasten. Mindestteile konsistent hinterlegt.“

## CSP-Basisschutz kurz prüfen (neu)
1. `index.html` im Browser öffnen.
2. DevTools öffnen und in „Elements“ den `<head>` prüfen.
3. Es muss ein `meta` mit `http-equiv="Content-Security-Policy"` vorhanden sein.
4. Ergebnis: Nur lokale Quellen (`'self'`) sind für Skript und Styles erlaubt.

---
Stand: aktualisiert nach Modulstandard-Patch `datenbank_baukasten`.
