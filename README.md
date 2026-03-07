# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 68
- Offene Punkte: siehe `todo.txt`
- Fortschritt: 97% (laufend, siehe `todo.txt`)

## Aktuelle Toolstruktur und Toolumfang
- Kernstart:
  - `index.html`
  - `css/app.css`
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
- Modul-Einzelstarts (ohne Haupttool):
  - `datenbank_baukasten_start.html`
  - `todo_kalender_erinnerung_start.html`
  - `wiki_notiz_wissen_start.html`
- Adapter-Layer:
  - `js/adapters/filesystem-adapter.js`
  - `js/adapters/browser-filesystem.js`
  - `js/adapters/desktop-filesystem.js`
- Services:
  - `js/services/config-loader.js`
  - `js/services/startup-check.js`
  - `js/services/project-selftest.js`
  - `js/services/logger.js`
  - `js/services/module-registry.js` (Modul- und Vorlagenstatus)
  - `js/services/profile-archive.js` (Profil-Archiv)
  - `js/services/ui-action-handlers.js` (UI-Aktionen zentral gebündelt)
- Module (aktuell registriert):
  - `modules/datenbank_baukasten`
  - `modules/todo_kalender_erinnerung`
  - `modules/wiki_notiz_wissen`
  - `js/services/diagnosis-export.js` (Diagnose-Export als eigener Service)
  - `js/services/templates-archive.js` (Templates-Archiv mit Favoriten)
- Zentrale Daten:
  - `data/app-config.json`
  - `data/themes.json`
  - `data/ui_texts.json`
  - `data/project-structure.json`
  - `data/profile-archive.json` (JSON-Archiv für Profile)
  - `data/templates-archive.json` (JSON-Archiv für Templates)
  - `data/module-registry.json` (zentrale Modul-IDs)
  - `data/dashboard3-notes/` (einzeilige Dashboard-3-Notizen als Textdateien je Titel)

- Tests:
  - `tests/services/ui-action-handlers.smoke.test.js` (kleiner Smoke-Test für Export/Import/Mix)

## Erledigte Kernpunkte
- Neues Profil-Modul für Genres, Stimmungen und Stile im Hauptbereich ergänzt.
- Profilbasiertes Speichern (HardTechno, Chill, Hörspiele) mit JSON-Persistenz ergänzt.
- Duplikatprüfung für Eingabe und Import/Normalisierung ergänzt.
- Enter als Bestätigung plus Speichern-Buttons ergänzt.
- Bearbeiten, Löschen und Sortieren (alphabetisch / Erstellzeit) ergänzt.
- Import/Export als JSON-Textbereich ergänzt.
- Statistik je Kategorie plus Gesamtmenge ergänzt.
- Zufallsmix-Generator mit Bereichs-Auswahl, Mengenfeldern und Schnellbuttons ergänzt.
- Mix-Ausgabe wird automatisch in Zwischenablage kopiert (wenn Browser erlaubt) und geloggt.
- Klare Trennung in UI, State, Adapter, Services, Daten.
- Startreihenfolge fest eingebaut: Config -> Theme -> Adapter -> Startup-Check -> UI.
- Selbsttest als erster Kernschritt umgesetzt.
- Projektstruktur-Regeln zentral in `data/project-structure.json`.
- Einheitliche Adapter-API mit Standardantwort (`ok`, `code`, `message`, `data`).
- Fünf Themes als Tokens und zentrale UI-Texte aus JSON.
- Statuspanel und Logpanel für laienfreundliche Sicht.
- Letzter gewählter Ordnername wird lokal gemerkt und beim Start angezeigt.
- Neue Tool-Optik als Standard aktiviert (Größen, Raster, Karten-Look).
- Vollautomatische Text-Formatierung für Checks, Logs und Start-Hinweise ergänzt.
- Lesbarkeit in Check- und Log-Karten gezielt verbessert (Zeilenfluss, Umbruch, Zeitspalten).
- Statussymbole ergänzt: Ampelstatus zeigt jetzt zusätzlich ✔ / ⚠ / ✖ für klare Erkennung bei schwachem Kontrast.
- Statusbereich Lesen/Schreiben/Struktur nutzt jetzt ebenfalls einheitlich ✔ / ⚠ / ✖.
- Status-Visuals wurden in `js/status-visuals.js` ausgelagert, damit weitere UI-Teile dieselbe Ampel-Logik nutzen können.
- Layout und Kartenoptik wurden näher an die Vorlagenstruktur angepasst (Titelband, linke Leiste, großes Rasterfeld, rechte Statuskachel, Segment-Fußleiste).
- Standardprofil wird jetzt beim Start und beim Archivladen klar gesetzt, damit kein verstecktes Profil `undefined` entstehen kann.
- Optionaler Diagnose-Export als JSON ergänzt (inklusive Status, Selbsttest, Profil-Statistik und letzter Meldungen).
- Modernere UI mit ruhigerem Farbsystem, klareren Karten und besserem Kontrast ergänzt.
- Nutzerführung verbessert durch klarere Fokus- und Hover-Zustände bei Schaltflächen und Eingabefeldern.
- 3x3 Panel-Grid im Mittelbereich mit Fensterkarten und Maximize-Funktion ergänzt.
- Grid-Start jetzt vereinfacht: nur ein Todo-Listenmodul aktiv; Modulfenster nutzen einheitlich Maximieren/Minimieren/Ausblenden als Standard.
- Footer ist jetzt kompakter und in vier gleich große Bereiche aufgeteilt.
- Todo-Startliste speichert jetzt optional in `localStorage`, damit Aufgaben nach Reload bleiben.
- Bei ausgeblendeten Modulen zeigt eine Leiste jetzt direkte „wieder einblenden“-Buttons.
- Linke und rechte Seitenleiste sind jetzt ein- und ausklappbar, damit mehr Platz für Module entsteht.
- Modul-Registry-Check ergänzt: Das Dashboard zeigt jetzt direkt, wie viele Module vollständig verbunden sind (z. B. 2/2).
- Vorlagen-Design-Status ergänzt: Das Dashboard zeigt jetzt klar, dass die Asset-Vorlage aktuell nicht eingebunden ist.
- Robuste, inhaltliche Modulprüfung ergänzt: Zusätzlich zur Dateiprüfung werden jetzt Manifest- und JSON-Grundfelder geprüft.
- Zentrale Modul-IDs ergänzt: Neue Module werden über `data/module-registry.json` erkannt (ohne Codeänderung).
- Laienhilfe ergänzt: Häufige Fehltexte liefern jetzt kurze „So beheben“-Hinweise.

- Camouflage-Farbschema ergänzt: jetzt mittlere Helligkeit zwischen Hell und Dunkel mit ruhigerem Kontrast.
- Linke Sidebar zeigt jetzt nur aktive Nutzer-Module als kompakte 2-Spalten-Buttons; Einstellungen, Tests und Stabilitätsinfos sind rechts gebündelt.
- UI-Aktionsverdrahtung aus `js/app.js` in `js/services/ui-action-handlers.js` ausgelagert, damit der App-Einstieg klarer und wartbarer bleibt.
- To-do-Modul fachlich erweitert: Aufgabenstruktur, Statusfluss (offen/erledigt), Filterlogik und JSON/CSV-Exportgrundlage ergänzt.
- Default-Profilbestand erweitert: Die drei Profile enthalten jetzt je breite, klar unterscheidbare Genre-/Mood-/Stil-Listen inklusive regionaler und Underground-Beispiele; zusätzlich ist ein professionell kategorisiertes Templates-Default-Archiv mit 9 Bereichen und je 5 Starter-Einträgen integriert.
- Diagnose-Export aus `js/app.js` in `js/services/diagnosis-export.js` ausgelagert, damit `app.js` schlanker bleibt.
- Neues Templates-Modul ergänzt: persistente Vorlagen mit Kategorie, Bearbeiten/Löschen, Favoriten und Schnellwahl-Kopieren.
- Dashboard 3 erweitert: drei einzeilige Eingabebereiche mit editierbarem Titel, Speichern per Button oder Enter, Dateiablage pro Titel unter `data/dashboard3-notes`, Anfügen statt Überschreiben und direktes Nutzerfeedback inklusive Existenzprüfung.
- Dashboard 3 nutzerfreundlich erweitert: pro Zeile gibt es jetzt **Datei öffnen** (öffnet die zuletzt gespeicherte Zeilen-Datei direkt im Editor) plus sichtbaren Titel-Hinweis per Tooltip („Ungültige Zeichen werden ersetzt“).
- Dashboard 3 weiter verbessert: **Datei öffnen** ist je Zeile erst aktiv, wenn bereits gespeichert wurde; zusätzlich wird je Zeile die zuletzt genutzte Datei angezeigt.
- Dashboard kompakter und kontrastreicher verbessert: bessere Ein-Bildschirm-Nutzung und proportionale Gesamtskalierung mit **Strg + Mausrad** (Reset mit **Strg + 0**).
- Kopier-Feedback im Templates-Modul ergänzt: Meldung wird kurz angezeigt und verschwindet automatisch.
- Kleiner Service-Smoke-Test für Export/Import/Mix ergänzt, damit UI-Änderungen schneller geprüft werden können.
- Genres-Bereich nutzerfreundlich optimiert: Listen bleiben jetzt in fester Kartenhöhe mit Scrollbar statt Modul-Vergrößerung; zusätzlich klarere Farbflächen und modernere Kartenoptik im Profil-Archiv.

- Neues Wiki-, Notiz- und Wissensmodul als strukturierte Modulbasis ergänzt (CRUD, Suche/Filter, Verknüpfungen, Export).
- Module jetzt einzeln startbar: Für jedes Modul gibt es eine eigene Startdatei im Hauptordner, nutzbar ohne Haupttool.
- Unsichtbare Live-Statuszeile ergänzt (Screenreader-freundlich): Start, Gesamtstatus und letzte Meldung werden als gesprochene Kurzzusammenfassung bereitgestellt.
- Skip-Link ergänzt: Mit Tastatur kann direkt zum Hauptinhalt gesprungen werden.
- Ruhiger Screenreader-Modus ergänzt: Statusmeldungen werden bewusst kompakter gesprochen.
- Neues Textdatei-Vorschau- und Editor-Modul ergänzt: Dateiliste je Pfad, Vorschau und Speichern im Editor.

## Offene Punkte
- Siehe `todo.txt` für den aktuellen, priorisierten Stand.

## Laien-Befehle
- Dashboard-3-Eintrag speichern: Titel und Eintrag in einer Zeile setzen, dann **Enter** oder **Speichern**.
- Zielordner prüfen: Dateien liegen in `data/dashboard3-notes` und werden je Titel fortgeführt.
- Zuletzt gespeicherte Zeile direkt öffnen: Im Dashboard 3 bei der passenden Zeile auf **Datei öffnen** klicken.
- Erste Nutzung erkennen: **Datei öffnen** bleibt deaktiviert, bis in der Zeile mindestens einmal gespeichert wurde.
 unten
- Status prüfen: `git status`
- Änderungen sehen: `git diff --stat`
- Projektdateien auflisten: `find . -path './.git' -prune -o -type f -print | sort`
- Letzte Commits: `git log --oneline -n 5`

## Kurze Empfehlungsliste
- Bei vielen Modulen zuerst Seitenleisten einklappen, dann im 3x3-Raster arbeiten.
- Erst immer „Ordner wählen“, dann „Selbsttest starten“.
- Danach das Profil oben im Archiv wählen und Einträge je Bereich ergänzen.
- Für schnellen Mix zuerst Schnellbutton (1/3/5) klicken, dann Ergebnis nutzen.
- Empfehlung 1: Vor großem Import erst Export machen (Backup als JSON).
- Empfehlung 2: Bei vielen Einträgen Sortierung auf „Alphabetisch“ lassen.
- Empfehlung 3: Für Vorlagen-Look die Fensterbreite möglichst über 1200 px halten.
- Empfehlung 4: Wenn die Fußleiste zu voll wirkt, erst über „Selbsttest starten“ neue klare Log-Einträge erzeugen.
- Empfehlung 5: Vor dem ersten Speichern kurz prüfen, ob oben im Archiv ein Profil ausgewählt ist.
- Empfehlung 6: Für Wissenseinträge klare Themennamen und kurze Quellenangabe nutzen, damit Suche schneller trifft.
- Empfehlung 7: Bei Screenreader-Nutzung nach Aktionen kurz warten: die neue Live-Statuszeile liest Start, Gesamtstatus und letzte Meldung automatisch vor.
- Empfehlung 8: Für Dateivorschau zuerst einen relativen Pfad testen (oder leer lassen), danach bei Bedarf „auch andere Dateien zeigen“ aktivieren.
- Empfehlung 9: Bei langen Genre-Listen einfach im jeweiligen Bereich scrollen; das Modul bleibt gleich groß und übersichtlich.
- Empfehlung 10: Im Dashboard 3 nach dem Speichern direkt **Datei öffnen** nutzen, um ohne Umweg im Editor weiterzuarbeiten.
- Empfehlung 11: Bei mehreren Zeilen auf „Letzte Datei“ achten, um die richtige Zeile schnell wiederzufinden.

## Iterationsprotokoll (kompakt)
- Patchgrund 1: Nutzerwunsch nach persistentem Profil-Archiv inkl. Duplikatprüfung und Bearbeitung.
- Patchgrund 2: Nutzerwunsch nach Zufallsmix, Mengensteuerung, Auto-Copy und Logging.
- Betroffene Dateien: `index.html`, `css/app.css`, `js/app.js`, `js/ui.js`, `js/state.js`, `js/services/profile-archive.js`, `data/project-structure.json`, `data/profile-archive.json`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS/JSON-Syntax und direkt betroffene UI-Ausgabe geprüft.
- Patchgrund 1: Einheitliches Muster für Statussymbole auch bei Lesen/Schreiben/Struktur.
- Patchgrund 2: Wartbarkeit verbessert durch Auslagerung der Status-Visuals in eine kleine Hilfsdatei.
- Betroffene Dateien: `js/ui.js`, `js/status-visuals.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene UI-Ausgabe geprüft.
- Patchgrund 1: Nutzerwunsch nach stärkerer Übereinstimmung mit der Design-Vorlage (Layout, Darstellung, Struktur).
- Patchgrund 2: Nutzerfreundlichkeit verbessert durch klarere Kachelbereiche und visuell getrennte Aktionszonen.
- Betroffene Dateien: `index.html`, `css/app.css`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur direkt betroffene HTML/CSS-Ausgabe sowie relevante Syntax geprüft.
- Patchgrund 1: Robustheit im Profil-Archiv verbessert, damit Aktionen nie in ein implizites `undefined`-Profil schreiben.
- Patchgrund 2: Nutzerführung verbessert durch klaren Profil-Standardwert im App-Start.
- Betroffene Dateien: `js/app.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Profil-Logik geprüft.
- Patchgrund 1: Rechteanzeige bei `nur lesen` klarer gemacht, damit der Status ohne Rückfrage verständlich bleibt.
- Patchgrund 2: Hilfe für Laien erweitert, damit die neue Anzeige direkt geprüft werden kann.
- Betroffene Dateien: `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Status-Ausgabe geprüft.
- Patchgrund 1: Letzten offenen Punkt abgeschlossen: optionaler Diagnose-Export als eigene Aktion ergänzt.
- Patchgrund 2: Nutzerhilfe erweitert, damit Diagnose-JSON direkt erzeugt und geprüft werden kann.
- Betroffene Dateien: `index.html`, `js/app.js`, `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/JS-Syntax sowie direkt betroffene Ausgabe geprüft.

- Patchgrund 1: Nutzerwunsch nach modernem, übersichtlichem Layout bei gleicher Funktion.
- Patchgrund 2: Nutzerfreundlichkeit verbessert durch klarere Kontraste, Fokusrahmen und Hover-Feedback.
- Betroffene Dateien: `css/app.css`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene CSS-Syntax und direkt betroffene UI-Ausgabe geprüft.

- Patchgrund 1: Konkrete Nutzerforderung nach neuem Layout mit 3x3-Modulraster und ein/ausklappbaren Seitenleisten.
- Patchgrund 2: Nutzbarkeit verbessert durch Fensterkarten mit Standardoptionen und Maximize auf Toolgröße.
- Betroffene Dateien: `index.html`, `css/app.css`, `js/ui.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/CSS/JS-Syntax und direkt betroffene UI-Ausgabe geprüft.

- Patchgrund 1: Ursache für „Module funktionieren nicht“ sichtbar machen (fehlende Laufzeit-Verdrahtung war bisher nicht transparent).
- Patchgrund 2: Ursache für „Vorlagen-Design nicht umgesetzt“ im UI klar erklären (Assets existieren, sind aber nicht eingebunden).
- Betroffene Dateien: `js/services/module-registry.js`, `js/app.js`, `js/state.js`, `js/ui.js`, `index.html`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/JS-Syntax und direkt betroffene UI-Ausgabe geprüft.
- Patchgrund 1: Modulstatus robuster gemacht, damit nicht nur Dateiexistenz, sondern auch inhaltlich valide JSON/Manifest-Felder geprüft werden.
- Patchgrund 2: Laientaugliche Fehlersicht verbessert durch klare Kurzmeldung je defektem Modul.
- Betroffene Dateien: `js/services/module-registry.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Status-Ausgabe geprüft.
- Patchgrund 1: Modul-IDs aus zentraler JSON-Datei laden, damit neue Module ohne Codeänderung validiert werden.
- Patchgrund 2: Laientaugliche Fehlerhilfe je häufigem Fehlertext direkt in die Statusmeldung ergänzen.
- Betroffene Dateien: `data/module-registry.json`, `js/services/module-registry.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JSON/JS-Syntax und direkt betroffene Status-Ausgabe geprüft.

- Patchgrund 1: Nutzerwunsch nach Camouflage-Farben zwischen Hell und Dunkel im gesamten Layout.
- Patchgrund 2: Nutzerführung verbessert durch ruhigere Kontraste in Karten, Header und Hintergrund.
- Betroffene Dateien: `css/app.css`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene CSS-Syntax und direkt betroffene UI-Ausgabe geprüft.

- Patchgrund 1: Entwicklungseffizienz verbessert durch kleinere Verantwortungsbereiche in der Aktionsverdrahtung.
- Patchgrund 2: Modularisierung verbessert durch neuen Service `ui-action-handlers` statt großer Inline-Handler in `app.js`.
- Betroffene Dateien: `js/app.js`, `js/services/ui-action-handlers.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax und direkt betroffene Aktionsausgabe geprüft.

- Patchgrund 1: Nutzerwunsch nach einem strukturierten Wiki-, Notiz- und Wissensmodul als internes Nachschlagewerk.
- Patchgrund 2: Robustheit verbessert durch klare Feldvalidierung, Suche/Filter und sichere Verknüpfungs-/Exportlogik.
- Betroffene Dateien: `modules/wiki_notiz_wissen/manifest.json`, `modules/wiki_notiz_wissen/config.json`, `modules/wiki_notiz_wissen/schema.json`, `modules/wiki_notiz_wissen/texts.json`, `modules/wiki_notiz_wissen/logic.js`, `data/module-registry.json`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JSON/JS-Syntax und direkte Modul-Logik (CRUD, Suche, Link, Export) geprüft.
- Patchgrund 1: Nutzerwunsch umgesetzt, damit ein sofort nutzbares Default-Profil mit breitem Spektrum (Genres, Moods, Stile) projektseitig mitgeliefert wird.
- Patchgrund 2: Neues Templates-Default-Archiv mit 9 Fachbereichen und je 5 professionell strukturierten Einträgen ergänzt, um Iterationen direkt praxisnah zu starten.
- Betroffene Dateien: `js/services/profile-archive.js`, `data/profile-archive.json`, `data/project-structure.json`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS/JSON-Syntax und direkt betroffene Datenstruktur geprüft.
- Patchgrund 1: App-Einstieg weiter entschlacken durch Auslagerung von `buildDiagnosisExport` in einen eigenen Service.
- Patchgrund 2: Neues Templates-Modul für persistente Textbausteine/Promptvorlagen mit Favoriten-Schnellwahl und Copy-Feedback.
- Betroffene Dateien: `js/app.js`, `js/services/diagnosis-export.js`, `js/services/templates-archive.js`, `js/services/ui-action-handlers.js`, `js/ui.js`, `js/state.js`, `index.html`, `css/app.css`, `data/templates-archive.json`, `tests/services/ui-action-handlers.smoke.test.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS-Syntax, direkt betroffene Service-Logik und der kleine Smoke-Test ausgeführt.

- Patchgrund 1: Genres-/Archiv-Listen sollen bei vielen Einträgen scrollbar bleiben, statt die Modulhöhe zu vergrößern.
- Patchgrund 2: Nutzerwunsch nach moderner, laienfreundlicher Optik mit klarerer Bereichstrennung und ruhiger Farbdarstellung im Archiv.
- Betroffene Dateien: `css/app.css`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene CSS-Syntax und direkt betroffene Archiv-Darstellung geprüft.

- Patchgrund 1: Nutzerworkflow verbessert, damit je Textsammler-Zeile die zuletzt gespeicherte Datei direkt im bestehenden Editor geöffnet werden kann.
- Patchgrund 2: Laienhinweis ergänzt, damit Dateinamen-Ersetzung bei ungültigen Zeichen direkt am Titelfeld sichtbar ist.
- Betroffene Dateien: `index.html`, `css/app.css`, `js/state.js`, `js/ui.js`, `js/services/ui-action-handlers.js`, `tests/services/ui-action-handlers.smoke.test.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/CSS/JS-Syntax, direkt betroffene Dashboard-3-Ausgabe und der Smoke-Test geprüft.

- Patchgrund 1: Erstnutzerführung verbessert, damit „Datei öffnen“ ohne gespeicherte Datei klar deaktiviert bleibt.
- Patchgrund 2: Transparenz erhöht, damit je Zeile die zuletzt genutzte Datei direkt sichtbar ist.
- Betroffene Dateien: `index.html`, `js/ui.js`, `js/services/ui-action-handlers.js`, `tests/services/ui-action-handlers.smoke.test.js`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene HTML/JS-Syntax, direkt betroffene Dashboard-3-Ausgabe und der Smoke-Test geprüft.

- Patchgrund 1: Nutzerwunsch umgesetzt, damit jedes Modul über eine `modulname_startdatei` im Hauptordner direkt einzeln nutzbar ist.
- Patchgrund 2: Robustheit für Einzelstart ergänzt durch Export im Datenbank-Modul.
- Betroffene Dateien: `modules/datenbank_baukasten/logic.js`, `datenbank_baukasten_start.html`, `todo_kalender_erinnerung_start.html`, `wiki_notiz_wissen_start.html`, `README.md`, `TOOL_TUTORIAL.md`, `INDEX.md`.
- Endvalidierung: nur betroffene JS/HTML-Syntax sowie direkte Modul-Einzelstarts geprüft.
