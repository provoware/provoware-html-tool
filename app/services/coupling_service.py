from app.storage.sqlite_store import SQLiteStore


class CouplingService:
    def __init__(self, sqlite_store: SQLiteStore) -> None:
        self.sqlite_store = sqlite_store
