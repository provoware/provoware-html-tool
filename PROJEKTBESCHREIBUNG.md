## Iteration 93 – Boot-Debug, Support-Kurztext, Detailstatus

- Beim Boot-Fokusziel-Wechsel wird die Live-Ansage jetzt auch im Debug-Protokoll angezeigt.
- Der Support-Verlauf kuerzt den Tastatur-Hinweis automatisch, wenn der Detailtext lang ist.
- Der Versions-Detailmodus zeigt zusaetzlich den zuletzt geoeffneten Zustand (geoeffnet/eingeklappt).
- Naechster Schritt: Detailzustand pro Projekt dauerhaft speichern.

## Iteration 92 – Hilfe/UX und Detailmodus

- Im Support-Verlauf traegt jetzt jeder Treffer einen kurzen Tastatur-Hinweis fuer Tab, Enter und Escape.
- Der Versions-Detailmodus bleibt sichtbar, startet aber immer eingeklappt. Das macht den Dialog uebersichtlicher.
- Naechster Schritt: Boot-Live-Ansage auch im Debug-Protokoll mitloggen.

## Iteration 88 – Doku-Optimierung fuer Releasefinalisierung
- README ist jetzt als klare Einstiegsdoku fuer Laien und Release-Checks aufgebaut.
- AGENTS.md nutzt jetzt eine kompakte V3-Struktur mit klaren Pflicht-Gates.
- Tool-Umfang bleibt vollautomatisch: `start.sh` prueft Voraussetzungen, Formatierung, Tests und Release-Bereitschaft.

## Update Iteration 86 – Hilfe und Wiederherstellung

- Das Hilfe-Panel hat einen Safe-Mode-Reset-Knopf. Er beendet den Safe-Mode mit Sicherheitsabfrage und setzt das Plugin-Manifest auf den Standard zurueck.
- Der Restore-Dialog zeigt jetzt vor dem Wiederherstellen einen einfachen Vergleich: Anzahl Felder und Dateigroesse. Das hilft Laien vor dem Klick.
- Das Boot-Gate setzt nach Freigabe den Fokus automatisch auf das erste Modul. So ist die Tastatur-Navigation direkt am richtigen Startpunkt.

## Iteration 84 – Tool-Umfang erweitert

- Boot-Status hat jetzt ein Weiter-Gate: der Start bleibt gesperrt, bis alle Pflichtphasen erfolgreich sind.
- Plugin-Loader bietet Safe-Mode-Reparatur (Notfallmodus) mit leerer Pluginliste, damit der Core wieder startet.
- JSON-Store fuehrt current-Pointer-Dateien (`*.current.json`) fuer versionierte Daten und eine gezielte Wiederherstellung.

## Iteration 80 – Zufallskategorien im Songtext-Editor

- **Tool-Umfang erweitert:** Der Songtext-Zufall kann jetzt einzelne Kategorien aktivieren/deaktivieren (Genre, Stimmung, Stil).
- **Laienhilfe direkt im Modul:** Das Tool erklaert klar, welche Kategorien aktiv sind und was der naechste Schritt ist.
- **Sicheres Verhalten:** Wenn alle Kategorien deaktiviert werden, setzt das Tool automatisch auf den sicheren Standard zurueck.
- **Wartbarkeit:** Kategorie-Logik und Validierung laufen zentral in `quick_store_module.js` und sind mit Tests abgesichert.

## Iteration 75 – Abschlussbericht + Lesemodus-Hilfe

- Der Lesemodus zeigt beim Schliessen jetzt eine klare Tastaturhilfe: Enter bestaetigt, Alt+T/Alt+I wechselt das Fokusziel.
- Die Start-Routine sammelt Shortcut-Konflikte am Ende in einem eigenen Abschlussblock.
- Vorteil fuer Laien: Erst den Abschlussblock lesen, dann gezielt "Erneut versuchen" oder "Protokoll oeffnen" waehlen.

## Iteration 73 – Startcheck + Songtext-Hilfe erweitert

- **Lesemodus-Statushilfe:** Die Live-Statuszeile nennt jetzt immer Alt+T/Alt+I, damit der Fokuswechsel ohne Maus klar bleibt.
- **Start-Routine-Tooldetail:** Neuer Shortcut-Konfliktcheck meldet moegliche OS-Besonderheiten (z. B. Alt+I auf macOS) mit direktem naechstem Schritt.
- **Validierung (Eingabepruefung):** Der neue Check prueft Shortcut-Eintraege auf gueltigen Text, bevor Hinweise gebaut werden.
- **Laiennutzen:** Nutzer sehen sofort, ob sie einfach weiterarbeiten koennen oder zuerst den Shortcut pruefen sollten.

## Iteration 71 – Tool-Umfang erweitert

- **Songtext-Profilstatus:** Das Tool zeigt jetzt ein klares Statusfeld fuer das aktive Zufallsprofil im Lyrics-Bereich.
- **Lesemodus-Start-Hilfe:** Beim Oeffnen der Vorschau wird das aktive Fokusziel direkt sichtbar erklaert.
- **A11y-Nutzen:** Beide Hinweise laufen als Live-Status (aria-live), damit Screenreader die Aenderung sofort vorlesen koennen.
- **Laiennutzen:** Nutzer sehen ohne Fachwissen sofort, welches Profil aktiv ist und wo der Fokus nach der Vorschau landet.

## Iteration 70 – Erweiterung Songtext-Workflow

Der Songtext-Workflow speichert jetzt die letzte Profilwahl fuer Zufallsinhalte und das bevorzugte Fokusziel nach dem Lesemodus.

### Neu hinzugefuegte Tool-Details
- **Quick-Store-Praeferenzen:** Neue Datei `data/quick_store_lyrics_preferences.json` mit validierter Struktur (`version`, `updatedAt`, `randomProfile`, `previewFocusTarget`).
- **Autoload beim Start:** Beim Modulstart werden gespeicherte Werte geladen und automatisch in den UI-Feldern gesetzt.
- **Shortcut-Logik:** Taste **T** waehlt Titel-Fokus, Taste **I** waehlt Inhaltsfokus; beide Wege speichern sofort den neuen Zustand.

## Iteration 67 – Songtext-Hilfe weiter vereinfacht
- Lesemodus-Knopf zeigt jetzt direkt den Tastaturweg **Enter/Space** fuer Kopieren.
- Kurzguide hat jetzt 3 klare Schritte mit Speichern und Rueckweg in einfacher Sprache.
- Tool-Nutzen: Einsteiger sehen sofort Aktion, Datenwirkung und sicheren Rueckweg ohne Suchen.

## Iteration 66 – Erweiterter Tool-Umfang
- Neues Design-Token-Set fuer Rail, Statusbanner und modulbezogene Kartenprofile in allen 5 Themes.
- Release-Check misst jetzt zusaetzlich Kontrast fuer Banner, Rail und vier Modulprofile (AA-Zielwert).
- Nutzen fuer Laien: stabilere Lesbarkeit in jedem Theme und klarer Rueckweg bei Boot-Fehlern.

## Iteration 62 – Songtext-Editor und getrennte Bereichsdateien

- Der Songtext-Editor sitzt jetzt direkt im Lyrics-Bereich (Songideen) und bietet Intro-/Refrain-Vorlagen.
- Tastaturhilfe ist sichtbar: Enter aktiviert Vorlagen, Escape ist der schnelle Rueckweg zu Allgemein.
- Schnellspeicher ist wartbarer: jeder Bereich hat jetzt eine eigene Datei fuer bessere Recovery (Wiederherstellung).
- Legacy-Migration bleibt aktiv: alte Sammeldatei wird beim ersten Laden automatisch in drei Dateien aufgeteilt.

## Update Iteration 60 – Schnellspeicher + Mini-Punkte-Regel

- Das Dashboard hat jetzt einen Schnellspeicher fuer kurze Ideen.
- Eingaben werden vor dem Speichern geprueft (Validierung = Eingabepruefung).
- Die Start-Routine stoppt jetzt, wenn in `todo.txt` nicht genau zwei offene Mini-Punkte stehen.
- Vorteil fuer Laien: klarer Status, klarer Rueckweg und weniger Planungschaos pro Iteration.

## Iteration 59 – Wiki-Modul erweitert
- Neues Wiki-Panel im Dashboard: Kategorie, Titel, Inhalt, Speichern und Aktualisieren.
- Wissensdaten werden sauber getrennt in `data/wiki_notes.json` gehalten.
- Validierung (Eingabepruefung) verhindert leere oder ungueltige Kategorien.
- Testabdeckung fuer Speichern, Aktualisieren, Import/Export und Fehlerfall ist vorhanden.

## Patch 058 – Tool-Umfang erweitert

- Neues Tool-Modul: `project_file_writer` fuer sichere JSON-Dateiwrites im Projektordner.
- Nutzen fuer Laien: klare Fehlermeldungen mit naechstem Schritt (Erneut versuchen, Reparatur starten, Protokoll oeffnen).
- Technischer Umfang: Pfad-Validierung (kein `..`), automatische Ordnerauflosung, formatierter JSON-Write mit Ergebnispruefung.

## Iteration 56 – Kernfortschritt

- Plugin-Loader (Plugin-Lader) wurde minimal gehaertet: Manifest-Typ, Version (Semver = Versionsformat x.y.z), Plugin-ID und Modulpfad werden vor dem Laden strikt geprueft.
- Kanban hat jetzt optionales Drag-and-Drop (Ziehen und Ablegen) als Zusatz. Rueckweg bleibt immer der Dialog mit Enter/Escape.
- Dummy-Daten wurden bereinigt: das unsichere Test-Manifest nutzt jetzt dieselbe Grundstruktur wie normale Plugin-Manifeste.

- Update 2026-03-01: Kanban-Schnellansicht hat jetzt pro Karte einen Verschieben-Dialog mit Enter/Escape-Rueckweg, Fokusfuehrung und klaren Statushinweisen.
## Iteration 53 – Kanban produktiv angebunden

- Neue Datei `data/kanban_board.json` ist jetzt die echte Datenquelle fuer die Kanban-Schnellansicht im Dashboard.
- Neue Moduldatei `templates/kanban_preview.js` trennt Lade-Logik, Validierung (Eingabepruefung), Rendering und Keyboard-A11y sauber voneinander.
- Barrierefreiheit: Spalten sind mit Tab erreichbar, Pfeil links/rechts wechselt den Fokus, Fokusrahmen ist in allen Themes sichtbar.

# PROJEKTBESCHREIBUNG

## Ziel
Dieses Tool bietet ein barrierefreies Dashboard mit klaren Schritten fuer Laien.

## Kernumfang
- Dashboard mit Theme-Auswahl und Hilfe-Aktionen.
- Start-Routine mit Auto-Checks, Auto-Formatierung und Auto-Tests.
- Release-Readiness-Check fuer A11y, Themes, Hilfe-Aktionen und Doku-Pflicht.

## Tools und Nutzen
- `bash start.sh`: Vollautomatischer Projektcheck mit Nutzerfeedback.
- `tools/release_readiness_check.js`: Prueft Freigabe-Basics vor Release.
- `tools/help_cli.js`: Zeigt Reparaturwege in einfacher Sprache.

## Iteration 39 Update
- Backup-Dialog zeigt den 5-Punkte-Release-Check direkt als Inline-Hilfe.
- Doku-Regel wird jetzt automatisch im Release-Readiness-Check geprueft.
- Naechster Ausbau: Backup-Hook Ende-zu-Ende mit Dialog verbinden.


## Iteration 40 Update
- Neue Themes fuer Sehschwaeche: Rötlich und Camouflage als zusaetzliche Wahl.
- Release-Check deckt jetzt 5 Themes vollstaendig ab.
- Laienhilfe erweitert: kurzer Leitfaden fuer Theme-Wahl und naechste Schritte bei Unsicherheit.

## Iteration 41 Update
- Release-Readiness misst jetzt Kontrast je Theme automatisch fuer Haupttext und Topbar.
- Der Check nutzt den WCAG-AA Zielwert 4.5 und meldet bei Abweichung klare naechste Schritte.
- Naechster Ausbau: Backup-Auswahl-Dialog mit JSON-Store-Backup-Hook verbinden und E2E pruefen.

## Iteration 42 – Backup-Workflow erweitert
- Neues Kernmodul `system-core/backup_hook_log.js` sammelt Backup-Ereignisse zentral.
- `writeRegistryWithVersion` uebergibt jetzt einen Backup-Hook und schreibt Ereignisse in `data/backup_events.json`.
- Dashboard-Dialog zeigt diese Ereignisse als Auswahl und bietet einen klaren Knopf `Backup wiederherstellen`.
- Vorteil fuer Laien: klare Auswahl, klare Aktion, klarer Rueckweg (Zurueck oder Escape).


## Iteration 43 Update
- Backup-Wiederherstellung arbeitet jetzt direkt mit Projektordner-Handle und schreibt die Ziel-JSON wirklich zurueck.
- Neue Restore-Logik ist in `templates/backup_restore.js` gekapselt (klare Input-/Output-Pruefung).
- Fehlerweg bleibt laienfreundlich mit klaren naechsten Schritten und Debug-Hinweis.


## Iteration 44 – To-Do-Listen-Modul
- Neues Frontend-Modul mit Kalenderdatum, Eingabefeld, Abhak-Button und Archivliste.
- Ziel-Datei fuer Backup-Restore ist jetzt direkt im Dialog auswaehlbar (mehr Kontrolle, weniger Risiko).
- A11y-Details: klare Labels, 44px Buttons, Tastaturbedienung ueber Standard-Controls.

## Iteration 45 – Todo-Speicher (optional persistent)
- Umfang: Aufgaben werden im Browser weiter lokal geführt und optional in `data/store.json` gespeichert.
- Vorteil: Nach Neustart bleiben Aufgaben erhalten, wenn ein Projektordner aktiv verbunden ist.
- Technikdetail: `todo_list_model` liefert jetzt `exportState` und `importState` mit Eingabepruefung (Validierung).
- Fehlerfall: Bei defektem Speicher zeigt das System eine klare Laienmeldung und verweist auf Reparatur oder Protokoll.

## Iteration 46 – Erweiterung Aufgabenmodul
- Neuer Filter im Aufgabenmodul: `Kalendertag`, `Heute`, `Offen`, `Archiv`.
- Ziel: Laien sehen schneller den richtigen Aufgabenstatus ohne Suchen.
- A11y-Plus: Filter ist per Tastatur steuerbar und hat klaren Rueckweg mit Escape.
- Tool-Umfang: `templates/todo_module.js` steuert Filterlogik, `system-module/todo_list_model.js` liefert offene Aufgaben mit Input/Output-Pruefung.


## Iteration 47 – Restore-Sicherheit
- Restore-Tool erkennt die Ziel-Datei automatisch aus dem Backup-Namen.
- Nur erlaubte Ziele (`store.json`, `registry.json`) werden angenommen.
- Vor dem Schreiben bestaetigt der Nutzer den Dateinamen als Sicherheitsabfrage.


## Iteration 48 – Zusatzinfo
- Der Backup-Dialog ist jetzt mit einem Ende-zu-Ende-Test abgesichert: vom Backup-Hook-Log bis zur echten Wiederherstellung.
- Vorteil fuer Laien: Fehler werden frueher erkannt, bevor ein Restore im Alltag scheitert.
- Tool-Umfang erweitert: automatischer Integrations-Test fuer Backup/Restore ist Teil der Standard-Qualitaet.


## Iteration 49 – Prompt-Absicherung
- Das Restore-Tool prueft die Sicherheitsbestaetigung jetzt ueber eine zentrale Funktion.
- Vorteil: Gleiches Verhalten in UI und Tests, dadurch weniger Risiko bei kritischem Datei-Schreiben.
- Tool-Umfang: `templates/backup_restore.js` bietet eine klare Pruef-API fuer Prompt-Eingaben.


## Iteration 50 – Boot-View-Ampelstatus
- Der Startbereich zeigt jetzt 4 feste Boot-Phasen mit Ampel und Text fuer klare Orientierung.
- Das neue Tool `templates/boot_status.js` kapselt die Statuslogik modular fuer bessere Wartbarkeit.
- Zusatznutzen: Bei Ordnerfehlern wird die passende Phase rot markiert und ein klarer naechster Schritt genannt.

## Iteration 51 – Hilfe-Hinweis Referenzbild
- Das Help-Panel zeigt jetzt im Mini-Leitfaden einen klaren 4. Schritt: Referenzbild alle 5 Iterationen mit dem Dashboard vergleichen.
- Vorteil fuer Laien: der Pflicht-Rhythmus ist direkt im UI sichtbar und wird nicht vergessen.
- Tool-Umfang: `system-module/help_panel.js` validiert nun 4 Leitfaden-Schritte mit klarer Fehlerreaktion.


## Iteration 52 – Referenzbild-Analyse + konkrete Tool-Vorgaben
- Layout-Vorgabe: kompakter Kopfbereich, KPI-Karten und Kanban-Viererspalte als feste Orientierung im Dashboard.
- Farb-/Kontrastvorgabe: Neon-Optik nur als Hintergrundeffekt, Text bleibt kontraststark ueber die bestehenden Theme-Tokens.
- Interaktionsvorgabe: jede neue Sektion hat einen kurzen Hilfetext mit Aktion und Rueckweg.

## Iteration 55 – Tool-Umfang erweitert (Kanban-Persistenz)

Neu im Umfang:
- `templates/kanban_preview.js` kann Karten jetzt nicht nur verschieben, sondern auch ueber eine Save-Schnittstelle sicher speichern.
- `templates/dashboard.js` stellt den Datei-Write ueber den gewaehlt-en Projektordner bereit.

Vorteil fuer Laien:
- Nach Neustart bleibt die zuletzt gespeicherte Kanban-Reihenfolge erhalten.
- Bei Fehlern wird weiterhin ein klarer naechster Schritt genannt (erneut versuchen, reparieren, Protokoll oeffnen).


## Iteration 57 Update
- Storage-Service wurde gehaertet: versionierte Speicherstaende pro Datei sind jetzt optional direkt im JSON-Store verfuegbar.
- Recovery kann die letzte gueltige Version automatisch finden und in die Ziel-Datei zurueckschreiben.
- Vorteil fuer Laien: Bei Datenfehlern gibt es einen klaren Rueckweg ohne manuelles Dateisuchen.

## Iteration 61 - Tool-Umfang Schnellspeicher
- Das Tool hat jetzt drei Bereiche: Allgemein, Songideen und Recherche.
- Jeder Bereich hat eigene Eintraege in derselben JSON-Datei (`data/quick_store_entries.json`).
- Vorteil fuer Laien: Sie koennen Ideen sauber trennen und spaeter schneller finden.
- Technisch: Validierung (Eingabepruefung) prueft Bereich, Titel und Inhalt vor dem Speichern.

## Iteration 63 – Songtext-Editor erweitert
- Zwei offene Punkte wurden vollstaendig abgeschlossen: **Bridge/Sonstiges-Vorlagen** und **Lesemodus-Vorschau**.
- Tool-Details:
  - `templates/quick_store_module.js` liefert jetzt zentrale Vorlagen-Builder mit Eingabepruefung.
  - Der Lesemodus bereinigt Leerzeilen, zaehlt Zeilen und zeigt einen klaren Titel.
  - Fehlertexte bleiben laienklar mit naechstem Schritt (Erneut versuchen / Protokoll oeffnen).
- UX/A11y-Nutzen:
  - Vorlagen sparen Tipparbeit und helfen beim strukturierten Schreiben.
  - Lesemodus hilft beim schnellen Gegenlesen ohne Wechsel in ein anderes Modul.
- Naechster sinnvoller Ausbau:
  1) Lesemodus mit eigenem Schliessen-Knopf + Escape-Hinweis.
  2) Pro Vorlage ein kurzer Inline-Hinweis (Was macht das? Was passiert mit Daten? Rueckweg).



## Iteration 64 Update
- Songtext-Lesemodus besitzt jetzt einen klaren Schliessen-Knopf mit Escape-Hinweis fuer barrierefreien Rueckweg.
- Vorlagenhilfe ist direkt im Modul sichtbar und erklaert Intro/Refrain/Bridge/Sonstiges in einfacher Sprache.
- Testumfang wurde um Hilfetext-Validierung erweitert, damit Input/Output der Hilfelogik stabil bleibt.


## Iteration 65 – Referenzbild-Loeschung + Design-Layout-Manifest
- Die Bilddatei `Beispiel_Design_Layout_Muster_Bildvorlage _als_Vorlage.png` wurde aus dem Projekt entfernt.
- Das Dashboard wurde visuell naeher an die Vorlage gebracht: dunkles Neon-Fundament, sichtbare Rail-Rahmen und Statusbanner.
- Neues Tool-Detail: `config/design_layout_manifest.json` beschreibt Aufbau, Designregeln, A11y-Mindestregeln und Theme-Ziele maschinenlesbar.
- Zusatzdoku: `docs/DESIGN_LAYOUT_MANIFEST.md` enthaelt professionelle Soll/Ist-Analyse und priorisierte Folgepunkte.

## Erweiterung 2026-03-03: Globale UI-Design-Tokens

Neu ist eine zentrale Token-Datei `config/ui_design_tokens.json`.
Sie ist die globale Wahrheit fuer:
- Abstaende (Spacing)
- Rundungen (Radius)
- Schrift (Font)
- Schatten (Shadow)
- Button-Hoehen

Nutzen fuer Plugins:
- Plugins bleiben optisch im selben System.
- UI wirkt einheitlich in allen Themes.
- Release-Check prueft, ob das Token-Set vorhanden ist.

Praktischer Einsatz:
1. Neue UI-Komponente erstellt? Nur Token-Werte verwenden.
2. Keine eigenen Pixelwerte ohne Grund.
3. Bei Abweichung: erst Token erweitern, dann Komponente bauen.


## Iteration 65 – Lesemodus-Kopieren und Songtext-Kurzguide
- Zwei offene Punkte wurden vollstaendig abgeschlossen: **Kopieren-Knopf im Lesemodus** und **einklappbarer Songtext-Kurzguide mit Tastaturfokus**.
- Tool-Umfang:
  - `templates/dashboard.html` zeigt jetzt den Guide-Knopf + Guide-Inhalt und den Kopieren-Knopf im Lesemodus.
  - `templates/quick_store_module.js` steuert Kopieren (mit Validierung), Statusmeldungen und Fokusfuehrung fuer den Kurzguide.
  - `test/quick_store_module.test.js` prueft den Kopierpfad inkl. Fehlerfall.
- Laiennutzen: Text kann direkt uebernommen werden, und Hilfe ist ohne Seitenwechsel sichtbar.

## Update Iteration 67 – Hilfe/UX fuer Songtext
- Der Songtext-Kurzguide zeigt jetzt eine klare Schrittliste fuer Tastaturbedienung (Enter/Space/Escape).
- Der Lesemodus hat eine sichtbare Kopierhilfe fuer Faelle, in denen Clipboard blockiert ist.
- Nutzen fuer Laien: Jeder Fehler hat direkten Rueckweg ohne Techniksuche.

## Iteration 68 – Erweiterung Songtext-Editor
- Neuer 1-Klick-Zufallsimpuls erzeugt direkt nutzbaren Songtext-Startblock.
- Fokusfluss verbessert: Lesemodus schliessen fuehrt sicher zur Titel-Eingabe zurueck.
- Tool-Umfang: Quick-Store deckt jetzt Vorlagen + Zufallsimpuls + Lesemodus inkl. Rueckweg im selben Modul ab.

## Iteration 69 – Songtext-Profilfilter und Fokusziel
- Der Songtext-Zufallsgenerator kann jetzt Profile nutzen (Standard, Techno, Hoerspiel, Chill), damit Vorschlaege besser zum Projektstil passen.
- Der Lesemodus bietet jetzt ein waehlbares Fokusziel nach dem Schliessen, damit Tastaturarbeit ohne Umwege weitergeht.
- Beide Funktionen arbeiten mit Eingabepruefung (Validierung), klaren Fehlermeldungen und naechstem Schritt.


## Iteration 72 – Tool-Umfang erweitert

- Songtext-Modul hat jetzt sichere Tastenkombinationen (Alt+T, Alt+I) fuer Fokuswechsel.
- Profile im Zufallsmodus zeigen eine letzte Nutzung, damit Teams den letzten Stand schneller erkennen.
- Enter im Fokusziel-Feld bestaetigt die Auswahl mit direkter Statusmeldung.

## Iteration 74 – Tool-Umfang Layout/Design
- Dashboard nutzt jetzt ein echtes Drei-Zonen-Shell-Layout mit verstellbaren Rails (Splitter + Collapse).
- Das Layout wird pro Projekt in `data/layout.json` gespeichert und beim Verbinden des Projektordners automatisch geladen.
- Das Modulraster skaliert jetzt auf 1-4 Spalten fuer kleine und grosse Bildschirme (responsive = passt sich an).
- Laiennutzen: weniger visuelle Abweichung zum Referenzbild, klarere Anordnung und schneller Rueckweg ueber `Layout-Reset`.



## Update Iteration 76: Modul-Steuerung + A11y-Kurzbericht

- Einheitliche Modul-Control-Hinweise (Tooltip + aria-label) erleichtern Maximieren, Minimieren und Ausblenden.
- Start-Routine meldet jetzt einen kompakten A11y-Kurzbericht, damit Laien sofort sehen, ob Fokus/Enter/Escape/Kontrast im gruenen Bereich sind.
- Naechster Ausbau: Gleiches Muster fuer Pin-Knopf und Fokusmodus (100%-Ansicht).


## Iteration 78 – Toolumfang erweitert
- Modul-Arbeitsflaeche nutzt ein fixes 3x3-Raster mit gleich grossen Slots und leerem Startzustand.
- Footer ist in 3 Bereiche geteilt: Debugging, Logging, System-Infos mit Schnellnotiz `data/KASI_NOTIZ.txt`.
- Schnellnotiz arbeitet als Append-Speicher (anhaengen statt ueberschreiben) und nutzt Zeitstempel fuer Nachvollziehbarkeit.
- Gesamt-Export schreibt den aktuellen Werkzeugzustand nach `data/tool_export.json`.

## Iteration 81 – Favoritenleiste + Moduloptionen + stricter TODO-Check

- **Favoritenleiste:** Rechte Zusatzleiste ist ausklappbar und per `Alt+F` steuerbar.
- **Moduloptionen unten:** Unterhalb der Modulflaeche gibt es jetzt einen festen Bereich fuer modulbezogene Aktionen.
- **Tool-Qualitaet:** `tools/start_routine.js` prueft offene TODO-Mini-Punkte jetzt strikter (Pflichtfelder muessen vorhanden und gefuellt sein).
- **Nutzen fuer Laien:** Jede neue Meldung zeigt direkt den naechsten Schritt.

## Iteration 82 – Favoriten- und Moduloptionen
- Favoritenleiste arbeitet jetzt mit echten Aktionen statt Dummy-Status.
- Aktion "Letztes Modul oeffnen" nutzt den letzten aktiven Modulkontext aus dem Workspace.
- Aktion "Alle Module anzeigen" listet aktive Module in der Statuszeile auf.
- Untere Moduloptionen sind kontextsensitiv und zeigen je Modul zwei direkte Folgeaktionen.
- Start-Routine zeigt bei TODO-Vorlagenfehlern jetzt eine Zeilenhilfe fuer schnellere Reparatur.


## Dashboard-Update: Sidebar-Suche und 3x3-Modulraster
- **Linke Sidebar:** Suchfeld + Modul-Liste aus zentraler Registry (`system-module/dashboard_model.js`).
- **Center:** Dashboard-Top zeigt Version, Pfadstatus und Live-Statusmeldung.
- **Grid:** 3x3 als Desktop-Standard, responsive 2/1 Spalten fuer kleine Breiten.
- **Footer:** Debugging, Logging, Notiz mit Dateispeicher (`.modultool/quicknote.txt`) und lokalem Fallback.
- **Rechte Sidebar:** Template-Knoepfe mit Clipboard-Fallback fuer Browser ohne Clipboard-Rechte.


## Iteration 85 – Weiteres Tool-Detail
- Boot-Gate-Status wird zentral im Modell erzeugt (offen/gesperrt + Hilfetext).
- Safe-Mode-Status kommt als eigener Panel-Text mit klaren Aktionen (Erneut versuchen, Reparatur starten, Protokoll oeffnen).
- Backup-Wiederherstellung hat jetzt zwei Wege: klassische Backup-Datei oder Version aus dem Versionsordner zur Ziel-Datei.


## Iteration 87 – Zwei fertiggestellte Punkte

- Safe-Mode-Reset hat jetzt eine lokale Support-Spur: ein Event wird in `data/backup_events.json` gespeichert.
- Der Versionsvergleich im Restore-Dialog zeigt jetzt drei neutrale Fakten: Feldanzahl, Byte-Groesse und Zeitstempel.
- Vorteil fuer Laien: Unterschiede sind klar lesbar, ohne auf Farben angewiesen zu sein.


## Iteration 88 – Layout- und Hilfe-Robustheit
- Das Dashboard folgt jetzt strikter Struktur: oben Header, mittig 3-Spalten-Shell, unten Footer.
- Der Hauptbereich nutzt ein quadratisches 3x3-Raster fuer Module; Sidebars bleiben fuer kleine Aktionen und Modulaufrufe.
- Hilfebereich ermoeglicht Filter auf Support-Verlauf und der Restore-Dialog zeigt optional JSON-Schluessellisten im Detailmodus.


## Erweiterung Iteration 89
- Startzustand ist jetzt absichtlich leer, ausser einem Auto-Start-Modul: **Notizen**.
- Die bisher grossen Bereichskacheln wurden in der linken Sidebar als Button-Links zusammengefuehrt.
- Beide Zeitbars (links/rechts) sind klar benannt und bleiben per Knopf ein- und aufklappbar.

- Boot-Gate-Hinweis nutzt jetzt das gespeicherte Fokusziel als Klartextzusatz (Modul/Hilfe).
- Support-Verlauf hat neben dem Typ-Filter eine Freitextsuche fuer Typ/Datum/Details mit UND-Logik.
- Backup-Detailmodus liefert gruppierte Schluessel (`Neu`, `Entfernt`, `Gleich`) statt einer unsortierten Liste.

## Erweiterung Iteration 91
- Boot-Bereich hat jetzt eine zusaetzliche Live-Statuszeile (`aria-live="polite"`), damit Fokuszielwechsel nicht nur visuell, sondern auch als Textsignal ankommt.
- Support-Verlauf zeigt eine laufende Trefferzahl und erlaubt Enter als direkten Suchstart (Tastatur zuerst).
- Rueckweg bleibt klar: Bei 0 Treffern zeigt der Verlauf weiterhin den naechsten Schritt (Filter aendern oder erneut versuchen).
