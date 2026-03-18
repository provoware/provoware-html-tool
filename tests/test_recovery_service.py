from app.services.recovery_service import RecoveryService
from app.storage.state_store import StateStore


def test_recovery_service_returns_empty_session_without_file(tmp_path):
    service = RecoveryService(StateStore(tmp_path))

    session = service.load_session()

    assert session == {"active_project": None, "open_projects": [], "open_modules": []}


def test_recovery_service_saves_and_loads_last_session(tmp_path):
    service = RecoveryService(StateStore(tmp_path))

    service.save_session("mein-projekt", ["mein-projekt"], ["Editor", "Wiki"])

    session = service.load_session()
    assert session == {
        "active_project": "mein-projekt",
        "open_projects": ["mein-projekt"],
        "open_modules": ["Editor", "Wiki"],
    }
