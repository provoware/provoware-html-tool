from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 4, 12, 8)
        layout.setSpacing(4)
        for text in (
            f"Projekt: {app_state.active_project_name}",
            f"Speichern {app_state.save_status}",
            app_state.status_summary_text(),
            app_state.search_status_text(),
            "Hilfe und Diagnose direkt erreichbar",
        ):
            layout.addWidget(StatusChip(text))
        layout.addStretch(1)
