## Iteration 92 - Zwei TODO-Punkte abgeschlossen

- Support-Verlauf zeigt jetzt pro Treffer einen klaren Tastatur-Hinweis (Tab/Enter/Escape).
- Versions-Detailmodus bleibt nach Vergleich standardmaessig eingeklappt (`open=false`) und ist damit ruhiger lesbar.

## Iteration 88 - Release-Doku neu geordnet

- Boot-Gate-Hinweis nennt jetzt das aktive Fokusziel (Modul/Hilfe) klar im Text.
- Support-Verlauf hat jetzt Freitextsuche (Typ/Datum) mit einfacher UND-Regel zum Filter.
- Versions-Detailmodus gruppiert JSON-Schluessel in Neu/Entfernt/Gleich fuer klaren Vergleich.

- README wurde als klare Release-Startseite neu aufgebaut (Ziel, Struktur, Schnellstart, Pflichtbefehle, Laienhilfe).
- AGENTS.md wurde als kompakte V3-Regelbasis fuer Releasefinalisierung neu strukturiert.
- todo.txt erhielt einen neuen Iterationsblock fuer die drei abgeschlossenen Doku-Mini-Punkte.

## Iteration 87 - Support-Verlauf + 3er-Versionsvergleich

- Safe-Mode-Reset schreibt jetzt einen Support-Verlaufseintrag in `data/backup_events.json` und zeigt den Speicherstatus klar an.
- Restore-Versionsvergleich zeigt jetzt farbunabhaengig drei klare Unterschiede: Felder, Dateigroesse und Zeitstempel.
- Mini-UX: Statusmeldungen nennen den naechsten Schritt in einfacher Sprache.

## Iteration 86 - Safe-Mode-Reset, Versionsvergleich, Boot-Fokus

- Hilfe-Panel hat jetzt einen Safe-Mode-Reset-Knopf mit Sicherheitsabfrage und klarer Rueckmeldung fuer den naechsten Schritt.
- Restore-Dialog zeigt jetzt vor dem Restore einen Versionsvergleich in einfacher Sprache (Felder + Dateigroesse).
- Nach Boot-Gate-Freigabe springt der Fokus automatisch auf das erste aktive Modul und meldet den Schritt fuer Screenreader.

## Iteration 85 - Boot-Gate/Hilfe, Safe-Mode-Status, Versions-Restore

- Boot-Gate-Hinweis und Hilfe-Text laufen jetzt aus einem Modell und werden mit aria-live klar angesagt.
- Rechtes Hilfe-Panel zeigt Safe-Mode-Status mit naechstem Schritt in einfacher Sprache.
- Backup-Dialog kann jetzt auch versionierte Dateien aus dem current-Pointer-Pfad wiederherstellen.

## 2026-03-01 – Iteration 84

- Drei offene Mini-Punkte abgeschlossen: Boot-Weiter-Gate blockiert jetzt den Weiter-Knopf, bis alle Boot-Phasen gruen sind.
- Drei offene Mini-Punkte abgeschlossen: Plugin-Loader hat jetzt Safe-Mode-Ein-Klick-Reparatur fuer defekte Manifest-Lagen.
- Drei offene Mini-Punkte abgeschlossen: JSON-Store schreibt bei Versionierung einen current-Pointer und kann daraus wiederherstellen.
- UX/A11y-Mini-Optimierung: Neuer Gate-Hinweis mit klarer Aktion und Rueckweg im Boot-Status.

## 2026-03-01 – Dashboard-Layout mit Sidebar-Suche, 3x3-Grid und Notiz-Fallback

- Linke Sidebar zeigt Modulsuche + Modul-Liste aus zentraler Registry und aktiviert Module ohne Reload.
- Center nutzt Dashboard-Top (Version/Pfad/Status) und 3x3-Raster als Standard mit responsivem Verhalten.
- Footer-Notiz speichert in `.modultool/quicknote.txt` bei vorhandener Berechtigung, sonst neutral in localStorage.

## Iteration 82 (2026-03-01)

- Drei offene Mini-Punkte abgeschlossen: Favoriten-Schnellaktionen sind jetzt mit echten Modulstatus-Aktionen verbunden.
- Untere Moduloptionen zeigen jetzt kontextsensitive Aktionen pro Modul (z. B. Planung, Leads, Bericht, Tickets) mit Rueckweg-Hinweis.
- Start-Routine meldet TODO-Vorlagenfehler jetzt mit direkter Zeilenhilfe und naechstem Schritt inkl. Protokoll-Hinweis.
- UX/A11y-Mini-Optimierung: Favoriten-Buttons haben klare Aktionstexte und zentrale Statusmeldungen in einfacher Sprache.

## Iteration 81 (2026-03-01)

- Sidebar als ausklappbare Favoritenleiste mit Alt+F und klaren Rueckweg-Hinweisen ergaenzt.
- Unterer Modulbereich zeigt jetzt modulbezogene Optionen direkt im Workspace.
- Start-Routine prueft TODO-Pflichtfelder jetzt strikt auf "vorhanden + nicht leer" und nennt den naechsten Schritt klar.
- UX/A11y-Mini-Optimierung: Neue Hilfetexte fuer Favoritenleiste und Moduloptionen in einfacher Sprache.

## 2026-03-03 – Iteration 80

- Drei offene Punkte abgeschlossen: Songtext-Editor als Paket (Vorlagen + Lesemodus + Rueckweg) ist jetzt als abgeschlossen markiert und mit Kategorie-Auswahl fuer Zufall erweitert.
- Drei offene Punkte abgeschlossen: Dokument-Vorschau ist im Songtext-Modul verankert, inklusive Fokusziel und klarer Tastaturhilfe.
- Drei offene Punkte abgeschlossen: Zufallsgenerator hat jetzt Kategorie-An/Auswahl (Genre/Stimmung/Stil) mit Validierung, Persistenz und laienfreundlicher Statusmeldung.
- Mini-Optimierung Hilfe/A11y: Neue Inline-Hilfe erklaert aktive Zufallskategorien und den Rueckweg in einfacher Sprache.

## 2026-03-01 – Iteration 79

- Start-Routine prueft jetzt strikt: Es muessen genau drei offene `Naechster Mini-Punkt`-Eintraege in `todo.txt` vorhanden sein.
- Neue TODO-Vorlagenpruefung erzwingt Pflichtfelder pro offenem Mini-Punkt: Code, Tests, Doku, Risiko, Naechster Schritt.
- `todo.txt` hat jetzt eine feste Vorlage und drei offene Mini-Punkte mit vollstaendigen Pflichtfeldern fuer releasefertige Planung.

## 2026-03-01 – Iteration 78

- Fokusmodus zeigt jetzt klare Hilfe im rechten Hilfebereich mit Rueckweg (Escape oder Button).
- Modul-Pin wird in `data/layout.json` gespeichert und bei neuer Aktivierung wiederhergestellt.
- UX-Mini-Optimierung: Footer um Debugging/Logging/System-Infos + KASI_NOTIZ + Gesamt-Export erweitert.

## 2026-03-03 – Wartbarkeit: Modell-Helfer + Fokusmodus

- Dashboard nutzt jetzt zentrale Layout-Helfer aus `system-module/dashboard_model.js` (weniger doppelte Logik, leichter zu warten).
- Modulsteuerung hat jetzt Pin-Knopf mit einheitlichem Tooltip-Standard und Rueckweg-Hinweis.
- Fokusmodus (100%-Ansicht) ist als globaler Zustand mit Escape + Restore-Knopf abgesichert.

## 2026-03-03 – Iteration 76

- Zwei offene Mini-Punkte abgeschlossen: Modul-Control-Leiste verwendet jetzt einheitliche Tooltip-Kurztexte mit Rueckweg-Hinweis fuer Maximieren, Minimieren und Ausblenden.
- Start-Routine erweitert: Abschlussbericht enthaelt jetzt zusaetzlich einen kompakten A11y-Kurzstatus auf Basis der Release-Checks.
- Mini-Optimierung Hilfe/UX: Steuerungs-Hinweise sind als `title` und `aria-label` fuer Laien konsistent formuliert.

## 2026-03-03 – Iteration 75

- Zwei offene Mini-Punkte abgeschlossen: Lesemodus-Schliessen nennt jetzt Enter sowie Alt+T/Alt+I als direkte Tastaturhilfe mit naechstem Schritt.
- Start-Routine gibt Shortcut-Konfliktwarnungen jetzt gesammelt im Abschlussbericht aus (kurzer Kurzblock fuer Laien).
- Mini-Optimierung Hilfe/UX: Klarerer Rueckweg-Hinweis beim Schliessen des Lesemodus.

## 2026-03-03 – Iteration 74

- Zwei offene Punkte abgeschlossen: Drei-Zonen-Layout hat jetzt Splitter, Collapse-Knoepfe und Layout-Reset mit projektbezogener Persistenz in `data/layout.json`.
- Workspace-Grid nutzt jetzt responsive 1-4 Spalten und bleibt damit naeher am zweiten Vorlagenbild (klare Kartenmitte mit stabilen Rails).
- Mini-Optimierung Hilfe: Neue Inline-Hilfe bei Layout-Steuerung erklaert Aktion und Rueckweg in einfacher Sprache.
- Risiko: niedrig, weil nur Dashboard-Layout, zugehoerige Modell-Helfer und gezielte Tests erweitert wurden.

## 2026-03-03 – Iteration 73

- Zwei offene Mini-Punkte abgeschlossen: Lesemodus-Statusmeldungen zeigen jetzt sichtbar **Alt+T/Alt+I** als Fokusziel-Hilfe bei Vorschau und Enter-Bestaetigung.
- Start-Routine hat jetzt einen automatischen Shortcut-Konfliktcheck fuer Browser/OS-Tasten und meldet Hinweise mit naechstem Schritt in einfacher Sprache.
- Risiko: niedrig, weil nur Statusmeldungen, Start-Check und gezielte Unit-Tests erweitert wurden.

## 2026-03-03 – Iteration 72

- Zwei offene Mini-Punkte abgeschlossen: Profil-Status-Chip zeigt jetzt die letzte Nutzung als Zeitstempel in einfacher Sprache.
- Lesemodus-Fokusziel kann jetzt sicher per **Alt+T** (Titel) und **Alt+I** (Inhalt) umgeschaltet werden; Enter im Auswahlfeld bestaetigt die Wahl mit Statusmeldung.
- Risiko: niedrig, weil nur Lyrics-UI, Shortcut-Logik und gezielte Tests angepasst wurden.

## 2026-03-03 – Iteration 71

- Songtext zeigt jetzt ein sichtbares Profil-Statusfeld mit Kontrast-Rahmen und Live-Text zum aktiven Zufallsprofil.
- Lesemodus zeigt beim Oeffnen eine kurze Inline-Hilfe zum aktuellen Fokusziel (Titel/Inhalt) mit Enter-Hinweis zur Bestaetigung.
- Risiko: niedrig, weil nur Lyrics-UI, gebundene Quick-Store-Logik und gezielte Tests erweitert wurden.

## 2026-03-03 – Iteration 70

- Songtext merkt jetzt Ihr letztes Zufallsprofil pro Projekt in `data/quick_store_lyrics_preferences.json` und laedt es beim Start automatisch.
- Lesemodus-Fokusziel kann jetzt mit Tastaturkuerzeln umgeschaltet werden: **T** fuer Titel, **I** fuer Inhaltsfeld.
- Hilfe-Update: Inline-Hinweis im Lesemodus erklaert die T/I-Steuerung mit Rueckweg ueber die Auswahlliste.

## 2026-03-03 – Iteration 69

- Songtext-Zufallsinhalt hat jetzt Profilfilter (Standard/Techno/Hoerspiel/Chill) mit Validierung und klarer Statusmeldung.
- Lesemodus hat jetzt ein waehlbares Fokusziel nach dem Schliessen (Titel oder Inhaltsfeld) fuer bessere Tastaturfuehrung.
- Hilfe-Update: Kurztext fuer Zufallsprofil und Fokusziel in `docs/HILFE.md` ergaenzt.

## 2026-03-01 – Songtext-Hinweise fuer Kopieren + Kurzguide erweitert

- Lesemodus-Knopf zeigt jetzt direkt den Tastaturhinweis **Enter/Space** fuer das Kopieren.
- Songtext-Kurzguide fuehrt jetzt in drei Schritten inklusive **Speichern + Rueckweg** in einfacher Sprache.
- Neuer Test prueft die sichtbaren Hinweise im Dashboard-HTML automatisch.
- Risiko: niedrig, da nur Songtext-UI-Text und ein gezielter Test erweitert wurden.

## 2026-03-03 – Iteration 67

- Zwei offene Mini-Punkte abgeschlossen: Songtext-Kurzguide zeigt jetzt eine klare Enter/Space/Escape-Schrittliste direkt im Lyrics-Bereich.
- Lesemodus hat jetzt eine sichtbare Kopierfehler-Hilfe mit manuellem Rueckweg (Strg+C/Cmd+C), damit Nutzer trotz Clipboard-Sperre weiterarbeiten koennen.
- Risiko: niedrig, weil nur Quick-Store-UI, Modul-Hook und Doku erweitert wurden.

## 2026-03-03 – Iteration 66

- Zwei offene TODO-Punkte abgeschlossen: Rail-Rahmen + Statusbanner wurden in allen 5 Themes auf AA-Kontrast feinjustiert, inklusive harter Kontrastchecks fuer Banner, Rail und Kartenprofile.
- Zentrale Kartenfarb-Profile als Design-Tokens pro Modul eingefuehrt (`project`, `sales`, `analytics`, `support`), damit kuenftige Layout-Aenderungen ohne CSS-Streuung moeglich bleiben.
- Referenzbild-Soll/Ist erneut hart geprueft: Drei-Spalten-Raster, Neon-Rahmen und Statusbanner wurden visuell angeglichen; Risiko niedrig, weil IDs und Bedienlogik gleich blieben.

## 2026-03-02 – Iteration 65

- Referenzbild-Datei aus dem Projekt entfernt und das Dashboard visuell auf dunkles Neon-Layout mit klarer Drei-Spalten-Struktur umgestellt.
- Neues `design_layout_manifest` als JSON + Doku eingefuehrt (inkl. Soll/Ist-Abweichungsliste und Folgepriorisierung).
- Risiko: niedrig, weil bestehende IDs/Bedienlogik im Dashboard erhalten blieben und nur Layout/Manifest erweitert wurden.

## 2026-03-02 – Iteration 64

- Songtext-Lesemodus hat jetzt einen eigenen Schliessen-Knopf mit Escape-Hinweis und Statusmeldung.
- Songtext-Vorlagen zeigen kurze Inline-Hilfe je Abschnitt fuer bessere Orientierung in einfacher Sprache.
- Risiko: niedrig, weil nur Quick-Store-UI, Modul-Logik, Tests und Doku erweitert wurden.

## 2026-03-02 - PATCH-062

- Songtext-Editor im Bereich Songideen erweitert: Intro/Refrain-Vorlagen, Enter/Escape-Hilfe und klare Rueckweg-Knoepfe.
- Schnellspeicher speichert jetzt physisch getrennt in `quick_store_inbox.json`, `quick_store_lyrics.json` und `quick_store_research.json`.
- Risiko: niedrig, da Legacy-Migration aus `data/quick_store_entries.json` aktiv bleibt und neue Helper-Tests bestehen.

## 2026-03-01 - PATCH-061

- Schnellspeicher auf drei Bereiche erweitert und je Bereich validiert gespeichert.
- Persistenz erweitert: Datei wird beim Start gelesen und nach jedem Speichern aktualisiert.
- UX/A11y: Bereichsauswahl mit klarer Hilfe im Panel und Rueckweg-Hinweis.

## 2026-03-01 – Zwei weitere Punkte abgeschlossen (Mini-Punkte-Regel + Schnellspeicher)

- Start-Routine prueft jetzt automatisch die AGENTS-Regel: In `todo.txt` muessen genau zwei offene `Naechster Mini-Punkt`-Eintraege stehen.
- Neues Schnellspeicher-Modul ist im Dashboard aktiv (Titel + Inhalt) und speichert in `data/quick_store_entries.json`.
- Risiko: niedrig, da nur ein neuer Modulpfad und ein klar abgegrenzter Start-Check erweitert wurden.

## 2026-03-01 – PATCH-059

- Zwei offene TODO-Punkte abgeschlossen: Wiki-Modul mit Kategorie-Speicher und Grundgeruest mit Validierung (Eingabepruefung) eingefuehrt.
- Neues UI-Hilfeelement: Wiki-Panel mit klarer Aktion und Rueckweg fuer Laien.
- Risiko: niedrig, da neues Modul getrennt eingebunden und mit Modelltests abgesichert.

## 2026-03-01 – Zwei offene Punkte abgeschlossen: Kanban-Persistenz + Daten-Inventur-Check

- Offener Punkt 1 abgeschlossen: Kanban speichert Kartenverschiebungen jetzt ueber einen zentralen Projekt-Datei-Schreiber mit Pfad-Validierung.
- Offener Punkt 2 abgeschlossen: Daten-Inventur laeuft als automatischer Platzhalter-Scan in der Start-Routine und meldet klare naechste Schritte.
- Mini-Optimierung Hilfe/UX: neue Regel in `AGENTS.md`, dass pro Iteration zwei offene Punkte vollstaendig abgeschlossen werden.
- Risiko: niedrig, weil nur ein neuer Writer, ein kleiner Dashboard-Hook und gezielte Tests dazugekommen sind.

## 2026-03-01 – Option C: JSON-Store mit Versionierung + Recovery gehaertet

- `atomicWriteJson` kann jetzt optional versioniert speichern (`*_versions/*_v0001.json`) und prueft den Output inklusive Versionspfad.
- Neuer Recovery-Pfad: `recoverJsonFromLatestVersion` stellt die letzte gueltige Version wieder her und erstellt dabei wie gewohnt ein Backup.
- Mini-Optimierung Hilfe/UX: neue Fehlertexte im Recovery-Pfad nennen klare naechste Schritte (erneut versuchen, Reparatur starten, Protokoll oeffnen).
- Risiko: niedrig, da nur Storage-Kern und zugehoerige Tests erweitert wurden.

## 2026-03-01 – Plugin-Loader minimal abgesichert + Drag-and-Drop als Zusatz-Patch

- Option B priorisiert: Plugin-Loader prueft jetzt Manifest-Typ, Semver-Version, Plugin-ID-Format und blockiert absolute oder unsichere Modulpfade frueh.
- Drag-and-Drop fuer Kanban ist jetzt als kleiner, getrennter Zusatzpfad aktiv; der bestehende Dialog bleibt Standard-Rueckweg fuer Tastatur und Barrierefreiheit.
- Ueberfluessige Daten bereinigt: unsicheres Dummy-Manifest auf gueltige Manifest-Struktur vereinheitlicht.
- Risiko: niedrig bis mittel, weil nur Plugin-Loader, Kanban-Vorschau, Dummy-Daten und Tests angepasst wurden.

## 2026-03-01 – Kanban-Dialog fuer Kartenverschiebung (Enter/Escape + Rueckweg)

- Offener TODO-Punkt abgeschlossen: Jede Kanban-Karte hat jetzt einen "Verschieben"-Button mit Dialog.
- Dialog ist tastaturfreundlich: Enter speichert, Escape/Abbrechen bricht ab, Status zeigt den naechsten Schritt.
- Neue Validierung fuer Kartenverschiebung ergaenzt (`moveKanbanItem`) und per Test abgesichert.
- Risiko: niedrig, da nur Kanban-Bereich und zugehoerige Tests betroffen sind.

## 2026-03-01 – Kanban-Schnellansicht mit echten JSON-Daten + Keyboard-A11y

- Kanban-Schnellansicht liest jetzt echte Daten aus `data/kanban_board.json` statt statischer Beispieltexte.
- Neue Kanban-Logik ist als eigenes Modul ausgelagert (`templates/kanban_preview.js`) mit Input-/Output-Pruefung und Tastatursteuerung (Pfeil links/rechts + sichtbarer Fokus).
- Start-Routine und Pflichttests wurden um die neuen Kanban-Dateien erweitert, damit der Check weiter vollautomatisch bleibt.
- Risiko: niedrig, da nur Kanban-Bereich, zugehoerige UI-Logik und Tests erweitert wurden.

## 2026-03-01 – Referenzbild-Analyse als Dashboard-Vorgabe umgesetzt

- Das Dashboard hat jetzt einen neuen Vorlage-Bereich mit Neon-Stil, KPI-Karten und Kanban-Schnellansicht, damit Layout und Struktur klar am Referenzbild ausgerichtet sind.
- Die rechte Spalte nutzt nun sichtbare Team- und Kalendertexte statt leerer Platzhalter, damit Status nicht nur ueber Farbe vermittelt wird.
- Mini-Optimierung Hilfe/UX: jeder neue Bereich nennt Aktion + Rueckweg in einfacher Sprache.
- Risiko: niedrig, da nur UI-Template/CSS und Doku erweitert wurden.

## 2026-03-01 – Prompt-Sicherheitsabfrage automatisch geprueft

- Backup-Restore nutzt jetzt eine zentrale Prueffunktion fuer die Prompt-Bestaetigung (Dateiname muss exakt passen).
- Neuer automatischer Test deckt positive und negative Prompt-Faelle ab, damit der Sicherheitsweg stabil bleibt.
- Mini-Optimierung Hilfe/UX: Abbruch bei falscher Eingabe bleibt klar und laienfreundlich mit naechstem Schritt.
- Risiko: niedrig, da nur Restore-Validierung, Tests und Statusdoku erweitert wurden.

## 2026-03-01 – Backup-Dialog Ende-zu-Ende Test geschlossen

- Neuer Test deckt den kompletten Pfad ab: Backup-Hook-Log schreiben, Restore-Plan bauen und Wiederherstellung ausfuehren.
- Offener TODO-Punkt zum UI-Dialog+Hook-Ende-zu-Ende-Test ist damit abgeschlossen.
- Mini-Optimierung Hilfe/UX: Testname und Assertions geben klare naechste Schritte bei Fehlern.
- Risiko: niedrig, da nur Testdatei und Statusdoku aktualisiert wurden.

## 2026-03-01 – Restore-Flow mit Auto-Ziel + Sicherheitsabfrage

- Backup-Restore erkennt Ziel-Datei jetzt automatisch aus dem Backup-Namen (`store`/`registry`) und blockiert unpassende Kombinationen.
- Vor dem Schreiben gibt es eine klare Sicherheitsabfrage: Dateiname muss bestaetigt werden.
- Mini-Optimierung Hilfe/UX: Sicherheits-Hinweis nennt Aktion und Rueckweg in einfacher Sprache.

## 2026-03-01 – Todo-Filter mit Tastatur-Shortcuts releasefertig

- Aufgabenbereich hat jetzt einen klaren Filter (Kalendertag, Heute, Offen, Archiv) fuer schnelle Orientierung.
- Filter ist per Tastatur nutzbar: Enter bestaetigt, Escape setzt auf Kalendertag zurueck.
- Mini-Optimierung Hilfe/UX: neue Kurz-Hilfe direkt am Filter erklaert Aktion und Rueckweg in einfacher Sprache.

## 2026-03-01 – Iteration 44

- Todo-Listen-Modul mit Kalenderdatum, abhakbarer Liste und Archivbereich im Dashboard eingebaut.
- Backup-Dialog zeigt jetzt eine klare Ziel-Datei-Auswahl statt automatischer Dateiname-Ableitung.
- Mini-Optimierung Hilfe: Tooltips fuer Kalender/Ziel-Datei mit Rueckweg-Hinweis in einfacher Sprache ergaenzt.

## 2026-03-01 – Backup-Wiederherstellung jetzt direkt mit Projektordner

- Backup-Dialog stellt ausgewaehlte Backup-Dateien jetzt wirklich wieder her (Dateisystem-API mit Projektordner + JSON-Pruefung).
- Neues UI-Helfer-Skript `templates/backup_restore.js` trennt Restore-Logik sauber und prueft Input/Output robust.
- Release-Check prueft jetzt zusaetzlich, dass das Backup-Restore-Skript in der Dashboard-Seite eingebunden ist.
- Risiko: mittel, weil Datei-Schreiben im Browserpfad neu ist, aber mit Tests und Fehlerweg abgesichert.

## 2026-03-01 – Backup-Auswahl mit Hook-Log verbunden

- Backup-Dialog zeigt jetzt echte Backup-Dateien aus `data/backup_events.json` und bietet den Knopf "Backup wiederherstellen" mit klarem Rueckweg.
- Registry-Write nutzt jetzt den JSON-Store-Backup-Hook und schreibt Ereignisse nach `data/backup_events.json` fuer den UI-Dialog.
- Risiko: niedrig, weil nur Backup-Dialog, Hook-Log und betroffene Tests erweitert wurden.

## 2026-03-01 – Kontrastmessung je Theme automatisiert

- Release-Readiness berechnet jetzt den Kontrast pro Theme automatisch fuer Haupttext und Topbar (WCAG-AA Ziel: mindestens 4.5).
- Bei zu niedrigem Kontrast gibt der Check eine klare Fehlermeldung mit naechstem Schritt aus.
- Tests decken die neue Kontrastberechnung und alle 5 Themes mit 10 Pruefpunkten ab.
- Risiko: niedrig, da nur Readiness-Check und Tests erweitert wurden.

## 2026-03-01 – Sichtbarkeit fuer Sehschwaeche und 5 Themes

- Dashboard bietet jetzt 5 Themes (Hell, Dunkel, Kontrast+, Rötlich, Camouflage) fuer bessere Lesbarkeit je Situation.
- Release-Readiness prueft jetzt auch Rötlich und Camouflage automatisch.
- README, Hilfe und todo wurden fuer den neuen Sehschwaeche-Leitfaden aktualisiert.
- Risiko: niedrig, da nur Theme-Auswahl, Theme-CSS und Doku betroffen sind.

## 2026-03-01 – Backup-Dialog Inline-Check + Doku-Regel im Release-Check

- Dashboard zeigt im Backup-Dialog jetzt den 5-Punkte-Release-Check als direkte Inline-Hilfe fuer schnelle Freigabeentscheidung.
- Release-Readiness prueft jetzt automatisiert auch die Doku-Regel: README, CHANGELOG und todo muessen aktualisierbar und auffindbar sein.
- Risiko: niedrig, da UI-Dialog + statische Readiness-Pruefung erweitert wurden.

## 2026-03-01 – Release-Fertig pro Einzelpunkt klar definiert

- README um einen kurzen Laien-Check erweitert, wann ein einzelner offener Punkt schon release-fertig ist.
- Der Check nennt klar: Funktion, Fehlerpfad, gruene Tests, `bash start.sh` und Doku-Update.
- Risiko: niedrig, da nur Doku fuer Entscheidungslogik praezisiert wurde.

## 2026-03-01 (Iteration 36)

- Strategie fuer die weitere Entwicklung geschaerft: Mini-Patches, feste
  Patch-Reihenfolge und harte Priorisierung auf Plugin-Loader + Storage-Service.
- Alle zentralen Info-Dateien auf denselben Stand gebracht
  (Fortschritt, Risiken, naechste Schritte).
- UX/Hilfe-Mini-Optimierung: klare Laienformulierung der naechsten Kernziele in
  README und PROJECT_INFO.

- 2026-03-01: Start-Routine synchronisiert jetzt den README-Fortschritt automatisch aus `todo.txt` (Prozent, erledigt, offen) fuer konsistente Statusanzeige.

## 2026-03-01 – Hilfe-Panel mit 3-Schritt-Mini-Leitfaden

- Hilfe-Panel zeigt jetzt den 3-Schritt-Leitfaden direkt im UI (starten, Ergebnis lesen, naechster Schritt).
- Help-Panel-Modell validiert den Leitfaden strikt auf genau 3 gueltige Schritte.
- Neuer Test prueft den Leitfaden-Inhalt automatisch.
- Risiko: niedrig, da nur Help-Panel + ein gezielter Test erweitert wurden.

## 2026-03-01 – Start-Check klarer: 3-Schritt-Leitfaden + TODO-Scan-Fix

- README.txt erweitert: neuer Mini-Leitfaden mit genau 3 Schritten fuer den Pflicht-Abschluss-Check (`bash start.sh`, Ergebnis lesen, Hilfe-Befehle nutzen).
- Platzhalter-Scan korrigiert: Marker gelten jetzt nur noch als echte Aufgaben mit Doppelpunkt (`TODO:`), dadurch kein Fehlalarm bei IDs wie `todo-title`.
- Start-Routine und Test erweitert, damit der Fehlalarm reproduzierbar verhindert bleibt.
- Risiko: niedrig, da nur Prueflogik + Doku angepasst wurden.

## 2026-03-01 – Iterations-Pipeline um Pflichtschritt erweitert

- AGENTS.md erweitert: Die Iterations-Pipeline hat jetzt einen zusaetzlichen Schritt "Autonomer Abschluss-Check" nach der Doku.
- Der neue Schritt fordert einen erfolgreichen Lauf von `bash start.sh` mit klarer Laien-Rueckmeldung bei Fehlern.
- Risiko: niedrig, da nur Prozessregel und Reihenfolge in der Projektdokumentation angepasst wurden.

## 2026-03-01 – AGENTS-Regel fuer Referenzbild + Platzhalter-Scan

- AGENTS.md erweitert: Jede 5. Iteration muss das Vorgabe-Bild im Projektordner analysieren und UI/Layout gezielt am Beispielbild ausrichten.
- AGENTS.md erweitert: Platzhalter und unvollstaendige Codeteile muessen pro Iteration erkannt, kommentiert und als TODO-Punkte registriert werden.
- TODO um einen konkreten 8-Punkte-Plan fuer Referenzbild-Abgleich und Platzhalter-Disziplin ergaenzt.
- Risiko: niedrig, da nur Prozess- und Planungsregeln aktualisiert wurden.

## 2026-03-01 – Doku-Pflicht pro Iteration erweitert

- AGENTS.md erweitert: README.txt muss pro Iteration kurz mit aktualisiert werden (Status, Fortschritt, naechster Schritt).
- README um klare Pflichtliste fuer Iterations-Doku erweitert (CHANGELOG, SELFINFO, README, TODO).
- Risiko: niedrig, da nur Dokumentationsregeln ergaenzt wurden.

# CHANGELOG

## 2026-03-02 – Songtext-Editor auf Lyrics-Bereich + getrennte Quick-Store-Dateien

- Songtext-Editor ist direkt im Bereich Songideen aktiv und bietet Intro/Refrain-Vorlagen sowie Enter/Escape-Hilfe mit klaren Rueckweg-Knoepfen.
- Schnellspeicher speichert jetzt physisch getrennt in `quick_store_inbox.json`, `quick_store_lyrics.json` und `quick_store_research.json`.
- Risiko: niedrig, da Quick-Store-Migration aus der alten Sammeldatei erhalten bleibt und gezielte Tests die Hilfslogik pruefen.

## 2026-03-01 – Mini-Hilfe fuer Referenzbild-Rhythmus im Help-Panel

- Hilfe-Panel-Mini-Leitfaden ergaenzt: Schritt 4 erinnert jetzt klar an den Pflichtabgleich alle 5 Iterationen mit dem Referenzbild.
- Validierung im Help-Panel-Modell auf 4 Leitfaden-Schritte angepasst, damit Input/Output-Pruefung bestehen bleibt.
- Risiko: niedrig, da nur Hilfetext, Modell-Validierung und Test angepasst wurden.

## 2026-03-01 – Boot-View-Statusbereich stabilisiert

- Dashboard zeigt jetzt einen klaren Boot-Statusbereich mit 4 Phasen und Ampel-Texten (Gruen/Gelb/Rot) fuer Laien.
- Neue Boot-Status-Logik ist als eigenes Modul ausgelagert (`templates/boot_status.js`) mit Input-/Output-Pruefung.
- Start- und Release-Checks wurden erweitert (Dateipflicht + Boot-Status im Release-Readiness-Check).
- Risiko: niedrig, da nur Dashboard-Statuspfad, Checks und Doku erweitert wurden.

## 2026-03-01 – Platzhalter-Scan praeziser + Help-Panel Tastaturhinweis

- Start-Routine-Scan durchsucht jetzt auch Unterordner und zaehlt Marker nur in echten Kommentar-/Aufgabenzeilen, damit normale Code-Strings keine Fehlalarme ausloesen.
- Help-Panel-Mini-Leitfaden nennt jetzt klar den Tastaturweg fuer den Theme-Wechsel (Tab + Enter) als einfachen naechsten Schritt.
- Risiko: niedrig, da nur Start-Scan, Hilfetexte und zugehoerige Tests angepasst wurden.

## 2026-03-01 – Start-Routine mit Abhaengigkeits-Sync verstaerkt

- Start-Routine erkennt jetzt automatisch veraltete Abhaengigkeiten ueber einen Fingerprint und installiert bei Bedarf neu.
- Der Abhaengigkeits-Status wird in `data/dependency_state.json` gespeichert, damit ein reiner `node_modules`-Check keine alten Pakete durchlaesst.
- Hilfe-Text um klaren Laien-Hinweis fuer Paketfehler und naechste Schritte erweitert.
- Risiko: niedrig, da nur Start-Routine, zugehoerige Tests und kurze Hilfe-Doku angepasst wurden.

## 2026-03-01 – README-Fortschritt und Dashboard-Layout optimiert

- README zeigt jetzt oben den Entwicklungsfortschritt in Prozent sowie die Menge offener und erledigter Punkte.
- Dashboard-Layout optimiert: einheitliche Abstandstokens, Skip-Link fuer Tastatur, engere 3-Spalten-Balance und mobile Vollbreite fuer Buttons.
- Risiko: niedrig, da nur Doku und UI-Template/CSS erweitert wurden.

## 2026-03-01 – Enter/Escape-Hilfe und Check erweitert

- Gefuehrte Dashboard-Hilfe erklaert jetzt klar: Enter startet Aktionen, Escape ist der Rueckweg.
- Release-Readiness prueft jetzt automatisch auch den Enter-Hinweis im Dashboard.
- Risiko: niedrig, da nur Hilfetext + automatischer Tastatur-Check erweitert wurden.

## 2026-03-01 – Keyboard-A11y-Check in Release-Readiness

- Dashboard unterstuetzt jetzt Escape als klaren Rueckweg: offene Debug-Ansicht wird per Taste geschlossen.
- Release-Readiness prueft automatisch Tastatur-Hinweis und Escape-Handler im Dashboard-Script.
- Risiko: niedrig, da nur Tastaturpfad + automatischer Check erweitert wurden.

## 2026-03-01 – Start-Routine robuster und effizienter

- Start-Routine erstellt jetzt fehlende Datenordner automatisch (`data/`, `data/logs/`) und validiert den Erfolg direkt.
- Nach dem Formatieren folgt jetzt eine automatische Format-Pruefung (`npm run format:check`) fuer klaren Qualitaetsnachweis.
- Befehls-Ergebnisse werden strenger validiert, damit Fehler frueh und laienfreundlich erkannt werden.
- Risiko: niedrig, da nur Startablauf, Script-Konfiguration und Tests erweitert wurden.

## 2026-03-01 – README Tool-Module-Liste und Modul-Backlog erweitert

- README um eine aktuelle, klar strukturierte Liste der vorhandenen Tool-Module ergänzt.
- README um eine konkrete Backlog-Liste geplanter Module erweitert (Archiv, Wiki, Schnellspeicher, Songtext, Zufall, Planung, Templates, Logging, Einstellungen).
- TODO um umsetzbare P1-Implementierungspunkte für alle angeforderten Untermodule erweitert.
- Risiko: niedrig, da nur Dokumentation und Planungsdatei aktualisiert wurden.

## 2026-03-01 – Release-Readiness-Check in Start-Routine

- Neue Prüfung `tools/release_readiness_check.js` ergänzt: prüft A11y-Basis (aria-live, Hilfe-Aktionen) und alle 3 Themes (Hell/Dunkel/Kontrast+).
- Start-Routine um festen Schritt „Release-Readiness prüfen" erweitert und bei Fehler mit klarer Reparaturmeldung abgebrochen.
- Tests für den neuen Check ergänzt (`test/release_readiness_check.test.js`).
- Risiko: niedrig, da nur Start-Prüffluss und Tests erweitert wurden.

## 2026-03-01 – Modulare Hilfe und moderne Dashboard-Gruppierung

- Dashboard-Topbar erweitert: schnelle Laienaktionen fuer naechsten Schritt und direkten Bedien-Tipp.
- Neue gefuehrte Hilfe als eigener Panel-Baustein mit klarer Schrittliste in einfacher Sprache.
- Hilfebereich vereinheitlicht: feste Aktionen "Erneut versuchen", "Reparatur starten", "Protokoll oeffnen".
- Risiko: niedrig, da nur Dashboard-Template, Styles, UI-Texte und Doku angepasst wurden.

## 2026-03-01 – Kompaktes Dashboard ohne Platzhalter

- Dashboard-Layout auf kompakte Abstände, bessere Schrift/Button-Verhältnisse und klare Rasterstruktur optimiert.
- Pseudo-Inhalte (Beispiel-Listen/Kalenderdaten) entfernt; ungenutzte Bereiche bleiben jetzt bewusst leer.
- UI-Texte für das kompakte Dashboard nach `config/messages_de.json` ausgelagert und zur Laufzeit geladen.
- Risiko: niedrig, da Änderungen auf Dashboard-Template, Styles und Textquellen begrenzt sind.

## 2026-03-01 – Dashboard-Layout optisch an Referenz angepasst

- Dashboard-Template auf ein klares 3-Spalten-Layout mit Topbar, Kalender, Workspace und Quick-Links umgestellt.
- A11y verbessert: sichtbarer Fokus, große Bedienelemente, klare Tastaturhinweise und Kontrast+ Theme konsistent eingebaut.
- Risiko: niedrig, da nur Template-Layout und begleitende UI-Texte aktualisiert wurden.

## 2026-02-28

- Registry-Service mit Manifest-Validierung und robustem Versionieren ergänzt.
- Start-Routine um Manifest- und Registry-Health-Check erweitert.
- README/TODO auf Kernel-Policy, Registry-Flow und klare Befehle aktualisiert.
- Neues Dashboard mit Ordnerwahl, Auto-Reconnect und verschiebbaren Zonen ergänzt.
- Start-Routine und Tests auf neue Dashboard-Pflichtdateien erweitert.
- Entwickler-Infodatei `docs/ENTWICKLERDOKU.md` mit kompletter Ordner-/Dateistruktur und Befehlen ergänzt.

- README strukturell überarbeitet (Wartbarkeit/Robustheit/A11y/Laienhinweise klar gegliedert).

- Debug-Modus fuer Start-Routine mit Log-Datei ergaenzt.
- Fehlerausgabe zeigt jetzt immer naechsten Schritt inkl. Protokoll-Pfad.
- Plugin-Loader minimal ergänzt: Manifest lesen, Plugin isoliert laden, Fehler klar melden.
- Start-Routine um Plugin-Loader-Health-Check erweitert (fester Schritt vor Systemtest).
- Neue Tests und Dummy-Manifest fuer Plugin-Loader-Fehlerfall ergänzt.

## 2026-03-01 – Registry-Debug im Startablauf

- Registry-Health-Check liefert jetzt im Debug-Modus klare Detailursachen statt nur Sammelfehler.
- Start-Routine zeigt diese Details nur bei `START_DEBUG=1` an, sonst bleibt die Laienmeldung kurz.
- Risiko: niedrig, da nur Fehlerpfad und Tests erweitert wurden.

## 2026-03-01 – Storage-Schema und Backup-Hook

- JSON-Store prueft jetzt optional Pflichtfelder und Datentypen vor jedem Write.
- JSON-Store bietet neuen Backup-Hook (`onBackupCreated`) fuer automatische Folgeaktionen.
- Risiko: niedrig, da nur Write-Validierung und Tests im Storage-Bereich erweitert wurden.

## 2026-03-01 – Dashboard-Haupt-Kern-Modul und Autostart

- Neues Kernmodul `system-core/dashboard_core.js` startet das Dashboard am Ende der Start-Routine automatisch.
- Start-Routine hat jetzt 9 klare Schritte inklusive Dashboard-Autostart mit Headless-Fallback.
- Risiko: niedrig, weil nur Startfluss + neue Tests ergänzt wurden.

## 2026-03-01 – Dashboard-Mockup zur aktuellen Logik

- Neues Mockup `templates/dashboard_mockup.html` ergänzt: zeigt Start-Routine (9 Schritte), Theme-Auswahl und Dashboard-Zonen in einfacher Sprache.
- Mockup nutzt klare A11y-Bausteine (Fokus sichtbar, `aria-live`, große Buttons) und feste naechste Schritte bei Fehlern.
- Risiko: niedrig, da nur neue Mockup-Datei plus Doku-Update.

## 2026-03-01 – README klarer für Laien

- README neu gegliedert: offene Punkte oben, klare Kapitel und bessere Sichtbarkeit.
- Laienanleitung mit vollständigen Befehlen ergänzt (Start, Test, Format, Logs, Backup, Reparatur).
- Risiko: niedrig, da nur Dokumentation angepasst wurde.

## 2026-03-01 – Zentrierte modulare Hauptflaeche

- Dashboard-Hauptbereich startet jetzt leer und zeigt aktivierte Module als gleichgroße, flexible Raster-Karten in Auswahl-Reihenfolge.
- Jedes Modul-Panel bietet klare Infos plus Knöpfe für Maximieren, Minimieren und Ausblenden.
- Risiko: niedrig, da Änderung auf Dashboard-Template und Styles begrenzt ist.

## 2026-03-01 – AGENTS-Regel für iterative Hilfe-/UX-Optimierung

- AGENTS.md um neuen Pflichtpunkt erweitert: pro Iteration mindestens eine kleine Verbesserung an Hilfe, Tooltip, A11y oder Kontrast.
- Einheitliche Standards für Abstände, Buttons, Themes, Kontrast und responsive Verhalten ergänzt.
- Risiko: niedrig, da nur Prozess- und Qualitätsregeln dokumentiert wurden.

## 2026-03-01 – Genres/Moods/Stile-Archiv-Kern

- Neues Kernmodul `system-core/genre_mood_style_archive.js` ergänzt: CSV-Import, Duplikatpruefung, Profil-Kategorien und Favoriten via Sternchen.
- Import/Export und JSON-Logzeilen fuer Archivvorgaenge ergänzt, inklusive klarer Fehlertexte mit naechstem Schritt.
- Risiko: niedrig, da nur neues Modul, neue Tests und kurze Hilfe-Ergaenzung betroffen sind.
- 2026-03-01: Theme-Umschalter erhielt einen klaren Tooltip mit Rueckweg-Hinweis und Screenreader-Verknuepfung (aria-describedby) fuer bessere Laienfuehrung und A11y.

## 2026-03-01 – Release-Check robuster + Mockup-Hinweis

- Release-Readiness prueft jetzt zusaetzlich zentrale Hilfe-Texte (`what/data/undo`) sowie Fokus/Klickziel-Basics automatisch.
- Mockup-Theme-Auswahl erhielt einen klaren Tipp mit Rueckweg und `aria-describedby` fuer Screenreader.
- Risiko: niedrig, da nur Prueflogik, Test und Mockup-Hilfe erweitert wurden.

## 2026-03-01 – Start-Routine mit Platzhalter-Scan

- Start-Routine prueft jetzt automatisch auf offene Marker (`TODO`, `FIXME`, `PLACEHOLDER`, `DUMMY`) in Kernordnern.
- Bei Fund stoppt der Ablauf mit klarer Meldung inkl. Datei/Zeile und naechstem Schritt (Protokoll oder Reparatur).
- Risiko: niedrig, da nur Start-Pruefpfad und ein gezielter Unit-Test erweitert wurden.

## 2026-03-01 – AGENTS: Releasefertige Patch-Regel + Dateistatus

- AGENTS.md um klare Releasefertig-Definition erweitert: nur fertige Patches mit Fehlerpfad, Test, Doku und gruenem `bash start.sh`.
- Neue Regel fuer Fortschrittsstatus: Dateistand ueber Dateinamen (z. B. `_v002`, `_ready`) oder zentrales `data/file_status_index.json` sichtbar halten.
- Risiko: niedrig, da nur Prozessregeln dokumentiert wurden.

## 2026-03-01 – Plugin-Loader Hardening (ID + Pfadschutz)

- Plugin-Manifest validiert jetzt doppelte Plugin-IDs und stoppt frueh mit klarer Laienmeldung.
- Plugin-Pfade werden auf Projektgrenzen geprueft, damit keine externen Pfade geladen werden.
- Risiko: niedrig, da nur Plugin-Validierung, ein Dummy-Manifest und Tests erweitert wurden.

## 2026-03-01 – Todo-Persistenz in data/store.json

- Todo-Modul speichert aktive und archivierte Aufgaben jetzt optional in `data/store.json`, sobald ein Projektordner verbunden ist.
- Beim Start werden gespeicherte Aufgaben wieder geladen; bei Speicherfehlern gibt es klare Meldungen mit naechstem Schritt.
- Risiko: niedrig, da nur Todo-Modul, Modell und zugehoeriger Test erweitert wurden.

## 2026-03-01 – Kanban-Verschiebung jetzt dauerhaft in JSON gespeichert

- Kartenverschiebung speichert den neuen Zustand jetzt direkt in `data/kanban_board.json`, damit nach Neustart dieselbe Reihenfolge sichtbar bleibt.
- Vor dem Speichern wird das Kanban-Schema geprueft (Version, Spalten, Karten), damit keine kaputten Daten geschrieben werden.
- Mini-Optimierung Hilfe/UX: Erfolgsstatus nennt jetzt klar "verschoben und gespeichert" als naechsten sicheren Zustand.
- Risiko: mittel, weil der Browserpfad jetzt Datei-Write nutzt, aber mit Validierung und Tests abgesichert.

## 2026-03-02 – Songtext-Editor erweitert

- Zwei offene Mini-Punkte abgeschlossen: Songtext-Editor hat jetzt Bridge- und Sonstiges-Vorlagen plus Lesemodus-Vorschau.
- Warum: Songideen lassen sich schneller strukturieren und direkt lesbar pruefen, ohne den Bereich zu wechseln.
- Risiko: niedrig, da nur Quick-Store-UI und zugehoerige Tests erweitert wurden.

## 2026-03-03 – UI-Token-Set als globale Wahrheit + offene UI-Punkte geschlossen

- Neues globales Token-Set (`config/ui_design_tokens.json`) definiert jetzt zentral Spacing, Radius, Font, Shadow und Button-Hoehen fuer alle Module und Plugins.
- Dashboard-CSS nutzt die neuen Tokens sichtbar (Button-Hoehen, Schriftfamilie, Neon-Rails, Statusbanner), damit Themes konsistent bleiben.
- Zwei offene TODO-Punkte geschlossen: UI-Fix aus Layout-Manifest (Rails/Banner) und Boot-View mit klaren 4 Phasen + Ampeltexten.

## 2026-03-03 – Songtext-Lesemodus: Kopieren + Kurzguide

- Zwei offene Mini-Punkte abgeschlossen: Lesemodus hat jetzt einen Kopieren-Knopf mit klarer Statusmeldung; Songtext-Hilfe ist als einklappbarer Kurzguide mit Tastaturfokus umgesetzt.
- Mini-Optimierung Hilfe/UX: Kurzguide arbeitet mit einfachem Ein-/Ausblenden, Fokusziel und Rueckweg in einfacher Sprache.
- Risiko: niedrig, da nur Songtext-Panel, Modul-Logik und gezielte Tests erweitert wurden.

## 2026-03-03 – Songtext-Zufallsinhalt + Fokus-Ruecksprung

- Drei offene Punkte abgeschlossen: 1-Klick-Zufallsinhalt im Songtext-Editor, Interoperabilitaet zum Zufallsgenerator (Inhalt direkt einfuegen) und klarer Fokus-Ruecksprung auf das Titel-Feld nach Lesemodus.
- Mini-Optimierung Hilfe/UX: Lesemodus-Hilfe nennt den Ruecksprung explizit in einfacher Sprache.
- Risiko: niedrig, da nur Songtext-UI, Modul-Logik und gezielte Tests erweitert wurden.

## 2026-03-01 – Layout robust + Fokusziel + Support-Filter

- Drei offene Mini-Punkte abgeschlossen: Boot-Fokusziel-Einstellung, filterbarer Support-Verlauf und optionaler Versions-Detailmodus.
- Dashboard-Mitte bleibt als stabiles 3x3-Quadrat, Seitenleisten bleiben getrennt als kleine Aktionsflaechen.

## 2026-03-03 – Sidebar-Links und Notiz-Autostart

- Dashboard startet jetzt mit genau einem Modul (`Notizen`) in der Mitte.
- Linke Bereiche wurden als Button-Links in der Sidebar angeordnet; linke/rechte Zeitbar bleiben ein- und aufklappbar.
- 3x3-Modulraster bleibt als mittige Hauptflaeche und ist visuell klar umrahmt.

## 2026-03-01 – Boot-Live-Ansage und Support-Trefferzahl

- Zwei offene Mini-Punkte abgeschlossen: Boot-Fokusziel wird per `aria-live` als Klartext gemeldet; Support-Suche zeigt Trefferzahl und Enter-Shortcut.
- Mini-Optimierung Hilfe/UX: Suchmetatext erklaert den direkten naechsten Schritt fuer Tastaturnutzer.
