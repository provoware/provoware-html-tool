from PySide6.QtWidgets import QLabel


class WorkspaceEmptyState(QLabel):
    def __init__(self) -> None:
        super().__init__(
            "Noch kein Projekt aktiv. Wähle links einen Bereich für Hilfe oder Einstellungen, "
            "oder starte oben ein neues Projekt. Deine Arbeitsfläche bleibt frei, bis du beginnst."
        )
        self.setWordWrap(True)
        self.setStyleSheet("padding: 32px; font-size: 15px;")
