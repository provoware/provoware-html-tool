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
