# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 19 (siehe `todo.txt`)
- Offene Punkte: 2 (siehe `todo.txt`)
- Fortschritt: 91%

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `start.sh` (**Team-Standard-Einstieg**, laiengerechte Startroutine mit Selbsthilfe)
  - `index.html` (Hauptoberfläche, wird nach erfolgreichem Start automatisch geöffnet)
  - `*_start.html` (Einzelstart pro Modul)
- **Frontend**
  - `css/app.css` (inkl. farbliche Hilfehinweise, Tastatur- und Drag&Drop-Stati)
  - Neu: `DESIGN_VORLAGE.md` (tiefe Bildanalyse mit Farb- und Layout-Token als Umsetzungs-Vorlage)
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
  - `js/modules/guide-tools-module.js` (intuitive Führung für Anleitungsliste)
  - Neu: `js/modules/plugin-manager.js` (Plugin-Auswahl, Zeichenzähler und einfache Rechtschreibprüfung DE/EN/FR mit Auto-Sprachschätzung)
- **Module und Services**
  - `js/adapters/*`, `js/services/*`, `js/modules/*`
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
  - `scripts/minimal-check.sh` (kleiner reproduzierbarer Syntax-/Struktur-Schnellcheck, jetzt Node-18-kompatibel für ES-Module)
  - `start.sh` (Hauptstart im Projektordner, delegiert an robuste Startroutine)
  - `scripts/laienstart.sh` (Startroutine-Engine mit Vorvalidierung, Self-Repair und Erfolgsvalidierung)
- **GitHub Workflows (Basis aktiv)**
  - `.github/workflows/ci.yml` (frühe Fehler durch Tests)
  - `.github/workflows/lint.yml` (frühe Syntax-/Stilfehler)
  - `.github/workflows/codeql.yml` (Sicherheitsanalyse)
  - Noch bewusst **nicht aktiv**: `dependabot.yml`, `release.yml`

## Was in dieser Iteration bereinigt wurde
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
- Offener Punkt „Altbestand“ in `todo.txt` zu einer klaren Kandidatenliste (ohne Sofortlöschung) konkretisiert.
- Registry-Robustheit gezielt abgesichert: zusätzlicher Regressionstest prüft ID-Bereinigung und Fallback-Quelle ohne Umbau im Produktivcode.
- Standard-Regel ergänzt: Nutzdaten im DOM bevorzugt per `textContent`; `innerHTML`/`insertAdjacentHTML` nur als klar markierte Ausnahme mit Begründung im Code-Kommentar.
- Einziger Escape-Einstieg klargestellt: HTML-String-Rendering nutzt zentral `js/services/html-escape.js`.
- Kleine Safe-API ergänzt: `createSafeListItem(label)` als sichere Basis für einfache Listenbausteine.
- Neue Testpflicht umgesetzt: Injection-Test für die neue Listen-API prüft „nur Text sichtbar" bei `<img onerror=...>` und `<script>...`.


## Feste PR-Checkliste (Sicherheits-Checkpunkt)
- [ ] Keine ungeprüfte Nutzung von `innerHTML`/`insertAdjacentHTML` mit Nutzdaten.
- [ ] Bei HTML-String-Rendering nur zentralen Helper `js/services/html-escape.js` nutzen.
- [ ] Bei neuen dynamischen Listen mindestens 1 Injection-Test ergänzen (z. B. `<img onerror=...>` oder `<script>...`) und „nur Text sichtbar" prüfen.

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
- Nur JS-Syntax prüfen (direkt):
  - `find js tests -type f -name '*.js' -print0 | xargs -0 -n1 node --experimental-default-type=module --check`

## Kurze Empfehlungsliste
1. Erst die drei Basis-Workflows 1–2 Wochen stabil beobachten.
2. Danach erst `dependabot.yml` aktivieren, damit PR-Last klein bleibt.
3. Release-Workflow erst einführen, wenn Versionierung (Tags) klar geregelt ist.
4. Bei CI-Fehlern zuerst `node --test` lokal ausführen, dann gezielt nachbessern.


## Kurze Empfehlungsliste (unten, aktualisiert)
1. Nutze bei jedem Sitzungsende den neuen Button **„Logout (sicher)”** für Autospeichern + sauberen Abschluss.
2. Nutze vor dem Speichern im Editor die Auto-Formatierung, damit JSON/JS/CSS/HTML lesbar und stabil bleiben.
5. Bei größeren Designwünschen zuerst `DESIGN_VORLAGE.md` aktualisieren, dann erst CSS patchen.
6. Vor Merge immer den Struktur-/Farb-/Transparenz-Check aus `AGENTS.md` kurz abhaken.
