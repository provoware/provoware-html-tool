const nowIso = () => new Date().toISOString();
const text = (value) => String(value || '').trim();
const createId = () => `rhy_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
const asWords = (value) => String(value || '')
  .split(/[;,\n]/)
  .map((word) => text(word).toLowerCase())
  .filter(Boolean);

const dedupe = (items) => [...new Set(items.map((item) => item.toLowerCase()))];

export const createRhymeStore = (raw = {}) => ({
  version: 1,
  entries: Array.isArray(raw.entries) ? raw.entries : [],
  updatedAt: nowIso()
});

export const upsertRhymeEntry = (store, payload = {}) => {
  const next = structuredClone(store);
  const referenceWord = text(payload.referenceWord).toLowerCase();
  if (!referenceWord) return { ok: false, code: 'REFERENCE_WORD_MISSING', store: next };

  const rhymes = dedupe(asWords(payload.rhymes));
  const variants = dedupe(asWords(payload.variants));
  const notes = text(payload.notes);

  const existing = next.entries.find((entry) => entry.referenceWord === referenceWord);
  if (existing) {
    existing.rhymes = dedupe([...existing.rhymes, ...rhymes]);
    existing.variants = dedupe([...existing.variants, ...variants]);
    if (notes) existing.notes = notes;
    existing.updatedAt = nowIso();
    next.updatedAt = nowIso();
    return { ok: true, code: 'RHYME_UPDATED', store: next, entry: structuredClone(existing) };
  }

  const entry = {
    id: createId(),
    referenceWord,
    rhymes,
    variants,
    notes,
    updatedAt: nowIso()
  };
  next.entries.unshift(entry);
  next.updatedAt = nowIso();
  return { ok: true, code: 'RHYME_CREATED', store: next, entry: structuredClone(entry) };
};

export const searchRhymes = (store, word) => {
  const needle = text(word).toLowerCase();
  if (!needle) return { ok: false, code: 'SEARCH_WORD_MISSING', matches: [] };

  const matches = store.entries
    .filter((entry) => entry.referenceWord.includes(needle) || entry.variants.some((variant) => variant.includes(needle)))
    .map((entry) => ({
      referenceWord: entry.referenceWord,
      rhymes: [...entry.rhymes],
      variants: [...entry.variants],
      notes: entry.notes || ''
    }));

  return { ok: true, code: 'SEARCH_DONE', matches };
};

export const buildCopyText = (searchResult) => {
  if (!searchResult || searchResult.ok !== true) return '';
  return searchResult.matches
    .map((entry) => `${entry.referenceWord}: ${entry.rhymes.join(', ')}`)
    .join('\n');
};

export const createSongModuleBridge = (store) => ({
  searchRhymes: async (word) => searchRhymes(store, word)
});
