from __future__ import annotations

from dataclasses import dataclass, field

from app.utils.text_utils import slugify


@dataclass(slots=True)
class ProjectRecord:
    name: str
    slug: str = field(init=False)

    def __post_init__(self) -> None:
        self.slug = slugify(self.name)
