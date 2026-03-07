# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `./start.sh` im Projektordner ausführen (Team-Standard).
2. Hinweise im Terminal lesen (Vorvalidierung läuft automatisch).
3. Browser öffnet sich bei Erfolg automatisch mit `index.html`.
4. Bei Problemen klare Fehlerhilfe im Terminal befolgen.


## Kleine Erweiterung dieser Iteration (neu)
### Vollautomatischer Shell-Laienstart mit Self-Repair
Wenn du lieber per Terminal startest, nutze jetzt genau einen Befehl:
1. `./start.sh`

Was dabei automatisch passiert:
- Pflicht-Abhängigkeiten werden aus `data/laienstart-dependency-map.json` gelesen und dann geprüft (z. B. `node`, `python3`).
- Wenn möglich, wird fehlende Software automatisch installiert (`apt-get` oder `brew`).
- Fehlende Kern-JSON-Dateien werden als sichere Standard-Dummys angelegt.
- Danach startet der lokale Server und öffnet `index.html`.
- Für einen sicheren Test ohne Serverstart: `./start.sh --dry-run` (prüft Vorvalidierung + Self-Repair).

Kurzregel: Ein Befehl starten, bei Bedarf Hinweise lesen, dann normal weiterarbeiten.

## Kleine Erweiterung dieser Iteration (neu)
### Sicherere Ausgabe bei Listen und Logs
Bei Einträgen aus Archiv, Profilen oder Logs gilt jetzt:
- Sonderzeichen wie `<` und `>` werden sicher angezeigt.
- Inhalte werden als Text behandelt, nicht als ausführbarer Code.

Kurzregel: Eingaben dürfen sichtbar sein, aber keine fremden HTML-Bausteine starten.

## Kleine Erweiterung dieser Iteration (neu)
### Platzhalter klar erkennen (kein Live-Feature)
Wenn du den Design-Status prüfst, gilt:
- `assets/css/base.css` und `assets/js/core.js` sind aktuell Vorlagen-Dateien.
- Ohne Einbindung in `index.html` sind sie **nicht aktiv**.
- Der aktive Lauf nutzt weiter `css/app.css` und `js/app.js`.

Kurzregel: Datei vorhanden heißt nicht automatisch integriert.

## Kleine Erweiterung dieser Iteration (neu)
### Minimal-Check als Ein-Befehl-Start
Wenn du vor einer Änderung nur das Nötigste prüfen willst:
1. `bash scripts/minimal-check.sh`

Der Befehl macht zwei direkte Prüfungen:
- JS-Syntax in `js/` und `tests/`
- den Service-Schnelltest `tests/services/import-export-consistency.test.js`

Kurzregel: erst Minimal-Check, dann nur bei Bedarf breiter testen.


## Kleine Erweiterung dieser Iteration (neu)
### Guide-Bedienung: schneller und einfacher
Im Bereich **Anleitungen und Toolbeschreibungen** kannst du jetzt schneller arbeiten:
- **Tastatur**: Pfeil hoch/runter wählt den nächsten Abschnitt.
- **Bestätigen**: Enter oder Leertaste springt direkt zum gewählten Abschnitt.
- **Ziehen**: Abschnitte per Drag&Drop neu sortieren.
- **Farben helfen**:
  - grünlicher Hinweis = Auswahl/ok
  - gelblicher Text = Eingabe fehlt

Kurzregel: erst per Tastatur wählen, dann bei Bedarf mit Ziehen sortieren.

## Kleine Erweiterung dieser Iteration (neu)
### Altbestand sicher prüfen (ohne Schnell-Löschen)
Wenn eine Datei „alt“ wirkt, lösche sie nicht direkt.
Nutze erst diese kurze Reihenfolge:
1. Nutzung suchen (Doku, Tests, Startpfad).
2. Team-Rückfrage zum echten Betriebsfall.
3. Erst dann Löschentscheidung dokumentieren.

Kurzregel: erst prüfen, dann entscheiden, zuletzt löschen.

## Zusatz-Check (weiter nutzbar)
### Import-/Export-Schnellcheck für direkte Service-Kette
Wenn `js/app.js` Services importiert, prüfe zuerst klein und gezielt:
1. `node --test tests/services/import-export-consistency.test.js`
2. Nur bei Bedarf danach weitere Service-Tests starten.

Was der neue Test absichert:
- erwartete Exporte aus `module-registry`, `startup-check`, `project-selftest` sind vorhanden
- `filesystemAdapter` und `desktopFilesystemAdapter` bieten dieselben Kernmethoden

Kurzregel: erst diesen Schnellcheck nutzen, dann breiter testen.

## Kurzer Doku-Check
1. Prüfen, ob die Reihenfolge für Einsteiger verständlich ist.
2. Prüfen, ob Fachbegriffe kurz erklärt sind.
3. Ziel: schneller Start ohne CI-Vorwissen.

## Kurzer Workflow-Check
1. YAML-Dateien in `.github/workflows/` auf Syntax prüfen.
2. Lokal `node --test` ausführen.
3. Lokal JS-Syntaxcheck ausführen.
4. Ziel: Basis-Workflows sind sofort nutzbar.

## Kleine Erweiterung dieser Iteration (neu)
### Registry-Ausfall sicher abfangen
Wenn `data/module-registry.json` fehlt oder kaputt ist, arbeitet der Start mit einer Fallback-Liste weiter.

Mini-Prüfung:
1. `node --test tests/services/module-registry.test.js`
2. Auf den Test für Fallback-Quelle und ID-Bereinigung achten.

Kurzregel: Bei Registry-Problem erst diesen gezielten Test prüfen.

## Kleine Erweiterung dieser Iteration (neu)
### UI-Listen sicher rendern (Regel für neue Listen)
Wenn neue dynamische Listen gebaut werden, gilt ab jetzt eine feste Regel:
- Entweder DOM mit `textContent` nutzen
- oder die zentrale Hilfe `js/services/html-escape.js` verwenden.

Mini-Test dafür:
1. `node --test tests/services/ui-render-safety.test.js`

Kurzregel: Nutzereingaben immer als Text ausgeben, nie als ungeprüftes HTML einfügen.


## Kleine Erweiterung dieser Iteration (neu)
### DOM-Sicherheitsstandard für Nutzdaten
Für neue Ausgaben gilt jetzt eine klare Reihenfolge:
1. Standard: DOM per `textContent` setzen.
2. Ausnahme: `innerHTML` oder `insertAdjacentHTML` nur mit Kommentar-Begründung direkt am Code.
3. HTML-Strings nur über `js/services/html-escape.js` (zentraler Escape-Einstieg).

Mini-Prüfung:
1. `node --test tests/services/ui-render-safety.test.js`
2. Prüfen, dass Injection-Payloads (`<img onerror=...>`, `<script>...`) nur als Text sichtbar sind.

Kurzregel: Erst `textContent`, sonst klar begründete Ausnahme mit zentralem Escape.

## Kleine Erweiterung dieser Iteration (neu)
### Plugin-Verwaltung für Laien im Dashboard
Im Dashboard gibt es jetzt ein Plugin-Auswahlfeld mit Ein-/Aus-Schalter.

So geht es einfach:
1. Plugin im Auswahlfeld wählen.
2. Mit dem Button aktivieren oder deaktivieren.
3. Ergebnis direkt darunter lesen.

Standard-Plugins:
- **Zeichenzähler**: zählt Zeichen aus Eingabe- und Ausgabebereichen.
- **Rechtschreibprüfung (DE/EN/FR, auto)**: schätzt die Sprache automatisch und zeigt mögliche Tippfehler.

Kurzregel: Erst Plugin wählen, dann Ergebnis lesen.

## Kleine Erweiterung dieser Iteration (neu)
### Node-18-Hinweis für den Minimal-Check
Wenn du Node 18 nutzt, braucht der reine Syntax-Check ein Modul-Flag (ESM = JavaScript-Module mit `import/export`).

Nutze dafür:
1. `bash scripts/minimal-check.sh`

Intern wird dabei jetzt verwendet:
- `node --experimental-default-type=module --check`

Kurzregel: Bei `import`/`export` immer den Minimal-Check nutzen, nicht den alten `node --check`-Einzelaufruf ohne Flag.



## Kleine Erweiterung dieser Iteration (neu)
### Intelligente Startroutine mit Erfolgsprüfung
Die Startroutine prüft jetzt vor und nach dem Start automatisch:
- Vor dem Start: Schreibrechte, JSON-Gültigkeit und Pflichtdateien.
- Bei Lücken: gezielte Self-Repair für bekannte Standarddateien.
- Nach dem Start: Erfolgsvalidierung per URL-Check auf `index.html`.

Wenn etwas scheitert, bekommst du klare Meldungen mit direkter Handlung.

Kurzregel: immer `./start.sh` nutzen, nicht einzelne Startdateien öffnen.


## Kleine Erweiterung dieser Iteration (neu)
### Startstatus in 4 Schritten + sicherer Logout
Für Einsteiger ist der Start jetzt klar nummeriert:
1. Schritt 1/4: Ordner wählen
2. Schritt 2/4: Rechte prüfen
3. Schritt 3/4: Grundcheck ausführen
4. Schritt 4/4: Module starten

Zusätzlich gibt es **„Logout (sicher)”**:
- speichert offene Editor-Änderungen automatisch
- versucht das Backend sicher zu schließen (falls Desktop-Backend aktiv ist)

Kurzregel: erst Startschritte abarbeiten, am Ende immer „Logout (sicher)“ nutzen.
