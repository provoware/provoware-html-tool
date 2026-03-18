from PySide6.QtCore import Qt
from PySide6.QtWidgets import QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.dialogs.help_dialog import HelpDialog
from app.ui.dialogs.repair_dialog import RepairDialog
from app.ui.widgets.status_chip import StatusChip


class HeaderDashboardBar(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        self._help_dialog: HelpDialog | None = None
        self._repair_dialog: RepairDialog | None = None
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 8, 12, 6)
        layout.setSpacing(10)

        summary = QVBoxLayout()
        summary.setSpacing(2)

        eyebrow = QLabel("Startbereich")
        eyebrow.setStyleSheet("color: #6a7482; font-size: 11px;")
        summary.addWidget(eyebrow)

        title = QLabel("Bereit für dein nächstes Projekt")
        title.setStyleSheet("font-weight: 600; font-size: 16px;")
        summary.addWidget(title)

        subtitle = QLabel("Standardprofil aktiv. Öffne ein Projekt oder starte ruhig neu.")
        subtitle.setStyleSheet("color: #566171;")
        subtitle.setWordWrap(True)
        summary.addWidget(subtitle)

        layout.addLayout(summary)

        search_group = QVBoxLayout()
        search_group.setSpacing(2)

        search = QLineEdit()
        search.setPlaceholderText("Projekt, Modul oder Hilfe suchen")
        search.setToolTip("Gib zum Beispiel einen Projektnamen, ein Modul oder ein Hilfethema ein")
        search.setClearButtonEnabled(True)
        search.setMinimumWidth(280)
        search_group.addWidget(search)

        helper = QLabel(app_state.search_helper_text())
        helper.setStyleSheet("color: #6a7482; font-size: 11px;")
        helper.setWordWrap(True)
        search_group.addWidget(helper)

        layout.addLayout(search_group, 1)

        status_group = QVBoxLayout()
        status_group.setSpacing(4)

        for text in (
            f"Speichern {app_state.save_status}",
            app_state.check_status_text(),
            app_state.backup_status_text(),
        ):
            status_group.addWidget(StatusChip(text), 0, Qt.AlignmentFlag.AlignRight)

        refresh_hint = QLabel("Aktualisieren folgt später mit echter Prüfung und Sicherung.")
        refresh_hint.setStyleSheet("color: #6a7482; font-size: 11px;")
        refresh_hint.setWordWrap(True)
        status_group.addWidget(refresh_hint, 0, Qt.AlignmentFlag.AlignRight)

        layout.addLayout(status_group, 0)

        help_button = QPushButton("Kurzhilfe")
        help_button.setToolTip("Zeigt kurz und einfach, wo Suche, Projektbereich und Module liegen")
        help_button.clicked.connect(self._open_help_dialog)
        layout.addWidget(help_button, 0, Qt.AlignmentFlag.AlignVCenter)

        repair_button = QPushButton("Sichere Prüfung")
        repair_button.setToolTip("Öffnet vorbereitete, sichere Prüfschritte ohne Datenänderung")
        repair_button.clicked.connect(self._open_repair_dialog)
        layout.addWidget(repair_button, 0, Qt.AlignmentFlag.AlignVCenter)

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
