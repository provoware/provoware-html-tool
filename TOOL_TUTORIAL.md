# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere kleine Iterationen.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Rechte, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Optionaler Schreibtest
1. Auf **Schreibtest ausführen** klicken.
2. Der Test schreibt in `logs/write-test.txt`.
3. Danach liest der Test die Datei wieder.
4. Ergebnis steht im Prüfbereich und im Logpanel.

## Struktur aus JSON prüfen
1. Datei `data/project-structure.json` öffnen.
2. `requiredDirectories` und `requiredFiles` anpassen.
3. Im UI auf **Projektstruktur anlegen** klicken.
4. Danach **Selbsttest starten**.

## Endprüfung (nur relevant)
- Syntax prüfen: `node --check js/app.js`
- JSON prüfen: `python3 -m json.tool data/project-structure.json > /dev/null`
- UI-Test manuell: Startseite öffnen und Buttons testen.
