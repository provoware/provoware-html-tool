# TOOL_TUTORIAL.md

## Ziel
Kurze Anleitung für sichere kleine Iterationen.

## Schnellstart
1. `index.html` im Browser öffnen.
2. Auf **Ordner wählen** klicken.
3. Danach **Selbsttest starten**.
4. Status rechts prüfen (Ampel, Rechte, Struktur).

## Kleine Erweiterung dieser Iteration (neu)
### Robustheits- und Einheits-Check in 3 Minuten (neu)
1. Im Projektordner `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob bei Fehlerfällen ein klarer Fehlercode in der Meldung steht (kurzer, fester Schlüssel).
3. In betroffenen Service-Rückgaben prüfen, ob überall die Felder `ok`, `code`, `message`, `data` genutzt werden.
4. Ziel: Gleiches Antwortmuster, klarere Fehlersuche und weniger Sonderfälle.

### Anleitungsmodul mit Index-Sprung kurz prüfen (neu)
1. Seite laden und im Modul **Anleitungen und Toolbeschreibungen** auf einen Indexpunkt klicken.
2. Prüfen, ob direkt zum passenden Abschnitt gesprungen wird.
3. Titel und Beschreibung ändern und **Speichern** klicken.
4. Mit **Nach oben** oder **Nach unten** die Reihenfolge verschieben.
5. Prüfen, ob Reihenfolge, Text und Statusmeldung sichtbar aktualisiert werden.

### Vorlagen-Status robust ohne Browser prüfen (neu)
1. Im Projektordner `node --test tests/services/module-registry.test.js` ausführen.
2. Prüfen, ob der Test für „ohne document“ grün ist.
3. Ziel: Kein Absturz in Nicht-Browser-Umgebungen, stattdessen klare Hinweis-Meldung.

### Import/Export pro Startdatei schnell prüfen (neu)
1. `datenbank_baukasten_start.html` öffnen und **Modul laden** klicken.
2. Auf **Export** klicken und prüfen, ob eine JSON-Datei geladen wird.
3. Danach auf **Import** klicken und dieselbe Datei wieder auswählen.
4. Prüfen, ob JSON wieder unten angezeigt wird.
5. Die gleichen Schritte kurz in `todo_kalender_erinnerung_start.html` und `wiki_notiz_wissen_start.html` wiederholen.

### Neuer Minimaltest für Startdatei-Importe (neu)
1. Im Projektordner `node --test tests/start-files/start-import-resolution.test.js` ausführen.
2. Prüfen, ob der Test „ok“ meldet.
3. Ziel: Alle `*_start.html`-Dateien können ihre Modul-Imports ohne Fehler laden.

### Modul-Einzelstart ohne Haupttool kurz prüfen (neu)
1. Datei `todo_kalender_erinnerung_start.html` im Browser öffnen.
2. Einen Titel eingeben und **Aufgabe erzeugen** klicken.
3. Prüfen, ob unten JSON mit `summary` und `tasks` erscheint.
4. Danach `wiki_notiz_wissen_start.html` öffnen und Thema + Inhalt speichern.
5. Prüfen, ob die Eintragsliste als JSON erscheint.

### Todo-Speicher + Wieder-einblenden-Leiste kurz prüfen (neu)
1. Seite neu laden.
2. Im Todo-Modul einen neuen Eintrag hinzufügen.
3. Seite erneut laden und prüfen, ob der Eintrag noch da ist.
4. Im Modulkopf auf **◫** klicken (Ausblenden).
5. Prüfen, ob unter dem Dashboard eine Leiste mit **einblenden**-Button erscheint.
6. Auf den Button klicken und prüfen, ob das Modul wieder sichtbar ist.

### Todo-Startmodul und Fensterstandard kurz prüfen (neu)
1. Seite neu laden.
2. Prüfen, ob im 3x3-Raster zuerst nur das **Todo-Listenmodul** sichtbar ist.
3. Im Modul auf **⛶** klicken und prüfen, ob maximiert wird.
4. Danach auf **—** klicken und prüfen, ob der Modulinhalt minimiert wird.
5. Danach auf **◫** klicken und prüfen, ob der Inhalt ausgeblendet wird.

### Proportionale Skalierung mit Maus kurz prüfen (neu)
1. Seite neu laden.
2. **Strg** gedrückt halten und Mausrad nach oben drehen.
3. Prüfen, ob die komplette Oberfläche proportional größer wird.
4. **Strg** gedrückt halten und Mausrad nach unten drehen.
5. Prüfen, ob die komplette Oberfläche proportional kleiner wird.
6. **Strg + 0** drücken und prüfen, ob die Ansicht auf Standardgröße zurückspringt.

### Sidebar + 3x3 Modulfenster schnell prüfen (neu)
1. Seite neu laden.
2. Oben auf **Linke Leiste** und **Rechte Leiste** klicken und prüfen, ob beide Seitenleisten ein- und ausklappen.
3. Im Mittelbereich prüfen, ob ein 3x3 Modulraster sichtbar ist.
4. Bei einem Modul auf **⛶** klicken und prüfen, ob das Modul auf Toolgröße maximiert.
5. Mit **Esc** prüfen, ob das maximierte Modul wieder normal wird.

### Modernes Layout schnell prüfen (neu)
1. Seite neu laden.
2. Mit Maus über die Navigations-Buttons fahren und auf leichtes Hover-Feedback achten.
3. Mit **Tab** in ein Eingabefeld springen und den klaren Fokusrahmen prüfen.
4. Prüfen, ob Hauptbereiche ruhiger wirken (hellere Karten, klarere Trennung, besserer Kontrast).

### Nur-Lesen-Hinweis kurz prüfen (neu)
1. Einen Ordner wählen, bei dem Lesen erlaubt ist, Schreiben aber blockiert ist.
2. Danach **Selbsttest starten**.
3. Im Bereich **Projektordner-Status** bei **Schreiben** prüfen, ob `⚠ nur lesen` angezeigt wird.
4. Ziel: Der Sonderfall ist klar sichtbar und nicht als kompletter Fehler missverständlich.

### Screenreader-Live-Status kurz prüfen (neu)
1. Seite neu laden und einen Ordner wählen.
2. Danach **Selbsttest starten**.
3. Mit Screenreader (Vorleseprogramm) prüfen, ob eine kurze Statuszeile vorgelesen wird.
4. Erwartung: Die Meldung enthält **Start**, **Gesamtstatus** und **letzte Meldung** in einfacher Sprache.

### Textdatei-Vorschau und Editor kurz prüfen (neu)
1. Einen Projektordner wählen.
2. Im Modul **Textdatei-Vorschau** den Pfad leer lassen oder einen relativen Pfad eingeben (z. B. `modules`).
3. **Dateiliste laden** klicken und eine Datei aus der Liste wählen.
4. Prüfen, ob der Inhalt unten im Vorschau-Feld erscheint.
5. Auf **Im Editor öffnen** klicken, im Editor Text ändern und **Speichern** klicken.
6. Erwartung: Status meldet „Gespeichert …“ und der Editor zeigt den aktiven Dateipfad.

### Profil-Standard kurz prüfen
1. Seite neu laden.
2. Ohne Klick auf die Profil-Auswahl direkt einen Eintrag speichern.
3. Danach im Profil **HardTechno** prüfen, ob der Eintrag dort sichtbar ist.
4. Ziel: Es wird kein verstecktes Profil mit dem Namen `undefined` erzeugt.

### Vorlagen-Layout schnell prüfen
1. Seite neu laden.
2. Prüfen, ob oben ein durchgehendes Titelband sichtbar ist.
3. Prüfen, ob links die hohe Navigationsleiste klar getrennt ist.
4. Prüfen, ob in der Mitte die große Arbeitsfläche mit feinem Raster sichtbar ist.
5. Prüfen, ob rechts die eigene Statuskachel sichtbar ist.
6. Prüfen, ob unten die Log-Zone als Segment-Fußleiste erscheint.

### Profil-Archiv und Zufallsmix schnell nutzen
1. Einen Ordner wählen.
2. Im Bereich **Profil-Archiv** ein Profil wählen (z. B. HardTechno).
3. In Genre, Stimmung, Stil je einen Eintrag schreiben und mit **Enter** oder **Speichern** bestätigen.
4. Bei **Statistik** prüfen, ob die Mengen je Bereich steigen.
5. Bei **Zufallsmix** Bereiche aktiv lassen und Schnellbutton **1**, **3** oder **5** klicken.
6. Ergebnis im Feld **Mix-Ausgabe** prüfen. Der Text wird automatisch in die Zwischenablage kopiert (wenn erlaubt).

### Genres-Liste mit Scrollbar kurz prüfen (neu)
1. Einen Ordner wählen und im Profil-Archiv viele Genre-Einträge anlegen.
2. Im Bereich **Genres** prüfen, ob eine Scrollbar sichtbar wird.
3. Prüfen, ob die Modulkachel dabei gleich groß bleibt und nicht nach unten wächst.
4. Ziel: Lange Listen bleiben übersichtlich, ohne das Gesamtlayout zu verschieben.

### Import / Export kurz prüfen
1. Auf **Export** klicken.
2. Prüfen, ob JSON im Feld erscheint.
3. JSON verändern oder wieder einfügen.
4. Auf **Import** klicken und danach die Liste prüfen.

### Diagnose-Export (optional) kurz prüfen (neu)
1. Einen Ordner wählen und **Selbsttest starten**.
2. In der Navigation auf **Diagnose exportieren** klicken.
3. Prüfen, ob im Feld **Diagnose-Export (optional)** JSON erscheint.
4. Optional: JSON aus der Zwischenablage in eine Datei einfügen und auf Felder `selftest`, `logs`, `profile` prüfen.

### Modul- und Vorlagenstatus schnell prüfen (neu)
1. Seite neu laden.
2. Im Modul-Slot 5 prüfen, ob ein Text wie `2/2 Module vollständig verbunden` angezeigt wird.
3. Im Modul-Slot 6 prüfen, ob der Vorlagen-Hinweis erscheint.
4. Erwartung: Es steht klar, dass die Asset-Vorlage nicht aktiv ist, solange nur `css/app.css` und `js/app.js` geladen werden.
5. Optionaler Fehlerfall: Wenn ein Modulteil fehlt oder defekt ist, zeigt die Meldung direkt den Namen und den ersten konkreten Fehler.
6. Neue Module zentral pflegen: In `data/module-registry.json` eine neue Modul-ID eintragen und Seite neu laden.
7. Bei häufigen Fehlern auf den „Hilfe:“‑Teil im Status achten und den kurzen Schritt direkt umsetzen.


### Neue Sidebar-Aufteilung kurz prüfen (neu)
1. Seite neu laden.
2. Links prüfen, ob nur Modul-Buttons sichtbar sind (ohne Selbsttest- oder Ordner-Aktionen).
3. Prüfen, ob die Modul-Buttons kompakt wirken und zweispaltig angeordnet sind.
4. Rechts im Bereich **Einstellungen & Stabilität** prüfen, ob alle Test-/Tool-Aktionen gebündelt stehen.
5. Danach **Selbsttest starten** und prüfen, ob darunter der Stabilitätsstatus weiter aktualisiert wird.

### Camouflage-Farben schnell prüfen (neu)
1. Seite neu laden.
2. Prüfen, ob Hintergrund und Karten weder sehr hell noch sehr dunkel wirken.
3. Prüfen, ob Header und Karten in gedeckten Grün-Braun-Tönen (Camouflage) erscheinen.
4. Mit **Tab** auf Buttons gehen und prüfen, ob Lesbarkeit weiter klar bleibt.


### UI-Aktionen kurz prüfen (neu)
1. Seite neu laden und einen Ordner wählen.
2. Im Profil-Archiv einen Eintrag speichern und direkt danach bearbeiten.
3. Prüfen, ob Speichern und Bearbeiten wie vorher funktionieren.
4. Danach auf **Export** und **Diagnose exportieren** klicken.
5. Ziel: Alle Aktionen laufen unverändert, obwohl die Handler jetzt zentral in einem Service liegen.


### Wissensmodul (Wiki/Notiz) kurz prüfen (neu)
1. In `modules/wiki_notiz_wissen/logic.js` eine einfache Testausführung machen (Node-Konsole oder kleines Script).
2. Erst einen Eintrag mit `topic`, `source`, `detail`, `content`, `tags` anlegen.
3. Danach mit `listKnowledgeEntries(..., { query: "thema" })` suchen und Ergebnis prüfen.
4. Zwei Einträge mit `linkKnowledgeEntries` verknüpfen und `relatedIds` prüfen.
5. Zum Schluss `exportKnowledgeEntries` aufrufen und prüfen, ob gültiges JSON mit `count` und `entries` zurückkommt.
### To-do-Datenfluss minimal prüfen (neu)
1. Datei `modules/todo_kalender_erinnerung/logic.js` öffnen.
2. Mit kurzer Probe (Konsole oder Testskript) eine Aufgabe mit Titel anlegen und `createTodoEntry(...)` ausführen.
3. Danach mit `markTodoDone(...)` auf erledigt setzen und mit `reactivateTodo(...)` wieder öffnen.
4. Mit `filterTodos(...)` nach `status`, `area` oder `priority` filtern.
5. Mit `exportTodosAsJson(...)` oder `exportTodosAsCsv(...)` den Exporttext erzeugen.
### Templates-Modul kurz prüfen (neu)
1. Einen Ordner wählen.
2. Im Modul **Templates** Titel, Kategorie und Inhalt eintragen.
3. Auf **Speichern** klicken und prüfen, ob der Eintrag in der Vorlagenliste erscheint.
4. Auf **☆** klicken und prüfen, ob oben bei **Favoriten Schnellwahl** ein Button entsteht.
5. Auf den Favoriten-Button klicken und prüfen, ob ein kurzes Kopier-Feedback erscheint und nach wenigen Sekunden wieder verschwindet.


### Dashboard 3 Notizzeilen kurz prüfen (neu)
1. Einen Ordner wählen.
2. Im Modul **Dashboard 3: Textsammler** den Titel in einer Zeile bei Bedarf anpassen.
3. Einen kurzen Eintrag tippen und mit **Enter** speichern.
4. Danach einen zweiten Eintrag tippen und mit **Speichern** sichern.
5. Erwartung: Feedback meldet erst „Neue Datei erstellt …“, danach „Eintrag angehängt …“.
6. Im Projektordner prüfen: Datei liegt unter `data/dashboard3-notes/<Titel>.txt`.

### Dashboard 3 „Datei öffnen“ + Titel-Hinweis prüfen (neu)
1. Einen Ordner wählen.
2. Im Modul **Dashboard 3: Textsammler** auf das **ⓘ** neben **Titel** zeigen.
3. Erwartung: Tooltip zeigt „Ungültige Zeichen werden ersetzt“.
4. In einer Zeile einen Titel und Text speichern.
5. In derselben Zeile auf **Datei öffnen** klicken.
6. Erwartung: Datei wird direkt im Modul **Datei-Editor** geöffnet.

### Dashboard 3 Button-Status + letzte Datei prüfen (neu)
1. Seite laden und noch nichts speichern.
2. Im Dashboard 3 prüfen: **Datei öffnen** ist je Zeile deaktiviert.
3. In einer Zeile einen Titel + Eintrag speichern.
4. Prüfen: In dieser Zeile ist **Datei öffnen** jetzt aktiv.
5. Prüfen: Unter dem Feedback steht `Letzte Datei: <Dateiname>.txt`.

## Auto-Formatierung prüfen
### Statusbereich rechts mit Symbolen prüfen
1. Seite neu laden.
2. **Ordner wählen** und danach **Selbsttest starten**.
3. Im Bereich **Projektordner-Status** prüfen:
   - **Lesen** zeigt `✔ ok` oder `✖ nein`,
   - **Schreiben** zeigt `✔ ok`, `⚠ nur lesen` oder `✖ nein`,
   - **Struktur** zeigt `✔ ok` oder `⚠ fehlt teilweise`.
4. Ziel: Das Symbolmuster ist überall gleich wie in der Gesamtampel und in den Prüfkarten.

### Statussymbole schnell prüfen
1. Seite neu laden.
2. **Selbsttest starten** klicken.
3. In **Prüfergebnisse** prüfen, ob vor jedem Check ein Symbol steht:
   - `✔` für ok,
   - `⚠` für gelb,
   - `✖` für rot.
4. Im Feld **Gesamtampel** prüfen, ob Symbol und Wort zusammen angezeigt werden (z. B. `⚠ gelb`).

1. Seite neu laden.
2. **Selbsttest starten** klicken.
3. In **Startstatus**, **Prüfergebnisse** und **Letzte Meldungen** prüfen:
   - Texte starten sauber mit Großbuchstabe,
   - Enden bekommen automatisch Punkt, wenn keiner vorhanden ist,
   - lange Texte brechen ohne Layout-Bruch um.


### Default-Profile und Template-Archiv prüfen (neu)
1. Seite neu laden und einen Ordner wählen.
2. Im Bereich **Profil-Archiv** das Profil **HardTechno**, **Chill** und **Hörspiele** nacheinander auswählen.
3. Prüfen, ob in **Genres**, **Stimmungen** und **Stile** bereits mehrere unterschiedliche Starter-Einträge sichtbar sind.
4. Auf **Export** klicken und im JSON prüfen, ob `templateArchive.categories` vorhanden ist.
5. Ziel: Das Tool startet sofort mit brauchbaren Defaults für Musik-Profile und Vorlagen-Arbeit.

## Endprüfung (nur relevant)
- Syntax prüfen: `node --check js/app.js`
- Zusatz-Syntax: `node --check js/ui.js`
- Zusatz-Syntax: `node --check js/state.js`
- Zusatz-Syntax: `node --check js/services/ui-action-handlers.js`
- Modul-Syntax: `node --check modules/wiki_notiz_wissen/logic.js`
- JSON prüfen: `python3 -m json.tool data/module-registry.json > /dev/null`
- JSON prüfen: `python3 -m json.tool modules/wiki_notiz_wissen/schema.json > /dev/null`

## Stand
- Aktualisiert: 2026-03-07
- Iterationsfokus: Wiki-, Notiz- und Wissensmodul als strukturierte Wissensbasis
- Zusatz-Syntax: `node --check js/services/diagnosis-export.js`
- Zusatz-Syntax: `node --check js/services/templates-archive.js`
- Smoke-Test: `node --experimental-default-type=module --test tests/services/ui-action-handlers.smoke.test.js`
- JSON prüfen: `python3 -m json.tool data/project-structure.json > /dev/null`

## Stand
- Aktualisiert: 2026-03-07
- Iterationsfokus: To-do-Modul robust für Aufgabenfluss und Statusverwaltung erweitert
- Iterationsfokus: Default-Profile und Templates-Default-Archiv als sofort nutzbare Startbasis
- Iterationsfokus: Dashboard 3 Textsammler mit titelbasierten Einzeilen-Dateien (Enter + Speichern, Anfügen mit Feedback)
- Iterationsfokus: Dashboard 3 pro Zeile mit „Datei öffnen“-Button und sichtbarem Titel-Tooltip
- Iterationsfokus: Dashboard 3 mit deaktiviertem Öffnen-Button bis Erstspeicherung plus Anzeige der letzten Datei je Zeile
- Iterationsfokus: Kompakteres, kontrastreicheres Layout mit proportionaler Skalierung per Strg + Mausrad

### Startdatei-Standard für alle Module (neu)
1. Lege im Projektordner eine Datei `modulname_start.html` an.
2. Hinterlege im `<head>` diesen JSON-Block:
   - `<script id="start-file-standard" type="application/json">{"modulePath":"./modules/<modul>/logic.js","expectedExports":["create...","add..."]}</script>`
3. Nutze im `<body>` mindestens eine kleine Klick-Aktion (Button), damit das Modul sofort testbar ist.
4. Nutze für Ausgaben `role="status"` und `aria-live="polite"` für bessere Barrierefreiheit.
5. Danach Test ausführen: `node --test tests/start-files/start-import-resolution.test.js`.

### Startdatei-A11y-Baseline kurz prüfen (neu)
1. Neue oder geänderte `*_start.html` speichern.
2. Test ausführen: `node --test tests/start-files/start-import-resolution.test.js`.
3. Ziel: Jede Startdatei hat `start-file-standard` plus `role="status"` und `aria-live`.

### Dashboard-Info kurz prüfen (neu)
1. Dashboard öffnen.
2. Auf die Infozeile im Dashboard und in der linken Leiste schauen.
3. Ziel: Dashboard zeigt `Ampel + Module + Archiv`; linke Leiste zeigt nur die Modul-Zusammenfassung.
