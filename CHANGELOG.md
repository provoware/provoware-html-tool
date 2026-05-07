# CHANGELOG

## 2026-05-07

### UI-Profi-Upgrade: Iteration 5
- Verbleibende Widget-Styles aus `StatusChip` und `SectionHeader` entfernt.
- Reparaturdialog-Ergebnisbereich und Abschnittstitel auf zentrale Theme-Haken umgestellt.
- Theme-Regeln für `StatusChip`, `SectionHeader`, `DialogSectionTitle` und `RepairResultBox` ergänzt.
- Validierung durchgeführt: Haken vorhanden, Theme-Selektoren vorhanden, Pfadprüfungs-Klickfunktion unverändert.

### UI-Profi-Upgrade: Iteration 4
- Workspace-Empty-State von lokalen Text-Styles befreit.
- Statusleiste von lokalem Container-Style befreit.
- Workspace- und Statusleisten-Widgets mit zentralen `objectName`-Haken versehen.
- Theme-Regeln für `WorkspaceEmptyState`, `WorkspaceEmptyMessage`, `WorkspaceEmptyNote` und `StatusBarController` ergänzt.
- Validierung durchgeführt: Haken vorhanden, Theme-Selektoren vorhanden, kompakte Statusleistenlogik unverändert.

### UI-Profi-Upgrade: Iteration 3
- Rechte Modul-Sidebar von lokalen Hinweis-Styles befreit.
- Hinweislabels in `app/ui/right_module_sidebar.py` mit `SidebarHintText` markiert.
- Zentrale Theme-Regel `QLabel#SidebarHintText` in `app/ui/theme.py` ergänzt.
- Validierung durchgeführt: Sidebar-Haken vorhanden, Theme-Selektor vorhanden, Modulfilter-, Preset- und Kopplungslogik unverändert.

### UI-Profi-Upgrade: Iteration 2
- Header-Inline-Styles aus `app/ui/header_dashboard_bar.py` entfernt.
- Header-Widgets mit sprechenden `objectName`-Werten versehen.
- Header-Optik zentral in `app/ui/theme.py` über Qt-Selektoren gesteuert.
- Validierung durchgeführt: Header-Haken vorhanden, Theme-Selektoren vorhanden, Dialog- und Button-Logik unverändert.

### UI-Profi-Upgrade: Iteration 1
- Globales Qt-Stylesheet in `app/ui/theme.py` ergänzt.
- Stylesheet zentral in `app/main.py` eingebunden.
- Buttons, Eingabefelder, Tabs, Splitter und Statusbar erhalten konsistentere Grundoptik.
- Tastaturfokus wird über gelben Rahmen besser sichtbar.
- Validierung durchgeführt: Datei vorhanden, Import vorhanden, Stylesheet-Aufruf vorhanden.

### Offene Validierung
- Sichtprüfung im laufenden PySide6-Fenster lokal mit `./start.sh` durchführen.
- Kleine, mittlere und große Fensterbreite prüfen.
- Prüfen, ob weitere vorhandene Inline-Styles einzelne globale Styles bewusst überschreiben.
