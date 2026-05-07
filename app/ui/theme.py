from __future__ import annotations


def app_stylesheet() -> str:
    """Return the global Qt stylesheet for the main application UI."""
    return """
    QWidget {
        font-size: 15px;
        color: #172033;
        background-color: #f3f6fa;
    }

    QMainWindow {
        background-color: #f3f6fa;
    }

    QLabel {
        background: transparent;
    }

    QFrame {
        border-radius: 12px;
    }

    QLineEdit,
    QTextEdit,
    QPlainTextEdit,
    QComboBox,
    QListWidget,
    QTreeWidget,
    QTableWidget {
        background-color: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 8px 10px;
        selection-background-color: #1f5fbf;
        selection-color: #ffffff;
    }

    QLineEdit:focus,
    QTextEdit:focus,
    QPlainTextEdit:focus,
    QComboBox:focus,
    QListWidget:focus,
    QTreeWidget:focus,
    QTableWidget:focus {
        border: 2px solid #ffcc00;
        background-color: #ffffff;
    }

    QPushButton {
        min-height: 38px;
        padding: 8px 14px;
        border-radius: 10px;
        border: 1px solid #94a3b8;
        background-color: #ffffff;
        color: #172033;
        font-weight: 600;
    }

    QPushButton:hover {
        background-color: #e8f0ff;
        border-color: #1f5fbf;
    }

    QPushButton:pressed {
        background-color: #d6e4ff;
        border-color: #174a96;
    }

    QPushButton:focus {
        border: 3px solid #ffcc00;
        padding: 6px 12px;
    }

    QPushButton:disabled {
        color: #7b8794;
        background-color: #e5e7eb;
        border-color: #cbd5e1;
    }

    QTabWidget::pane {
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        background: #ffffff;
    }

    QTabBar::tab {
        min-height: 32px;
        padding: 8px 14px;
        margin-right: 4px;
        border: 1px solid #cbd5e1;
        border-bottom: none;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: #e8eef7;
        color: #243044;
    }

    QTabBar::tab:selected {
        background: #ffffff;
        color: #0f172a;
        font-weight: 700;
    }

    QTabBar::tab:focus {
        border: 3px solid #ffcc00;
    }

    QSplitter::handle {
        background-color: #d8e0ea;
    }

    QSplitter::handle:hover {
        background-color: #94a3b8;
    }

    QStatusBar {
        background: #e8eef7;
        color: #243044;
        border-top: 1px solid #cbd5e1;
    }
    """
