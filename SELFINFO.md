## Iteration 62 (2026-03-02)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Songtext-Editor auf Lyrics-Bereich + getrennte Quick-Store-Dateien je Bereich).
- Ergebnis: Lyrics-Bereich hat jetzt einen integrierten Songtext-Editor mit Intro/Refrain-Vorlagen, Enter/Escape-Hilfe und klaren Rueckweg-Knoepfen.
- Ergebnis: Schnellspeicher speichert nun physisch getrennt in `data/quick_store_inbox.json`, `data/quick_store_lyrics.json` und `data/quick_store_research.json` (inkl. Legacy-Migration).
- Mini-Optimierung: Hilfe-Texte wurden fuer Songideen in einfacher Sprache erweitert.
- Naechster Schritt: Songtext-Editor um Bridge/Sonstiges-Vorlagen und Vorschau erweitern.

## Iteration 61 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Mehrfach-Schnellspeicher + Bereichsauswahl mit eigener Datei).
- Ergebnis: Schnellspeicher trennt jetzt drei Bereiche (Allgemein, Songideen, Recherche) und speichert/liest alles zentral aus `data/quick_store_entries.json`.
- Mini-Optimierung: Bereichswechsel ist direkt im Panel erklaert und per Tastatur sofort nutzbar.
- Naechster Schritt: Songtext-Editor mit Intro/Refrain-Vorlage und Tastaturhilfe starten.

## Iteration 60 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Mini-Punkte-Regel im Start-Check + Schnellspeicher-Modul).
- Ergebnis: Start-Routine validiert jetzt exakt zwei offene Mini-Punkte; Dashboard hat ein neues Schnellspeicher-Panel mit Input-Validierung und Datei-Ausgabe.
- Mini-Optimierung: Schnellspeicher-Panel erklaert Aktion, Datenwirkung und Rueckweg in einfacher Sprache.
- Naechster Schritt: Mehrfach-Schnellspeicherbereiche mit separaten Dateien erweitern.

## Iteration 59 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Wiki-Modul + Wiki-Grundgeruest mit Validierung).
- Ergebnis: Neues Wiki-Modell, Wiki-UI und persistente Datei `data/wiki_notes.json` integriert und getestet.
- Mini-Optimierung: Wiki-Hilfetext mit klarem Rueckweg direkt im Dialogbereich.
- Naechster Schritt: AGENTS-Regel "genau zwei offene Punkte" als automatischen Start-Routine-Check ergaenzen.

## Iteration 58 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Kanban-Persistenz + Daten-Inventur-Check).
- Ergebnis: Zentraler Datei-Schreiber fuer JSON aktiv, Start-Routine-Inventurcheck laeuft automatisiert.
- Mini-Optimierung: AGENTS.md um feste Zwei-Punkte-Regel erweitert.
- Naechster Schritt: Wiki-Modul-Grundgeruest mit Validierung bauen und in Start-Routine aufnehmen.

## Iteration 57 (2026-03-01)

- Hauptziel (C) umgesetzt: JSON-Store unterstuetzt jetzt versionierte Writes (versioniertes Speichern) mit fortlaufender Nummer und sicherem Recovery-Pfad.
- Mini-Optimierung: Storage-Fehlermeldungen sind laienklar und nennen immer den naechsten Schritt.
- Next Step: Daten-Inventur-Patch vorbereiten (ueberfluessige data/- und dummys/-Reste risikofrei auflisten und in `todo.txt` dokumentieren).

## Iteration 56 (2026-03-01)

- Hauptziel (B) abgeschlossen: Plugin-Loader ist minimal gehaertet (Manifest-Typ/Version, Plugin-ID-Format, Pfadschutz gegen absolute und Elternpfade).
- Mini-Optimierung: Kanban bietet jetzt optionales Drag-and-Drop als getrennten Zusatzpfad; Dialog bleibt als klarer A11y-Standard erhalten.
- Datenbereinigung: `dummys/unsafe-plugin-manifest.json` auf einheitliches Manifestformat gebracht.
- Next Step (C): Storage-Service weiter haerten (versionierte Writes + Backup-Hook-Checks).

## Iteration 53 (2026-03-01)

- Hauptziel abgeschlossen: Kanban-Karten sind jetzt per Dialog verschiebbar (mit Enter/Escape-Rueckweg und Statushilfe).
- Mini-Optimierung: Jede Karte hat einen klaren Verschieben-Button (44px, Fokus sichtbar, einfacher Hilfe-Text).
- Next Step (C): Kartenverschiebung als naechstes dauerhaft in data/kanban_board.json speichern und Startcheck dafuer erweitern.

## Iteration 52 (2026-03-01)

- Hauptziel abgeschlossen: Referenzbild professionell analysiert und als klare UI-Vorgabe direkt im Dashboard umgesetzt.
- Mini-Optimierung: Team/Kalender sind jetzt mit Textstatus sichtbar statt als leere Platzhalter.
- Next Step (A): Kanban-Schnellansicht im naechsten Patch an echte Moduldaten anbinden.

## Iteration 50 (2026-03-01)

- Hauptziel abgeschlossen: Offener Punkt "Boot-View-Statusbereich mit klaren Phasen + Ampel-Texten" ist vollstaendig umgesetzt.
- Mini-Optimierung: Boot-Status zeigt Ampel nie nur ueber Farbe, sondern immer mit Text und naechstem Schritt.
- Next Step (C): Wiki-Modul als naechstes Teilziel mit klarer Eingabepruefung vorbereiten.

## Iteration 49 (2026-03-01)

- Hauptziel abgeschlossen: Offener Punkt "Backup-Dialog-Sicherheitsabfrage (Prompt) automatisiert testen" ist jetzt vollstaendig umgesetzt.
- Mini-Optimierung: Prompt-Pruefung ist zentral gekapselt und liefert klare Ja/Nein-Ausgabe fuer robuste Rueckwege.
- Next Step (A): Boot-View-Statusbereich mit klaren Phasen + Ampel-Texten fuer Laien stabilisieren.

## Iteration 48 (2026-03-01)

- Hauptziel abgeschlossen: Offener Punkt 'Backup-Auswahl-Dialog als UI inkl. Hook-Ende-zu-Ende testen' ist jetzt per automatischem Test komplett abgedeckt.
- Mini-Optimierung: Test meldet klaren Fehlerpfad in einfacher Sprache durch eindeutige Assertions.
- Next Step (A): Sicherheitsabfrage im Backup-Dialog (Prompt-Bestaetigung) ebenfalls automatisiert testen.

## Iteration 47 (2026-03-01)

- Hauptziel abgeschlossen: Restore-Flow erkennt Ziel-Datei (store/registry) jetzt automatisch aus Backup-Dateinamen.
- Mini-Optimierung: Sicherheitsabfrage mit klarem Rueckweg (abbrechen oder erneut versuchen) vor dem Restore eingebaut.
- Next Step (A): Boot-View-Statusbereich mit klaren Phasen, Ampel-Texten und Weiter-Gate stabilisieren.

## Iteration 46 (2026-03-01)

- Hauptziel abgeschlossen: Todo-Filter (Kalendertag/Heute/Offen/Archiv) mit Tastatur-Shortcuts ist umgesetzt und getestet.
- Mini-Optimierung: Inline-Hilfe am Filter mit klarer Aktion + Rueckweg (Enter/Escape) ist sichtbar.
- Next Step (C): Restore-Flow fuer store/registry automatische Zielerkennung + Sicherheitsabfrage bauen.

Iteration 44 (2026-03-01): Todo-Listen-Modul mit Kalender + Archiv umgesetzt und Backup-Ziel-Datei im Dialog explizit waehlbar gemacht.
Naechster Schritt: Todo-Daten optional persistent speichern und Filter (heute/offen/archiv) erweitern.

Iteration 43 (2026-03-01): Backup-Wiederherstellung im Dashboard nutzt jetzt echten Projektordner-Zugriff und schreibt Zieldateien direkt mit JSON-Validierung.
Naechster Schritt: Wiederherstellung fuer mehrere Zieltypen weiter haerten und Boot-View-Statusbereich stabilisieren.

Iteration 42 (2026-03-01): Backup-Auswahl mit JSON-Store-Backup-Hook verbunden (Event-Log + Dialog-Auswahl + Wiederherstellen-Schritt).
Naechster Schritt: Echte Wiederherstellung aus Dialog direkt mit Dateizugriff koppeln und Ende-zu-Ende pruefen.

Iteration 41 (2026-03-01): Kontrastmessung je Theme automatisiert, Release-Check prueft jetzt WCAG-AA Zielwert (4.5) fuer Haupttext und Topbar.
Naechster Schritt: Backup-Auswahl-Dialog direkt an JSON-Store-Backup-Hook anbinden und Ende-zu-Ende pruefen.

# SELFINFO

Stand: 2026-03-01
Iteration: 39

## Iteration 39 – Backup-Dialog mit 5-Punkte-Check + Doku-Readiness

- Backup-Dialog im Dashboard zeigt jetzt den 5-Punkte-Release-Check direkt im Dialog als Inline-Hilfe.
- Release-Readiness-Check prueft jetzt zusaetzlich die Doku-Regel fuer README, CHANGELOG und todo.
- Naechster Schritt bleibt: Backup-Dialog an den JSON-Store-Backup-Hook anbinden.

## Iteration 37 – Release-Fertig je Einzelpunkt

- Entscheidungsregel dokumentiert: Einzelne offene Punkte duerfen
  release-fertig abgeschlossen werden, wenn alle Pflichtchecks gruen sind.
- README um 5-Punkte-Kurzcheck in einfacher Sprache erweitert.
- Naechster Schritt bleibt unveraendert: Backup-Dialog mit Backup-Hook verbinden.

## Iteration 36 – Strategie-Update

- Entwicklungsstrategie auf den aktuellen Stand verdichtet: zuerst sichere
  Kernpfade (Plugin-Loader + Storage), danach modulare Features.
- Einheitliche Reihenfolge je Patch festgelegt: PatchSpec, Mini-Patch,
  `bash start.sh`, Doku-Update, Abschluss-Notiz.
- Informationsdateien synchronisiert: README, PROJECT_INFO, CHANGELOG,
  todo, MEMORY_FIXES, QUESTIONS_TODO und AGENTS_LOG.
- Naechste zwei Pflichtziele fuer die Folgeiteration gesetzt:
  **B (Plugin-Loader minimal)** und **C (Storage-Service robust)**.
- Laienfokus verstaerkt: jeder Fehlerweg bleibt bei
  „Erneut versuchen / Reparatur starten / Protokoll oeffnen".

## Gemacht

- Platzhalter-Scan praezisiert: nur echte Kommentar-/Aufgabenzeilen, inklusive Unterordner-Scan, mit neuen Tests abgesichert.
- Help-Panel-Mini-Leitfaden um Tastaturhinweis fuer Theme-Wechsel (Tab + Enter) erweitert.
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

- AGENTS-Iterations-Pipeline erweitert: neuer Pflichtschritt "Autonomer Abschluss-Check" nach Doku mit `bash start.sh` als Freigabe.

- README um Mini-Leitfaden fuer den Pflicht-Abschluss-Check erweitert (3 klare Schritte + Hilfe-Befehle).
- Platzhalter-Scan verbessert: `todo-title` in HTML loest keinen Fehlalarm mehr aus, nur echte Marker wie `TODO:` werden gemeldet.

- AGENTS.md erweitert: klare Releasefertig-Definition pro Patch (Implementierung, Fehlerpfad, Test, Doku, Startcheck).
- AGENTS.md erweitert: Datei-/Fortschrittsstatus muss sichtbar sein (Dateiname oder `data/file_status_index.json`).

- Hilfe-Panel um einen kurzen 3-Schritt-Mini-Leitfaden aus README erweitert und im Modell validiert.

- README-Fortschritt wird jetzt in der Start-Routine automatisch aus `todo.txt` synchronisiert (Prozent, erledigt, offen).

## Next Step

- Option A als naechstes: Boot-View stabilisieren (Phasen, Ampel, Details, Weiter-Gate).

## Iteration 37 – Plugin-Loader-Hardening

- Plugin-Manifest validiert jetzt doppelte IDs vor dem Laden (Validierung = Eingabepruefung).
- Plugin-Loader blockiert Modulpfade ausserhalb des Projektordners fuer mehr Sicherheit.
- Neue Tests decken beide Fehlerfaelle ab (doppelte ID + unsicherer Pfad).
- `bash start.sh` lief komplett gruen durch.
- Naechste zwei Pflichtziele bleiben: **B (Plugin-Loader minimal absichern)** und **C (Storage-Service robust)**.

- Iteration 45: Todo-Persistenz umgesetzt (`data/store.json`) mit Import/Export-Validierung im Modell.
- Checks: `npm run format`, `node --test`, `bash start.sh` alle erfolgreich.
- Next Step: Empfehlung 2 umsetzen (Todo-Filter heute/offen/archiv + Tastatur-Shortcuts).

- Help-Panel-Mini-Leitfaden um Schritt 4 erweitert: Referenzbild-Abgleich alle 5 Iterationen als sichtbarer Pflicht-Hinweis.

## Iteration 55 – Kanban-Stand speichern (fertig)

- Hauptziel: Kanban-Kartenverschiebung persistent gespeichert.
- Ergebnis: Nach Verschieben wird validiertes JSON direkt nach `data/kanban_board.json` geschrieben.
- Mini-Optimierung: Erfolgsstatus nennt jetzt "verschoben und gespeichert" fuer klare Rueckmeldung.
- Next Step: Option B (Plugin-Loader minimal) oder optionaler Kanban-Drag-and-Drop als Zusatzpfad planen.

## Iteration 63 (2026-03-02)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Bridge/Sonstiges-Vorlagen + Songtext-Lesemodus).
- Ergebnis: Songtext-Editor bietet jetzt vier Vorlagen (Intro, Refrain, Bridge, Sonstiges) mit klaren Statusmeldungen.
- Ergebnis: Neuer Lesemodus zeigt Songtitel, Zeilenanzahl und bereinigten Songtext direkt im gleichen Panel.
- Mini-Optimierung: Lesemodus-Hilfetext in einfacher Sprache mit Rueckweg-Hinweis ergänzt.
- Naechster Schritt: Lesemodus mit eigenem Schliessen-Knopf und Escape-Hinweis finalisieren.
