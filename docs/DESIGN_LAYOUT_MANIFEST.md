# Design Layout Manifest – Iteration 65 (2026-03-02)

## 1) Professionelle Bildanalyse (Soll)

### Raster und Aufbau

- Fensteraufbau mit klarer **Topbar**, **3-Spalten-Hauptbereich** und **Footer-Leiste**.
- Linke Spalte: Navigation, Suche, Kontoaktion.
- Mitte: Kartenraster (3 Spalten) fuer Hauptaktionen.
- Rechte Spalte: Einstellungen, Schnellsuche, Nutzungsstatus.

### Typografie

- Klare Hierarchie: App-Name > Kartenname > Feldtext.
- Gut lesbare Groessenstufen 14/16/20/24 px.

### Farben und Kontrast

- Grundstil: dunkler Hintergrund mit Neon-Akzenten.
- Status nie nur in Farbe, immer mit Text.
- Fokusring klar sichtbar in jedem Theme.

### Interaktionsmuster

- Jede Karte hat klare Primaeraktion.
- Rueckweg immer vorhanden (Escape, Schliessen, Abbrechen).
- Fehlertexte nennen direkt den naechsten Schritt.

## 2) Ist-Stand nach Umbau

- Dashboard nutzt jetzt ebenfalls einen dunklen Neon-Grundstil.
- Drei Spalten sind visuell als **left rail / center stage / right rail** getrennt.
- Zusaetzliches Statusbanner oberhalb des Layouts aktiv.
- Theme-Auswahl mit 5 Themes bleibt erhalten.

## 3) Priorisierte Abweichungsliste (Soll/Ist)

1. **Mittel:** Kartenfarben sind bereits neon-nah, aber je Karte noch nicht so individuell wie im Beispielbild.
2. **Mittel:** Rechte Spalte hat Struktur, aber noch keine echte Statistikberechnung.
3. **Niedrig:** Footer ist vorhanden, aber visuell weniger prominent als im Beispielbild.

## 4) Konkrete Folgepunkte (automatisch aus Analyse)

- P1 geplant in `todo.txt`: Rail-Feinschliff + Statusbanner in allen 5 Themes final angleichen.
- P2 geplant: Kartenfarb-Profile je Modul als Design-Tokens erweitern.

## 5) Technische Quelle

Die maschinenlesbare Version steht in:

- `config/design_layout_manifest.json`
