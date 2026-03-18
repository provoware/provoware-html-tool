from PySide6.QtCore import Qt
from PySide6.QtWidgets import QLabel, QVBoxLayout, QWidget

from app.ui.widgets.action_tile import ActionTile


class WorkspaceEmptyState(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(32, 32, 32, 32)
        layout.setSpacing(12)

        message = QLabel(
            "Noch kein Projekt aktiv. Starte oben mit einem neuen Projekt oder öffne links Hilfe und Einstellungen.\n\n"
            "So geht es leicht: 1. Projekt anlegen. 2. Rechts ein Modul wählen. 3. In der Mitte loslegen.\n\n"
            "Bis dahin bleibt deine Arbeitsfläche ruhig und unverändert."
        )
        message.setWordWrap(True)
        message.setStyleSheet("font-size: 15px;")
        layout.addWidget(message)

        project_button = ActionTile("Projekt anlegen")
        project_button.setEnabled(False)
        project_button.setToolTip("Diese Direktaktion wird im nächsten Ausbauschritt verbunden.")
        layout.addWidget(project_button, 0, Qt.AlignmentFlag.AlignLeft)

        preset_button = ActionTile("Preset wählen")
        preset_button.setEnabled(False)
        preset_button.setToolTip("Diese Direktaktion wird nach der Preset-Anbindung verbunden.")
        layout.addWidget(preset_button, 0, Qt.AlignmentFlag.AlignLeft)

        note = QLabel("Hinweis: Die Schaltflächen sind schon sichtbar und werden im nächsten Schritt aktiviert.")
        note.setWordWrap(True)
        note.setStyleSheet("color: #666; font-size: 13px;")
        layout.addWidget(note)
        layout.addStretch(1)
