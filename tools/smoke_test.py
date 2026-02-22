#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
START_SCRIPT = PROJECT_ROOT / "start.sh"
START_CORE = PROJECT_ROOT / "system" / "start_core.sh"
START_GUI = PROJECT_ROOT / "system" / "start_gui.sh"
DASHBOARD_TEMPLATE = PROJECT_ROOT / "templates" / "dashboard_musterseite.html"
THEME_CONFIG = PROJECT_ROOT / "config" / "themes.json"
STATUS_SUMMARY = PROJECT_ROOT / "logs" / "status_summary.txt"
CONTRAST_CHECK = PROJECT_ROOT / "tools" / "check_theme_contrast.py"


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


if not START_SCRIPT.exists():
    print_step("❌", "Smoke-Test abgebrochen: start.sh fehlt.")
    print_step("➡️", "Nächster Schritt: Repository vollständig laden und erneut testen.")
    sys.exit(1)

if not START_CORE.exists():
    print_step("❌", "Smoke-Test abgebrochen: system/start_core.sh fehlt.")
    print_step("➡️", "Nächster Schritt: Kernlogik-Datei unter system/ ergänzen.")
    sys.exit(1)

if not START_GUI.exists():
    print_step("❌", "Smoke-Test abgebrochen: system/start_gui.sh fehlt.")
    print_step("➡️", "Nächster Schritt: GUI-Helfer-Datei unter system/ ergänzen.")
    sys.exit(1)

if not DASHBOARD_TEMPLATE.exists():
    print_step("❌", "Smoke-Test abgebrochen: dashboard_musterseite.html fehlt.")
    print_step("➡️", "Nächster Schritt: Template-Datei unter templates/ ergänzen.")
    sys.exit(1)

if not THEME_CONFIG.exists():
    print_step("❌", "Smoke-Test abgebrochen: config/themes.json fehlt.")
    print_step("➡️", "Nächster Schritt: Theme-Konfiguration anlegen und erneut testen.")
    sys.exit(1)

if not CONTRAST_CHECK.exists():
    print_step("❌", "Smoke-Test abgebrochen: tools/check_theme_contrast.py fehlt.")
    print_step("➡️", "Nächster Schritt: Kontrast-Checker-Datei ergänzen und erneut testen.")
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


print_step("✅", "Smoke-Test erweitert: python tools/check_theme_contrast.py")
contrast_result = subprocess.run(
    ["python3", str(CONTRAST_CHECK)],
    cwd=PROJECT_ROOT,
    text=True,
    capture_output=True,
)

if contrast_result.returncode != 0:
    print_step("❌", "Smoke-Test fehlgeschlagen: Kontrast-Check lieferte Fehler.")
    print(contrast_result.stdout)
    print(contrast_result.stderr)
    print_step("➡️", "Nächster Schritt: Theme-Farben im Template anpassen und erneut testen.")
    sys.exit(contrast_result.returncode)

if "Kontrast-Check abgeschlossen" not in contrast_result.stdout:
    print_step("❌", "Smoke-Test fehlgeschlagen: Kontrast-Erfolgsausgabe fehlt.")
    print_step("➡️", "Nächster Schritt: Ausgabe von 'python tools/check_theme_contrast.py' prüfen.")
    sys.exit(1)

print_step("✅", "Smoke-Test erweitert: ./start.sh --ux-check-auto")
ux_result = subprocess.run(
    ["bash", str(START_SCRIPT), "--ux-check-auto"],
    cwd=PROJECT_ROOT,
    text=True,
    capture_output=True,
)

if ux_result.returncode != 0:
    print_step("❌", "Smoke-Test fehlgeschlagen: --ux-check-auto lieferte Fehler.")
    print(ux_result.stdout)
    print(ux_result.stderr)
    print_step("➡️", "Nächster Schritt: UX-Hinweise im Template ergänzen und erneut testen.")
    sys.exit(ux_result.returncode)

if "Mini-UX-Check erfolgreich" not in ux_result.stdout:
    print_step("❌", "Smoke-Test fehlgeschlagen: UX-Erfolgsausgabe fehlt.")
    print_step("➡️", "Nächster Schritt: Ausgabe von './start.sh --ux-check-auto' prüfen.")
    sys.exit(1)

if os.environ.get("SKIP_FULL_GATES") != "1":
    print_step("✅", "Smoke-Test erweitert: ./start.sh --full-gates")
    full_gates_result = subprocess.run(
        ["bash", str(START_SCRIPT), "--full-gates"],
        cwd=PROJECT_ROOT,
        text=True,
        capture_output=True,
    )

    if full_gates_result.returncode != 0:
        print_step("❌", "Smoke-Test fehlgeschlagen: --full-gates lieferte Fehler.")
        print(full_gates_result.stdout)
        print(full_gates_result.stderr)
        print_step("➡️", "Nächster Schritt: Gate-Ausgaben prüfen und erneut testen.")
        sys.exit(full_gates_result.returncode)

    if "Alle automatischen Gates 1-5 erfolgreich abgeschlossen" not in full_gates_result.stdout:
        print_step("❌", "Smoke-Test fehlgeschlagen: Gate-Erfolgsausgabe fehlt.")
        print_step("➡️", "Nächster Schritt: Ausgabe von './start.sh --full-gates' prüfen.")
        sys.exit(1)

if not STATUS_SUMMARY.exists() or STATUS_SUMMARY.stat().st_size == 0:
    print_step("❌", "Smoke-Test fehlgeschlagen: logs/status_summary.txt fehlt oder ist leer.")
    print_step("➡️", "Nächster Schritt: './start.sh --check' ausführen und Schreibrechte prüfen.")
    sys.exit(1)

status_content = STATUS_SUMMARY.read_text(encoding="utf-8")
if "Geprueft:" not in status_content or "Naechste Schritte:" not in status_content and "Naechster Schritt:" not in status_content:
    print_step("❌", "Smoke-Test fehlgeschlagen: Statusbericht enthält nicht alle Pflichtzeilen.")
    print_step("➡️", "Nächster Schritt: Statusbericht-Format im Startskript prüfen.")
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
    'id="hilfe-next-steps"',
    'id="theme-help"',
    'aria-describedby="theme-help"',
    'id="shortcut-help"',
    'aria-keyshortcuts="Alt+S"',
    'aria-keyshortcuts="Alt+R"',
    'aria-keyshortcuts="Alt+P"',
    'aria-keyshortcuts="Alt+L"',
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
