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
