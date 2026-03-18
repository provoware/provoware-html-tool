from dataclasses import dataclass


@dataclass(slots=True)
class AppStateService:
    active_project_name: str = "Kein Projekt offen"
    active_profile_name: str = "Standardprofil"
    save_status: str = "bereit"
