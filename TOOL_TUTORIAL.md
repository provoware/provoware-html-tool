# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere kleine Iterationen.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Rechte, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Nur-Lesen-Hinweis kurz prüfen (neu)
1. Einen Ordner wählen, bei dem Lesen erlaubt ist, Schreiben aber blockiert ist.
2. Danach **Selbsttest starten**.
3. Im Bereich **Projektordner-Status** bei **Schreiben** prüfen, ob `⚠ nur lesen` angezeigt wird.
4. Ziel: Der Sonderfall ist klar sichtbar und nicht als kompletter Fehler missverständlich.

### Profil-Standard kurz prüfen
1. Seite neu laden.
2. Ohne Klick auf die Profil-Auswahl direkt einen Eintrag speichern.
3. Danach im Profil **HardTechno** prüfen, ob der Eintrag dort sichtbar ist.
4. Ziel: Es wird kein verstecktes Profil mit dem Namen `undefined` erzeugt.

### Vorlagen-Layout schnell prüfen
1. Seite neu laden.
2. Prüfen, ob oben ein durchgehendes Titelband sichtbar ist.
3. Prüfen, ob links die hohe Navigationsleiste klar getrennt ist.
4. Prüfen, ob in der Mitte die große Arbeitsfläche mit feinem Raster sichtbar ist.
5. Prüfen, ob rechts die eigene Statuskachel sichtbar ist.
6. Prüfen, ob unten die Log-Zone als Segment-Fußleiste erscheint.

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
### Statusbereich rechts mit Symbolen prüfen
1. Seite neu laden.
2. **Ordner wählen** und danach **Selbsttest starten**.
3. Im Bereich **Projektordner-Status** prüfen:
   - **Lesen** zeigt `✔ ok` oder `✖ nein`,
   - **Schreiben** zeigt `✔ ok`, `⚠ nur lesen` oder `✖ nein`,
   - **Struktur** zeigt `✔ ok` oder `⚠ fehlt teilweise`.
4. Ziel: Das Symbolmuster ist überall gleich wie in der Gesamtampel und in den Prüfkarten.

### Statussymbole schnell prüfen
1. Seite neu laden.
2. **Selbsttest starten** klicken.
3. In **Prüfergebnisse** prüfen, ob vor jedem Check ein Symbol steht:
   - `✔` für ok,
   - `⚠` für gelb,
   - `✖` für rot.
4. Im Feld **Gesamtampel** prüfen, ob Symbol und Wort zusammen angezeigt werden (z. B. `⚠ gelb`).

### Auto-Formatierung prüfen
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
- Iterationsfokus: Nutzerfreundlichkeit bei Rechten (klarer Hinweis für `nur lesen`)
