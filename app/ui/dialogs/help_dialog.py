from PySide6.QtWidgets import QDialog, QLabel, QVBoxLayout


class HelpDialog(QDialog):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("Hilfe")
        layout = QVBoxLayout(self)
        layout.addWidget(QLabel("Diese Hilfe erklärt die wichtigsten Bereiche in einfacher Sprache."))
