from PySide6.QtCore import Qt
from PySide6.QtWidgets import QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from app.ui.widgets.status_chip import StatusChip


class HeaderDashboardBar(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 10, 12, 6)
        layout.setSpacing(10)

        summary = QVBoxLayout()
        summary.setSpacing(2)

        title = QLabel("Bereit für dein nächstes Projekt")
        title.setStyleSheet("font-weight: 600;")
        summary.addWidget(title)

        subtitle = QLabel("Profil Standardprofil · Noch kein Projekt geöffnet")
        subtitle.setStyleSheet("color: #566171;")
        summary.addWidget(subtitle)

        layout.addLayout(summary)

        search = QLineEdit()
        search.setPlaceholderText("Projekt, Modul oder Hilfe suchen")
        search.setClearButtonEnabled(True)
        search.setMinimumWidth(260)
        layout.addWidget(search, 1, Qt.AlignmentFlag.AlignVCenter)

        for text in ("Speichern bereit", "Sicherung fehlt noch", "Keine Warnung"):
            layout.addWidget(StatusChip(text), 0, Qt.AlignmentFlag.AlignVCenter)

        layout.addWidget(QPushButton("Hilfe"), 0, Qt.AlignmentFlag.AlignVCenter)
        layout.addWidget(QPushButton("Reparieren"), 0, Qt.AlignmentFlag.AlignVCenter)
