from __future__ import annotations


class ServiceRegistry:
    def __init__(self) -> None:
        self._services: dict[str, object] = {}

    def register(self, name: str, service: object) -> None:
        self._services[name] = service

    def get(self, name: str) -> object:
        if name not in self._services:
            raise KeyError(f"Service '{name}' ist nicht registriert.")
        return self._services[name]
