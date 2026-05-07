from PySide6.QtCore import Qt
from PySide6.QtWidgets import QBoxLayout, QHBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.widgets.status_chip import StatusChip


class StatusBarController(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        self._compact_breakpoint = 920
        self.setObjectName("StatusBarController")

        self._layout = QHBoxLayout(self)
        self._layout.setContentsMargins(14, 6, 14, 10)
        self._layout.setSpacing(10)

        self._project_group = QHBoxLayout()
        self._project_group.setSpacing(6)
        for text in (f"Projekt: {app_state.active_project_name}", app_state.search_status_text()):
            self._project_group.addWidget(StatusChip(text))
        self._layout.addLayout(self._project_group, 0)

        self._layout.addStretch(1)

        self._system_group = QHBoxLayout()
        self._system_group.setSpacing(6)
        self._system_group.setAlignment(Qt.AlignmentFlag.AlignRight)
        for text in (
            f"Speichern {app_state.save_status}",
            app_state.status_summary_text(),
            "Prüfung und Hilfe bleiben direkt erreichbar",
        ):
            self._system_group.addWidget(StatusChip(text))
        self._layout.addLayout(self._system_group, 0)
        self._apply_compact_mode(self.width())

    def resizeEvent(self, event) -> None:
        super().resizeEvent(event)
        self._apply_compact_mode(event.size().width())

    def _apply_compact_mode(self, width: int) -> None:
        is_compact = width < self._compact_breakpoint
        self._layout.setDirection(
            QBoxLayout.Direction.TopToBottom
            if is_compact
            else QBoxLayout.Direction.LeftToRight
        )
        self._layout.setContentsMargins(14, 6, 14, 8 if is_compact else 10)
        self._layout.setSpacing(6 if is_compact else 10)
        self._project_group.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter)
        self._system_group.setAlignment(
            Qt.AlignmentFlag.AlignLeft if is_compact else Qt.AlignmentFlag.AlignRight
        )
