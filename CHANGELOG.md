# CHANGELOG

## 2026-05-07

### UI-Profi-Upgrade: Iteration 1
- Globales Qt-Stylesheet in `app/ui/theme.py` ergänzt.
- Stylesheet zentral in `app/main.py` eingebunden.
- Buttons, Eingabefelder, Tabs, Splitter und Statusbar erhalten konsistentere Grundoptik.
- Tastaturfokus wird über gelben Rahmen besser sichtbar.
- Validierung durchgeführt: Datei vorhanden, Import vorhanden, Stylesheet-Aufruf vorhanden.

### Offene Validierung
- Sichtprüfung im laufenden PySide6-Fenster lokal mit `./start.sh` durchführen.
- Kleine, mittlere und große Fensterbreite prüfen.
- Prüfen, ob vorhandene Inline-Styles einzelne globale Styles bewusst überschreiben.
