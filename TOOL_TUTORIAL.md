# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Selbsttest besser lesen (Ordner vs. Schreiben)
1. `Selbsttest starten` ausführen.
2. Prüfen: Ordnerstatus zeigt jetzt nur, ob der Ordner lesbar/verfügbar ist.
3. Optional: Schreibtest separat aktivieren (`runWriteTest`), wenn du Schreiben prüfen willst.
4. Ziel: Du siehst klarer, ob nur Schreiben fehlt oder ob der Ordner selbst fehlt.
5. Hinweis: Es werden keine `.probe`-Dateien mehr für die Ordnerprüfung erzeugt.

## Kurzer Modul-Check
1. `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob die Ausgabe ohne Fehler endet.
3. Ziel: Registry-Logik bleibt stabil.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
