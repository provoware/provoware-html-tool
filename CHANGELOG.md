# CHANGELOG

- Was: `start.sh` kann Textmeldungen jetzt optional aus `config/messages.json` laden und fällt bei Fehlern robust auf interne Standardtexte zurück.
- Warum: Offene Punkte zur Trennung von Logik und variablen Texten brauchten eine sichere Vorbereitung ohne Ausfall bei ungültiger Konfiguration.
- Wirkung: Hilfe- und Statusmeldungen bleiben barrierearm, stabil und zentral vorbereitbar für die nächste Iteration mit externer Textdatei.
