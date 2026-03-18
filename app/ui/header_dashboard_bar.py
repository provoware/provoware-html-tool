from PySide6.QtWidgets import QHBoxLayout, QLabel, QLineEdit, QPushButton, QWidget

from app.ui.widgets.status_chip import StatusChip


class HeaderDashboardBar(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 8)
        layout.addWidget(QLabel("Profil: Standardprofil"))
        layout.addWidget(QLabel("Projekt: Kein Projekt offen"))
        search = QLineEdit()
        search.setPlaceholderText("Global suchen")
        layout.addWidget(search, 1)
        for text in ("Speichern ok", "Letzte Sicherung: keine", "Warnungen: keine"):
            layout.addWidget(StatusChip(text))
        layout.addWidget(QPushButton("Hilfe"))
        layout.addWidget(QPushButton("Reparieren"))
