# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere kleine Iterationen.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Rechte, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
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

### Design-Feinschliff prüfen
1. Mehrere Meldungen erzeugen (z. B. Struktur prüfen + Selbsttest).
2. Im Log prüfen, ob Uhrzeiten ruhig untereinander stehen.
3. Prüfen, ob lange Meldungen in Karten lesbar bleiben.

## Kleine Erweiterung dieser Iteration (alt)
### Tool-Optik-Vorgabe schnell prüfen
1. Seite neu laden.
2. Auf drei Dinge achten:
   - Kartenoptik mit weichen Ecken,
   - leichter Raster-Look in den Flächen,
   - deutlich hervorgehobener Primärbutton.
3. Browserbreite auf ca. 1200px und 900px ändern.
4. Prüfen, ob die Bereiche sauber in die nächste Layoutstufe wechseln.

## Letzten Ordnernamen wiederfinden
1. Einmal auf **Ordner wählen** klicken und einen Projektordner bestätigen.
2. Seite neu laden.
3. Im Bereich **Projektordner-Status** bei **Ordner** den Namen mit Hinweis **(zuletzt gewählt)** prüfen.
4. So sieht man schneller, welcher Ordner zuletzt aktiv war.

## Struktur aus JSON prüfen
1. Datei `data/project-structure.json` öffnen.
2. `requiredDirectories` und `requiredFiles` anpassen.
3. Im UI auf **Projektstruktur anlegen** klicken.
4. Danach **Selbsttest starten**.

## Endprüfung (nur relevant)
- Syntax prüfen: `node --check js/app.js`
- JSON prüfen: `python3 -m json.tool data/project-structure.json > /dev/null`
- UI-Test manuell: Startseite öffnen und Buttons testen.
