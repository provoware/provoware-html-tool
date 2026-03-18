from __future__ import annotations

import sys

from PySide6.QtWidgets import QApplication, QMessageBox

from app.bootstrap.app_bootstrap import AppBootstrap
from app.constants import APP_NAME


def run() -> int:
    app = QApplication(sys.argv)
    app.setApplicationName(APP_NAME)

    bootstrap = AppBootstrap()
    result = bootstrap.bootstrap()
    if not result.success or result.window is None:
        QMessageBox.critical(None, APP_NAME, result.message)
        return 1

    result.window.show()
    return app.exec()
