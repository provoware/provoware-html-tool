from dataclasses import dataclass


@dataclass(slots=True)
class ModuleRecord:
    key: str
    name: str
    category: str
