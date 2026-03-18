from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class WorkspaceStateAdapter:
    active_project_name: str = "Kein Projekt offen"
    layout_loaded: bool = False
