from app.services.app_state_service import AppStateService


def test_app_state_service_formats_check_backup_and_helper_status() -> None:
    service = AppStateService(
        active_project_name="Kampagne Nord",
        last_check_label="2026-03-18 09:15",
        last_backup_label="2026-03-18 08:45",
    )

    assert service.search_helper_text() == "Schnellhilfe: Suche in Kampagne Nord zum Beispiel nach einem Modul oder Hilfe."
    assert service.check_status_text() == "Letzte Prüfung: 2026-03-18 09:15 · Grund: Nicht angegeben"
    assert service.backup_status_text() == "Letzte Sicherung: 2026-03-18 08:45 · Grund: Nicht angegeben"
    assert service.status_summary_text() == "Prüfung 2026-03-18 09:15 (Nicht angegeben) · Sicherung 2026-03-18 08:45 (Nicht angegeben)"
    assert service.search_status_text() == "Suche bereit für Kampagne Nord"
    assert service.system_status_text() == "System ruhig und startklar"


def test_default_state_does_not_invent_check_or_backup_timestamps() -> None:
    service = AppStateService()
    assert service.last_check_label is None
    assert service.last_backup_label is None
    assert service.check_status_text() == "Prüfung: Noch nicht durchgeführt"
    assert service.backup_status_text() == "Sicherung: Noch nicht durchgeführt"
    assert service.check_hint_text() == "Noch keine Prüfung"
    assert service.backup_hint_text() == "Noch keine Sicherung"
    assert service.status_summary_text() == (
        "Prüfung noch nicht durchgeführt · Sicherung noch nicht durchgeführt"
    )
