# ProvoWare Dashboard (HTML/CSS/JS/JSON)

## Status oben
- Erledigte Punkte: 18 (siehe `todo.txt`)
- Offene Punkte: 1 (siehe `todo.txt`)
- Fortschritt: 97%

## Aktuelle Toolstruktur und Toolumfang
- **Startdateien**
  - `laienstart.html` (**Team-Standard-Einstieg**, transparenter Startpfad)
  - `index.html` (Hauptoberfläche, wird nach erfolgreichem Start automatisch geöffnet)
  - `*_start.html` (Einzelstart pro Modul)
- **Frontend**
  - `css/app.css` (inkl. farbliche Hilfehinweise, Tastatur- und Drag&Drop-Stati)
  - `js/app.js`, `js/ui.js`, `js/state.js`, `js/status-visuals.js`
  - `js/modules/guide-tools-module.js` (intuitive Führung für Anleitungsliste)
  - Neu: `js/modules/plugin-manager.js` (Plugin-Auswahl, Zeichenzähler und einfache Rechtschreibprüfung DE/EN/FR mit Auto-Sprachschätzung)
- **Module und Services**
  - `js/adapters/*`, `js/services/*`, `js/modules/*`
  - Neu für sichere Listen-Ausgabe: `js/services/html-escape.js` (zentrale HTML-Zeichenkodierung)
  - `modules/*` (fachliche Module)
- **Daten**
  - `data/app-config.json`, `data/themes.json`, `data/ui_texts.json`
  - `data/module-registry.json`, `data/project-structure.json`
  - `data/laienstart-required-files.json` (konfigurierbare Dateiliste für den Startcheck)
  - `data/laienstart-autofix-defaults.json` (Standard-Dummy für Auto-Reparatur-Steuerung)
  - `data/laienstart-dependency-map.json` (Standard-Dummy für Abhängigkeitsauflösung)
  - `data/profile-archive.json`, `data/templates-archive.json`
- **Tests und Checks**
  - `tests/services/*.test.js` (inkl. Import-/Export-Konsistenzcheck und UI-Render-Sicherheit), `tests/adapters/*.test.js`, `tests/start-files/*.test.js`, `tests/scripts-laienstart.dry-run.test.js`
  - `scripts/minimal-check.sh` (kleiner reproduzierbarer Syntax-/Struktur-Schnellcheck)
  - `scripts/laienstart.sh` (vollautomatischer Shell-Start mit präventiver Self-Repair-Logik)
- **GitHub Workflows (Basis aktiv)**
  - `.github/workflows/ci.yml` (frühe Fehler durch Tests)
  - `.github/workflows/lint.yml` (frühe Syntax-/Stilfehler)
  - `.github/workflows/codeql.yml` (Sicherheitsanalyse)
  - Noch bewusst **nicht aktiv**: `dependabot.yml`, `release.yml`

## Was in dieser Iteration bereinigt wurde
- `scripts/laienstart.sh` prüft jetzt vor dem Start, ob der Projektordner schreibbar ist. Bei Fehlern gibt es klare Handlungsoptionen in einfacher Sprache.
- `scripts/laienstart.sh` nutzt einen freien-Port-Fallback und meldet klar: „Port X belegt, nutze Port Y“.
- Dashboard erweitert: Plugin-Verwaltung mit Auswahlmenü, Aktivieren/Deaktivieren, Hilfe-Text und direkter Ergebnisliste.
- Neue Default-Plugins: Zeichenzähler (Eingabe/Ausgabe) und einfache Rechtschreibprüfung mit Auto-Spracherkennung (Deutsch/Englisch/Französisch).
- Neuer Shell-Einstieg `scripts/laienstart.sh`: liest Pflicht-Abhängigkeiten jetzt aktiv aus `data/laienstart-dependency-map.json`, versucht automatische Installation (apt/brew), erzeugt fehlende Standarddateien und startet danach lokal die Oberfläche.
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
  - `bash scripts/laienstart.sh`
  - Nur prüfen ohne Start (Dry-Run): `bash scripts/laienstart.sh --dry-run`
  - Bei Schreibrechtsfehler im Projektordner zuerst Rechte geben: `chmod u+w .`
  - Alternativ: `laienstart.html` im Browser öffnen
- App direkt öffnen (nur wenn Startcheck bereits ok ist):
  - `index.html` im Browser öffnen
- Lokale Tests starten:
  - `node --test`
- Lokalen Minimal-Check ausführen (empfohlen):
  - `bash scripts/minimal-check.sh`
- Nur JS-Syntax prüfen (direkt):
  - `find js tests -type f -name '*.js' -print0 | xargs -0 -n1 node --check`

## Kurze Empfehlungsliste
1. Erst die drei Basis-Workflows 1–2 Wochen stabil beobachten.
2. Danach erst `dependabot.yml` aktivieren, damit PR-Last klein bleibt.
3. Release-Workflow erst einführen, wenn Versionierung (Tags) klar geregelt ist.
4. Bei CI-Fehlern zuerst `node --test` lokal ausführen, dann gezielt nachbessern.
