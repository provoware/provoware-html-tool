from __future__ import annotations

import json
from pathlib import Path

from app.utils.atomic_write import atomic_write_text


class StateStore:
    def __init__(self, base_dir: Path) -> None:
        self.base_dir = base_dir

    def write_json(self, relative_path: str, payload: dict) -> None:
        target = self.base_dir / relative_path
        target.parent.mkdir(parents=True, exist_ok=True)
        atomic_write_text(target, json.dumps(payload, indent=2, ensure_ascii=False) + "\n")

    def read_json(self, relative_path: str) -> dict | None:
        target = self.base_dir / relative_path
        if not target.exists():
            return None
        return json.loads(target.read_text(encoding="utf-8"))
