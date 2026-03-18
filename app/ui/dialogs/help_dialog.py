from PySide6.QtWidgets import QDialog, QLabel, QVBoxLayout, QWidget


class HelpDialog(QDialog):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Hilfe")
        self.setModal(True)
        self.resize(360, 140)
        layout = QVBoxLayout(self)
        text = QLabel("Diese Hilfe erklärt die wichtigsten Bereiche in einfacher Sprache.")
        text.setWordWrap(True)
        layout.addWidget(text)
