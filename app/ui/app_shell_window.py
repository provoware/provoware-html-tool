from __future__ import annotations

from PySide6.QtWidgets import QMainWindow, QMessageBox, QSplitter, QVBoxLayout, QWidget

from app.core.app_context import AppContext
from app.services.app_state_service import AppStateService
from app.services.project_service import ProjectService
from app.services.recovery_service import RecoveryService
from app.ui.dialogs.project_create_dialog import ProjectCreateDialog
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
        self._project_service: ProjectService = context.services.get("project")
        self._app_state: AppStateService = context.services.get("app_state")
        self._recovery_service: RecoveryService = context.services.get("recovery")
        self._open_modules: list[str] = []
        self.setWindowTitle("Provoware HTML Tool")
        self.resize(1440, 900)

        root = QWidget()
        outer = QVBoxLayout(root)
        outer.setContentsMargins(0, 0, 0, 0)

        self.header = HeaderDashboardBar(self._app_state)
        self.tabs = ProjectTabBar()
        self.left_sidebar = LeftGlobalSidebar()
        self.workspace = ProjectWorkspaceHost()
        self.right_sidebar = RightModuleSidebar()
        self.status_bar_widget = StatusBarController(self._app_state)

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

        self.tabs.project_create_requested.connect(self._open_project_dialog)
        self.tabs.project_close_requested.connect(self._close_project_tab)
        self.right_sidebar.module_open_requested.connect(self._open_module_from_sidebar)
        self.right_sidebar.preset_apply_requested.connect(self._apply_preset)
        self.tabs.tab_bar.currentChanged.connect(lambda _index: self._sync_app_state())

        self._restore_session()

    def _open_project_dialog(self) -> None:
        dialog = ProjectCreateDialog()
        if dialog.exec() == dialog.DialogCode.Accepted:
            try:
                project = self._project_service.create_project(dialog.project_name())
            except ValueError as exc:
                QMessageBox.warning(self, "Projekt anlegen", str(exc))
                return
            self.tabs.add_or_activate_project_tab(project.name, project.slug)
            self._sync_app_state()
            self._persist_session()

    def _close_project_tab(self, index: int) -> None:
        current_slug = self.tabs.tab_bar.tabData(index)
        self.tabs.remove_project_tab(index)
        if current_slug and current_slug == self.workspace.state_adapter.active_project_name:
            self.workspace.setCentralWidget(self.workspace.centralWidget())
            self._open_modules.clear()
        self._sync_app_state()
        self._persist_session()

    def _open_module_from_sidebar(self, module_name: str) -> None:
        project_slug = self.tabs.current_project_slug()
        if project_slug is None:
            QMessageBox.information(self, "Projekt fehlt", "Öffne oder erstelle zuerst ein Projekt.")
            return
        self.workspace.open_module_dock(module_name)
        if module_name not in self._open_modules:
            self._open_modules.append(module_name)
        self._project_service.save_workspace_state(project_slug, self._open_modules)
        self.tabs.mark_unsaved(self.tabs.tab_bar.currentIndex(), True)
        self._app_state.save_status = "mit offenen Änderungen"
        self._sync_app_state(project_slug_override=project_slug)
        self._persist_session()

    def _apply_preset(self, preset_name: str) -> None:
        project_slug = self.tabs.current_project_slug()
        if project_slug is None:
            QMessageBox.information(self, "Projekt fehlt", "Ein Preset braucht zuerst ein offenes Projekt.")
            return
        self.workspace.apply_preset(preset_name)
        self._project_service.save_workspace_state(project_slug, self._open_modules)
        self._persist_session()

    def _restore_session(self) -> None:
        session = self._recovery_service.load_session()
        for project_slug in session["open_projects"]:
            self.tabs.add_or_activate_project_tab(project_slug.replace("-", " ").title(), project_slug)
        if session["active_project"]:
            for index in range(self.tabs.tab_bar.count()):
                if self.tabs.tab_bar.tabData(index) == session["active_project"]:
                    self.tabs.tab_bar.setCurrentIndex(index)
                    break
        self._open_modules = []
        for module_name in session["open_modules"]:
            if self.tabs.current_project_slug() is None:
                break
            self.workspace.open_module_dock(module_name)
            self._open_modules.append(module_name)
        self._sync_app_state()

    def _persist_session(self) -> None:
        self._recovery_service.save_session(
            self.tabs.current_project_slug(),
            self.tabs.open_project_slugs(),
            self._open_modules,
        )

    def _sync_app_state(self, project_slug_override: str | None = None) -> None:
        project_slug = project_slug_override if project_slug_override is not None else self.tabs.current_project_slug()
        if project_slug is None:
            self._app_state.active_project_name = "Kein Projekt offen"
            self._app_state.save_status = "bereit" if not self._open_modules else self._app_state.save_status
            return
        self.workspace.state_adapter.active_project_name = project_slug
        self._app_state.active_project_name = project_slug.replace("-", " ").title()
