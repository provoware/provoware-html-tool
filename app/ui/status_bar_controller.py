from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 4, 12, 8)
        layout.setSpacing(6)
        for text in (
            "Projekt ruhig",
            f"Speichern {app_state.save_status}",
            app_state.check_status_text(),
            app_state.backup_status_text(),
            "Suche wartet auf deinen Begriff",
            "Hilfe und Diagnose bereit",
        ):
            layout.addWidget(StatusChip(text))
        layout.addStretch(1)
