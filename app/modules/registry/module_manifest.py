from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from PySide6.QtWidgets import QWidget


@dataclass(frozen=True, slots=True)
class ModuleManifest:
    key: str
    name: str
    category: str
    description: str
    widget_factory: Callable[[], "QWidget"]
