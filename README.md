# Provoware HTML Tool

## Kurzüberblick
Provoware HTML Tool wird als neue Linux-Desktop-Anwendung mit Python, PySide6 und Qt Widgets neu aufgebaut. Die Oberfläche soll ruhig, verständlich und robust sein, damit Projekte, Module, Presets, Texte und Arbeitsstände ohne Umwege gepflegt werden können.

## Ziel des Tools
- Projekte und Arbeitsstände klar verwalten
- Module und Presets geordnet bereitstellen
- Daten robust speichern und sicher wiederherstellen
- Die Anwendung später klein und nachvollziehbar erweitern

## Zielgruppe
- Menschen ohne Technikschwerpunkt, die eine verständliche Oberfläche brauchen
- Einzelanwenderinnen und Einzelanwender mit mehreren Projekten
- Wartende Entwicklerinnen und Entwickler, die kleine, nachvollziehbare Patches bevorzugen

## Kernprinzipien
- Linux-only
- Klare Oberfläche statt Effektspielerei
- Kleine, wartbare Dateien und Funktionen
- Robuste Fehlerpfade mit sicheren Fallbacks
- Trennung von Systemdaten, Einstellungen, Nutzerdaten, State und Cache

## GUI-Grundstruktur
Die AppShell besteht aus fünf sichtbaren Zonen:
1. Header-Dashboardleiste
2. Projekt-Tab-Leiste
3. Linke globale Sidebar
4. Zentrale Workspace-Fläche
5. Rechte Modulbibliothek

Zusätzlich gibt es unten eine Statusleiste für Speichern, Prozesse, Index und Diagnose.

## Architekturüberblick
- `run.py` startet das Tool.
- `app/main.py` baut Anwendung und Hauptfenster auf.
- `app/bootstrap/` kümmert sich um Startfolge, Pfade und Startchecks.
- `app/core/` hält Kontext, EventBus, Fehler und ServiceRegistry.
- `app/services/` kapselt Fachlogik.
- `app/storage/` trennt INI, SQLite, JSON, State und Cache.
- `app/modules/` enthält Modulgrundgerüste und Registry.
- `app/ui/` enthält Shell, Sidebars, Tabs, Dialoge und Workspace.

## Datenhaltung
- INI für kleine Einstellungen
- SQLite für Registry, Beziehungen, Aufgaben und Metadaten
- Versionierte JSON-Dateien für Projektdokumente, Presets, Profile und Texte
- State-Dateien für Sitzung, Layout und Wiederherstellung
- Separater Cache für verwerfbare Daten

Projektbezogene Dateien sind vorbereitet für:
- `project.json`
- `layout.json`
- `modules.json`
- `couplings.json`

## Repo-Struktur im Alltag
| Pfad | Zweck |
| --- | --- |
| `app/` | Anwendungslogik, UI und Startpfade |
| `resources/` | Icons, Themes und Standarddateien |
| `schemas/` | JSON-Schemata für feste Datenformate |
| `tests/` | Kleine, gezielte Prüfungen für betroffene Logik |
| `README.md` | Einstieg, Zielbild und Startinfos |
| `todo.txt` | Nächste fachliche Schritte |
| `AGENTS.md` | Arbeitsregeln für kleine, saubere Iterationen |

## Start unter Linux
### Schnellstart
```bash
./start.sh
```

Das Skript legt bei Bedarf die geschützte Python-Umgebung an, installiert nötige Pakete und startet danach das Programm automatisch.

### Empfohlene Startschritte
1. Repository klonen oder bereitstellen.
2. In das Projektverzeichnis wechseln.
3. `./start.sh` ausführen.
4. Hinweise im Terminal lesen, falls Systempakete oder Python-Pakete fehlen.

## Entwicklungsprinzipien
- Erst planen, dann patchen
- Nur betroffene Dateien ändern
- Kleine Funktionen und klare Klassenverantwortung
- Fehlermeldungen in einfacher Sprache
- Keine unnötigen Volltests

## Status / Roadmap
Das Repository ist aktuell auf eine tragfähige PySide6-Grundarchitektur ausgerichtet. Als Nächstes folgen vertiefte Workspace-Aktionen, echte Projektpersistenz und ausbaubare Modulinteraktionen.

## Hinweise zur Laientauglichkeit
- Sichtbare Hauptaktionen
- Ruhige Leerzustände
- Klare Namen statt Entwicklerjargon
- Hilfe- und Reparaturzugriff direkt in der Oberfläche

## Hinweise zu kleinen Patches und Wartbarkeit
- Bevorzuge gezielte Änderungen an klar abgegrenzten Dateien.
- Halte Dokumentation, Logik, Datenmodelle und UI getrennt.
- Vermeide Seiteneffekte in Nachbarbereichen.
- Nutze die vorhandene Service- und Storage-Trennung statt Direktzugriffe.
