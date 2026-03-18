from PySide6.QtWidgets import QDialog, QLabel, QPushButton, QVBoxLayout, QWidget


class HelpDialog(QDialog):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Hilfe")
        self.setModal(True)
        self.resize(420, 240)

        layout = QVBoxLayout(self)
        for text in (
            "Diese Hilfe zeigt dir die wichtigsten Bereiche in einfacher Sprache.",
            "Oben findest du Suche, Hilfe und Reparatur. Links wechselst du in Einstellungen und Datenpflege.",
            "In der Mitte arbeitest du im Projekt. Rechts öffnest du Module und Vorlagen.",
            "Wenn du nicht weiterweißt, starte mit der Suche oder öffne die Reparatur für eine sichere Prüfung.",
        ):
            label = QLabel(text)
            label.setWordWrap(True)
            layout.addWidget(label)

        close_button = QPushButton("Verstanden")
        close_button.clicked.connect(self.accept)
        layout.addWidget(close_button)
