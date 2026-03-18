from pathlib import Path


class DiagnosticsService:
    def __init__(self, logs_dir: Path) -> None:
        self.logs_dir = logs_dir
