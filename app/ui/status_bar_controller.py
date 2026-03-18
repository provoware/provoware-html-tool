from PySide6.QtCore import Qt
from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        self.setStyleSheet("background: #f8fafc; border-top: 1px solid #d8e0ea;")

        layout = QHBoxLayout(self)
        layout.setContentsMargins(14, 6, 14, 10)
        layout.setSpacing(10)

        project_group = QHBoxLayout()
        project_group.setSpacing(6)
        for text in (f"Projekt: {app_state.active_project_name}", app_state.search_status_text()):
            project_group.addWidget(StatusChip(text))
        layout.addLayout(project_group, 0)

        layout.addStretch(1)

        system_group = QHBoxLayout()
        system_group.setSpacing(6)
        system_group.setAlignment(Qt.AlignmentFlag.AlignRight)
        for text in (
            f"Speichern {app_state.save_status}",
            app_state.status_summary_text(),
            "Prüfung und Hilfe bleiben direkt erreichbar",
        ):
            system_group.addWidget(StatusChip(text))
        layout.addLayout(system_group, 0)
