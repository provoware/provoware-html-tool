from PySide6.QtWidgets import QLabel


class WikiWidget(QLabel):
    def __init__(self) -> None:
        super().__init__("Wiki-Modul bereit")
