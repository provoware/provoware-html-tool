from PySide6.QtWidgets import QDialog, QLabel, QPushButton, QVBoxLayout, QWidget


class RepairDialog(QDialog):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Reparatur")
        self.setModal(True)
        self.resize(420, 250)

        layout = QVBoxLayout(self)
        for text in (
            "Wenn etwas hakt, kannst du hier sichere Prüfungen vorbereiten.",
            "Prüfe zuerst Pfade und Projektdateien. Das ändert noch keine Daten.",
            "Danach kannst du die Diagnose öffnen oder eine Sicherung prüfen, sobald diese Schritte verbunden sind.",
        ):
            label = QLabel(text)
            label.setWordWrap(True)
            layout.addWidget(label)

        self.path_check_button = QPushButton("Pfade prüfen")
        self.path_check_button.setEnabled(False)
        self.path_check_button.setToolTip("Wird im nächsten Schritt mit der sicheren Prüfung verbunden")
        layout.addWidget(self.path_check_button)

        self.diagnose_button = QPushButton("Diagnose öffnen")
        self.diagnose_button.setEnabled(False)
        self.diagnose_button.setToolTip("Wird später mit einer echten Diagnose verbunden")
        layout.addWidget(self.diagnose_button)

        close_button = QPushButton("Später")
        close_button.clicked.connect(self.accept)
        layout.addWidget(close_button)
