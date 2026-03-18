from __future__ import annotations

from dataclasses import dataclass

from app.bootstrap.dependency_report import DependencyReport
from app.bootstrap.startup_checks import StartupChecks
from app.core.app_context import AppContext
from app.core.errors import StartupError
from app.core.event_bus import EventBus
from app.core.service_registry import ServiceRegistry
from app.paths import build_app_paths
from app.services.app_state_service import AppStateService
from app.services.coupling_service import CouplingService
from app.services.diagnostics_service import DiagnosticsService
from app.services.module_service import ModuleService
from app.services.preset_service import PresetService
from app.services.profile_service import ProfileService
from app.services.project_service import ProjectService
from app.services.recovery_service import RecoveryService
from app.services.search_service import SearchService
from app.services.settings_service import SettingsService
from app.services.storage_health_service import StorageHealthService
from app.services.workspace_service import WorkspaceService
from app.storage.cache_store import CacheStore
from app.storage.ini_settings_store import IniSettingsStore
from app.storage.json_document_store import JsonDocumentStore
from app.storage.sqlite_store import SQLiteStore
from app.storage.state_store import StateStore
from app.ui.app_shell_window import AppShellWindow


@dataclass(slots=True)
class BootstrapResult:
    success: bool
    message: str
    window: AppShellWindow | None = None


class AppBootstrap:
    def bootstrap(self) -> BootstrapResult:
        paths = build_app_paths()
        report = DependencyReport()
        try:
            StartupChecks(paths).run()
            report.add("Ordner und Datenbank sind bereit")
            context = self._build_context(paths, report)
            window = AppShellWindow(context)
            return BootstrapResult(True, report.summary(), window)
        except StartupError as exc:
            report.add(str(exc))
            return BootstrapResult(False, report.summary())

    def _build_context(self, paths, report: DependencyReport) -> AppContext:
        services = ServiceRegistry()
        event_bus = EventBus()
        settings_store = IniSettingsStore(paths.config_dir / "settings.ini")
        sqlite_store = SQLiteStore(paths.data_dir / "app.sqlite3")
        document_store = JsonDocumentStore(paths.projects_dir)
        state_store = StateStore(paths.state_dir)
        cache_store = CacheStore(paths.cache_dir)

        registry_items = {
            "settings": SettingsService(settings_store),
            "app_state": AppStateService(),
            "project": ProjectService(document_store),
            "workspace": WorkspaceService(state_store),
            "module": ModuleService(),
            "preset": PresetService(document_store),
            "coupling": CouplingService(sqlite_store),
            "profile": ProfileService(document_store),
            "search": SearchService(cache_store),
            "recovery": RecoveryService(state_store),
            "diagnostics": DiagnosticsService(paths.logs_dir),
            "storage_health": StorageHealthService(paths),
        }
        for name, service in registry_items.items():
            services.register(name, service)
        report.add("Grunddienste wurden registriert")
        return AppContext(paths=paths, services=services, event_bus=event_bus, dependency_report=report)
