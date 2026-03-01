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
