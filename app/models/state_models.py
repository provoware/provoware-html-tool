from dataclasses import dataclass


@dataclass(slots=True)
class SessionState:
    active_project: str = ""
