from PySide6.QtWidgets import QLabel


class RandomizerWidget(QLabel):
    def __init__(self) -> None:
        super().__init__("Randomizer-Modul bereit")
