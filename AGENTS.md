# AGENTS.md – Projektstandard provoware-html-tool
Version: 2.6

Ziel: Jede Iteration liefert **genau 3 kleine, vollständig abgeschlossene Punkte**, ist direkt merge-ready und verbessert Release-Reife, Barrierefreiheit und Laientauglichkeit.

---

## 1) Pflichtprinzip pro Iteration
Jede Iteration muss:
1. genau **3 klar getrennte Punkte** vollständig abschließen,
2. mindestens **1 Punkt für Hilfeelemente, Texte oder Barrierefreiheit** enthalten,
3. klein bleiben (smallest shippable change),
4. inklusive Doku + Checks merge-ready sein.

**Nicht erlaubt:**
- Halb-fertige Teilergebnisse,
- Nebenbei-Refactorings außerhalb des Scope,
- mehr als 4 geänderte Dateien pro Iteration (außer Pflicht-Doku-Dateien).

---

## 2) Scope-Kontrolle vor jedem Patch (kurz dokumentieren)
Vor Änderungen immer festhalten:
- Problem (1 Satz)
- Ziel (1 Satz)
- Dateien (Liste)
- Patch-Block je Datei (1 Block)
- Abnahmekriterium (1 testbarer Satz)

---

## 3) Technische Qualitätsregeln (verbindlich)
- Eingaben validieren (Input-Validierung), Ergebnisse bestätigen (Output-Check).
- Fehlertexte in einfacher Sprache mit klaren Next Steps (z. B. „Erneut versuchen“, „Reparatur starten“, „Protokoll öffnen“).
- Keine neuen Abhängigkeiten ohne klaren Nutzen.
- Einheitliche Standards und Formatierung erzwingen.
- Tool-Logik wartbar trennen:
  - `system/` Kernlogik,
  - `config/` Einstellungen,
  - `data/` variable Daten,
  - `tools/` Prüf- und Hilfsskripte,
  - `templates/` UI-Vorlagen.

---

## 4) Barrierefreiheit & UX (immer mitprüfen)
- Einfache deutsche Sprache, Fachbegriff in Klammern kurz erklären.
- Kontrast robust für mehrere Themes.
- Fokusfreundliche Bedienung (Tastatur zuerst).
- Status nie nur per Farbe, sondern immer zusätzlich als Text/Label.
- Mindestens ein Hilfeelement pro betroffenem Bereich verbessern.

---

## 5) Vollautomatische Start-Routine (Pflichtbild)
`start.sh` muss soweit möglich autonom arbeiten:
- Voraussetzungen automatisch prüfen,
- fehlende Abhängigkeiten sinnvoll automatisch auflösen,
- Formatierung und sinnvolle Tests automatisiert anstoßen,
- Nutzer klar informieren: geprüft, fehlt, gelöst, nächster Schritt.

Debug-/Logging-Modus muss laienverständlich bleiben und konkrete Lösungswege nennen.

---

## 6) Gates (Reihenfolge fix)
Alle Gates mit Exitcode 0:
1. `python -m compileall -q .`
2. `bash tools/run_quality_checks.sh`
3. `python tools/smoke_test.py`
4. `bash start.sh`
5. Mini-UX-Check (2 Minuten):
   - verständliche deutsche Dialoge,
   - Fehlerdialog mit Next Steps,
   - kein Crash im betroffenen Bereich,
   - Kontrast/Fokus geprüft.

Wenn ein Gate fehlschlägt:
- ein gezielter Fix in derselben Iteration,
- Gates erneut laufen lassen,
- bei erneutem Fehlschlag: in `todo.txt` als NEXT ITERATION dokumentieren.

---

## 7) Pflicht-Dokumentation pro Iteration
Immer aktualisieren:
- `README.md` (Fortschritt %, Abgeschlossen, Offen),
- `CHANGELOG.md` (Was, Warum, Wirkung),
- `todo.txt` (`DONE` + `NEXT` mit Datum),
- `data/version_registry.json` (global_version + geänderte Dateien).

Regel Version-Registry:
- `global_version` = Iterationsdatum `YYYY.MM.DD`.
- Jede geänderte Datei muss einen aktualisierten Eintrag erhalten.

---

## 8) Definition of Done
DONE nur wenn:
- 3 Punkte vollständig abgeschlossen,
- mindestens 1 A11y-/Hilfe-/Textpunkt erfüllt,
- merge-ready ohne Pflichtlücken,
- Gates grün oder sauber als NEXT ITERATION dokumentiert,
- README + CHANGELOG + todo + version_registry aktualisiert,
- Release-Reifegrad sichtbar erhöht.

---

## 9) Kurzes Iterations-Template
### A) Fundstelle
- Problem:
- Risiko:
- Erwartung:

### B) Scope
- Ziel:
- Dateien:
- Patch-Block je Datei:
- Abnahmekriterium:

### C) Umsetzung (3 Punkte)
- Punkt 1:
- Punkt 2:
- Punkt 3:

### D) Gates
- G1:
- G2:
- G3:
- G4:
- G5:

### E) Ergebnis
- Status: DONE / NEXT ITERATION
- Doku aktualisiert: README + CHANGELOG + todo + version_registry
- 2 Laienvorschläge:
- 1 detaillierter nächster Schritt (einfach erklärt):


## 10) Backlog-Audit aus Nutzerlisten (Pflicht bei Review-Aufträgen)
Wenn der Auftrag „prüfen was erledigt/offen ist“ enthält:
1. Jeden Punkt als **DONE/OFFEN** gegen Code+Skripte prüfen (keine Schätzung).
2. Ergebnis in `todo.txt` als eigener Audit-Block mit Datum dokumentieren.
3. Offene Punkte priorisiert und testbar formulieren (P0/P1/P2 + Abnahmehinweis).
4. Einen 3-Punkte-Vorschlag für die nächste Iteration ergänzen (mindestens 1 A11y/Hilfe/Text-Punkt).

## 11) WaitMe-Datei (Pflichtstatus)
- Datei `WAITME.md` pflegen als Kurzstatus für Menschen: 
  - aktueller Stand in einfacher Sprache,
  - Top-Blocker,
  - Betriebsrisiken,
  - nächste sinnvolle Befehle.
- Keine Fachbegriffe ohne Kurz-Erklärung in Klammern.
