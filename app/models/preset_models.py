from dataclasses import dataclass


@dataclass(slots=True)
class PresetRecord:
    name: str
