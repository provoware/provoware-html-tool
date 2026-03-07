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

## Todo-Liste mit Kalender und Erinnerung prüfen
1. `index.html` im Browser öffnen.
2. Im Bereich „Todo-Liste mit Kalenderfunktion“ eine Aufgabe eintragen.
3. Prüfen, dass die Aufgabe unten in der Liste erscheint.
4. Erinnerungszeit auf nahen Zeitpunkt setzen.
5. Prüfen, dass später der Zusatz „Erinnerung gesendet.“ angezeigt wird.

## Verbindungsstatus schnell prüfen
1. `index.html` im Browser öffnen.
2. Browser kurz in den Offline-Modus setzen (DevTools Netzwerk: Offline).
3. Prüfen: Text zeigt „Offline-Start aktiv. Basis geladen.“
4. Offline-Modus beenden.
5. Prüfen: Text wechselt auf „Start aktiv. Verbindung verfügbar.“

## Panel-Design (Bildbeispiel) kurz prüfen (neu)
1. `index.html` im Browser öffnen.
2. Prüfen, dass beide Hauptkarten runde Ecken, Verlauf und Schatten haben.
3. Prüfen, dass in jeder Karte eine sichtbare Rasterfläche vorhanden ist.
4. Prüfen, dass unten drei kleine Segment-Chips sichtbar sind.
5. Prüfen, dass Eingaben und Liste im Todo-Bereich weiterhin normal nutzbar sind.

## Muster-Modul `datenbank_baukasten` prüfen
1. Prüfen, dass genau diese Dateien existieren:
   - `manifest.json`
   - `config.json`
   - `texts.json`
   - `schema.json`
   - `logic.js`
2. `index.html` öffnen.
3. In „Modulübersicht“ muss die Profilmeldung ohne Fehler erscheinen.

## CSP-Basisschutz kurz prüfen
1. `index.html` im Browser öffnen.
2. DevTools öffnen und in „Elements“ den `<head>` prüfen.
3. Es muss ein `meta` mit `http-equiv="Content-Security-Policy"` vorhanden sein.
4. Ergebnis: Nur lokale Quellen (`'self'`) sind für Skript und Styles erlaubt.

---
Stand: aktualisiert nach Layout-Anpassung im Panel-Stil.
