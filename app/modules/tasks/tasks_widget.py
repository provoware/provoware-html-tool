from PySide6.QtWidgets import QLabel


class TasksWidget(QLabel):
    def __init__(self) -> None:
        super().__init__("Tasks-Modul bereit")
