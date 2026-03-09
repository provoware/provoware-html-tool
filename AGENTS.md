#AGENTS.md
Versuche in jeder Iteration optimal und exakt an die Vorlage in der LAYOUT_UND_DESIGNVORGABEMUSTER.md an. Lege dies auch als globalen Standard fest.

## Verbindlicher Iterationsstandard (global)
1. Arbeite strikt planungsbasiert und patchbasiert: zuerst Ziel, betroffene Datei/Blöcke, Patchgrund, Risiken und bewusste Nicht-Änderungen festhalten, erst danach patchen.
2. Arbeite code- und traffic-sparsam: nur kleinste sinnvolle Änderungen, keine unnötigen Datei- oder Netzoperationen, keine Volltests ohne direkten Anlass.
3. Jede Iteration muss **genau zwei Anpassungsschritte** zur exakten Annäherung an die Vorlage `LAYOUT_UND_DESIGNVORGABEMUSTER.md` enthalten.
4. Jede Iteration muss **genau eine weiterführende TODO-Aufgaben** in `todo.txt` ergänzen (hilfreich, verbessernd oder vervollständigend).
5. Validierung erst nach allen Patches der Iteration und nur gezielt für direkt betroffene Bereiche.
6. Fehlerhandling ist verpflichtend robust: Für jede Änderung müssen klarer Fehlerpfad, eindeutige Fehlermeldung in einfacher Sprache und ein sicherer Fallback (ohne Datenverlust) mitgedacht werden.
7. Bei Blockern oder unklaren Abhängigkeiten gilt Stop-and-Record: keine riskanten Ad-hoc-Änderungen, stattdessen kleinstmöglicher sicherer Zustand, kurze Ursachen-Notiz und genau ein konkreter Folgepunkt in `todo.txt`.
