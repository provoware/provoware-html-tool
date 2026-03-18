from PySide6.QtCore import Signal
from PySide6.QtWidgets import QHBoxLayout, QPushButton, QTabBar, QWidget


class ProjectTabBar(QWidget):
    project_create_requested = Signal()

    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 0, 12, 8)
        self.tab_bar = QTabBar()
        self.tab_bar.setTabsClosable(True)
        self.tab_bar.addTab("Start")
        layout.addWidget(self.tab_bar, 1)
        plus_button = QPushButton("+")
        plus_button.clicked.connect(self.project_create_requested.emit)
        layout.addWidget(plus_button)

    def mark_unsaved(self, index: int, unsaved: bool) -> None:
        text = self.tab_bar.tabText(index).replace(" *", "")
        self.tab_bar.setTabText(index, f"{text} *" if unsaved else text)
