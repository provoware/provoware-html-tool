# PROJEKTBESCHREIBUNG

## Ziel
Dieses Tool bietet ein barrierefreies Dashboard mit klaren Schritten fuer Laien.

## Kernumfang
- Dashboard mit Theme-Auswahl und Hilfe-Aktionen.
- Start-Routine mit Auto-Checks, Auto-Formatierung und Auto-Tests.
- Release-Readiness-Check fuer A11y, Themes, Hilfe-Aktionen und Doku-Pflicht.

## Tools und Nutzen
- `bash start.sh`: Vollautomatischer Projektcheck mit Nutzerfeedback.
- `tools/release_readiness_check.js`: Prueft Freigabe-Basics vor Release.
- `tools/help_cli.js`: Zeigt Reparaturwege in einfacher Sprache.

## Iteration 39 Update
- Backup-Dialog zeigt den 5-Punkte-Release-Check direkt als Inline-Hilfe.
- Doku-Regel wird jetzt automatisch im Release-Readiness-Check geprueft.
- Naechster Ausbau: Backup-Hook Ende-zu-Ende mit Dialog verbinden.
