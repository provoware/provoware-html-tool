# AGENTS.md

## Ziel dieses Dokuments
Diese Regeln helfen bei kleinen, klaren und sicheren Iterationen.
Fokus: **laienfreundlich, übersichtlich, flexibel darstellbar**.

## Arbeitsprinzip
- Immer planungsbasiert, patchbasiert, codesparsam, traffic-sparsam arbeiten.
- Leitlinie: **Planung ist Gold, Handlung ist Silber**.
- Immer den **kleinsten sinnvollen Eingriff** wählen.

## Pflicht vor dem ersten Patch
Vor jeder Änderung kurz notieren:
1. Ziel der Iteration
2. Betroffene Dateien
3. Betroffene Zeilen/Blöcke
4. Patchgrund
5. Risiken
6. Bewusste Nicht-Änderungen
7. Konkrete Schrittliste

Ohne diese Vorarbeit kein Patch.

## Patch-Regeln (streng)
- Nur begründet betroffene Dateien ändern.
- Nur exakt betroffene Stellen ändern.
- Keine kosmetischen Nebenänderungen.
- Keine globalen Umformatierungen.
- Keine unnötigen Dateioperationen.
- Kein Volltest ohne Anlass.
- Keine Wiederholungsprüfung ohne neue Änderung.
- Neue Nebenprobleme nicht ungeplant mitbearbeiten.
- Bei Nebenproblemen: sauber in `todo.txt` parken (Begründung, Prüfschritt, Fertig-Kriterium).

## Iterationsrahmen
- Maximal 3 saubere Patches pro Iteration.
- Pro Iteration genau eine Minimaloptimierung in einem Bereich:
  - Hilfe
  - Hilfeelemente
  - Nutzerfreundlichkeit/Laientauglichkeit
  - Robustheit
- Pro Iteration eine kleine sinnvolle Erweiterung in `TOOL_TUTORIAL.md`.

## Pflicht-Abbruch bei Aufweitung
Wenn mehr als ein neuer Konflikt auftaucht:
1. laufenden Patch sauber abschließen,
2. Rest in `todo.txt` verschieben,
3. nächste Iteration neu planen.

## Endvalidierung (nur am Iterationsende)
Nur direkt Betroffenes prüfen:
- Syntax
- direkt betroffene Logik
- direkt betroffene Ausgabe
- wirklich betroffene Tests

Nicht geänderte Bereiche nicht erneut prüfen.

## Wartbarkeit
- Logik, Konfiguration, Daten, Tests und Doku sauber trennen.
- Richtwerte:
  - Hilfsdateien bis 150 Zeilen
  - normale Module bis 300 Zeilen
  - Kernmodule bis 500 Zeilen
- Funktionen möglichst unter 40 Zeilen; über 60 Zeilen Teilung prüfen.

## Sprache und Darstellung
- Alle Ausgaben in einfacher Sprache.
- Fachbegriffe nur kurz erklären (in Klammern).
- Ergebnisse immer übersichtlich darstellen:
  - kurze Überschriften
  - klare Listen
  - direkte nächste Schritte

## Pflicht-Updates je Iteration
Immer aktualisieren:
- `README.md`
  - oben: Status (erledigt/offen), Fortschritt in %
  - Mitte: aktuelle Toolstruktur und Toolumfang
  - unten: Laien-Befehle + kurze Empfehlungsliste
- `TOOL_TUTORIAL.md`
  - mindestens eine kleine, sinnvolle Erweiterung
- `INDEX.md`
  - kompletter aktueller Verzeichnisbaum
  - vollständige Dateiliste (ohne `.git`)

## Strenge Patch-Checkliste
Vor Abschluss jeder Iteration bestätigen:
- [ ] Patchgrund je Änderung dokumentiert
- [ ] Nur begründete Dateien geändert
- [ ] Nebenprobleme ggf. in `todo.txt` geparkt
- [ ] Relevante Endvalidierung ausgeführt
- [ ] Kompaktes Änderungsprotokoll erstellt
- [ ] Zwei konstruktive Empfehlungen formuliert
- [ ] README.md aktualisiert
- [ ] TOOL_TUTORIAL.md erweitert
- [ ] INDEX.md aktualisiert
