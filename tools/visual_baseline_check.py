#!/usr/bin/env python3
"""Prüft Screenshot-Artefakt gegen eine freigegebene Visual-Baseline."""

from __future__ import annotations

import argparse
import hashlib
import shutil
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ARTIFACT_FILE = PROJECT_ROOT / "logs" / "artifacts" / "dashboard-dialog-e2e-chromium.png"
BASELINE_FILE = PROJECT_ROOT / "logs" / "artifacts" / "dashboard-dialog-e2e-chromium.baseline.png"
MIN_BYTES = 15_000


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Validiert, ob das Browser-Screenshot vorhanden, plausibel groß "
            "und mit der freigegebenen Baseline identisch ist."
        )
    )
    parser.add_argument(
        "--artifact",
        type=Path,
        default=ARTIFACT_FILE,
        help="Pfad zum Screenshot-Artefakt (Standard: logs/artifacts/dashboard-dialog-e2e-chromium.png)",
    )
    parser.add_argument(
        "--baseline",
        type=Path,
        default=BASELINE_FILE,
        help=(
            "Pfad zur freigegebenen Baseline "
            "(Standard: logs/artifacts/dashboard-dialog-e2e-chromium.baseline.png)"
        ),
    )
    parser.add_argument(
        "--min-bytes",
        type=int,
        default=MIN_BYTES,
        help="Mindestgröße in Bytes, damit ein leeres/defektes Bild auffällt.",
    )
    parser.add_argument(
        "--accept-current",
        action="store_true",
        help="Aktuelles Artefakt als neue Baseline übernehmen (nur nach manueller Sichtprüfung).",
    )
    return parser.parse_args()


def fail(message: str, next_step: str) -> int:
    print_step("❌", message)
    print_step("➡️", f"Nächster Schritt: {next_step}")
    return 1


def sha256sum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(8192), b""):
            digest.update(chunk)
    return digest.hexdigest()


def update_baseline(source: Path, baseline: Path) -> None:
    baseline.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, baseline)


def main() -> int:
    args = parse_args()

    artifact = args.artifact
    baseline = args.baseline
    min_bytes = args.min_bytes

    if min_bytes <= 0:
        return fail(
            f"Ungültiger Wert für --min-bytes: {min_bytes}.",
            "Positive Zahl setzen, z. B. --min-bytes 15000, und erneut ausführen.",
        )

    if not artifact.exists():
        return fail(
            f"Visual-Baseline fehlt: Screenshot nicht gefunden ({artifact}).",
            "Zuerst 'python3 tools/browser_e2e_test.py --browser chromium' ausführen, dann diesen Check wiederholen.",
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

    if args.accept_current:
        update_baseline(artifact, baseline)
        print_step("✅", f"Baseline aktualisiert: {baseline} wurde aus {artifact} übernommen.")
        print_step("➡️", "Nächster Schritt: Änderung im Team kurz visuell prüfen und Commit erstellen.")
        return 0

    if not baseline.exists():
        return fail(
            f"Visual-Baseline fehlt: Freigegebene Baseline nicht gefunden ({baseline}).",
            "Einmalig visuell prüfen und dann 'python3 tools/visual_baseline_check.py --accept-current' ausführen.",
        )

    if baseline.suffix.lower() != ".png":
        return fail(
            f"Visual-Baseline ungültig: Baseline muss PNG sein, gefunden: {baseline.suffix or 'ohne Endung'}.",
            "Baseline als PNG speichern und den Check erneut ausführen.",
        )

    artifact_hash = sha256sum(artifact)
    baseline_hash = sha256sum(baseline)
    if artifact_hash != baseline_hash:
        return fail(
            "Visual-Baseline-Abweichung erkannt: Aktuelles Screenshot unterscheidet sich von der freigegebenen Baseline.",
            "Screenshot manuell prüfen. Bei gewollter Änderung 'python3 tools/visual_baseline_check.py --accept-current' ausführen.",
        )

    print_step("✅", f"Visual-Baseline-Check bestanden: Artefakt ({artifact}) stimmt mit Baseline ({baseline}) überein.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
