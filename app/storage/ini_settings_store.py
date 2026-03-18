from __future__ import annotations

from configparser import ConfigParser
from pathlib import Path


class IniSettingsStore:
    def __init__(self, path: Path) -> None:
        self.path = path

    def load(self) -> ConfigParser:
        parser = ConfigParser()
        if self.path.exists():
            parser.read(self.path, encoding="utf-8")
        return parser
