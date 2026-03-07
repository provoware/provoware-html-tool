# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Cleanup nach Schreibtest bewusst nutzen
1. `Selbsttest starten` ausführen (optional mit Schreibtest).
2. Wenn du danach aufräumen willst, `cleanupAfterSuccess` als **Funktion** übergeben.
3. Wenn keine Funktion übergeben wird, gibt es bewusst keinen Cleanup-Status.
4. Ziel: Kein falsches „erledigt“, wenn es gar kein echtes Cleanup gab.
5. Hinweis: Die Ordnerprüfung bleibt getrennt vom Schreibtest.

## Kurzer Modul-Check
1. `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob die Ausgabe ohne Fehler endet.
3. Ziel: Registry-Logik bleibt stabil.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
