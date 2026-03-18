from PySide6.QtWidgets import QListWidget, QVBoxLayout, QWidget

from app.ui.widgets.action_tile import ActionTile
from app.ui.widgets.section_header import SectionHeader


class RightModuleSidebar(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(8, 8, 12, 8)
        for title, items in {
            "Module": [
                "Editor",
                "Templates",
                "Styles",
                "Randomizer",
                "Tasks",
                "Wiki",
                "FileFinder",
            ],
            "Presets": [
                "Noch kein Preset gewählt",
                "Tipp: Öffne zuerst ein Projekt.",
                "Danach kannst du hier ein passendes Arbeitsmuster wählen.",
            ],
            "Kopplungen": [
                "Noch keine Kopplungen",
                "Sie erscheinen hier, sobald du zwei Module gemeinsam nutzt.",
                "Beginne zum Beispiel mit Editor und Templates.",
            ],
        }.items():
            layout.addWidget(SectionHeader(title))
            widget = QListWidget()
            widget.addItems(items)
            layout.addWidget(widget)
            action = self._build_action(title)
            if action is not None:
                layout.addWidget(action)

    def _build_action(self, title: str) -> ActionTile | None:
        actions = {
            "Presets": ("Preset öffnen", "Diese Direktaktion wird mit der Preset-Verwaltung verbunden."),
            "Kopplungen": ("Kopplung ansehen", "Diese Direktaktion wird mit echten Modulverbindungen gefüllt."),
        }
        action_data = actions.get(title)
        if action_data is None:
            return None
        text, tooltip = action_data
        action = ActionTile(text)
        action.setEnabled(False)
        action.setToolTip(tooltip)
        return action
