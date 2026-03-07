# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere kleine Iterationen.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Rechte, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Profil-Archiv und Zufallsmix schnell nutzen
1. Einen Ordner wählen.
2. Im Bereich **Profil-Archiv** ein Profil wählen (z. B. HardTechno).
3. In Genre, Stimmung, Stil je einen Eintrag schreiben und mit **Enter** oder **Speichern** bestätigen.
4. Bei **Statistik** prüfen, ob die Mengen je Bereich steigen.
5. Bei **Zufallsmix** Bereiche aktiv lassen und Schnellbutton **1**, **3** oder **5** klicken.
6. Ergebnis im Feld **Mix-Ausgabe** prüfen. Der Text wird automatisch in die Zwischenablage kopiert (wenn erlaubt).

### Import / Export kurz prüfen
1. Auf **Export** klicken.
2. Prüfen, ob JSON im Feld erscheint.
3. JSON verändern oder wieder einfügen.
4. Auf **Import** klicken und danach die Liste prüfen.

## Auto-Formatierung prüfen
1. Seite neu laden.
2. **Selbsttest starten** klicken.
3. In **Startstatus**, **Prüfergebnisse** und **Letzte Meldungen** prüfen:
   - Texte starten sauber mit Großbuchstabe,
   - Enden bekommen automatisch Punkt, wenn keiner vorhanden ist,
   - lange Texte brechen ohne Layout-Bruch um.

## Endprüfung (nur relevant)
- Syntax prüfen: `node --check js/app.js`
- Zusatz-Syntax: `node --check js/ui.js`
- JSON prüfen: `python3 -m json.tool data/project-structure.json > /dev/null`

## Stand
- Aktualisiert: 2026-03-07
- Iterationsfokus: Profil-Archiv mit Zufallsmix und JSON-Persistenz
