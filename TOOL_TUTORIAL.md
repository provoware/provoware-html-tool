# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Startcheck ohne HTML-Änderung erweitern
1. Datei `data/laienstart-required-files.json` öffnen.
2. In `requiredFiles` neue Pfade ergänzen (z. B. `./data/themes.json`).
3. `laienstart.html` neu laden.
4. Ziel: Die neue Datei wird direkt im Startcheck geprüft.
5. Hinweis: Wenn die JSON-Datei fehlt, nutzt der Start eine sichere Fallback-Liste.

## Kurzer Modul-Check
1. `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob die Ausgabe ohne Fehler endet.
3. Ziel: Registry-Logik bleibt stabil.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
