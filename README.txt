# Provoware HTML Tool

## Ziel in einfacher Sprache
Dieses Projekt liefert ein gut bedienbares Dashboard mit klaren Schritten,
hoher Barrierefreiheit (A11y = Bedienbarkeit fuer alle) und stabiler
Start-Routine. Die Start-Routine prueft automatisch Abhaengigkeiten,
Formatierung, Tests und Release-Bereitschaft.

## Release-Status (Iteration 98)
- Drei offene Mini-Punkte aus `todo.txt` abgeschlossen (Kurz-Token-Liste, Auto-Kurzmodus unter 640px, Support-Badge mit Icon + Screenreader-Text).
- Hilfe/UX verbessert: Support-Meta zeigt ignorierte kurze Suchbegriffe klar als Liste (max. 3 + Hinweis auf weitere).
- A11y verbessert: Support-Badge hat jetzt zusaetzlich ein Icon und einen versteckten Screenreader-Text (sr-only = nur vorlesbar).
- Responsive verbessert: Footer-Hinweis geht bei kleiner Breite automatisch in Kurzmodus mit klarem Rueckweg-Hinweis.
- Naechster Schritt: Auto-Kurzmodus mit eigener aria-live-Ansage bei Statuswechsel ausbauen.

## Release-Status (Iteration 93)
- Drei offene Mini-Punkte aus `todo.txt` abgeschlossen (Boot-Live-Ansage im Debug-Protokoll, kurzer Tastatur-Hinweis bei langen Support-Details, Detailmodus mit zuletzt geoeffnetem Zustand).
- Hilfe/UX verbessert: Supportliste kuerzt den Tastaturhinweis automatisch, wenn der Detailtext sehr lang ist.
- Versionsvergleich zeigt jetzt zusaetzlich einen Satz zum zuletzt geoeffneten Detailzustand (einklappen/oeffnen).
- Naechster Schritt: Detailzustand pro Projekt dauerhaft in `data/layout.json` speichern.

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

## Update 2026-03-01 (2 Mini-Punkte abgeschlossen)
- Boot-Gate hat jetzt zusaetzlich eine aria-live-Ansage: Fokusziel wird als Text direkt vorgelesen (Erstes Modul oder Hilfe-Panel).
- Support-Suche zeigt jetzt die Trefferzahl und reagiert auf Enter im Suchfeld fuer schnellere Tastaturbedienung.
- Mini-Optimierung Hilfe/UX: Suchfeld beschreibt den naechsten Schritt klar mit Treffer-Hinweis.
- Naechster Schritt: Versions-Detailgruppen im Backup-Dialog standardmaessig eingeklappt starten.

## Update 2026-03-01 (3 Mini-Punkte abgeschlossen – Iteration 94)
- Backup-Detailzustand wird jetzt pro Projekt in `data/layout.json` als `backupDetailOpen` gespeichert und beim Oeffnen wiederhergestellt.
- Support-Verlauf markiert Suchwoerter als sichtbaren Text mit `<mark>` plus Rahmen, damit Status nicht nur ueber Farbe sichtbar ist.
- Letzter Boot-Debugtext erscheint zusaetzlich als Hilfe-Eintrag (`boot-debug`) im Support-Verlauf.
- Naechster Schritt: Boot-Debug-Eintrag optional per Schalter ausblendbar machen.

## Update 2026-03-01 (3 Mini-Punkte abgeschlossen – Iteration 95)
- Hilfe-Panel hat jetzt einen Schalter **"Boot-Debug im Verlauf zeigen"**. So koennen Einsteiger die Liste ruhiger machen.
- Support-Suche markiert jetzt nur noch **ganze Woerter**. Das reduziert visuelles Rauschen bei kurzen Suchbegriffen.
- Backup-Dialog erklaert beim Detailzustand klar: Der Zustand wird pro Projekt gespeichert und bei Restore wieder geladen.
- Naechster Schritt: Optionalen Teilwort-Modus in der Suche ergaenzen.


## Iteration 96 – Optionale Teilwortsuche + klarer Footer-Rueckweg
- Hilfe-Panel zeigt jetzt einen Footer-Hinweis mit aktuellem Modus und Tastatur-Rueckweg (Tab + Leertaste).
- Support-Suche hat einen optionalen Teilwortmodus (enthaelt); Standard bleibt ganze Woerter fuer stabile Treffer.
- Backup-Detailhinweis enthaelt eine kurze Beispielzeile fuer Einsteiger.
- Naechster Schritt: Teilwortmodus mit Mindestlaenge 3 gegen ungenaue Treffer absichern.

## Iteration 97 – Wartbarkeit der Support-Suche verbessert
- Drei offene Mini-Punkte abgeschlossen: Footer-Hinweis ist jetzt kurz/lang schaltbar und wird pro Projekt gespeichert.
- Teilwortsuche nutzt jetzt Mindestlaenge 3; zu kurze Suchteile werden bewusst ignoriert und im Metatext klar erklaert.
- Trefferzeilen zeigen jetzt ein Suchmodus-Badge (Ganzwort/Teilwort) mit hohem Kontrast fuer alle Themes.
- Naechster Schritt: Ignorierte Kurz-Tokens als klare Liste im Metabereich anzeigen.

## Iteration 99 – Support-Hilfe weiter verbessert
- Drei offene Punkte abgeschlossen: optionale A-Z-Sortierung fuer ignorierte Kurzbegriffe, aria-live-Ansage bei Auto-Kurzmodus-Wechsel, Badge-Kurzform unter 480px mit vollem aria-label.
- Naechster Schritt: Tooltip fuer Badge-Kurzform und noch klarerer Hilfetext fuer Sortier-Schalter.
