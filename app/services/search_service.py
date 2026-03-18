from app.storage.cache_store import CacheStore


class SearchService:
    def __init__(self, cache_store: CacheStore) -> None:
        self.cache_store = cache_store
