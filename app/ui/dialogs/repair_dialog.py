from PySide6.QtWidgets import QDialog, QLabel, QVBoxLayout, QWidget


class RepairDialog(QDialog):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Reparatur")
        self.setModal(True)
        self.resize(360, 140)
        layout = QVBoxLayout(self)
        text = QLabel("Wenn etwas hakt, können hier sichere Prüfungen gestartet werden.")
        text.setWordWrap(True)
        layout.addWidget(text)
