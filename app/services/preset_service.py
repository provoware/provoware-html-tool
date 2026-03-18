from app.storage.json_document_store import JsonDocumentStore


class PresetService:
    def __init__(self, document_store: JsonDocumentStore) -> None:
        self.document_store = document_store
