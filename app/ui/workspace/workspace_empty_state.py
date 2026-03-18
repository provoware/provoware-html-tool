from PySide6.QtWidgets import QLabel


class WorkspaceEmptyState(QLabel):
    def __init__(self) -> None:
        super().__init__("Noch kein Projekt aktiv. Öffnen Sie links ein Profil oder starten Sie oben ein neues Projekt.")
        self.setWordWrap(True)
        self.setStyleSheet("padding: 32px; font-size: 15px;")
