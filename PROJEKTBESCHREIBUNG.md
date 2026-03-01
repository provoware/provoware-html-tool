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


## Iteration 40 Update
- Neue Themes fuer Sehschwaeche: Rötlich und Camouflage als zusaetzliche Wahl.
- Release-Check deckt jetzt 5 Themes vollstaendig ab.
- Laienhilfe erweitert: kurzer Leitfaden fuer Theme-Wahl und naechste Schritte bei Unsicherheit.

## Iteration 41 Update
- Release-Readiness misst jetzt Kontrast je Theme automatisch fuer Haupttext und Topbar.
- Der Check nutzt den WCAG-AA Zielwert 4.5 und meldet bei Abweichung klare naechste Schritte.
- Naechster Ausbau: Backup-Auswahl-Dialog mit JSON-Store-Backup-Hook verbinden und E2E pruefen.

## Iteration 42 – Backup-Workflow erweitert
- Neues Kernmodul `system-core/backup_hook_log.js` sammelt Backup-Ereignisse zentral.
- `writeRegistryWithVersion` uebergibt jetzt einen Backup-Hook und schreibt Ereignisse in `data/backup_events.json`.
- Dashboard-Dialog zeigt diese Ereignisse als Auswahl und bietet einen klaren Knopf `Backup wiederherstellen`.
- Vorteil fuer Laien: klare Auswahl, klare Aktion, klarer Rueckweg (Zurueck oder Escape).


## Iteration 43 Update
- Backup-Wiederherstellung arbeitet jetzt direkt mit Projektordner-Handle und schreibt die Ziel-JSON wirklich zurueck.
- Neue Restore-Logik ist in `templates/backup_restore.js` gekapselt (klare Input-/Output-Pruefung).
- Fehlerweg bleibt laienfreundlich mit klaren naechsten Schritten und Debug-Hinweis.


## Iteration 44 – To-Do-Listen-Modul
- Neues Frontend-Modul mit Kalenderdatum, Eingabefeld, Abhak-Button und Archivliste.
- Ziel-Datei fuer Backup-Restore ist jetzt direkt im Dialog auswaehlbar (mehr Kontrolle, weniger Risiko).
- A11y-Details: klare Labels, 44px Buttons, Tastaturbedienung ueber Standard-Controls.
