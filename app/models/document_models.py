from dataclasses import dataclass


@dataclass(slots=True)
class DocumentRecord:
    title: str
    body: str
