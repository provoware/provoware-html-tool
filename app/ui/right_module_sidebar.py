from PySide6.QtWidgets import QListWidget, QVBoxLayout, QWidget

from app.ui.widgets.section_header import SectionHeader


class RightModuleSidebar(QWidget):
    def __init__(self) -> None:
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(8, 8, 12, 8)
        for title, items in {
            "Module": ["Editor", "Templates", "Styles", "Randomizer", "Tasks", "Wiki", "FileFinder"],
            "Presets": ["Noch kein Preset gewählt", "Tipp: Wähle später ein passendes Arbeitsmuster."],
            "Kopplungen": ["Noch keine Kopplungen", "Sie erscheinen hier, sobald du Module verbindest."],
        }.items():
            layout.addWidget(SectionHeader(title))
            widget = QListWidget()
            widget.addItems(items)
            layout.addWidget(widget)
