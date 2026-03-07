# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).


## Kleine Erweiterung dieser Iteration (neu)
### Platzhalter klar erkennen (kein Live-Feature)
Wenn du den Design-Status prüfst, gilt:
- `assets/css/base.css` und `assets/js/core.js` sind aktuell Vorlagen-Dateien.
- Ohne Einbindung in `index.html` sind sie **nicht aktiv**.
- Der aktive Lauf nutzt weiter `css/app.css` und `js/app.js`.

Kurzregel: Datei vorhanden heißt nicht automatisch integriert.

## Kleine Erweiterung dieser Iteration (neu)
### Minimal-Check als Ein-Befehl-Start
Wenn du vor einer Änderung nur das Nötigste prüfen willst:
1. `bash scripts/minimal-check.sh`

Der Befehl macht zwei direkte Prüfungen:
- JS-Syntax in `js/` und `tests/`
- den Service-Schnelltest `tests/services/import-export-consistency.test.js`

Kurzregel: erst Minimal-Check, dann nur bei Bedarf breiter testen.

## Zusatz-Check (weiter nutzbar)
### Import-/Export-Schnellcheck für direkte Service-Kette
Wenn `js/app.js` Services importiert, prüfe zuerst klein und gezielt:
1. `node --test tests/services/import-export-consistency.test.js`
2. Nur bei Bedarf danach weitere Service-Tests starten.

Was der neue Test absichert:
- erwartete Exporte aus `module-registry`, `startup-check`, `project-selftest` sind vorhanden
- `filesystemAdapter` und `desktopFilesystemAdapter` bieten dieselben Kernmethoden

Kurzregel: erst diesen Schnellcheck nutzen, dann breiter testen.

## Kurzer Doku-Check
1. Prüfen, ob die Reihenfolge für Einsteiger verständlich ist.
2. Prüfen, ob Fachbegriffe kurz erklärt sind.
3. Ziel: schneller Start ohne CI-Vorwissen.

## Kurzer Workflow-Check
1. YAML-Dateien in `.github/workflows/` auf Syntax prüfen.
2. Lokal `node --test` ausführen.
3. Lokal JS-Syntaxcheck ausführen.
4. Ziel: Basis-Workflows sind sofort nutzbar.
