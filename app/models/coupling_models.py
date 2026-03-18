from dataclasses import dataclass


@dataclass(slots=True)
class CouplingRecord:
    source: str
    target: str
