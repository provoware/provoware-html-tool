from app.storage.state_store import StateStore


class RecoveryService:
    def __init__(self, state_store: StateStore) -> None:
        self.state_store = state_store

    def save_session(self, active_project: str | None, open_projects: list[str], open_modules: list[str]) -> None:
        self.state_store.write_json(
            "session/last_session.json",
            {
                "active_project": active_project,
                "open_projects": open_projects,
                "open_modules": open_modules,
            },
        )

    def load_session(self) -> dict:
        session = self.state_store.read_json("session/last_session.json")
        if session is None:
            return {"active_project": None, "open_projects": [], "open_modules": []}
        return {
            "active_project": session.get("active_project"),
            "open_projects": list(session.get("open_projects", [])),
            "open_modules": list(session.get("open_modules", [])),
        }
