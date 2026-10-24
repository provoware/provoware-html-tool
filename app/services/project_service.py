from __future__ import annotations

from pathlib import Path

from app.models.project_models import ProjectRecord
from app.storage.json_document_store import JsonDocumentStore
from app.storage.workspace_transaction import WorkspaceTransaction
from app.utils.validation import require_text


class ProjectService:
    def __init__(self, document_store: JsonDocumentStore) -> None:
        self.document_store = document_store

    def create_project(self, name: str) -> ProjectRecord:
        project = ProjectRecord(name=require_text(name, "Neues Projekt"))
        self.document_store.write_project_bundle(project)
        project_dir = self.document_store.base_dir / project.slug
        required_files = ("project.json", "layout.json", "modules.json", "couplings.json")
        missing_files = [file_name for file_name in required_files if not (project_dir / file_name).exists()]
        if missing_files:
            missing_text = ", ".join(missing_files)
            raise ValueError(f"Projekt konnte nicht vollständig gespeichert werden: {missing_text}")
        return project

    def save_workspace_state(self, project_slug: str, open_modules: list[str]) -> None:
        if not project_slug or Path(project_slug).name != project_slug or project_slug in {".", ".."}:
            raise ValueError("Ungültiger Projektordner.")
        project_dir = self.document_store.base_dir / project_slug
        if project_dir.is_symlink() or not project_dir.is_dir():
            raise ValueError("Projektordner wurde nicht gefunden.")

        payloads = {
            "modules.json": {"modules": [{"name": name} for name in open_modules]},
            "layout.json": {"docks": [{"title": name, "area": "right"} for name in open_modules]},
        }
        WorkspaceTransaction().save(project_dir, payloads)
