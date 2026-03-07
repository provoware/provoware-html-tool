# DESIGN_VORLAGE.md

## Ziel der Vorlage
Diese Vorlage beschreibt das Referenzbild als umsetzbares Designmuster für das Dashboard.
Ziel: **möglichst exakte Annäherung** bei Farben, Glas-Effekt, Aufteilung und Lesefluss.

## Tiefenanalyse der Referenz (professionell, komponentenbasiert)

### 1) Gesamtkomposition
- **Seitenverhältnis**: breit (Desktop-first), klare 3-Spalten-Aufteilung.
- **Hauptzonen**:
  1. linke Navigation (vertikal, dunkel, weich transparent)
  2. zentrale Arbeitsfläche (mehrere Glas-Karten in Ebenen)
  3. rechte Utility-Spalte (Vorlagen, Mini-Notiz, Infos, Hilfe)
- **Hierarchie**: großes Welcome-Element oben, dann Schnellaktionen, danach Inhaltskacheln.
- **Zielwirkung**: modern, ruhig, hochwertig, „Studio/Produktiv“-Charakter.

### 2) Formensprache
- Durchgehend **große Rundungen** (ca. 14–24px).
- Karten sind **glasmorph** (Glas-Look: transparente Flächen + Weichzeichnung + Randlicht).
- Kanten haben zwei Ebenen:
  - feines Außenlicht (heller Rand)
  - weicher Innenschatten (Tiefe)

### 3) Farb- und Lichtsystem
- **Grundfarben**: dunkles Blau/Grau als Basis.
- **Akzentfarben** in Aktionskacheln:
  - Blau (primär)
  - Gelb/Gold
  - Grün
  - Violett
- **Kontrastprinzip**:
  - helle Typografie auf dunklem Glas
  - semitransparente Flächen für Tiefe
- **Lichtführung**:
  - diffuse Highlights oben/links
  - dunklere Tiefen unten/rechts

### 4) Transparenz & Schärfe
- Mehrere Transparenzstufen gleichzeitig:
  - Basis-Container: mittel transparent
  - Karten: leicht bis mittel transparent
  - Buttons: stärker deckend als Karten
- **Blur (Weichzeichnung)** erzeugt Trennung von Vorder-/Hintergrund.
- Wichtig: Transparenz nicht zu hoch setzen, sonst Lesbarkeit sinkt.

### 5) Typografie und Lesefluss
- Sans-Serif, semibold bis bold in Überschriften.
- kurze Zeilen, klare Gruppen, hohe Scanbarkeit.
- große Überschrift + kurze Unterzeile als visuelle Startmarke.

### 6) Raster und Abstände
- Außenraster: 3 Spalten.
- Innenraster: Karten in konsistenten Blöcken.
- typischer Abstand:
  - 8px Mikroabstand (Icon/Text)
  - 12px Karten-Innenabstand
  - 16px bis 20px zwischen großen Bereichen

### 7) Interaktionsmuster
- Buttons wirken als „illuminierte Chips“.
- Hover/Fokus: leichter Helligkeitsanstieg + Schattenreaktion.
- Statuschips (aktiv/ok) sind klein, hoch sichtbar, farbgeführt.

## Umsetzbare Design-Token (für CSS)

### Farbtoken (näherungsweise)
- Hintergrund dunkel: `#0f1729`, `#151f30`, `#1b2437`
- Text hell: `#edf3ff`, `#d3dff6`
- Randlicht: `rgba(183, 204, 240, 0.3)`
- Primärbutton: `#3479ff` bis `#1849bc`
- Erfolg: grünlicher Verlauf auf dunkler Basis
- Warnung: amber/orange Verlauf auf dunkler Basis

### Flächentoken
- Kartenhintergrund: `linear-gradient(152deg, rgba(56,73,104,.64), rgba(17,27,43,.64))`
- App-Hintergrund: dunkles Blau mit radialen Highlights
- Border-Radius: 18–24px
- Shadow: tief, weich, blau/schwarz (`0 18px 30px rgba(4,10,25,.45)`)

## Abgleich-Checkliste (Erfolgskriterien)
1. Drei klar erkennbare Spalten vorhanden.
2. Willkommen-Bereich als dominantes visuelles Element oben.
3. Karten haben sichtbaren Glas-Effekt (Transparenz + Blur + Randlicht).
4. Aktions-Buttons zeigen farbige Chips mit gutem Kontrast.
5. Lesbarkeit bleibt auf 100% Zoom stabil.
6. Mobile Breite bricht auf 1 Spalte um (ohne Überlappung).

## Grenzen der Exaktheit
- Ohne Original-Hintergrundbild, Original-Font und Icon-Set ist nur eine sehr enge Annäherung möglich.
- Funktionale IDs und bestehende Logik bleiben bewusst erhalten (Sicherheits-/Wartbarkeitsgrund).

## Nächste präzise Feinanpassungen (optional)
1. Eigenes lokal eingebundenes Hintergrundbild im gleichen Stil ergänzen.
2. Icon-Set vereinheitlichen (Linienstärke und Leuchtfarbe).
3. Abstandssystem auf 8/12/16/20 fixieren und pro Komponente messen.
