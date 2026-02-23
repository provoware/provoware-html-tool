## Update 2026-02-23 (Header-Verlauf Projekte + Schnellwahl + Smoke-Marker)
- Header zeigt jetzt „Zuletzt genutzt (maximal 5)" als tastaturfreundliche Schnellliste für Projektpfade.
- Projektpfad-Speicherung validiert Eingabe/Ausgabe und hält Verlauf ohne Duplikate stabil (neueste zuerst).
- Smoke-Test prüft neue Marker für Verlaufsliste und Schnellwahl-Aktion automatisch.

## Update 2026-02-23 (3x3-Gleichgröße + Scroll + Header-Project-Switch)
- Haupt-Grid nutzt jetzt 3x3 mit gleich großen Feldern im Normalmodus; jede Zelle ist scrollbar, damit Inhalte nicht abgeschnitten werden.
- Untermodule nutzen größere Standard-Bediengrößen (Buttons und Schrift) für bessere Lesbarkeit und Touch-/Tastatur-Bedienung.
- Projektwechsel ist zusätzlich direkt im Header erreichbar; die Topbar ist sticky (haftend) und verdeckt Inhalte nicht mehr.

## Update 2026-02-23 (Header-Freigabe + flexibles Grid-Maximieren)
- Header überlappt den Hauptbereich nicht mehr: Die obere Zeile wächst jetzt automatisch mit dem Live-Protokoll.
- Untermodul-Maximieren nutzt jetzt die volle Grid-Fläche (ganzer 3x3-Bereich), statt nur visuell zu skalieren.
- Projekt-Kontext + Globale Suche wurden aus dem Hauptbereich in „Hauptmodul Einstellungen" rechts verschoben, damit das Dashboard im Zentrum ruhiger und klarer bleibt.

## Update 2026-02-22 (Footer-Schnellfunktionen + Sidebar-Hinweise)
- Footer ist jetzt klar 3-spaltig: Status, Datensicherung und Schnellfunktionen (Speichern, Erneut versuchen, Protokoll öffnen).
- Sidebar-Module zeigen jetzt automatische Kurzdetails als Tooltip + Screenreader-Label mit Next Step.
- Smoke-Test prüft die neuen Marker (Footer-Schnellfunktionen + Hinweis-Initialisierung) automatisch.

## Update 2026-02-22 (Grid-Layout und Untermodule korrigiert)
- Untermodule rutschen bei Aktivierung jetzt in den nächsten freien Platz im 3x3-Grid.
- Fensteroptionen sind als Symbole direkt im jeweiligen Untermodul sichtbar (nicht mehr als separate Leiste unter dem Header).
- Schnellhilfe mit Next Steps wurde in den rechten Bereich verschoben; zusätzlich gibt es ein neues nutzerorientiertes To-Do-Untermodul mit Datumsfeld.
- Genres, Stimmungen und Stile haben jetzt getrennte Eingabefelder; Enter bestätigt die Eingabe direkt.
- Gate-Hinweis: Voller Smoke-Test kann in restriktiven Umgebungen beim Browser-E2E wegen gesperrtem Playwright-Download (403) scheitern; Offline-Mirror ist eingeplant (`./start.sh --offline-pack`).

# provoware-html-tool

Leicht verständliches Werkzeug für ein barrierearmes HTML-Dashboard.

Das Projekt liefert eine **vollautomatische Start-Routine**, die Voraussetzungen prüft, Probleme möglichst selbst behebt und klare Nutzerhinweise ausgibt.

## Wichtigste Befehle (Sofort sichtbar)
Wenn Sie direkt in der Konsole arbeiten, starten Sie mit diesen Befehlen:

```bash
bash start.sh --check           # prüft Voraussetzungen und Grundqualität
bash start.sh --repair          # behebt fehlende Werkzeuge so weit wie möglich automatisch
bash start.sh --full-gates      # führt alle Pflicht-Gates in fixer Reihenfolge aus
bash start.sh --release-check   # zeigt klar, was für Release noch fehlt
cat logs/status_summary.txt     # kurze, barrierearme Zusammenfassung der letzten Ausführung
```

## Update 2026-02-22 (Grid-Dashboard-Module abgeschlossen)
- Hauptbereich ist jetzt ein leeres 3x3-Grid mit klaren Rasterfeldern und dynamischer Modulfläche.
- Neues Sammelmodul **„Genres-Archiv + Zufall + Liste“** liegt standardmäßig in der Sidebar und wird nur bei Aktivierung in die Mitte gebracht.
- Debugging und Entwickleroptionen sind als eigenes Einzelmodul getrennt; andere Bereiche bleiben im Hauptbereich ausgeblendet, bis sie aktiv geöffnet werden.

### Nächste sinnvolle Befehle
- `python3 -m compileall -q .`
- `bash tools/run_quality_checks.sh`
- `python3 tools/smoke_test.py --profile quick`
- `bash start.sh --ux-check-auto`

## Entwicklungsstand
- Fortschritt: **97%**
- **Abgeschlossen**
  - Start-Routine mit Auto-Check, Auto-Reparatur, Auto-Tests und Auto-Formatierung.
  - Feste Qualitäts-Gates (Syntax, Qualität, Smoke, End-to-End-Start, Mini-UX-Check).
  - Barrierefreiheit mit Tastaturfokus, Kontrast-Checks und verständlichen Fehlermeldungen.
  - Saubere Projektstruktur: System, Konfiguration, Werkzeuge und variable Daten sind getrennt.
  - Mehrere Themes für robustes Farb- und Kontrastverhalten.
- Robuste Portlogik: GUI nutzt zufällige, freie Nicht-Systemports (20000–60999) und sucht bei Portfehlern automatisch einen Alternativ-Port.

- Responsive Feinanpassung für sehr kleine Displays (bis 420px) mit besserem Fokus, klaren Abständen und stabiler Lesbarkeit.

- Neues Untermodul **„GMS-Archiv“** als integrierte Hauptmodul-Karte: Bulk-Import per Komma, Zufallsgenerator (Genres/Stimmungen/Stile), Verlauf mit Kopieren/Löschen/Export-Import-Merge und klare Laien-Feedbacktexte.

- Projekt-Routine beim GUI-Start: fragt den Projektordner ab, validiert den Pfad, erstellt fehlende Ordner automatisch im Nutzerverzeichnis und zeigt den aktiven Pfad im Dashboard.
- Spiegelt den bestätigten Projektordner zusätzlich nach `config/project_settings.json` (für editierbare Konfiguration) und validiert beide JSON-Dateien automatisch.
- Dashboard-Standardansicht nutzt jetzt ein leeres 3x3-Haupt-Grid mit Fensteroptionen (Ausblenden, Maximieren, Vollsicht wiederherstellen).
- Dashboard-Header zeigt ein Echtzeit-Log (letzte 10 Ereignisse), bietet eine Kopierfunktion für das Gesamtprotokoll und einen Laien-/Profi-Modus-Schalter.

- Offene UX-/Layout-Roadmap aus der 20-Punkte-Liste wurde auditiert und priorisiert (P0/P1) in `todo.txt` übernommen.

- Neue Layout-Profile im Dashboard: „Layout speichern“ und „Gespeichertes Layout laden“ sichern Fensterzustand lokal und stellen ihn wieder her.
- A11y-Erweiterung: Textgrößen-Skala S/M/L/XL mit lokaler Speicherung und klarer Statusrückmeldung.
- Einheitliche Card-Status-Badges (Bereit/Lädt/Fehler) als Text + Label statt nur Farbe für bessere Verständlichkeit.
- Neu in dieser Iteration: Quality-Skript mit Modus `--check` (nur prüfen) und `--fix` (mit Formatierung), damit Teams sauber zwischen CI-Prüfung und lokaler Korrektur trennen können.
- Neu in dieser Iteration: Projektdialog öffnet sich beim Start nur noch, wenn kein gültiger Projektpfad vorhanden ist (ruhigerer Erststart).
- Neu in dieser Iteration: Pfad-Eingabe mit doppelten Leerzeichen wird nicht mehr hart blockiert, sondern mit verständlichem Warnhinweis gespeichert.
- Hilfe/Sicherheit: Einzelfenster-Inhalt wird ohne `innerHTML` aufgebaut (robuster gegen fehlerhafte Inhalte) und bleibt für Laien klar lesbar.
- Neu in dieser Iteration: Start-Routine nutzt jetzt einen robusten Dateilisten-Fallback ohne `rg` (automatisch `find`), inklusive klarer Nutzerhinweise.
- Hilfe-/Textpunkt: Fehlende optionale Suche (`rg`) wird verständlich erklärt („langsamer, aber funktionsfähig“) und mit Next Step versehen.
- Neu in dieser Iteration: Quality-Gate prüft automatisch, ob README oben den Sofortblock und unten den Konsolen-Spickzettel vollständig enthält (mit klarer Fehlerhilfe).



- Neu in dieser Iteration: Hauptbereich hat jetzt eine klare Control-Bar (Projektpfad, globale Suche, primäre Aktion „Projekt wechseln") für konsistente Orientierung.
- Neu in dieser Iteration: Rechter Bereich enthält jetzt einen dauerhaften Kontext-Inspector (Details/Hilfe/Meta/Shortcuts) statt versteckter Kontextinfos.
- Neu in dieser Iteration: Quick-Actions-Overlay per F1/? ergänzt (filterbare Shortcut-Liste mit einfacher Hilfe und Next Steps).
- Neu in dieser Iteration: Footer zeigt jetzt echte Live-Werte (Version, aktiver Projektpfad, Backup-Status) statt statischer Platzhaltertexte.
- Neu in dieser Iteration: Theme-Hilfe ergänzt eine klare Kontrast-Vorschau pro Theme (Text statt nur Farbe).
- Neu in dieser Iteration: Theme-Liste in `config/themes.json` ist mit Dashboard und Validierung harmonisiert (`balanced`, `high-contrast`, `light`, `dark`).
- Neu in dieser Iteration: Sichtbarer Auto-Backup-Schalter im Einstellungsbereich mit klarer Hilfe in einfacher Sprache (Ein/Aus + nächster Schritt).
- Neu in dieser Iteration: Backup-Einstellung wird robust validiert (nur true/false); ungültige Werte werden automatisch auf „Aktiv“ korrigiert und im Debug-Log erklärt.
- Neu in dieser Iteration: Smoke-Test prüft jetzt feste Backup-A11y-Marker (`backup-switcher`, Hilfetext, Statusausgabe) für stabile UI-Qualität.
- Neu in dieser Iteration: Modul-Starter zeigt Kurzdetails zur konfigurierten Datenquelle bereits bei der Auswahl (vor dem Öffnen) für transparente Entscheidungen.
- Neu in dieser Iteration: Projektordner-Feld in der Control-Bar startet ohne voreingestellten Standardwert und verlangt bewusst eine gültige Eingabe.
- Hilfe-/A11y-Punkt: Smoke-Test prüft jetzt feste Marker für die neue Kurzdetails-Zeile und den standardfreien Projektpfad-Einstieg.
- **Offen**
  - (Erledigt) Optionaler CI-Job für Offline-Simulation (ohne Internet).
  - Gate-Hinweis: Voller Smoke-Test kann in restriktiven Umgebungen beim Browser-E2E wegen gesperrtem Playwright-Download (403) scheitern; dafür Offline-Mirror einplanen.
  - (Erledigt) Modul-Interoperabilität ausgebaut: Projektordner-Dialog ohne Standardordner, modulbezogene Sidebar-Optionen, Drag&Drop/CRUD im Genres-Archiv, Profilarchive (default/techno/hörspiele) und Abkopplung in Einzelfenster.
  - (Erledigt) Modul-Starter ist jetzt an konfigurierbare Datenquellen gekoppelt (`config/module_sources.json`) und zeigt transparente Kurzdetails je Modul.



## Modul-Starter mit echten Datenquellen (neu)
Der Modul-Starter nutzt jetzt eine zentrale Konfiguration in `config/module_sources.json`.

- Jede Modulauswahl prüft Eingaben (Input-Validierung) und zeigt die aktive Datenquelle direkt als Text an.
- Die Nutzerinfo ist transparent: Modulname, Datenquelle, kurze Erklärung und nächster Befehl werden im Debug-Bereich angezeigt.
- Bei Fehlern (z. B. ungültige Auswahl oder fehlende Datenquelle) wird eine klare Meldung mit Next Step ausgegeben.

Beispiel:
```bash
bash start.sh
# im Dashboard: Modul wählen -> „Modul öffnen“
```

## Hinweis zum GUI-Start (Hauptmodul)
Standardmäßig öffnet `bash start.sh` jetzt direkt die Hauptmodul-Ansicht (Dashboard) statt nur der Startstatus-Seite.

- Standard: `GUI_ENTRY=dashboard` (Hauptmodul)
- Alternative: `GUI_ENTRY=status` (nur Startstatus)
- Ungültige Werte werden validiert und mit klarer Fehlermeldung + Next Step abgewiesen.

## Schnellstart (für Einsteiger)
```bash
bash start.sh
```

Wenn etwas nicht funktioniert:
1. `bash start.sh --check` (prüft alle Voraussetzungen)
2. `bash start.sh --repair` (versucht Probleme automatisch zu beheben)
3. `bash start.sh --full-gates` (führt alle Pflichtprüfungen komplett aus)

## Wichtige Befehle mit einfacher Erklärung
```bash
bash start.sh --help            # zeigt alle Optionen
bash start.sh --check           # Auto-Prüfung (Checks)
bash start.sh --repair          # Auto-Reparatur (abhängige Pakete/Fehlerpfade)
bash start.sh --format          # Auto-Formatierung (einheitlicher Code-Stil)
bash start.sh --test            # automatische Tests
bash start.sh --autopilot       # strikter Auto-Ablauf (Check -> Repair -> Format -> Test)
bash start.sh --full-gates      # alle Pflicht-Gates in Reihenfolge
bash start.sh --weakness-report # Bericht zu Schwachstellen
bash start.sh --release-check   # Release-Checkliste ausführen
python tools/smoke_test.py      # schneller Funktionstest
OFFLINE_ARTIFACT_MODE=warn python tools/smoke_test.py --profile full # Offline-Artefakte nur als Warnung behandeln
OFFLINE_ARTIFACT_MODE=strict bash start.sh --test # strenger Modus: ungültige Werte werden sofort gestoppt
bash tools/run_quality_checks.sh --check # Qualitätsprüfungen nur lesend (CI-sicher)
bash tools/run_quality_checks.sh --fix   # Qualitätsprüfungen + Formatierung (lokaler Fix)
```

## Pflicht-Gates (Reihenfolge)
1. `python -m compileall -q .`
2. `bash tools/run_quality_checks.sh`
3. `python tools/smoke_test.py`
4. `bash start.sh`
Hinweis für reine Offline-Umgebungen:
- Standard ist `OFFLINE_ARTIFACT_MODE=warn` (fehlende Offline-Artefakte = Warnung mit Next Steps).
- Optional streng: `OFFLINE_ARTIFACT_MODE=strict` (fehlende Offline-Artefakte = Fehler).

5. Mini-UX-Check (deutsche Dialoge, Next Steps, Kontrast/Fokus)


Hinweis zur Portwahl:
- Ohne `GUI_PORT` wird ein freier Zufallsport zwischen `20000` und `60999` genutzt.
- Ist ein gesetzter Port belegt, wählt die Start-Routine automatisch einen freien Alternativ-Port.
- Fehlertexte zeigen immer Next Steps in einfacher Sprache.

## Nutzerfeedback der Start-Routine
Die Start-Routine meldet immer verständlich:
- **Geprüft:** Was wurde getestet?
- **Fehlt:** Was fehlt noch?
- **Gelöst:** Was wurde automatisch behoben?
- **Nächster Schritt:** Was soll ich jetzt tun?

## Ordnerstruktur (für Wartbarkeit)
- `system/` = stabile Kernlogik
- `config/` = Einstellungen und Themes
- `tools/` = Prüf- und Testskripte
- `templates/` = HTML-Vorlagen
- `data/` = variable Daten (z. B. Versionsregister)
- `logs/` = Protokolle für Debugging

## Barrierefreiheit (Accessibility)
- Einfache Sprache in Dialogen.
- Bedienung per Tastatur ohne Maus.
- Kontrast-Checks über mehrere Themes.
- Fehlertexte mit klaren, direkten Lösungsschritten.


## Professionelle Abhängigkeitsauflösung (neu)
Die Start-Routine kann Abhängigkeiten jetzt über eine zentrale Zuordnung in `config/dependency_map.json` auflösen.

- Vorteil: Paketnamen sind pro Paketmanager sauber gepflegt (apt, brew, pip).
- Praxis: `--repair` und Auto-Checks nutzen diese Zuordnung automatisch.
- Hilfe für Einsteiger: Bei Fehlern werden immer klare Next Steps ausgegeben (erneut versuchen, Reparatur starten, Protokoll öffnen).

## Offline-Fähigkeit (inklusive Playwright)
Die Start-Routine nutzt jetzt einen robusteren Offline-Weg:
- Browsercache-Ordner: `data/playwright-browsers`
- Wheel-Ordner für Python-Pakete: `data/offline_wheels`
- Repair-Logik: zuerst offline aus lokalen Artefakten, danach optional online

Beispiel (online vorbereiten, später offline nutzen):
```bash
python3 -m pip download playwright -d data/offline_wheels
PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 -m playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 tools/browser_e2e_test.py
```

## Häufiger Fehler SC2155 (einfach erklärt)
Wenn `shellcheck` meldet „Declare and assign separately“ (SC2155), dann wurde eine Variable direkt bei `local` gesetzt.

Sichere Lösung (Best Practice):
```bash
local paket_datei
paket_datei="wert"
```

Schnelle Prüfung:
```bash
bash start.sh --check --debug
bash tools/run_quality_checks.sh
```

## Debugging und Logging
```bash
bash start.sh --check --debug
cat logs/start.log
cat logs/status_summary.txt
```

## Team-Standardablauf
1. Vor jeder Änderung: `bash start.sh --check`
2. Vor Commit: `bash start.sh --format && bash start.sh --test`
3. Vor Merge: `bash start.sh --full-gates`
4. Nach jeder Iteration: `README.md`, `CHANGELOG.md`, `todo.txt`, `data/version_registry.json` aktualisieren

## Zwei kurze Laienvorschläge
- Starten Sie immer zuerst mit `--check`, das spart Zeit bei der Fehlersuche.
- Nutzen Sie bei Unsicherheit `--repair`; danach erneut `--check` ausführen.

## Detaillierter nächster Schritt (einfach erklärt)
Führen Sie `bash start.sh --full-gates` aus und lesen Sie danach `logs/status_summary.txt`.
So sehen Sie in Klartext, welche Prüfung erfolgreich war und welche nächste Aktion empfohlen wird.

## Projektordner-Routine (neu)
Beim Start der GUI läuft jetzt zuerst eine Projekt-Routine:
- Fragt den Projektordner ab (Interaktion im Terminal oder über `PROJECT_FOLDER=/pfad`).
- Prüft den Pfad per Input-Validierung.
- Erstellt fehlende Ordner transparent im Nutzerverzeichnis.
- Speichert den aktiven Pfad in `data/project_context.json` und zeigt ihn im Dashboard an.

Beispiele:
```bash
bash start.sh
PROJECT_FOLDER=/home/$USER/Provoware-Projekte/MeinProjekt bash start.sh
```


## Offline-Paket in einem Befehl (neu)
Für Systeme ohne Internet gibt es jetzt einen direkten Export:

```bash
bash start.sh --offline-pack
```

Was passiert automatisch:
1. Prüft und ergänzt Playwright-Artefakte (Wheels + Browsercache), soweit möglich.
2. Bündelt `data/offline_wheels` und `data/playwright-browsers` als Archiv in `data/`.
3. Zeigt klare Next Steps in einfacher Sprache.

Typischer Einsatz:
```bash
# Online vorbereiten
bash start.sh --offline-pack

# Archiv auf Offline-Rechner kopieren und dort entpacken
tar -xzf data/offline_bundle_YYYYMMDD_HHMMSS.tar.gz -C .
```


## Audit-Update (2026-02-22, Nutzerliste P0/P1/P2)
- Der Backlog wurde als Statusprüfung neu bewertet: **1 Punkt erledigt, Rest priorisiert offen**.
- Die offenen Punkte sind jetzt testbar in `todo.txt` als eigener Audit-Block gepflegt.
- `WAITME.md` fasst den Stand laienverständlich zusammen (Blocker, Risiken, empfohlene Befehle).


## Iteration-Update (2026-02-22): Stabiler Dashboard-Start + robustere Bedienung
- **Punkt 1 (Stabilität):** Das Dashboard verarbeitet fehlende Modulquellen jetzt fail-safe. Bei Direktaufruf ohne Start-Routine gibt es klare Hilfe statt Script-Abbruch.
- **Punkt 2 (Bedienung):** Klicks nutzen robuste Delegation mit `closest('[data-action]')`. Dadurch funktionieren Buttons auch bei verschachtelten Elementen zuverlässig.
- **Punkt 3 (A11y/Theme):** Start-Theme wird konsistent aus gültiger Voreinstellung gewählt (kein harter Wechsel auf `balanced`).

**Fortschritt:** 89% (stabilere Frontend-Laufzeit + bessere Tastatur/Klick-Resistenz umgesetzt; offen bleiben CI-/Repair-Themen).

**Offen:**
- Auto-Reparatur mit klarer Sudo/Root-Rückmeldung weiter absichern.
- UI-Tests um Theme-Persistenz (Speichern/Wiederherstellen) erweitern.


## Iteration-Update (2026-02-22): Texte zentral in JSON + Validierung
- **Punkt 1 (Wartbarkeit):** Texte sind jetzt aktiv in `config/messages.json` ausgelagert und werden von `start.sh` mit Fallback geladen.
- **Punkt 2 (Qualität):** Die Start-Routine validiert bei jedem Laden, ob alle Pflichttexte vorhanden und nicht leer sind (Input-Validierung + Output-Check).
- **Punkt 3 (Hilfe/A11y):** `tools/run_quality_checks.sh` prüft `config/messages.json` automatisch und gibt klare Next Steps in einfacher Sprache.

**Antwort auf die Frage „Sind Texte im Tool in JSON ausgelagert?“:** Ja. Die zentrale Datei ist `config/messages.json`; bei Fehlern nutzt das Tool sichere Standardtexte.


## Update 2026-02-22 – Start-/CI-Härtung (3 Punkte)
- `apt-get`-Reparatur läuft nur noch mit Root/Sudo (Administratorrechten) und gibt klare Next Steps, wenn Rechte fehlen.
- Installer-Fehler werden in `logs/install.log` geschrieben und als direkter Befehl `cat logs/install.log` angezeigt.
- Pflicht-Gates und CI nutzen jetzt konsistent `python3`; der CI-Job ist von `--repair` entkoppelt, damit Runner ohne Root stabiler bleiben.


## Iteration-Update (2026-02-22): Validierung und Auto-Reparatur robuster
- **Punkt 1 (Qualität):** Theme-Validierung akzeptiert jetzt beide gültigen Standards: einfache Theme-Liste oder detailliertes Farbobjekt.
- **Punkt 2 (Stabilität):** Netzprüfung nutzt `curl` und zusätzlich einen python3-DNS-Fallback, damit Reparatur seltener fälschlich „offline“ meldet.
- **Punkt 3 (Einheitliche Standards):** Shell-Dateien laufen konsistent durch shfmt-Checks, damit Gates reproduzierbar grün bleiben.

**Hinweis in einfacher Sprache:** Wenn ein Check fehlschlägt, folgen Sie direkt den „Nächster Schritt“-Hinweisen im Terminal.


## Iteration-Update (2026-02-22): README-Struktur wird automatisch geprüft
- **Punkt 1 (Qualität):** Neues Prüfskript validiert Pflichtanker in der README (Top-Befehle + Spickzettel) mit Input- und Output-Check.
- **Punkt 2 (Automatik):** `tools/run_quality_checks.sh` führt die README-Prüfung fest im Gate aus, damit Abweichungen sofort auffallen.
- **Punkt 3 (Hilfe/A11y):** Fehlermeldungen nennen in einfacher Sprache den nächsten Schritt, damit auch Einsteiger die Doku schnell reparieren können.

## Was fehlt noch für Release?
Aktuell fehlen vor allem diese Punkte für eine stabile Freigabe (Release):

1. Offline-fähige Bereitstellung für `shellcheck`/`shfmt` ohne Warnungen in restriktiven Umgebungen.
2. Stabiler Browser-E2E ohne externen Download (z. B. interner Mirror für Playwright-Browser).
3. Abschluss der offenen P0/P1-UX-Punkte aus `todo.txt` (inklusive Theme-Vorschau und Modul-Interoperabilität).

Empfohlener Prüfpfad:

```bash
bash start.sh --repair
bash start.sh --full-gates
bash start.sh --release-check
```


## Update 2026-02-22 – Offline-Simulationsjob + klare Laienhilfe (3 Punkte)

### Scope-Kontrolle
- **Problem:** Ein offener Punkt war ein echter CI-Testlauf ohne Internet, damit Offline-Risiken früher sichtbar werden.
- **Ziel:** CI soll einen zusätzlichen Offline-Simulationslauf haben und `start.sh` soll dafür ein klares, erklärendes Feedback geben.
- **Dateien:** `.github/workflows/full-gates.yml`, `start.sh`, `README.md`, `todo.txt`, `CHANGELOG.md`, `WAITME.md`, `data/version_registry.json`.
- **Patch-Block je Datei:**
  - `.github/workflows/full-gates.yml`: neuer Job `offline-simulation-check` mit `PROVOWARE_FORCE_OFFLINE=1`.
  - `start.sh`: Netzprüfung respektiert jetzt die Offline-Simulation und meldet klare nächste Schritte.
  - `README.md`: neue Befehle und Erklärung zur Offline-Simulation in einfacher Sprache.
  - `todo.txt`: offener CI-Punkt als erledigt markiert und Follow-up ergänzt.
  - `CHANGELOG.md`: Iterationsprotokoll der drei abgeschlossenen Punkte ergänzt.
  - `WAITME.md`: Kurzstatus und nächste Befehle für Menschen aktualisiert.
  - `data/version_registry.json`: Versionsstände der geänderten Dateien aktualisiert.
- **Abnahmekriterium:** CI-Workflow enthält einen separaten Offline-Job, und lokaler Lauf mit `PROVOWARE_FORCE_OFFLINE=1 bash start.sh --check` liefert erklärendes Feedback statt stiller Fehlersuche.

### Umsetzung (3 Punkte)
1. **CI:** Neuer Job `offline-simulation-check` führt compile/quality/smoke/start im Offline-Modus aus.
2. **Start-Routine:** `start.sh` unterstützt harte Offline-Simulation mit klaren Hinweisen und Next Steps.
3. **Hilfe/A11y-Text:** Dokumentation erklärt die neue Simulation in einfacher Sprache inklusive kompletter Befehle.

### Neue Befehle (offline simulieren)
```bash
PROVOWARE_FORCE_OFFLINE=1 OFFLINE_ARTIFACT_MODE=warn bash start.sh --check
PROVOWARE_FORCE_OFFLINE=1 OFFLINE_ARTIFACT_MODE=warn python3 tools/smoke_test.py --profile quick
```

## Konsolen-Spickzettel (immer unten angehängt)
Praktische Kurzliste zum Nachlesen am Ende der README:

```bash
bash start.sh --check
bash start.sh --repair
bash start.sh --format
bash start.sh --test
bash start.sh --full-gates
bash start.sh --release-check
cat logs/status_summary.txt
```


## Update 2026-02-22 (Linux-Dateiname + Export-Status)
- Export im GMS-Archiv erzeugt jetzt einen Linux-kompatiblen Dateinamen (nur sichere Zeichen).
- Der Dateiname enthält automatisch den Arbeitsstatus (`release-ready`, `review-ready`, `in-abstimmung`) und das Datum.
- Hilfe-/Statuszeile zeigt den letzten erzeugten Dateinamen direkt im Dashboard für klare Nachvollziehbarkeit.
