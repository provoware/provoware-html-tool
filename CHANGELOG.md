# CHANGELOG

- Was: `start.sh` nutzt jetzt JSON-basierte Tool-Texte und prüft automatisch das Zeilenlimit von maximal 1200 Zeilen pro Datei.
- Warum: Texte sollen später einfach ersetzbar sein und Dateigrößen müssen dauerhaft wartbar bleiben.
- Wirkung: `--check`, `--test` und `--safe` geben klare, barrierearme Hinweise bei Limit-Verstößen und zeigen direkte nächste Schritte.
