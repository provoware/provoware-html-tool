from PySide6.QtWidgets import QLabel


class EditorWidget(QLabel):
    def __init__(self) -> None:
        super().__init__("Editor-Modul bereit")
