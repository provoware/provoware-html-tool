import { safeObject, safeText, userProblemNextStep } from '../../js/services/module-boundary-utils.js';

const normalizeText = (value) => safeText(value);

const normalizeList = (values) => {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.map((item) => normalizeText(item)).filter(Boolean))];
};

const createEntryId = (topic) => {
  const safe = normalizeText(topic)
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
  const stamp = Date.now().toString(36);
  return `${safe || 'wissen'}-${stamp}`;
};

const buildEntry = (input = {}, previousId = null) => {
  const topic = normalizeText(input.topic);
  const content = normalizeText(input.content);

  if (!topic) {
    return {
      ok: false,
      code: 'TOPIC_REQUIRED',
      message: userProblemNextStep('Thema fehlt.', 'Bitte ein kurzes Thema eintragen.')
    };
  }
  if (!content) {
    return {
      ok: false,
      code: 'CONTENT_REQUIRED',
      message: userProblemNextStep('Inhalt fehlt.', 'Bitte mindestens einen Satz ergänzen.')
    };
  }

  const entry = {
    id: previousId || createEntryId(topic),
    topic,
    source: normalizeText(input.source),
    detail: normalizeText(input.detail),
    content,
    tags: normalizeList(input.tags),
    relatedIds: normalizeList(input.relatedIds),
    updatedAt: new Date().toISOString()
  };

  return { ok: true, data: entry };
};

const cloneEntry = (entry = {}) => ({
  ...entry,
  tags: normalizeList(entry.tags),
  relatedIds: normalizeList(entry.relatedIds)
});

const cloneStore = (store = {}) => ({
  entries: Array.isArray(store.entries) ? store.entries.map((entry) => cloneEntry(entry)) : []
});

export const createEmptyKnowledgeStore = () => ({ entries: [] });

export const createKnowledgeEntry = (store, input) => {
  const nextStore = cloneStore(store);
  const built = buildEntry(input);
  if (!built.ok) return built;

  nextStore.entries.unshift(built.data);
  return { ok: true, code: 'CREATED', message: 'Eintrag angelegt.', data: { store: nextStore, entry: built.data } };
};

export const listKnowledgeEntries = (store, options = {}) => {
  const entries = cloneStore(store).entries;
  const query = normalizeText(options.query).toLowerCase();
  const tag = normalizeText(options.tag).toLowerCase();

  const filtered = entries.filter((entry) => {
    const haystack = [entry.topic, entry.source, entry.detail, entry.content, ...(entry.tags || [])].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesTag = !tag || (entry.tags || []).some((item) => item.toLowerCase() === tag);
    return matchesQuery && matchesTag;
  });

  return { ok: true, code: 'LIST_OK', message: 'Liste geladen.', data: filtered };
};

export const readKnowledgeEntry = (store, entryId) => {
  const id = normalizeText(entryId);
  const entry = cloneStore(store).entries.find((item) => item.id === id);
  if (!entry) return { ok: false, code: 'NOT_FOUND', message: 'Eintrag wurde nicht gefunden.' };
  return { ok: true, code: 'READ_OK', message: 'Eintrag geladen.', data: cloneEntry(entry) };
};

export const updateKnowledgeEntry = (store, entryId, patch) => {
  const nextStore = cloneStore(store);
  const id = normalizeText(entryId);
  const index = nextStore.entries.findIndex((item) => item.id === id);
  if (index < 0) return { ok: false, code: 'NOT_FOUND', message: 'Eintrag wurde nicht gefunden.' };

  const safePatch = safeObject(patch);
  const merged = { ...nextStore.entries[index], ...safePatch };
  const built = buildEntry(merged, id);
  if (!built.ok) return built;

  nextStore.entries[index] = built.data;
  return { ok: true, code: 'UPDATED', message: 'Eintrag aktualisiert.', data: { store: nextStore, entry: built.data } };
};

export const deleteKnowledgeEntry = (store, entryId) => {
  const nextStore = cloneStore(store);
  const id = normalizeText(entryId);
  const before = nextStore.entries.length;
  nextStore.entries = nextStore.entries.filter((item) => item.id !== id);

  if (before === nextStore.entries.length) {
    return { ok: false, code: 'NOT_FOUND', message: 'Eintrag wurde nicht gefunden.' };
  }

  nextStore.entries = nextStore.entries.map((entry) => ({
    ...entry,
    relatedIds: (entry.relatedIds || []).filter((relatedId) => relatedId !== id)
  }));

  return { ok: true, code: 'DELETED', message: 'Eintrag gelöscht.', data: { store: nextStore } };
};

export const linkKnowledgeEntries = (store, sourceId, targetId) => {
  const nextStore = cloneStore(store);
  const fromId = normalizeText(sourceId);
  const toId = normalizeText(targetId);

  if (!fromId || !toId || fromId === toId) {
    return { ok: false, code: 'INVALID_LINK', message: 'Verknüpfung ist ungültig.' };
  }

  const sourceIndex = nextStore.entries.findIndex((item) => item.id === fromId);
  const targetExists = nextStore.entries.some((item) => item.id === toId);
  if (sourceIndex < 0 || !targetExists) {
    return { ok: false, code: 'NOT_FOUND', message: 'Eintrag wurde nicht gefunden.' };
  }

  const relatedIds = normalizeList([...(nextStore.entries[sourceIndex].relatedIds || []), toId]);
  nextStore.entries[sourceIndex] = {
    ...nextStore.entries[sourceIndex],
    relatedIds,
    updatedAt: new Date().toISOString()
  };

  return { ok: true, code: 'LINKED', message: 'Verknüpfung gespeichert.', data: { store: nextStore } };
};

export const exportKnowledgeEntries = (store) => {
  const payload = {
    exportedAt: new Date().toISOString(),
    type: 'wiki_notiz_wissen',
    count: cloneStore(store).entries.length,
    entries: cloneStore(store).entries
  };
  return { ok: true, code: 'EXPORT_READY', message: 'Export ist bereit.', data: JSON.stringify(payload, null, 2) };
};
