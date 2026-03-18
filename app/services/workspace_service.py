from app.storage.state_store import StateStore


class WorkspaceService:
    def __init__(self, state_store: StateStore) -> None:
        self.state_store = state_store

    def save_layout(self, project_name: str, layout: dict) -> None:
        self.state_store.write_json(f"{project_name}/layout.json", layout)
