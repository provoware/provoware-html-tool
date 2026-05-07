from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import QLabel, QLineEdit, QListWidget, QListWidgetItem, QVBoxLayout, QWidget

from app.ui.widgets.action_tile import ActionTile
from app.ui.widgets.section_header import SectionHeader


class RightModuleSidebar(QWidget):
    module_open_requested = Signal(str)
    preset_apply_requested = Signal(str)

    def __init__(self) -> None:
        super().__init__()
        self.setObjectName("RightModuleSidebar")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(8, 8, 12, 8)
        layout.setSpacing(8)

        self._module_names = [
            "Editor",
            "Templates",
            "Styles",
            "Randomizer",
            "Tasks",
            "Wiki",
            "FileFinder",
        ]

        layout.addWidget(SectionHeader("Module"))
        self.module_filter = QLineEdit()
        self.module_filter.setPlaceholderText("Module kurz filtern")
        self.module_filter.setClearButtonEnabled(True)
        self.module_filter.setToolTip("Filtert die sichtbaren Module direkt nach deinem Text")
        self.module_filter.textChanged.connect(self._apply_module_filter)
        layout.addWidget(self.module_filter)

        self.module_status = QLabel()
        self.module_status.setObjectName("SidebarHintText")
        self.module_status.setWordWrap(True)
        layout.addWidget(self.module_status)

        self.module_list = QListWidget()
        self.module_list.itemActivated.connect(lambda item: self.module_open_requested.emit(item.text()))
        self.module_list.itemClicked.connect(lambda item: self.module_open_requested.emit(item.text()))
        layout.addWidget(self.module_list)
        self._apply_module_filter("")

        layout.addWidget(SectionHeader("Presets"))
        self.preset_status = QLabel("1 kleine Basisansicht ist vorbereitet. Weitere Presets folgen später mit echter Auswahl.")
        self.preset_status.setObjectName("SidebarHintText")
        self.preset_status.setWordWrap(True)
        layout.addWidget(self.preset_status)

        self.preset_list = QListWidget()
        self.preset_list.addItem("Basisansicht")
        self._add_hint_item(self.preset_list, "Noch kein weiteres Preset gewählt")
        self._add_hint_item(self.preset_list, "Tipp: Öffne zuerst ein Projekt.")
        self.preset_list.itemActivated.connect(lambda item: self._emit_preset(item))
        self.preset_list.itemClicked.connect(lambda item: self._emit_preset(item))
        layout.addWidget(self.preset_list)
        self.preset_action = ActionTile("Preset öffnen")
        self.preset_action.clicked.connect(lambda: self.preset_apply_requested.emit("Basisansicht"))
        self.preset_action.setToolTip("Öffnet die kleine vorbereitete Basisansicht im Arbeitsbereich.")
        layout.addWidget(self.preset_action)

        layout.addWidget(SectionHeader("Kopplungen"))
        self.coupling_status = QLabel(
            "Noch keine Kopplung bereit. Sie erscheint hier, sobald zwei Module gemeinsam genutzt werden."
        )
        self.coupling_status.setObjectName("SidebarHintText")
        self.coupling_status.setWordWrap(True)
        layout.addWidget(self.coupling_status)

        self.coupling_list = QListWidget()
        self._add_hint_item(self.coupling_list, "Noch keine Kopplungen")
        self._add_hint_item(self.coupling_list, "Sie erscheinen hier nach gemeinsamer Nutzung von zwei Modulen.")
        self._add_hint_item(self.coupling_list, "Beginne zum Beispiel mit Editor und Templates.")
        layout.addWidget(self.coupling_list)
        self.coupling_action = ActionTile("Kopplung ansehen")
        self.coupling_action.setEnabled(False)
        self.coupling_action.setToolTip("Diese Direktaktion wird mit echten Modulverbindungen gefüllt.")
        layout.addWidget(self.coupling_action)

    def _add_hint_item(self, list_widget: QListWidget, text: str) -> None:
        item = QListWidgetItem(text)
        item.setFlags(item.flags() & ~Qt.ItemFlag.ItemIsSelectable & ~Qt.ItemFlag.ItemIsEnabled)
        list_widget.addItem(item)

    def _apply_module_filter(self, filter_text: str) -> None:
        current_text = filter_text.strip().lower()
        visible_modules = [
            module_name for module_name in self._module_names if current_text in module_name.lower()
        ]
        self.module_list.clear()
        for module_name in visible_modules:
            self.module_list.addItem(module_name)
        if visible_modules:
            self.module_status.setText(
                f"{len(visible_modules)} von {len(self._module_names)} Modulen sichtbar. Wähle rechts direkt einen Eintrag."
            )
            return
        self.module_status.setText(
            "Kein Modul passt gerade zum Filter. Lösche den Text oder probiere einen kürzeren Begriff."
        )

    def _emit_preset(self, item: QListWidgetItem) -> None:
        if not (item.flags() & Qt.ItemFlag.ItemIsEnabled):
            return
        if item.text() == "Basisansicht":
            self.preset_apply_requested.emit(item.text())
