from dataclasses import dataclass, field

from app.utils.time_utils import timestamp_label


@dataclass(slots=True)
class AppStateService:
    active_project_name: str = "Kein Projekt offen"
    active_profile_name: str = "Standardprofil"
    save_status: str = "bereit"
    last_check_label: str = field(default_factory=timestamp_label)
    last_backup_label: str = field(default_factory=timestamp_label)

    def check_status_text(self) -> str:
        return f"Letzte Prüfung: {self.last_check_label}"

    def backup_status_text(self) -> str:
        return f"Letzte Sicherung: {self.last_backup_label}"
