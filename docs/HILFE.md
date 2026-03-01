## Neu: Schnellspeicher (kurz und klar)

- Was ist neu? Im Dashboard gibt es jetzt ein Panel **Schnellspeicher**.
- So nutzen: Titel + Inhalt ausfuellen, dann **Notiz speichern** klicken.
- Rueckweg: Mit **Eingabe leeren** alles zuruecksetzen und neu starten.

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
- **Barrierefreiheit:** Fokus ist sichtbar, Buttons sind groß (mindestens 44px) und es gibt 5 Themes: Hell, Dunkel, Kontrast+, Rötlich und Camouflage.
- **Escape als Rueckweg (neu):** Mit Escape schliessen Sie die offene Debug-Ansicht schnell per Tastatur.
- **Modulflaeche:** Der Hauptbereich startet leer. Aktivierte Module erscheinen als gleichgroße Raster-Karten in Auswahl-Reihenfolge und haben Knöpfe für Maximieren, Minimieren und Ausblenden.
- **Kompakt-Modus:** Beispieltexte wurden entfernt. Leere Bereiche bleiben sichtbar frei und sind für echte Inhalte reserviert.
- **Texte zentral:** Kurztexte liegen versioniert in `config/messages_de.json` unter `dashboardCompact`.

- **Geführte Hilfe (neu):** Im Dashboard gibt es jetzt eine eigene Schrittliste mit klarer Reihenfolge für Einsteiger. Neu dabei: Enter startet Aktionen, Escape ist der schnelle Rueckweg.
- **Feste Hilfe-Knöpfe (neu):** Rechts im Hilfebereich stehen immer dieselben 3 Aktionen bereit: „Erneut versuchen“, „Reparatur starten“, „Protokoll öffnen“.
- **Nächster Schritt / Laien-Tipp (neu):** In der Topbar können Sie sich den nächsten sinnvollen Schritt oder einen einfachen Bedienhinweis direkt anzeigen lassen.
- **Boot-Status (neu):** Vier Phasen zeigen den Start mit Ampel und Text (Gruen/Gelb/Rot). Rueckweg: Bei Rot zuerst "Erneut versuchen", dann "Reparatur starten".

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

## Start-Routine (neu verbessert)

- **Was macht das?** `bash start.sh` erstellt fehlende Datenordner automatisch und startet danach Pruefung, Formatierung, Tests und Systemtest.
- **Was passiert mit den Daten?** Es werden nur benoetigte Arbeitsordner erstellt (`data/`, `data/logs/`) und Logeintraege geschrieben.
- **Wie mache ich rueckgaengig?** Ueberfluessige Logdateien koennen geloescht werden; der Code bleibt unveraendert.
- **Abhaengigkeiten automatisch (neu):** Wenn `package-lock.json` geaendert ist, installiert die Start-Routine Pakete automatisch neu.
- **Naechster Schritt bei Paketfehlern:** Erst erneut versuchen, dann Protokoll oeffnen (`data/logs/start_routine.log`), danach Reparatur starten.
- **Naechster Schritt bei Fehlern:** Erst `START_DEBUG=1 bash start.sh` ausfuehren, danach `data/logs/start_routine.log` oeffnen und die erste Fehlermeldung direkt pruefen.

## Genres/Moods/Stile-Archiv (neu)

- Komma-Eingaben werden einzeln gespeichert, z. B. `Techno, Chill, Hoerspiel`.
- Favorit markieren: Sternchen nutzen, z. B. `*Techno*`.
- Bei Fehlern: erst erneut versuchen, dann Protokoll oeffnen, danach Reparatur starten.

## Sehschwache: schneller 3-Punkte-Check (neu)

1. Theme direkt auf **Kontrast+** stellen.
2. Wenn Farben zu hart sind: **Rötlich** oder **Camouflage** testen.
3. Immer mit Tastatur pruefen: Tab, Enter, Escape.

Naechster Schritt bei Unsicherheit: **Protokoll oeffnen**, dann **Erneut versuchen**.

## Kontrast-Auto-Check je Theme (neu)

- Die Start-Routine prueft jetzt den Kontrast (Farbabstand) automatisch fuer alle 5 Themes.
- Geprueft werden Haupttext und Topbar. Zielwert ist mindestens **4.5** (WCAG AA).
- Bei Fehlern bekommen Sie klare naechste Schritte: **Erneut versuchen**, **Reparatur starten**, **Protokoll oeffnen**.

## Aufgaben-Filter (neu)

- Was macht das? Der Filter zeigt Aufgaben fuer Kalendertag, Heute, Offen oder Archiv.
- Was passiert mit Daten? Es wird nur angezeigt, nichts wird dabei geloescht.
- Rueckweg: Mit Escape springt der Filter zurueck auf Kalendertag.

## Storage-Recovery (neu)

Wenn eine JSON-Datei kaputt ist, kann die letzte gueltige Version wiederhergestellt werden.
Naechster Schritt: Erst erneut versuchen, dann Reparatur starten, danach bei Bedarf Protokoll oeffnen.

## Wiki-Modul (neu)

- Was macht das? Speichert kurze Wissensnotizen pro Kategorie.
- Was passiert mit Daten? Eintraege landen in `data/wiki_notes.json`.
- Rueckweg: Eintrag aendern und erneut auf "Wiki speichern" klicken.
