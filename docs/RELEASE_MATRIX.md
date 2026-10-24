# Vorrelease-Pflichtmatrix – provoware-html-tool

Stand: 2026-10-24 · Basis-HEAD: 310a8b9bfd02199ae9515a932dbf462fb650dbc9 · Arbeitszweig: fix/workspace-journal-recovery-20261023

Statusregeln: **PASS** nur für nachgewiesene, konkret benannte Tests auf passendem Commit; **OFFEN** ohne ausreichenden Beleg; **BLOCKED** bei fehlender Vorbedingung. Keine Gesamtprozentzahl.

| Pflichtbereich | Soll / konkreter Prüfmaßstab | Nachweis / Ist | Status |
| --- | --- | --- | --- |
| Fachfunktionen | Projektanlage, Module, Vorlagen, Editor und Suchfunktion end-to-end | Grundstruktur; End-to-End nicht belegt | OFFEN |
| Grenzfälle | Ungültige Namen, defekte Dateien, leere Daten, Pfadversuche | Projektkollisionen getestet; Traversal-Test im PR | OFFEN |
| Datensicherheit | Zusammengehörige modules/layout gemeinsam konsistent | Journal, Rücksetzung bei Schreibfehler, simulierter Abbruch im PR | PRÜFUNG AUSSTEHEND |
| Wiederherstellung | Vor UI-Start unterbrochene Änderungen zurücksetzen | Startup-Recovery im PR; reale Stromausfälle nicht getestet | PRÜFUNG AUSSTEHEND |
| Fehlerbehandlung | Fehlende/kaputte Dateien ohne Datenverlust melden | Beschädigtes Journal blockiert Änderungen im PR | PRÜFUNG AUSSTEHEND |
| Sicherheit | Pfadschutz, Schreibrechte, keine stillen Migrationen | Projektpfad-Validierung im PR; Gesamtaudit offen | OFFEN |
| Design / UX | Echte Aktionen und lesbare Texte | Teilweise Grundoberfläche, Sichtprüfung offen | OFFEN |
| 800×600 / Skalierung | Kein Verlust kritischer Aktionen bei hoher Skalierung | Keine nachgewiesene Vollprüfung | OFFEN |
| Tastatur / Barrierefreiheit | Fokus, Navigation, Kontrast, Beschriftungen | Keine nachgewiesene Vollprüfung | OFFEN |
| Performance | Große Projektbestände, Startzeit und Speicherdruck | Keine Grenzwertmessung | OFFEN |
| Wartbarkeit | Kleine Dienste, klar getrennte Speicherverantwortung | Transaktionsdienst im PR; Gesamtprüfung offen | OFFEN |
| Paketierung / Installation | Frisches Linux, installierbares Wheel, Assets | GitHub-Paketierung zuletzt erfolgreich am Basis-HEAD | TEILWEISE |
| Automatisierte Tests | Negative Fälle, Schreibabbruch, Regression | Tests im PR; CI noch abzuwarten | PRÜFUNG AUSSTEHEND |
| Integration | Zusammenspiel Startup/Projekt/Workspace | Bootstrap-Recovery im PR; GUI-Integration offen | OFFEN |
| GUI / Browser | Echte GUI-Sichtprüfung auf Kubuntu | Nicht nachgewiesen | OFFEN |
| Regression | Bestehende Tests nach Änderung erneut ausführen | GitHub-CI am PR-HEAD erforderlich | OFFEN |
| CI | Python 3.11/3.12; Storage- und Paketierungsprüfungen | Workflows vorhanden; PR-HEAD-Ergebnisse abzuwarten | OFFEN |
| Dokumentation | README, Matrix, Fehlerpfade, nächste Schritte | Matrix ergänzt; vollständige Nutzeranleitung offen | OFFEN |
| Release-Vorbereitung | Vollständiger Freeze, keine offenen P0, gebündelte Endabnahme | P0 #418 bleibt bis Beweis offen | BLOCKED |

## Arbeitspaket #418 – drei Anpassungsschritte

1. **Schreibschutz:** Vor dem Überschreiben beider JSON-Dateien deren gültige Originaldaten mit Prüfsummen in einem dauerhaft synchronisierten Rücksetzprotokoll sichern; exklusiven Linux-Dateischreibschutz verwenden.
2. **Integration:** Bei Fehlern beide Dateien zurücksetzen; bei Neustart vor Aufbau der Oberfläche liegengebliebene Protokolle abarbeiten. Beschädigte Protokolle stoppen den Start ohne Dateimanipulation.
3. **Evidenz:** Gezielte Tests für Fehler beim zweiten Schreiben, Prozessabbruch, kaputtes Protokoll und Pfadversuche; GitHub Storage-CI und Paketierungs-CI auf finalem PR-HEAD prüfen.

**Bewusste Nicht-Änderungen:** Keine bestehenden Projektformate migrieren, keine Nutzerdaten umbenennen oder löschen, keine Änderungen an UI-Layout und anderen Repositories.

**Risiko / Einschränkung:** Simulierter Prozessabbruch ist kein echter Stromausfall. Während des kurzen Schreibfensters könnten fremde, nicht kooperierende Leser einen Zwischenstand sehen; daher bleibt ein zusätzlicher Integrationstest offen. Kein Merge ohne grüne vorgeschriebene Prüfungen.

**Nachverfolgung:** GitHub Issue #418; Branch fix/workspace-journal-recovery-20261023; PR und finale Commit-SHA nach GitHub-Übertragung. Nächster Schritt: CI-Gates prüfen, dann realistische Neustart-/Datenträger- und GUI-Tests im isolierten Testbereich.



## Fortsetzung #418 – 24.10.2026 (Prüfung nach Commit ausstehend)

Ausgangs-PR-HEAD: `43c8629ede89e30ea7da2f4b972d798e1a0474b0`; PR: #422; Branch: `fix/workspace-journal-recovery-20261023`.
Am Ausgangs-HEAD waren Storage-CI und Paketierungs-CI für Python 3.11/3.12 erfolgreich:
[Storage](https://github.com/provoware/provoware-html-tool/actions/runs/40015247088) und
[Paketierung](https://github.com/provoware/provoware-html-tool/actions/runs/40015247101).
Diese Nachweise gelten **nicht automatisch** für den neuen Commit.

Drei gezielte Anpassungsschritte:
1. **Fehlerpfad:** Ein hängender symbolischer Link auf das Rücksetzprotokoll darf die Startwiederherstellung nicht stillschweigend umgehen.
2. **Realistischere Prüfung:** Ein eigenständiger Python-Prozess wird zwischen den zwei Dateischreibvorgängen mit `os._exit(71)` ohne Aufräumroutine beendet; der Folgeprozess muss beide Originaldateien wiederherstellen.
3. **Nachverfolgung:** Regressionen, Matrix und genau eine weitere Folgeaufgabe dokumentieren; anschließend beide GitHub-Prüfketten am finalen PR-HEAD prüfen.

Erwartete Ergebnisse: hängender Journal-Link führt zu **BLOCKED** statt Startfreigabe; Prozessabbruch wird rückgesetzt. **PASS erst nach tatsächlichem Testlauf.**
Offen bleiben Stromausfall-/Datenträgertests, konkurrierende Fremdleser, GUI, 800×600, Skalierung und Gesamt-Release.
Keine Migration, kein Merge und keine Veröffentlichung.
