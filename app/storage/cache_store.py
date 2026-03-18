from pathlib import Path


class CacheStore:
    def __init__(self, base_dir: Path) -> None:
        self.base_dir = base_dir
