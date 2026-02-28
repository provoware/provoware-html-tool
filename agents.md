# agents.md

## Projektziel
Dieses Projekt startet **neu** mit klaren, einheitlichen Regeln.
Ziel ist: barrierefrei, verständlich, wartbar und voll automatisiert.

## Arbeitsregeln
1. **Einfache Sprache** nutzen.
2. Fachwörter kurz erklären, z. B. *Validierung (Eingabeprüfung)*.
3. Jede Funktion prüft:
   - Eingabe (Input)
   - Ergebnis (Output)
4. Fehlertexte immer mit nächstem Schritt:
   - „Erneut versuchen“
   - „Reparatur starten“
   - „Protokoll öffnen“
5. Einheitliche Struktur:
   - `system/` Kernlogik
   - `config/` Einstellungen
   - `data/` variable Daten
   - `tools/` Prüfungen und Hilfen
   - `templates/` UI-Vorlagen

## Barrierefreiheit (A11y)
- Tastatur zuerst (Fokus gut sichtbar).
- Status nie nur über Farbe, immer auch über Text.
- Hoher Kontrast in allen Farbthemen.
- Mehrere Themes anbieten (Hell, Dunkel, Kontrast+).

## Start-Routine
`start.sh` soll später vollautomatisch:
- Voraussetzungen prüfen
- fehlende Abhängigkeiten automatisch installieren
- Code formatieren
- Tests ausführen
- klare Rückmeldung geben: geprüft, gelöst, nächster Schritt

## Debugging/Logging
- Einfache Meldungen für Laien.
- Detaillierte Ursachen im Protokoll.
- Konkrete Lösungsvorschläge anzeigen.
