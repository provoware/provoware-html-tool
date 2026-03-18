from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 6, 12, 10)
        layout.setSpacing(8)
        for text in (
            "Projektstatus: ruhig",
            "Speichern: bereit",
            "Suchlauf: noch leer",
            "Diagnose: startklar",
        ):
            layout.addWidget(StatusChip(text))
        layout.addStretch(1)
