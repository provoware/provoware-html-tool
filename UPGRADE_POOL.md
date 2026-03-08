# UPGRADE_POOL.md

## Offen

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-001 | Layout | Zentrale Größenlogik für Panels vereinheitlichen | Verhindert inkonsistente Skalierung | stabilere Darstellung bei Fensteränderung | offen | 001 |
| UP-008 | Responsive QA | Einen kleinen DOM-basierten Test für den mobilen Tools-Toggle ergänzen | CSS-Regeln sind vorhanden, aber ein Sichtbarkeits-Sanity-Check fehlt noch | Frühere Erkennung von Mobile-Regressionsfehlern | offen | 008 |
| UP-009 | Header UX | Header-Statuschips mit fester Max-Zeilenhöhe + kompakter Overflow-Anzeige ergänzen | Bei vielen Statuswerten kann der Header auf kleinen Breiten zu hoch werden | Stabilere Header-Höhe und klarere Priorisierung wichtiger Statuswerte | offen | 009 |
| UP-011 | Modul-Feedback | Im Modulstatus zusätzlich ein kurzes Feld `nextStep` ausgeben (z. B. Datei anlegen, JSON prüfen) | Fehler sind erkennbar, aber der nächste Schritt muss teils aus langem Text gelesen werden | Schnellere Selbsthilfe und weniger Rückfragen im Support | offen | 012 |
| UP-012 | Datenqualität | Kurzen Duplicate-Guard für `moduleIds` in Registry-Checks ergänzen (Hinweis bei mehrfachen IDs) | Doppelte IDs werden aktuell still bereinigt, aber nicht sichtbar gemacht | Klareres Datenfeedback vor späteren Modulkonflikten | offen | 013 |

**Passende Vorschläge:**
1. Min-/Max-Breiten je Hauptpanel definieren
2. Einheitliche Spacing-Tokens für Innen- und Außenabstände einführen

**Passende Vorschläge:**
1. Prüfen: Toggle-Schalter setzt `aria-expanded` auf `true/false`
2. Prüfen: die ersten zwei Tool-Aktionen bleiben immer sichtbar

**Passende Vorschläge:**
1. Erste 2 Status-Chips immer sichtbar halten, Rest hinter „+N“
2. Tooltip mit vollständiger Statusliste bei Hover/Fokus anzeigen

**Passende Vorschläge:**
1. `nextStep` pro Fehlerklasse als kurze feste Bausteine verwalten
2. UI-Hinweis bei mehreren Fehlern auf den wichtigsten nächsten Schritt begrenzen

**Passende Vorschläge:**
1. Duplicate-Hinweis als eigene Warnkategorie im Summary markieren
2. Optional: bereinigte ID-Liste als Debug-Hinweis im Developer-Modus ausgeben


## Erledigt

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-010 | Daten-Robustheit | Kleinen Schema-Guard für `data/module-registry.json` ergänzen (Version + `moduleIds` Typprüfung mit Hinweis) | Verhindert stille Fehlzustände bei manuell beschädigten Registry-Dateien | Schnellere Fehlerdiagnose und stabilerer Modulstart | erledigt | 013 |

**Passende Vorschläge:**
1. Bei ungültiger Registry auf letzte gültige Datei aus `backup/` zurückfallen
2. Hinweistext im UI mit direktem Pfad zur defekten Datei anzeigen

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

| UP-005 | Template-Archiv | Ein leichtes Schema-Validierungsfeld (`required_fields`) für Standard-Templates im Archiv ergänzen | Beschädigte oder unvollständige Einträge wurden zu spät sichtbar | Frühere Fehlererkennung und klare Reparaturhinweise beim Laden | erledigt | 006 |

**Passende Vorschläge:**
1. Beim Laden fehlende Felder direkt mit Standardwerten ergänzen und kurz protokollieren
2. Eine kleine UI-Hinweiszeile für „Archiv repariert“ im Vorlagenbereich ergänzen

| UP-006 | Toolstart | Eine kurze Start-Zusammenfassung im UI ergänzen (Ordnerstatus + nächster Klick) | Nutzer sehen aktuell viele Infos, aber keinen kompakten nächsten Schritt im Hauptbereich | Schnellere Orientierung direkt nach dem Start | erledigt | 007 |

**Passende Vorschläge:**
1. Bei erfolgreichem Start eine Zeile „Nächster Schritt: Modul wählen“ anzeigen
2. Bei fehlendem Ordner eine Zeile „Nächster Schritt: Ordner wählen“ im Hauptbereich fix platzieren

| UP-007 | Responsive UX | Für die rechte Werkzeugspalte eine einklappbare Mobil-Kurzansicht ergänzen | Auf kleinen Geräten sind viele Aktionsknöpfe unterhalb der Faltung schwer sichtbar | Schnellere Bedienung auf Smartphone und kleinen Laptops | erledigt | 008 |

**Passende Vorschläge:**
1. Mobile-Kurzansicht per „Mehr Tools“-Knopf ein-/ausblenden
2. Wichtigste zwei Aktionen im eingeklappten Zustand immer sichtbar lassen
