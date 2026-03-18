from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(slots=True)
class AppPaths:
    root_dir: Path
    data_dir: Path
    config_dir: Path
    state_dir: Path
    cache_dir: Path
    projects_dir: Path
    logs_dir: Path
    resources_dir: Path
    schemas_dir: Path


def build_app_paths(root_dir: Path | None = None) -> AppPaths:
    base = (root_dir or Path(__file__).resolve().parent.parent).resolve()
    data_dir = base / "runtime_data"
    config_dir = data_dir / "config"
    state_dir = data_dir / "state"
    cache_dir = data_dir / "cache"
    projects_dir = data_dir / "projects"
    logs_dir = data_dir / "logs"
    return AppPaths(
        root_dir=base,
        data_dir=data_dir,
        config_dir=config_dir,
        state_dir=state_dir,
        cache_dir=cache_dir,
        projects_dir=projects_dir,
        logs_dir=logs_dir,
        resources_dir=base / "resources",
        schemas_dir=base / "schemas",
    )
