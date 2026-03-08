# UPGRADE_POOL.md

## Offen

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-001 | Layout | Zentrale Größenlogik für Panels vereinheitlichen | Verhindert inkonsistente Skalierung | stabilere Darstellung bei Fensteränderung | offen | 001 |
| UP-005 | Template-Archiv | Ein leichtes Schema-Validierungsfeld (`required_fields`) für Standard-Templates im Archiv ergänzen | Beschädigte oder unvollständige Einträge werden aktuell erst spät sichtbar | Frühere Fehlererkennung und klarere Reparaturhinweise beim Laden | offen | 005 |

**Passende Vorschläge:**
1. Min-/Max-Breiten je Hauptpanel definieren
2. Einheitliche Spacing-Tokens für Innen- und Außenabstände einführen

**Passende Vorschläge:**
1. Beim Laden fehlende Felder direkt mit Standardwerten ergänzen und kurz protokollieren
2. Eine kleine UI-Hinweiszeile für „Archiv repariert“ im Vorlagenbereich ergänzen

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

| UP-004 | Registry-Prozess | `rotation_last_target` und kurzes `scope_examples`-Objekt ergänzen | Letzter Zielkandidat und einheitliche Scope-Formulierungen waren nicht direkt sichtbar | Schnellere Orientierung und konsistentere neue Funde | erledigt | 004 |

**Passende Vorschläge:**
1. `rotation_last_target.result` bei jedem Rotationslauf auf `keine_funde` oder `funde` setzen
2. `scope_examples` jährlich kurz gegen reale Fundstellen nachschärfen
