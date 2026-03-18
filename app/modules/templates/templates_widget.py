from PySide6.QtWidgets import QLabel


class TemplatesWidget(QLabel):
    def __init__(self) -> None:
        super().__init__("Templates-Modul bereit")
