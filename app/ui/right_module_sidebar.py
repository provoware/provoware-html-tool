from PySide6.QtCore import Signal
from PySide6.QtWidgets import QListWidget, QVBoxLayout, QWidget

from app.ui.widgets.action_tile import ActionTile
from app.ui.widgets.section_header import SectionHeader


class RightModuleSidebar(QWidget):
    module_open_requested = Signal(str)
    preset_apply_requested = Signal(str)

    def __init__(self) -> None:
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(8, 8, 12, 8)

        layout.addWidget(SectionHeader("Module"))
        self.module_list = QListWidget()
        self.module_list.addItems([
            "Editor",
            "Templates",
            "Styles",
            "Randomizer",
            "Tasks",
            "Wiki",
            "FileFinder",
        ])
        self.module_list.itemActivated.connect(lambda item: self.module_open_requested.emit(item.text()))
        self.module_list.itemClicked.connect(lambda item: self.module_open_requested.emit(item.text()))
        layout.addWidget(self.module_list)

        layout.addWidget(SectionHeader("Presets"))
        self.preset_list = QListWidget()
        self.preset_list.addItems([
            "Basisansicht",
            "Noch kein Preset gewählt",
            "Tipp: Öffne zuerst ein Projekt.",
        ])
        self.preset_list.itemActivated.connect(lambda item: self._emit_preset(item.text()))
        self.preset_list.itemClicked.connect(lambda item: self._emit_preset(item.text()))
        layout.addWidget(self.preset_list)
        self.preset_action = ActionTile("Preset öffnen")
        self.preset_action.clicked.connect(lambda: self.preset_apply_requested.emit("Basisansicht"))
        self.preset_action.setToolTip("Öffnet die kleine vorbereitete Basisansicht im Arbeitsbereich.")
        layout.addWidget(self.preset_action)

        layout.addWidget(SectionHeader("Kopplungen"))
        self.coupling_list = QListWidget()
        self.coupling_list.addItems([
            "Noch keine Kopplungen",
            "Sie erscheinen hier, sobald du zwei Module gemeinsam nutzt.",
            "Beginne zum Beispiel mit Editor und Templates.",
        ])
        layout.addWidget(self.coupling_list)
        self.coupling_action = ActionTile("Kopplung ansehen")
        self.coupling_action.setEnabled(False)
        self.coupling_action.setToolTip("Diese Direktaktion wird mit echten Modulverbindungen gefüllt.")
        layout.addWidget(self.coupling_action)

    def _emit_preset(self, preset_name: str) -> None:
        if preset_name == "Basisansicht":
            self.preset_apply_requested.emit(preset_name)
