from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 4, 12, 8)
        layout.setSpacing(6)
        for text in (
            "Projekt ruhig",
            "Speichern bereit",
            "Letzte Prüfung: noch offen",
            "Suche wartet auf deinen Begriff",
            "Hilfe und Diagnose bereit",
        ):
            layout.addWidget(StatusChip(text))
        layout.addStretch(1)
