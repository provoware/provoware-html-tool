from __future__ import annotations

from PySide6.QtWidgets import QMainWindow, QSplitter, QVBoxLayout, QWidget

from app.core.app_context import AppContext
from app.ui.header_dashboard_bar import HeaderDashboardBar
from app.ui.left_global_sidebar import LeftGlobalSidebar
from app.ui.project_tab_bar import ProjectTabBar
from app.ui.right_module_sidebar import RightModuleSidebar
from app.ui.status_bar_controller import StatusBarController
from app.ui.workspace.project_workspace_host import ProjectWorkspaceHost


class AppShellWindow(QMainWindow):
    def __init__(self, context: AppContext) -> None:
        super().__init__()
        self.context = context
        self.setWindowTitle("Provoware HTML Tool")
        self.resize(1440, 900)

        root = QWidget()
        outer = QVBoxLayout(root)
        outer.setContentsMargins(0, 0, 0, 0)

        app_state = context.services.get("app_state")

        self.header = HeaderDashboardBar(app_state)
        self.tabs = ProjectTabBar()
        self.left_sidebar = LeftGlobalSidebar()
        self.workspace = ProjectWorkspaceHost()
        self.right_sidebar = RightModuleSidebar()
        self.status_bar_widget = StatusBarController(app_state)

        splitter = QSplitter()
        splitter.addWidget(self.left_sidebar)
        splitter.addWidget(self.workspace)
        splitter.addWidget(self.right_sidebar)
        splitter.setSizes([260, 920, 260])

        outer.addWidget(self.header)
        outer.addWidget(self.tabs)
        outer.addWidget(splitter, 1)
        outer.addWidget(self.status_bar_widget)
        self.setCentralWidget(root)
