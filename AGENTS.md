# AGENTS.md – Projektstandard (verbindlich)

## 0) Grundregel: atomare Iteration
Jede Iteration liefert **genau 3 vollständig abgeschlossene Punkte**.

Pflicht:
1. mindestens 1 Punkt zu Hilfeelementen/Texten/Barrierefreiheit
2. kleinster auslieferbarer Umfang (smallest shippable change)
3. merge-ready: Code + Doku + Checks + Registry

Grenzen pro Iteration:
- genau 1 Problemklasse
- maximal 1–4 Dateien
- je Datei genau 1 zusammenhängender Patch-Block

Wenn mehr nötig ist: **STOP** und nächste Iteration planen.

---

## 1) Scope-Kontrolle (vor jedem Patch, Pflicht)
Vor der Änderung schriftlich festhalten:
- Problem (1 Satz)
- Ziel (1 Satz)
- Dateien (exakte Liste)
- Patch-Block je Datei (Zeilenbereich)
- Abnahmekriterium (1 testbarer Satz)

Verboten:
- Nebenbei-Refactorings außerhalb des Patch-Blocks
- Umbenennen/Umstrukturieren ohne zwingenden Grund
- mehr oder weniger als 3 Punkte
- Teilergebnisse ohne klaren Abschluss

---

## 2) Qualitätsregeln für jede betroffene Funktion
- Input validieren (Eingaben prüfen)
- Output bestätigen (Erfolg klar melden)
- Fehlerpfad mit Next Steps in einfacher Sprache
- mindestens 1 Hilfeelement pro betroffenem Bereich verbessern
- kein Crash bei erwartbaren Fehlern

Fehlermeldungs-Standard:
- kurze Ursache
- direkte Aktion: „Erneut versuchen“
- direkte Aktion: „Reparatur starten“
- direkte Aktion: „Protokoll öffnen“

---

## 3) Architektur- und UX-Standards
- Einheitliche Benennung, Struktur und Vorgehen in allen Patches
- Tool-Logik trennen von variablen Daten und Konfiguration
- Zielstruktur beibehalten/ausbauen:
  - `system/` (stabile Kernlogik)
  - `config/` (konfigurierbare Einstellungen)
  - `data/` (variable Laufzeitdaten)
  - `logs/` (Protokolle)
- Barrierefreiheit immer mitliefern:
  - klare Sprache
  - Tastaturfreundlichkeit/Fokus
  - Kontrast robust
  - Status nicht nur über Farbe, zusätzlich Text/Icon
- Mehrere Themes dürfen Kontrast/Lesbarkeit nicht brechen

---

## 4) Start-Routine: vollautomatische Prüfung und Reparatur
Die Start-Routine muss automatisch:
1. Voraussetzungen prüfen
2. fehlende Abhängigkeiten soweit möglich selbst beheben
3. verständliches Nutzerfeedback geben
4. Codequalität prüfen
5. Code formatieren

Mindest-Ausgabe am Start:
- was geprüft wurde
- was fehlt
- was automatisch gelöst wurde
- was der Nutzer als Nächstes tun soll

Pflicht-Kommandos (an Projekt anpassen):
```bash
./start.sh --check
./start.sh --repair
./start.sh --format
./start.sh --test
```

---

## 5) Dokumentationspflicht je Iteration
Immer aktualisieren:
- `todo.txt`
- `CHANGELOG.md` (3 Zeilen: Was, Warum, Wirkung)
- `data/version_registry.json`

`README.md` mindestens alle 2–3 Iterationen oder sofort bei Release-kritischen Änderungen.

Zusätzlich im Ergebnistext:
- 2 kurze Laienvorschläge
- 1 detaillierter nächster Schritt in einfacher Sprache

---

## 6) Versionierung / Registry (verbindlich)
Alle geänderten Dateien müssen in `data/version_registry.json` aktualisiert werden.

Regeln:
- `global_version`: Datum der Iteration (`YYYY.MM.DD`)
- `files`: jede geänderte Datei mit aktualisierter Version
- ohne Registry-Update gilt die Iteration als unvollständig

---

## 7) Iterations-Template (verbindlich nutzen)
### A) Fundstelle
- Problem:
- Risiko:
- Erwartung:

### B) Change-Scope
- Ziel:
- Dateien:
- Patch-Block je Datei:
- Abnahmekriterium:

### C) Patch (genau 3 Punkte)
- Punkt 1 – Änderung:
- Punkt 2 – Änderung:
- Punkt 3 – Änderung:

### D) Checks
- Format:
- Tests:
- Start-Routine-Check:

### E) Ergebnis
- Status: DONE / NEXT ITERATION
- Doku aktualisiert: todo + changelog + registry
- Laienvorschläge (2):
- Nächster Schritt (1, detailliert):
