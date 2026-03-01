# CHANGELOG

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

