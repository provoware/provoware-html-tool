def require_text(value: str, fallback: str) -> str:
    cleaned = value.strip()
    return cleaned or fallback
