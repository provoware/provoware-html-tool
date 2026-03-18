from app.paths import AppPaths


class StorageHealthService:
    def __init__(self, paths: AppPaths) -> None:
        self.paths = paths

    def summary(self) -> dict[str, bool]:
        return {
            "config": self.paths.config_dir.exists(),
            "state": self.paths.state_dir.exists(),
            "cache": self.paths.cache_dir.exists(),
        }
