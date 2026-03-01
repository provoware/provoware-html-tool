# CHANGELOG

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
