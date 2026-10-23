from dataclasses import dataclass


@dataclass(slots=True)
class AppStateService:
    active_project_name: str = "Kein Projekt offen"
    active_profile_name: str = "Standardprofil"
    save_status: str = "bereit"
    last_check_label: str | None = None
    last_backup_label: str | None = None
    check_reason: str = "Nicht angegeben"
    backup_reason: str = "Nicht angegeben"

    def search_helper_text(self) -> str:
        if self.active_project_name == "Kein Projekt offen":
            return "Schnellhilfe: Gib zum Beispiel einen Projektnamen, ein Modul oder Hilfe ein."
        return f"Schnellhilfe: Suche in {self.active_project_name} zum Beispiel nach einem Modul oder Hilfe."

    def check_status_text(self) -> str:
        if self.last_check_label is None:
            return "Prüfung: Noch nicht durchgeführt"
        return f"Letzte Prüfung: {self.last_check_label} · Grund: {self.check_reason}"

    def check_hint_text(self) -> str:
        return f"Prüfung zuletzt {self.last_check_label}" if self.last_check_label else "Noch keine Prüfung"

    def backup_status_text(self) -> str:
        if self.last_backup_label is None:
            return "Sicherung: Noch nicht durchgeführt"
        return f"Letzte Sicherung: {self.last_backup_label} · Grund: {self.backup_reason}"

    def backup_hint_text(self) -> str:
        return f"Sicherung zuletzt {self.last_backup_label}" if self.last_backup_label else "Noch keine Sicherung"

    def status_summary_text(self) -> str:
        check = (
            f"Prüfung {self.last_check_label} ({self.check_reason})"
            if self.last_check_label else "Prüfung noch nicht durchgeführt"
        )
        backup = (
            f"Sicherung {self.last_backup_label} ({self.backup_reason})"
            if self.last_backup_label else "Sicherung noch nicht durchgeführt"
        )
        return f"{check} · {backup}"

    def search_status_text(self) -> str:
        if self.active_project_name == "Kein Projekt offen":
            return "Suche bereit, sobald du etwas eingibst"
        return f"Suche bereit für {self.active_project_name}"

    def system_status_text(self) -> str:
        if self.save_status == "bereit":
            return "System ruhig und startklar"
        return f"System meldet Speichern {self.save_status}"
