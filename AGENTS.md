# AGENTS.md

## Projektziel
Dieses Projekt startet **neu** mit klaren, einheitlichen Regeln.
Ziel ist: barrierefrei, verständlich, wartbar und voll automatisiert.

## Arbeitsregeln
1. **Einfache Sprache** nutzen.
2. Fachwörter kurz erklären, z. B. *Validierung (Eingabeprüfung)*.
3. Jede Funktion prüft:
   - Eingabe (Input)
   - Ergebnis (Output)
4. Fehlertexte immer mit nächstem Schritt:
   - „Erneut versuchen“
   - „Reparatur starten“
   - „Protokoll öffnen“
5.AGENTS.md – Modultool (Profi‑Version V2) 
Stand: 2026-02-28 • Zweck: maximale Patch‑Genauigkeit, Codesparsamkeit, Robustheit, Laien‑Perfektion
Einsatz: Codex + GitHub (iterative Optimierung, klare PRs, reproduzierbare Ergebnisse) 

0) Mission (ein Satz) 
Jede Iteration liefert einen vollständigen, kleinen, exakt begrenzten Patch, der startbar, geprüft, dokumentiert und laienverständlich ist – ohne unnötige Datei‑Berührungen. 

1) Nicht verhandelbare Kernregeln 
1.1 Minimal‑Patch statt Mega‑Refactor 
❌ Keine „Großaufraum“-Rewrites.
✅ Nur zielrelevante Änderungen, kleinstmögliche Diff‑Fläche.
✅ Wenn zwei Fixes denselben Bereich betreffen → bündeln (ein Patch, ein Testlauf).
✅ Wenn Fixes verschiedene Bereiche betreffen → trennen (klein halten, Fehler lokalisierbar). 
1.2 Nur betroffene Dateien anfassen 
Eine Datei wird nur geändert, wenn mindestens einer zutrifft: 
sie enthält den Bug
sie ist direkter Einstiegspunkt (z. B. Loader) für den Fix
sie ist die zentrale Stelle für einen Standard (z. B. Validator/Logger)
❌ Keine „präventiven“ Änderungen in fremden Modulen. 
1.3 Code‑Sparsamkeit (DRY + Wiederverwendung) 
Neue Logik wird nur erstellt, wenn es keinen passenden Helper/Service gibt.
Gleiche Fehlerbehandlung → zentraler Handler.
UI‑Strings → zentral (z. B. messages_de.json), nicht überall verteilt. 
1.4 Robustheit über Komfort 
Jeder neue Feature‑Pfad braucht: 
Validierung vor Schreiben
verständliche Fehlermeldung
Rückweg (Abbrechen/Zurück)
Backup/Recovery‑Hook, wenn Daten betroffen sind 


1.5 Global Standards (Qualitäts‑Guardrails, „je kleiner desto besser“) 
Diese Standards sind dafür da, dass Code klein, reviewbar, wartbar bleibt und ein Agent nicht „alles in eine Datei kippt“.
Umsetzung bevorzugt über Lint‑Regeln (ESLint) + Formatter + Review‑Limits. 
1.5.1 Harte Größenlimits (Default) 
Datei‑Größe (Quellcode): - Max 250 Zeilen pro Datei (ohne Leerzeilen/Kommentare zählen)
Ausnahme: generierte Build‑Artefakte oder Vendor‑Code. 
Funktion‑Größe: - Max 60 Zeilen pro Funktion (ohne Leerzeilen/Kommentare zählen) 
Zeilenlänge: - 80 Zeichen Standard (JS/HTML/CSS/MD), Ausnahmen: URLs, lange Strings 
Verschachtelung & Komplexität: - Max 4 Block‑Tiefe (if/for/while/switch)
- Cyclomatic Complexity: max 10 pro Funktion (bei Überschreitung splitten) 
1.5.2 PR/Review‑Limits (für GitHub) 
Ein Ziel pro PR (kein Misch‑PR)
< 400 LOC pro Review‑Einheit (falls größer: splitten oder „stacked PRs“)
PR muss in < 30–60 Minuten reviewbar sein (Daumenregel) 
1.5.3 Konfig‑Snippets (kopierfertig) 
ESLint (Auszug): js // .eslintrc.cjs (Auszug) module.exports = { rules: { "max-lines": ["error", { "max": 250, "skipBlankLines": true, "skipComments": true }], "max-lines-per-function": ["error", { "max": 60, "skipBlankLines": true, "skipComments": true }], "max-len": ["error", { "code": 80, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }], "max-depth": ["error", 4], "complexity": ["error", 10] } }; 
Prettier (Auszug): json { "printWidth": 80 } 
1.5.4 Dokumentation & Umsetzung im Projekt 
Diese Regeln werden zusätzlich in GLOBAL_STANDARDS.md gepflegt (Kurzbegründung + Ausnahmen).
Jede Iteration prüft: Verstößt der Patch gegen ein Limit? Wenn ja: splitten. 
2) Iterations‑Pipeline (ultra‑effizient) 
Ergebnis pro Iteration: Plan → Patch → Checks → Doku → PR‑Summary (immer in dieser Reihenfolge) 
Schritt 0 – Status lesen (Pflicht) 
SELFINFO.md lesen (Regeln, Version, offene Punkte)
QUESTIONS_TODO.md lesen (offene Entscheidungen, nicht vermischen) 
Schritt 1 – PatchSpec erstellen (vor Code!) 
PatchSpec ist Pflicht und enthält: 
Ziel (1 Satz):
Scope IN: (was wird geändert)
Scope OUT: (was wird nicht angefasst)
Betroffene Dateien + exakte Stelle: 
Zeilenbereich ODER Marker/Anker (z. B. // BEGIN: boot-status)
Risiko: niedrig/mittel/hoch + 1 Begründung
Akzeptanzkriterien (Fertig wenn): 3–7 Checkboxen
Checks/Tests: nur betroffene, mit kurzem Ablauf
Rollback‑Plan: „Wie komme ich zurück?“ 
Schritt 2 – Patch bauen (kleinstmöglicher Diff) 
Nur die im PatchSpec gelisteten Dateien ändern.
Keine Formatierung außerhalb des geänderten Blocks.
Keine ungenutzten Imports, keine toten Variablen.
Jede neue Funktion: ein Zweck, kurzer Name, klarer Input/Output. 
Schritt 3 – Checks ausführen (nur betroffen) 
Minimum‑Checks je Kategorie: 
Core‑Änderung (Loader/Boot/Registry): - Start ohne Crash - Boot‑Flow bis Dashboard - Registry laden/validieren - 1 Recovery‑Pfad (z. B. kaputtes JSON simulieren) 
UI‑Änderung: - Tastatur: Tab/Enter/Escape - Fokus sichtbar (nicht verdeckt) - Screenreader‑freundliche Labels (mindestens aria-label/aria-labelledby wo nötig) 
Storage/JSON‑Änderung: - JSON Syntax ok - Schema‑Validierung ok (wenn vorhanden) - Write‑Pfad: Backup/Versionierung korrekt 
Schritt 4 – Doku minimal aktualisieren (nur relevant) 
CHANGELOG.md: 1–3 Zeilen (was, warum, Risiko)
SELFINFO.md: Version/Iteration + Next Step
README.txt: pro Iteration kurz auf aktuellen Stand bringen (Fortschritt, offene Punkte, neuer naechster Schritt).
Wenn UI‑Text geändert: messages_de.json + kurzer Eintrag in docs/HILFE.md 
Schritt 5 – Iterations‑Summary (maximal transparent) 
Jede Iteration endet mit diesen Blöcken: 
1) Änderung (kurz): 3–7 Bulletpoints
2) Dateien/Anker: Liste der berührten Stellen
3) Checks: was wurde geprüft
4) Nächster Schritt: 1 Satz
5) Empfehlung: 2 Optionen + „Mein Pick“ 
 Einheitliche Struktur:
   - `system-core/` Kernlogik
   - `system-module/` Kernlogik Module
   - `config/` Einstellungen
   - `data/` variable Daten
   - `tools/` Prüfungen und Hilfen
   - `templates/` UI-Vorlagen
   - `test/` Test und Testdateien
   - `dummys/` Dummys für Selfrepair oder andere Aspekte

## Barrierefreiheit (A11y)
- Tastatur zuerst (Fokus gut sichtbar).
- Status nie nur über Farbe, immer auch über Text.
- Hoher Kontrast in allen Farbthemen.
- Mehrere Themes anbieten (Hell, Dunkel, andere Farbe).

## Start-Routine
`start.sh` soll vollautomatisch:
- Voraussetzungen prüfen
- fehlende Abhängigkeiten automatisch installieren
- Code formatieren
- Tests ausführen
- klare Rückmeldung geben: geprüft, gelöst, nächster Schritt

3) Bündelungs‑Logik (damit Patches „vollständig“ sind) 
3.1 Bündeln (in einem Patch), wenn: 
Mehrere Fixes sind innerhalb derselben Funktion oder derselben Datei/Section
Ein Fix würde ohne den anderen einen Folgefehler erzeugen
Doku‑/Text‑Update gehört direkt zur selben UI‑Änderung 
3.2 Trennen (mehrere Patches), wenn: 
Es sind verschiedene Module/Plugins betroffen
Risiko hoch und Debugging wäre sonst schwer
Mehrere unabhängige Features (sonst „halbe Sachen“ in einem Mega‑Patch) 
3.3 „Keine halben Sachen“ – konkrete Definition 
Ein Patch gilt nicht als fertig, wenn: - Feature zwar klickbar, aber nicht validiert - Fehlerfall nicht abgefangen - Meldung unverständlich - Doku fehlt (mindestens 1 Satz Hilfe) - Startflow bricht oder Warnungen ignoriert werden 

4) Patch‑Genauigkeit (exakte Stellen statt „ungefähr“) 
4.1 Marker‑Standard (empfohlen) 
Für große Dateien müssen relevante Bereiche markiert werden: js // BEGIN: <topic> // END: <topic> Beispiel: js // BEGIN: boot-status // END: boot-status 
4.2 „Nur diese Zeilen“ – Patch‑Regel 
Änderungen dürfen nur innerhalb des markierten Blocks erfolgen, außer PatchSpec erlaubt es explizit. 
4.3 Diff‑Hygiene 
Keine Zeilenumbrüche massenhaft ändern.
Keine Umbenennungs‑Orgie ohne Not.
Keine „auf einmal alles neu“. 

5) Qualität & Robustheit (DoD‑Gates) 
5.1 Definition of Done (Patch) 
☐ Start ohne Crash
☐ Neue Funktion erfüllt Akzeptanzkriterien
☐ Fehlerfälle verständlich + Buttons vorhanden
☐ JSON validiert (falls JSON betroffen)
☐ Tastaturbedienbar (Tab/Enter/Escape)
☐ Fokus sichtbar (nicht verdeckt)
☐ Doku minimal aktualisiert (Changelog + Help)
☐ Keine unnötigen Dateien geändert 
5.2 Release‑Gate (Meilenstein) 
☐ Boot 5‑Phasen stabil
☐ Safe‑Mode erreichbar
☐ Backup/Restore ok
☐ Diagnose‑Export ok (200 Einträge + Zusammenfassung)
☐ Plugin‑Loader isoliert Fehler (Plugin kann nicht Core crashen) 

6) Laien‑Text‑Standard (UI, Fehler, Hilfe) 
6.1 UI‑Text‑Policy 
UI‑Texte liegen zentral in: messages_de.json
Jede neue UI‑Funktion bekommt: 
1 Satz „Was macht das?“
1 Satz „Was passiert mit den Daten?“
1 Satz „Wie mache ich rückgängig?“ 
6.2 Fehlermeldung‑Schablone (immer gleich) 
Was ist passiert? (1 Satz)
Warum? (1 Satz)
Was kann ich tun? (Buttons)
Details anzeigen (optional, einklappbar) 
Beispiel: - „Projekt konnte nicht geladen werden.“ - „Die Datei registry.json ist beschädigt.“ - Buttons: „Reparieren“, „Backup wiederherstellen“, „Abbrechen“ - Details: Parser‑Fehler, Position, Datei‑Pfad 

7) JSON/Schema‑Disziplin (Fehlerfreiheit) 
7.1 Vor jedem Schreiben 
JSON Syntax prüfen
Schema prüfen (wenn vorhanden)
Backup/Versionierung auslösen (wenn Daten betroffen) 
7.2 Versionierte Writes (web‑robust) 
Statt Überschreiben: - data_v0007.json schreiben - current.json zeigt auf „current“ - Recovery wählt letzte gültige Version 

8) A11y‑Minimum (WCAG 2.2‑Praxisregeln) 
Jede UI‑Änderung muss mindestens erfüllen: - Tab/Shift+Tab: logische Reihenfolge - Enter/Space: aktivieren - Escape: schließen (Overlay/Dialog) - Fokus sichtbar - Dragging hat Alternative (Buttons/Dialog) - Target‑Size: große Buttons oder Abstand 

9) Codex‑Auftragsformat (für perfekte PR‑Patches) 
Dieser Prompt wird 1:1 an Codex gegeben. 
## Codex Task
**Ziel:** …
**Kontext:** …
**Scope IN:** …
**Scope OUT:** …
**PatchSpec (Datei + Marker/Zeilen):**
- …
**Akzeptanz (Fertig wenn):**
- [ ]
**Checks (nur betroffen):**
- …
**Doku‑Updates (minimal):**
- …
**Ausgabeformat:**
1) Unified Diff Patch
2) Kurze Summary
3) Next Step + Empfehlung
 

10) GitHub‑Workflow (klein, sauber, reviewbar) 
10.1 Issue‑Format (ein Feature = ein Issue) 
Problem (1 Satz)
Erwartetes Verhalten
Ist‑Zustand
Scope IN/OUT
Akzeptanzkriterien
Risiko (niedrig/mittel/hoch) 
10.2 Branch‑/PR‑Format 
Branch: fix/<kurz> oder feat/<kurz>
PR‑Titel: [core] … / [plugin:<id>] … / [docs] …
PR‑Body Pflicht: 
Was geändert?
Warum?
Dateien/Marker
Checks
Screenshots (nur wenn UI relevant)
Next Step + Empfehlung 
10.3 Review‑Regel (Qualität) 
Maximal ein Feature pro PR
Keine Misch‑PR (UI+Storage+Refactor) ohne Not
Wenn PR zu groß wird → splitten 

11) „Offene Fragen“ (nicht im Patch diskutieren) 
Alle neuen Fragen gehen in: - QUESTIONS_TODO.md 
Template: md - [ ] (2026-02-28) Frage: … | Kontext: … | Entscheidung nötig bis: … 

12) Minimal‑Projektdateien (nur bei Bedarf anlegen) 
SELFINFO.md – Status/Version/Next Step
CHANGELOG.md – kurze Historie
QUESTIONS_TODO.md – offene Fragen
AGENTS_LOG.md – 1 Zeile pro Patch (Patch‑ID, Ziel, Dateien) 

13) Beispiel‑Iteration (perfekt & klein) 
Patch: „Diagnose‑Export: Header + Export‑ID“
- Dateien: core/diagnose_export.js (Marker: // BEGIN: export-header)
- Akzeptanz: - Export enthält Header (3–6 Zeilen) - Export enthält Export‑ID - Export enthält max. 200 Einträge - Checks: - Export erzeugen → Datei ansehen - Fehlerfall: kein Log vorhanden → verständliche Meldung - Doku: - 1 Changelog‑Zeile - 1 Help‑Satz („Diagnosebericht erstellen“) 


15) Erinnerungsoptimierung (Pflichtdatei + Lernsystem) 
15.1 Zweck 
Wir führen eine Erinnerungsoptimierungsdatei, damit wiederkehrende Fehler nicht erneut Zeit fressen.
Sie sammelt gelöste Probleme inkl. Ursache, Fix‑Muster, Tests und „Was man künftig sofort tun sollte“. 
Datei: MEMORY_FIXES.md
Regel: am Anfang jeder Iteration lesen, am Ende aktualisieren (wenn neue Erkenntnis entstanden ist)
Ziel: Robustheit, Codequalität, Effizienz, Vereinheitlichung, Laien‑Erklärungen systematisch verbessern. 
15.2 Eintrag‑Template (kopierfertig) 
## FIX-<YYYYMMDD>-<NNN>: <Kurzname>
**Kategorie:** (JSON/Boot/Plugin/FS-Access/UI/A11y/Export/Backup/Update/Docs)
**Symptom (für Laien):** …
**Technische Ursache:** …
**Trigger:** (Wie tritt es auf?)
**Fix (kurz):** …
**Geänderte Dateien/Marker:** …
**Tests/Checks:** …
**Prävention (künftig):** …
**Alternative(n):** …
**Risiko/Side-Effects:** …
**Verknüpft:** (Issue/PR/Patch-ID/Export-ID)
 
15.3 Minimalregeln 
Pro Iteration maximal 1–3 neue Fix‑Einträge, nur wenn wirklich neu.
Keine Romane: kurz, wiederverwendbar.
Jeder Eintrag endet mit einer Präventionsregel („Ab jetzt immer …“).
Wenn ein Fix einen neuen Standard erzeugt (z. B. JSON‑Write‑Policy), muss er zusätzlich in: 
PROJECT_INFO.md (Regel/Status)
und ggf. docs/HILFE.md (Laienhinweis) übernommen werden. 
15.4 Speicherort & Reihenfolge 
MEMORY_FIXES.md liegt im Projektbasisordner (Root), damit es immer sofort erreichbar ist.
Reihenfolge im Iterationsablauf: 1) SELFINFO.md + PROJECT_INFO.md lesen
2) MEMORY_FIXES.md lesen
3) PatchSpec → Patch → Checks → Doku
4) MEMORY_FIXES.md aktualisieren (falls neu)
5) PROJECT_INFO.md + SELFINFO.md als letztes aktualisieren 

16) Pflichtpunkt je Iteration: Mini-Optimierung für Hilfe + UX/A11y
16.1 Ziel (immer aktiv)
In jeder Iteration wird mindestens ein kleiner, sichtbarer Teil von Hilfe,
Hilfselementen, Beschreibungen oder Tooltips verbessert.

16.2 Was pro Iteration mindestens verbessert werden muss (1 Punkt reicht)
- Ein Hilfe-Text in einfacher Sprache (max. 2 kurze Sätze).
- Ein Tooltip mit klarer Aktion + Rückweg.
- Eine Fehlermeldung nach der Schablone aus Abschnitt 6.2.
- Ein UI-Detail für Tastatur/Fokus/Kontrast.

16.3 Design- und Layout-Standards (einheitlich)
- Einheitliche Abstände über Tokens (z. B. 4/8/12/16/24).
- Einheitliche Button-Standards: gleiche Höhe, gleiche Radius-Werte,
  klarer Fokus-Ring, Mindestgröße 44x44 px.
- Einheitliche Typografie-Scale (z. B. 14/16/20/24) mit guter Lesbarkeit.
- Nie nur Farbe als Statussignal: immer Text/Icon ergänzen.

16.4 Farben, Kontrast, Themes
- Standardmäßig mindestens 3 Themes anbieten: Hell, Dunkel, Kontrast+.
- Kontrastziel mindestens WCAG AA (Text/Bedienflächen).
- Fokuszustand in jedem Theme klar sichtbar.
- Farbwerte zentral halten (Design-Tokens/Variablen), nicht verteilt.

16.5 Interaktivität für Laien (Best Practices)
- Primäraktion pro Bereich klar markieren (nur 1 Hauptbutton).
- Jede Aktion hat klaren nächsten Schritt (z. B. erneut versuchen,
  Protokoll öffnen, Reparatur starten).
- Sofortiges Feedback nach Klick (Status, Fortschritt, Ergebnis).
- Komplexe Aktionen in kleine, geführte Schritte teilen.

16.6 Flexibilität, Skalierbarkeit, kleine Bildschirme
- Responsive Layout zuerst mobil denken (kleine Breite zuerst).
- Flexible Container/Grid nutzen (auto-fit/minmax), keine festen Pixelbreiten.
- Inhaltsblöcke dürfen umbrechen; keine abgeschnittenen Buttons/Texte.
- Für kleine Displays: Prioritäten zeigen, Nebensachen einklappbar machen.
- Komponenten modular halten (System/Core, Config, variable Daten klar trennen).

16.7 Automatische Qualitätschecks (Start-Routine)
- Start-Routine prüft pro Iteration automatisch:
  - Formatierung
  - Tests
  - A11y-Basics (Fokus, Tastaturpfad, Labels)
  - Kontrast-Checks je Theme (mindestens Kernseiten)
- Bei Fehlern: klare Laienmeldung + nächster Schritt ausgeben.
- Logs mit Technikdetails im Protokoll, Kurzfassung im Terminal/UI.

16.8 Doku-Pflicht
- In CHANGELOG.md 1 kurze Zeile zur UX/Hilfe-Mini-Optimierung ergänzen.
- README.txt in jeder Iteration kurz aktualisieren (Fortschritt/Status + naechster Schritt).
- In todo.txt den erledigten Mini-Punkt abhaken und nächsten Mini-Punkt planen.

14) Nächster Schritt (Pflichtauswahl) 
Entscheide für die nächste Iteration genau ein Ziel: 
A) Boot‑View stabilisieren (Phasen, Ampel, Details, Weiter‑Gate)
B) Plugin‑Loader minimal (Manifest lesen, isoliertes Laden, Fehler abfangen)
C) Storage‑Service robust (versionierte Writes, JSON‑Validator, Backup‑Hook) 
Frage: Welche Option A/B/C ist als nächstes dran?

## Debugging/Logging
- Einfache Meldungen für Laien.
- Detaillierte Ursachen im Protokoll.
- Konkrete Lösungsvorschläge anzeigen.
