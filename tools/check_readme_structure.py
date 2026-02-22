#!/usr/bin/env python3
"""Prüft, ob README die Pflichtanker für Einsteiger sichtbar enthält."""

from __future__ import annotations

from pathlib import Path
import re
import sys

PROJECT_ROOT = Path(__file__).resolve().parent.parent
README_PATH = PROJECT_ROOT / "README.md"

TOP_HEADING = "## Wichtigste Befehle (Sofort sichtbar)"
BOTTOM_HEADING = "## Konsolen-Spickzettel (immer unten angehängt)"

TOP_COMMANDS = [
    "bash start.sh --check",
    "bash start.sh --repair",
    "bash start.sh --full-gates",
    "bash start.sh --release-check",
    "cat logs/status_summary.txt",
]

BOTTOM_COMMANDS = [
    "bash start.sh --check",
    "bash start.sh --repair",
    "bash start.sh --format",
    "bash start.sh --test",
    "bash start.sh --full-gates",
    "bash start.sh --release-check",
    "cat logs/status_summary.txt",
]


def extract_section(markdown: str, heading: str) -> str:
    pattern = re.compile(rf"^##\s+{re.escape(heading[3:])}\s*$", re.MULTILINE)
    match = pattern.search(markdown)
    if not match:
        raise ValueError(f"Pflichtbereich fehlt: '{heading}'")

    start = match.end()
    following = re.search(r"^##\s+", markdown[start:], flags=re.MULTILINE)
    end = start + following.start() if following else len(markdown)
    return markdown[start:end]


def ensure_codeblock_commands(section: str, required_commands: list[str], area_label: str) -> None:
    blocks = re.findall(r"```bash\n(.*?)```", section, flags=re.DOTALL)
    if not blocks:
        raise ValueError(f"{area_label}: Kein Bash-Codeblock gefunden.")

    block_text = "\n".join(blocks)
    missing = [cmd for cmd in required_commands if cmd not in block_text]
    if missing:
        joined = ", ".join(missing)
        raise ValueError(f"{area_label}: Pflichtbefehle fehlen: {joined}")


def main() -> int:
    if not README_PATH.exists():
        print("❌ README-Prüfung fehlgeschlagen: README.md fehlt.")
        print("➡️ Nächster Schritt: Datei wiederherstellen und Prüfung erneut starten.")
        return 1

    content = README_PATH.read_text(encoding="utf-8")

    try:
        top_section = extract_section(content, TOP_HEADING)
        bottom_section = extract_section(content, BOTTOM_HEADING)
        ensure_codeblock_commands(top_section, TOP_COMMANDS, "Top-Block")
        ensure_codeblock_commands(bottom_section, BOTTOM_COMMANDS, "Spickzettel")
    except ValueError as exc:
        print(f"❌ README-Prüfung fehlgeschlagen: {exc}")
        print("➡️ Nächster Schritt: README gemäß Projektstandard ergänzen und erneut prüfen.")
        return 1

    print("✅ README-Struktur gültig: Top-Befehle und Spickzettel sind vollständig.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
