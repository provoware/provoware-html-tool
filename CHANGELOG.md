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
