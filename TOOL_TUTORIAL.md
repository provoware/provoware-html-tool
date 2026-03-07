# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).


## Kleine Erweiterung dieser Iteration (neu)
### Laienstart mit Auto-Korrektur nutzen
1. `laienstart.html` im Browser öffnen.
2. Auf Status, Fortschritt und Fehlercode achten.
3. Bei Code `START_MISSING_RESOURCE` auf **Automatisch korrigieren** klicken.
4. Dialog bestätigen, dann läuft der Wiederholstart automatisch weiter.
5. Ziel: Erst bei fehlerfreier Prüfung startet die GUI.

## Kurzer Modul-Check
1. `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob die Ausgabe ohne Fehler endet.
3. Ziel: Registry-Logik bleibt stabil.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
