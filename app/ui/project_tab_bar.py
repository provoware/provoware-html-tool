from PySide6.QtCore import Signal
from PySide6.QtWidgets import QHBoxLayout, QPushButton, QTabBar, QWidget


class ProjectTabBar(QWidget):
    project_create_requested = Signal()
    project_close_requested = Signal(int)

    def __init__(self) -> None:
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 0, 12, 8)
        self.tab_bar = QTabBar()
        self.tab_bar.setTabsClosable(True)
        self.tab_bar.addTab("Start")
        self.tab_bar.setTabData(0, None)
        self.tab_bar.tabCloseRequested.connect(self.project_close_requested.emit)
        layout.addWidget(self.tab_bar, 1)
        plus_button = QPushButton("+")
        plus_button.clicked.connect(self.project_create_requested.emit)
        layout.addWidget(plus_button)

    def add_or_activate_project_tab(self, project_name: str, project_slug: str) -> int:
        for index in range(self.tab_bar.count()):
            if self.tab_bar.tabData(index) == project_slug:
                self.tab_bar.setCurrentIndex(index)
                return index
        index = self.tab_bar.addTab(project_name)
        self.tab_bar.setTabData(index, project_slug)
        self.tab_bar.setCurrentIndex(index)
        return index

    def current_project_slug(self) -> str | None:
        return self.tab_bar.tabData(self.tab_bar.currentIndex())

    def open_project_slugs(self) -> list[str]:
        return [self.tab_bar.tabData(index) for index in range(self.tab_bar.count()) if self.tab_bar.tabData(index)]

    def remove_project_tab(self, index: int) -> None:
        if index == 0:
            self.tab_bar.setCurrentIndex(0)
            return
        self.tab_bar.removeTab(index)
        if self.tab_bar.count() == 0:
            self.tab_bar.addTab("Start")
            self.tab_bar.setTabData(0, None)

    def mark_unsaved(self, index: int, unsaved: bool) -> None:
        text = self.tab_bar.tabText(index).replace(" *", "")
        self.tab_bar.setTabText(index, f"{text} *" if unsaved else text)
