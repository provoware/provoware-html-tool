class AppError(Exception):
    """Basisfehler der Anwendung."""


class StartupError(AppError):
    """Fehler in der Startphase."""
