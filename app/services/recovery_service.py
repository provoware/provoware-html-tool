from app.storage.state_store import StateStore


class RecoveryService:
    def __init__(self, state_store: StateStore) -> None:
        self.state_store = state_store
