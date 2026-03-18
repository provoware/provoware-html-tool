from PySide6.QtCore import Qt
from PySide6.QtWidgets import QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from app.services.app_state_service import AppStateService
from app.ui.dialogs.help_dialog import HelpDialog
from app.ui.dialogs.repair_dialog import RepairDialog
from app.ui.widgets.status_chip import StatusChip


class HeaderDashboardBar(QWidget):
    def __init__(self, app_state: AppStateService) -> None:
        super().__init__()
        self._app_state = app_state
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

        self._search = QLineEdit()
        self._search.setPlaceholderText("Projekt, Modul oder Hilfe suchen")
        self._search.setToolTip("Gib zum Beispiel einen Projektnamen, ein Modul oder ein Hilfethema ein")
        self._search.setClearButtonEnabled(True)
        self._search.setMinimumWidth(280)
        search_group.addWidget(self._search)

        self._helper = QLabel()
        self._helper.setStyleSheet("color: #6a7482; font-size: 11px;")
        self._helper.setWordWrap(True)
        search_group.addWidget(self._helper)

        layout.addLayout(search_group, 1)

        status_group = QVBoxLayout()
        status_group.setSpacing(4)

        self._save_chip = StatusChip("")
        self._check_chip = StatusChip("")
        self._system_chip = StatusChip("")
        for chip in (self._save_chip, self._check_chip, self._system_chip):
            status_group.addWidget(chip, 0, Qt.AlignmentFlag.AlignRight)

        layout.addLayout(status_group, 0)

        refresh_group = QVBoxLayout()
        refresh_group.setSpacing(4)

        check_refresh = QPushButton("Prüfung aktualisieren")
        check_refresh.setToolTip("Setzt den Platzhalterzeitpunkt für die letzte Prüfung neu")
        check_refresh.clicked.connect(self._app_state.refresh_check_label)
        refresh_group.addWidget(check_refresh)

        backup_refresh = QPushButton("Sicherung aktualisieren")
        backup_refresh.setToolTip("Setzt den Platzhalterzeitpunkt für die letzte Sicherung neu")
        backup_refresh.clicked.connect(self._app_state.refresh_backup_label)
        refresh_group.addWidget(backup_refresh)

        layout.addLayout(refresh_group, 0)

        help_button = QPushButton("Kurzhilfe")
        help_button.setToolTip("Zeigt kurz und einfach, wo Suche, Projektbereich und Module liegen")
        help_button.clicked.connect(self._open_help_dialog)
        layout.addWidget(help_button, 0, Qt.AlignmentFlag.AlignVCenter)

        repair_button = QPushButton("Sichere Prüfung")
        repair_button.setToolTip("Öffnet vorbereitete, sichere Prüfschritte ohne Datenänderung")
        repair_button.clicked.connect(self._open_repair_dialog)
        layout.addWidget(repair_button, 0, Qt.AlignmentFlag.AlignVCenter)

        self._app_state.subscribe(self._refresh_status_texts)
        self._refresh_status_texts()

    def _refresh_status_texts(self) -> None:
        self._helper.setText(self._app_state.search_helper_text())
        self._save_chip.setText(f"Speichern {self._app_state.save_status}")
        self._check_chip.setText(self._app_state.check_status_text())
        self._system_chip.setText(self._app_state.system_status_text())

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
