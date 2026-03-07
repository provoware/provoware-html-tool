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


### Mini-Abgleich (Iteration 2026-03-07): Farbtoken-Cluster „Primär-Interaktion Header"
- Ziel: Fokusfarbe für Header-Aktionen näher an die Primär-Token `#3479ff` bis `#1849bc` bringen.
- Betroffene CSS-Token:
  - `--header-action-focus-ring`
  - `--header-action-focus-border`
- Ergebnis:
  - Fokus-Ring der Header-Buttons nutzt jetzt ein klareres Blau im Primärbereich.
  - Fokus-Rand bleibt hell genug für guten Kontrast auf dunklem Glas-Hintergrund.
- Hinweis: Nur ein Token-Cluster wurde angepasst (kein Layout- oder Strukturumbau).

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

## Soll-Ist-Abgleich (Iteration 2026-03-07): Was noch optimiert werden sollte

### Kurzfazit
- **Struktur**: Grundstruktur mit 3 Spalten ist vorhanden, aber die mittlere Spalte ist funktional noch stärker „Formular + Toolbereich“ statt „kartenbasiertes Studio-Dashboard“.
- **Farbwelt**: Die aktuelle Oberfläche ist eher oliv/grün-braun. Die Vorlage ist klar blau/grau mit kühlen Lichtkanten.
- **Nähe zur Vorlage gesamt**: **ca. 68%** (gute Basis, sichtbarer Abstand bei Farbwelt, Glas-Tiefe und Header-Mikrostruktur).

### Messbarer Check 1–7 (Pflicht)
1. **Struktur-Check**: **teilweise erfüllt**.
   - Positiv: linke Navigation, Mitte, rechte Spalte sind da.
   - Lücke: rechte Spalte enthält aktuell viele Einstellungs-Buttons statt kompakter Utility-Karten (Vorlagen, Mini-Notiz, Hilfe-Karten).
2. **Farb-Check**: **nicht voll erfüllt**.
   - Positiv: Akzentchips in Blau/Gold/Grün/Violett sind vorhanden.
   - Lücke: Basis-Hintergrund und Panel-Verläufe sind zu warm/grün statt kühl-blau.
3. **Transparenz-Check**: **erfüllt**.
   - Mehr als drei Ebenen sichtbar (App-Fläche, Panels, Chips/Buttons).
4. **Lesbarkeits-Check**: **erfüllt mit Reserve**.
   - Haupttexte sind gut lesbar, aber einige helle Flächen wirken weniger „glasig“ und mehr „opak“.
5. **Interaktions-Check**: **erfüllt**.
   - Fokus-/Hover-Zustände sind konsistent.
6. **Responsive-Check**: **erfüllt**.
   - Unter 980px bleibt die Darstellung stabil.
7. **Stabilitäts-Check**: **erfüllt**.
   - Kern-IDs/JS-Anker bleiben unverändert.

### Priorisierte Optimierungsliste (kleinster sinnvoller Eingriff)
1. **Priorität A – Farbwelt auf Vorlage ziehen (nur CSS-Token)**
   - Ziel: Grundtöne von oliv/grün in blau/grau verschieben.
   - Wirkung: größter visueller Gewinn ohne HTML-/JS-Umbau.
   - Betroffener Bereich: globale Farbvariablen + Hauptverläufe in `css/app.css`.
2. **Priorität A – Header-Mikrostruktur näher an Vorlage**
   - Ziel: Suche/Hotkey-Chip und Utility-Icons als klare visuelle Leiste ergänzen.
   - Wirkung: obere Leiste wirkt sofort näher am Referenzbild.
   - Betroffener Bereich: nur Header-Markup + zugehörige Styles.
3. **Priorität B – rechte Spalte in kompakte Kartenblöcke gliedern**
   - Ziel: „Vorlagen“, „Mini-Notiz“, „Projektinfos“, „Hilfe“ als getrennte Kartenoptik statt einer langen Einstellungsfläche.
   - Wirkung: bessere Hierarchie und nähere Anmutung.
   - Betroffener Bereich: bestehende Sektionen neu gruppieren (keine ID-Änderung).
4. **Priorität B – Glas-Tiefe schärfen (Blur + Randlicht + Overlay)**
   - Ziel: Karten klarer vom Hintergrund trennen, trotzdem gute Lesbarkeit.
   - Wirkung: stärkerer Glasmorph-Eindruck.
   - Betroffener Bereich: Panel-Overlay und Schattenwerte.
5. **Priorität C – Icon- und Typo-Harmonie**
   - Ziel: einheitlicher Icon-Stil und konsistenteres Gewicht in Überschriften.
   - Wirkung: professioneller Gesamteindruck bei geringem Risiko.

## Grenzen der Exaktheit
- Ohne Original-Hintergrundbild, Original-Font und Icon-Set ist nur eine sehr enge Annäherung möglich.
- Funktionale IDs und bestehende Logik bleiben bewusst erhalten (Sicherheits-/Wartbarkeitsgrund).

## Nächste präzise Feinanpassungen (optional)
1. Eigenes lokal eingebundenes Hintergrundbild im gleichen Stil ergänzen.
2. Abstandssystem auf 8/12/16/20 fixieren und pro Komponente messen.
3. Nach Farb- und Glas-Update erst dann Mikroabstände und Icon-Feinschliff nachziehen.
