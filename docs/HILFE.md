# Hilfe

## Hilfe-Panel

- **Was macht das?** Das Panel zeigt Systemtest und Log-Hinweise.
- **Was passiert mit den Daten?** Beim Systemtest werden nur Logs in `logs/` geschrieben.
- **Wie mache ich rückgängig?** Mit `node tools/help_cli.js backups` und `repair` können alte Backups wiederhergestellt werden.

## Dashboard

- **Was macht das?** Das Dashboard zeigt jetzt ein klares 3-Spalten-Layout mit Navigation, Kalender, Modulen und Schnellbereichen.
- **Autostart:** Am Ende von `bash start.sh` wird das Dashboard automatisch gestartet (wenn Grafikmodus verfuegbar ist).
- **Was passiert mit den Daten?** Der gewählte Projektordner wird als Handle in IndexedDB gespeichert und beim Neustart erneut verbunden.
- **Wie mache ich rückgängig?** Sie können die Reihenfolge sofort per Pfeil-Buttons oder Drag&Drop wieder ändern und das Theme jederzeit zurück auf Hell setzen.
- **Fachwort kurz erklärt:** _Auto-Reconnect_ bedeutet automatische Wiederverbindung beim nächsten Start.
- **Barrierefreiheit:** Fokus ist sichtbar, Buttons sind groß (mindestens 44px) und es gibt Kontrast+ als Theme.
- **Modulflaeche:** Der Hauptbereich startet leer. Aktivierte Module erscheinen als gleichgroße Raster-Karten in Auswahl-Reihenfolge und haben Knöpfe für Maximieren, Minimieren und Ausblenden.
- **Kompakt-Modus:** Beispieltexte wurden entfernt. Leere Bereiche bleiben sichtbar frei und sind für echte Inhalte reserviert.
- **Texte zentral:** Kurztexte liegen versioniert in `config/messages_de.json` unter `dashboardCompact`.

## Plugin-Loader

- **Was macht das?** Der Plugin-Loader prueft vor dem Systemtest, ob aktive Plugins vorhanden und startbar sind.
- **Was passiert mit den Daten?** Es werden nur Manifest- und Moduldateien gelesen, keine Daten werden geschrieben.
- **Wie mache ich rueckgaengig?** Setzen Sie das Plugin im Manifest auf `"enabled": false` und starten Sie `bash start.sh` erneut.
- **Fachwort kurz erklaert:** _Health-Check_ bedeutet kurzer Funktions-Test vor dem echten Start.

## Dashboard-Mockup

- **Was macht das?** `templates/dashboard_mockup.html` zeigt die aktuelle Logik (9 Start-Schritte, Theme-Auswahl, Zonen) als schnelle Vorschau.
- **Was passiert mit den Daten?** Es ist eine reine Mockup-Ansicht, es werden keine Projektdateien geschrieben.
- **Wie mache ich rückgängig?** Einfach Fenster schließen, dann bleibt Ihr Projekt unverändert.
- **Fachwort kurz erklärt:** _Mockup_ bedeutet eine frühe Vorschau der Oberfläche vor weiterem Ausbau.
