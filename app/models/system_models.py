from dataclasses import dataclass


@dataclass(slots=True)
class SystemStatus:
    ready: bool
    message: str
