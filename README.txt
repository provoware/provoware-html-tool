- Neu (2026-03-01): Zwei offene Punkte abgeschlossen: Wiki-Modul ist jetzt als eigenes Panel mit Kategorie, Titel, Inhalt und Speicherung in `data/wiki_notes.json` verfuegbar.
- Neu (2026-03-01): Mini-Optimierung Hilfe/UX: Wiki-Panel erklaert in einfacher Sprache Aktion, Datenwirkung und Rueckweg.

- Neu (2026-03-01): Option C umgesetzt. JSON-Store kann jetzt optional versioniert speichern und bei Fehlern aus der letzten gueltigen Version wiederherstellen.
- Neu (2026-03-01): Storage-Recovery meldet klare Laien-Schritte: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.

- Neu (2026-03-01): Option B wurde priorisiert und abgeschlossen: Plugin-Loader prueft jetzt Manifest-Typ, Version, Plugin-ID-Format und sichere Projektpfade.
- Neu (2026-03-01): Kanban hat jetzt optionales Drag-and-Drop als kleinen Zusatzpfad; der Dialog bleibt der barrierefreie Standard-Rueckweg.
- Neu (2026-03-01): Datenbereinigung erledigt: `dummys/unsafe-plugin-manifest.json` ist jetzt im gleichen Manifest-Standard wie die anderen Dummy-Dateien.
- Neu (2026-03-01): Kanban-Karten haben jetzt einen Verschieben-Dialog mit Enter/Escape-Rueckweg und klarer Statusmeldung fuer Laien.
- Neu (2026-03-01): Kanban-Schnellansicht nutzt jetzt echte Daten aus `data/kanban_board.json` und ist per Pfeiltasten links/rechts barrierefrei bedienbar.
# Provoware HTML Tool

- Neu (2026-03-01): Referenzbild professionell analysiert und als feste UI-Vorgabe umgesetzt (Neon-Karten, KPI-Bereich, Kanban-Schnellansicht, Team/Kalendertext).
- Neu (2026-03-01): A11y-Plus in der neuen Vorlage: klare Textstatus statt nur Farben, 44px-Bedienelemente und sichtbare Tastaturwege.
- Neu (2026-03-01): Naechster Schritt aus der Analyse: Kanban-Karten als echte Datenquelle statt statischer Beispielwerte anbinden.

- Neu (2026-03-01): Alle 5 Iterationen ist jetzt eine Pflicht-Analyse des Vorgabebilds vorgesehen, damit Layout und Designstil konsistent am Beispiel bleiben.
- Neu (2026-03-01): Das Help-Panel erinnert jetzt direkt im Mini-Leitfaden an den 5-Iterationen-Referenzbild-Abgleich.
- Neu (2026-03-01): Pro Iteration werden Platzhalter/Teilcode-Stellen systematisch gesucht, dokumentiert und als TODO-Folgeschritte geplant.

- Neu (2026-03-01): Theme-Umschalter zeigt jetzt einen klaren Hilfe-Tooltip mit Rueckweg (altes Thema wieder waehlen).
## Iteration-Update 2026-03-01
- Offener Punkt abgeschlossen: Boot-View-Statusbereich ist jetzt mit 4 klaren Phasen und Ampel-Texten stabil umgesetzt.
- Naechster Schritt: Wiki-Modul als naechstes Teilziel mit Grundgeruest und Validierung starten.

## Entwicklungsfortschritt

- **Fortschritt:** 80 %
- **Erledigt:** 86 Punkte
- **Offen:** 22 Punkte

Stand: automatisch aus `todo.txt` gezaehlt.
- Neu in Iteration 35: Platzhalter-Scan erkennt jetzt nur echte Aufgaben-Kommentare und Hilfe zeigt den Tastaturweg fuer Theme-Wechsel.


## Strategie-Update (2026-03-01, Iteration 36)

- Wir arbeiten jetzt in kurzen, klar getrennten Mini-Patches (ein Ziel je Patch).
- Reihenfolge bleibt immer gleich: PatchSpec -> Implementierung -> `bash start.sh` -> Doku.
- Naechste Kernziele sind fest priorisiert: **B Plugin-Loader** und
  **C Storage-Service** (mit Validierung (Eingabepruefung), Backup-Hook und
  klaren Fehlerwegen).
- Alle Info-Dateien wurden in dieser Iteration synchronisiert, damit
  Fortschritt, Risiken und naechste Schritte fuer Laien sofort sichtbar sind.

## Iteration-Update (2026-03-01)

- Backup-Dialog zeigt jetzt den 5-Punkte-Release-Check direkt als Inline-Hilfe.
- Release-Readiness prueft jetzt auch die Doku-Regel (README/CHANGELOG/todo).
- Naechster Schritt: Backup-Auswahl-Dialog direkt mit dem Backup-Hook verbinden.

## Update 2026-03-01 (Iteration 40)

- Sichtbarkeit fuer Sehschwaeche verbessert: zwei neue Themes **Rötlich** und **Camouflage** sind in der Theme-Auswahl verfuegbar.
- Release-Readiness prueft jetzt alle 5 Themes statt nur 3.
- Hilfe und Doku enthalten jetzt einen kurzen Sehschwaeche-Leitfaden mit klaren Schritten.

## Update 2026-03-01 (Iteration 41)

- Release-Readiness misst jetzt den Kontrast je Theme automatisch (Haupttext + Topbar).
- Mindestziel ist WCAG AA (mindestens 4.5), damit Lesbarkeit in allen 5 Themes klar bleibt.
- Naechster Schritt: Backup-Auswahl-Dialog direkt an den JSON-Store-Backup-Hook anbinden.

## Update 2026-03-01 (Iteration 43)

- Backup-Wiederherstellung im Dialog arbeitet jetzt direkt mit dem gewaehlten Projektordner (Dateisystemzugriff) und schreibt die Ziel-Datei wirklich neu.
- Die Restore-Logik ist als eigenes Skript ausgelagert (`templates/backup_restore.js`) fuer bessere Wartbarkeit.
- Bei Fehlern sehen Sie klare naechste Schritte: Erneut versuchen, Reparatur starten, Protokoll oeffnen.

## Kann man einzelne offene Punkte schon release-fertig abschliessen?

Ja. Ein einzelner offener Punkt darf release-fertig sein, wenn er komplett
und sicher abgeschlossen ist.

Kurz-Check pro Punkt:
1. Funktion fertig und pruefbar
2. Fehlerfall mit klaren Buttons vorhanden
   (Erneut versuchen, Reparatur starten, Protokoll oeffnen)
3. Test oder Check laeuft gruen
4. `bash start.sh` laeuft ohne Abbruch
5. Doku ist kurz aktualisiert (README, CHANGELOG, todo)

Wichtig: Andere offene Punkte duerfen bleiben, wenn sie nicht Teil des
gleichen Risikobereichs sind.

## Offene Punkte (oben, kurz)

1. E2E-Wiederherstellung im Backup-Dialog weiter haerten
2. Wiki-Modul als neues Teilziel mit klarer Eingabepruefung starten

## Kurzüberblick

Dieses Projekt ist ein HTML-Werkzeug mit klarer Ordnung.
Es ist für Laien gedacht: verständlich, barrierefrei und stabil.

## Ziel

Das Projekt soll:
- leicht bedienbar sein,
- robust laufen,
- klar wartbar bleiben,
- vollautomatisch prüfen.

Wichtige Begriffe:
- **Kernel (Kern):** stabile Grundlogik.
- **Validierung (Eingabeprüfung):** Daten vor Nutzung prüfen.
- **Versionierung (Historie):** alte Stände bleiben erhalten.
- **A11y (Barrierefreiheit):** gute Nutzung für alle Menschen.

## Projektstruktur

Die Ordner sind getrennt und klar benannt:
- `system-core/` → Kernlogik
- `system-module/` → feste Module
- `config/` → Einstellungen und Manifeste
- `data/` → variable Daten und Versionen
- `tools/` → Prüf- und Diagnose-Helfer
- `templates/` → UI-Vorlagen
- `test/` → automatische Tests
- `dummys/` → Dummys für Tests und Reparatur

Vorteile:
- Fehler schneller finden
- Änderungen leichter prüfen
- Bessere Wartbarkeit

## Tool-Module (aktuelle Liste)

Stand: 2026-03-01

### Bereits vorhanden

1. **Dashboard-Kernmodul** (`system-core/dashboard_core.js`)
   - Startet die Hauptoberflaeche robust.
2. **Plugin-Loader** (`system-core/plugin_loader.js`)
   - Laedt Plugin-Manifeste sicher und isoliert.
3. **Registry-Service** (`system-core/registry_service.js`)
   - Prueft Registry-Daten mit Manifest-Regeln.
4. **JSON-Store** (`system-core/json_store.js`)
   - Speichert Daten atomar und mit Validierung
     (Eingabepruefung).
5. **Self-Repair** (`system-core/self_repair.js`)
   - Hilft bei Reparatur und Backup-Wiederherstellung.
6. **Start-Routine** (`tools/start_routine.js`)
   - Fuehrt Auto-Checks, Auto-Formatierung und Auto-Tests aus.
7. **Release-Readiness-Check** (`tools/release_readiness_check.js`)
   - Prueft A11y-Basis, Themes und Hilfe-Aktionen.
8. **Hilfe-CLI** (`tools/help_cli.js`)
   - Zeigt Logs, Backups und Reparaturbefehle in einfacher Sprache.
9. **Hilfe-Panel** (`system-module/help_panel.js`, `templates/help-panel.*`)
   - Gibt klare naechste Schritte fuer Laien.

### Geplante Tool-Module (Backlog)

1. **Genres/Moods/Stile-Archiv-Modul**
   - Eintraege pro Profil (z. B. Techno, Hoerspiele, Chill) anlegen,
     per Komma trennen, alphabetisch sortieren und importieren/exportieren.
   - Duplikate werden erkannt, Favoriten sind per Sternchen (`*Eintrag*`) markierbar,
     und jeder Import wird im Log festgehalten.
2. **Wiki-Modul**
   - Wissen nach Kategorien speichern und schnell wiederfinden.
3. **Schnellspeicher-Modul**
   - Titel + Eingabe direkt in feste Datei anhaengen.
   - Weitere Schnellspeicher-Bereiche mit eigenen Dateien anlegen.
4. **Songtext-Editor-Modul**
   - Vorlagen fuer Intro, Refrain, Bridge und Sonstiges.
   - Bereich fuer Zufallsvorschlaege direkt im Dokument.
   - Live-Vorschau fuer den aktuellen Songtext.
5. **Zufallsgenerator-Modul**
   - Generiert Vorschlaege aus Genres, Roots und Stil.
   - Mit Schnellwahltasten und Kategorie-Anwahl/Abwahl.
6. **Content-Planungs-Modul**
   - Monatskalender, Jahresuebersicht und Tageskapazitaeten mit Farben.
   - Aufgaben in Echtzeit eintragen und visuell darstellen.
7. **Template-Verwaltungs-Modul**
   - Textfragmente nach Titel und Kategorie speichern.
   - Import/Export und Kopieren in die Zwischenablage per Button.
8. **Debug- und Logging-Profi-Modul**
   - Detaillierte Ereignisinfos plus Loesungsvorschlaege in einfacher
     Sprache.
9. **Einstellungs- und Hilfe-Modul**
   - Version, Tool-Sprache, Standards und Manifeste zentral verwalten.

## Start (vollautomatisch)

Empfohlener Start:

```bash
bash start.sh
```

`start.sh` übernimmt automatisch:
1. Voraussetzungen prüfen
2. Fehlende Abhängigkeiten installieren
3. Code formatieren
4. Tests ausführen
5. Registry prüfen
6. Systemtest ausführen
7. Nächsten Schritt anzeigen

Bei Fehlern zeigt das System klare Aktionen:
- **Erneut versuchen**
- **Reparatur starten**
- **Protokoll öffnen**

### Fortschritt bei Bedarf sofort neu synchronisieren

```bash
node -e 'require("./tools/start_routine").syncReadmeProgressFromTodo(process.cwd())'
```

Damit wird nur der Fortschrittsblock in `README.txt` mit `todo.txt` abgeglichen.

## Mini-Leitfaden: Abschluss-Check (3 klare Schritte)

Nach jeder Iteration bitte genau diese 3 Schritte ausfuehren:

1. **Autocheck starten**

```bash
bash start.sh
```

2. **Ergebnis lesen und naechsten Schritt waehlen**
   - Bei Erfolg: Weiter mit dem naechsten offenen Punkt in `todo.txt`.
   - Bei Fehler: Erst die klare Meldung lesen (z. B. „Erneut versuchen“).

3. **Bei Fehlern gezielt helfen lassen**

```bash
node tools/help_cli.js logs
node tools/help_cli.js test
```

Wenn noetig danach:
- **Erneut versuchen**: `bash start.sh`
- **Reparatur starten**: `node tools/help_cli.js repair <datei> <backup>`
- **Protokoll oeffnen**: `node tools/help_cli.js logs`

## Laienanleitung mit Befehlen

### Schritt 1: Alles automatisch starten

```bash
bash start.sh
```

### Schritt 2: Tests manuell prüfen

```bash
npm test
```

### Schritt 3: Codeformat manuell ausführen

```bash
npm run format
```

### Schritt 4: Hilfe und Logs öffnen

```bash
node tools/help_cli.js test
node tools/help_cli.js logs
```

### Schritt 5: Backup und Reparatur nutzen

```bash
node tools/help_cli.js backups store
node tools/help_cli.js repair data/store.json data/store.backup.json
```

### Schritt 6: Plugin-Loader schnell prüfen

```bash
node -e 'console.log(require("./system-core/plugin_loader").runPluginLoaderHealthCheck({manifestPath:"config/manifests/plugins.manifest.json",projectRoot:process.cwd()}).message)'
```

## Qualitätsstandard

- Jede Funktion prüft Input (Eingabe).
- Jede Funktion prüft Output (Ergebnis).
- Fehlertexte sind klar und geben den nächsten Schritt.
- JSON-Schreiben bleibt robust und versioniert.
- Kernbereiche werden mit Manifesten validiert.

## Barrierefreiheit und Sichtbarkeit

- Tastatur zuerst: Tab, Enter/Space, Escape.
- Fokus sichtbar und nicht verdeckt.
- Status nie nur über Farbe, immer auch über Text.
- Hoher Kontrast in allen Themes.

Verfügbare Themes:
- Hell
- Dunkel
- Kontrast+
- Rötlich
- Camouflage

Tipp fuer Sehschwaeche:
1) Starte mit **Kontrast+**.
2) Nutze bei langen Sitzungen **Rötlich** oder **Camouflage**.
3) Zoom im Browser auf 110-125% stellen.
4) Bei Unsicherheit zuerst Status-Text lesen, dann klicken.

## Debugging und Logging

Wenn etwas nicht klappt:
1. `bash start.sh`
2. `npm test`
3. `node tools/help_cli.js logs`
4. Reparieren und erneut prüfen

Log-Ziele:
- einfache Erklärung für Laien
- technische Details für Entwicklung

## Iterations-Doku (Pflicht je Runde)

In jeder Iteration werden diese 4 Dateien kurz gepflegt:
1. `CHANGELOG.md` (was wurde geaendert?)
2. `SELFINFO.md` (aktuelle Iteration + naechster Schritt)
3. `README.txt` (Fortschritt, offene Punkte, klare Befehle)
4. `todo.txt` (erledigt abhaken, naechsten Mini-Punkt planen)

Danach folgt Pflichtschritt 5: `bash start.sh` als autonomer Abschluss-Check.
Nur bei gruenem Lauf gilt die Iteration als fertig.

Warum? So bleiben Status, Hilfe und Einstieg immer synchron.

## Wichtige Dateien

- Entwicklerdoku: `docs/ENTWICKLERDOKU.md`
- Hilfe: `docs/HILFE.md`
- Offene Fragen: `QUESTIONS_TODO.md`
- Verlauf: `CHANGELOG.md`
- Laufende Aufgaben: `todo.txt`

## Weiterführende Laienvorschläge

1. Immer zuerst `bash start.sh` nutzen.
2. Fehlermeldung komplett lesen.
3. Erst Logs öffnen, dann reparieren.
4. Für Lesbarkeit Theme „Kontrast+“ wählen.
5. Nach jeder Reparatur sofort neu testen.


## Modernes, modulares Layout (neu)

Das Dashboard wurde klar gruppiert:
- **Topbar:** schnelle Aktionen (Nächster Schritt, Laien-Tipp, Debug).
- **Geführte Hilfe:** Schrittliste mit einfacher Sprache.
- **Systemsteuerung:** Theme, Ordnerwahl, Auto-Reconnect.
- **Modulfläche:** aktive Module getrennt vom Katalog.
- **Hilfe-Aktionen:** feste Buttons für *Erneut versuchen*, *Reparatur starten* und *Protokoll öffnen*.

Warum das wichtig ist:
- weniger Suchaufwand,
- klarere Reihenfolge,
- bessere Bedienung für Einsteiger,
- konsistente Fehlerwege mit nächstem Schritt.

## Laienbedienung maximal perfektionieren (Best Practices)

1. Immer in Schritten arbeiten: wählen → prüfen → dann weiter.
2. Nie nur auf Farbe verlassen, immer auch den Text lesen.
3. Bei Fehlern immer dieselben 3 Aktionen nutzen:
   - Erneut versuchen
   - Reparatur starten
   - Protokoll öffnen
4. Theme passend wählen:
   - Hell = Standard
   - Dunkel = augenschonend
   - Kontrast+ = maximale Lesbarkeit
5. Debug nur einschalten, wenn etwas unklar ist.
6. Nach Änderungen immer automatisch testen lassen.

## Design- und Layout-Verbesserungen (konkret)

- klare Kartenstruktur mit eindeutigen Überschriften,
- geführte Hilfeliste direkt im Zentrum,
- gleiches Button-Verhalten in allen Bereichen,
- Fokus sichtbar für Tastaturbedienung,
- konsistente Abstände und Textgrößen,
- modulare Blöcke: leichter erweiterbar und wartbar.


Zusatzbefehl fuer sichere Format-Pruefung:
- `npm run format:check`

- Neues Update: Release-Check prueft jetzt auch zentrale Hilfe-Texte und 44px/Fokus-Basics automatisch; Mockup erhielt denselben Theme-Tipp mit Rueckweg.


Update 2026-03-01 (Iteration 29): Die Start-Routine hat jetzt einen Pflicht-Check fuer Platzhalter-Scan (TODO/FIXME/PLACEHOLDER/DUMMY) mit klarer Fundstelle und naechstem Schritt.
Naechster Schritt: Option A weiterfuehren und Boot-View (Phasen/Ampel/Details) stabilisieren.

Update 2026-03-01 (Iteration 32): AGENTS.md praezisiert jetzt releasefertige Patches (Implementierung + Fehlerpfad + Test + Doku + Startcheck) und fordert sichtbaren Dateistatus per Name oder `data/file_status_index.json`.

Update 2026-03-01 (Iteration 37): Plugin-Loader wurde weiter gehaertet: doppelte IDs werden blockiert und Modulpfade ausserhalb des Projektordners werden mit klarer Meldung abgewiesen.
Naechster Schritt: Option C weiterfuehren und Backup-Auswahl-Dialog an den JSON-Store-Backup-Hook anbinden.


Update Iteration 44:
- Todo-Listen-Modul (Kalender + Archiv) ist im Dashboard aktiv.
- Backup-Wiederherstellung nutzt jetzt eine klare Ziel-Datei-Auswahl im Dialog.
- Naechster Schritt: Persistente Todo-Speicherung vorbereiten.

## Iteration 45 Update
- Todo-Eintraege bleiben jetzt nach Neustart erhalten, wenn ein Projektordner verbunden ist.
- Speicherung erfolgt optional in `data/store.json` (aktive + archivierte Aufgaben).
- Naechster Schritt: Filter (heute/offen/archiv) und Shortcuts fuer schnellere Bedienung.


## Iteration 47 Kurzstand
- Restore-Flow erkennt Ziel-Datei jetzt automatisch aus `.backup.json` und verlangt eine Sicherheitsbestaetigung vor dem Schreiben.
- Fehlerweg bleibt laienfreundlich mit naechstem Schritt: erneut versuchen, Reparatur starten oder Protokoll oeffnen.


## Status – aktuelle Iteration
- Neu: Backup-Dialog Ende-zu-Ende-Test ist automatisiert abgeschlossen (Hook-Log -> Restore-Plan -> Restore).
- Naechster Schritt: Prompt-Sicherheitsabfrage im Dialog automatisiert pruefen.


## Iteration 49 Kurzstand
- Prompt-Sicherheitsabfrage im Backup-Dialog ist jetzt automatisch getestet (korrekte Bestaetigung erlaubt, falsche Eingabe blockiert).
- Naechster Schritt: Boot-View mit klaren Startphasen und Ampel-Texten stabilisieren.

## Update 2026-03-01 (Iteration 55): Kanban-Zustand bleibt nach Neustart erhalten

Was wurde verbessert:
- Karten werden nach dem Verschieben direkt in `data/kanban_board.json` gespeichert.
- Vor dem Speichern laeuft Validierung (Eingabepruefung), damit nur gueltige JSON-Daten geschrieben werden.
- Der Dialog bleibt der barrierefreie Standard (Tastatur zuerst, Enter/Escape, klarer Rueckweg).

Naechster Schritt:
- Optionales Drag-and-Drop als Zusatz anbieten, aber nie als einzigen Weg.


## Patch 058 (2026-03-01)
- Zwei offene Punkte abgeschlossen: Kanban-Persistenz zentralisiert und Daten-Inventur-Check automatisiert.
- Naechster Schritt: Wiki-Modul-Grundgeruest mit Eingabepruefung umsetzen.
