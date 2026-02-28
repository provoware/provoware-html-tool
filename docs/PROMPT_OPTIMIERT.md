# Optimierter Prompt für die nächste Iteration

## Kurzanalyse des Original-Prompts

- Der Wunsch ist klar: modernes Dashboard, einfache Sprache, hohe Barrierefreiheit und automatische Start-Routine.
- Der Scope war zu breit. Ohne klare Grenzen droht ein zu großer Patch.
- Es fehlte eine feste Reihenfolge für Umsetzung und Tests.

## Verbesserter Prompt (ausführbar, klein, vollständig)

```text
## Codex Task
**Ziel:** Ein laienfreundliches, barrierearmes Dashboard mit Projektordner-Start, Auto-Reconnect und verschiebbaren Zonen liefern.

**Kontext:**
- Projektstruktur strikt einhalten (`system-core/`, `system-module/`, `config/`, `data/`, `tools/`, `templates/`, `test/`).
- Einfache Sprache in UI-Texten.
- Fachwörter kurz erklären, z. B. Validierung (Eingabeprüfung).
- Jede neue Funktion validiert Input und Output.
- Fehlermeldungen enthalten immer nächste Schritte: „Erneut versuchen“, „Reparatur starten“, „Protokoll öffnen“.

**Scope IN:**
1) Neues Dashboard-Template mit einheitlichen UI-Parametern (Abstände, Buttons, Felder).
2) Start-Flow im Browser:
   - Projektordner wählen
   - Berechtigung anfragen
   - Handle in IndexedDB speichern
   - Auto-Reconnect beim Neustart (Permission erneut anfragen)
   - Projektstruktur prüfen/erstellen
3) Dashboard-Zonen:
   - ⭐ Favoriten
   - ⚡ Schnellzugriff (manuell gepinnt + meist genutzt)
   - 📦 Module
   - Zonen vertikal per Drag&Drop und per Tastatur-Alternative (Buttons) verschiebbar
4) Mehrere Themes mit hohem Kontrast.
5) Debug/Logging-Hinweise in einfacher Sprache.
6) Tests für zentrale Logik + Start-Routine anpassen.
7) Doku/TODO/Statusdateien minimal aktualisieren.

**Scope OUT:**
- Kein großer Refactor an Kernel/Registry.
- Kein Umbau bestehender Self-Repair-Logik.
- Keine externen Frameworks einführen.

**PatchSpec (Datei + Anker):**
- `templates/dashboard.html` (neu)
- `templates/dashboard.js` (neu)
- `system-module/dashboard_model.js` (neu)
- `test/dashboard_model.test.js` (neu)
- `tools/start_routine.js` (Pflichtpfade ergänzen)
- `test/start_routine.test.js` (Pfadtest ergänzen)
- `config/messages_de.json` (Dashboard-Texte ergänzen)
- `docs/HILFE.md`, `CHANGELOG.md`, `SELFINFO.md`, `todo.txt`, `MEMORY_FIXES.md` (minimal)

**Akzeptanz (Fertig wenn):**
- [ ] Dashboard zeigt drei Zonen mit verständlichen Überschriften.
- [ ] Projektordner kann gewählt und wiederverbunden werden.
- [ ] Strukturprüfung/-erstellung meldet Ergebnis für Laien.
- [ ] Zonen sind per Drag&Drop UND per Buttons verschiebbar.
- [ ] Theme-Wechsel (Hell/Dunkel/Kontrast+) funktioniert.
- [ ] Jede relevante neue Funktion hat Input/Output-Validierung.
- [ ] Tests laufen durch (`npm test`).
- [ ] Start-Routine läuft durch (`bash start.sh`).

**Checks (nur betroffen):**
- `npm run format`
- `npm test`
- `bash start.sh`

**Doku-Updates (minimal):**
- `CHANGELOG.md`: 1–3 Zeilen
- `SELFINFO.md`: Iteration + Next Step
- `docs/HILFE.md`: kurzer Laienabschnitt zum Dashboard
- `todo.txt`: erledigte Punkte und nächste Schritte

**Ausgabeformat:**
1) Unified Diff Patch
2) Kurze Summary
3) Next Step + Empfehlung
```
