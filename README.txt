# Provoware HTML Tool

## Offene Punkte (oben, kurz)

1. Backup-Dialog im Dashboard
2. Backup-Hook mit Dialog verbinden

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

1. **Janger-Archiv-Modul**
   - Archive, Roots und Stil anlegen, bearbeiten, sortieren
     (Alphabetlisten), importieren und exportieren.
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

Tipp:
Nutze **Kontrast+** bei Leseschwierigkeiten.

## Debugging und Logging

Wenn etwas nicht klappt:
1. `bash start.sh`
2. `npm test`
3. `node tools/help_cli.js logs`
4. Reparieren und erneut prüfen

Log-Ziele:
- einfache Erklärung für Laien
- technische Details für Entwicklung

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
