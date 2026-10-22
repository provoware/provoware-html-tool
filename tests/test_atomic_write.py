from __future__ import annotations

import os

import pytest

from app.utils.atomic_write import atomic_write_text


def test_atomic_write_replaces_file_without_leaving_temporary_files(tmp_path):
    target = tmp_path / "status.json"
    atomic_write_text(target, '{"version": 1}\n')
    atomic_write_text(target, '{"version": 2, "text": "Grüße"}\n')

    assert target.read_text(encoding="utf-8") == '{"version": 2, "text": "Grüße"}\n'
    assert list(tmp_path.glob(".status.json.*.tmp")) == []


def test_atomic_write_keeps_original_and_cleans_up_if_replace_fails(tmp_path, monkeypatch):
    target = tmp_path / "status.json"
    target.write_text("unverändert", encoding="utf-8")

    def fail_replace(source, destination):
        assert os.fspath(destination) == os.fspath(target)
        assert os.path.exists(source)
        raise OSError("Datenträger voll")

    monkeypatch.setattr("app.utils.atomic_write.os.replace", fail_replace)

    with pytest.raises(OSError, match="Datenträger voll"):
        atomic_write_text(target, "neuer Inhalt")

    assert target.read_text(encoding="utf-8") == "unverändert"
    assert list(tmp_path.iterdir()) == [target]
