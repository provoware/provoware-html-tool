from app.storage.ini_settings_store import IniSettingsStore


class SettingsService:
    def __init__(self, settings_store: IniSettingsStore) -> None:
        self.settings_store = settings_store
