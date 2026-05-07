from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.dialogs.help_dialog import HelpDialog
from app.ui.dialogs.repair_dialog import RepairDialog
from app.ui.widgets.status_chip import StatusChip


class HeaderDashboardBar(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        self._help_dialog: HelpDialog | None = None
        self._repair_dialog: RepairDialog | None = None
        self.setObjectName("HeaderDashboardBar")

        layout = QHBoxLayout(self)
        layout.setContentsMargins(14, 10, 14, 8)
        layout.setSpacing(12)

        summary = QVBoxLayout()
        summary.setSpacing(1)

        eyebrow = QLabel("Startbereich")
        eyebrow.setObjectName("HeaderEyebrow")
        summary.addWidget(eyebrow)

        title = QLabel("Bereit für dein nächstes Projekt")
        title.setObjectName("HeaderTitle")
        summary.addWidget(title)

        subtitle = QLabel("Standardprofil aktiv. Öffne ein Projekt oder starte ruhig neu.")
        subtitle.setObjectName("HeaderSubtitle")
        subtitle.setWordWrap(True)
        summary.addWidget(subtitle)

        layout.addLayout(summary)

        search_frame = QFrame()
        search_frame.setObjectName("HeaderSearchFrame")
        search_layout = QVBoxLayout(search_frame)
        search_layout.setContentsMargins(10, 8, 10, 8)
        search_layout.setSpacing(3)

        search = QLineEdit()
        search.setPlaceholderText("Projekt, Modul oder Hilfe suchen")
        search.setToolTip("Gib zum Beispiel einen Projektnamen, ein Modul oder ein Hilfethema ein")
        search.setClearButtonEnabled(True)
        search.setMinimumWidth(300)
        search_layout.addWidget(search)

        helper = QLabel(app_state.search_helper_text())
        helper.setObjectName("HeaderHelperText")
        helper.setWordWrap(True)
        search_layout.addWidget(helper)

        layout.addWidget(search_frame, 1)

        status_group = QVBoxLayout()
        status_group.setSpacing(3)

        top_status_row = QHBoxLayout()
        top_status_row.setSpacing(6)
        top_status_row.setAlignment(Qt.AlignmentFlag.AlignRight)
        for text in (f"Speichern {app_state.save_status}", app_state.check_status_text()):
            top_status_row.addWidget(StatusChip(text), 0, Qt.AlignmentFlag.AlignRight)
        status_group.addLayout(top_status_row)

        bottom_status_row = QHBoxLayout()
        bottom_status_row.setSpacing(6)
        bottom_status_row.setAlignment(Qt.AlignmentFlag.AlignRight)
        bottom_status_row.addWidget(StatusChip(app_state.backup_status_text()), 0, Qt.AlignmentFlag.AlignRight)

        refresh_hint = QLabel("Prüfung und Sicherung bleiben sichtbar vorbereitet.")
        refresh_hint.setObjectName("HeaderHelperText")
        refresh_hint.setWordWrap(True)
        refresh_hint.setAlignment(Qt.AlignmentFlag.AlignRight)
        bottom_status_row.addWidget(refresh_hint, 0, Qt.AlignmentFlag.AlignRight)
        status_group.addLayout(bottom_status_row)

        layout.addLayout(status_group, 0)

        action_group = QVBoxLayout()
        action_group.setSpacing(6)

        help_button = QPushButton("Kurzhilfe")
        help_button.setToolTip("Zeigt kurz und einfach, wo Suche, Projektbereich und Module liegen")
        help_button.clicked.connect(self._open_help_dialog)
        action_group.addWidget(help_button)

        repair_button = QPushButton("Sichere Prüfung")
        repair_button.setToolTip("Öffnet vorbereitete, sichere Prüfschritte ohne Datenänderung")
        repair_button.clicked.connect(self._open_repair_dialog)
        action_group.addWidget(repair_button)

        layout.addLayout(action_group, 0)
        layout.setAlignment(action_group, Qt.AlignmentFlag.AlignTop)

    def _open_help_dialog(self) -> None:
        if self._help_dialog is None:
            self._help_dialog = HelpDialog(self)
        self._help_dialog.show()
        self._help_dialog.raise_()
        self._help_dialog.activateWindow()

    def _open_repair_dialog(self) -> None:
        if self._repair_dialog is None:
            self._repair_dialog = RepairDialog(self)
        self._repair_dialog.show()
        self._repair_dialog.raise_()
        self._repair_dialog.activateWindow()
