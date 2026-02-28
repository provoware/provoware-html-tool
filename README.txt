# Provoware HTML Tool

Dieses Tool hat einen stabilen Kernel (Kern) und erweitert Funktionen über
Module und Plugins.

## Zielbild
- Kernel bleibt klein und wird nur bei klar begründetem Bedarf geändert.
- Registry (Verzeichnis aller Kernel/Module/Plugins) ist validiert.
- Versionierung (Versionen mit Historie) ist robust und rücksetzbar.
- Start-Routine prüft alles automatisch und gibt klare Nutzerhinweise.

## Struktur
- `system-core/` stabiler Kernel
- `system-module/` feste Module
- `config/` zentrale Einstellungen und Manifeste
- `data/` variable Daten und Versionen
- `tools/` Start- und Diagnose-Werkzeuge
- `templates/` UI-Vorlagen
- `test/` automatische Tests
- `dummys/` Test- und Reparatur-Daten

## Schnellstart
```bash
bash start.sh
```

## Was macht die Start-Routine automatisch?
1. Prüft Pflichtdateien und Manifeste.
2. Installiert fehlende Abhängigkeiten.
3. Formatiert Code automatisch.
4. Führt Unit-Tests aus.
5. Prüft, ob die Registry gültig ist.
6. Führt Systemtest aus.
7. Gibt den nächsten Schritt aus.

## Registry und Versionierung
Registry-Dateien:
- `data/registry.json` = aktueller Zustand
- `data/registry.current.json` = Zeiger auf aktive Version
- `data/registry_versions/registry_vXXXX.json` = ältere Versionen

Manifest-Dateien:
- `config/manifests/global.manifest.json`
- `config/manifests/kernel.manifest.json`
- `config/manifests/registry.manifest.json`

## Entwicklerdoku
- Ausführliche Struktur und Entwicklerablauf: `docs/ENTWICKLERDOKU.md`

## Nützliche Befehle
```bash
bash start.sh
npm test
npm run format
node tools/help_cli.js test
node tools/help_cli.js logs
node tools/help_cli.js backups store
node tools/help_cli.js repair data/store.json data/store.backup.json
```

## Laienvorschläge
1. Immer mit `bash start.sh` beginnen.
2. Bei Fehlern zuerst `npm test` ausführen.
3. Dann `node tools/help_cli.js logs` nutzen.
4. Bei Datenfehlern Backup nutzen und danach erneut versuchen.
