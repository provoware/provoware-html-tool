#!/usr/bin/env python3
"""Prüft die Fokus-Reihenfolge im Dashboard-Template mit klaren Hinweisen."""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = PROJECT_ROOT / "templates" / "dashboard_musterseite.html"

INTERACTIVE_TAGS = {"a", "button", "input", "select", "textarea", "summary"}


class FocusParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.items: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key: (value or "") for key, value in attrs}
        is_interactive = tag in INTERACTIVE_TAGS or "tabindex" in attributes
        if not is_interactive:
            return

        tabindex = attributes.get("tabindex", "")
        if tabindex.startswith("-"):
            return

        item_id = attributes.get("id", "")
        data_action = attributes.get("data-action", "")
        href = attributes.get("href", "")
        label = item_id or data_action or href or tag
        self.items.append({"tag": tag, "label": label, "id": item_id, "href": href})


def print_step(icon: str, text: str) -> None:
    print(f"{icon} {text}")


def fail(text: str, next_step: str) -> int:
    print_step("❌", text)
    print_step("➡️", f"Nächster Schritt: {next_step}")
    return 1


def main() -> int:
    if not TEMPLATE.exists():
        return fail(
            "Fokus-Check abgebrochen: dashboard_musterseite.html fehlt.",
            "Datei im Ordner templates wiederherstellen und Check erneut starten.",
        )

    parser = FocusParser()
    parser.feed(TEMPLATE.read_text(encoding="utf-8"))

    if not parser.items:
        return fail(
            "Fokus-Check fehlgeschlagen: Keine fokussierbaren Elemente gefunden.",
            "Mindestens Link, Button oder Auswahlfeld im Template ergänzen.",
        )

    first = parser.items[0]
    if first.get("href") != "#bereich-aufgaben":
        return fail(
            "Fokus-Check fehlgeschlagen: Skip-Link ist nicht das erste Fokus-Element.",
            "Skip-Link an den Seitenanfang setzen, damit Tastaturnutzung direkt starten kann.",
        )

    actions = {item.get("label", "") for item in parser.items}
    required_actions = {"save", "retry", "repair", "log", "error", "close-dialog"}
    missing = sorted(required_actions.difference(actions))
    if missing:
        return fail(
            f"Fokus-Check fehlgeschlagen: Pflichtaktionen fehlen in der Fokus-Reihenfolge: {', '.join(missing)}.",
            "Buttons mit data-action='save/retry/repair/log' ergänzen und erneut prüfen.",
        )

    theme_switcher_index = next(
        (index for index, item in enumerate(parser.items) if item.get("id") == "theme-switcher"),
        -1,
    )
    if theme_switcher_index < 0:
        return fail(
            "Fokus-Check fehlgeschlagen: Theme-Auswahl ist nicht fokussierbar.",
            "Select-Feld mit id='theme-switcher' im Einstellungsbereich prüfen.",
        )

    if theme_switcher_index < 3:
        return fail(
            "Fokus-Check fehlgeschlagen: Theme-Auswahl kommt zu früh in der Tab-Reihenfolge.",
            "Theme-Auswahl nach den Hauptaktionen platzieren, damit Kernaufgaben zuerst erreichbar sind.",
        )

    if "keepDialogFocusInside(" not in TEMPLATE.read_text(encoding="utf-8"):
        return fail(
            "Fokus-Check fehlgeschlagen: Fokusfang im Fehlerdialog fehlt.",
            "Im Script eine Tab-Fokusbegrenzung für den offenen Dialog ergänzen.",
        )

    if "restoreFocusAfterDialog(" not in TEMPLATE.read_text(encoding="utf-8"):
        return fail(
            "Fokus-Check fehlgeschlagen: Fokus-Rückgabe nach Dialog-Schließen fehlt.",
            "Nach dem Schließen Fokus auf das auslösende Element zurücksetzen.",
        )

    print_step("✅", "Fokus-Check bestanden: Skip-Link, Hauptaktionen, Dialog-Fokusfang und Theme-Auswahl sind robust.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
