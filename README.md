# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Projektstatus kompakt

- Offene Code-Stellen: 0
- Erledigte Code-Stellen: 0
- Offene Upgrade-Empfehlungen: 2
- Erledigte Upgrade-Empfehlungen: 48
- Default-Archive: 3
- Letzte Iteration: 049
- Scan-Modus: delta
## Iterations-Update 049 (Mini-Patch)

- Neu: Fünf offene Upgrade-Pool-Aufgaben (UP-019, UP-021, UP-024, UP-048, UP-049) als lokales Minimal-Delta abgeschlossen.
- Robustheit: Start-Assistent liefert bei Blockaden jetzt zusätzlich einen Alternativpfad; Datenqualität-Check meldet ungültige Zeitstempel defensiv als Warnung statt stiller Ignorierung.
- UX: Plugin-Verwaltung ist zwischen Footer und rechter Seitenleiste umschaltbar, Header-Hinweis nennt bei fehlender Historie klar „keine verwertbaren Daten“.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Release-Check: Assistent-Alternative + Datenqualität“ erweitert.
- Nachtrag: Header-Renderer nutzt jetzt zentrale Event-Normalisierung und defensive Fallbacks für optionale Helfer (`byId`, `autoFormatText`).

## Iterations-Update 048 (Mini-Patch)

- Neu: Header-Trend behandelt jetzt ungültige Archiv-Zeitstempel als klaren Fallback statt als missverständlichen Vorwochenvergleich.
- Robustheit: Bei rein ungültigen Zeitstempeln zeigt die Statistik defensiv „0 (keine gültigen Zeitstempel)" und bleibt absturzfrei.
- UX: Der Hinweistext bleibt in diesem Fall eindeutig bei „Vergleich nicht verfügbar“, wodurch Fehlinterpretationen reduziert werden.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Header-Trend mit ungültigen Zeitstempeln prüfen“ erweitert.

## Iterations-Update 047 (Mini-Patch)

- Neu: Zehn offene Upgrade-Pool-Empfehlungen lokal abgeschlossen und in den Erledigt-Bereich verschoben.
- Robustheit: Header-Feedback blendet sich nach 3 Sekunden zurück auf Grundzustand aus; dynamische Mindesthöhe für den Hauptbereich stabilisiert kleine Fensterhöhen.
- UX: Deaktivierte Aktionsfelder liefern direkte Tooltip-Gründe, Sidebar-Schalter zeigen die Ursache per Tooltip und aktiver Modulkontext wird klarer rückgemeldet.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Header-Hinweise kurz gegenprüfen“ erweitert.

## Iterations-Update 046 (Mini-Patch)

- Neu: Alle 7 offenen Layout-Aufgaben aus `todo.txt` als gezielter Minimal-Patch abgeschlossen.
- Robustheit: Fenstermodus verhindert Overlay-Maximierung und hält Module parallel im Grid mit klaren Aktiv/Inaktiv-Zuständen.
- UX: Statuswerte umbrechen jetzt sauber in Chips, Footer-Infobereich ist höher und Farbsemantik in Statusbereichen konsistenter.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Fenstermodus-Rasterfokus prüfen“ erweitert.

## Iterations-Update 045 (Mini-Patch)

- Neu: Zehn offene TODO-Aufgaben mit lokalem UI-Patch abgeschlossen (Modus-Trennung, Panel-Verhalten, Toolbar-Aufteilung, Titelabsetzung).
- Robustheit: Fenstermaximierung bleibt jetzt im Grid-Kontext statt als globales Fixed-Overlay, inklusive defensivem Modus-Guard.
- UX: Neuer Arbeitsmodus-Schalter (`Dashboard`, `Fenstermodus`, `Expertenmodus`) und klarere Account-Toolbar für Aktionen/Suche.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Modus- und Fensterlogik schnell prüfen“ erweitert.









## Iterations-Update 044 (Mini-Patch)

- Neu: Lokaler Layout-Fix gegen Überlagerung zwischen Header, Hauptbereich und Footer bei engeren Fenstergrößen.
- Robustheit: Grid-Zeilen nutzen inhaltssichere Höhen statt harter Max-Anteile; Hauptbereich hat keine kollisionsfördernde Mindestbreite mehr.
- UX: Bessere Lesbarkeit ohne überdeckte Bereiche in typischen Laptop-/Splitscreen-Szenarien.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Layout-Überlagerung schnell prüfen“ erweitert.

## Iterations-Update 043 (Mini-Patch)

- Neu: Zehn offene Layout-/UX-Punkte aus `todo.txt` mit einem lokalen HTML/CSS-Patch abgeschlossen.
- Robustheit: Hauptbereiche haben nun klare Min-/Max-Breiten und stabilere Abschnittsgrenzen gegen Layoutbruch.
- UX: Linke Leiste wurde in klare Funktionszonen gegliedert und ein sichtbarer 3-Schritt-Startworkflow im Hauptbereich ergänzt.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Layout-043 Schnellprüfung (10 offene Punkte)“ erweitert.

## Iterations-Update 042 (Mini-Patch)

- Neu: `todo.txt` nach Priorität geschärft und zehn offene Layout-Punkte mit kleinem CSS/HTML-Delta abgeschlossen.
- Robustheit: Account-Archiv und Grid-Bereich wurden lokal gegen Overflow-X bzw. unnötige Scrollleisten abgesichert.
- UX: Todo-Modul stärker gewichtet, Aufgabenliste klarer kontrastiert und Abstände/Überschriften konsistenter gestuft.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Layout-042 Schnellprüfung (10 Punkte)“ erweitert.

## Iterations-Update 041 (Mini-Patch)

- Neu: Zehn offene Layout-/UX-Punkte aus `todo.txt` mit einem lokalen CSS/HTML-Patch abgeschlossen.
- Robustheit: Aktive Modulbereiche zeigen jetzt einen klaren Fokuszustand (`:focus-within`) und bleiben besser erkennbar.
- UX: Begriffe wurden laienfreundlicher, Warnhinweise klarer und der Hilfebereich kompakter/einklappbar.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „10er-Layout-Feinschliff schnell prüfen“ ergänzt.

## Iterations-Update 039 (Mini-Patch)

- Neu: `UP-039` umgesetzt: rechter Sidebar-Schalter zeigt bei aktivem Auto-Collapse temporär den Zusatz „(Auto)“.
- Robustheit: Auto-Collapse-Logik ist in eine kleine Sync-Hilfe gebündelt und bleibt bei fehlendem Toggle-Element defensiv stabil.
- UX: Der Auto-Zustand ist direkt im Schalter lesbar, sodass der temporäre Wechsel der rechten Leiste sofort erklärbar ist.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Rechte-Leiste Auto-Label Quickcheck“ ergänzt.

## Iterations-Update 038 (Mini-Patch)

- Neu: `UP-038` und `UP-037` als kleiner Sidebar-Patch umgesetzt (rechts auto-einklappen bei maximiertem Modul <1100px, links bei <=980px einklappbar mit sichtbarer Titelzeile).
- Robustheit: Auto-Collapse rechts wird an Maximieren/Restore/Hide/Escape/Resize defensiv synchronisiert und bleibt außerhalb der Bedingung inaktiv.
- UX: Auf kleinen Breiten reagieren beide Sidebars jetzt symmetrischer und planbarer, damit die Modulfläche bei Fokusmodus mehr Platz bekommt.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Sidebar-Auto-Collapse unter 1100px prüfen“ erweitert.

## Iterations-Update 037 (Mini-Patch)

- Neu: Zehn offene Layout-Punkte aus `todo.txt` mit kleinem CSS/Renderer-Patch abgeschlossen (Sidebar-Guard, Status-Badges, Key-Value-Statusscan, keine Modul-Overflow-X).
- Robustheit: Rechte Sidebar und Statusleisten haben Mindest-/Maximalgrenzen, damit Inhalte bei enger Breite weniger aus dem Raster laufen.
- UX: Fensterleisten und Steuer-Icons sind größer, Statusmarker kompakter und schneller erfassbar (✓/⚠).
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Layout-Quickcheck Statusleisten“ erweitert.

## Iterations-Update 036 (Mini-Patch)

- Neu: `UP-036` umgesetzt: Panel-Overlay wird nur unterhalb von `<=980px` weiter reduziert.
- Robustheit: Breakpoint-lokale Variable hält Desktop-Darstellung unverändert und begrenzt Seiteneffekte.
- UX: Panelinhalte wirken auf kleineren Breiten ruhiger und bleiben schneller lesbar.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Panel-Overlay bei 980px ruhig prüfen“ ergänzt.

## Iterations-Update 035 (Mini-Patch)

- Neu: `UP-035` umgesetzt: Modulbuttons in der linken Leiste schalten bei `<=980px` gezielt in 1 Spalte.
- Robustheit: Weniger Umbruch-/Überlaufdruck in der Sidebar auf kleinen Breiten.
- UX: Hintergrundmuster im Body deutlich reduziert, damit Inhalte ruhiger und schneller lesbar sind.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Sidebar-Kompaktmodus und ruhiger Hintergrund“ ergänzt.

## Iterations-Update 034 (Mini-Patch)

- Neu: Sechs offene Layout-Punkte aus `todo.txt` mit einem lokalen CSS-Patch geschlossen.
- Robustheit: Panel-Flächen sind opaker und Overlays zurückgenommen, wodurch Inhalte stabiler lesbar bleiben.
- UX: Linke Leiste und Modulbuttons sind besser lesbar (mehr Breite, mehr Innenabstand, sauberer Umbruch), dazu größere Mindestschrift im Hauptbereich.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Sechs Layout-Basispunkte schnell prüfen“ ergänzt.

## Iterations-Update 033 (Mini-Patch)

- Neu: `todo.txt` wieder vollständig im Checkbox-Format strukturiert und ein offener Layout-Punkt abgearbeitet (kürzere Leerzustand-Texte).
- Robustheit: Leere Slots nutzen jetzt kürzere Standardtexte mit geringerem Umbruchrisiko.
- UX: Der nächste Schritt bleibt schneller lesbar („Modul aktivieren oder Projektstruktur anlegen“).
- Archiv: Templates-Defaultarchiv um eine neue Kurzprüfung für leere Slots ergänzt.

## Iterations-Update 032 (Mini-Patch)

- Neu: Offene Release-Blocker 4/5 im TODO-Register final geschlossen und konsistent dokumentiert.
- Robustheit: Deaktivierte `btn`/`btn-small` brechen Hover/Active-Effekte jetzt zentral ab und vermeiden irreführende Interaktion.
- UX: Button-States sind über Header/Main/Widgets einheitlich, inklusive klarer Disabled-Darstellung.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Button-States einheitlich prüfen“ erweitert.

## Iterations-Update 031 (Mini-Patch)

- Neu: Sechs offene Upgrade-Punkte umgesetzt (UP-025, UP-026, UP-027, UP-029, UP-030, UP-031).
- Robustheit: Header meldet jetzt Clipping-Risiken in der Statistik-Kachel mit einem klaren Sichtbarkeits-Hinweis.
- UX: Header-Navigation gibt direkt „Bereich geöffnet“ zurück, leere Slots haben einen Direktknopf und die Selbsttest-Hilfe ist klickbar.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Header-Feedback nach Navigation kurz prüfen“ erweitert.

## Iterations-Update 030 (Mini-Patch)

- Neu: Dashboard-Statistik zeigt jetzt zusätzlich einen 7-Tage-Trend für Archiv-Meldungen (inkl. Vergleich zur Vorwoche).
- Robustheit: Trendberechnung filtert ungültige/zu alte/zukünftige Zeitstempel defensiv und fällt bei leerer Historie sicher auf „0 (keine Historie)“ zurück.
- UX: Trendwert macht Veränderungen direkt im Header sichtbar, ohne in Archivlisten wechseln zu müssen.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „7-Tage-Trend im Header prüfen“ erweitert.

## Iterations-Update 029 (Mini-Patch)

- Neu: Alle vier Header-Kacheln sind jetzt interaktiv und springen per Klick/Enter/Leertaste zu einem passenden Zielbereich.
- Robustheit: Zielnavigation nutzt einen Guard und bricht bei fehlendem Ziel sicher mit Warnlog statt Fehler ab.
- UX: Header-Karten zeigen sichtbaren Fokusrahmen und erhalten damit klare Tastaturführung.
- Archiv: Templates-Defaultarchiv um die neue Prüfvorgabe „Header-Kachel-Navigation prüfen“ erweitert.

## Iterations-Update 028 (Mini-Patch)

- Neu: Leere Modul-Slots zeigen jetzt einen konkreten nächsten Schritt statt nur „leer“.
- Robustheit: Theme-Auswahl nutzt eine defensive Schlüsselauflösung und fällt bei unbekanntem Default sicher auf einen vorhandenen Theme-Key zurück.
- UX: Platzhaltertexte in freien Panels nennen direkt zwei klare Wege (Plugin aktivieren oder Projektstruktur anlegen).
- Archiv: Templates-Defaultarchiv um „Leere Modul-Slots mit Next Step prüfen“ erweitert.

## Iterations-Update 027 (Mini-Patch)

- Neu: Neues Modul `account_archiv_modul` im 3x3-Grid mit Titelliste, Mehrprofil-Auswahl, Favoritenblock, kompakter Statistik und lokalem Detaildialog.
- Robustheit: Account-Archiv lädt jetzt mit defensiver Normalisierung und fällt bei ungültiger Titel-/Profilauswahl sicher auf gültige Einträge zurück.
- UX: Sichtbares Sofort-Suchfeld, klare Leerzustände und verständliche Rückmeldungen für Speichern/Favorisieren/Archivieren ergänzt.
- Archiv: Templates-Defaultarchiv um „Account-Archiv Schnellprüfung“ erweitert.

## Iterations-Update 026 (Mini-Patch)

- Neu: Selbsttest-Status im Header zeigt jetzt eine klare Farbampel plus kurze Legende direkt in der Statistik-Kachel.
- Robustheit: Header-Renderer setzt bei unbekanntem Status defensiv auf „offen“ mit neutraler Klasse und sicherem Hinweistext.
- UX: Bei gelb/rot/grün wird der Zustand mit kurzer Bedeutung in einfacher Sprache erklärt.
- Archiv: Templates-Defaultarchiv um eine neue Vorlage „Header-Ampel mit Kurzlegende prüfen“ ergänzt.


## Iterations-Update 025 (Mini-Patch)

- Neu: Plugin-Verwaltung in die Fußzeile verschoben, damit der Hauptbereich vollständig für das 3x3-Panel-Grid reserviert ist.
- Robustheit: Layoutbudget-Warnung nutzt jetzt Toleranz (+0,5%) und Debounce-Messung, um Resize-Spitzen ohne Fehlalarm abzufangen.
- UX: Panel-Breiten bieten jetzt zusätzlich manuelle Prozent-Schieberegler (links/rechts, Mitte automatisch), inklusive klarer Live-Werte.
- Archiv: Templates-Defaultarchiv um eine neue Vorlage zur Prüfung von Footer-Plugin + 3x3-Grid ergänzt.


## Iterations-Update 024 (Mini-Patch)

- Neu: Header zeigt jetzt dauerhaft „Layoutbudget aktiv: H15/F10/S8“ in der Layout-Steuerung.
- Robustheit: Kleine Budgetprüfung ergänzt defensive Fallback-Meldungen, falls DOM-/Viewport-Werte noch nicht stabil verfügbar sind.
- UX: Bei Budgetüberschreitung erscheint sofort ein kurzer Warnhinweis im Header.
- Archiv: Templates-Defaultarchiv um eine neue Budgetwarnungs-Prüfvorlage erweitert.


## Iterations-Update 023 (Mini-Patch)

- Neu: Einfenster-Layout jetzt mit festen Flächenbudgets (Header max. 15%, Footer max. 10%, Sidebars mit 8vw-Zielbreite) und priorisiertem Hauptbereich.
- Robustheit: Header und Footer erhalten begrenzte Höhen mit internem Overflow, damit Inhalte nicht das Hauptmodul verdrängen.
- UX: Hinweistext präzisiert, dass Vergrößerung/Verkleinerung nur proportional über Strg + Mausrad bzw. Strg + +/- erfolgt.
- Archiv: Templates-Defaultarchiv um eine neue Einfenster-Layout-Prüfvorlage ergänzt.


## Iterations-Update 022 (Mini-Patch)

- Neu: Header-Dashboard an 1280px/980px/720px lokal feinjustiert (Abstände, Umbrüche, Chip-Höhen) ohne Layout-Überlauf.
- Robustheit: Header-Chips nutzen defensives Zeilenverhalten (`overflow-wrap:anywhere`) und stabile Mindesthöhe je Grid-Zeile.
- UX: Theme-Auswahl im Header reagiert unter 980px jetzt mit voller Breite ohne abgeschnittene Auswahlfelder.
- Archiv: Templates-Defaultarchiv um eine neue Breakpoint-Check-Vorlage ergänzt.


## Iterations-Update 021 (Mini-Patch)

- Neu: Header-Dashboard in vier gleich große Bereiche gegliedert (Intro, Schnellaktionen, Steuerung, Statistik).
- UX: Schnellaktionen in den Header verschoben und kompakter strukturiert.
- Robustheit: Header-Statistik zeigt defensive Fallback-Werte auch bei fehlenden Daten.
- Archiv: Templates-Defaultarchiv um eine neue 4-Bereiche-Qualitätsvorlage ergänzt.


## Iterations-Update 020 (Mini-Patch)

- Neu: Startfehler liefern jetzt immer eine konkrete Knopf-Empfehlung (Ordner wählen, Grundcheck starten oder Struktur anlegen).
- Robustheit: `runStartupCheck` ergänzt pro Exit-Punkt ein `nextAction`-Objekt statt nur Fehlertext.
- UX: Der Start-Assistent übernimmt diese Empfehlung automatisch und zeigt klare Hilfe in einfacher Sprache.
- Tests: Startup-Check-Tests prüfen jetzt zusätzlich die empfohlenen Zielaktionen.

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `start.sh` (**Team-Standard-Einstieg**, laiengerechte Startroutine mit Selbsthilfe)
  - `index.html` (Hauptoberfläche, wird nach erfolgreichem Start automatisch geöffnet)
  - `*_start.html` (Einzelstart pro Modul)
- **Frontend**
- Neu: Header enthält jetzt eine direkte Theme-Auswahl (4 Design-Themes) und eine sichtbare Zoom-Anzeige für die Schriftgröße.
  - `css/app.css` (inkl. farbliche Hilfehinweise, Tastatur- und Drag&Drop-Stati)
  - Neu: Farbtoken für Header und Utility-Karten (kühl-blau/grau, zentral über `:root` steuerbar)
  - Neu: `DESIGN_VORLAGE.md` (tiefe Bildanalyse mit Farb- und Layout-Token als Umsetzungs-Vorlage)
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
  - Neu: Renderer-Teile unter `js/renderers/*` (`ui-header-renderer.js`, `ui-main-renderer.js`) für klar getrennte UI-Ausgabe.
  - Neu: Start-Readiness-Check in `js/app.js` als gemeinsamer Helper gebündelt (weniger doppelte Startlogik).
  - `js/modules/guide-tools-module.js` (intuitive Führung für Anleitungsliste)
  - Neu: ArrowUp/ArrowDown/Enter/Leertaste nutzen jetzt einen gemeinsamen Navigations-Helper (Auswahl + Sprung zentral).
  - Neu: kleine Vereinheitlichung im Guide-Modul (gemeinsame Helfer für Index-Auslesen und Verschieben, gleiche Funktion mit weniger Doppelcode).
  - Neu: `js/modules/plugin-manager.js` (Plugin-Auswahl, Zeichenzähler und einfache Rechtschreibprüfung DE/EN/FR mit Auto-Sprachschätzung)
- **Module und Services**
  - `js/adapters/*`, `js/services/*`, `js/modules/*`
  - Neu: `js/services/module-registry.js` gibt bei fehlenden Moduldateien präzisere Hilfe je Dateityp (z. B. `manifest.json`, `logic.js`).
  - Neu: domänenscharfe UI-Aktionsmodule unter `js/services/ui-actions/*` (Session, Archiv, Vorlagen, Workspace).
  - Neu: Dashboard-Notiz-Fehlerbehandlung in `workspace-actions` zentralisiert (weniger Doppelcode, konsistente Rückgaben).
  - Neu für sichere Listen-Ausgabe: `js/services/html-escape.js` (zentrale HTML-Zeichenkodierung)
  - Neu: `js/services/code-formatter.js` (vollautomatische, einfache Auto-Formatierung für Editor-Inhalte nach Dateityp)
  - `modules/*` (fachliche Module)
- **Daten**
  - `data/app-config.json`, `data/themes.json`, `data/ui_texts.json`
  - `data/module-registry.json`, `data/project-structure.json`
  - `data/laienstart-required-files.json` (konfigurierbare Dateiliste für den Startcheck)
  - `data/laienstart-autofix-defaults.json` (Standard-Dummy für Auto-Reparatur-Steuerung)
  - `data/laienstart-dependency-map.json` (Standard-Dummy für Abhängigkeitsauflösung)
  - `data/profile-archive.json`, `data/templates-archive.json`
- **Tests und Checks**
  - `tests/services/*.test.js` (inkl. Import-/Export-Konsistenzcheck und UI-Render-Sicherheit), `tests/modules/*.test.js`, `tests/adapters/*.test.js`, `tests/start-files/*.test.js`, `tests/scripts-laienstart.dry-run.test.js`
  - `scripts/minimal-check.sh` (kleiner reproduzierbarer Syntax-/Struktur-Schnellcheck, jetzt auch beim Service-Schnelltest Node-18-kompatibel für ES-Module)
  - `start.sh` (Hauptstart im Projektordner, delegiert an robuste Startroutine)
  - `scripts/laienstart.sh` (Startroutine-Engine mit Vorvalidierung, Self-Repair und Erfolgsvalidierung)
- **GitHub Workflows (Basis aktiv)**
  - `.github/workflows/ci.yml` (frühe Fehler durch Tests)
  - `.github/workflows/lint.yml` (frühe Syntax-/Stilfehler)
  - `.github/workflows/codeql.yml` (Sicherheitsanalyse)
  - Noch bewusst **nicht aktiv**: `dependabot.yml`, `release.yml`

## Was in dieser Iteration bereinigt wurde
- runProjectSelftest robuster gemacht: Jeder Adapter-IO-Aufruf ist jetzt per safeCall abgesichert; Laufzeitfehler liefern klare `SELFTEST_*_THREW`-Codes.
- Benennungs- und Hilfe-Regeln festgelegt: technische Codes bleiben kurz und stabil, sichtbare Checks nutzen klare laienfreundliche Namen.
- Startup-Check robuster gemacht: Adapter-Laufzeitfehler werden als klare Fehlercodes zurückgegeben, statt still abzubrechen.
- Self-Repair ergänzt: ungültige Projektstruktur wird automatisch auf sichere Defaults gesetzt und transparent im Ergebnis markiert.
- Start-Dry-Run stabilisiert: Pflichtdateien aus `data/laienstart-required-files.json` werden wieder zeilenweise ausgewertet; die frühere Sammelwarnung mit `\n` entfällt.
- Bedienung für Mausnutzer verbessert: Jedes Modul hat jetzt zusätzlich den Button „Maximierung aufheben“ direkt im Modulkopf.
- Neue Laien-Hilfe im Modulfokus: Wenn ein linkes Modul noch kein passendes Panel im Mittelbereich hat, erscheint eine kurze verständliche Hinweis-Meldung.
- Modulfluss verbessert: Klick auf ein aktives Modul in der linken Leiste blendet das passende Modul im Mittelbereich ein und holt es in den Fokus.
- Maximieren vereinfacht: Der Modul-Klick aus der Leiste setzt das gewählte Modul direkt auf groß (Maximieren) im 3x3-Bereich.
- Sicherheits- und Robustheitsfix: `item.id` wird in Template-Listen/Favoriten für `data-template-*` konsequent escaped, damit eingeschleuste Anführungszeichen keine fremden Attribute erzeugen.
- Neuer gezielter Sicherheitstest: prüft, dass eine manipulierte Template-ID (`x" onclick="...`) nur als escaped Attributwert gerendert wird.
- Barrierefreiheit verbessert: klarere Fokus-Umrandung, sichtbare Zoom-Rückmeldung und kurze Zoom-Hinweise im Footer.
- Nutzerfreundlichkeit verbessert: Theme-Auswahl direkt im Header mit vier Design-Themes aus der Vorlage.
- Schriftgröße ist jetzt stabil per Strg+Mausrad und Strg+Plus/Minus zoombar; Strg+0 setzt zurück.
- Layout verbessert: mobile Header-Steuerung ist unter 980px besser lesbar und bricht nicht.
- Guide-API vereinfacht: `navigateIndex` nutzt jetzt nur noch `mode` (statt zusätzlichem `jump`-Boolean), damit die Aufrufe einheitlich bleiben.
- Default-Archive erweitert: Genres, Moods, Styles sowie Kategorie-Archive enthalten mehr Startwerte für bessere Erstnutzung.
- Templates-Default-Archiv erweitert: `data/templates-archive.json` startet jetzt mit fünf laienfreundlichen Standardvorlagen.
- Zufallsmix ergänzt: Ergebnis enthält pro Bereich `usage.requested` und `usage.used`, damit die UI klar zeigen kann, wenn eine gewünschte Menge geklammert wurde.
- Hilfe-Optimierung mit kleinstem Eingriff: Im Guide-Modul wurden wiederkehrende Schritte (Index lesen, Eintrag nach oben/unten verschieben) in kleine gemeinsame Helper gebündelt; Verhalten bleibt gleich, Wartung wird einfacher.
- Neue Mini-Vereinheitlichung: Die Tastatur-Logik im Guide-Index nutzt jetzt ebenfalls einen gemeinsamen Navigations-Helper für Auswahl und Sprung.
- Neuer enger Regressionstest: `tests/modules/guide-tools-module.test.js` prüft gezielt den Guide-Index-Pfad (Arrow/Enter) plus Reorder-Pfad.
- Neuer gezielter Fehlerfall-Test: Adapter-Fehler bei Dashboard-Notiz-Save (Exists/Read/Write) sind als Smoke-Regression abgedeckt.
- Neuer Grenzfall-Test ergänzt: ArrowUp auf Index 0 und ArrowDown am letzten Index bleiben sauber geklammert (kein Überschwingen).
- Wiki-Modul robuster: Listen-/Leseausgaben arbeiten jetzt mit Kopien, damit externe Mutationen den Store nicht unbemerkt verändern.
- Genres-Zufallsgenerator robuster: gewünschte Anzahl wird zentral auf einen sinnvollen Bereich geklammert (mindestens 1, höchstens 20).
- Kleine Robustheits-Refaktorierung: doppelter Startup-Readiness-Block in `js/app.js` wurde in einen gemeinsamen Helper ausgelagert (gleiches Verhalten, weniger Dupplikatcode).
- Workspace-Robustheit verbessert: Dashboard-Notizen nutzen jetzt einen gemeinsamen Fehler-Helper für konsistente Rückgaben und einheitliches Feedback.
- Workspace-Robustheit ergänzt: Auch `onOpenDashboardNoteLastFileInEditor` nutzt jetzt den gemeinsamen Fehler-Helper (konsistentes Feedback + Logging).
- Für Vollmodularität wurden zwei offene, klar messbare Folgeschritte in `todo.txt` ergänzt (UI-Renderer-Split und Action-Handler-Domänentrennung).
- Priorität A umgesetzt: Farbwelt über CSS-Token geschärft und Header-Mikrostruktur minimal verbessert (ohne JS-Ankeränderung).
- Rechte Spalte in Utility-Karten gegliedert; unter 980px gezielt auf Layoutbruch geprüft und stabilisiert.
- Design-Soll-Ist-Abgleich geschärft: `DESIGN_VORLAGE.md` enthält jetzt einen messbaren 7-Punkte-Check mit klaren Lücken und Prioritäten.
- Drei offene, klar abgegrenzte Design-Folgeaufgaben wurden in `todo.txt` geparkt (Farbwelt, Header-Mikrostruktur, Utility-Kartenaufteilung).
- Ergebnis: Fokus liegt jetzt auf den kleinsten, visuellen Hebeln mit hoher Wirkung, ohne stabile JS-Logik anzufassen.
- Header-Fokus-Muster minimal erweitert: Die Buttons **„Linke Leiste“** und **„Rechte Leiste“** nutzen jetzt denselben tokenbasierten Fokusstil wie die Header-Chips (ohne Strukturumbau).
- Mini-Designabgleich dokumentiert: Ein kleines Farbtoken-Cluster für Header-Aktionen wurde in `DESIGN_VORLAGE.md` gegen die Primärfarben abgeglichen.
- Offener TODO-Punkt „Modulstandard nur bei echtem Eingriff“ als eingehalten abgeschlossen, da keine `modules/*/logic.js` geändert wurden.
- Neuer Mini-Regressionstest für die Header-Chips: prüft nach `setState(...)` gezielt nur `#header-chip-project-status` und `#header-chip-autosave-status` (kein Full-UI-Test).
- Projektstatus-Texte (`Wartet`, `In Arbeit`, `Bereit`) sind jetzt zentral als kleines Mapping in `js/ui.js` gebündelt für konsistente spätere Textanpassungen.
- Header-Mini-Schritt professionell vervollständigt: Die zwei Status-Chips oben rechts werden jetzt als Live-Anzeige aus State-Daten befüllt (**Projektstatus** und **Autosave-Status**), ohne Layout-Umbau.
- Interaktions-Check ergänzt: Status-Chips haben jetzt einen kleinen, klar sichtbaren Hover-/Fokus-Zustand im Glas-Look.
- CSS-Token-Abgleich als Mini-Schritt: Header-Chips nutzen jetzt einen klareren Fokus-Ring für besseren Tastaturkontrast, ohne HTML-/JS-Ankeränderung.
- Kontrast-Feinschliff: `.startup-step--done` und `.startup-step--current` nutzen jetzt stärkere Glas-Verläufe mit besser lesbarem Text auf hellen und dunklen Displays.
- Design-Mini-Feinschliff: Die 4 Startschritte im Bereich **Schnellaktionen** sind jetzt als farbige Glas-Chips (Blau/Gold/Grün/Violett) mit klarerer Hierarchie gestaltet – näher an der Designvorlage, ohne Logikänderung.
- UI-Redesign: Dashboard jetzt im dunklen Glas-Look nahe der Designvorlage (3 Spalten, starke Kartenhierarchie, weiche Transparenz).
- Neue Vorlage-Datei `DESIGN_VORLAGE.md`: enthält Tiefenanalyse der Referenz, Token und messbare Abgleichkriterien.
- `AGENTS.md` erweitert: zusätzliche Design-Ziele und detaillierte Erfolgschecks für Struktur/Farbe/Transparenz/Responsive.
- Dashboard zeigt den Start jetzt als 4 klare Schritte (Schritt 1/4 bis 4/4) mit Farbstatus für schnelleres Verstehen.
- Neuer sicherer Logout-Button: speichert offene Editor-Änderungen automatisch und schließt ein Desktop-Backend sauber, wenn vorhanden.
- Neue Auto-Formatierung für Editor-Inhalte: JSON wird strukturiert formatiert, JS/CSS/HTML werden zeilenweise geglättet.
- `modules/datenbank_baukasten/logic.js` wurde zu einem robusten Baukasten erweitert (Blueprint erstellen, Datensatz ergänzen, Blueprint validieren).
- Neuer Hauptstart `start.sh` im Projektordner: ein Befehl für Laien ohne Pfadwissen.
- `scripts/laienstart.sh` hat jetzt eine klare Vorvalidierung (Schreibrecht, JSON-Prüfung, Pflichtdateien) und meldet jeden Schritt verständlich.
- `scripts/laienstart.sh` nutzt freien-Port-Fallback und meldet klar: „Port X ist belegt. Nutze stattdessen Port Y“.
- Erfolgsvalidierung ergänzt: nach Serverstart wird geprüft, ob `index.html` wirklich erreichbar ist, sonst wird mit klarer Fehlermeldung abgebrochen.
- `scripts/minimal-check.sh` prüft JS-Dateien jetzt mit `node --experimental-default-type=module --check`, damit ES-Module unter Node 18 korrekt als Modul-Syntax geprüft werden.
- Dashboard erweitert: Plugin-Verwaltung mit Auswahlmenü, Aktivieren/Deaktivieren, Hilfe-Text und direkter Ergebnisliste.
- Neue Default-Plugins: Zeichenzähler (Eingabe/Ausgabe) und einfache Rechtschreibprüfung mit Auto-Spracherkennung (Deutsch/Englisch/Französisch).
- Shell-Startkette auf `./start.sh` umgestellt; `laienstart.html` wurde als Einstieg entfernt.
- Startroutine ergänzt intelligente Self-Repair für fehlende Pflichtdateien aus `data/laienstart-required-files.json`.
- Präventive Self-Repair ergänzt: fehlende Kern-JSON-Dateien (`app-config`, Registry, Laienstart-Configs) werden mit sicheren Standard-Dummys erzeugt.
- Neuer gezielter Shell-Test: `tests/scripts-laienstart.dry-run.test.js` prüft Dry-Run + Self-Repair bei fehlenden Dateien automatisch.
- Startkette für Einsteiger vereinfacht: optionaler Browser-Start plus lokaler Webserver in einem Befehl.
- Neuer UI-Render-Regressionstest: Eingaben wie `<img onerror=...>` werden als Text ausgegeben (kein ausführbares HTML).
- Feste Regel eingeführt: dynamische Listen nutzen zentrale Escaping-Hilfe (`js/services/html-escape.js`) statt ad-hoc-Lösungen.
- Sicherheitslücke im UI reduziert: kritische `innerHTML`-Ausgaben escapen (HTML-Sonderzeichen sicher kodieren), damit eingeschleuste Tags/Skripte nicht ausgeführt werden.
- Betroffen sind besonders Archiv-, Log-, Selbsttest- und Profil-Ausgaben in `js/ui.js`.
- Hilfeelemente im Guide-Bereich verbessert: kurzer Bedienhinweis direkt am Index, klare ARIA-Beschriftung.
- Intuitive Toolführung ergänzt: Tastaturnavigation (Pfeile, Enter/Leertaste), visuelle Auswahlfarben, verständliche Statusfarben.
- Drag&Drop für die Reihenfolge ergänzt und direktes Feedback eingebaut.
- Dynamische Anpassung erweitert: Guide-Ansicht wechselt zwischen Split- und Stapelmodus je Fensterbreite.
- `README.md`, `TOOL_TUTORIAL.md` und `INDEX.md` aktualisiert.
- Größte Blocker geschlossen: `js/ui.js` wurde in Renderer-Teile aufgespalten und `js/services/ui-action-handlers.js` in Domänenmodule getrennt.
- Header-Mikrostruktur professionell nachgezogen: semantische Statusliste + getrennte Steuerbutton-Gruppe ohne ID-Bruch.

### Design-Erfolgschecks dieser Iteration
1. **Struktur-Check**: 3-Spalten-Layout bleibt erhalten, Reihenfolge unverändert.
2. **Farb-Check**: Schnellaktionen zeigen klar 4 Tokens (Blau/Gold/Grün/Violett), Header ergänzt passende Status-Chips im Glas-Look.
3. **Transparenz-Check**: App-Container, Panels, Header-Chips und Start-Chips bilden mindestens 3 sichtbare Transparenzebenen.
4. **Lesbarkeits-Check**: Text auf Start-Chips (`done/current`) und Header-Chips bleibt hell und kontrastreich.
5. **Interaktions-Check**: Bestehende Button-/Fokuszustände bleiben aktiv und konsistent.
6. **Responsive-Check**: Unter 980px bleibt 1-Spalten-Ansicht aktiv (kein Strukturumbau im Patch).
7. **Stabilitäts-Check**: Keine ID/JS-Anker geändert.

- Offener Punkt „Altbestand“ in `todo.txt` zu einer klaren Kandidatenliste (ohne Sofortlöschung) konkretisiert.
- Registry-Robustheit gezielt abgesichert: zusätzlicher Regressionstest prüft ID-Bereinigung und Fallback-Quelle ohne Umbau im Produktivcode.
- Standard-Regel ergänzt: Nutzdaten im DOM bevorzugt per `textContent`; `innerHTML`/`insertAdjacentHTML` nur als klar markierte Ausnahme mit Begründung im Code-Kommentar.
- Einziger Escape-Einstieg klargestellt: HTML-String-Rendering nutzt zentral `js/services/html-escape.js`.
- Kleine Safe-API ergänzt: `createSafeListItem(label)` als sichere Basis für einfache Listenbausteine.
- Neue Testpflicht umgesetzt: Injection-Test für die neue Listen-API prüft „nur Text sichtbar" bei `<img onerror=...>` und `<script>...`.
- Neu: 4‑Schritt‑Assistent im Dashboard ergänzt (mit klarer Schritt-Erklärung und direktem „Jetzt ausführen“-Knopf pro aktuellem Schritt).
- Neu: Ein-Befehl-Release-Standard festgezogen: `bash scripts/minimal-check.sh` gilt als fester Abschluss mit klarer Auswertung „Bestanden/Nicht bestanden“.

- Header-Hinweis jetzt ohne HTML-Interpretation: `next-step` setzt nur noch Text (`textContent`) und verhindert damit Markup-Ausführung aus Nutztexten.
- Neuer gezielter Header-Injection-Test: `<img onerror=...>` und `<script>...` bleiben im `next-step` sichtbar als Text.
- Neuer zweiter `next-step`-Test: Sonderzeichen und sehr langer Nutztext (>200 Zeichen) bleiben stabil und werden nur als Text ausgegeben.
- Kleiner UI-Folgeschritt „Text statt HTML“: `checks-list` baut die Hinweis-Artikel jetzt mit DOM-Textknoten auf (kein HTML-String für Nutztexte).


## Iterations-Update: Barrierefreiheit + Hilfe (minimal)
- Guide-Bereich hat jetzt einen zusätzlichen Hilfehinweis für die Alternative ohne Drag&Drop (Nach oben/Nach unten).
- Plugin-Auswahl ist klarer beschrieben und mit den Hilfetexten verknüpft (`aria-describedby`).
- Statusmeldungen in Guide und Plugin sind als Live-Status markiert (`role="status"`, `aria-live="polite"`).
- Plugin-Ausgabe hat jetzt eine klare ARIA-Beschriftung für Screenreader.

### Empfehlung zur Frage „Versionssystem mit Registry“
Ja, ein kleines Versionssystem mit Registry ist sinnvoll – aber nur als Minimalstart:
1. Pro Modul eine `version` nach SemVer (z. B. `1.2.0`) im Manifest pflegen.
2. In `data/module-registry.json` je Modul die aktuelle freigegebene Version + optional `minAppVersion` pflegen.
3. Beim Start nur eine leichte Plausibilitätsprüfung: „Version vorhanden und gültig“.
4. Migrationen erst später ergänzen (bewusst nicht in dieser Iteration).


## Feste PR-Checkliste (Sicherheits-Checkpunkt)
- [x] Keine ungeprüfte Nutzung von `innerHTML`/`insertAdjacentHTML` mit Nutzdaten.
- [x] Bei HTML-String-Rendering nur zentralen Helper `js/services/html-escape.js` nutzen.
- [x] Bei neuen dynamischen Listen mindestens 1 Injection-Test ergänzen (z. B. `<img onerror=...>` oder `<script>...`) und „nur Text sichtbar" prüfen.

## Feste Regeln für Bezeichnungen und Hilfselemente
- Fehlercodes:
  - Technische Codes sind stabil, kurz und in Großbuchstaben (z. B. `SELFTEST_LIST_DIRECTORY_THREW`).
  - Laufzeitfehler aus Adapter-IO enden auf `_THREW`.
  - Fachliche Ergebniscodes bleiben lesbar und kurz (z. B. `DIR_MISSING`, `FILE_CREATED`).
- Check-Namen für Nutzer:
  - Immer klare, einfache Namen (z. B. `Ordnerwahl`, `Rechteprüfung`, `Optionaler Schreibtest`).
  - Keine internen Klassennamen oder Pfadtechnik im sichtbaren Text.
- Hilfemeldungen:
  - Ein Satz, direkte Handlung, einfache Sprache.
  - Bei Fehlern: erst Problem, dann nächster Schritt.

## Wichtiger Hinweis zu Platzhaltern
- `assets/css/base.css` und `assets/js/core.js` liegen im Projekt als Vorlagen-Stand.
- Diese Vorlagen sind in `index.html` derzeit **nicht** aktiv eingebunden.
- Maßgeblich für den Live-Start sind weiter `css/app.css` und `js/app.js`.

## Laien-Befehle (unten)
- Team-Start (empfohlen):
  - `./start.sh`
  - Nur prüfen ohne Start (Dry-Run): `./start.sh --dry-run`
  - Bei Schreibrechtsfehler im Projektordner zuerst Rechte geben: `chmod u+w .`
- App direkt öffnen (nur wenn Startcheck bereits ok ist):
  - `index.html` im Browser öffnen
- Lokale Tests starten:
  - `node --test`
- Lokalen Minimal-Check ausführen (empfohlen):
  - `bash scripts/minimal-check.sh`
  - Standard-Release-Check (Ein-Befehl):
    - `bash scripts/minimal-check.sh`
    - Auswertung: **Bestanden** (Befehl endet ohne Fehler) oder **Nicht bestanden** (Befehl endet mit Fehler).
- Nur JS-Syntax prüfen (direkt):
  - `find js tests -type f -name '*.js' -print0 | xargs -0 -n1 node --experimental-default-type=module --check`

## Kurze Empfehlungsliste (aktualisiert)
1. Erst die drei Basis-Workflows 1–2 Wochen stabil beobachten.
2. Danach erst `dependabot.yml` aktivieren, damit PR-Last klein bleibt.
3. Release-Workflow erst einführen, wenn Versionierung (Tags) klar geregelt ist.
4. Bei CI-Fehlern zuerst `node --test` lokal ausführen, dann gezielt nachbessern.
5. Nutze die neuen Farbtoken in `css/app.css`, wenn du Farben weiter abstimmst (ein Ort statt vieler Einzelwerte).
6. Prüfe nach Layout-Änderungen kurz die 980px-Ansicht, damit Utility-Karten mobil stabil bleiben.
7. Nutze bei jedem Sitzungsende den Button **„Logout (sicher)”** für Autospeichern + sauberen Abschluss.
8. Nutze vor dem Speichern im Editor die Auto-Formatierung, damit JSON/JS/CSS/HTML lesbar und stabil bleiben.

## Offene Punkte für das nächste Release
- Aktuell keine offenen Pflichtpunkte mehr in dieser Iteration.
- Frühere Idee „Notfall-Button *Alles prüfen und reparieren*“ ist als optionale Produktidee geparkt und kein offener Pflichtpunkt.
- Pflege-Regel ab jetzt: `todo.txt` nur mit `[ ]`/`[x]`-Einträgen führen (keine Freitext-Sammelzeilen).
## Iterations-Update 040 (Mini-Patch)

- Neu: Fünf offene TODO-Punkte erledigt: Sidebar-Labels zentral synchronisiert, linke Auto-Collapse-Regel ergänzt, rechte Werkzeugleiste gruppiert, Hilfetext einklappbar gemacht und Buttontypen differenziert.
- Robustheit: Eine zentrale Sync-Hilfe steuert Sidebar-Label und `aria-pressed` konsistent, damit keine doppelte Zustandslogik in Event-Handlern auseinanderläuft.
- UX: Schaltertexte zeigen jetzt klar „(Auto)“ oder „(Manuell)“, und der Plugin-Hinweis bleibt als einklappbarer Kontexttext bei Bedarf erreichbar.
- Archiv: Templates-Defaultarchiv um die Prüfvorgabe „Sidebar-Label-Sync kurz prüfen“ erweitert.
