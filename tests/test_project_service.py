import json

import pytest

from app.services.project_service import ProjectService
from app.storage.json_document_store import JsonDocumentStore


def test_project_service_creates_required_project_files(tmp_path):
    service = ProjectService(JsonDocumentStore(tmp_path))
    project = service.create_project("Mein Testprojekt")
    project_dir = tmp_path / project.slug
    assert json.loads((project_dir / "project.json").read_text(encoding="utf-8"))["name"] == "Mein Testprojekt"
    assert (project_dir / "layout.json").exists()
    assert (project_dir / "modules.json").exists()
    assert (project_dir / "couplings.json").exists()


def test_project_service_uses_safe_fallback_name_for_empty_input(tmp_path):
    service = ProjectService(JsonDocumentStore(tmp_path))

    project = service.create_project("   ")

    project_dir = tmp_path / project.slug
    assert project.name == "Neues Projekt"
    assert project.slug == "neues-projekt"
    assert json.loads((project_dir / "project.json").read_text(encoding="utf-8"))["name"] == "Neues Projekt"


def test_project_service_reports_missing_output_files(tmp_path):
    service = ProjectService(JsonDocumentStore(tmp_path))
    original_write_project_bundle = service.document_store.write_project_bundle

    def broken_write(project):
        original_write_project_bundle(project)
        (tmp_path / project.slug / "modules.json").unlink()

    service.document_store.write_project_bundle = broken_write

    with pytest.raises(ValueError, match="modules.json"):
        service.create_project("Fehlender Output")


def test_project_service_persists_open_modules_and_layout(tmp_path):
    service = ProjectService(JsonDocumentStore(tmp_path))
    project = service.create_project("Mit Modulen")

    service.save_workspace_state(project.slug, ["Editor", "Wiki"])

    project_dir = tmp_path / project.slug
    modules_payload = json.loads((project_dir / "modules.json").read_text(encoding="utf-8"))
    layout_payload = json.loads((project_dir / "layout.json").read_text(encoding="utf-8"))
    assert modules_payload == {"modules": [{"name": "Editor"}, {"name": "Wiki"}]}
    assert layout_payload == {"docks": [{"title": "Editor", "area": "right"}, {"title": "Wiki", "area": "right"}]}
