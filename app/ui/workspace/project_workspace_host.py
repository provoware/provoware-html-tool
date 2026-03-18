from PySide6.QtCore import Qt
from PySide6.QtWidgets import QMainWindow

from app.ui.workspace.module_dock_widget import ModuleDockWidget
from app.ui.workspace.workspace_empty_state import WorkspaceEmptyState
from app.ui.workspace.workspace_state_adapter import WorkspaceStateAdapter


class ProjectWorkspaceHost(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.state_adapter = WorkspaceStateAdapter()
        self.setCentralWidget(WorkspaceEmptyState())
        self.setDockOptions(QMainWindow.AllowNestedDocks | QMainWindow.AllowTabbedDocks)

    def open_module_dock(self, title: str) -> ModuleDockWidget:
        dock = ModuleDockWidget(title)
        self.addDockWidget(Qt.RightDockWidgetArea, dock)
        return dock

    def load_layout(self) -> None:
        self.state_adapter.layout_loaded = True

    def save_layout(self) -> bytes:
        return self.saveState()

    def apply_preset(self, preset_name: str) -> None:
        self.state_adapter.active_project_name = preset_name
