from dataclasses import dataclass, field

from app.utils.time_utils import timestamp_label


@dataclass(slots=True)
class AppStateService:
    active_project_name: str = "Kein Projekt offen"
    active_profile_name: str = "Standardprofil"
    save_status: str = "bereit"
    last_check_label: str = field(default_factory=timestamp_label)
    last_backup_label: str = field(default_factory=timestamp_label)
    check_reason: str = "Startcheck"
    backup_reason: str = "Basisstand"

    def search_helper_text(self) -> str:
        if self.active_project_name == "Kein Projekt offen":
            return "Schnellhilfe: Gib zum Beispiel einen Projektnamen, ein Modul oder Hilfe ein."
        return f"Schnellhilfe: Suche in {self.active_project_name} zum Beispiel nach einem Modul oder Hilfe."

    def check_status_text(self) -> str:
        return f"Letzte Prüfung: {self.last_check_label} · Grund: {self.check_reason}"

    def check_hint_text(self) -> str:
        return f"Prüfung zuletzt {self.last_check_label}"

    def backup_status_text(self) -> str:
        return f"Letzte Sicherung: {self.last_backup_label} · Grund: {self.backup_reason}"

    def backup_hint_text(self) -> str:
        return f"Sicherung zuletzt {self.last_backup_label}"

    def status_summary_text(self) -> str:
        return (
            f"Prüfung {self.last_check_label} ({self.check_reason})"
            f" · Sicherung {self.last_backup_label} ({self.backup_reason})"
        )

    def search_status_text(self) -> str:
        if self.active_project_name == "Kein Projekt offen":
            return "Suche bereit, sobald du etwas eingibst"
        return f"Suche bereit für {self.active_project_name}"

    def system_status_text(self) -> str:
        if self.save_status == "bereit":
            return "System ruhig und startklar"
        return f"System meldet Speichern {self.save_status}"
