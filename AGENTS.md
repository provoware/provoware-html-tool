# AGENTS.md
## 0) Grundregel (Atomare Iteration)
Jede Iteration muss:
 - genau **3 klar abgegrenzte Punkte** vollständig abschließen (nicht nur „anarbeiten“)
 - mindestens einen Punkt beinhalten, der eine sinnvolle Erweiterung der Hilfselemente, der Texte oder der Barrierefreiheit darstellt
 - alle Punkte so klein wie möglich halten (smallest shippable change)
 - merge-ready sein (Code + Doku + Checks erledigt)
 - den Release-Fortschritt messbar erhöhen

Maximal:
- 1 Problemklasse
- 1–4 Dateien
- 1 zusammenhängender Patch-Block pro Datei

Wenn mehr nötig ist: STOP → neue Iteration planen.

────────────────────────────────────────────────────────────

## 1) Scope-Kontrolle (bindend vor jedem Patch)
Vor dem Patch festhalten:
- Problem (1 Satz)
- Ziel (1 Satz)
- Exakte Dateien (Liste)
- Exakter Patch-Block je Datei (Zeilennummer)
- Abnahmekriterium „fertig“ (1 Satz, testbar)

 Verboten:
 - Nebenbei-Refactorings außerhalb des Patch-Blocks
 - Umbenennen/Umstrukturieren ohne zwingenden Grund
 - Mehr als 3 Punkte in einer Iteration
 - Teilergebnisse ohne klare Fertigstellung

────────────────────────────────────────────────────────────

## 2) Patch-Methodik (vollständig, klein, robust)
 - Nur notwendige Änderungen für die drei konkreten Punkte.
- Keine neuen Abhängigkeiten ohne zwingenden Bedarf.
- Jede betroffene Funktion validiert Eingaben (input) und bestätigt Ergebnis (output).
- Fehlerpfade enthalten klare Next Steps in einfacher Sprache.
- Mindestens ein Hilfeelement pro betroffener Stelle verbessern/ergänzen.
- vorher zelen der änderung ermitteln für genaues zielgerichtetes patchen 
────────────────────────────────────────────────────────────

## 3) Architektur- und Qualitätsstandards (verpflichtend)
- Einheitliche Standards und Best Practices in jedem Patch.
- Barrierefreiheit (Accessibility) immer mitdenken: verständliche Sprache, klare Kontraste, fokusfreundliches Verhalten.
- Farb-/Kontrastverhalten robust halten; mehrere Themes als unterstütztes Zielbild nicht brechen.
- Tool-Logik sauber trennen, Struktur wartbar halten.
- System-Dateien getrennt von variablen Dateien und Konfiguration organisieren.
- Debug- und Logging-Modus mit detaillierten, laienverständlichen Hinweisen pflegen.

────────────────────────────────────────────────────────────

## 4) Vollautomatische Prüfung & Start-Routine
Pflichtziel: Start-Routine prüft automatisch Voraussetzungen und löst Abhängigkeiten soweit möglich automatisiert auf.

Anforderungen:
- Bei Start klare Nutzer-Rückmeldung: was geprüft wurde, was fehlt, wie es gelöst wurde.
- Automatische sinnvolle Tests für Codequalität.
- Automatisches Code-Formatting als standardisierter Schritt.
- Fehlerausgaben enthalten einfache Lösungsvorschläge.

────────────────────────────────────────────────────────────


- deutsche, verständliche Dialoge im betroffenen Bereich
- Fehlerdialog mit Next Steps (z. B. „Erneut versuchen“, „Reparatur“, „Protokoll“)
- betroffene Funktion läuft ohne Crash
- Barrierefreiheit/Kontrast im betroffenen Bereich geprüft

- 1 gezielter Fix in derselben Iteration




────────────────────────────────────────────────────────────

## 6) Dokumentation (pro Iteration Pflicht)
### 6.0 README-Status
README regelmäßig aktualisieren (mindestens alle 2–3 Iterationen oder sofort bei kritischen Scope-/Release-Änderungen):
- exakte Prozentzahl Fortschritt (z. B. `81%`)
- Liste **Abgeschlossen**
- Liste **Offen**

### 6.1 CHANGELOG.md (Mini)
- 3 Zeilen: Was, Warum, Wirkung

### 6.2 todo.txt (Pflicht)
- `DONE: … (Datum)`
- `NEXT: … (Datum)`

### 6.3 Ergebnis-Hinweise
- Immer 2 kurze Laienvorschläge (leicht verständlich)
- Immer 1 detaillierter nächster Schritt in einfacher Sprache

────────────────────────────────────────────────────────────

 - README + CHANGELOG + todo aktualisiert
 - mindestens 1 Hilfeelement verbessert/ergänzt
 - Release-Reifegrad erhöht und klar dokumentiert

────────────────────────────────────────────────────────────

- zeitnah mergen (kein unnötiges Warten)
 - direkt die nächsten drei kleinsten vollständigen Punkte planen
- immer auf vollständig release-fertig hinarbeiten

Release-Doku bei Release-bezogenen Iterationen zusätzlich:
- `RELEASE_CHECKLIST.md` aktualisieren (Fortschritt %, Abgeschlossen, Offen, nächster Schritt)
- README-Release-Status synchron halten
- `docs/developer_manual.md` um nächsten technischen Release-Schritt ergänzen

Minimalformat:
- Fortschritt: `X%`
- Abgeschlossen: `N`
- Offen: `M`
- Nächster Schritt: 1 klarer Arbeitsschritt mit einfacher Begründung

────────────────────────────────────────────────────────────

## 9) Iterations-Template (zwingend)
### A) Fundstelle (beobachten)
- Problem:
- Risiko:
- Erwartung:

### B) Change-Scope (vor Patch)
- Ziel:
- Dateien:
- Patch-Block je Datei:
- Abnahmekriterium:

### C) Patch (kurz)
 - Punkt 1 – Änderung:
 - Punkt 2 – Änderung:
 - Punkt 3 – Änderung:


### E) Ergebnis
- Status: DONE / NEXT ITERATION (wenn einer der 2 Punkte offen bleibt)
- Doku: README + CHANGELOG + todo aktualisiert
- Laienvorschläge: 2 kurze Empfehlungen
- Nächster Schritt: 1 detaillierter Vorschlag in einfacher Sprache

## 10) Versionierung und Registry (neu)

Alle Änderungen am Code oder an Dokumenten müssen in der Versions‑Registry (`data/version_registry.json`) nachgeführt werden.

Richtlinien:

- **global_version**: Setzt das Datum der letzten Iteration im Format `YYYY.MM.DD`.
- **files**: Für jede geänderte Datei muss die Versionsnummer (Datum oder, bei Dokumenten, eine Nummer) erhöht oder eingetragen werden.
- Das Aktualisieren der Registry zählt als Teil der Iterationsarbeit und darf keine weiteren Dateien beeinflussen.
- Änderungen ohne Anpassung der Registry gelten als unvollständig.
