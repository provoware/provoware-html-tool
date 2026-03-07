# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### AGENTS-Regeln in 60 Sekunden prüfen
1. `AGENTS.md` öffnen.
2. Prüfen, ob die 7 Pflichtpunkte vor dem ersten Patch klar sichtbar sind.
3. Prüfen, ob Endvalidierung nur für direkt betroffene Bereiche beschrieben ist.
4. Prüfen, ob die Patch-Checkliste vollständig ist.
5. Ziel: Jede neue Iteration bleibt klein, verständlich und konsistent.

## Kurzer Modul-Check
1. `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob die Ausgabe ohne Fehler endet.
3. Ziel: Registry-Logik bleibt stabil.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
