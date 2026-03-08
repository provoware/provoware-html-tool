# UPGRADE_POOL.md

## Offen

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-001 | Layout | Zentrale Größenlogik für Panels vereinheitlichen | Verhindert inkonsistente Skalierung | stabilere Darstellung bei Fensteränderung | offen | 001 |

**Passende Vorschläge:**
1. Min-/Max-Breiten je Hauptpanel definieren
2. Einheitliche Spacing-Tokens für Innen- und Außenabstände einführen

## Erledigt

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-002 | Scan-Prozess | Ab Iteration 10 einen Rotationsmodus ergänzen: 9x Delta-Scan, 1x gezielter Bereichs-Scan eines älteren Moduls | Hält Altlasten kontrolliert sichtbar ohne Vollscan-Kosten | Bessere Altlastenpflege bei weiterhin kleinem Prüfaufwand | erledigt | 002 |

**Passende Vorschläge:**
1. Ältere Module für den Rotationsscan mit einem kurzen Risikoscore markieren (z. B. hoch/mittel/niedrig)
2. Für den gezielten Bereichs-Scan ein Mini-Protokoll mit maximal drei Fundstellen standardisieren

| UP-003 | Registry-Prozess | Scope-zu-Priorität-Mapping und feste Rotations-Kandidatenliste in der Registry hinterlegen | Einheitliche Sortierung und reproduzierbare Modulauswahl fehlten noch | Schnellere, konsistente Priorisierung mit planbarer Altlastenpflege | erledigt | 003 |

**Passende Vorschläge:**
1. Für jeden Rotationslauf ein kurzes Ergebnisfeld (`keine Funde`/`x Funde`) im Registry-Meta ergänzen
2. Kandidatenliste halbjährlich prüfen und nach realen Fehlerfunden neu gewichten
