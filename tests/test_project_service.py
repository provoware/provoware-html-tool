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


def test_workspace_write_failure_preserves_existing_json(tmp_path, monkeypatch):
    service = ProjectService(JsonDocumentStore(tmp_path))
    project = service.create_project("Schreibabbruch")
    service.save_workspace_state(project.slug, ["Editor"])
    project_dir = tmp_path / project.slug
    modules = project_dir / "modules.json"
    layout = project_dir / "layout.json"
    old_modules = modules.read_bytes()
    old_layout = layout.read_bytes()

    def fail_replace(source, target):
        raise OSError("Kein Speicherplatz")

    monkeypatch.setattr("app.utils.atomic_write.os.replace", fail_replace)
    with pytest.raises(OSError, match="Kein Speicherplatz"):
        service.save_workspace_state(project.slug, ["Wiki"])

    assert modules.read_bytes() == old_modules
    assert layout.read_bytes() == old_layout
    assert list(project_dir.glob(".modules.json.*.tmp")) == []


@pytest.mark.parametrize(
    ("first_name", "colliding_name"),
    [
        ("Mein Projekt", "Mein-Projekt"),
        ("Projekt!", "Projekt?"),
        ("Gleich", "Gleich"),
    ],
)
def test_project_slug_collision_preserves_existing_files(
    tmp_path, first_name, colliding_name
):
    service = ProjectService(JsonDocumentStore(tmp_path))
    original = service.create_project(first_name)
    project_dir = tmp_path / original.slug
    files = ("project.json", "layout.json", "modules.json", "couplings.json")
    (project_dir / "modules.json").write_text(
        '{"modules": [{"name": "Wichtiger Inhalt"}]}\\n', encoding="utf-8"
    )
    previous = {name: (project_dir / name).read_bytes() for name in files}

    with pytest.raises(ValueError, match="existiert bereits"):
        service.create_project(colliding_name)

    assert {name: (project_dir / name).read_bytes() for name in files} == previous


def test_project_creation_refuses_existing_empty_directory(tmp_path):
    project_dir = tmp_path / "belegter-pfad"
    project_dir.mkdir()
    service = ProjectService(JsonDocumentStore(tmp_path))

    with pytest.raises(ValueError, match="existiert bereits"):
        service.create_project("Belegter Pfad")

    assert list(project_dir.iterdir()) == []


def test_workspace_second_write_failure_restores_both_files(tmp_path, monkeypatch):
    from app.storage import workspace_transaction as transaction

    service = ProjectService(JsonDocumentStore(tmp_path))
    project = service.create_project("Rücksetzen")
    service.save_workspace_state(project.slug, ["Editor"])
    folder = tmp_path / project.slug
    original = {name: (folder / name).read_bytes() for name in transaction.FILES}
    real_write = transaction.atomic_write_text
    failed = False

    def fail_second(target, content):
        nonlocal failed
        if target.name == "layout.json" and not failed:
            failed = True
            raise OSError("Schreibabbruch")
        return real_write(target, content)

    monkeypatch.setattr(transaction, "atomic_write_text", fail_second)
    with pytest.raises(OSError, match="Schreibabbruch"):
        service.save_workspace_state(project.slug, ["Wiki"])
    assert {(folder / name).read_bytes() for name in transaction.FILES} == original
    assert not (folder / transaction.JOURNAL).exists()


def test_workspace_interrupted_process_recovers_on_restart(tmp_path, monkeypatch):
    from app.storage import workspace_transaction as transaction

    service = ProjectService(JsonDocumentStore(tmp_path))
    project = service.create_project("Absturz")
    service.save_workspace_state(project.slug, ["Editor"])
    folder = tmp_path / project.slug
    original = {name: (folder / name).read_bytes() for name in transaction.FILES}
    real_write = transaction.atomic_write_text

    def crash_before_layout(target, content):
        if target.name == "layout.json":
            raise SystemExit("simulierter Prozessabbruch")
        return real_write(target, content)

    monkeypatch.setattr(transaction, "atomic_write_text", crash_before_layout)
    with pytest.raises(SystemExit, match="Prozessabbruch"):
        service.save_workspace_state(project.slug, ["Wiki"])
    assert (folder / transaction.JOURNAL).exists()
    assert (folder / "modules.json").read_bytes() != original["modules.json"]

    monkeypatch.setattr(transaction, "atomic_write_text", real_write)
    assert transaction.WorkspaceTransaction().recover_all(tmp_path) == 1
    assert {(folder / name).read_bytes() for name in transaction.FILES} == original
    assert not (folder / transaction.JOURNAL).exists()


def test_workspace_corrupt_journal_fails_closed(tmp_path):
    from app.storage.workspace_transaction import JOURNAL, WorkspaceTransaction

    service = ProjectService(JsonDocumentStore(tmp_path))
    project = service.create_project("Beschädigt")
    folder = tmp_path / project.slug
    old_modules = (folder / "modules.json").read_bytes()
    old_layout = (folder / "layout.json").read_bytes()
    (folder / JOURNAL).write_text('{"version": 1, "before": {}}', encoding="utf-8")

    with pytest.raises(ValueError, match="beschädigt"):
        WorkspaceTransaction().recover_all(tmp_path)
    with pytest.raises(ValueError, match="beschädigt"):
        service.save_workspace_state(project.slug, ["Wiki"])
    assert (folder / "modules.json").read_bytes() == old_modules
    assert (folder / "layout.json").read_bytes() == old_layout


@pytest.mark.parametrize("slug", ["../fremd", ".", "/tmp/fremd", "foo/bar"])
def test_workspace_rejects_path_traversal(tmp_path, slug):
    service = ProjectService(JsonDocumentStore(tmp_path))
    with pytest.raises(ValueError, match="Ungültiger Projektordner"):
        service.save_workspace_state(slug, ["Editor"])
