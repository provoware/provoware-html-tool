from PySide6.QtWidgets import QPushButton


class ActionTile(QPushButton):
    def __init__(self, text: str) -> None:
        super().__init__(text)
        self.setMinimumHeight(40)
