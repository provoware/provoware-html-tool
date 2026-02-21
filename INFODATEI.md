# INFODATEI – Verzeichnisstruktur und Dateiliste

Zweck: Diese Datei zeigt in **einfacher Sprache** die aktuelle Struktur, damit Wartung (Maintenance = einfache Pflege) schneller und sicherer klappt.

## 1) Verzeichnisstruktur (Top-Level)

```text
.
├── AGENTS.md
├── CHANGELOG.md
├── INFODATEI.md
├── README.md
├── start.sh
├── todo.txt
└── data/
    └── version_registry.json
```

## 2) Dateiliste mit Rolle

| Datei | Rolle | Hinweise für Wartung |
|---|---|---|
| `start.sh` | Startroutine (Check, Repair, Format, Test) | Enthält Nutzerfeedback, Input-Prüfung, Fehlerpfade und Logging. |
| `README.md` | Bedienhilfe in einfacher Sprache | Bei neuen Modus-Optionen sofort aktualisieren. |
| `todo.txt` | Iterationsprotokoll | Jede Iteration mit Fundstelle, Scope, 3 Punkten und Ergebnis dokumentieren. |
| `CHANGELOG.md` | Kurzänderung (Was, Warum, Wirkung) | Pro Iteration exakt 3 Zeilen pflegen. |
| `data/version_registry.json` | Versionsregister | Jede geänderte Datei und `global_version` aktualisieren. |
| `AGENTS.md` | Verbindliche Arbeitsregeln | Vor jedem Patch Scope und Grenzen prüfen. |
| `INFODATEI.md` | Struktur- und Navigationshilfe | Diese Datei bei neuen Dateien/Ordnern sofort nachziehen. |

## 3) Pflege-Regeln für klare Standards

1. Immer zuerst `./start.sh --check` ausführen.
2. Vor Abschluss immer `./start.sh --format` und `./start.sh --test` ausführen.
3. Nach jeder Änderung immer diese drei Dateien aktualisieren: `todo.txt`, `CHANGELOG.md`, `data/version_registry.json`.

## 4) Hilfe bei Fehlern (barrierearm)

Wenn etwas fehlschlägt, nutze diese Reihenfolge:
1. **Erneut versuchen**: Befehl noch einmal starten.
2. **Reparatur starten**: `./start.sh --repair`
3. **Protokoll öffnen**: `cat logs/start.log`

So bleiben Fehlertexte klar und Aktionen direkt umsetzbar.
