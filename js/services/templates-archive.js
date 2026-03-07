const TEMPLATE_CATEGORIES = ['Textbaustein', 'Promptvorlage', 'Arbeitsphrase'];

const DEFAULT_TEMPLATE_ITEMS = Object.freeze([
  {
    title: 'Kurzantwort in einfacher Sprache',
    category: 'Textbaustein',
    content: 'Bitte erkläre das Ergebnis in drei kurzen Punkten und nenne den nächsten sicheren Schritt.'
  },
  {
    title: 'Fehleranalyse Schritt für Schritt',
    category: 'Promptvorlage',
    content: 'Analysiere den Fehler Schritt für Schritt: Ursache, direkte Auswirkung, kleinster Fix, kurzer Test.'
  },
  {
    title: 'Sauberer Patch-Plan',
    category: 'Arbeitsphrase',
    content: 'Ziel, betroffene Datei, betroffener Block, Patchgrund, Risiko, Nicht-Änderung, Schritte.'
  },
  {
    title: 'Commit-Nachricht kompakt',
    category: 'Textbaustein',
    content: 'feat: klarer Titel\n\n- Änderung 1\n- Änderung 2\n- Test: <befehl>'
  },
  {
    title: 'UI-Checkliste vor Merge',
    category: 'Arbeitsphrase',
    content: 'Prüfe Fokus, Lesbarkeit, responsives Verhalten und sichtbare Fehlermeldungen mit kurzem Ergebnisprotokoll.'
  }
]);

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const normalizeContent = (value) => String(value || '').replace(/\r\n/g, '\n').trim();

const makeId = () => `tpl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeCategory = (value) => {
  const text = normalizeText(value);
  return TEMPLATE_CATEGORIES.includes(text) ? text : TEMPLATE_CATEGORIES[0];
};

const sortItems = (items) => items.sort((a, b) => a.title.localeCompare(b.title, 'de', { sensitivity: 'base' }));

export const TEMPLATE_ARCHIVE_PATH = 'data/templates-archive.json';

export const templateCategories = TEMPLATE_CATEGORIES;

export const createDefaultTemplateArchive = () => ({
  version: 1,
  items: sortItems(DEFAULT_TEMPLATE_ITEMS.map((item, index) => ({
    id: `tpl-default-${String(index + 1).padStart(2, '0')}`,
    title: normalizeText(item.title),
    content: normalizeContent(item.content),
    category: normalizeCategory(item.category),
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))),
  updatedAt: new Date().toISOString()
});

export const normalizeTemplateArchive = (input) => {
  const base = createDefaultTemplateArchive();
  const safe = input && typeof input === 'object' ? input : {};
  const items = Array.isArray(safe.items) ? safe.items : [];
  const dedup = new Map();

  items.forEach((item) => {
    const title = normalizeText(item?.title);
    const content = normalizeContent(item?.content);
    if (!title || !content) return;
    const id = normalizeText(item?.id) || makeId();
    dedup.set(id, {
      id,
      title,
      content,
      category: normalizeCategory(item?.category),
      favorite: Boolean(item?.favorite),
      createdAt: normalizeText(item?.createdAt) || new Date().toISOString(),
      updatedAt: normalizeText(item?.updatedAt) || new Date().toISOString()
    });
  });

  base.items = sortItems([...dedup.values()]);
  base.updatedAt = normalizeText(safe.updatedAt) || new Date().toISOString();
  return base;
};

export const addTemplate = ({ archive, title, content, category }) => {
  const safeTitle = normalizeText(title);
  const safeContent = normalizeContent(content);
  if (!safeTitle || !safeContent) {
    return { ok: false, code: 'TEMPLATE_EMPTY', message: 'Bitte Titel und Text eingeben.' };
  }
  const duplicate = archive.items.some((item) => item.title.toLowerCase() === safeTitle.toLowerCase());
  if (duplicate) {
    return { ok: false, code: 'TEMPLATE_DUPLICATE', message: 'Titel ist schon vorhanden.' };
  }

  archive.items.push({
    id: makeId(),
    title: safeTitle,
    content: safeContent,
    category: normalizeCategory(category),
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  sortItems(archive.items);
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'TEMPLATE_ADDED', message: 'Vorlage wurde gespeichert.' };
};

export const editTemplate = ({ archive, id, title, content, category }) => {
  const target = archive.items.find((item) => item.id === id);
  if (!target) {
    return { ok: false, code: 'TEMPLATE_MISSING', message: 'Vorlage wurde nicht gefunden.' };
  }
  const safeTitle = normalizeText(title);
  const safeContent = normalizeContent(content);
  if (!safeTitle || !safeContent) {
    return { ok: false, code: 'TEMPLATE_EMPTY', message: 'Bitte Titel und Text eingeben.' };
  }
  const duplicate = archive.items.some((item) => item.id !== id && item.title.toLowerCase() === safeTitle.toLowerCase());
  if (duplicate) {
    return { ok: false, code: 'TEMPLATE_DUPLICATE', message: 'Titel ist schon vorhanden.' };
  }
  target.title = safeTitle;
  target.content = safeContent;
  target.category = normalizeCategory(category);
  target.updatedAt = new Date().toISOString();
  sortItems(archive.items);
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'TEMPLATE_UPDATED', message: 'Vorlage wurde geändert.' };
};

export const removeTemplate = ({ archive, id }) => {
  const before = archive.items.length;
  archive.items = archive.items.filter((item) => item.id !== id);
  if (archive.items.length === before) {
    return { ok: false, code: 'TEMPLATE_MISSING', message: 'Vorlage wurde nicht gefunden.' };
  }
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'TEMPLATE_REMOVED', message: 'Vorlage wurde entfernt.' };
};

export const toggleTemplateFavorite = ({ archive, id }) => {
  const target = archive.items.find((item) => item.id === id);
  if (!target) {
    return { ok: false, code: 'TEMPLATE_MISSING', message: 'Vorlage wurde nicht gefunden.' };
  }
  target.favorite = !target.favorite;
  target.updatedAt = new Date().toISOString();
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'TEMPLATE_FAVORITE_TOGGLED', message: target.favorite ? 'Favorit gesetzt.' : 'Favorit entfernt.' };
};
