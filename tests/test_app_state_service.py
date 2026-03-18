from app.services.app_state_service import AppStateService


def test_app_state_service_formats_check_backup_and_helper_status() -> None:
    service = AppStateService(
        active_project_name="Kampagne Nord",
        last_check_label="2026-03-18 09:15",
        last_backup_label="2026-03-18 08:45",
    )

    assert service.search_helper_text() == "Schnellhilfe: Suche in Kampagne Nord zum Beispiel nach einem Modul oder Hilfe."
    assert service.check_status_text() == "Letzte Prüfung: 2026-03-18 09:15"
    assert service.backup_status_text() == "Letzte Sicherung: 2026-03-18 08:45"
    assert service.status_summary_text() == "Prüfung 2026-03-18 09:15 · Sicherung 2026-03-18 08:45"
    assert service.search_status_text() == "Suche bereit für Kampagne Nord"
    assert service.system_status_text() == "System ruhig und startklar"
