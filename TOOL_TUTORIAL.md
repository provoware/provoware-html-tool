# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Schreibrechte beim Start bewusst steuern
1. Beim Start fragt ein Dialog, ob die App Schreibrechte anfragen soll.
2. Deine Auswahl wird gemerkt (lokal im Browser-Speicher).
3. Bei „Ja" kann die App später Dateien direkt schreiben.
4. Bei „Nein" bleibt die App im Lesemodus, bis du die Einstellung änderst.

## Kurzer Rechte-Check
1. `node --test tests/services/startup-check.test.js` ausführen.
2. Prüfen, ob der Schreibwunsch korrekt weitergegeben wird.
3. Ziel: Startdialog und Rechteprüfung arbeiten gleich.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
