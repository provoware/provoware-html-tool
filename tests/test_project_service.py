import json

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
