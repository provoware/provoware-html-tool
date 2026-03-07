# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Hilfreiche GitHub Actions in klarer Reihenfolge
1. **CI-Testlauf (`ci.yml`)**: startet bei Push/PR automatisch die wichtigen Tests.
2. **Lint-Check (`lint.yml`)**: prüft Stil und typische Fehler früh.
3. **CodeQL (`codeql.yml`)**: sucht Sicherheitsprobleme im Code.
4. **Dependabot (`dependabot.yml`)**: erstellt Update-PRs für Abhängigkeiten.
5. **Release-Workflow (`release.yml`)**: baut bei Tag ein Release-Artefakt.

Kurzregel: erst 1–3 stabil betreiben, dann 4–5 ergänzen.

## Kurzer Doku-Check
1. Prüfen, ob die Action-Reihenfolge für Einsteiger verständlich ist.
2. Prüfen, ob jeder Begriff kurz erklärt ist.
3. Ziel: schneller Start ohne CI-Vorwissen.

## Kurzer Startdatei-Check
1. `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob alle `*_start.html`-Dateien korrekt auflösen.
3. Ziel: Einzelstarts bleiben direkt nutzbar.
