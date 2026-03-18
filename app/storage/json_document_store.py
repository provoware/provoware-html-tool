from __future__ import annotations

import json
from pathlib import Path

from app.models.project_models import ProjectRecord
from app.utils.atomic_write import atomic_write_text


class JsonDocumentStore:
    def __init__(self, base_dir: Path) -> None:
        self.base_dir = base_dir

    def write_project_bundle(self, project: ProjectRecord) -> None:
        project_dir = self.base_dir / project.slug
        project_dir.mkdir(parents=True, exist_ok=True)
        payloads = {
            "project.json": {"name": project.name, "slug": project.slug, "version": 1},
            "layout.json": {"docks": []},
            "modules.json": {"modules": []},
            "couplings.json": {"couplings": []},
        }
        for file_name, payload in payloads.items():
            atomic_write_text(project_dir / file_name, json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
