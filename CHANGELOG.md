# CHANGELOG

- Was: `start.sh` repariert fehlende Runtime-Abhängigkeiten (`python3`, `rg`, `curl`) jetzt direkt im Voraussetzungen-Check automatisch und bestätigt den Erfolg klar.
- Warum: Die Startroutine sollte erwartbare Abhängigkeitsfehler ohne manuelle Zwischenschritte beheben und dabei robusten Nutzertext ausgeben.
- Wirkung: Nutzer erhalten einen stabileren Vollautomatik-Start mit verständlichen nächsten Schritten und weniger Abbrüchen bei fehlenden Tools.
