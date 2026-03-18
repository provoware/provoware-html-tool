from PySide6.QtWidgets import QLabel


class StatusChip(QLabel):
    def __init__(self, text: str) -> None:
        super().__init__(text)
        self.setStyleSheet("padding: 4px 8px; border: 1px solid #5f6b7a; border-radius: 10px;")
