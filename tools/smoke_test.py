#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
START_SCRIPT = PROJECT_ROOT / "start.sh"


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


if not START_SCRIPT.exists():
    print_step("❌", "Smoke-Test abgebrochen: start.sh fehlt.")
    print_step("➡️", "Nächster Schritt: Repository vollständig laden und erneut testen.")
    sys.exit(1)

print_step("✅", "Smoke-Test gestartet: ./start.sh --check")
result = subprocess.run(
    ["bash", str(START_SCRIPT), "--check"],
    cwd=PROJECT_ROOT,
    text=True,
    capture_output=True,
)

if result.returncode != 0:
    print_step("❌", "Smoke-Test fehlgeschlagen: --check lieferte Fehler.")
    print(result.stdout)
    print(result.stderr)
    print_step("➡️", "Nächster Schritt: './start.sh --check --debug' ausführen und Log prüfen.")
    sys.exit(result.returncode)

if "Check-Modus aktiv" not in result.stdout:
    print_step("❌", "Smoke-Test fehlgeschlagen: erwartete Erfolgsausgabe fehlt.")
    print_step("➡️", "Nächster Schritt: Ausgabe von './start.sh --check' prüfen.")
    sys.exit(1)

print_step("✅", "Smoke-Test bestanden: --check läuft mit verständlicher Ausgabe.")
