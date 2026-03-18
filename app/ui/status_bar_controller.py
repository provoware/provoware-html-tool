from PySide6.QtWidgets import QHBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        self._app_state = app_state
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 4, 12, 8)
        layout.setSpacing(4)
        self._project_chip = StatusChip("")
        self._save_chip = StatusChip("")
        self._summary_chip = StatusChip("")
        self._search_chip = StatusChip("")
        self._help_chip = StatusChip("Hilfe und Diagnose direkt erreichbar")
        for chip in (
            self._project_chip,
            self._save_chip,
            self._summary_chip,
            self._search_chip,
            self._help_chip,
        ):
            layout.addWidget(chip)
        layout.addStretch(1)
        self._app_state.subscribe(self._refresh_status_texts)
        self._refresh_status_texts()

    def _refresh_status_texts(self) -> None:
        self._project_chip.setText(f"Projekt: {self._app_state.active_project_name}")
        self._save_chip.setText(f"Speichern {self._app_state.save_status}")
        self._summary_chip.setText(self._app_state.status_summary_text())
        self._search_chip.setText(self._app_state.search_status_text())
