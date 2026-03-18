from PySide6.QtWidgets import QLabel


class WorkspaceEmptyState(QLabel):
    def __init__(self) -> None:
        super().__init__(
            "Noch kein Projekt aktiv. Starte oben mit einem neuen Projekt oder öffne links Hilfe und Einstellungen.\n\n"
            "So geht es leicht: 1. Projekt anlegen. 2. Rechts ein Modul wählen. 3. In der Mitte loslegen.\n\n"
            "Bis dahin bleibt deine Arbeitsfläche ruhig und unverändert."
        )
        self.setWordWrap(True)
        self.setStyleSheet("padding: 32px; font-size: 15px; line-height: 1.5;")
