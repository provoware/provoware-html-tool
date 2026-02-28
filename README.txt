# Provoware HTML Tool

Dieses Projekt ist modular aufgebaut und nutzt einfache, klare Abläufe.

## Was ist schon da?
- Atomarer JSON-Store (sicheres Speichern mit tmp + rename).
- Self-Repair mit Backup-Auswahl (CLI).
- Hilfe-Panel mit A11y-Hinweisen (Barrierefreiheit).
- Start-Routine mit Auto-Prüfung, Auto-Install, Auto-Format und Auto-Tests.

## Schnellstart
```bash
bash start.sh
```

## Was macht die Start-Routine automatisch?
1. Prüft wichtige Projektdateien.
2. Installiert fehlende Abhängigkeiten.
3. Formatiert Code automatisch.
4. Führt Unit-Tests aus.
5. Führt Systemtest aus und schreibt Log-Datei.
6. Gibt klaren nächsten Schritt aus.

## Hilfe-Befehle
```bash
node tools/help_cli.js test
node tools/help_cli.js logs
node tools/help_cli.js backups store
node tools/help_cli.js repair data/store.json data/store.backup.json
```

## Nächste logische Schritte (Analyse)
1. **Option C priorisieren:** Storage-Service mit Schema-Validierung ergänzen.
2. **A11y ausbauen:** Theme-Umschalter in HTML-UI testen (Tab/Enter/Escape).
3. **Wartbarkeit verbessern:** Gemeinsame Prüf-Helpers zentralisieren.
4. **Debug-Modus vereinheitlichen:** Fehlertext + Lösungsvorschlag überall gleich.

## Laienvorschläge
1. Starte immer zuerst `bash start.sh`.
2. Bei Fehlern zuerst `node tools/help_cli.js test` ausführen.
3. Danach mit `node tools/help_cli.js logs` die Ursache lesen.
4. Wenn Daten kaputt sind: `repair` mit Backup-Datei nutzen.
