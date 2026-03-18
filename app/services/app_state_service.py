from dataclasses import dataclass, field

from app.utils.time_utils import timestamp_label


@dataclass(slots=True)
class AppStateService:
    active_project_name: str = "Kein Projekt offen"
    active_profile_name: str = "Standardprofil"
    save_status: str = "bereit"
    last_check_label: str = field(default_factory=timestamp_label)
    last_backup_label: str = field(default_factory=timestamp_label)

    def search_helper_text(self) -> str:
        if self.active_project_name == "Kein Projekt offen":
            return "Schnellhilfe: Suche nach Projekten, Modulen oder Hilfe."
        return f"Schnellhilfe: Suche in {self.active_project_name} nach Modulen oder Hilfe."

    def check_status_text(self) -> str:
        return f"Letzte Prüfung: {self.last_check_label}"

    def backup_status_text(self) -> str:
        return f"Letzte Sicherung: {self.last_backup_label}"

    def search_status_text(self) -> str:
        if self.active_project_name == "Kein Projekt offen":
            return "Suche bereit, sobald du etwas eingibst"
        return f"Suche bereit für {self.active_project_name}"

    def system_status_text(self) -> str:
        if self.save_status == "bereit":
            return "System ruhig und startklar"
        return f"System meldet Speichern {self.save_status}"
