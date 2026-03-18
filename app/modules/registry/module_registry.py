from __future__ import annotations

from importlib import import_module

from app.modules.registry.module_manifest import ModuleManifest


def _lazy_widget_factory(module_path: str, class_name: str):
    def factory():
        module = import_module(module_path)
        widget_class = getattr(module, class_name)
        return widget_class()

    return factory


class ModuleRegistry:
    def __init__(self, manifests: list[ModuleManifest]) -> None:
        self._manifests = manifests

    @classmethod
    def build_default(cls) -> "ModuleRegistry":
        return cls([
            ModuleManifest("editor", "Editor", "Text", "Schreiben und bearbeiten", _lazy_widget_factory("app.modules.editor.editor_widget", "EditorWidget")),
            ModuleManifest("templates", "Templates", "Vorlagen", "Vorlagen vorbereiten", _lazy_widget_factory("app.modules.templates.templates_widget", "TemplatesWidget")),
            ModuleManifest("styles", "Styles", "Vorlagen", "Stilbausteine sammeln", _lazy_widget_factory("app.modules.styles.styles_widget", "StylesWidget")),
            ModuleManifest("randomizer", "Randomizer", "Werkzeuge", "Ideen gezielt mischen", _lazy_widget_factory("app.modules.randomizer.randomizer_widget", "RandomizerWidget")),
            ModuleManifest("tasks", "Tasks", "Planung", "Aufgaben im Blick halten", _lazy_widget_factory("app.modules.tasks.tasks_widget", "TasksWidget")),
            ModuleManifest("wiki", "Wiki", "Wissen", "Wissen leicht nachschlagen", _lazy_widget_factory("app.modules.wiki.wiki_widget", "WikiWidget")),
            ModuleManifest("filefinder", "FileFinder", "Suche", "Dateien schnell finden", _lazy_widget_factory("app.modules.filefinder.filefinder_widget", "FileFinderWidget")),
        ])

    def all(self) -> list[ModuleManifest]:
        return list(self._manifests)

    def categories(self) -> list[str]:
        return sorted({manifest.category for manifest in self._manifests})
