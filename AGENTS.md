# AGENTS.md

## Arbeitsstandard
- Arbeite immer planungsbasiert: Zielstelle, Patchgrund, kleinsten Umfang und Seiteneffekte vor dem Patch kurz festhalten.
- Arbeite traffic-sparsam: lies nur nötige Dateien und prüfe nur direkt betroffene Bereiche.
- Arbeite codesparsam: keine broad rewrites, keine großflächigen Stiländerungen, keine kosmetischen Umbauten.
- Jede Iteration besteht aus genau zwei Anpassungsschritten zur Annäherung an `LAYOUT_UND_DESIGNVORGABEMUSTER.md`.
- Ergänze pro Iteration genau eine weiterführende Aufgabe in `todo.txt`.
- Validierung erst nach allen Patches der Iteration und nur gezielt für direkt betroffene Logik oder Ausgabe.

## Eingangsprüfung vor jeder Änderung
1. Zielstelle bestimmen.
2. Betroffene Dateien und Blöcke benennen.
3. Patchgrund benennen.
4. Kleinsten sinnvollen Änderungsumfang wählen.
5. Seiteneffekte und Risiken abschätzen.
6. Bewusste Nicht-Änderungen festhalten.
7. Danach eine kurze Schrittliste für genau zwei Anpassungsschritte erstellen.

## Minimal Traffic
- Nur nötige Dateien lesen.
- Kein Vollrepo-Scannen ohne zwingenden Grund.
- Keine unnötigen Datei- oder Netzoperationen.
- Nur betroffene Stellen erneut prüfen.

## Codesparsames Patchen
- Immer präzise an Ort und Stelle patchen.
- Nur begründet betroffene Dateien ändern.
- Keine broad rewrites.
- Keine Kosmetik-Umbauten.
- Keine massenhaften Stiländerungen.

## Begrenzung auf betroffene Dateien
- Nur angrenzende Dateien ändern, wenn fachlich nötig.
- Keine Doku-Rundumschläge.
- Keine unnötigen Renames.
- Keine grundlosen Umstrukturierungen außerhalb des Ziels.

## Validierung und Tests
- Tests nur ausführen, wenn sie für den konkreten Patch sinnvoll sind.
- Keine reflexartigen Volltests.
- Keine endlosen Prüfschleifen.
- Bei Struktur-, Doku- und Platzhalterarbeiten reichen gezielte Syntax-, Format- oder Konsistenzprüfungen.
- Validierung immer gesammelt erst nach dem zweiten Anpassungsschritt.

## Nutzerfreundlichkeit zuerst
- UI-Texte in einfacher Sprache.
- Keine versteckte Logik für Hauptaktionen.
- Keine Entwicklerbegriffe im Haupt-UI.
- Leere Zustände beruhigend und klar formulieren.

## Fehlerbehandlung
- Für jede Änderung klaren Fehlerpfad mitdenken.
- Fehlermeldungen in einfacher Sprache formulieren.
- Sicheren Fallback ohne Datenverlust bevorzugen.

## Iterationsabschluss
- Kurzes Änderungsprotokoll festhalten.
- Endvalidierung mit nur direkt relevanten Prüfungen dokumentieren.
- Genau zwei konstruktive, unterstützende Empfehlungen geben.

## Verboten
1. Endlosprüfungen.
2. Sinnlose Wiederholungsanalysen.
3. Broad rewrites.
4. Unnötige Änderungen an Nachbardateien.
5. Testen nur aus Gewohnheit.
6. Traffic-Verschwendung.
7. Unpräzise Rundumschläge.
