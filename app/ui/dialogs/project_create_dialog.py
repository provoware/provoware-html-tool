from PySide6.QtWidgets import QDialog, QDialogButtonBox, QLineEdit, QVBoxLayout


class ProjectCreateDialog(QDialog):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("Neues Projekt")
        layout = QVBoxLayout(self)
        self.name_edit = QLineEdit()
        self.name_edit.setPlaceholderText("Projektname")
        layout.addWidget(self.name_edit)
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        layout.addWidget(buttons)

    def project_name(self) -> str:
        return self.name_edit.text().strip() or "Neues Projekt"
