## Neu in Iteration 93

- **Boot + Debug:** Die Boot-Live-Ansage wird jetzt auch als Debug-Text mitgeschrieben.
- **Support-Verlauf:** Bei langen Detailtexten wird automatisch ein kuerzerer Tastatur-Hinweis gezeigt.
- **Versionsvergleich:** Der Detailmodus nennt jetzt den zuletzt geoeffneten Zustand (geoeffnet/eingeklappt).

## Neu in Iteration 92

- **Support-Verlauf:** Jeder Treffer zeigt einen kurzen Tastatur-Hinweis (Tab/Enter/Escape).
- **Versionsvergleich:** Der Detailmodus bleibt ruhig und startet standardmaessig eingeklappt.
- **Naechster Schritt bei Fehlern:** Immer zuerst _Erneut versuchen_, dann _Reparatur starten_, dann _Protokoll oeffnen_.

## Neu in Iteration 86

- **Safe-Mode zuruecksetzen:** Im Hilfe-Panel gibt es den Knopf **Safe-Mode zuruecksetzen**.
  Er fragt vorher nach und setzt dann das Plugin-Manifest auf den Standard.
- **Versionsvergleich vor Restore:** Im Backup-Dialog zeigt das Tool vor dem Restore einen kurzen Vergleich an.
  Sie sehen sofort, ob die gewaehlte Version mehr/weniger Felder hat und groesser/kleiner ist.
- **Boot-Fokus:** Wenn das Boot-Gate freigegeben ist, springt der Fokus automatisch auf das erste Modul.

## Kurz-Hilfe Iteration 75

- Lesemodus schliessen: Beim Schliessen zeigt das Tool jetzt Enter + Alt+T/Alt+I als direkte Tastaturhilfe.
- Start-Routine: Lies am Ende den "Shortcut-Abschlussbericht". Dort stehen Konflikte gesammelt mit naechstem Schritt.

## Neu in Iteration 73: sichtbare Shortcut-Hilfe und Konfliktcheck

- Im Lesemodus zeigt die Statuszeile jetzt immer **Alt+T** (Titel) und **Alt+I** (Inhalt) als direkte Tastaturhilfe.
- Die Start-Routine meldet jetzt automatisch moegliche Shortcut-Konflikte je Betriebssystem.
- Naechster Schritt: Bei einem Hinweis erst Shortcut pruefen, dann Protokoll oeffnen.

## Songtext: Profil-Status und Fokushilfe (Iteration 71)

- Das Feld **Aktives Profil** zeigt immer das gewaehlte Zufallsprofil (z. B. Standard oder Techno).
- Beim Oeffnen vom **Lesemodus** sehen Sie direkt das aktuelle Fokusziel (Titel oder Inhalt).
- Naechster Schritt: Mit Enter im Fokusziel-Feld bestaetigen oder mit T/I schnell wechseln.

## Neu: Songtext-Praeferenzen

- Das letzte Zufallsprofil wird jetzt im Projekt gespeichert und beim Start wieder geladen.
- Im Lyrics-Bereich koennen Sie mit **T** (Titel) und **I** (Inhalt) das Fokusziel fuer das Schliessen der Vorschau direkt umstellen.
- Rueckweg: Fokusziel jederzeit wieder ueber die Auswahlliste im Lesemodus aendern.

## Neu: Schnellspeicher (kurz und klar)

- Was ist neu? Im Dashboard gibt es jetzt ein Panel **Schnellspeicher**.
- So nutzen: Titel + Inhalt ausfuellen, dann **Notiz speichern** klicken.
- Rueckweg: Mit **Eingabe leeren** alles zuruecksetzen und neu starten.

# Hilfe

- Neu: **Songtext-Editor im Bereich Songideen** mit Intro/Refrain-Vorlagen.
- Enter aktiviert die Vorlagen-Knoepfe, Escape springt direkt als Rueckweg zu **Allgemein**.
- Daten liegen jetzt getrennt in `data/quick_store_inbox.json`,
  `data/quick_store_lyrics.json` und `data/quick_store_research.json`.

## Hilfe-Panel

- **Was macht das?** Das Panel zeigt Systemtest und Log-Hinweise.
- **Was passiert mit den Daten?** Beim Systemtest werden nur Logs in `logs/` geschrieben.
- **Wie mache ich rückgängig?** Mit `node tools/help_cli.js backups` und `repair` können alte Backups wiederhergestellt werden.

## Dashboard

- **Was macht das?** Das Dashboard zeigt jetzt ein klares 3-Spalten-Layout mit Navigation, Kalender, Modulen und Schnellbereichen.
- **Autostart:** Am Ende von `bash start.sh` wird das Dashboard automatisch gestartet (wenn Grafikmodus verfuegbar ist).
- **Was passiert mit den Daten?** Der gewählte Projektordner wird als Handle in IndexedDB gespeichert und beim Neustart erneut verbunden.
- **Wie mache ich rückgängig?** Sie können die Reihenfolge sofort per Pfeil-Buttons oder Drag&Drop wieder ändern und das Theme jederzeit zurück auf Hell setzen.
- **Fachwort kurz erklärt:** _Auto-Reconnect_ bedeutet automatische Wiederverbindung beim nächsten Start.
- **Barrierefreiheit:** Fokus ist sichtbar, Buttons sind groß (mindestens 44px) und es gibt 5 Themes: Hell, Dunkel, Kontrast+, Rötlich und Camouflage.
- **Escape als Rueckweg (neu):** Mit Escape schliessen Sie die offene Debug-Ansicht schnell per Tastatur.
- **Modulflaeche:** Der Hauptbereich startet leer. Aktivierte Module erscheinen als gleichgroße Raster-Karten in Auswahl-Reihenfolge und haben Knöpfe für Maximieren, Minimieren und Ausblenden.
- **Kompakt-Modus:** Beispieltexte wurden entfernt. Leere Bereiche bleiben sichtbar frei und sind für echte Inhalte reserviert.
- **Texte zentral:** Kurztexte liegen versioniert in `config/messages_de.json` unter `dashboardCompact`.

- **Geführte Hilfe (neu):** Im Dashboard gibt es jetzt eine eigene Schrittliste mit klarer Reihenfolge für Einsteiger. Neu dabei: Enter startet Aktionen, Escape ist der schnelle Rueckweg.
- **Feste Hilfe-Knöpfe (neu):** Rechts im Hilfebereich stehen immer dieselben 3 Aktionen bereit: „Erneut versuchen“, „Reparatur starten“, „Protokoll öffnen“.
- **Nächster Schritt / Laien-Tipp (neu):** In der Topbar können Sie sich den nächsten sinnvollen Schritt oder einen einfachen Bedienhinweis direkt anzeigen lassen.
- **Boot-Status (neu):** Vier Phasen zeigen den Start mit Ampel und Text (Gruen/Gelb/Rot). Rueckweg: Bei Rot zuerst "Erneut versuchen", dann "Reparatur starten".

## Plugin-Loader

- **Was macht das?** Der Plugin-Loader prueft vor dem Systemtest, ob aktive Plugins vorhanden und startbar sind.
- **Was passiert mit den Daten?** Es werden nur Manifest- und Moduldateien gelesen, keine Daten werden geschrieben.
- **Wie mache ich rueckgaengig?** Setzen Sie das Plugin im Manifest auf `"enabled": false` und starten Sie `bash start.sh` erneut.
- **Fachwort kurz erklaert:** _Health-Check_ bedeutet kurzer Funktions-Test vor dem echten Start.

## Dashboard-Mockup

- **Was macht das?** `templates/dashboard_mockup.html` zeigt die aktuelle Logik (9 Start-Schritte, Theme-Auswahl, Zonen) als schnelle Vorschau.
- **Was passiert mit den Daten?** Es ist eine reine Mockup-Ansicht, es werden keine Projektdateien geschrieben.
- **Wie mache ich rückgängig?** Einfach Fenster schließen, dann bleibt Ihr Projekt unverändert.
- **Fachwort kurz erklärt:** _Mockup_ bedeutet eine frühe Vorschau der Oberfläche vor weiterem Ausbau.

## Start-Routine (neu verbessert)

- **Was macht das?** `bash start.sh` erstellt fehlende Datenordner automatisch und startet danach Pruefung, Formatierung, Tests und Systemtest.
- **Was passiert mit den Daten?** Es werden nur benoetigte Arbeitsordner erstellt (`data/`, `data/logs/`) und Logeintraege geschrieben.
- **Wie mache ich rueckgaengig?** Ueberfluessige Logdateien koennen geloescht werden; der Code bleibt unveraendert.
- **Abhaengigkeiten automatisch (neu):** Wenn `package-lock.json` geaendert ist, installiert die Start-Routine Pakete automatisch neu.
- **Naechster Schritt bei Paketfehlern:** Erst erneut versuchen, dann Protokoll oeffnen (`data/logs/start_routine.log`), danach Reparatur starten.
- **Naechster Schritt bei Fehlern:** Erst `START_DEBUG=1 bash start.sh` ausfuehren, danach `data/logs/start_routine.log` oeffnen und die erste Fehlermeldung direkt pruefen.

## Genres/Moods/Stile-Archiv (neu)

- Komma-Eingaben werden einzeln gespeichert, z. B. `Techno, Chill, Hoerspiel`.
- Favorit markieren: Sternchen nutzen, z. B. `*Techno*`.
- Bei Fehlern: erst erneut versuchen, dann Protokoll oeffnen, danach Reparatur starten.

## Sehschwache: schneller 3-Punkte-Check (neu)

1. Theme direkt auf **Kontrast+** stellen.
2. Wenn Farben zu hart sind: **Rötlich** oder **Camouflage** testen.
3. Immer mit Tastatur pruefen: Tab, Enter, Escape.

Naechster Schritt bei Unsicherheit: **Protokoll oeffnen**, dann **Erneut versuchen**.

## Kontrast-Auto-Check je Theme (neu)

- Die Start-Routine prueft jetzt den Kontrast (Farbabstand) automatisch fuer alle 5 Themes.
- Geprueft werden Haupttext und Topbar. Zielwert ist mindestens **4.5** (WCAG AA).
- Bei Fehlern bekommen Sie klare naechste Schritte: **Erneut versuchen**, **Reparatur starten**, **Protokoll oeffnen**.

## Aufgaben-Filter (neu)

- Was macht das? Der Filter zeigt Aufgaben fuer Kalendertag, Heute, Offen oder Archiv.
- Was passiert mit Daten? Es wird nur angezeigt, nichts wird dabei geloescht.
- Rueckweg: Mit Escape springt der Filter zurueck auf Kalendertag.

## Storage-Recovery (neu)

Wenn eine JSON-Datei kaputt ist, kann die letzte gueltige Version wiederhergestellt werden.
Naechster Schritt: Erst erneut versuchen, dann Reparatur starten, danach bei Bedarf Protokoll oeffnen.

## Wiki-Modul (neu)

- Was macht das? Speichert kurze Wissensnotizen pro Kategorie.
- Was passiert mit Daten? Eintraege landen in `data/wiki_notes.json`.
- Rueckweg: Eintrag aendern und erneut auf "Wiki speichern" klicken.

## Songtext-Editor: neue Vorlagen + Lesemodus (Iteration 63)

- Neu: Im Bereich **Songideen** gibt es jetzt auch **Bridge** und **Sonstiges** als Vorlagen.
- Neu: Mit **Lesemodus oeffnen** sehen Sie den aktuellen Songtext sauber formatiert mit Zeilenanzahl.
- Rueckweg: Weiter unten im gleichen Bereich direkt weiter bearbeiten oder Inhalt leeren.

## Songtext-Editor: Rueckweg + Inline-Hilfe (Iteration 64)

- Neu: Im Lesemodus gibt es jetzt den Knopf **Vorschau schliessen (Escape)** als klaren Rueckweg.
- Neu: Unter den Vorlagen sehen Sie eine kurze Inline-Hilfe, was Intro, Refrain, Bridge und Sonstiges bedeuten.
- Naechster Schritt: Lesemodus um Kopieren-Knopf erweitern.

## Neu: Einheitliches Design fuer alle Plugins (2026-03-03)

Was macht das?
Alle Plugins nutzen jetzt ein gemeinsames UI-Token-Set fuer Abstand, Schrift, Schatten und Button-Hoehen.

Was passiert mit den Daten?
Es werden nur Designwerte gelesen, keine Projektdaten geaendert.

Wie mache ich rueckgaengig?
Alte Werte in `config/ui_design_tokens.json` wieder eintragen und `bash start.sh` erneut starten.

## Theme-Kontrast (Iteration 66)

- Was macht das? Rail-Rahmen, Statusbanner und Kartenfarben bleiben in allen 5 Themes gut lesbar.
- Was passiert mit Daten? Es werden nur Design-Tokens geaendert, keine Nutzdaten.
- Wie mache ich rueckgaengig? Im Theme-Feld auf ein anderes Thema wechseln oder CSS-Token zurücksetzen.

- Neu: Im Lesemodus gibt es jetzt den Knopf **Songtext kopieren** mit klarer Erfolgsmeldung.
- Neu: Der Kopieren-Knopf zeigt jetzt direkt **Enter/Space** als Tastaturweg, damit die Aktion ohne Maus klar ist.
- Neu: Der Kurzguide hat jetzt den Schritt **Speichern + Rueckweg**, damit Ihr Entwurf sicher bleibt.
- Neu: Die Songtext-Hilfe ist als **einklappbarer Kurzguide** direkt im Lyrics-Bereich verfuegbar und setzt den Tastaturfokus auf den Hilfetext.

- Songtext-Lesemodus: Wenn der Kopieren-Knopf fehlschlaegt, erscheint eine sichtbare Kopierhilfe mit Strg+C/Cmd+C als Rueckweg.

## Songtext-Editor: Zufallsprofil + Fokusziel (Iteration 69)

- Neu: Der Zufallsinhalt hat jetzt eine Profilwahl (Standard, Techno, Hoerspiel, Chill).
- Neu: Nach dem Schliessen der Vorschau koennen Sie das Fokusziel waehlen (Titel oder Inhalt).
- Rueckweg: Bei Fehlern zuerst erneut versuchen, dann Reparatur starten, danach Protokoll oeffnen.

## Neu in Iteration 72: sichere Songtext-Shortcuts

- Das Fokusziel im Lesemodus nutzt jetzt **Alt+T** (Titel) und **Alt+I** (Inhalt).
- Warum so? So werden normale Texteingaben nicht aus Versehen als Shortcut erkannt.
- Der Profil-Chip zeigt jetzt auch die **letzte Nutzung** als Zeitstempel.

## Modul-Control-Leiste (Iteration 76)

- Neu: Die drei Steuerknoepfe haben jetzt kurze, einheitliche Tooltips mit Rueckweg.
- Beispiel: "Groesser anzeigen. Rueckweg: Gleichen Knopf erneut druecken."
- Vorteil: Aktionen sind fuer Laien schneller verstaendlich und auch mit Screenreader klarer.

## Neu: Favoritenleiste und Moduloptionen

- **Favoritenleiste oeffnen:** Klicken Sie auf **"Favoritenleiste einblenden"** oder druecken Sie **Alt+F**.
- **Rueckweg:** Nutzen Sie den gleichen Knopf oder erneut **Alt+F**.
- **Moduloptionen unten:** Klicken Sie ein Modul im Raster an. Unten sehen Sie dann passende Aktionen mit kurzem Hilfe-Text.

## Neu in Iteration 82

- Favoriten-Schnellaktionen:
  - **Letztes Modul oeffnen**: Springt zum zuletzt genutzten Modul.
  - **Alle Module anzeigen**: Zeigt aktive Module als Klartext im Status.
  - **Fokus-Hilfe zeigen**: Erklaert den Rueckweg mit Escape.
- Moduloptionen unten: Je Modul stehen jetzt zwei direkte Aktionen bereit (z. B. Planung anzeigen, Leads anzeigen).
- Bei Start-Fehlern in TODO-Vorlagen wird die betroffene Zeile direkt angezeigt.

## Safe-Mode bei Plugin-Fehlern

- Was passiert? Wenn das Plugin-Manifest kaputt ist, kann ein Safe-Mode (Notfallmodus) mit leerer Plugin-Liste geschrieben werden.
- Warum hilft das? Der Core startet wieder, obwohl Plugins defekt sind.
- Rueckweg: Danach Plugins einzeln wieder aktivieren und erneut pruefen.

## Safe-Mode-Status im Hilfe-Panel

- Was macht das? Der rechte Hilfe-Bereich zeigt jetzt klar, ob Safe-Mode aktiv ist.
- Was passiert mit Daten? Es wird nur Status gelesen, keine Datei wird dabei geschrieben.
- Rueckgaengig? Sie koennen normal weiterarbeiten oder Reparatur starten und danach erneut pruefen.

## Version im Restore-Dialog

- Was macht das? Sie koennen statt Backup-Datei auch eine gespeicherte Version direkt zur Ziel-Datei wiederherstellen.
- Was passiert mit Daten? Die gewaehlt Version ersetzt die Ziel-Datei; vorherige Datei kann weiter als Backup vorliegen.
- Rueckgaengig? Sie koennen sofort erneut eine andere Version oder ein Backup wiederherstellen.

## Neu: Safe-Mode-Verlauf und klarer Versionsvergleich

- Wenn Sie Safe-Mode-Reset klicken, wird ein Support-Eintrag gespeichert (`data/backup_events.json`).
- Im Restore-Dialog sehen Sie jetzt immer drei Unterschiede: Felder, Dateigroesse und Zeit.
- Naechster Schritt bei Fehlern: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.

## Neu in Iteration 88

- **Boot-Fokusziel:** Im Boot-Bereich kann gewaehlt werden, ob nach "Weiter" zuerst das erste Modul oder das Hilfe-Panel Fokus bekommt.
- **Support-Verlauf:** Im Hilfe-Panel kann nach "Alle Ereignisse" oder "Nur Safe-Mode" gefiltert werden.
- **Versions-Detailmodus:** Im Restore-Dialog kann ein aufklappbarer Detailtext mit JSON-Schluesseln gelesen werden.

## Neu: Fokusziel + Support-Suche + Detailgruppen

- Boot-Gate-Hinweis nennt jetzt immer das geplante Fokusziel (`Modul` oder `Hilfe`).
- Support-Verlauf: Sie koennen jetzt per Freitext nach Typ, Datum oder Detail suchen.
- Filterregel ist einfach: Dropdown + Suchtext arbeiten als UND-Regel.
- Versionsvergleich im Backup-Dialog zeigt Detailgruppen: `Neu`, `Entfernt`, `Gleich`.

## Neu: Boot-Live-Ansage und Support-Trefferzahl

- Boot-Fokusziel wird jetzt doppelt gezeigt: im Gate-Hinweis und als kurze Live-Ansage (aria-live) fuer Screenreader.
- Im Support-Verlauf zeigt ein Zusatztext die aktuelle Trefferzahl.
- Tipp: Im Suchfeld einfach `Enter` druecken, dann wird der Filter sofort ausgefuehrt.
- Wenn kein Treffer da ist: Filter wechseln oder Suchtext vereinfachen und erneut versuchen.

## Neu in Iteration 94

- Support-Verlauf markiert Suchwoerter jetzt als Textmarkierung (`<mark>` mit Rahmen), damit Treffer klar sichtbar sind und nicht nur ueber Farbe laufen.
- Der letzte Boot-Debugtext wird zusaetzlich als Verlaufseintrag `boot-debug` gezeigt.
- Der Backup-Detailmodus merkt sich den letzten Zustand pro Projekt (`backupDetailOpen`).

## Update 2026-03-01 – Ruhigeres Hilfe-Panel

- Im Support-Verlauf gibt es jetzt den Schalter **"Boot-Debug im Verlauf zeigen"**.
- Empfehlung fuer Einsteiger: Schalter deaktivieren, dann bleibt die Liste kuerzer.
- Rueckweg: Schalter wieder aktivieren.
- Die Suchmarkierung arbeitet jetzt mit ganzen Woertern. Beispiel: Suche nach `safe` markiert `safe-mode`, aber nicht mitten in langen Fremdwoertern.

## Update 2026-03-01 – Suchmodus klarer und ruhiger

- Neuer Schalter: **"Footer-Hinweis kurz anzeigen"**. Damit wird der Rueckweg-Text kuerzer, wenn Sie weniger Lesetext wollen.
- Teilwortsuche hat jetzt eine Mindestlaenge von 3 Zeichen. Kurze Suchteile werden ignoriert, damit weniger Rauschen entsteht.
- Jede Trefferzeile zeigt jetzt ein Badge mit dem aktiven Suchmodus (`Suchmodus: Ganzwort` oder `Suchmodus: Teilwort`).
- Rueckweg bei unerwarteten Treffern: Suchmodus wechseln, Suchtext pruefen und erneut versuchen.
