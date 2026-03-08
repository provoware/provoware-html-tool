# PATCH_DISZIPLIN_PRO.md

## Zielbild
Dieses Projekt wird ab sofort iterativ, patchbasiert, codesparsam und traffic-sparsam weiterentwickelt.

Jede Iteration verfolgt gleichzeitig diese Kernziele:

1. Effizienz der Umsetzung erhöhen
2. Wartbarkeit verbessern
3. Design und Layout verfeinern
4. Skalierung, Positionierung und Flexibilität ausbauen
5. Robuste Fehlervermeidung und Fehlerabfangung stärken
6. Nutzerfreundlichkeit konkret verbessern
7. Erweiterbarkeit der Default-Projektarchive steigern
8. Offene Stellen, Platzhalter und unfertige Bereiche systematisch erfassen und abbauen

---

## Harte Grundregeln
- Planung ist Gold, Handlung ist Silber.
- Immer nur den kleinsten sinnvollen Patch setzen.
- Nur exakt betroffene Dateien ändern.
- Nur exakt betroffene Stellen ändern.
- Keine kosmetischen Nebenänderungen.
- Keine globalen Umformatierungen.
- Keine unnötigen Dateioperationen.
- Keine neue Abhängigkeit ohne klare Begründung.
- Keine Volltests ohne Anlass.
- Keine Mehrfachprüfung unveränderter Bereiche.
- Keine breitflächigen Refactorings ohne separaten Auftrag.
- Jede Iteration muss echten Fortschritt erzeugen.
- Jede Iteration muss dokumentiert werden.
- Jede Iteration muss mindestens eine Verbesserung in Robustheit liefern.
- Jede Iteration muss mindestens eine Verbesserung in Nutzerfreundlichkeit liefern.
- Jede Iteration muss mindestens eine Verbesserung an den Default-Archiven liefern.
- Jede Iteration muss den Upgrade-Pool aktualisieren.
- Jede Iteration muss das Register für offene Stellen zuerst lesen und zuletzt aktualisieren.

---

## Pflichtdateien
Folgende Dateien sind verbindlich vorhanden und werden konsistent gepflegt:

1. `AGENTS.md`
2. `README.md`
3. `UPGRADE_POOL.md`
4. `code_scan_registry.json`

Optional, falls bereits vorhanden:
5. `todo.txt`
6. `CHANGELOG.md`
7. projektbezogene Default-Archive wie:
   - `templates*.json`
   - `genres*.json`
   - `moods*.json`
   - `styles*.json`
   - `stile*.json`

---

## Neue Pflichtdatei: UPGRADE_POOL.md
Falls nicht vorhanden, anlegen.

Zweck:
- Sammelbecken für unterschiedliche, nicht doppelte Optimierungsempfehlungen
- Aufgeteilt in:
  - `## Offen`
  - `## Erledigt`
- In jeder Iteration:
  - genau eine neue, von bisherigen Einträgen unterscheidbare Empfehlung hinzufügen
  - mit Grund
  - mit erwartetem Effekt
  - darunter zwei optimal passende Vorschläge ergänzen
- Wenn eine Empfehlung umgesetzt wurde:
  - aus `Offen` nach `Erledigt` verschieben
  - Status und Iteration ergänzen

Format:
- Tabellenformat verwenden
- Vorschläge direkt unter dem jeweiligen Tabelleneintrag aufführen

---

## Neue Pflichtdatei: code_scan_registry.json
Falls nicht vorhanden, anlegen.

Zweck:
- zentrale Erfassung offener Stellen im Code
- systematisches Beseitigen von:
  - TODO
  - FIXME
  - XXX
  - HACK
  - PLACEHOLDER
  - STUB
  - Dummy-Inhalten
  - temporären Texten
  - Provisorien
  - unklaren Kommentaren
  - leeren Fallbacks
  - unsauberen Defaultwerten
  - unvollständigen UI- oder Logikbereichen

Diese Datei wird:
- als erstes gelesen
- vor dem Patch berücksichtigt
- nach dem Patch aktualisiert
- als letztes erneut geschrieben

---

## Zielstruktur für code_scan_registry.json
Empfohlene Struktur:

{
  "meta": {
    "version": 1,
    "last_scan": "",
    "last_update_iteration": "",
    "scan_mode": "delta",
    "project_phase": ""
  },
  "stats": {
    "open_total": 0,
    "done_total": 0,
    "by_type": {},
    "by_priority": {}
  },
  "open": [
    {
      "id": "",
      "file": "",
      "line": 0,
      "type": "",
      "priority": "hoch",
      "summary": "",
      "details": "",
      "recommended_fix": "",
      "status": "offen",
      "created_in_iteration": "",
      "last_checked_iteration": ""
    }
  ],
  "done": [
    {
      "id": "",
      "file": "",
      "line": 0,
      "type": "",
      "summary": "",
      "resolution": "",
      "closed_in_iteration": ""
    }
  ]
}

---

## README-Pflicht: Kurzstatistik ganz oben
Im oberen Bereich der `README.md` eine knappe Mengenstatistik anzeigen.

Beispielinhalt:

- Offene Code-Stellen: X
- Erledigte Code-Stellen: Y
- Offene Upgrade-Empfehlungen: X
- Erledigte Upgrade-Empfehlungen: Y
- Default-Archive: X
- Letzte Iteration: X
- Scan-Modus: delta oder voll

Regel:
- nur Zahlen und knappe Statusinfos
- keine lange Erklärung
- oben sichtbar
- nur aktualisieren, wenn sich Werte verändert haben

---

## Verbindlicher Iterationsablauf
Jede Iteration folgt exakt dieser Reihenfolge:

### 1. Register zuerst lesen
- `code_scan_registry.json` zuerst lesen
- vorhandene offene Stellen erfassen
- Doppelarbeit vermeiden
- prüfen, welche offenen Stellen direkt zum aktuellen Patchbereich passen

### 2. Mini-Analyse vor jeder Änderung
Vor dem ersten Patch immer schriftlich festhalten:

1. Ziel der Iteration
2. Betroffene Dateien
3. Betroffene Blöcke oder Stellen
4. Patchgrund
5. Risiko
6. Bewusste Nicht-Änderungen
7. Minimalprüfplan
8. Welche Robustheitsverbesserung konkret erfolgt
9. Welche UX-Verbesserung konkret erfolgt
10. Welche Archiv-Erweiterung konkret erfolgt

Ohne diese Voranalyse kein Patch.

### 3. Delta-Scan statt Vollscan
Standard:
- nur geänderte Dateien scannen
- nur angrenzende oder logisch verbundene Blöcke prüfen
- nur bei Strukturwechsel, Major-Refactor oder erkannten Scan-Lücken vollständigerer Scan

Vollscan nur wenn:
- neue Projektphase beginnt
- viele neue Dateien hinzugekommen sind
- vorhandene Registry offensichtlich veraltet ist
- größere Architekturänderung erfolgt
- jede zehnte Iteration erreicht ist

### 4. Exaktes Patchen an Ort und Stelle
- keine Datei komplett neu schreiben, wenn nur Teiländerung nötig
- keine Struktur verschieben, wenn lokaler Patch genügt
- keine Hilfskonstrukte erzeugen, wenn bestehende Logik erweitert werden kann
- keine Duplikate einführen
- keine neuen Systeme schaffen, wenn bestehende sauber erweitert werden können

### 5. Pflichtverbesserungen je Iteration
Jede Iteration enthält mindestens diese drei konkreten Verbesserungen:

1. Robustheit
   - z. B. Guards, Fallbacks, Validierung, Null-Checks, defensive Defaults, Fehlertext, sichere Initialisierung

2. Nutzerfreundlichkeit
   - z. B. klarere Labels, bessere Defaultwerte, verständlichere Hinweise, konsistentere Buttons, bessere Leerzustände, skalierbare UI

3. Default-Archive
   - z. B. sinnvolle Ergänzung, Dublettenbereinigung, bessere Sortierung, Metadaten, Beschreibung, Kategorisierung, Erweiterung von Templates, Genres, Moods, Styles

### 6. Offene Stellen registrieren
Während der Iteration neu entdeckte offene Stellen direkt in `code_scan_registry.json` aufnehmen.

Regeln:
- nur echte offene Stellen eintragen
- keine belanglosen Schönheitsnotizen
- priorisieren
- kurz und präzise formulieren
- nachvollziehbare Fix-Empfehlung ergänzen

### 7. UPGRADE_POOL.md aktualisieren
In jeder Iteration:

- eine neue Empfehlung ergänzen, die sich klar von bisherigen unterscheidet
- in `## Offen` oder nach Umsetzung in `## Erledigt`
- Tabelleneintrag mit:
  - ID
  - Bereich
  - Empfehlung
  - Grund
  - erwarteter Effekt
  - Status
  - Iteration
- darunter genau zwei passende Folge-Vorschläge

### 8. README-Statistik aktualisieren
Nur Zahlen und Status oben anpassen, wenn sich Werte geändert haben.

### 9. Minimalprüfung nur betroffener Teile
Prüfen nur:
- geänderte Dateien
- direkt betroffene Funktionen, Komponenten, Styles oder Datenbereiche
- Importpfade, JSON-Struktur, offensichtliche Syntax, direkte Seiteneffekte

Nicht prüfen:
- weit entfernte unberührte Bereiche
- komplette Projektläufe ohne Anlass
- Vollintegrationstests ohne strukturellen Bedarf

### 10. Register zuletzt aktualisieren
Am Ende:
- `code_scan_registry.json` erneut aktualisieren
- erledigte Punkte verschieben
- neue Punkte eintragen
- Statistiken angleichen
- Zeitstempel setzen

---

## Scandisziplin für offene Stellen
Zu suchen ist bevorzugt nach:

- `TODO`
- `FIXME`
- `XXX`
- `HACK`
- `PLACEHOLDER`
- `STUB`
- `dummy`
- `temporary`
- `later`
- `not implemented`
- `coming soon`
- `pass`
- leere Arrays oder Defaults ohne Begründung
- leere Catch-Blöcke
- leere UI-Flächen
- unbeschriftete Buttons
- harte Magic Values ohne Erklärung
- tote CSS-Klassen
- ungenutzte Konfigwerte
- halbfertige Fallbacktexte

Wichtig:
- Standardmäßig nur in geänderten Dateien suchen
- angrenzende Datei nur dann mitziehen, wenn logisch direkt betroffen

---

## Patchdisziplin für Effizienz und minimalen Datentraffic
Die codesparsamste und traffic-kleinste Vorgehensweise ist verbindlich:

### Erlaubt
- lokale Patches
- kleine diff-orientierte Änderungen
- selektive Dateiprüfung
- delta-scan
- selektive Dokumentationsanpassung
- gezielte JSON-Aktualisierung
- kleine, nachweisbare UX- oder Robustheitsverbesserungen

### Verboten
- komplette Datei-Neuschreibungen ohne Not
- Vollprojekt-Scans in jeder Iteration
- breitflächige Formatierungsläufe
- ungezielte Mehrdateien-Patches
- globale Umbenennungen ohne echten Nutzen
- Volltest-Schleifen
- redundante Prüfungen identischer Zustände
- unnötige Log-Vergrößerung
- doppelte Doku an mehreren Stellen

### Begründung
Diese Disziplin reduziert:
- Tokenverbrauch
- Reviewaufwand
- Diff-Größe
- Merge-Risiko
- Seiteneffekte
- Fehlerwahrscheinlichkeit
- unnötige Dateibewegung
- unnötigen Datentraffic

---

## Design- und Layout-Fokus pro Iteration
Zusätzlich ist in jeder Iteration zu prüfen, ob lokal eine kleine Verbesserung in mindestens einem dieser Punkte möglich ist:

- flexiblere Skalierung
- bessere Positionierbarkeit
- sauberere Responsivität
- modernere visuelle Hierarchie
- bessere Abstände
- bessere Kontraste
- stabilere Komponentenbreiten
- logischere Panel-Struktur
- robustere Leerräume
- klarere Zustandsanzeigen
- sauberere Default-Darstellung
- geringere Layout-Bruchgefahr

Regel:
- nur lokal verbessern
- keine globale Designbaustelle eröffnen
- nur dann patchen, wenn direkt angrenzend oder mit geringem Zusatzaufwand sauber lösbar

---

## Archivpflege-Regel
Die Default-Archive werden nicht zufällig erweitert, sondern kontrolliert.

Pro Iteration:
- genau eine sinnvolle Archivverbesserung
- keine Dubletten
- keine unsortierten Masseneinträge
- keine unsauberen Begriffe
- semantisch saubere Gruppierung
- bei Bedarf Kurzbeschreibung oder Kategorie ergänzen

Beispiele:
- neues Template mit Einsatzzweck
- Genre sauberer gruppieren
- Mood-Werte verdichten
- Style-Namen vereinheitlichen
- Alias-Begriffe ergänzen
- ungültige oder doppelte Einträge bereinigen

---

## Dokumentationspflicht
Wenn durch den Patch fachlich nötig, mit aktualisieren:
- `README.md`
- `AGENTS.md`
- `UPGRADE_POOL.md`
- `code_scan_registry.json`
- `todo.txt`
- `CHANGELOG.md`

Regel:
Nur anpassen, wenn sich dort inhaltlich tatsächlich etwas geändert hat.

---

## Ausgabestandard pro Iteration
Nach jeder Iteration knapp dokumentieren:

1. Ziel
2. Geänderte Dateien
3. Geänderte Stellen
4. Warum genau dort
5. Was bewusst nicht geändert wurde
6. Robustheitsgewinn
7. UX-Gewinn
8. Archiv-Gewinn
9. Neue oder erledigte Registry-Punkte
10. Prüfungen nur betroffener Teile
11. Neue Upgrade-Empfehlung

---

## Arbeitsmaxime
Nicht maximal viel ändern.
Maximal sauber ändern.
Nicht maximal breit prüfen.
Maximal gezielt prüfen.
Nicht maximale Bewegung erzeugen.
Maximale Fortschrittsdichte erzeugen.

---

## Zusatzauftrag Iteration 1 (Kerninkonsistenzen)
Für die nächste Iteration gilt ein enger Pflichtfokus mit Minimal-Patch:

1. `module-registry.json`-Schema vereinheitlichen (`{"version":1,"moduleIds":[]}`)
2. Fallback-Modulliste fachlich angleichen
3. Theme-Fallback auf realen Theme-Key vereinheitlichen

Verbindliche Vorarbeit vor jedem Patch (kurz dokumentieren):
- betroffene Dateien
- betroffene Funktionen/Blöcke
- Ist-Verhalten
- Soll-Verhalten
- Risiken
- bewusst nicht geänderte Bereiche

Verbindliche Analyse-Suchbegriffe vor Patch:
- `module-registry.json`
- `moduleIds`
- `"modules"`
- `FALLBACK_MODULE_IDS`
- `dunkel`
- `defaultTheme`

Zusätzliche Nicht-Ziele in dieser Iteration:
- keine Slot-Engine
- `js/ui.js` nicht zerlegen
- keine Persistenzreform
- keine Startseiten-Neustruktur
- keine Accessibility-Runde
- keine Doku-Rundumerneuerung

Die Punkte sind zuerst in `todo.txt` als Checkbox-Aufgaben zu pflegen und danach exakt patchbasiert abzuarbeiten.
