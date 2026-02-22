# INFODATEI – Orientierung für Laiennutzer

Diese Datei erklärt die wichtigsten Informationsdateien in **einfacher Sprache**.

## Welche Dateien sind wichtig?

| Datei | Wofür ist sie da? | Wann ändern? |
|---|---|---|
| `README.md` | Hauptanleitung (Start, Befehle, Hilfe) | Bei neuen Befehlen oder geänderten Abläufen |
| `CHANGELOG.md` | Kurzprotokoll „Was, Warum, Wirkung“ | Nach jeder Iteration |
| `todo.txt` | Aufgaben- und Statusliste (DONE/NEXT) | In jeder Iteration |
| `data/version_registry.json` | Versions-Register aller geänderten Dateien | Immer bei jeder Änderung |

## Standardablauf (einfach)
1. `bash start.sh --check` (prüfen)
2. `bash start.sh --repair` (automatisch beheben)
3. `bash start.sh --full-gates` (alle Pflichtprüfungen)

## Wenn ein Fehler kommt
1. **Erneut versuchen**: denselben Befehl nochmals starten.
2. **Reparatur**: `bash start.sh --repair`
3. **Protokoll lesen**: `cat logs/start.log`
4. **Status lesen**: `cat logs/status_summary.txt`

## Qualitätsregel
Nach jeder fertigen Iteration müssen diese Dateien aktuell sein:
- `README.md`
- `CHANGELOG.md`
- `todo.txt`
- `data/version_registry.json`
