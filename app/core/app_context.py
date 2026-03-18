from __future__ import annotations

from dataclasses import dataclass

from app.bootstrap.dependency_report import DependencyReport
from app.core.event_bus import EventBus
from app.core.service_registry import ServiceRegistry
from app.paths import AppPaths


@dataclass(slots=True)
class AppContext:
    paths: AppPaths
    services: ServiceRegistry
    event_bus: EventBus
    dependency_report: DependencyReport
