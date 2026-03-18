from PySide6.QtCore import Qt
from PySide6.QtWidgets import QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from app.ui.widgets.status_chip import StatusChip


class HeaderDashboardBar(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 8, 12, 4)
        layout.setSpacing(8)

        summary = QVBoxLayout()
        summary.setSpacing(1)

        eyebrow = QLabel("Startbereich")
        eyebrow.setStyleSheet("color: #6a7482; font-size: 11px;")
        summary.addWidget(eyebrow)

        title = QLabel("Bereit für dein nächstes Projekt")
        title.setStyleSheet("font-weight: 600; font-size: 16px;")
        summary.addWidget(title)

        subtitle = QLabel("Standardprofil aktiv · Öffne ein Projekt oder starte ein neues.")
        subtitle.setStyleSheet("color: #566171;")
        summary.addWidget(subtitle)

        layout.addLayout(summary)

        search_group = QVBoxLayout()
        search_group.setSpacing(2)

        search = QLineEdit()
        search.setPlaceholderText("Projekt, Modul oder Hilfe suchen")
        search.setToolTip("Gib einen Namen oder ein Hilfethema ein")
        search.setClearButtonEnabled(True)
        search.setMinimumWidth(260)
        search_group.addWidget(search)

        helper = QLabel("Schnellhilfe: Namen, Module oder Hilfebegriffe eingeben.")
        helper.setStyleSheet("color: #6a7482; font-size: 11px;")
        helper.setWordWrap(True)
        search_group.addWidget(helper)

        layout.addLayout(search_group, 1)

        for text in ("Speichern bereit", "Prüfung heute noch offen", "System ruhig"):
            layout.addWidget(StatusChip(text), 0, Qt.AlignmentFlag.AlignVCenter)

        layout.addWidget(QPushButton("Hilfe"), 0, Qt.AlignmentFlag.AlignVCenter)
        layout.addWidget(QPushButton("Reparieren"), 0, Qt.AlignmentFlag.AlignVCenter)
