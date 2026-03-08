# AGENTS.md

## Ziel
Kleine, klare, sichere Iterationen.
Fokus: laienfreundlich, übersichtlich, flexibel darstellbar, robust, wartbar.

---

## Grundprinzip
- Planung ist Gold, Handlung ist Silber.
- Immer den kleinsten sinnvollen Eingriff wählen.
- Patchbasiert, codesparsam, traffic-sparsam arbeiten.
- Keine ungeplanten Nebenbaustellen eröffnen.
- Stabilität vor Tempo.
- Klarheit vor Cleverness.

---

## Unverhandelbare Regeln
- Nur begründet betroffene Dateien ändern.
- Nur exakt betroffene Stellen ändern.
- Keine kosmetischen Nebenänderungen.
- Keine globalen Umformatierungen.
- Keine unnötigen Dateioperationen.
- Keine neue Abhängigkeit ohne klare Begründung.
- Keine stillen Umbenennungen.
- Keine Datei komplett neu schreiben, wenn ein lokaler Patch reicht.
- Keine Misch-Iteration aus Logik, Design, Doku und Refactor ohne Begründung.

---

## Pflicht vor dem ersten Patch
Vor jeder Änderung kurz dokumentieren:
1. Ziel der Iteration
2. Patchart
3. Priorität
4. Betroffene Dateien
5. Betroffene Zeilen/Blöcke
6. Patchgrund
7. Risiken
8. Bewusste Nicht-Änderungen
9. Konkrete Schrittliste

Ohne diese Vorarbeit kein Patch.

---

## Erlaubte Patcharten
Pro Iteration genau eine Hauptart:
- Bugfix
- Robustheitsfix
- Nutzerfreundlichkeitsfix
- Hilfe/Tutorial-Fix
- Mini-Refactor

---

## Prioritätsklassen
- Kritisch: Startfehler, Datenverlust, kaputte Kernfunktion
- Hoch: fehlerhafte Kernlogik, irreführende UI, inkonsistente Zustände
- Mittel: Robustheit, UX-Schwäche, Teilfunktion unklar
- Niedrig: Doku, Texte, kleinere Strukturverbesserungen

---

## Patch-Regeln
- Maximal 3 saubere Patches pro Iteration.
- Nur exakt betroffene Stellen ändern.
- Neue Nebenprobleme nicht ungeplant mitbearbeiten.
- Bei mehr als einem neuen Konflikt: Patch sauber beenden, Rest in `todo.txt`.

---

## Nebenprobleme parken
Wenn Nebenprobleme auftauchen:
- nicht ungeplant mitbauen
- sauber in `todo.txt` eintragen

Format:
[ ] Datum | Bereich | Problem | Grund | prüfen: ... | fertig wenn: ...

---

## Endvalidierung
Nur direkt Betroffenes prüfen.

### Validierungsmatrix
- Logik geändert:
  - Syntax prüfen
  - direkt betroffene Logik prüfen
  - betroffene Tests ausführen, falls vorhanden

- UI geändert:
  - direkte Sichtprüfung
  - direkte Interaktion prüfen
  - Responsive-Prüfung nur im betroffenen Bereich

- Daten/JSON geändert:
  - Laden/Speichern prüfen
  - Schlüsselkonsistenz prüfen
  - Fallback-Verhalten prüfen

- Doku geändert:
  - Dateinamen, Pfade, Befehle, Verweise prüfen

Nicht geänderte Bereiche nicht erneut prüfen.

---

## Wartbarkeit
- Logik, Konfiguration, Daten, Tests und Doku sauber trennen.
- Hilfsdateien: Ziel bis 150 Zeilen
- normale Module: Ziel bis 300 Zeilen
- Kernmodule: Ziel bis 500 Zeilen

### Eskalation
- ab 450 Zeilen: Teilung prüfen
- ab 600 Zeilen: Teilung begründen oder umsetzen

### Funktionen
- Ziel unter 40 Zeilen
- ab 60 Zeilen: Teilung prüfen
- ab 80 Zeilen: Teilung begründen oder umsetzen

---

## Sprache und Darstellung
- Alle Ausgaben in einfacher Sprache.
- Fachbegriffe nur kurz erklären (in Klammern).
- Ergebnisse übersichtlich darstellen:
  - kurze Überschriften
  - klare Listen
  - direkte nächste Schritte

---

## Doku-Regeln
Nur relevante Doku aktualisieren:

- `README.md`
  - wenn Status, Struktur, Umfang oder Bedienung betroffen

- `TOOL_TUTORIAL.md`
  - wenn Bedienung, Hilfe oder Nutzerführung betroffen

- `INDEX.md`
  - wenn Dateien oder Ordner geändert wurden

Keine Doku-Änderung ohne fachlichen Anlass.

---

## Definition of Done
Eine Iteration ist nur fertig, wenn:
- das Ziel erreicht oder sauber verschoben wurde
- nur begründete Dateien geändert wurden
- direkt betroffene Validierung erfolgreich war
- Nebenprobleme in `todo.txt` geparkt wurden
- relevante Doku aktualisiert wurde
- ein kompaktes Änderungsprotokoll vorliegt
- zwei konkrete Empfehlungen für die nächste Iteration formuliert wurden

---

## Pflichtnachweis je Iteration
Kurz festhalten:
1. Was war vorher falsch, schwach oder unklar?
2. Was wurde konkret geändert?
3. Woran erkennt man die Verbesserung?

---

## Strenge Patch-Checkliste
- [ ] Patchgrund je Änderung dokumentiert
- [ ] Nur begründete Dateien geändert
- [ ] Nebenprobleme ggf. in `todo.txt` geparkt
- [ ] Relevante Endvalidierung ausgeführt
- [ ] Kompaktes Änderungsprotokoll erstellt
- [ ] Zwei konstruktive Empfehlungen formuliert
- [ ] Relevante Doku aktualisiert

---

## Entwicklungsdisziplin vor Abschluss
Kurz beantworten:
- Haben wir den kleinsten sinnvollen Eingriff gemacht?
- Haben wir Änderungen klar auf betroffene Dateien begrenzt?
- Haben wir Nebenprobleme geparkt statt ungeplant mitgebaut?
- Haben wir nur direkt Betroffenes validiert?
- Ist die Iteration klar abgeschlossen?
