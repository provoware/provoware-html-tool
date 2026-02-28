# Provoware HTML Tool

Kurzfassung:
Dieses Projekt ist ein HTML-Werkzeug mit klarem Aufbau.
Es setzt auf Stabilität, einfache Bedienung und automatische Prüfungen.

## 1) Ziel

Das Projekt soll:
- für Laien verständlich sein,
- robust laufen,
- gut wartbar sein,
- und mit einem Befehl automatisch prüfen.

Wichtige Begriffe:
- **Kernel (Kern):** die stabile Grundlogik.
- **Validierung (Eingabeprüfung):** Daten werden vor Nutzung geprüft.
- **Versionierung (Versionen mit Historie):** ältere Zustände bleiben erhalten.
- **Barrierefreiheit (A11y):** Bedienung für möglichst alle Menschen,
  z. B. per Tastatur und mit gutem Kontrast.

## 2) Projektstruktur

Die Ordner sind klar getrennt:
- `system-core/` → Kernlogik
- `system-module/` → feste Module
- `config/` → Einstellungen, Texte, Manifeste
- `data/` → variable Daten und Versionen
- `tools/` → Start-, Prüf- und Diagnose-Werkzeuge
- `templates/` → UI-Vorlagen
- `test/` → automatische Tests
- `dummys/` → Dummys für Reparatur/Selbsttest

Warum das wichtig ist:
- Änderungen sind schneller auffindbar.
- Fehler sind leichter isolierbar.
- Reviews bleiben klein und klar.

## 3) Schnellstart (empfohlen)

```bash
bash start.sh
```

Die Start-Routine arbeitet vollautomatisch und gibt klares Feedback.

## 4) Was `start.sh` automatisch macht

1. Voraussetzungen prüfen
2. Fehlende Abhängigkeiten installieren
3. Code formatieren
4. Tests ausführen
5. Registry prüfen
6. Systemtest ausführen
7. Nächsten sinnvollen Schritt ausgeben

Wenn ein Fehler auftritt, folge den Hinweisen im Terminal.
Empfohlen sind immer klare nächste Schritte wie:
- **Erneut versuchen**
- **Reparatur starten**
- **Protokoll öffnen**

## 5) Qualität und Robustheit

Das Projekt folgt diesen Grundregeln:
- Jede Funktion prüft Input (Eingabe).
- Jede Funktion prüft Output (Ergebnis).
- Fehlertexte sind verständlich und lösungsorientiert.
- JSON-Schreiben erfolgt robust (atomar und versioniert).
- Kernbereiche werden per Manifest validiert.

## 6) Barrierefreiheit (A11y)

Der UI-Ansatz ist „Tastatur zuerst“:
- Tab/Shift+Tab in logischer Reihenfolge
- Enter/Space zum Auslösen von Aktionen
- Escape zum Schließen von Dialogen
- Fokus klar sichtbar
- Status nie nur über Farbe, immer auch über Text

Themes:
- Hell
- Dunkel
- Kontrast+

Tipp für viele Nutzende:
Nutze **Kontrast+**, wenn Text schwer lesbar ist.

## 7) Registry und Versionierung

Registry-Dateien:
- `data/registry.json` → aktueller Zustand
- `data/registry.current.json` → Zeiger auf aktive Version
- `data/registry_versions/registry_vXXXX.json` → ältere Stände

Manifest-Dateien:
- `config/manifests/global.manifest.json`
- `config/manifests/kernel.manifest.json`
- `config/manifests/registry.manifest.json`

## 8) Wichtige Befehle

```bash
bash start.sh
npm test
npm run format
node tools/help_cli.js test
node tools/help_cli.js logs
node tools/help_cli.js backups store
node tools/help_cli.js repair data/store.json data/store.backup.json
```

## 9) Debugging und Logging

Wenn etwas nicht klappt:
1. `bash start.sh`
2. `npm test`
3. `node tools/help_cli.js logs`
4. Danach gezielt reparieren und erneut versuchen.

Protokolle sollen zwei Ebenen liefern:
- einfache Erklärung für Laien,
- technische Details für Entwicklung/Analyse.

## 10) Doku

- Entwicklerdoku: `docs/ENTWICKLERDOKU.md`
- Hilfe: `docs/HILFE.md`
- Offene Fragen: `QUESTIONS_TODO.md`
- Verlauf: `CHANGELOG.md`

## 11) Laienvorschläge (konkret)

1. Starte immer mit `bash start.sh`.
2. Lies Fehlermeldungen komplett (inkl. nächster Schritt).
3. Nutze bei Anzeigeproblemen das Theme „Kontrast+“.
4. Öffne bei unklaren Fehlern zuerst das Protokoll.
5. Nutze Backup und starte dann den Test erneut.
