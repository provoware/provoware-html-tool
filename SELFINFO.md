# SELFINFO

Stand: 2026-02-28
Iteration: 22

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

## Next Step

- Option A als naechstes: Boot-View stabilisieren (Phasen, Ampel, Details, Weiter-Gate).
