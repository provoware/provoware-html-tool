from PySide6.QtWidgets import QVBoxLayout, QWidget

from app.ui.widgets.action_tile import ActionTile
from app.ui.widgets.section_header import SectionHeader


class LeftGlobalSidebar(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 8, 8, 8)
        layout.addWidget(SectionHeader("Global"))
        for text in (
            "Profil",
            "Einstellungen",
            "Datenverwaltung",
            "Backup und Wiederherstellung",
            "Logs und Diagnose",
            "Hilfe",
            "Preset-Verwaltung",
        ):
            layout.addWidget(ActionTile(text))
        layout.addStretch(1)
