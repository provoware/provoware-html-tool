#!/usr/bin/env python3
"""Prüft Theme-Kontraste in der Dashboard-Vorlage gegen WCAG-Mindestwerte."""

from __future__ import annotations

import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_FILE = PROJECT_ROOT / "templates" / "dashboard_musterseite.html"
THEME_CONFIG_FILE = PROJECT_ROOT / "config" / "themes.json"

CSS_BLOCK_PATTERN = re.compile(r"html\[data-theme=\"([a-z0-9-]+)\"\]\s*\{(.*?)\}", re.S)
CSS_VAR_PATTERN = re.compile(r"--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;")
HEX_PATTERN = re.compile(r"^#[0-9a-fA-F]{6}$")


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    if not HEX_PATTERN.fullmatch(value):
        raise ValueError("Ungültiger Farbwert")
    return tuple(int(value[i : i + 2], 16) for i in (1, 3, 5))


def relative_luminance(value: str) -> float:
    channels = hex_to_rgb(value)
    normalized = []
    for channel in channels:
        c = channel / 255
        normalized.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    r, g, b = normalized
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(color_a: str, color_b: str) -> float:
    lum_a = relative_luminance(color_a)
    lum_b = relative_luminance(color_b)
    lighter = max(lum_a, lum_b)
    darker = min(lum_a, lum_b)
    return (lighter + 0.05) / (darker + 0.05)


def main() -> int:
    if not TEMPLATE_FILE.exists():
        print_step("❌", "Kontrast-Check abgebrochen: templates/dashboard_musterseite.html fehlt.")
        print_step("➡️", "Nächster Schritt: Datei wiederherstellen und erneut starten.")
        return 1

    if not THEME_CONFIG_FILE.exists():
        print_step("❌", "Kontrast-Check abgebrochen: config/themes.json fehlt.")
        print_step("➡️", "Nächster Schritt: Theme-Konfiguration wiederherstellen und erneut starten.")
        return 1

    content = TEMPLATE_FILE.read_text(encoding="utf-8")
    blocks = CSS_BLOCK_PATTERN.findall(content)
    if not blocks:
        print_step("❌", "Kontrast-Check fehlgeschlagen: Keine Theme-CSS-Blöcke gefunden.")
        print_step("➡️", "Nächster Schritt: CSS-Blöcke mit html[data-theme=\"...\"] ergänzen.")
        return 1

    theme_values: dict[str, dict[str, str]] = {}
    for theme_name, css_block in blocks:
        vars_for_theme = {name: value for name, value in CSS_VAR_PATTERN.findall(css_block)}
        required = {"bg", "text", "primary"}
        if not required.issubset(vars_for_theme):
            missing = ", ".join(sorted(required.difference(vars_for_theme)))
            print_step("❌", f"Theme '{theme_name}' unvollständig: fehlende Variablen {missing}.")
            print_step("➡️", "Nächster Schritt: --bg, --text und --primary im Theme ergänzen.")
            return 1
        theme_values[theme_name] = vars_for_theme

    failed = False
    for theme_name, vars_for_theme in sorted(theme_values.items()):
        text_ratio = contrast_ratio(vars_for_theme["bg"], vars_for_theme["text"])
        accent_ratio = contrast_ratio(vars_for_theme["bg"], vars_for_theme["primary"])

        if text_ratio < 4.5:
            failed = True
            print_step("❌", f"Theme '{theme_name}' hat zu wenig Kontrast für Text ({text_ratio:.2f}:1).")
            print_step("➡️", "Nächster Schritt: Text- oder Hintergrundfarbe anpassen (mindestens 4.5:1).")
        else:
            print_step("✅", f"Theme '{theme_name}' Text-Kontrast ist gut ({text_ratio:.2f}:1).")

        if accent_ratio < 3.0:
            failed = True
            print_step("❌", f"Theme '{theme_name}' hat zu wenig Kontrast für Akzent ({accent_ratio:.2f}:1).")
            print_step("➡️", "Nächster Schritt: Akzentfarbe anpassen (mindestens 3.0:1).")
        else:
            print_step("✅", f"Theme '{theme_name}' Akzent-Kontrast ist gut ({accent_ratio:.2f}:1).")

    if failed:
        return 1

    print_step("✅", "Kontrast-Check abgeschlossen: Alle Themes erfüllen die Mindestwerte.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
