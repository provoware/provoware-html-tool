from PySide6.QtWidgets import QLabel


class StatusChip(QLabel):
    def __init__(self, text: str) -> None:
        super().__init__(text)
        self.setStyleSheet(
            "padding: 3px 8px;"
            " border: 1px solid #7d8896;"
            " border-radius: 9px;"
            " background: #f3f6fa;"
            " color: #334155;"
        )
