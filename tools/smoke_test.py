#!/usr/bin/env python3
import json
import re
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
START_SCRIPT = PROJECT_ROOT / "start.sh"
DASHBOARD_TEMPLATE = PROJECT_ROOT / "templates" / "dashboard_musterseite.html"
THEME_CONFIG = PROJECT_ROOT / "config" / "themes.json"


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


if not START_SCRIPT.exists():
    print_step("❌", "Smoke-Test abgebrochen: start.sh fehlt.")
    print_step("➡️", "Nächster Schritt: Repository vollständig laden und erneut testen.")
    sys.exit(1)

if not DASHBOARD_TEMPLATE.exists():
    print_step("❌", "Smoke-Test abgebrochen: dashboard_musterseite.html fehlt.")
    print_step("➡️", "Nächster Schritt: Template-Datei unter templates/ ergänzen.")
    sys.exit(1)

if not THEME_CONFIG.exists():
    print_step("❌", "Smoke-Test abgebrochen: config/themes.json fehlt.")
    print_step("➡️", "Nächster Schritt: Theme-Konfiguration anlegen und erneut testen.")
    sys.exit(1)

print_step("✅", "Smoke-Test gestartet: ./start.sh --check")
check_result = subprocess.run(
    ["bash", str(START_SCRIPT), "--check"],
    cwd=PROJECT_ROOT,
    text=True,
    capture_output=True,
)

if check_result.returncode != 0:
    print_step("❌", "Smoke-Test fehlgeschlagen: --check lieferte Fehler.")
    print(check_result.stdout)
    print(check_result.stderr)
    print_step("➡️", "Nächster Schritt: './start.sh --check --debug' ausführen und Log prüfen.")
    sys.exit(check_result.returncode)

if "Check-Modus aktiv" not in check_result.stdout:
    print_step("❌", "Smoke-Test fehlgeschlagen: erwartete Erfolgsausgabe fehlt.")
    print_step("➡️", "Nächster Schritt: Ausgabe von './start.sh --check' prüfen.")
    sys.exit(1)

print_step("✅", "Smoke-Test erweitert: ./start.sh --dashboard-template")
template_result = subprocess.run(
    ["bash", str(START_SCRIPT), "--dashboard-template"],
    cwd=PROJECT_ROOT,
    text=True,
    capture_output=True,
)

if template_result.returncode != 0:
    print_step("❌", "Smoke-Test fehlgeschlagen: --dashboard-template lieferte Fehler.")
    print(template_result.stdout)
    print(template_result.stderr)
    print_step("➡️", "Nächster Schritt: Template-Marker prüfen und erneut testen.")
    sys.exit(template_result.returncode)

if "einsatzbereit" not in template_result.stdout:
    print_step("❌", "Smoke-Test fehlgeschlagen: Template-Erfolgsausgabe fehlt.")
    print_step("➡️", "Nächster Schritt: Startausgabe von '--dashboard-template' prüfen.")
    sys.exit(1)

content = DASHBOARD_TEMPLATE.read_text(encoding="utf-8")
required_markers = [
    'data-theme-switcher',
    'id="error-dialog"',
    'data-action="retry"',
    'data-action="repair"',
    'data-action="log"',
    'class="skip-link"',
    'aria-modal="true"',
]
missing = [marker for marker in required_markers if marker not in content]
if missing:
    print_step("❌", f"Smoke-Test fehlgeschlagen: Pflichtmarker fehlen: {', '.join(missing)}")
    print_step("➡️", "Nächster Schritt: HTML-Template ergänzen und Smoke-Test neu starten.")
    sys.exit(1)

try:
    theme_data = json.loads(THEME_CONFIG.read_text(encoding="utf-8"))
except json.JSONDecodeError:
    print_step("❌", "Smoke-Test fehlgeschlagen: config/themes.json ist ungültiges JSON.")
    print_step("➡️", "Nächster Schritt: JSON-Syntax in config/themes.json korrigieren.")
    sys.exit(1)

themes = theme_data.get("themes", [])
if not isinstance(themes, list) or not themes:
    print_step("❌", "Smoke-Test fehlgeschlagen: config/themes.json enthält keine Themes.")
    print_step("➡️", "Nächster Schritt: Mindestens ein Theme in 'themes' eintragen.")
    sys.exit(1)

invalid_themes = [name for name in themes if not isinstance(name, str) or not re.fullmatch(r"[a-z][a-z0-9-]{1,30}", name)]
if invalid_themes:
    print_step("❌", f"Smoke-Test fehlgeschlagen: Ungültige Theme-Namen: {', '.join(map(str, invalid_themes))}")
    print_step("➡️", "Nächster Schritt: Theme-Namen in Kleinbuchstaben mit Bindestrich formatieren.")
    sys.exit(1)

missing_options = [name for name in themes if f'<option value="{name}"' not in content]
if missing_options:
    print_step("❌", f"Smoke-Test fehlgeschlagen: Theme-Optionen fehlen im Template: {', '.join(missing_options)}")
    print_step("➡️", "Nächster Schritt: Fehlende Optionen im Theme-Umschalter ergänzen.")
    sys.exit(1)

print_step("✅", "Smoke-Test bestanden: Startmodi, A11y-Marker und Theme-Konfiguration sind korrekt.")
