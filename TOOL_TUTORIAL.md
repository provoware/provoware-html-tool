# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere kleine Iterationen.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Rechte, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Letzten Ordnernamen wiederfinden
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
