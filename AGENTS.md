#AGENTS.md

Strikte Arbeitsdisziplin:
Arbeite strikt planungsbasiert, patchbasiert, codesparsam und traffic-sparsam. Planung ist Gold, Handlung ist Silber. Vor jeder Änderung zuerst Ziel, betroffene Dateien, betroffene Zeilen oder Blöcke, Patchgrund, Risiken und bewusste Nicht-Änderungen ermitteln. Danach eine konkrete Schrittliste erstellen. Nur dann patchen.

Ändere nur begründet betroffene Dateien und nur die exakt betroffenen Stellen. Keine unnötigen Änderungen an stabilen Bereichen, keine kosmetischen Nebenanpassungen, keine globalen Umformatierungen, keine Volltests ohne Anlass, keine Endlos-Prüfschleifen, keine Wiederholungsprüfungen ohne neue Änderung, keine unnötigen Dateioperationen und keine unnötigen Dateizugriffe. Immer kleinster sinnvoller Eingriff.

Validierung erfolgt grundsätzlich erst am Ende aller Patches einer Iteration. Dabei nur relevante Prüfungen ausführen: Syntax, direkt betroffene Logik, direkt betroffene Ausgabe und nur wirklich betroffene Tests. Nicht veränderte Dateien und Bereiche sollen weder unnötig erneut geprüft noch erneut analysiert werden.

Dokumentation nur bei echter Verhaltensänderung anpassen. Offene Konflikte oder Folgeprobleme nicht ungeplant mitbearbeiten, sondern sauber in todo.txt für die nächste Iteration dokumentieren. Jede Iteration endet mit einem kompakten Änderungsprotokoll, klarer Endvalidierung und zwei konstruktiven, unterstützenden Empfehlungen.

Achte auf maximale Wartbarkeit: kleine, klar getrennte Dateien und Funktionen, getrennte Logik-, Config-, Daten-, Test- und Doku-Bereiche. Empfohlene Grenzen: Hilfsdateien bis 150 Zeilen, normale Module bis 300 Zeilen, Kernmodule bis 500 Zeilen; darüber Teilung prüfen. Funktionen möglichst unter 40 Zeilen, über 60 Zeilen Teilbarkeit prüfen. Alle Ausgaben in einfacher Sprache, Fachbegriffe nur kurz erklärt in Klammern.

Kein Patch ohne Patchgrund. Keine Datei ohne Anlass. Keine Prüfung ohne Ziel. Keine Wiederholung ohne neue Änderung. Keine Erweiterung der Iteration bei neu entdeckten Nebenproblemen, wenn diese nicht sauber isoliert lösbar sind. Stattdessen Todo-Eintrag mit Begründung, Prüfschritt und Fertig-Kriterium anlegen.

Bevor Code geschrieben wird, immer prüfen, ob der gewünschte Effekt mit kleinerem Eingriff, Wiederverwendung bestehender Logik oder besserer Planung erreichbar ist. Erst minimaler Plan, dann minimaler Patch, dann minimale zielgerichtete Validierung.

Pflicht-Abbruch bei Iterationsaufweitung, also: wenn mehr als ein neuer Konflikt auftaucht, aktuellen Patch sauber abschließen und Rest in todo.txt verschieben.

eine feste Regel für maximale Patchanzahl pro Iteration, zum Beispiel: lieber 3 saubere Patches als 12 halbverwandte Änderungen. Das hält Iterationen kontrollierbar.

strenge Patch-Checkliste

