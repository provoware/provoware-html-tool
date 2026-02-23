# WAITME – Kurzstatus für Menschen

Stand: 2026-02-23 (Next-Step-Liste gekürzt und klarer gemacht)

## Aktueller Stand (einfach erklärt)
- Die Startausgabe bleibt jetzt kurz: Standardmäßig werden maximal 8 nächste Schritte gezeigt.
- Wenn mehr Hinweise anfallen, landen sie gesammelt unter „Weitere Hinweise" im Statusbericht.
- Falsche Eingaben beim Limit (PROVOWARE_NEXT_STEPS_LIMIT) werden sofort mit klarer Lösung abgefangen.

## Top-Blocker
- Keine kritischen Blocker in dieser Mini-Iteration.

## Betriebsrisiken
- Bei sehr vielen Hinweisen muss man für alle Details den Statusbericht lesen (`cat logs/status_summary.txt`).

## Nächste sinnvolle Befehle
- `bash start.sh --check`
- `bash start.sh --full-gates`
- `PROVOWARE_NEXT_STEPS_LIMIT=12 bash start.sh --check`

# WAITME – Kurzstatus

Stand: 2026-02-23 (Start-Status verständlicher gemacht)

## Aktueller Stand (einfach erklärt)
- Die Startausgabe wiederholt gleiche Hinweise nicht mehr mehrfach.
- Nächste Schritte sind nummeriert (Schritt 1, Schritt 2 …), damit man sie leichter nacheinander abarbeiten kann.
- Die automatische Prüfung kontrolliert dieses Format jetzt selbstständig.

## Top-Blocker
- Kein harter Blocker offen.

## Betriebsrisiken
- In reinen Offline-Umgebungen können Browser-E2E-Tests weiterhin nur eingeschränkt laufen, wenn Playwright-Artefakte fehlen.

## Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py --profile full`
- `bash start.sh --ux-check-auto`

## Update 2026-02-23 (3 Punkte, Header-Verlauf)
- Im Header gibt es jetzt eine Liste „Zuletzt genutzt" mit maximal 5 Projektpfaden. Sie ist per Tastatur bedienbar.
- Projektpfade werden jetzt zentral geprüft und gespeichert (validiert = geprüft), damit Status und Verlauf zusammenpassen.
- Die automatische Prüfung (Smoke-Test = kurzer Funktionstest) überwacht die neuen Header-Marker.

### Top-Blocker
- Uhrzeit der letzten Nutzung fehlt noch in der Verlaufsliste.

### Betriebsrisiken
- Sehr lange Pfade bleiben bedienbar, brauchen aber mehr Zeilenhöhe im Header.

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh`

## Update 2026-02-23 (3 Punkte, kurz)
- Das 3x3-Hauptgrid hat jetzt gleich große Felder. Jedes Feld kann scrollen (scrollen = blättern), damit Inhalte nie abgeschnitten sind.
- Untermodule haben größere Knöpfe und besser lesbare Standardschrift für leichteres Bedienen.
- Projektwechsel ist zusätzlich oben im Header. Die Topbar bleibt sichtbar (sticky = haftend), ohne den Hauptbereich zu verdecken.

### Top-Blocker
- Zuletzt-genutzte Projekte im Header sind noch nicht als Schnellliste vorhanden.

### Betriebsrisiken
- Bei sehr vielen offenen Inhalten pro Feld kann häufiges Scrollen nötig sein; funktional bleibt alles bedienbar.

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh`

## Update 2026-02-23 (kurz und einfach)
- Der Header ist freigeräumt: Der Hauptbereich wird nicht mehr überdeckt.
- „Untermodul maximieren" nutzt jetzt die komplette Grid-Fläche (ganzer Rasterbereich).
- Projekt-Kontext und globale Suche sind jetzt im rechten Block „Hauptmodul Einstellungen" (bessere Ordnung).

### Top-Blocker
- Tastatur-Shortcut für „Maximieren zurücksetzen" pro Untermodul fehlt noch.

### Betriebsrisiken
- Sehr viele gleichzeitig geöffnete Module bleiben auf 3x3 begrenzt; Nutzer müssen bei voller Belegung ein Modul ausblenden.

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh`

## Update 2026-02-22 (Footer + Modulhilfe)
- Der Footer ist jetzt in 3 Bereiche geteilt und hat direkte Schnellknöpfe für Speichern, Erneut versuchen und Protokoll.
- In der linken Modul-Liste sehen Sie jetzt pro Modul kurze Hinweise (Tooltip = kurzer Über-Hinweis) mit nächstem Schritt.
- Der Smoke-Test prüft diese Stellen automatisch, damit sie bei Änderungen nicht versehentlich verloren gehen.

### Top-Blocker
- Keine neuen Blocker aus dieser Iteration.

### Betriebsrisiken
- Browser-E2E kann in gesperrten Netzen weiterhin an fehlenden Browser-Downloads scheitern (Offline-Paket als Ausweg).

### Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py`
- `bash start.sh`

# WAITME – Kurzstatus

Stand: 2026-02-22 (Layout-Anpassung auf Raster-Schema)

## Aktueller Stand (einfach erklärt)
- Untermodule landen beim Öffnen im nächsten freien Rasterfeld (Grid = Tabellenraster).
- Modul-Fensteroptionen sind jetzt direkt als Symbole im Untermodul.
- Schnellhilfe mit Next Steps sitzt jetzt im rechten Seitenbereich.
- Neue To-Do-Liste ist nutzerorientiert (nicht Entwicklungs-Todo) und hat ein Datum-Feld.
- Genres, Moods und Stile haben getrennte Eingabefelder; Enter speichert direkt.

## Top-Blocker
- Browser-E2E kann in gesperrten Umgebungen wegen Playwright-Download (403) scheitern.

## Betriebsrisiken
- Ohne Offline-Mirror fehlen Browser-Artefakte für den Volltest.

## Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py`
- `bash start.sh --offline-pack`

# WAITME – Kurzstatus

Stand: 2026-02-22 (Grid-Module getrennt und stabil)

## Aktueller Stand (einfach erklärt)
- Die Mitte ist jetzt ein leeres 3x3-Raster (Grid = Tabellenraster).
- Module starten in der Sidebar und kommen nur bei Aktivierung in die Mitte.
- Das GMS-Sammelmodul und das Debug/Entwickler-Modul sind sauber getrennt.

## Top-Blocker
- Kein harter Blocker offen; nächster Fokus ist der 3-spaltige Footer für Schnellfunktionen.

## Betriebsrisiken
- Browser-Screenshot/Visual-Baseline kann ohne vollständige Browser-Artefakte eingeschränkt sein.

## Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py --profile quick`
- `bash start.sh --ux-check-auto`

## Update 2026-02-22 (Modul-Interoperabilität abgeschlossen)
- Modul-Auswahl zeigt jetzt sofort kurze, klare Datenquellen-Infos (Quelle, Zweck, nächster Schritt).
- Das Projektordner-Feld startet ohne versteckten Standardordner (kein stiller Vorwert).
- Die automatische Prüfung (Smoke-Test = kurzer Funktionstest) kontrolliert diese neuen Punkte direkt.

### Top-Blocker
- Kein kritischer Blocker offen. Optional: Kurzdetails noch zusätzlich als Tooltip in der Sidebar zeigen.

### Betriebsrisiken
- Wenn `config/module_sources.json` unvollständig ist, zeigt das Dashboard jetzt einen klaren Hinweis mit Next Step.

### Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py`
- `bash start.sh --ux-check-auto`

# WAITME – Arbeitsstand & Nächste Schritte

Stand: 2026-02-22 (Start-/CI-Härtung ergänzt)


## Update 2026-02-22 (GUI offen weitergeführt)
- Oben im Arbeitsbereich gibt es jetzt eine klare Steuerleiste (Projektpfad, Suche, Projekt wechseln).
- Rechts gibt es jetzt einen festen Kontext-Inspector mit Details, Hilfe, Meta-Infos und Kürzeln.
- Neu: Shortcut-Übersicht per F1 oder ? mit Suchfilter (Overlay = überlagerndes Fenster).

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh --ux-check-auto`

## Kurzfazit
- Die eingereichte P0/P1/P2-Liste wurde gegen den aktuellen Code geprüft.
- Ein Punkt ist bereits erledigt („Open Module“ aktiviert echte Modulansicht).
- Die übrigen Punkte sind offen und wurden priorisiert in `todo.txt` übertragen.

## Top-Blocker (sofort)
1. `__MODULE_SOURCES__` fail-safe machen (Direktdatei darf nicht crashen).
2. Click-Delegation robust (`closest('[data-action]')`).
3. Theme-Konsistenz + kein hartes `applyTheme('balanced')`.

## Betriebs-/Start-Risiken
- In Offline-Umgebungen bleiben `shfmt` und `shellcheck` ggf. weiter fehlend; dann nur mit Hinweis statt Auto-Fix.
- Browser-E2E kann ohne vorinstallierte Playwright-Browser nur eingeschränkt laufen (Warnung statt harter Abbruch).
- Bei Netzwerkproblemen kann automatische Reparatur verzögert sein; `logs/install.log` zeigt die genaue Ursache.

## Laienfreundliche Empfehlung
- Starten Sie zuerst immer mit `bash start.sh --check --debug`.
- Danach `bash start.sh --repair` nur mit Internet und passenden Rechten (sudo/root).
- Öffnen Sie bei Fehlern `logs/start.log` und folgen Sie den „Nächster Schritt“-Hinweisen.


## Update 2026-02-22 (einfach erklärt)
- Das Dashboard startet jetzt stabiler, auch wenn Modulquellen fehlen.
- Klicks auf Buttons sind robuster, auch wenn Sie auf ein Icon im Button klicken.
- Das Start-Design bleibt konsistent und springt nicht mehr hart auf ein anderes Theme.

### Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py`
- `bash start.sh --ux-check-auto`


## Update 2026-02-22 (Layout-/UX-Audit)
- Die neue 20-Punkte-Liste wurde geprüft und als offene, priorisierte Aufgaben in `todo.txt` übernommen.
- Der Fortschrittswert wurde auf 76% gesetzt, damit der Status ehrlich zu den offenen Punkten passt.
- Nächste sinnvolle Triade ist vorbereitet: 6-Bereich-Layout, Layout-Speichern/Reset, Typo-Skala mit klaren Zustands-Texten.


## Update 2026-02-22 (Texte & Qualität)
- Textbausteine liegen jetzt zentral in `config/messages.json`.
- Beim Start prüft das Tool automatisch, ob Pflichttexte fehlen oder leer sind.
- Die Qualitätsprüfung meldet Textfehler direkt mit einfachem nächsten Schritt.


## Update 2026-02-22 (Start/CI robust)
- Reparatur mit `apt-get` prüft jetzt zuerst Root/Sudo (Administratorrechte) und zeigt klare nächste Schritte.
- Installationsfehler stehen sichtbar in `logs/install.log` (Protokolldatei).
- Gates und CI nutzen konsistent `python3`; CI startet keine Reparatur mehr im Runner.


## Update 2026-02-22 (Check/Fix + Fallback)
- Qualitätsprüfung kann jetzt klar getrennt laufen: `--check` (nur prüfen) und `--fix` (mit Korrekturen).
- Wenn `rg` fehlt, nutzt das System automatisch `find` (langsamer, aber stabil).
- Warnungen erklären jetzt klar, dass optionales Werkzeug fehlt, aber die Prüfung weiterläuft.

### Nächste sinnvolle Befehle
- `bash tools/run_quality_checks.sh --check`
- `bash tools/run_quality_checks.sh --fix`
- `bash start.sh --check --debug`

## Update 2026-02-22 (Validierung + Reparatur robuster)
- Theme-Prüfung akzeptiert jetzt beide gültigen Formate (Liste oder Objekt mit Farben).
- Netzprüfung hat einen Fallback über DNS (Namensauflösung), falls `curl` fehlt oder blockiert ist.
- Quality/Gates laufen konsistenter, weil Shell-Dateien einheitlich formatiert werden.

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh`

## Update 2026-02-22 (README-Anker + Start-Feedback)
- Die wichtigsten Befehle stehen jetzt direkt am Anfang der README und zusätzlich ganz unten als Spickzettel.
- Beim Start sehen Sie jetzt einen Kurzstatus mit Zahlen: geprüft, automatisch gelöst, offen.
- Wenn noch etwas offen ist, kommt ein klarer Hinweis zum Release-Check mit nächstem Befehl.

### Nächste sinnvolle Befehle
- `bash start.sh --check`
- `bash start.sh --release-check`
- `cat logs/status_summary.txt`


## Update 2026-02-22 (Projektpfad + sichere Ausgabe)
- Der Projektdialog öffnet sich jetzt nur noch automatisch, wenn der Pfad fehlt oder ungültig ist.
- Pfade mit doppelten Leerzeichen werden nicht hart blockiert: Das Tool speichert und zeigt einen klaren Warnhinweis.
- Einzelfenster werden jetzt ohne `innerHTML` aufgebaut (sicherere Textausgabe).

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh --ux-check-auto`

## Update 2026-02-22 (README-Gate automatisiert)
- Die Qualitätsprüfung kontrolliert jetzt automatisch, ob die README oben die wichtigsten Befehle und unten den Spickzettel enthält.
- Wenn ein Pflichtbefehl fehlt, zeigt das Tool eine klare Fehlermeldung mit nächstem Schritt zum Korrigieren.
- Dadurch wird die Dokumentation zuverlässiger, auch wenn mehrere Personen parallel arbeiten.

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh`


## Update 2026-02-22 (Offline-Simulationsjob)
- CI enthält jetzt einen zusätzlichen Offline-Testlauf ohne Internet (Simulation).
- `start.sh` kann Offline absichtlich simulieren und gibt klare nächste Schritte aus.
- Das hilft früh zu sehen, ob ein Release auch in restriktiven Umgebungen stabil bleibt.

### Nächste sinnvolle Befehle
- `PROVOWARE_FORCE_OFFLINE=1 OFFLINE_ARTIFACT_MODE=warn bash start.sh --check`
- `PROVOWARE_FORCE_OFFLINE=1 OFFLINE_ARTIFACT_MODE=warn python3 tools/smoke_test.py --profile quick`
- `bash tools/run_quality_checks.sh --check`


## Update 2026-02-22 (Footer + Theme-Hilfe)
- Der Footer zeigt jetzt echte Werte: Version, aktiver Projektpfad und Backup-Status.
- Die Theme-Hilfe zeigt eine kurze Kontrast-Vorschau als Text (Verhältnis), damit nicht nur Farben entscheiden.
- Die Theme-Liste ist jetzt überall gleich (balanced, high-contrast, light, dark).

### Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py`
- `bash start.sh --ux-check-auto`


## Update 2026-02-22 (Backup-Schalter sichtbar)
- Sie können Auto-Backup jetzt direkt im Einstellungsbereich ein- oder ausschalten.
- Der Status wird als Text gezeigt (nicht nur Farbe), damit es leichter verständlich bleibt.
- Wenn ein alter, ungültiger Wert gefunden wird, setzt das Tool automatisch auf sicheren Standard „Aktiv" zurück und erklärt das im Protokoll (Log = Aufzeichnung).

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh --ux-check-auto`


## Update 2026-02-22 (kurz)
- Neu: Export-Dateiname ist Linux-kompatibel und trägt den Arbeitsstatus direkt im Namen.
- Neu: Der letzte Dateiname wird im Dashboard als Text angezeigt (barrierearm für Screenreader).
- Neu: Smoke-Test prüft diese Stelle automatisch.

### Nächste sinnvolle Befehle
- `python -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python tools/smoke_test.py`
- `bash start.sh --ux-check-auto`
