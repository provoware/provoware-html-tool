# AGENTS.md

## Arbeitsstandard
- Arbeite immer planungsbasiert: Zielstelle, Patchgrund, kleinsten Umfang und Seiteneffekte vor dem Patch kurz festhalten.
- Arbeite traffic-sparsam: lies nur nötige Dateien und prüfe nur direkt betroffene Bereiche.
- Arbeite codesparsam: keine broad rewrites, keine großflächigen Stiländerungen, keine kosmetischen Umbauten.
- Jede Iteration besteht aus genau zwei Anpassungsschritten zur Annäherung an `LAYOUT_UND_DESIGNVORGABEMUSTER.md`.
- Ergänze pro Iteration genau eine weiterführende Aufgabe in `todo.txt`.
- Validierung erst nach allen Patches der Iteration und nur gezielt für direkt betroffene Logik.

## Minimal Traffic
- Nur nötige Dateien lesen.
- Kein Vollrepo-Scannen ohne zwingenden Grund.
- Keine unnötigen Datei- oder Netzoperationen.
- Nur betroffene Stellen erneut prüfen.

## Codesparsames Patchen
- Immer präzise an Ort und Stelle patchen.
- Keine broad rewrites.
- Keine Kosmetik-Umbauten.
- Keine massenhaften Stiländerungen.

## Eingangsprüfung vor jeder Änderung
1. Zielstelle bestimmen.
2. Patchgrund benennen.
3. Kleinsten sinnvollen Änderungsumfang wählen.
4. Seiteneffekte abschätzen.

## Begrenzung auf betroffene Dateien
- Nur angrenzende Dateien ändern, wenn fachlich nötig.
- Keine Doku-Rundumschläge.
- Keine unnötigen Renames.
- Keine grundlosen Umstrukturierungen außerhalb des Ziels.

## Testregeln
- Tests nur ausführen, wenn sie für den konkreten Patch sinnvoll sind.
- Keine reflexartigen Volltests.
- Keine endlosen Prüfschleifen.
- Bei Struktur- und Platzhalterarbeiten reichen gezielte Syntax- und Importprüfungen.

## Nutzerfreundlichkeit zuerst
- UI-Texte in einfacher Sprache.
- Keine versteckte Logik für Hauptaktionen.
- Keine Entwicklerbegriffe im Haupt-UI.
- Leere Zustände beruhigend und klar formulieren.

## Fehlerbehandlung
- Für jede Änderung klaren Fehlerpfad mitdenken.
- Fehlermeldungen in einfacher Sprache formulieren.
- Sicheren Fallback ohne Datenverlust bevorzugen.

## Verboten
1. Endlosprüfungen.
2. Sinnlose Wiederholungsanalysen.
3. Broad rewrites.
4. Unnötige Änderungen an Nachbardateien.
5. Testen nur aus Gewohnheit.
6. Traffic-Verschwendung.
7. Unpräzise Rundumschläge.
