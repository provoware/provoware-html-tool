from PySide6.QtCore import Qt
from PySide6.QtWidgets import QDockWidget, QLabel


class ModuleDockWidget(QDockWidget):
    def __init__(self, title: str) -> None:
        super().__init__(title)
        self.setFeatures(
            QDockWidget.DockWidgetMovable
            | QDockWidget.DockWidgetFloatable
            | QDockWidget.DockWidgetClosable
        )
        label = QLabel(f"{title} ist bereit.")
        label.setAlignment(Qt.AlignCenter)
        self.setWidget(label)
