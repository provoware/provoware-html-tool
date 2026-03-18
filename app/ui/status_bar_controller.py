from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 8, 12, 12)
        for text in (
            "Speichern bereit",
            "Prozesse: ruhig",
            "Suchindex: leer",
            "Warnungen: 0",
            "Diagnose: bereit",
        ):
            layout.addWidget(StatusChip(text))
        layout.addStretch(1)
