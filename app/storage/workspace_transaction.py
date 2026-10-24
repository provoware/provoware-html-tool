"""Absturzsichere Wiederherstellung zusammengehöriger Workspace-Dateien (Linux)."""

from __future__ import annotations

import base64
import binascii
import fcntl
import hashlib
import json
import os
from contextlib import contextmanager
from pathlib import Path

from app.utils.atomic_write import atomic_write_text


FILES = ("modules.json", "layout.json")
JOURNAL = ".workspace-transaction.json"
LOCK = ".workspace.lock"


def _sync_directory(directory: Path) -> None:
    descriptor = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


@contextmanager
def _project_lock(directory: Path):
    descriptor = os.open(directory / LOCK, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    try:
        fcntl.flock(descriptor, fcntl.LOCK_EX)
        yield
    finally:
        fcntl.flock(descriptor, fcntl.LOCK_UN)
        os.close(descriptor)


class WorkspaceTransaction:
    """Schreibt zwei Dateien mit dauerhaftem Rücksetzprotokoll."""

    def save(self, directory: Path, payloads: dict[str, dict]) -> None:
        if set(payloads) != set(FILES):
            raise ValueError("Workspace-Dateien sind unvollständig.")
        with _project_lock(directory):
            self._recover_locked(directory)
            before = {}
            for name in FILES:
                if (directory / name).is_symlink():
                    raise ValueError("Projektdatei ist eine Verknüpfung; Schreiben abgebrochen.")
                old = (directory / name).read_bytes()
                json.loads(old)
                before[name] = {
                    "data": base64.b64encode(old).decode("ascii"),
                    "sha256": hashlib.sha256(old).hexdigest(),
                }
            atomic_write_text(
                directory / JOURNAL,
                json.dumps({"version": 1, "before": before}, sort_keys=True) + "\n",
            )
            _sync_directory(directory)
            try:
                for name in FILES:
                    content = json.dumps(payloads[name], indent=2, ensure_ascii=False) + "\n"
                    atomic_write_text(directory / name, content)
            except Exception:
                self._recover_locked(directory)
                raise
            _sync_directory(directory)
            (directory / JOURNAL).unlink()
            _sync_directory(directory)

    def recover(self, directory: Path) -> bool:
        journal = directory / JOURNAL
        if not journal.exists() and not journal.is_symlink():
            return False
        with _project_lock(directory):
            return self._recover_locked(directory)

    def recover_all(self, base_dir: Path) -> int:
        if not base_dir.exists():
            return 0
        recovered = 0
        for directory in base_dir.iterdir():
            if directory.is_dir() and not directory.is_symlink():
                recovered += int(self.recover(directory))
        return recovered

    def _recover_locked(self, directory: Path) -> bool:
        journal = directory / JOURNAL
        if journal.is_symlink():
            raise ValueError("Workspace-Sicherung ist eine Verknüpfung; Wiederherstellung abgebrochen.")
        if not journal.exists():
            return False
        try:
            payload = json.loads(journal.read_text(encoding="utf-8"))
            if set(payload) != {"version", "before"} or payload["version"] != 1:
                raise ValueError("Unbekannte Protokollversion")
            if set(payload["before"]) != set(FILES):
                raise ValueError("Unvollständiges Protokoll")
            originals = {}
            for name in FILES:
                entry = payload["before"][name]
                if set(entry) != {"data", "sha256"}:
                    raise ValueError("Ungültiger Protokolleintrag")
                data = base64.b64decode(entry["data"], validate=True)
                if hashlib.sha256(data).hexdigest() != entry["sha256"]:
                    raise ValueError("Prüfsumme stimmt nicht")
                text = data.decode("utf-8")
                json.loads(text)
                originals[name] = text
        except (ValueError, TypeError, KeyError, UnicodeError, binascii.Error) as exc:
            raise ValueError("Workspace-Sicherung ist beschädigt; Dateien wurden nicht verändert.") from exc

        for name in FILES:
            if (directory / name).is_symlink():
                raise ValueError("Projektdatei ist eine Verknüpfung; Wiederherstellung abgebrochen.")
        for name in FILES:
            atomic_write_text(directory / name, originals[name])
        _sync_directory(directory)
        journal.unlink()
        _sync_directory(directory)
        return True
