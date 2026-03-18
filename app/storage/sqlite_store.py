from __future__ import annotations

from pathlib import Path
import sqlite3


class SQLiteStore:
    def __init__(self, path: Path) -> None:
        self.path = path

    def connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.path)
