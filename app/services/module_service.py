from app.modules.registry.module_registry import ModuleRegistry


class ModuleService:
    def __init__(self) -> None:
        self.registry = ModuleRegistry.build_default()

    def module_names(self) -> list[str]:
        return [manifest.name for manifest in self.registry.all()]
