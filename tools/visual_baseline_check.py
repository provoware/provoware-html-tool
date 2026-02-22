#!/usr/bin/env python3
"""Prüft das Browser-Screenshot-Artefakt als einfachen Visual-Baseline-Schutz."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ARTIFACT_FILE = PROJECT_ROOT / "logs" / "artifacts" / "dashboard-dialog-e2e.png"
MIN_BYTES = 15_000


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Validiert, ob das Browser-Screenshot als Visual-Baseline vorhanden ist "
            "und eine sinnvolle Dateigröße hat."
        )
    )
    parser.add_argument(
        "--artifact",
        type=Path,
        default=ARTIFACT_FILE,
        help="Pfad zum Screenshot-Artefakt (Standard: logs/artifacts/dashboard-dialog-e2e.png)",
    )
    parser.add_argument(
        "--min-bytes",
        type=int,
        default=MIN_BYTES,
        help="Mindestgröße in Bytes, damit ein leeres/defektes Bild auffällt.",
    )
    return parser.parse_args()


def fail(message: str, next_step: str) -> int:
    print_step("❌", message)
    print_step("➡️", f"Nächster Schritt: {next_step}")
    return 1


def main() -> int:
    args = parse_args()

    artifact = args.artifact
    min_bytes = args.min_bytes

    if min_bytes <= 0:
        return fail(
            f"Ungültiger Wert für --min-bytes: {min_bytes}.",
            "Positive Zahl setzen, z. B. --min-bytes 15000, und erneut ausführen.",
        )

    if not artifact.exists():
        return fail(
            f"Visual-Baseline fehlt: Screenshot nicht gefunden ({artifact}).",
            "Zuerst 'python3 tools/browser_e2e_test.py' ausführen, dann diesen Check wiederholen.",
        )

    if artifact.suffix.lower() != ".png":
        return fail(
            f"Visual-Baseline ungültig: Erwartet wird eine PNG-Datei, gefunden: {artifact.suffix or 'ohne Endung'}.",
            "Screenshot als PNG speichern und den Check erneut starten.",
        )

    file_size = artifact.stat().st_size
    if file_size < min_bytes:
        return fail(
            f"Visual-Baseline verdächtig klein ({file_size} Bytes, erwartet mindestens {min_bytes} Bytes).",
            "Browser-E2E erneut ausführen und prüfen, ob das Dashboard vollständig geladen wurde.",
        )

    print_step("✅", f"Visual-Baseline-Check bestanden: Artefakt ist vorhanden ({artifact}) und plausibel groß ({file_size} Bytes).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
