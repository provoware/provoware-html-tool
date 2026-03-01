## Iteration 92 (2026-03-01)

- Ziel: Zwei offene TODO-Punkte sauber abschliessen und A11y-Hinweise je Eintrag verbessern.
- Ergebnis: Support-Trefferliste zeigt Tastatur-Hinweis je Eintrag; Versions-Detailmodus startet nach Vergleich eingeklappt.
- Checks: `npm run format`, `node --test`, `bash start.sh` ausgefuehrt.
- Nächster Schritt: Debug-Protokoll fuer Boot-Live-Ansage ergaenzen.

## Iteration 88 (2026-03-01)

- Ziel: Release-Doku vereinheitlichen und klar fuer naechste Code-Iteration vorbereiten.
- Status: README + AGENTS + todo aktualisiert, Checks laufen ueber Start-Routine.
- Next Step: Die drei offenen Kern-Mini-Punkte aus `todo.txt` als Code+Tests+Doku abschliessen.

## Iteration 86 – Status

- Hauptziel: Drei offene Mini-Punkte releasefertig abgeschlossen.
- Ergebnis: Hilfe-Panel bietet Safe-Mode-Reset mit Sicherheitsabfrage und klarer Rueckmeldung.
- Ergebnis: Restore-Dialog zeigt Versionsvergleich (aktuell vs. gewaehlt) in einfacher Sprache.
- Ergebnis: Boot-Gate setzt Fokus auf erstes Modul und gibt einen Screenreader-Hinweis.
- Mini-Optimierung: Neue Inline-Hilfe im Restore-Dialog erklaert Vergleich und Rueckweg.
- Naechster Schritt: Vergleich um Zeitstempel erweitern und Fokusziel einstellbar machen.

## Iteration 85 – Status

- Hauptziel: Drei offene Mini-Punkte releasefertig abgeschlossen.
- Ergebnis: Boot-Gate-Hinweis und Hilfetext sind zusammengefuehrt und werden per aria-live angesagt.
- Ergebnis: Safe-Mode-Status ist im rechten Hilfe-Panel sichtbar mit klaren naechsten Schritten.
- Ergebnis: Restore-Dialog kann Versionen aus dem current-Pointer-Pfad laden und wiederherstellen.
- Mini-Optimierung: Backup-Dialog hat neue Inline-Hilfe fuer Versions-Restore mit Rueckweg.
- Naechster Schritt: Safe-Mode-Reset + Versionsvergleich + Fokussprung nach Gate-Freigabe.

## Iteration 84 – Status

- Hauptziel: Drei offene A/B/C-Mini-Punkte in einem releasefertigen Patch abgeschlossen.
- Ergebnis: Boot-Gate blockiert Weiter bis alle Phasen gruen sind und gibt klare Hilfe mit Rueckweg.
- Ergebnis: Plugin-Loader hat Safe-Mode-Ein-Klick-Reparatur fuer defekte Manifeste.
- Ergebnis: JSON-Store schreibt current-Pointer und kann aus Pointer oder letzter Version wiederherstellen.
- Mini-Optimierung: Boot-Bereich hat jetzt sichtbaren Weiter-Hinweis in einfacher Sprache.
- Naechster Schritt: Safe-Mode-Status und Versions-Restore im UI sichtbar machen.

## Iteration 83 – Status

- Hauptziel: Dashboard mit linker/rechter Sidebar, 3x3-Modulraster und 3-Panel-Footer auf den geforderten UI-Stand gebracht.
- Ergebnis: Modul-Suche links, zentrale Modul-Registry, Dashboard-Top mit globalen Platzhaltern und Notiz-Write-Fallback umgesetzt.
- Mini-Optimierung: Template-Buttons rechts mit Clipboard-Fallback (setzt Text ins Notizfeld) in einfacher Sprache.
- Nächster Schritt: A/B/C-Block aus TODO weiterfuehren, zuerst Boot-Weiter-Gate (A).

## Iteration 82 – Status

- Hauptziel: Drei offene Mini-Punkte releasefertig abgeschlossen (Favoritenaktionen, Kontextoptionen, TODO-Zeilenhilfe).
- Ergebnis: Code + Tests + Doku aktualisiert, Start-Routine liefert klarere Laienmeldung mit Zeilenhilfe.
- Nächster Schritt: A/B/C-Optionen fuer naechste Iteration priorisieren (A + B + C als neue offene Mini-Punkte gesetzt).

## Iteration 81 (2026-03-01)

- Ziel: Genau drei offene Mini-Punkte vollstaendig abschliessen (Favoritenleiste, unterer Modulbereich, TODO-Vorlage strikt).
- Ergebnis: Dashboard hat jetzt eine ausklappbare Favoritenleiste mit Alt+F und Schnellaktionen.
- Ergebnis: Modulbereich unten zeigt modulspezifische Optionen direkt im Workspace und erklaert den Rueckweg.
- Ergebnis: Start-Routine akzeptiert TODO-Pflichtfelder nur noch mit Inhalt und gibt klarere Hilfe.
- Mini-Optimierung: Neue Hilfe-Texte fuer Favoritenleiste und Moduloptionen in einfacher Sprache.
- Naechster Schritt: Favoritenaktionen auf echte Modulfunktionen und Statusmeldungen erweitern.

## Iteration 80 (2026-03-03)

- Ziel: Genau drei offene Punkte abschliessen (Songtext-Editor, Dokument-Vorschau, Zufallsgenerator).
- Ergebnis: Songtext-Zufallsgenerator bietet jetzt Kategorie-Auswahl (Genre, Stimmung, Stil) mit Eingabepruefung und sicherem Fallback.
- Ergebnis: Kategorie-Auswahl wird in den Songtext-Einstellungen gespeichert und beim Start wiederhergestellt.
- Ergebnis: Dashboard zeigt neue Inline-Hilfe fuer aktive Kategorien mit klarem naechstem Schritt.
- Mini-Optimierung: Neue Kategorie-Statusmeldung mit Rueckweg-Hinweis fuer Laien.
- Naechster Schritt: Content-Planungs-Modul (Kalender + Jahresuebersicht) in kleinem Patch starten.

## Iteration 78 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Fokusmodus-Hinweis im Inspector + Pin-Status in layout.json speichern).
- Ergebnis: Fokusmodus schreibt jetzt klare Hilfe direkt in den rechten Hilfe-Bereich mit Rueckweg per Escape/Knopf.
- Ergebnis: Modul-Anheften wird jetzt ueber `data/layout.json` gesichert und beim Aktivieren wiederhergestellt.
- Mini-Optimierung: Neuer Footer mit Debugging, Logging, System-Info, KASI_NOTIZ-Schnellspeicher und Gesamt-Export.
- Naechster Schritt: Rechte Sidebar als einklappbare Favoriten-Schnellleiste mit Moduloptionen ausbauen.

## Iteration 77 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Pin-Knopf + Fokusmodus mit Snapshot/Restore).
- Ergebnis: Modulsteuerung hat jetzt den Pin-Knopf im gleichen Tooltip-Standard mit Rueckweg-Hinweis.
- Ergebnis: Fokusmodus als globaler Zustand ist eingebaut (Start/Restore/ESC) und nutzt Layout-Snapshot fuer sicheren Rueckweg.
- Mini-Optimierung: Dashboard nutzt zentrale Layout-Helfer aus `system-module/dashboard_model.js` fuer bessere Wartbarkeit.
- Naechster Schritt: Pin-Status in `data/layout.json` persistieren und Inspector-Hinweise ausbauen.

## Iteration 76 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Modul-Control-Tooltips vereinheitlichen + A11y-Abschlussbericht in Start-Routine).
- Ergebnis: Modulsteuerung hat jetzt einheitliche Kurz-Tooltips mit Rueckweg-Hinweis fuer Maximieren, Minimieren und Ausblenden.
- Ergebnis: Start-Routine gibt nach dem Release-Check jetzt einen A11y-Kurzbericht mit Anzahl bestanden/offen aus.
- Mini-Optimierung: Tooltip-Texte stehen zusaetzlich als aria-label fuer Screenreader bereit.
- Naechster Schritt: Pin-Knopf und Fokusmodus auf denselben Steuerungsstandard bringen.

## Iteration 75 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Lesemodus-Schliessen mit Enter/Alt-Hinweis + Shortcut-Konfliktwarnungen gesammelt im Start-Abschlussbericht).
- Ergebnis: Lesemodus-Status beim Schliessen nennt jetzt Enter sowie Alt+T/Alt+I mit klarem Rueckweg in einfacher Sprache.
- Ergebnis: Start-Routine erzeugt jetzt einen separaten Shortcut-Abschlussbericht, der Konflikte gesammelt anzeigt.
- Mini-Optimierung: Tastaturhilfe im Schliessen-Text fuer Laien klarer gemacht.
- Naechster Schritt: Modul-Control-Leiste mit einheitlichen Tooltips finalisieren.

## Iteration 74 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Drei-Zonen-Layout mit Splitter/Collapse + responsive 1-4 Spalten im Workspace-Grid).
- Ergebnis: Dashboard hat jetzt Layout-Steuerung mit Ein-/Ausblenden, Splitter-Steuerung und Layout-Reset. Zustand wird pro Projekt in `data/layout.json` gespeichert.
- Ergebnis: Modulflaeche passt die Spaltenzahl jetzt automatisch an die Breite an (1-4 Spalten).
- Mini-Optimierung: Neue Layout-Hilfe direkt ueber den Steuerknoepfen mit klarem Rueckweg.
- Naechster Schritt: Einheitliche Modul-Control-Leiste mit Tooltips/Shortcuts final vereinheitlichen.

## Iteration 73 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Alt-Shortcut-Hinweis im Lesemodus-Status + automatischer Shortcut-Konfliktcheck in Start-Routine).
- Ergebnis: Lesemodus-Statusmeldungen nennen jetzt Alt+T/Alt+I sichtbar fuer Fokuswechsel und Enter-Bestaetigung.
- Ergebnis: Start-Routine meldet Shortcut-Konflikte je Betriebssystem mit klarer naechster Aktion.
- Mini-Optimierung: Start-Hinweis nennt bei Konflikt immer den Rueckweg ueber Protokoll oeffnen.
- Naechster Schritt: Konfliktwarnungen im Abschlussbericht gesammelt und kuerzer ausgeben.

## Iteration 72 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Profil-Chip mit letzter Nutzung + sichere Fokusziel-Shortcuts).
- Ergebnis: Songtext-Profil-Chip zeigt jetzt die letzte Nutzung mit laienfreundlichem Zeitstempel.
- Ergebnis: Lesemodus-Fokusziel nutzt jetzt Alt+T/Alt+I und bestaetigt Enter direkt im Auswahlfeld.
- Mini-Optimierung: Statusmeldungen nennen den naechsten Schritt klar in einfacher Sprache.
- Naechster Schritt: Shortcut-Konfliktcheck in Start-Routine ergaenzen.

## Iteration 71 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Profil-Status-Chip + Inline-Hilfe fuer Fokusziel beim Lesemodus-Start).
- Ergebnis: Aktives Zufallsprofil wird als sichtbarer Status-Chip mit Kontrast-Rahmen angezeigt.
- Ergebnis: Lesemodus zeigt das aktuelle Fokusziel (Titel/Inhalt) als Inline-Hilfe beim Oeffnen und bei Wechsel.
- Mini-Optimierung: Fokus-Hilfe nennt Enter als naechsten Schritt in einfacher Sprache.
- Naechster Schritt: Profil-Chip mit letzter Nutzung und Enter-Shortcut-Bestaetigung ausbauen.

## Iteration 70 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Zufallsprofil merken + Fokusziel-Shortcut T/I).
- Ergebnis: Songtext-Einstellungen werden jetzt als eigene Datei gespeichert und beim Laden validiert wiederhergestellt.
- Ergebnis: Im Lyrics-Bereich schalten T und I das Fokusziel fuer den Lesemodus direkt um.
- Mini-Optimierung: Inline-Hilfe im Lesemodus erklaert T/I plus Rueckweg ueber die Auswahl.
- Naechster Schritt: Aktives Zufallsprofil als sichtbaren Status-Chip mit Kontrasttext zeigen.

## Iteration 69 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Zufallsprofil im Songtext-Editor + optionales Fokusziel nach Vorschau).
- Ergebnis: Zufallsinhalt nutzt jetzt Profilfilter (Standard/Techno/Hoerspiel/Chill) mit Eingabepruefung.
- Ergebnis: Lesemodus-Schliessen setzt Fokus jetzt optional auf Titel oder Inhaltsfeld.
- Mini-Optimierung: Hilfe im Songtextbereich nennt neue Profilwahl und den Rueckweg klar.
- Naechster Schritt: Profil- und Fokusauswahl pro Projekt speichern.

## Iteration 67 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Kopieren-Knopf mit Enter/Space-Hinweis + Kurzguide um Speichern/Rueckweg erweitern).
- Ergebnis: Lesemodus-Knopf nennt jetzt klar Enter/Space direkt im Buttontext.
- Ergebnis: Songtext-Kurzguide hat jetzt einen klaren Schritt fuer Speichern plus Rueckweg in einfacher Sprache.
- Mini-Optimierung: Kurzguide hat feste Schrittliste mit eigener ID fuer stabile A11y-Tests.
- Naechster Schritt: Songtext-Editor mit Zufallsgenerator-Inhalt verbinden.

## Iteration 65 (2026-03-03)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Lesemodus-Kopieren + Songtext-Kurzguide mit Tastaturfokus).
- Ergebnis: Lesemodus hat jetzt den Knopf "Songtext kopieren" mit klarer Statusmeldung und Rueckweg-Hinweis.
- Ergebnis: Songtext-Hilfe ist einklappbar, fokusierbar und direkt im Lyrics-Bereich erreichbar.
- Mini-Optimierung: Kurzguide mit Ein-/Ausblenden und Fokusziel in einfacher Sprache.
- Naechster Schritt: Kurzguide um feste Zwei-Schritt-Liste plus Enter/Space-Hinweis erweitern.

## Iteration 66 (2026-03-03)

- Hauptziel: Rail-Rahmen + Statusbanner in 5 Themes mit gleich starker Kontrastpruefung abgeschlossen.
- Mini-Optimierung: Boot-Status-Fallback nennt jetzt alle drei naechsten Schritte (Erneut versuchen, Reparatur starten, Protokoll oeffnen).
- Next Step: Offene Platzhalter-Fragen aus `todo.txt` in `QUESTIONS_TODO.md` priorisieren.

## Iteration 65 (2026-03-02)

- Ziel: Zwei offene Punkte abschliessen (Referenzbild-Abweichungsliste + automatische Folgepunkte im TODO).
- Ergebnis: Referenzbild-Datei entfernt, Dashboard auf naeheres Drei-Spalten-Neonlayout umgestellt.
- Ergebnis: Detailliertes Design-Layout-Manifest als JSON + Doku inkl. Soll/Ist erstellt.
- Mini-Optimierung: Neues Statusbanner in einfacher Sprache im Dashboard sichtbar.
- Naechster Schritt: Kartenfarbprofile je Modul als zentrale Tokens angleichen.

## Iteration 64 (2026-03-02)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Lesemodus-Schliessen mit Escape-Hinweis + Inline-Hilfe je Songtext-Vorlage).
- Ergebnis: Lesemodus hat nun einen eigenen "Vorschau schliessen"-Knopf mit Escape-Rueckweg und klarer Statusmeldung.
- Ergebnis: Songtext-Vorlagen geben jetzt pro Abschnitt eine kurze Laien-Hilfe direkt im Status aus.
- Mini-Optimierung: Zusätzlicher Inline-Hilfetext unter den Vorlagen im Dashboard fuer schnellere Orientierung.
- Naechster Schritt: Lesemodus um Kopieren-Knopf mit Statusmeldung erweitern.

## Iteration 62 (2026-03-02)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Songtext-Editor auf Lyrics-Bereich + getrennte Quick-Store-Dateien je Bereich).
- Ergebnis: Lyrics-Bereich hat jetzt einen integrierten Songtext-Editor mit Intro/Refrain-Vorlagen, Enter/Escape-Hilfe und klaren Rueckweg-Knoepfen.
- Ergebnis: Schnellspeicher speichert nun physisch getrennt in `data/quick_store_inbox.json`, `data/quick_store_lyrics.json` und `data/quick_store_research.json` (inkl. Legacy-Migration).
- Mini-Optimierung: Hilfe-Texte wurden fuer Songideen in einfacher Sprache erweitert.
- Naechster Schritt: Songtext-Editor um Bridge/Sonstiges-Vorlagen und Vorschau erweitern.

## Iteration 61 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Mehrfach-Schnellspeicher + Bereichsauswahl mit eigener Datei).
- Ergebnis: Schnellspeicher trennt jetzt drei Bereiche (Allgemein, Songideen, Recherche) und speichert/liest alles zentral aus `data/quick_store_entries.json`.
- Mini-Optimierung: Bereichswechsel ist direkt im Panel erklaert und per Tastatur sofort nutzbar.
- Naechster Schritt: Songtext-Editor mit Intro/Refrain-Vorlage und Tastaturhilfe starten.

## Iteration 60 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Mini-Punkte-Regel im Start-Check + Schnellspeicher-Modul).
- Ergebnis: Start-Routine validiert jetzt exakt zwei offene Mini-Punkte; Dashboard hat ein neues Schnellspeicher-Panel mit Input-Validierung und Datei-Ausgabe.
- Mini-Optimierung: Schnellspeicher-Panel erklaert Aktion, Datenwirkung und Rueckweg in einfacher Sprache.
- Naechster Schritt: Mehrfach-Schnellspeicherbereiche mit separaten Dateien erweitern.

## Iteration 59 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Wiki-Modul + Wiki-Grundgeruest mit Validierung).
- Ergebnis: Neues Wiki-Modell, Wiki-UI und persistente Datei `data/wiki_notes.json` integriert und getestet.
- Mini-Optimierung: Wiki-Hilfetext mit klarem Rueckweg direkt im Dialogbereich.
- Naechster Schritt: AGENTS-Regel "genau zwei offene Punkte" als automatischen Start-Routine-Check ergaenzen.

## Iteration 58 (2026-03-01)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Kanban-Persistenz + Daten-Inventur-Check).
- Ergebnis: Zentraler Datei-Schreiber fuer JSON aktiv, Start-Routine-Inventurcheck laeuft automatisiert.
- Mini-Optimierung: AGENTS.md um feste Zwei-Punkte-Regel erweitert.
- Naechster Schritt: Wiki-Modul-Grundgeruest mit Validierung bauen und in Start-Routine aufnehmen.

## Iteration 57 (2026-03-01)

- Hauptziel (C) umgesetzt: JSON-Store unterstuetzt jetzt versionierte Writes (versioniertes Speichern) mit fortlaufender Nummer und sicherem Recovery-Pfad.
- Mini-Optimierung: Storage-Fehlermeldungen sind laienklar und nennen immer den naechsten Schritt.
- Next Step: Daten-Inventur-Patch vorbereiten (ueberfluessige data/- und dummys/-Reste risikofrei auflisten und in `todo.txt` dokumentieren).

## Iteration 56 (2026-03-01)

- Hauptziel (B) abgeschlossen: Plugin-Loader ist minimal gehaertet (Manifest-Typ/Version, Plugin-ID-Format, Pfadschutz gegen absolute und Elternpfade).
- Mini-Optimierung: Kanban bietet jetzt optionales Drag-and-Drop als getrennten Zusatzpfad; Dialog bleibt als klarer A11y-Standard erhalten.
- Datenbereinigung: `dummys/unsafe-plugin-manifest.json` auf einheitliches Manifestformat gebracht.
- Next Step (C): Storage-Service weiter haerten (versionierte Writes + Backup-Hook-Checks).

## Iteration 53 (2026-03-01)

- Hauptziel abgeschlossen: Kanban-Karten sind jetzt per Dialog verschiebbar (mit Enter/Escape-Rueckweg und Statushilfe).
- Mini-Optimierung: Jede Karte hat einen klaren Verschieben-Button (44px, Fokus sichtbar, einfacher Hilfe-Text).
- Next Step (C): Kartenverschiebung als naechstes dauerhaft in data/kanban_board.json speichern und Startcheck dafuer erweitern.

## Iteration 52 (2026-03-01)

- Hauptziel abgeschlossen: Referenzbild professionell analysiert und als klare UI-Vorgabe direkt im Dashboard umgesetzt.
- Mini-Optimierung: Team/Kalender sind jetzt mit Textstatus sichtbar statt als leere Platzhalter.
- Next Step (A): Kanban-Schnellansicht im naechsten Patch an echte Moduldaten anbinden.

## Iteration 50 (2026-03-01)

- Hauptziel abgeschlossen: Offener Punkt "Boot-View-Statusbereich mit klaren Phasen + Ampel-Texten" ist vollstaendig umgesetzt.
- Mini-Optimierung: Boot-Status zeigt Ampel nie nur ueber Farbe, sondern immer mit Text und naechstem Schritt.
- Next Step (C): Wiki-Modul als naechstes Teilziel mit klarer Eingabepruefung vorbereiten.

## Iteration 49 (2026-03-01)

- Hauptziel abgeschlossen: Offener Punkt "Backup-Dialog-Sicherheitsabfrage (Prompt) automatisiert testen" ist jetzt vollstaendig umgesetzt.
- Mini-Optimierung: Prompt-Pruefung ist zentral gekapselt und liefert klare Ja/Nein-Ausgabe fuer robuste Rueckwege.
- Next Step (A): Boot-View-Statusbereich mit klaren Phasen + Ampel-Texten fuer Laien stabilisieren.

## Iteration 48 (2026-03-01)

- Hauptziel abgeschlossen: Offener Punkt 'Backup-Auswahl-Dialog als UI inkl. Hook-Ende-zu-Ende testen' ist jetzt per automatischem Test komplett abgedeckt.
- Mini-Optimierung: Test meldet klaren Fehlerpfad in einfacher Sprache durch eindeutige Assertions.
- Next Step (A): Sicherheitsabfrage im Backup-Dialog (Prompt-Bestaetigung) ebenfalls automatisiert testen.

## Iteration 47 (2026-03-01)

- Hauptziel abgeschlossen: Restore-Flow erkennt Ziel-Datei (store/registry) jetzt automatisch aus Backup-Dateinamen.
- Mini-Optimierung: Sicherheitsabfrage mit klarem Rueckweg (abbrechen oder erneut versuchen) vor dem Restore eingebaut.
- Next Step (A): Boot-View-Statusbereich mit klaren Phasen, Ampel-Texten und Weiter-Gate stabilisieren.

## Iteration 46 (2026-03-01)

- Hauptziel abgeschlossen: Todo-Filter (Kalendertag/Heute/Offen/Archiv) mit Tastatur-Shortcuts ist umgesetzt und getestet.
- Mini-Optimierung: Inline-Hilfe am Filter mit klarer Aktion + Rueckweg (Enter/Escape) ist sichtbar.
- Next Step (C): Restore-Flow fuer store/registry automatische Zielerkennung + Sicherheitsabfrage bauen.

Iteration 44 (2026-03-01): Todo-Listen-Modul mit Kalender + Archiv umgesetzt und Backup-Ziel-Datei im Dialog explizit waehlbar gemacht.
Naechster Schritt: Todo-Daten optional persistent speichern und Filter (heute/offen/archiv) erweitern.

Iteration 43 (2026-03-01): Backup-Wiederherstellung im Dashboard nutzt jetzt echten Projektordner-Zugriff und schreibt Zieldateien direkt mit JSON-Validierung.
Naechster Schritt: Wiederherstellung fuer mehrere Zieltypen weiter haerten und Boot-View-Statusbereich stabilisieren.

Iteration 42 (2026-03-01): Backup-Auswahl mit JSON-Store-Backup-Hook verbunden (Event-Log + Dialog-Auswahl + Wiederherstellen-Schritt).
Naechster Schritt: Echte Wiederherstellung aus Dialog direkt mit Dateizugriff koppeln und Ende-zu-Ende pruefen.

Iteration 41 (2026-03-01): Kontrastmessung je Theme automatisiert, Release-Check prueft jetzt WCAG-AA Zielwert (4.5) fuer Haupttext und Topbar.
Naechster Schritt: Backup-Auswahl-Dialog direkt an JSON-Store-Backup-Hook anbinden und Ende-zu-Ende pruefen.

# SELFINFO

Stand: 2026-03-01
Iteration: 39

## Iteration 39 – Backup-Dialog mit 5-Punkte-Check + Doku-Readiness

- Backup-Dialog im Dashboard zeigt jetzt den 5-Punkte-Release-Check direkt im Dialog als Inline-Hilfe.
- Release-Readiness-Check prueft jetzt zusaetzlich die Doku-Regel fuer README, CHANGELOG und todo.
- Naechster Schritt bleibt: Backup-Dialog an den JSON-Store-Backup-Hook anbinden.

## Iteration 37 – Release-Fertig je Einzelpunkt

- Entscheidungsregel dokumentiert: Einzelne offene Punkte duerfen
  release-fertig abgeschlossen werden, wenn alle Pflichtchecks gruen sind.
- README um 5-Punkte-Kurzcheck in einfacher Sprache erweitert.
- Naechster Schritt bleibt unveraendert: Backup-Dialog mit Backup-Hook verbinden.

## Iteration 36 – Strategie-Update

- Entwicklungsstrategie auf den aktuellen Stand verdichtet: zuerst sichere
  Kernpfade (Plugin-Loader + Storage), danach modulare Features.
- Einheitliche Reihenfolge je Patch festgelegt: PatchSpec, Mini-Patch,
  `bash start.sh`, Doku-Update, Abschluss-Notiz.
- Informationsdateien synchronisiert: README, PROJECT_INFO, CHANGELOG,
  todo, MEMORY_FIXES, QUESTIONS_TODO und AGENTS_LOG.
- Naechste zwei Pflichtziele fuer die Folgeiteration gesetzt:
  **B (Plugin-Loader minimal)** und **C (Storage-Service robust)**.
- Laienfokus verstaerkt: jeder Fehlerweg bleibt bei
  „Erneut versuchen / Reparatur starten / Protokoll oeffnen".

## Gemacht

- Platzhalter-Scan praezisiert: nur echte Kommentar-/Aufgabenzeilen, inklusive Unterordner-Scan, mit neuen Tests abgesichert.
- Help-Panel-Mini-Leitfaden um Tastaturhinweis fuer Theme-Wechsel (Tab + Enter) erweitert.
- Prompt aus der Anforderung analysiert und als optimierte, ausführbare Version dokumentiert.
- Modernes Dashboard als neue Vorlage ergänzt (`templates/dashboard.*`).
- Projektordner-Start mit Berechtigungsabfrage, IndexedDB-Handle und Auto-Reconnect ergänzt.
- Projektstruktur-Prüfung/Erstellung im Dashboard-Startfluss ergänzt.
- Zonen (Favoriten, Schnellzugriff, Module) als vertikal verschiebbare Bereiche ergänzt.
- Dashboard-Modelllogik mit Input-/Output-Validierung und automatischen Tests ergänzt.
- Start-Routine-Pflichtpfade und Doku/TODO auf Dashboard-Stand erweitert.
- Neue Entwickler-Infodatei mit Ordner-/Dateistruktur, Standards und Befehlen ergänzt.
- README neu strukturiert: klare Kapitel, Laienbegriffe, A11y-Standard,
  robuste Start- und Debug-Anleitung.

- Start-Routine-Fehlerausgabe um Debug-Modus und Log-Datei erweitert.
- Plugin-Loader minimal umgesetzt (Manifest, isoliertes Laden, Health-Check).
- Registry-Health-Check mit optionalen Debug-Details erweitert.
- Storage-Service erweitert: JSON-Schema-Validierung vor Write und Backup-Hook fuer Folgeschritte.

- Dashboard-Haupt-Kern-Modul als neues Core-Modul ergänzt.
- Start-Routine startet das Dashboard jetzt automatisch am Ende (mit Headless-Fallback).

- Neues Mockup `templates/dashboard_mockup.html` mit aktueller Start- und Dashboard-Logik ergänzt.

- README weiter verbessert: offene Punkte oben, klare Laienanleitung mit Befehlen und stärker sichtbare Struktur.

- Dashboard-Layout in `templates/dashboard.html` visuell an die Referenz angenaehert (Topbar, 3-Spalten, Modul-Kacheln, Quick-Links).
- A11y-Details im Layout ausgebaut: sichtbarer Fokus, Kontrast+ konsistent, 44px-Bedienelemente und klare Tastaturhinweise.

- Hauptbereich als leere, zentrierte Modul-Rasterflaeche umgebaut: Aktivierung in Auswahl-Reihenfolge, inklusive Maximieren/Minimieren/Ausblenden pro Modul.

- Dashboard kompakt gemacht: weniger Abstände, bessere Größenverhältnisse und klarere Anordnung.
- Pseudotexte in Seitenbereichen entfernt; ungenutzte Bereiche bleiben leer und flexibel.
- Dashboard-Kurztexte zentral in `config/messages_de.json` ausgelagert und dynamisch geladen.

- Gefuehrte Hilfe als eigenes Dashboard-Panel ergaenzt (klare Einsteiger-Schritte).
- Hilfe-Aktionen vereinheitlicht: Erneut versuchen, Reparatur starten, Protokoll oeffnen.
- Topbar um Naechster Schritt und Laien-Tipp erweitert.

- AGENTS.md mit neuem Pflichtpunkt erweitert: pro Iteration eine Mini-Optimierung für Hilfe/Tooltip/A11y/Kontrast plus Standards für Buttons, Abstände, Themes und kleine Bildschirme.

- Start-Routine um Release-Readiness-Check (A11y-Basics + 3 Themes + Hilfe-Aktionen) erweitert.
- Neue automatische Tests fuer den Release-Readiness-Check ergänzt.

- README um aktuelle Tool-Module-Liste erweitert und geplanter Modul-Backlog klar dokumentiert.
- TODO um konkrete Implementierungsaufgaben fuer angeforderte Untermodule erweitert.

- Start-Routine robuster gemacht: Datenordner-Autoanlage, Format-Check nach Formatierung und striktere Befehls-Output-Validierung.

- Neues Kernmodul fuer Genres/Moods/Stile-Archiv ergänzt: CSV-Import, Duplikatpruefung, Profil-Kategorien, Favoriten-Sternchen und Logging.
- Neue automatisierte Tests fuer Archiv-Import, Linux-Slug, Favoriten und Log-Ausgabe ergänzt.
- Hilfe um kurzen Favoriten-Hinweis (`*Eintrag*`) fuer das neue Archiv erweitert.

- Dashboard-Tastaturpfad verbessert: Escape schliesst die Debug-Ansicht als klaren Rueckweg.
- Release-Readiness-Check prueft jetzt auch Tastatur-Hinweis und Escape-Handler automatisch.
- Hilfe-Doku mit klarem Debug-Fehlerschritt fuer Startprobleme aktualisiert.
- Gefuehrte Dashboard-Hilfe um klaren Enter/Escape-Hinweis erweitert (Aktion + Rueckweg).
- Release-Readiness prueft den Enter-Hinweis jetzt automatisch mit.

- README zeigt jetzt oben den Fortschritt als Prozent und die Mengen erledigt/offen aus todo.txt.
- Dashboard-Design weiter optimiert: Skip-Link fuer Tastatur, einheitliche Abstands-Tokens und mobile Vollbreite fuer Buttons.

- Start-Routine erkennt jetzt veraltete Abhaengigkeiten ueber Fingerprint (package-lock/package) und installiert bei Bedarf automatisch neu.
- Abhaengigkeits-Status wird in `data/dependency_state.json` gespeichert und bei jedem Start validiert.
- Hilfe um klare Laien-Schritte bei Paketfehlern erweitert (erneut versuchen, Protokoll oeffnen, Reparatur starten).

- Doku-Regel ergaenzt: README.txt wird pro Iteration verpflichtend mit aktualisiert (Status + naechster Schritt).

- Theme-Umschalter mit Tooltip in einfacher Sprache erweitert (Aktion + Rueckweg) und per aria-describedby fuer Screenreader verknuepft.

- Release-Readiness-Check erweitert: validiert jetzt auch 44px-Klickziele, sichtbaren Fokus und zentrale Hilfe-Triplets (`what/data/undo`) in `messages_de.json`.
- Dashboard-Mockup beim Theme-Feld mit Tooltip + `aria-describedby` auf gleiche Laienfuehrung wie Haupt-Dashboard angehoben.

- Start-Routine um automatischen Platzhalter-Scan erweitert (TODO/FIXME/PLACEHOLDER/DUMMY) mit klarer Datei-/Zeilenmeldung und naechstem Schritt.

- AGENTS-Iterations-Pipeline erweitert: neuer Pflichtschritt "Autonomer Abschluss-Check" nach Doku mit `bash start.sh` als Freigabe.

- README um Mini-Leitfaden fuer den Pflicht-Abschluss-Check erweitert (3 klare Schritte + Hilfe-Befehle).
- Platzhalter-Scan verbessert: `todo-title` in HTML loest keinen Fehlalarm mehr aus, nur echte Marker wie `TODO:` werden gemeldet.

- AGENTS.md erweitert: klare Releasefertig-Definition pro Patch (Implementierung, Fehlerpfad, Test, Doku, Startcheck).
- AGENTS.md erweitert: Datei-/Fortschrittsstatus muss sichtbar sein (Dateiname oder `data/file_status_index.json`).

- Hilfe-Panel um einen kurzen 3-Schritt-Mini-Leitfaden aus README erweitert und im Modell validiert.

- README-Fortschritt wird jetzt in der Start-Routine automatisch aus `todo.txt` synchronisiert (Prozent, erledigt, offen).

## Next Step

- Option A als naechstes: Boot-View stabilisieren (Phasen, Ampel, Details, Weiter-Gate).

## Iteration 37 – Plugin-Loader-Hardening

- Plugin-Manifest validiert jetzt doppelte IDs vor dem Laden (Validierung = Eingabepruefung).
- Plugin-Loader blockiert Modulpfade ausserhalb des Projektordners fuer mehr Sicherheit.
- Neue Tests decken beide Fehlerfaelle ab (doppelte ID + unsicherer Pfad).
- `bash start.sh` lief komplett gruen durch.
- Naechste zwei Pflichtziele bleiben: **B (Plugin-Loader minimal absichern)** und **C (Storage-Service robust)**.

- Iteration 45: Todo-Persistenz umgesetzt (`data/store.json`) mit Import/Export-Validierung im Modell.
- Checks: `npm run format`, `node --test`, `bash start.sh` alle erfolgreich.
- Next Step: Empfehlung 2 umsetzen (Todo-Filter heute/offen/archiv + Tastatur-Shortcuts).

- Help-Panel-Mini-Leitfaden um Schritt 4 erweitert: Referenzbild-Abgleich alle 5 Iterationen als sichtbarer Pflicht-Hinweis.

## Iteration 55 – Kanban-Stand speichern (fertig)

- Hauptziel: Kanban-Kartenverschiebung persistent gespeichert.
- Ergebnis: Nach Verschieben wird validiertes JSON direkt nach `data/kanban_board.json` geschrieben.
- Mini-Optimierung: Erfolgsstatus nennt jetzt "verschoben und gespeichert" fuer klare Rueckmeldung.
- Next Step: Option B (Plugin-Loader minimal) oder optionaler Kanban-Drag-and-Drop als Zusatzpfad planen.

## Iteration 63 (2026-03-02)

- Ziel: Zwei offene Punkte vollstaendig abschliessen (Bridge/Sonstiges-Vorlagen + Songtext-Lesemodus).
- Ergebnis: Songtext-Editor bietet jetzt vier Vorlagen (Intro, Refrain, Bridge, Sonstiges) mit klaren Statusmeldungen.
- Ergebnis: Neuer Lesemodus zeigt Songtitel, Zeilenanzahl und bereinigten Songtext direkt im gleichen Panel.
- Mini-Optimierung: Lesemodus-Hilfetext in einfacher Sprache mit Rueckweg-Hinweis ergänzt.
- Naechster Schritt: Lesemodus mit eigenem Schliessen-Knopf und Escape-Hinweis finalisieren.

## Iteration 66 (2026-03-03)

- Zwei offene TODO-Punkte abgeschlossen: UI-Fix Layout-Manifest (Rails/Banner) und Boot-View-Statusbereich mit klaren Phasen/Ampeltexten.
- Globales UI-Token-Set als zentrale Wahrheit angelegt (`config/ui_design_tokens.json`) und in Release-Check eingebunden.
- Mini-Optimierung Hilfe/UX: Boot-Phasen im Dashboard klar als Phase 1-4 beschriftet.
- Naechster Schritt: Option A priorisieren (Splitter + Collapse + Persistenz + Layout-Reset).

## Iteration 67 (2026-03-03)

- Status: Zwei offene Mini-Punkte aus `todo.txt` vollstaendig abgeschlossen (Guide-Schrittliste + Kopierfehler-Hilfe).
- Ergebnis: Lyrics-Kurzguide ist klarer fuer Tastatur (Enter/Space/Escape), Lesemodus zeigt manuellen Kopierweg sichtbar an.
- Next Step: Die zwei neuen Mini-Punkte in `todo.txt` fuer den Lyrics-Flow umsetzen.

## Iteration 68 (2026-03-03)

- Hauptziel: Songtext-Editor per 1-Klick-Zufallsinhalt mit Zufallsgenerator verbunden.
- Zusaetzlich abgeschlossen: Interoperabilitaetspunkt im TODO und Fokus-Ruecksprung im Lesemodus.
- Checks: `npm run format`, `node --test`, `bash start.sh`.
- Next Step: Option A weiter in kleinen Schritten (Boot-View-Weiter-Gate + Detailanzeige).

## Iteration 87

- Hauptziel: Zwei offene Mini-Punkte abgeschlossen (Safe-Mode-Support-Verlauf + 3er-Versionsvergleich).
- Ergebnis: Reset protokolliert jetzt Support-Events; Restore zeigt Felder/Bytes/Zeit klar und farbunabhaengig.
- Naechster Schritt: Boot-Fokusziel als Einstellung in `data/layout.json` speichern.

## Iteration 88

- Hauptziel: Zerrissenes Dashboard-Layout stabilisieren und Fokusfluss nach Boot-Gate fuer A11y verbessern.
- Ergebnis: Fokusziel ist einstellbar und persistent; Hilfe hat Support-Filter; Restore hat Detailmodus.
- Next Step: Boot-Gate-Hinweis mit aktivem Fokusziel direkt im Text anzeigen.

## Iteration 89

- Version: v0.89-layout-notes-start
- Ergebnis: Sidebar-Button-Links, Notizmodul-Autostart, umbenannte Zeitbars mit Klappfunktion.
- Next Step: Boot-Gate-Hinweis zeigt das aktive Fokusziel direkt neben dem Weiter-Knopf.

- Iteration: Drei offene Mini-Punkte abgeschlossen (Boot-Fokus-Hinweis, Support-Freitextsuche, Versions-Detailgruppen).
- Version: UI-Hilfe/Restore-Flow verbessert ohne neue Abhaengigkeiten.
- Next Step: Support-Suche mit Trefferzahl + Enter-Shortcut erweitern.

## Iteration 91

- Hauptziel: Zwei offene Mini-Punkte abgeschlossen (Boot-Live-Ansage + Support-Trefferzahl mit Enter-Shortcut).
- Version: v0.91-boot-live-support-hitcount
- Next Step: Versions-Detailgruppen standardmaessig eingeklappt starten.
