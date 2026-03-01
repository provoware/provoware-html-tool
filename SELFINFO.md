# SELFINFO

Stand: 2026-02-28
Iteration: 29

## Gemacht

- Prompt aus der Anforderung analysiert und als optimierte, ausführbare Version dokumentiert.
- Modernes Dashboard als neue Vorlage ergänzt (`templates/dashboard.*`).
- Projektordner-Start mit Berechtigungsabfrage, IndexedDB-Handle und Auto-Reconnect ergänzt.
- Projektstruktur-Prüfung/Erstellung im Dashboard-Startfluss ergänzt.
- Zonen (Favoriten, Schnellzugriff, Module) als vertikal verschiebbare Bereiche ergänzt.
- Dashboard-Modelllogik mit Input-/Output-Validierung und automatischen Tests ergänzt.
- Start-Routine-Pflichtpfade und Doku/TODO auf Dashboard-Stand erweitert.
- Neue Entwickler-Infodatei mit Ordner-/Dateistruktur, Standards und Befehlen ergänzt.
- README neu strukturiert: klare Kapitel, Laienbegriffe, A11y-Standard,
  robuste Start- und Debug-Anleitung.

- Start-Routine-Fehlerausgabe um Debug-Modus und Log-Datei erweitert.
- Plugin-Loader minimal umgesetzt (Manifest, isoliertes Laden, Health-Check).
- Registry-Health-Check mit optionalen Debug-Details erweitert.
- Storage-Service erweitert: JSON-Schema-Validierung vor Write und Backup-Hook fuer Folgeschritte.

- Dashboard-Haupt-Kern-Modul als neues Core-Modul ergänzt.
- Start-Routine startet das Dashboard jetzt automatisch am Ende (mit Headless-Fallback).

- Neues Mockup `templates/dashboard_mockup.html` mit aktueller Start- und Dashboard-Logik ergänzt.

- README weiter verbessert: offene Punkte oben, klare Laienanleitung mit Befehlen und stärker sichtbare Struktur.

- Dashboard-Layout in `templates/dashboard.html` visuell an die Referenz angenaehert (Topbar, 3-Spalten, Modul-Kacheln, Quick-Links).
- A11y-Details im Layout ausgebaut: sichtbarer Fokus, Kontrast+ konsistent, 44px-Bedienelemente und klare Tastaturhinweise.

- Hauptbereich als leere, zentrierte Modul-Rasterflaeche umgebaut: Aktivierung in Auswahl-Reihenfolge, inklusive Maximieren/Minimieren/Ausblenden pro Modul.

- Dashboard kompakt gemacht: weniger Abstände, bessere Größenverhältnisse und klarere Anordnung.
- Pseudotexte in Seitenbereichen entfernt; ungenutzte Bereiche bleiben leer und flexibel.
- Dashboard-Kurztexte zentral in `config/messages_de.json` ausgelagert und dynamisch geladen.

- Gefuehrte Hilfe als eigenes Dashboard-Panel ergaenzt (klare Einsteiger-Schritte).
- Hilfe-Aktionen vereinheitlicht: Erneut versuchen, Reparatur starten, Protokoll oeffnen.
- Topbar um Naechster Schritt und Laien-Tipp erweitert.

- AGENTS.md mit neuem Pflichtpunkt erweitert: pro Iteration eine Mini-Optimierung für Hilfe/Tooltip/A11y/Kontrast plus Standards für Buttons, Abstände, Themes und kleine Bildschirme.

- Start-Routine um Release-Readiness-Check (A11y-Basics + 3 Themes + Hilfe-Aktionen) erweitert.
- Neue automatische Tests fuer den Release-Readiness-Check ergänzt.

- README um aktuelle Tool-Module-Liste erweitert und geplanter Modul-Backlog klar dokumentiert.
- TODO um konkrete Implementierungsaufgaben fuer angeforderte Untermodule erweitert.

- Start-Routine robuster gemacht: Datenordner-Autoanlage, Format-Check nach Formatierung und striktere Befehls-Output-Validierung.

- Neues Kernmodul fuer Genres/Moods/Stile-Archiv ergänzt: CSV-Import, Duplikatpruefung, Profil-Kategorien, Favoriten-Sternchen und Logging.
- Neue automatisierte Tests fuer Archiv-Import, Linux-Slug, Favoriten und Log-Ausgabe ergänzt.
- Hilfe um kurzen Favoriten-Hinweis (`*Eintrag*`) fuer das neue Archiv erweitert.

- Dashboard-Tastaturpfad verbessert: Escape schliesst die Debug-Ansicht als klaren Rueckweg.
- Release-Readiness-Check prueft jetzt auch Tastatur-Hinweis und Escape-Handler automatisch.
- Hilfe-Doku mit klarem Debug-Fehlerschritt fuer Startprobleme aktualisiert.
- Gefuehrte Dashboard-Hilfe um klaren Enter/Escape-Hinweis erweitert (Aktion + Rueckweg).
- Release-Readiness prueft den Enter-Hinweis jetzt automatisch mit.

- README zeigt jetzt oben den Fortschritt als Prozent und die Mengen erledigt/offen aus todo.txt.
- Dashboard-Design weiter optimiert: Skip-Link fuer Tastatur, einheitliche Abstands-Tokens und mobile Vollbreite fuer Buttons.

- Start-Routine erkennt jetzt veraltete Abhaengigkeiten ueber Fingerprint (package-lock/package) und installiert bei Bedarf automatisch neu.
- Abhaengigkeits-Status wird in `data/dependency_state.json` gespeichert und bei jedem Start validiert.
- Hilfe um klare Laien-Schritte bei Paketfehlern erweitert (erneut versuchen, Protokoll oeffnen, Reparatur starten).

- Doku-Regel ergaenzt: README.txt wird pro Iteration verpflichtend mit aktualisiert (Status + naechster Schritt).

- Theme-Umschalter mit Tooltip in einfacher Sprache erweitert (Aktion + Rueckweg) und per aria-describedby fuer Screenreader verknuepft.

- Release-Readiness-Check erweitert: validiert jetzt auch 44px-Klickziele, sichtbaren Fokus und zentrale Hilfe-Triplets (`what/data/undo`) in `messages_de.json`.
- Dashboard-Mockup beim Theme-Feld mit Tooltip + `aria-describedby` auf gleiche Laienfuehrung wie Haupt-Dashboard angehoben.

- Start-Routine um automatischen Platzhalter-Scan erweitert (TODO/FIXME/PLACEHOLDER/DUMMY) mit klarer Datei-/Zeilenmeldung und naechstem Schritt.

## Next Step

- Option A als naechstes: Boot-View stabilisieren (Phasen, Ampel, Details, Weiter-Gate).
