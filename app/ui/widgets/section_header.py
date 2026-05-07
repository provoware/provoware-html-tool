from PySide6.QtWidgets import QLabel


class SectionHeader(QLabel):
    def __init__(self, text: str) -> None:
        super().__init__(text)
        self.setObjectName("SectionHeader")
