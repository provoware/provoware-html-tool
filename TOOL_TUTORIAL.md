# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere, kleine Iterationen in einfacher Sprache.

## Schnellstart
1. `./start.sh` im Projektordner ausführen (Team-Standard).
2. Hinweise im Terminal lesen (Vorvalidierung läuft automatisch).
3. Browser öffnet sich bei Erfolg automatisch mit `index.html`.
4. Bei Problemen klare Fehlerhilfe im Terminal befolgen.


## Kleine Erweiterung dieser Iteration (neu)
### Startup-Check mit Self-Repair
Neu in dieser Iteration:
- Wenn die Projektstruktur ungültig ist, nutzt der Startup-Check sichere Defaults (Selbstreparatur).
- Unerwartete Adapter-Fehler liefern jetzt klare Codes, damit die Hilfe schneller passt.

Direkter Mini-Check:
1. `node --test tests/services/startup-check.test.js`

Kurzregel: Bei Startfehlern zuerst den Startup-Check ausführen, dann den gemeldeten Code nutzen.


## Kleine Erweiterung dieser Iteration (neu)
### Barrierearme Hilfe im Guide- und Plugin-Bereich
Neu in dieser Iteration:
- Im Guide gibt es einen Zusatzhinweis: Reihenfolge geht auch ohne Ziehen mit **Nach oben/Nach unten**.
- Die Plugin-Auswahl ist jetzt mit Hilfetexten verknüpft (`aria-describedby`).
- Statuszeilen in Guide und Plugin melden Änderungen als Live-Status für Screenreader.

Direkter Mini-Check:
1. `node --check js/modules/guide-tools-module.js`

Kurzregel: Wenn du Drag&Drop nicht nutzt, nimm immer die zwei Verschiebe-Buttons.

## Kleine Erweiterung dieser Iteration (neu)
### Maximierung mit Maus schnell wieder beenden
Neu in dieser Iteration:
- Jedes Modul hat jetzt den Kopf-Button **„Maximierung aufheben“**.
- Wenn ein Modul links noch kein passendes Panel hat, zeigt das Tool eine kurze Hilfe-Meldung.

Direkter Mini-Check:
1. `bash scripts/minimal-check.sh`

Kurzregel: Bei großem Modul per Kopf-Button sofort zurück ins 3x3-Grid.

## Kleine Erweiterung dieser Iteration (neu)
### Aktive Module im 3x3-Mittelbereich direkt öffnen
Neu in dieser Iteration:
- Der Mittelbereich bleibt ein 3x3-Grid für Module.
- Klick auf ein Modul links bei **Nutzer-Module** öffnet das passende Modul im Grid sofort.
- Das gewählte Modul wird direkt maximiert, damit du sofort arbeiten kannst.

Direkter Mini-Check:
1. `bash scripts/minimal-check.sh`

Kurzregel: Erst Modul links anklicken, dann im großen Modul weiterarbeiten.


## Kleine Erweiterung dieser Iteration (neu)
### Template-IDs sicher in Buttons nutzen
Neu in dieser Iteration:
- Template-IDs werden in `data-template-*` jetzt immer escaped (sicher kodiert).
- So kann eine manipulierte ID keine fremden HTML-Attribute einschleusen.

Direkter Mini-Check:
1. `node --test tests/services/ui-render-safety.test.js`

Kurzregel: Werte für `data-*` immer escapen, wenn sie aus Nutzdaten kommen.

## Kleine Erweiterung dieser Iteration (neu)
### Dashboard-Notizpfade: Öffnen + Speichern konsistent
Neu in dieser Iteration:
- Der Fehler-Helper gilt jetzt auch beim Öffnen der zuletzt gespeicherten Dashboard-Datei.
- Save-Fehlerfälle vom Adapter (Exists/Read/Write) sind mit kleinen Tests abgesichert.

Direkter Mini-Check:
1. `node --test tests/services/ui-action-handlers.smoke.test.js`

Kurzregel: Bei gleichen Fehlerpfaden immer denselben kleinen Helper nutzen.

## Kleine Erweiterung dieser Iteration (neu)
### Dashboard-Notizen: einheitliche Fehlerpfade
Neu in dieser Iteration:
- Das Speichern von Dashboard-Notizen nutzt intern einen gemeinsamen Fehler-Helper.
- Rückgabe, Feedback im Feld und Log-Warnung bleiben dadurch konsistent.
- Verhalten für Nutzer bleibt gleich, Wartung ist einfacher.

Direkter Mini-Check:
1. `node --test tests/services/ui-action-handlers.smoke.test.js`

Kurzregel: Wenn mehrere Fehlerpfade gleich aussehen, zuerst klein zentralisieren.



## Kleine Erweiterung dieser Iteration (neu)
### Einheitliche Guide-API + klarerer Zufallsmix
Neu in dieser Iteration:
- Guide-Navigation nutzt nur noch `mode` (`select` oder `jump`). Der alte `jump`-Boolean entfällt.
- Das Profil- und Templates-Archiv startet mit erweiterten Standard-Einträgen.
- Der Zufallsmix liefert pro Bereich `usage.requested` und `usage.used`.

Direkter Mini-Check:
1. `node --test tests/services/profile-archive-random.test.js`

Kurzregel: Für UI-Hinweise zur Mix-Menge immer `used` gegen `requested` anzeigen.

## Kleine Erweiterung dieser Iteration (neu)
### Grenzfall-Check für Guide + robuste Module
Neu in dieser Iteration:
- Guide-Index hat jetzt einen Mini-Test für Randfälle: `ArrowUp` auf Index `0` und `ArrowDown` am letzten Index.
- Wiki-Lesen/Listen geben Kopien zurück. So bleibt der interne Store stabil.
- Zufallsmix klemmt die gewünschte Anzahl sauber ein (1 bis 20), damit keine Ausreißer entstehen.

Direkte Mini-Checks:
1. `node --test tests/modules/guide-tools-module.test.js`
2. `node --test tests/modules/wiki-notiz-wissen.test.js`
3. `node --test tests/services/profile-archive-random.test.js`

Kurzregel: Bei kleinen Logik-Patches nur die direkt betroffenen Mini-Tests starten.

## Kleine Erweiterung dieser Iteration (neu)
### Guide-Tastatur jetzt komplett über einen Navigations-Helper
Im Guide-Index laufen jetzt auch Pfeiltasten und Sprungtasten über einen gemeinsamen Mini-Helper.

Was das bringt:
- Auswahlpfad (`ArrowUp`/`ArrowDown`) und Sprungpfad (`Enter`/`Leertaste`) sind zentral.
- Die Bedienung bleibt gleich, aber spätere Anpassungen sind sicherer.

Mini-Test für genau diesen Bereich:
1. `node --test tests/modules/guide-tools-module.test.js`

Kurzregel: Bei Guide-Navigation immer nur den kleinen Guide-Test starten, bevor du breiter testest.

## Kleine Erweiterung dieser Iteration (neu)
### Guide intern vereinheitlicht (leichter wartbar)
Im Bereich **Anleitungen und Toolbeschreibungen** wurden wiederkehrende Schritte intern gebündelt:
- Ein kleiner Helper liest den Abschnitts-Index zentral aus.
- Ein zweiter Helper verschiebt Einträge nach oben/unten mit derselben Logik.

Was sich für dich ändert:
- Die Bedienung bleibt gleich.
- Fehler durch doppelte Logik werden unwahrscheinlicher.

Kurzregel: gleiche Aufgabe = ein gemeinsamer Helper statt doppeltem Code.






## Kleine Erweiterung dieser Iteration (neu)
### Kleine Refaktor-Regel für Startlogik
Wenn Startlogik an zwei Stellen gleich aussieht, zuerst einen kleinen gemeinsamen Helper bauen.

Beispiel in dieser Iteration:
- In `js/app.js` läuft der Startup-Readiness-Check jetzt über **eine** Funktion.
- Ergebnis: gleiches Verhalten, aber weniger doppelte Wartungsstellen.

Kurzregel: Duplizierten Startcode zuerst bündeln, dann erst erweitern.

## Kleine Erweiterung dieser Iteration (neu)
### Design-Abgleich in 5 Minuten
Wenn du die Vorlage mit dem aktuellen Stand vergleichst, arbeite kurz mit dieser Reihenfolge:
1. `DESIGN_VORLAGE.md` öffnen und den Abschnitt **„Soll-Ist-Abgleich (Iteration 2026-03-07)”** lesen.
2. Nur die Priorität-A-Punkte zuerst anfassen (Farbwelt, Header-Mikrostruktur).
3. Vor jedem CSS-Patch prüfen: keine IDs/JS-Anker ändern.

Kurzregel: erst Lücke messen, dann kleinsten sichtbaren Patch bauen.

## Kleine Erweiterung dieser Iteration (neu)
### Header-Tasten: Fokus besser sichtbar
Oben rechts im Header haben jetzt auch diese zwei Tasten den klaren Token-Fokus:
- `Linke Leiste`
- `Rechte Leiste`

Was sich für dich ändert:
- Beim Tabben ist der aktive Button sofort sichtbar.
- Die Farben bleiben nah an der Designvorlage (Primär-Blau-Cluster).

Kurzregel: Wenn du per Tastatur arbeitest, müssen beide Header-Tasten den gleichen klaren Fokus zeigen.

## Kleine Erweiterung dieser Iteration (neu)
### Header-Chips gezielt testen (ohne Full-UI-Test)
Wenn du nur den Header prüfen willst, nutze genau diesen Test:
1. `node --test tests/services/ui-header-chips.test.js`

Was der Test absichert:
- `setState(...)` setzt den Text in `#header-chip-project-status` korrekt (Wartet/In Arbeit/Bereit).
- `setState(...)` setzt den Text in `#header-chip-autosave-status` korrekt (Bereit/Offen/Gesichert).

Kurzregel: Für Header-Status immer diesen kleinen Test zuerst laufen lassen.

## Kleine Erweiterung dieser Iteration (neu)
### Header-Statuschips als Live-Anzeige
Im Kopfbereich stehen rechts oben zwei kleine Status-Chips als Live-Anzeige aus dem aktuellen App-Status:
- **Projektstatus**: zeigt z. B. `Wartet`, `In Arbeit`, `Bereit` oder den Ampel-Status.
- **Autosave-Status**: zeigt z. B. `Bereit`, `Offen` oder `Gesichert`.

Zusätzlich gibt es einen kleinen Hover-/Fokus-Check direkt auf den Chips. So ist die Interaktion im Glas-Look klarer erkennbar.

Kurzregel: Vor dem Arbeiten kurz oben rechts prüfen, ob Projektstatus und Autosave passend stehen.

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


## Kleine Erweiterung dieser Iteration (neu)
### Header-Chips: stärkerer Fokuskontrast per CSS-Token
Für Tastatur-Nutzung wurde der Fokus-Ring der Header-Chips gezielt verstärkt:
- klarerer Ring bei `:focus-visible`
- nur CSS-Token-Abgleich, keine Änderung an HTML oder JS

Kurzregel: Wenn du mit Tab navigierst, muss der aktive Header-Chip sofort gut sichtbar sein.

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

## Kleine Erweiterung dieser Iteration (neu)
### Designvorlage exakt nachbauen (Glas-Layout)
Wenn du ein neues Layout nach Bildvorlage bauen willst, nutze diese Reihenfolge:
1. Erst `DESIGN_VORLAGE.md` lesen (Layout, Farben, Transparenz, Checks).
2. Danach nur `css/app.css` minimal patchen.
3. Nur wenn nötig `index.html` ergänzen, aber bestehende IDs nicht brechen.

Mini-Check zum Schluss:
1. `bash scripts/minimal-check.sh`
2. Browser öffnen und prüfen: 3 Spalten, Glas-Karten, gute Lesbarkeit.

Kurzregel: zuerst Vorlage, dann kleiner CSS-Patch, dann gezielter Check.

## Kleine Erweiterung dieser Iteration (neu)
### Schnellaktionen besser lesbar wie in der Designvorlage
Die vier Startschritte im Dashboard sind jetzt farblich getrennt:
- Schritt 1: Blau
- Schritt 2: Gold
- Schritt 3: Grün
- Schritt 4: Violett

Warum das hilft:
- Reihenfolge ist schneller erkennbar.
- Jeder Schritt wirkt wie eine eigene Karte (Glas-Chip).
- Die Orientierung wird für Einsteiger einfacher.

Kurzregel: Schritte der Reihe nach lesen, Farbe nur als Zusatzhilfe nutzen.

## Kleine Erweiterung dieser Iteration (neu)
### Farbtoken + Utility-Karten sicher anpassen
Wenn du den neuen Look weiter feinjustieren willst, arbeite in 2 kleinen Schritten:
1. Farben nur über Token in `css/app.css` ändern (Header- und Utility-Karten-Token in `:root`).
2. Rechte Spalte nur über Klassen `utility-cards` und `utility-card` anpassen.

Sicherheitsregel:
- Keine bestehenden IDs ändern (damit JS-Anker stabil bleiben).
- Nach jeder Layout-Änderung kurz unter 980px prüfen.

Kurzregel: erst Token, dann Karten, dann 980px-Check.

## Kleine Erweiterung dieser Iteration (neu)
### Große UI-Dateien jetzt einfacher pflegen
Die zwei größten UI-Blocker sind jetzt sauber getrennt:
- `js/ui.js` steuert nur noch den Ablauf und ruft Renderer-Teile auf.
- `js/renderers/ui-header-renderer.js` rendert den Header-Bereich.
- `js/renderers/ui-main-renderer.js` rendert die restlichen Hauptbereiche.
- `js/services/ui-action-handlers.js` setzt sich aus Domänenmodulen zusammen (`ui-actions/*`).

Kurzregel: Neue UI-Ausgabe bitte direkt im passenden Renderer ergänzen, neue Klicklogik direkt im passenden Domain-Action-Modul.

## Kleine Erweiterung dieser Iteration (neu)
### Vier Design-Themes + Schriftzoom für bessere Lesbarkeit
Neu in dieser Iteration:
- Oben im Header gibt es jetzt eine Theme-Auswahl mit 4 Design-Themes.
- Die Schriftgröße kann mit **Strg + Mausrad** und **Strg + Plus/Minus** angepasst werden.
- **Strg + 0** setzt die Schriftgröße auf 100% zurück.

Mini-Check:
1. App starten.
2. Theme wechseln und prüfen, ob Farben sofort sichtbar wechseln.
3. Strg + Mausrad nutzen und auf die Anzeige "Schriftgröße: ...%" achten.

Kurzregel: Für bessere Lesbarkeit zuerst Schriftgröße und dann Theme anpassen.

## Kleine Erweiterung dieser Iteration (neu)
### 4‑Schritt‑Assistent direkt im Dashboard
Neu in dieser Iteration:
- Im Bereich **Schnellaktionen** gibt es jetzt einen klaren Assistenten-Block.
- Der Assistent zeigt immer den **aktuellen** Schritt (1 bis 4) mit kurzer Erklärung.
- Mit einem Knopf startest du den passenden Schritt direkt.

Kurzregel: Lies nur den aktuellen Schritt und nutze den Assistent-Knopf.

## Kleine Erweiterung dieser Iteration (neu)
### Laien-Release-Check in 3 Minuten
Der feste Standard für den Release-Abschluss ist jetzt genau ein Befehl:
1. `bash scripts/minimal-check.sh`

Auswertung immer gleich:
- **Bestanden**: Befehl endet ohne Fehler.
- **Nicht bestanden**: Befehl endet mit Fehler.

Kurzregel: Vor Freigabe immer genau diesen Ein-Befehl-Check ausführen.

## Kleine Erweiterung dieser Iteration (neu)
### Startfehler unter Node 18 vermeiden
Wenn der Service-Schnelltest mit `Cannot use import statement outside a module` stoppt, nutze den Standardweg:
1. `bash scripts/minimal-check.sh`

Der Schnelltest läuft dort jetzt mit Modul-Flag (ESM = JavaScript-Module mit `import/export`).

Kurzregel: Für den Service-Schnelltest immer das Skript nutzen, nicht den blanken `node --test`-Aufruf.

## Kleine Erweiterung dieser Iteration (neu)
Neu in dieser Iteration:
- Dry-Run-Hinweis präzisiert: Wenn Pflichtdateien korrekt gelesen werden, erscheint **keine** Sammelwarnung mit `\n` mehr.

Kurzer Prüfschritt:
1. `./start.sh --dry-run` ausführen.
2. Erwartung: `OK: Alle Pflichtdateien sind vorhanden.` oder einzelne klare Dateiwarnungen (je Datei eine Zeile).
3. Nicht mehr erwartet: eine einzige Warnung mit zusammengeklebter Liste wie `index.html\n./css/app.css...`.
