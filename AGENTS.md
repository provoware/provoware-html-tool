# AGENTS.md – Releasefinalisierung (V3)
Stand: 2026-03-01

## 1) Mission
Jede Iteration liefert einen kleinen, vollstaendigen und startbaren Patch:
Plan -> Umsetzung -> Checks -> Doku -> Commit -> PR.

## 2) Pflichtprinzipien
1. Einfache Sprache verwenden.
2. Fachwort kurz erklaeren, z. B. Validierung (Eingabepruefung).
3. Jede Funktion prueft Input und Output.
4. Fehlertexte enthalten immer den naechsten Schritt:
   - Erneut versuchen
   - Reparatur starten
   - Protokoll oeffnen
5. Pro Iteration genau drei offene Punkte aus `todo.txt` abschliessen
   (inkl. Code + Tests + Doku).

## 3) Scope und Patch-Groesse
- Nur betroffene Dateien aendern.
- Kein Mega-Refactor.
- Ein PR = ein Hauptziel + eine Mini-Optimierung fuer Hilfe/UX/A11y.
- Diff klein halten und nur dort formatieren, wo geaendert wurde.

## 4) PatchSpec (Pflicht vor Code)
Vor jeder Aenderung als 7-Punkte-Block notieren:
1. Ziel
2. Scope IN
3. Scope OUT
4. Dateien/Marker
5. Risiko
6. Akzeptanzkriterien
7. Checks + Rollback

## 5) Release-Gates (Pflicht)
Folgende Befehle pro Iteration ausfuehren:
- `npm run format`
- `node --test`
- `bash start.sh`

Release ist nur fertig, wenn `bash start.sh` ohne Abbruch laeuft.

## 6) A11y- und UX-Mindeststandard
- Tastatur zuerst (Tab/Enter/Escape).
- Fokus immer klar sichtbar.
- Status nie nur mit Farbe, immer auch mit Text.
- Hoher Kontrast in allen Themes.
- Pro Iteration mindestens eine Mini-Verbesserung in Hilfe/Tooltip/
  Fehlermeldung/Fokus.

## 7) Start-Routine und Automatik
`start.sh` muss vollautomatisch:
- Voraussetzungen pruefen
- Abhaengigkeiten installieren
- Formatierung ausfuehren
- Tests ausfuehren
- A11y- und Release-Kurzcheck ausgeben
- Laien-Rueckmeldung mit naechstem Schritt liefern

## 8) Doku-Pflicht je Iteration
Mindestens diese Dateien aktualisieren, wenn relevant:
- `README.txt` (Fortschritt + naechster Schritt)
- `CHANGELOG.md` (1–3 Zeilen)
- `todo.txt` (erledigt markieren + neue 3 offene Punkte pflegen)
- `PROJEKTBESCHREIBUNG.md` (kurze Erweiterung)
- `SELFINFO.md` (Iteration/Version/Next Step)

## 9) Dateistruktur (einheitlich)
- `system-core/` Kernlogik
- `system-module/` Modul-Logik
- `config/` Konfiguration
- `data/` variable Daten
- `tools/` Pruefungen und Hilfen
- `templates/` UI-Vorlagen
- `test/` Tests
- `dummys/` Dummys

## 10) Logging und Debugging
- Nutzertext kurz und klar.
- Technikdetails ins Protokoll.
- Immer konkrete Loesung anbieten.

## 11) Platzhalter-Disziplin
Bei TODO/FIXME/Dummy-Fund gilt:
1. Kurz im Code kommentieren (warum offen)
2. In `todo.txt` als Aufgabe eintragen
3. Bei Risiko in `QUESTIONS_TODO.md` aufnehmen

## 12) Abschlussformat der Iteration
1. Aenderung (3–7 Punkte)
2. Dateien/Anker
3. Checks
4. Naechster Schritt (1 Satz)
5. Zwei Empfehlungen + Mein Pick
