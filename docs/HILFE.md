# Hilfe

## Hilfe-Panel

- **Was macht das?** Das Panel zeigt Systemtest und Log-Hinweise.
- **Was passiert mit den Daten?** Beim Systemtest werden nur Logs in `logs/` geschrieben.
- **Wie mache ich rückgängig?** Mit `node tools/help_cli.js backups` und `repair` können alte Backups wiederhergestellt werden.

## Dashboard

- **Was macht das?** Das Dashboard zeigt feste Zonen (Favoriten, Schnellzugriff, Module), die Sie vertikal verschieben können.
- **Was passiert mit den Daten?** Der gewählte Projektordner wird als Handle in IndexedDB gespeichert und beim Neustart erneut verbunden.
- **Wie mache ich rückgängig?** Sie können die Reihenfolge sofort per Pfeil-Buttons oder Drag&Drop wieder ändern.
- **Fachwort kurz erklärt:** _Auto-Reconnect_ bedeutet automatische Wiederverbindung beim nächsten Start.

## Plugin-Loader

- **Was macht das?** Der Plugin-Loader prueft vor dem Systemtest, ob aktive Plugins vorhanden und startbar sind.
- **Was passiert mit den Daten?** Es werden nur Manifest- und Moduldateien gelesen, keine Daten werden geschrieben.
- **Wie mache ich rueckgaengig?** Setzen Sie das Plugin im Manifest auf `"enabled": false` und starten Sie `bash start.sh` erneut.
- **Fachwort kurz erklaert:** _Health-Check_ bedeutet kurzer Funktions-Test vor dem echten Start.
