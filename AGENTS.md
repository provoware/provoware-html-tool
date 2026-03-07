# AGENTS.md

## Arbeitsprinzip
Arbeite immer **planungsbasiert**, **patchbasiert**, **codesparsam** und **traffic-sparsam**.
Leitlinie: **Planung ist Gold, Handlung ist Silber**.

## Pflicht vor jeder Änderung
Vor dem ersten Patch immer kurz festhalten:
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
- Kleinster sinnvoller Eingriff hat Vorrang.

## Validierung (nur am Ende der Iteration)
Prüfe nur, was direkt betroffen ist:
- Syntax
- direkt betroffene Logik
- direkt betroffene Ausgabe
- wirklich betroffene Tests

Nicht geänderte Bereiche werden nicht erneut geprüft.

## Umgang mit Nebenproblemen
- Neue Nebenprobleme nicht ungeplant mitbearbeiten.
- Stattdessen Eintrag in `todo.txt` mit:
  - Begründung
  - Prüfschritt
  - Fertig-Kriterium

## Pflicht-Abbruch bei Aufweitung
Wenn mehr als ein neuer Konflikt auftaucht:
1. laufenden Patch sauber abschließen,
2. Rest in `todo.txt` verschieben,
3. nächste Iteration sauber planen.

## Feste Iterationsgrenze
Maximal **3 saubere Patches pro Iteration**.
Lieber wenige klare Änderungen als viele halbverwandte Anpassungen.

## Wartbarkeit
- Logik, Konfiguration, Daten, Tests und Doku sauber trennen.
- Richtwerte:
  - Hilfsdateien bis 150 Zeilen
  - normale Module bis 300 Zeilen
  - Kernmodule bis 500 Zeilen
- Funktionen möglichst unter 40 Zeilen; über 60 Zeilen Teilung prüfen.

## Sprache
Alle Ausgaben in einfacher Sprache.
Fachbegriffe nur kurz erklären (in Klammern).

## Strenge Patch-Checkliste
Vor Abschluss jeder Iteration bestätigen:
- [ ] Patchgrund je Änderung dokumentiert
- [ ] Nur begründete Dateien geändert
- [ ] Nebenprobleme ggf. in `todo.txt` geparkt
- [ ] Relevante Endvalidierung ausgeführt
- [ ] Kompaktes Änderungsprotokoll erstellt
- [ ] Zwei konstruktive Empfehlungen formuliert
