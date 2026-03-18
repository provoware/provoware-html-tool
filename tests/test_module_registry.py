from app.modules.registry.module_registry import ModuleRegistry


def test_module_registry_exposes_expected_modules():
    registry = ModuleRegistry.build_default()
    names = [manifest.name for manifest in registry.all()]
    assert names == ["Editor", "Templates", "Styles", "Randomizer", "Tasks", "Wiki", "FileFinder"]
    assert registry.categories() == ["Planung", "Suche", "Text", "Vorlagen", "Werkzeuge", "Wissen"]
