from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class DependencyReport:
    entries: list[str] = field(default_factory=list)

    def add(self, message: str) -> None:
        self.entries.append(message)

    def summary(self) -> str:
        return " | ".join(self.entries) if self.entries else "Alle Startabhängigkeiten sind bereit."
