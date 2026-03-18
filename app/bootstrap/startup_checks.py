from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import sqlite3

from app.core.errors import StartupError
from app.paths import AppPaths


@dataclass(slots=True)
class StartupChecks:
    paths: AppPaths

    def run(self) -> None:
        self._ensure_directories()
        self._ensure_sqlite_ready()

    def _ensure_directories(self) -> None:
        for path in (
            self.paths.data_dir,
            self.paths.config_dir,
            self.paths.state_dir,
            self.paths.cache_dir,
            self.paths.projects_dir,
            self.paths.logs_dir,
        ):
            try:
                path.mkdir(parents=True, exist_ok=True)
            except OSError as exc:
                raise StartupError(f"Der Ordner {path} konnte nicht vorbereitet werden.") from exc

    def _ensure_sqlite_ready(self) -> None:
        sqlite_path = self.paths.data_dir / "app.sqlite3"
        try:
            with sqlite3.connect(sqlite_path) as connection:
                connection.execute("create table if not exists healthcheck(id integer primary key, note text)")
        except sqlite3.Error as exc:
            raise StartupError("Die lokale Datenbank konnte nicht vorbereitet werden.") from exc
