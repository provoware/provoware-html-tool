from PySide6.QtWidgets import QApplication, QLabel, QPushButton

from app.ui.dialogs.help_dialog import HelpDialog
from app.ui.dialogs.repair_dialog import RepairDialog


def _app() -> QApplication:
    app = QApplication.instance()
    if app is None:
        app = QApplication([])
    return app


def test_help_dialog_shows_guidance_and_close_action() -> None:
    _app()
    dialog = HelpDialog()

    labels = [label.text() for label in dialog.findChildren(QLabel)]
    assert any("wichtigsten Bereiche" in text for text in labels)

    buttons = [button.text() for button in dialog.findChildren(QPushButton)]
    assert "Verstanden" in buttons


def test_repair_dialog_shows_safe_placeholder_actions() -> None:
    _app()
    dialog = RepairDialog()

    buttons = {button.text(): button for button in dialog.findChildren(QPushButton)}
    assert buttons["Pfade prüfen"].isEnabled() is False
    assert buttons["Diagnose öffnen"].isEnabled() is False
    assert buttons["Später"].isEnabled() is True
