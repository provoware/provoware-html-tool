# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `laienstart.html` im Browser öffnen (Team-Standard).
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Lesen, Schreiben, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### GitHub-Start mit nur 3 Workflows
Aktiv sind jetzt bewusst nur diese drei Dateien:
1. **CI (`.github/workflows/ci.yml`)**: startet Tests bei Push/PR.
2. **Lint (`.github/workflows/lint.yml`)**: prüft JS-Syntax früh.
3. **CodeQL (`.github/workflows/codeql.yml`)**: findet Sicherheitsrisiken.

Bewusst noch nicht aktiv:
- `dependabot.yml` (Update-PRs)
- `release.yml` (automatische Releases)

Kurzregel: erst Basis stabil laufen lassen, dann ausbauen.

## Kurzer Doku-Check
1. Prüfen, ob die Reihenfolge für Einsteiger verständlich ist.
2. Prüfen, ob Fachbegriffe kurz erklärt sind.
3. Ziel: schneller Start ohne CI-Vorwissen.

## Kurzer Workflow-Check
1. YAML-Dateien in `.github/workflows/` auf Syntax prüfen.
2. Lokal `node --test` ausführen.
3. Lokal JS-Syntaxcheck ausführen.
4. Ziel: Basis-Workflows sind sofort nutzbar.
