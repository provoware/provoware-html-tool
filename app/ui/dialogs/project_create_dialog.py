from PySide6.QtWidgets import QDialog, QDialogButtonBox, QLineEdit, QVBoxLayout

from app.utils.validation import require_text


class ProjectCreateDialog(QDialog):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("Neues Projekt")
        layout = QVBoxLayout(self)
        self.name_edit = QLineEdit()
        self.name_edit.setPlaceholderText("Projektname")
        self.name_edit.setToolTip("Gib einen kurzen Projektnamen ein. Leer bleibt sicher als Neues Projekt nutzbar.")
        layout.addWidget(self.name_edit)
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        layout.addWidget(buttons)

    def project_name(self) -> str:
        return require_text(self.name_edit.text(), "Neues Projekt")
