# GLOBAL_LAYOUT_DESIGN_STANDARD.md

## Zweck
Dieser Standard ist **global verbindlich** für neue UI-Änderungen im Projekt.
Er basiert auf `LAYOUT_UND_DESIGNVORGABEMUSTER.html` und konkretisiert Layout, Design, Farben und Größenverhältnisse.

## 1) Layout-Grundraster (MUSS)
- Desktop-First, 3 Hauptbereiche:
  1. Header oben
  2. Arbeitsbereich mit 3 Spalten (Navigation | Hauptinhalt | Aktionen)
  3. Footer unten
- Zielraster:
  - Header-Höhe: `--header-h: 60px`
  - Navigation: `--nav-w: 88px`
  - Aktionen rechts: `--action-w: 260px`
  - Gap global: `--gap: 14px`
  - Footer-Höhe: `--footer-h: 146px`
- Kachelraster in der Mitte: 3x3 mit `minmax(var(--tile-min-h), 1fr)` und `--tile-min-h: 140px`.

## 2) Form- und Flächenstil (MUSS)
- Rundungen:
  - große Flächen `--radius-lg: 20px`
  - mittlere Flächen `--radius-md: 14px`
  - kleine Controls `--radius-sm: 10px`
- Panels/Flächen als Glas-Look:
  - Verlauf aus `--surface-*`
  - dezenter Rand `--panel-border`
  - Innenlicht `--panel-inset`
  - weicher Tiefenschatten `--shadow`
- Interaktive Elemente nutzen sanfte Bewegungen (Hover: leichte Anhebung, kein starkes Springen).

## 3) Farbwelt und Lichtführung (MUSS)
- Basis ist kühl-dunkel:
  - `--bg-0: #0b0f12`
  - `--bg-1: #11181d`
- Akzentfarben:
  - Primärglow `--glow: #7fd0ff`
  - Sekundärglow `--glow-2: #ffd86b`
- Overlays und Highlights nur subtil (`--overlay-*`), Lesbarkeit vor Effekt.
- Keine neue warm-olive Grundfarbwelt für Kernflächen einführen.

## 4) Größenverhältnisse und Abstände (MUSS)
- Einheitliches spacing mit 14px-Basis (`--gap`) und 10px/12px für innere Gruppen.
- Header, Seitenleisten und Karten sollen in Proportionen des Vorgabenmusters bleiben.
- Neue Komponenten müssen sich in diese Verhältnisse einfügen, statt eigene Raster einzuführen.

## 5) Interaktion und Zustand (SOLL)
- Interaktive Flächen mit `140ms`-ähnlichen Transitionen.
- Hover/Fokus:
  - feiner Border-Shift
  - kleiner Lift (`translateY(-1px)`)
  - keine aggressiven Animationen
- Fokuszustände müssen sichtbar bleiben (Tastatur-Bedienbarkeit).

## 6) Umsetzungsregel für Änderungen (MUSS)
Bei jeder UI-Iteration:
1. Kurz-Soll-Ist-Abgleich gegen diesen Standard dokumentieren.
2. Token-basierte Anpassung zuerst (Farben, Radius, Shadow, Spacing), erst dann Strukturumbau.
3. Kleinster sinnvoller Eingriff: keine unnötigen Umbauten außerhalb des betroffenen Bereichs.
4. Offene Restpunkte in `todo.txt` erfassen.

## 7) Abweichungen
Abweichungen sind nur erlaubt, wenn mindestens einer der Punkte erfüllt ist:
- technische Barriere (z. B. funktionale Inkompatibilität),
- deutliche Usability-/A11y-Verbesserung,
- messbarer Performance-Gewinn.

Dann muss die Abweichung kurz im Änderungsprotokoll begründet werden.
