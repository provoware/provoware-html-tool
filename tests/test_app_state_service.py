from app.services.app_state_service import AppStateService


def test_app_state_service_formats_check_and_backup_status() -> None:
    service = AppStateService(last_check_label="2026-03-18 09:15", last_backup_label="2026-03-18 08:45")

    assert service.check_status_text() == "Letzte Prüfung: 2026-03-18 09:15"
    assert service.backup_status_text() == "Letzte Sicherung: 2026-03-18 08:45"
