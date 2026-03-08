const STANDARD_SECTION_TYPES = Object.freeze(['Intro', 'Strophe 1', 'Strophe 2', 'Refrain', 'Hook', 'Bridge', 'Outro']);
const QUICK_TYPES = Object.freeze(['Refrain', 'Hook']);

const nowIso = () => new Date().toISOString();
const text = (value) => String(value || '').trim();
const clone = (value) => JSON.parse(JSON.stringify(value));
const asList = (value) => (Array.isArray(value) ? value : []);
const createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const makeSection = ({ type, content = '' }) => {
  const cleanType = text(type) || 'Abschnitt';
  const timestamp = nowIso();
  return {
    id: createId('sec'),
    type: cleanType,
    title: `${cleanType}:`,
    content: String(content || ''),
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

export const createSongStore = (raw = {}) => {
  const collectionText = String(raw.collectionText || '');
  const sections = asList(raw.sections)
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => makeSection({ type: entry.type || entry.title || 'Abschnitt', content: entry.content || '' }));

  return {
    version: 1,
    collectionText,
    sections,
    hooks: asList(raw.hooks).filter((entry) => entry && typeof entry === 'object').map((entry) => ({
      id: text(entry.id) || createId('hook'),
      label: text(entry.label) || 'Hook',
      content: String(entry.content || ''),
      favorite: entry.favorite === true,
      updatedAt: text(entry.updatedAt) || nowIso()
    })),
    refrains: asList(raw.refrains).filter((entry) => entry && typeof entry === 'object').map((entry) => ({
      id: text(entry.id) || createId('ref'),
      label: text(entry.label) || 'Refrain',
      content: String(entry.content || ''),
      favorite: entry.favorite === true,
      updatedAt: text(entry.updatedAt) || nowIso()
    })),
    archive: asList(raw.archive),
    updatedAt: nowIso()
  };
};

export const addSection = (store, type) => {
  const next = clone(store);
  next.sections.push(makeSection({ type }));
  next.updatedAt = nowIso();
  return { store: next, sectionId: next.sections[next.sections.length - 1].id };
};

export const updateSection = (store, sectionId, content) => {
  const next = clone(store);
  const section = next.sections.find((entry) => entry.id === text(sectionId));
  if (!section) return { ok: false, code: 'SECTION_NOT_FOUND', store: next };
  section.content = String(content || '');
  section.updatedAt = nowIso();
  next.updatedAt = nowIso();
  return { ok: true, store: next };
};

export const moveSection = (store, sectionId, direction) => {
  const next = clone(store);
  const index = next.sections.findIndex((entry) => entry.id === text(sectionId));
  if (index < 0) return { ok: false, code: 'SECTION_NOT_FOUND', store: next };
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= next.sections.length) return { ok: false, code: 'MOVE_OUT_OF_RANGE', store: next };
  [next.sections[index], next.sections[target]] = [next.sections[target], next.sections[index]];
  next.updatedAt = nowIso();
  return { ok: true, store: next };
};

export const removeSection = (store, sectionId) => {
  const next = clone(store);
  const before = next.sections.length;
  next.sections = next.sections.filter((entry) => entry.id !== text(sectionId));
  if (next.sections.length === before) return { ok: false, code: 'SECTION_NOT_FOUND', store: next };
  next.updatedAt = nowIso();
  return { ok: true, store: next };
};

export const transferSelectionToSong = (store, payload = {}) => {
  const selected = String(payload.selection || '').trim();
  if (!selected) return { ok: false, code: 'EMPTY_SELECTION', store: clone(store) };

  const mode = text(payload.mode) || 'append';
  const targetId = text(payload.targetSectionId);
  const next = clone(store);
  const section = next.sections.find((entry) => entry.id === targetId);

  if (mode === 'new-section') {
    next.sections.push(makeSection({ type: text(payload.newType) || 'Notiz', content: selected }));
    next.updatedAt = nowIso();
    return { ok: true, code: 'TRANSFERRED_NEW_SECTION', store: next };
  }

  if (!section) return { ok: false, code: 'TARGET_SECTION_MISSING', store: next };
  section.content = mode === 'replace' ? selected : `${section.content}${section.content ? '\n' : ''}${selected}`;
  section.updatedAt = nowIso();
  next.updatedAt = nowIso();
  return { ok: true, code: 'TRANSFERRED', store: next };
};

const insertReusable = (items, label, content) => {
  const clean = String(content || '').trim();
  if (!clean) return items;
  const existing = items.find((entry) => entry.content.trim() === clean);
  if (existing) return items;
  return [{ id: createId('reuse'), label, content: clean, favorite: false, updatedAt: nowIso() }, ...items];
};

export const saveReusableFromSection = (store, sectionId) => {
  const next = clone(store);
  const section = next.sections.find((entry) => entry.id === text(sectionId));
  if (!section) return { ok: false, code: 'SECTION_NOT_FOUND', store: next };

  if (section.type === 'Refrain') next.refrains = insertReusable(next.refrains, section.title, section.content);
  if (section.type === 'Hook') next.hooks = insertReusable(next.hooks, section.title, section.content);
  next.updatedAt = nowIso();
  return { ok: true, store: next };
};

export const toggleReusableFavorite = (store, bucket, itemId) => {
  const next = clone(store);
  const listName = bucket === 'hooks' ? 'hooks' : 'refrains';
  const entry = next[listName].find((item) => item.id === text(itemId));
  if (!entry) return { ok: false, code: 'REUSABLE_NOT_FOUND', store: next };
  entry.favorite = !entry.favorite;
  entry.updatedAt = nowIso();
  next.updatedAt = nowIso();
  return { ok: true, store: next };
};

export const listQuickAccessButtons = (store) => [
  ...store.refrains.filter((entry) => entry.favorite).map((entry) => ({ ...entry, bucket: 'refrains' })),
  ...store.hooks.filter((entry) => entry.favorite).map((entry) => ({ ...entry, bucket: 'hooks' }))
];

export const applyReusableToSection = (store, reusable, targetSectionId, mode = 'append') => {
  return transferSelectionToSong(store, {
    selection: reusable?.content || '',
    mode,
    targetSectionId
  });
};

const normalizeSongTitle = (title) => text(title).toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_').replace(/^_+|_+$/g, '') || 'song';

export const saveSongToArchive = (store, title) => {
  const next = clone(store);
  const cleanTitle = text(title) || 'Unbenannter Song';
  const key = normalizeSongTitle(cleanTitle);
  const versions = next.archive.filter((entry) => entry.baseKey === key).length;
  const version = versions + 1;
  const id = `${key}_v${version}`;

  next.archive.unshift({
    id,
    baseKey: key,
    title: cleanTitle,
    version,
    createdAt: nowIso(),
    sections: clone(next.sections)
  });
  next.updatedAt = nowIso();
  return { ok: true, archiveId: id, store: next };
};

export const searchArchive = (store, query = '') => {
  const needle = text(query).toLowerCase();
  const list = clone(asList(store.archive));
  if (!needle) return list;
  return list.filter((entry) => entry.title.toLowerCase().includes(needle) || entry.id.toLowerCase().includes(needle));
};

export const renderSongPreview = (store) => store.sections
  .map((section) => `${section.title}\n${section.content}`.trim())
  .join('\n\n');

export const listSectionTemplates = () => [...STANDARD_SECTION_TYPES];
export const canAutoSaveReusable = (sectionType) => QUICK_TYPES.includes(text(sectionType));

export const requestRhymesForWord = async (rhymeModuleApi, word) => {
  const cleanWord = text(word);
  if (!cleanWord) return { ok: false, code: 'EMPTY_WORD', matches: [] };
  if (!rhymeModuleApi || typeof rhymeModuleApi.searchRhymes !== 'function') {
    return { ok: false, code: 'RHYME_API_MISSING', matches: [] };
  }
  const response = await rhymeModuleApi.searchRhymes(cleanWord);
  if (!response || response.ok !== true) return { ok: false, code: 'RHYME_QUERY_FAILED', matches: [] };
  return { ok: true, code: 'RHYME_QUERY_OK', matches: asList(response.matches) };
};
