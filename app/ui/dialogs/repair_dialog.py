from PySide6.QtWidgets import QDialog, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from app.ui.widgets.status_chip import StatusChip


class RepairDialog(QDialog):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.setWindowTitle("Reparatur")
        self.setModal(True)
        self.resize(420, 250)

        layout = QVBoxLayout(self)
        for text in (
            "Wenn etwas hakt, kannst du hier sichere Prüfungen vorbereiten.",
            "Prüfe zuerst Pfade und Projektdateien. Das ändert noch keine Daten.",
            "Danach kannst du die Diagnose öffnen oder eine Sicherung prüfen, sobald diese Schritte verbunden sind.",
        ):
            label = QLabel(text)
            label.setWordWrap(True)
            layout.addWidget(label)

        self.path_check_button = QPushButton("Pfade prüfen")
        self.path_check_button.setToolTip("Zeigt einen sicheren Platzhalterbericht ohne Datenänderung")
        self.path_check_button.clicked.connect(self._show_path_check_result)
        layout.addWidget(self.path_check_button)

        self.diagnose_button = QPushButton("Diagnose öffnen")
        self.diagnose_button.setEnabled(False)
        self.diagnose_button.setToolTip("Wird später mit einer echten Diagnose verbunden")
        layout.addWidget(self.diagnose_button)

        result_title = QLabel("Ergebnisbereich")
        result_title.setStyleSheet("font-weight: 600;")
        layout.addWidget(result_title)

        level_row = QHBoxLayout()
        level_row.setSpacing(6)
        self.ready_chip = StatusChip("Bereit")
        self.checked_chip = StatusChip("Noch offen")
        self.note_chip = StatusChip("Nur Hinweis")
        for chip in (self.ready_chip, self.checked_chip, self.note_chip):
            level_row.addWidget(chip)
        level_row.addStretch(1)
        layout.addLayout(level_row)

        self.result_label = QLabel(
            "Noch keine Prüfung gestartet.\n"
            "Wenn du oben auf „Pfade prüfen“ klickst, erscheint hier ein kurzer, sicherer Bericht."
        )
        self.result_label.setWordWrap(True)
        self.result_label.setStyleSheet(
            "background: #f4f6f8; border: 1px solid #d9dee5; border-radius: 6px; padding: 10px;"
        )
        layout.addWidget(self.result_label)

        close_button = QPushButton("Später")
        close_button.clicked.connect(self.accept)
        layout.addWidget(close_button)

    def _show_path_check_result(self) -> None:
        self.ready_chip.setText("Bereit")
        self.checked_chip.setText("Geprüft")
        self.note_chip.setText("Keine Änderung")
        self.result_label.setText(
            "Sichere Prüfung vorbereitet.\n"
            "Pfade wirken im Platzhalterbericht erreichbar, und es wurde nichts geändert.\n"
            "Als Nächstes kannst du später Diagnose oder Sicherung genauer prüfen."
        )
