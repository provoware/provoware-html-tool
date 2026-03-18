from datetime import datetime


def timestamp_label() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")
