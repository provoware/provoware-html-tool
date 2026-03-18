from PySide6.QtWidgets import QDialog, QLabel, QVBoxLayout


class RepairDialog(QDialog):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("Reparatur")
        layout = QVBoxLayout(self)
        layout.addWidget(QLabel("Wenn etwas hakt, können hier sichere Prüfungen gestartet werden."))
