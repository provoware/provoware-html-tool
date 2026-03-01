# Provoware HTML Tool

## Ziel in einfacher Sprache
Dieses Projekt liefert ein gut bedienbares Dashboard mit klaren Schritten,
hoher Barrierefreiheit (A11y = Bedienbarkeit fuer alle) und stabiler
Start-Routine. Die Start-Routine prueft automatisch Abhaengigkeiten,
Formatierung, Tests und Release-Bereitschaft.

## Release-Status (Iteration 87)
- Dokumentation wurde fuer Release-Finalisierung neu geordnet.
- AGENTS.md wurde auf klare, kleine und reviewbare Release-Regeln
  verdichtet.
- TODO-Struktur wurde mit drei abgeschlossenen Doku-Punkten ergaenzt.
- Naechster Schritt: Die drei offenen Mini-Punkte aus `todo.txt`
  umsetzen (Boot-Fokus-Einstellung, filterbarer Support-Verlauf,
  Detailmodus im Versionsvergleich).

## Projektstruktur
- `system-core/` = Kernlogik (z. B. Storage, Registry, Loader)
- `system-module/` = Modul-Modelle und UI-nahe Logik
- `templates/` = HTML/CSS/JS fuer Oberflaechen
- `config/` = zentrale Konfigurationen und Meldungen
- `data/` = variable Daten, Statusindex, JSON-Dateien
- `tools/` = Start-Routine, Release-Checks, Hilfswerkzeuge
- `test/` = automatisierte Tests
- `docs/` = Hilfe, Entwicklerdoku, Design-Informationen
- `dummys/` = Dummy-Daten fuer Fehler- und Reparaturtests

## Schnellstart (vollautomatisch)
1. Voraussetzung: Node.js und npm installiert.
2. Im Projektordner starten:
   - `bash start.sh`
3. Ergebnis lesen:
   - Bei Erfolg: Alle Pflichtchecks sind gruen.
   - Bei Fehler: Meldung mit naechstem Schritt
     (`Erneut versuchen`, `Reparatur starten`, `Protokoll oeffnen`).

## Pflichtbefehle je Iteration
- `npm run format`
- `node --test`
- `bash start.sh`

## Doku-Pflicht im Release-Check
Doku ist kurz aktualisiert (README, CHANGELOG, todo).

## Qualitaetsregeln (kurz)
- Jede neue Funktion prueft Input (Eingabe) und Output (Ergebnis).
- Fehlermeldungen enthalten immer einen klaren naechsten Schritt.
- A11y zuerst: Tastaturpfad, sichtbarer Fokus, klare Labels,
  Status nie nur ueber Farbe.
- Kleine Patches statt grosser Umbauten.

## Design und Themes
Das Projekt nutzt zentrale Design-Tokens fuer Farben, Abstaende,
Typografie und Fokus-Zustaende. Ziel sind mindestens vier Themes
(hell, dunkel, roetlich, camouflage) mit gutem Kontrast.

## Debugging und Logging
- Laien sehen kurze, klare Meldungen.
- Technikdetails stehen im Protokoll fuer Support.
- Jede Stoerung zeigt konkrete Loesungswege.

## Wichtige Dateien fuer Release
- `start.sh` – startet den Vollcheck.
- `tools/start_routine.js` – Ablauf der automatischen Pruefung.
- `tools/release_readiness_check.js` – Release-Gate.
- `todo.txt` – offene und erledigte Mini-Punkte.
- `CHANGELOG.md` – kurze Iterations-Historie.

## Weiterfuehrende Laienvorschlaege
1. Vor jeder Aenderung immer zuerst `bash start.sh` ausfuehren, damit
   fruehe Fehler sofort sichtbar sind.
2. Bei Problemen zuerst das Protokoll oeffnen und den dort genannten
   naechsten Schritt genau in Reihenfolge durchgehen.

## Iteration 88 – Robustes Layout und klare Fokussteuerung
- Dashboard-Layout ist jetzt stabil als Header + 3-Spalten-Mitte + Footer aufgebaut, mit quadratischem 3x3-Hauptgrid.
- Boot-Fokusziel ist waehlbar (erstes Modul oder Hilfe-Panel) und wird in `data/layout.json` gespeichert.
- Hilfe-Panel zeigt jetzt filterbaren Support-Verlauf (alle / nur Safe-Mode) und der Versionsvergleich hat einen optionalen Detailmodus.
- Naechster Schritt: Fokusziel-Hinweis im Boot-Gate dynamisch spiegeln.


## Iteration 89 – Notiz-Startmodul und Sidebar-Links
- Linke Sidebar zeigt Bereiche jetzt als klare Button-Links statt grosser Kacheln.
- Das Dashboard startet mit genau einem Modul: **Notizen** in der Mitte (3x3-Raster bleibt als Hauptflaeche).
- Linke und rechte Zeitbar sind als ein-/aufklappbare Bereiche benannt, damit die Bedienung klar bleibt.
- Naechster Schritt: Boot-Gate-Hinweis auf aktives Fokusziel erweitern.


## Update 2026-03-01 (3 Mini-Punkte abgeschlossen)
- Boot-Gate-Hinweis zeigt jetzt das aktive Fokusziel (Modul oder Hilfe) direkt im Klartext.
- Support-Verlauf hat eine Freitextsuche fuer Typ/Datum. Regel: erst Dropdown-Filter, dann Suchtext (UND-Verknuepfung).
- Versionsvergleich im Backup-Dialog zeigt Detailgruppen: Neu, Entfernt, Gleich.
- Naechster Schritt: Trefferzahl in der Support-Suche und optionalen Screenreader-Kurztext fuer Gate-Wechsel nachziehen.
