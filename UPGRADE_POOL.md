# UPGRADE_POOL.md

## Offen

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-019 | Fehlerführung UX | Start-Assistent um kontextabhängige Zweitoption („Alternative anzeigen“) bei blockierten Checks ergänzen | Ein klarer Primärknopf hilft, aber manche Fälle brauchen sofort einen alternativen Weg ohne Suche | Weniger Sackgassen bei Rechte- oder Strukturproblemen und schnellere Selbsthilfe für Laien | offen | 020 |
| UP-021 | Responsive QA | Visuelle Header-Snapshot-Prüfung für 1280px/980px/720px als kleinen Vergleichstest automatisieren | Der manuelle Blick erkennt Überlauf gut, aber Regressionen zwischen Iterationen bleiben ohne Referenzbilder schwer sichtbar | Früheres Erkennen von Layout-Brüchen bei minimalem Zusatzaufwand | offen | 022 |
| UP-024 | Layout UX | Plugin-Verwaltung optional zwischen rechter Seitenleiste und Footer umschaltbar machen | Die Footer-Lösung schafft Platz im 3x3-Grid, manche Workflows brauchen jedoch seitliche Sofortsicht | Flexible Position je Arbeitsstil ohne doppelte UI-Pflege | offen | 025 |
| UP-032 | Header UX | Header-Navigations-Feedback nach 3 Sekunden automatisch ausblenden | Die neue Rückmeldung hilft, bleibt aber dauerhaft sichtbar und kann den Statistikbereich unnötig belegen | Ruhigeres Dashboard bei weiter klarer Bestätigung nach Navigation | offen | 031 |
| UP-033 | Accessibility UX | Deaktivierte Buttons um kurzen Tooltip-Titel mit Grund ergänzen | Einheitliche Disabled-Optik ist klar, aber ohne Grund bleibt der nächste Schritt teilweise unklar | Weniger Fehlklicks und schnellere Selbsthilfe durch direkten Hinweis am Knopf | offen | 032 |
| UP-034 | Leerzustand UX | Leere Modul-Slots im Header-Monitoring auf Zeichenlimit prüfen und bei Überschreitung automatisch kürzen | Kürzere Texte wurden lokal verbessert, können aber bei späteren Änderungen wieder ausufern | Dauerhaft kompakte Leerzustände ohne manuelle Nacharbeit | offen | 033 |
| UP-040 | Sidebar UX | Rechten Sidebar-Schalter bei manuellem Einklappen mit kurzem Hinweis „Manuell“ kennzeichnen | Nach dem neuen Auto-Hinweis bleibt bei manuellem Zustand die Ursache ebenfalls nicht immer sofort klar | Eindeutigere Statussprache zwischen Auto- und Nutzeraktion ohne Layoutumbau | offen | 039 |

**Passende Vorschläge (UP-019):**
1. Bei gesperrter Schreibfreigabe direkt die passende Alternative (nur lesen) als Zweitknopf anbieten
2. Bei wiederholtem Fehlschlag kurz „Was kann ich jetzt tun?“ mit 2 Klickwegen einblenden

**Passende Vorschläge (UP-021):**
1. Referenzbilder pro Breakpoint im CI-Artefakt als optionalen Check speichern
2. Bei größerem Pixel-Delta nur den betroffenen Header-Bereich markieren

**Passende Vorschläge (UP-024):**
1. Pro Layoutbereich einen kleinen „Position merken“-Schalter ergänzen
2. Im Hilfehinweis kurz erklären, wann Footer- oder Sidebar-Modus sinnvoller ist

**Passende Vorschläge (UP-032):**
1. Nur Erfolgsmeldungen automatisch ausblenden, Warnungen sichtbar lassen
2. Die Ausblenddauer als kleinen Konfigwert in `data/app-config.json` hinterlegen

**Passende Vorschläge (UP-033):**
1. Tooltip nur für deaktivierte Schaltflächen mit vorhandener Grundmeldung setzen
2. Zusätzlich im Statusbereich denselben Grundtext einmal als Klartext ausgeben

**Passende Vorschläge (UP-034):**
1. Zeichenlimit als kleine Konstante nahe am Slot-Renderer halten (z. B. 70 Zeichen)
2. Bei Kürzung ein Ellipsis nutzen und den Volltext als `title` setzen

**Passende Vorschläge (UP-040):**
1. Nur dann „(Manuell)" zeigen, wenn `sidebar-right-collapsed` aktiv und `sidebar-right-auto-collapsed` inaktiv ist
2. Textlogik in derselben Sync-Funktion halten, damit kein Label-Drift entsteht

## Erledigt

| ID | Bereich | Empfehlung | Grund | Erwarteter Effekt | Status | Iteration |
|---|---|---|---|---|---|---|
| UP-039 | Sidebar UX | Header-Schalter bei aktivem Auto-Collapse rechts temporär als „Auto“ markieren | Nutzer sehen sonst nicht direkt, warum die rechte Leiste eingeklappt ist | Klareres Verhalten auf kleinen Breiten ohne zusätzliche Klickwege | erledigt | 039 |

**Passende Vorschläge:**
1. `toggle-right-sidebar` bei Auto-Collapse mit kurzem Zusatztext „(Auto)" versehen
2. Zusatz nur zeigen, solange `.has-maximized-panel` und Breite <1100px aktiv sind

| UP-038 | Layout Robustheit | Rechtsleiste bei <1100px automatisch einklappen, wenn ein Modul maximiert ist | Trotz Breiten-Guard kann bei engen Ansichten die aktive Arbeitsfläche unnötig gedrängt werden | Mehr Platz für aktive Module ohne manuellen Umschaltaufwand | erledigt | 038 |

**Passende Vorschläge:**
1. Nur im Zustand `.has-maximized-panel` automatisch einklappen, sonst unverändert lassen
2. Beim Einklappen eine kurze Rückmeldung „Rechtsleiste temporär minimiert“ im Header anzeigen

| UP-037 | Sidebar UX | Linke Modulleiste bei <=980px optional einklappbar machen (nur Titelzeile sichtbar) | Der 1-Spalten-Modus hilft bereits, auf sehr kleinen Breiten bleibt der vertikale Platz dennoch schnell knapp | Mehr nutzbare Höhe für Inhalte bei weiterhin schneller Rückkehr zur Modulliste | erledigt | 038 |

**Passende Vorschläge:**
1. Im eingeklappten Zustand nur ein klarer „Module anzeigen“-Knopf sichtbar lassen
2. Einklappstatus je Sitzung im UI-State merken, ohne neue Persistenzdatei

| UP-036 | Visual Calm | Panel-Overlay bei kleinen Breiten weiter drosseln (Breakpoint-abhängig), falls Textkontrast sinkt | Nach reduzierten Hintergrundmustern bleibt das Innen-Overlay als möglicher Reststörer in dichten Ansichten sichtbar | Noch ruhigere Lesbarkeit ohne komplettes Redesign | erledigt | 036 |

**Passende Vorschläge:**
1. Overlay-Intensität nur für `max-width: 980px` reduzieren, Desktop unverändert lassen
2. Bei Bedarf nur Header-/Sidebar-Panels ausnehmen statt global alle Panels

| UP-035 | Sidebar UX | Linke Modulleiste bei sehr schmalen Breiten mit optionalem 1-Spalten-Modus für Modulbuttons absichern | Durch breitere Leiste steigt die Lesbarkeit, bei engen Fenstern kann das 2-Spalten-Raster aber wieder drücken | Stabilere Bedienung auf kleinen Breiten ohne harte Umbauten | erledigt | 035 |

**Passende Vorschläge:**
1. Unterhalb eines festen Breakpoints (`<= 980px`) automatisch auf eine Modulbutton-Spalte wechseln
2. Einen kleinen Hinweis „Kompaktmodus aktiv“ in der linken Leiste anzeigen

| UP-031 | Dashboard UX | 7-Tage-Trend mit Mini-Hinweistext (Vergleich zur Vorwoche) ergänzen | Der neue Trendwert ist kompakt, aber die Vergleichsbasis ist ohne Hint nicht für alle sofort klar | Weniger Rückfragen und schnellere Einordnung der Trendzahl direkt im Header | erledigt | 031 |

**Passende Vorschläge:**
1. Hint nur bei Hover/Fokus anzeigen, damit die Karte kompakt bleibt
2. Bei fehlenden Vorwochenwerten im Hint klar „Vergleich nicht verfügbar“ schreiben

| UP-030 | Layout Robustheit | Sichtbarkeits-Guard für Header-Karten ergänzen (Mindestzeilen + Overflow-Warnhinweis bei Clipping-Risiko) | Nach mehreren Header-Erweiterungen steigt die Gefahr von verdeckten Inhalten bei knapper Höhe | Frühere Erkennung von Abschneidungen und stabilere Lesbarkeit über Breakpoints hinweg | erledigt | 031 |

**Passende Vorschläge:**
1. Bei erkannter Überlänge in einer Header-Karte automatisch auf 2-Spalten-Layout wechseln
2. Eine kleine Debug-Markierung für betroffene Karte nur im Entwicklermodus anzeigen

| UP-029 | Header UX | Header-Kachel-Navigation um kleine Ziel-Rückmeldung ("Bereich geöffnet") ergänzen | Navigation ist jetzt vorhanden, aber ohne direkte Bestätigung kann der Sprung bei langen Seiten unklar wirken | Klareres Feedback nach Klick/Enter ohne zusätzliche Dialoge | erledigt | 031 |

**Passende Vorschläge:**
1. Rückmeldung nur 2-3 Sekunden als unaufdringliche Statuszeile anzeigen
2. Fokus nach Sprung auf die Zielüberschrift setzen, nicht auf den ersten Eingabewert

| UP-027 | Grid UX | Leere Modul-Slots mit optionalem Direktknopf „Projektstruktur anlegen“ ergänzen | Der neue Hinweistext hilft, aber ein direkter Klickweg reduziert Reibung weiter | Schnellere Aktivierung freier Panels ohne Suchaufwand | erledigt | 031 |

**Passende Vorschläge:**
1. Direktknopf nur in leeren Slots zeigen, damit belegte Module ruhig bleiben
2. Nach erfolgreichem Struktur-Anlegen kurze Rückmeldung im Slot anzeigen

| UP-026 | Account-Archiv UX | Schnellkopierleiste für E-Mail, URL und Benutzername im Detaildialog ergänzen | Wiederkehrende Accountdaten sollen ohne Umwege nutzbar sein | Schnellerer Alltagsworkflow mit weniger Klicks beim Wechsel zwischen Tools | erledigt | 031 |

**Passende Vorschläge:**
1. Kopier-Buttons nur zeigen, wenn Feldwert vorhanden ist
2. Nach Klick eine kurze „Kopiert“-Rückmeldung direkt im Dialog anzeigen

| UP-025 | Header UX | Selbsttest-Ampel im Header um klickbare Detailhilfe („Warum gelb/rot?“) erweitern | Farbstatus und Legende sind vorhanden, aber Rückfragen zur Ursache entstehen weiterhin ohne direkten Kontextsprung | Schnellere Fehlerklärung direkt aus dem Header ohne Wechsel in andere Bereiche | erledigt | 031 |

**Passende Vorschläge:**
1. Klick auf die Ampel öffnet automatisch den passenden Selbsttest-Abschnitt rechts
2. Bei „rot“ zusätzlich den wichtigsten fehlgeschlagenen Check als Einzeiler anzeigen

| UP-020 | Dashboard UX | Header-Statistiken um kleine Trendwerte (letzte 7 Tage) erweitern | Aktuelle Zahlen zeigen nur Momentaufnahme; Richtung der Entwicklung bleibt unsichtbar | Schnellere Priorisierung von Problemen direkt im Dashboard | erledigt | 030 |

**Passende Vorschläge:**
1. Trendwert bei sehr vielen Events zusätzlich farblich markieren (nur dezent)
2. Optionalen Tooltip mit kurzer Formel (7 Tage vs. 7 Tage davor) anbieten

| UP-023 | Layout Robustheit | Budgetwarnung um kleine Toleranzgrenze (z. B. +0,5%) und Debounce-Messung erweitern | Einzelne Reflow-Spitzen beim Resize können kurzzeitige Fehlwarnungen erzeugen | Ruhigere, präzisere Regressionswarnungen ohne zusätzlichen Bedienaufwand | erledigt | 025 |

**Passende Vorschläge:**
1. Warnhinweis erst nach zwei aufeinanderfolgenden Überschreitungen anzeigen
2. Toleranzwert als kleinen Konfigwert in `data/app-config.json` ablegen

| UP-022 | Layout Governance | Layout-Budgets (Header 15%, Footer 10%, Sidebars je 8%) als feste Konfig-Vorgabe beim Start einblenden | Flächenziele sind jetzt umgesetzt, aber ohne sichtbare Governance könnten spätere Patches sie unbemerkt aufweichen | Stabilere, nachvollziehbare Einfenster-Standards über mehrere Iterationen hinweg | erledigt | 025 |

**Passende Vorschläge:**
1. Layout-Budget-Werte im Header als kleine Infozeile mit aktuellem Modus zeigen
2. Bei Budget-Verletzung in Debug-Ansicht eine kurze Warnung ausgeben

| UP-018 | Layout UX | Panel-Proportionen um feine manuelle Prozent-Schieberegler ergänzen | Presets sind schnell, aber manche Nutzer brauchen exaktere Breiten für ihren Workflow | Höhere Layout-Flexibilität bei weiter klarer Bedienung | erledigt | 025 |

**Passende Vorschläge:**
1. Prozentwerte je Preset im Tooltip sichtbar machen
2. Bei sehr kleinen Viewports automatisch auf „Ausgewogen“ zurückfallen

| UP-017 | Modul-Feedback | Nach „Datei anlegen“ optional ein kurzes Vorlagenmenü je Dateityp anbieten (manifest/config/schema/logic) | Die Datei wird jetzt direkt erzeugt, bleibt aber inhaltlich noch leer und braucht oft denselben Starter-Inhalt | Schnellere Erstbefüllung mit weniger Tippfehlern in Standarddateien | erledigt | 019 |

**Passende Vorschläge:**
1. Für `manifest.json` und `config.json` zuerst starten, danach auf weitere Dateitypen ausweiten
2. Vorlagen nur bei neu angelegten Dateien zeigen, nicht bei bestehenden

| UP-013 | Songtext UX | Splitter-Breiten mit gespeicherten Panel-Proportionen ergänzen (links/mitte/rechts) | Drei-Fenster-Editor braucht stabile, wiederherstellbare Arbeitsbreiten pro Nutzer | Schnellere Wiederaufnahme des Workflows und weniger manuelles Nachjustieren | erledigt | 019 |

**Passende Vorschläge:**
1. Pro Panel eine Mindest- und Maximalbreite im Manifest hinterlegen
2. Letzte Panel-Breiten in einer kleinen User-Preference-Datei speichern

| UP-016 | Modul-Feedback | Fehlende Datei aus `nextStep` als „Datei anlegen“-Aktion direkt neben „Datei öffnen“ anbieten | Der Pfad ist jetzt direkt öffnbar, bei nicht vorhandener Datei fehlte der direkte Folgeschritt | Kürzere Fehlerbehebung auch bei noch nicht angelegten Moduldateien | erledigt | 018 |

**Passende Vorschläge:**
1. Nur für bekannte JSON-/JS-Dateitypen aktivieren
2. Nach erfolgreichem Anlegen Datei direkt im Editor öffnen

| UP-015 | Modul-Feedback | Bei Modulstatus-Fehlern den direkten Dateipfad (z. B. `modules/<id>/manifest.json`) klickbar anzeigen | nextStep ist jetzt klarer, aber der Zielort muss noch schneller erreichbar sein | Weniger Suchzeit bei Fehlerbehebung und kürzere Support-Schleifen | erledigt | 017 |

**Passende Vorschläge:**
1. Pfad aus `nextStep` automatisch als „Datei öffnen“-Aktion anbieten
2. Bei fehlender Datei einen „Neu anlegen“-CTA direkt daneben anzeigen

| UP-008 | Responsive QA | Einen kleinen DOM-basierten Test für den mobilen Tools-Toggle ergänzen | CSS-Regeln sind vorhanden, aber ein Sichtbarkeits-Sanity-Check fehlt noch | Frühere Erkennung von Mobile-Regressionsfehlern | erledigt | 017 |

**Passende Vorschläge:**
1. Prüfen: Toggle-Schalter setzt `aria-expanded` auf `true/false`
2. Separater Check: Erste 2 Tool-Aktionen bleiben als Kernaktionen sichtbar

| UP-001 | Layout | Zentrale Größenlogik für Panels vereinheitlichen | Verhindert inkonsistente Skalierung | stabilere Darstellung bei Fensteränderung | erledigt | 017 |

**Passende Vorschläge:**
1. Min-/Max-Breiten je Hauptpanel definieren
2. Einheitliche Spacing-Tokens für Innen- und Außenabstände einführen

| UP-014 | Modul-Feedback | Modulstatus-Summary um eine kurze Warnungszählung ergänzen (z. B. „1 Warnung, 2 Fehler“) | Aktuell stehen Warnhinweise nur im Fließtext und sind schwerer scannbar | Schnellere Erfassung kritischer Punkte im Startstatus | erledigt | 016 |

**Passende Vorschläge:**
1. Warnungen nach Priorität (hoch/mittel) farblich markieren
2. Bei nur Warnungen den primären CTA auf „Jetzt prüfen“ setzen

| UP-011 | Modul-Feedback | Im Modulstatus zusätzlich ein kurzes Feld `nextStep` ausgeben (z. B. Datei anlegen, JSON prüfen) | Fehler sind erkennbar, aber der nächste Schritt muss teils aus langem Text gelesen werden | Schnellere Selbsthilfe und weniger Rückfragen im Support | erledigt | 016 |

**Passende Vorschläge:**
1. `nextStep` pro Fehlerklasse als kurze feste Bausteine verwalten
2. UI-Hinweis bei mehreren Fehlern auf den wichtigsten nächsten Schritt begrenzen

| UP-009 | Header UX | Header-Statuschips mit fester Max-Zeilenhöhe + kompakter Overflow-Anzeige ergänzen | Bei vielen Statuswerten kann der Header auf kleinen Breiten zu hoch werden | Stabilere Header-Höhe und klarere Priorisierung wichtiger Statuswerte | erledigt | 016 |

**Passende Vorschläge:**
1. Erste 2 Status-Chips immer sichtbar halten, Rest hinter „+N“
2. Tooltip mit vollständiger Statusliste bei Hover/Fokus anzeigen

| UP-012 | Datenqualität | Kurzen Duplicate-Guard für `moduleIds` in Registry-Checks ergänzen (Hinweis bei mehrfachen IDs) | Doppelte IDs werden aktuell still bereinigt, aber nicht sichtbar gemacht | Klareres Datenfeedback vor späteren Modulkonflikten | erledigt | 015 |

**Passende Vorschläge:**
1. Duplicate-Hinweis als eigene Warnkategorie im Summary markieren
2. Optional: bereinigte ID-Liste als Debug-Hinweis im Developer-Modus ausgeben

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
