#!/usr/bin/env python3
"""Browser-E2E-Test für Dashboard-Dialog mit Screenshot-Artefakt."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = PROJECT_ROOT / "templates" / "dashboard_musterseite.html"
ARTIFACT_DIR = PROJECT_ROOT / "logs" / "artifacts"
ARTIFACT_FILE_TEMPLATE = "dashboard-dialog-e2e-{browser}.png"
BROWSER_CHOICES = ("chromium", "firefox", "webkit")


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prüft Dialog-Fokusfang im Browser und speichert einen Screenshot als Artefakt."
    )
    parser.add_argument(
        "--require-browser",
        action="store_true",
        help="Bricht mit Fehler ab, wenn Playwright/Browser nicht vorhanden sind.",
    )
    parser.add_argument(
        "--browser",
        default="chromium",
        choices=BROWSER_CHOICES,
        help="Browser-Engine für den Lauf (Standard: chromium).",
    )
    return parser.parse_args()


def fail(message: str, next_step: str) -> int:
    print_step("❌", message)
    print_step("➡️", f"Nächster Schritt: {next_step}")
    return 1


def main() -> int:
    args = parse_args()

    if not TEMPLATE.exists():
        return fail(
            "Browser-E2E abgebrochen: dashboard_musterseite.html fehlt.",
            "Template-Datei unter templates/ wiederherstellen und Test erneut starten.",
        )

    browser_name = args.browser.strip().lower()
    artifact_file = ARTIFACT_DIR / ARTIFACT_FILE_TEMPLATE.format(browser=browser_name)

    try:
        from playwright.sync_api import sync_playwright
    except ModuleNotFoundError:
        print_step("⚠️", "Browser-E2E übersprungen: Playwright ist nicht installiert.")
        print_step(
            "➡️",
            f"Nächster Schritt: python3 -m pip install playwright && python3 -m playwright install {browser_name}",
        )
        return 1 if args.require_browser else 0

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    template_url = TEMPLATE.resolve().as_uri()

    with sync_playwright() as playwright:
        browser_launcher = getattr(playwright, browser_name)
        browser = browser_launcher.launch(headless=True)
        page = browser.new_page()
        page.goto(template_url, wait_until="load")

        trigger = page.locator('[data-action="error"]').first
        trigger.focus()
        page.keyboard.press("Enter")

        dialog = page.locator("#error-dialog")
        if dialog.count() == 0:
            browser.close()
            return fail(
                "Browser-E2E fehlgeschlagen: Fehlerdialog wurde nicht gefunden.",
                "Template prüfen: Dialog mit id='error-dialog' ergänzen.",
            )

        dialog_visible = page.evaluate("() => document.getElementById('error-dialog')?.open === true")
        if not dialog_visible:
            browser.close()
            return fail(
                "Browser-E2E fehlgeschlagen: Fehlerdialog wurde nicht geöffnet.",
                "Dialog-Aktion mit data-action='error' und showModal prüfen.",
            )

        # Tab-Fokus muss im Dialog bleiben.
        for _ in range(6):
            page.keyboard.press("Tab")

        active_inside = page.evaluate(
            """() => {
                const dialog = document.getElementById('error-dialog');
                const active = document.activeElement;
                return !!dialog && !!active && dialog.contains(active);
            }"""
        )
        if not active_inside:
            browser.close()
            return fail(
                "Browser-E2E fehlgeschlagen: Tab-Fokus verlässt den offenen Dialog.",
                "Fokusfang im Dialog prüfen (Tab/Shift+Tab innerhalb des Dialogs halten).",
            )

        page.keyboard.press("Escape")
        focus_restored = page.evaluate(
            """() => {
                const active = document.activeElement;
                return active?.getAttribute('data-action') === 'error';
            }"""
        )
        if not focus_restored:
            browser.close()
            return fail(
                "Browser-E2E fehlgeschlagen: Fokus kehrt nach Dialog-Schließen nicht zum Auslöser zurück.",
                "restoreFocusAfterDialog im Template prüfen und erneut testen.",
            )

        page.screenshot(path=str(artifact_file), full_page=True)
        browser.close()

    print_step(
        "✅",
        f"Browser-E2E bestanden ({browser_name}): Dialog-Fokusfang geprüft und Artefakt erstellt ({artifact_file}).",
    )
    print_step(
        "➡️",
        "Hinweis: Für breitere Browser-Abdeckung zusätzlich '--browser firefox' und '--browser webkit' einplanen.",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
