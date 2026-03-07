# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Desktop-Hinweis besser lesen
1. Wenn der Desktop-Adapter nicht aktiv ist, zeigt die Meldung jetzt klar den nächsten Schritt.
2. Achte auf `nextStep` im Ergebnis (kurzer Handlungs-Hinweis).
3. Ziel: Weniger Rätsel bei Startproblemen im Team.
4. Konkreter nächster Schritt: Browser-Version öffnen und **Ordner wählen** nutzen.

## Kurzer Modul-Check
1. `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob die Ausgabe ohne Fehler endet.
3. Ziel: Registry-Logik bleibt stabil.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
