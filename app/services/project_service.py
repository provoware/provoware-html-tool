from __future__ import annotations

from app.models.project_models import ProjectRecord
from app.storage.json_document_store import JsonDocumentStore


class ProjectService:
    def __init__(self, document_store: JsonDocumentStore) -> None:
        self.document_store = document_store

    def create_project(self, name: str) -> ProjectRecord:
        project = ProjectRecord(name=name)
        self.document_store.write_project_bundle(project)
        return project
