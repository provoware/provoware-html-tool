from PySide6.QtWidgets import QLabel


class FileFinderWidget(QLabel):
    def __init__(self) -> None:
        super().__init__("FileFinder-Modul bereit")
