import {
  buildAccountProfilePayload,
  buildAccountSearchText,
  findDuplicateProfileName,
  sanitizeCustomFields,
  validateAccountTitleInput
} from '../../modules/account_archiv_modul/logic.js';

export const ACCOUNT_ARCHIVE_PATH = 'data/account-archive.json';

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const toIso = (value) => {
  const text = normalizeText(value);
  if (!text) return new Date().toISOString();
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const normalizeTags = (value) => {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(values.map((item) => normalizeText(item)).filter(Boolean))];
};

const normalizeProfile = (input = {}) => {
  const built = buildAccountProfilePayload(input);
  const profileName = built.ok ? built.profile.profileName : 'Profil';
  return {
    id: normalizeText(input.id) || makeId('acct-profile'),
    profileName,
    loginEmail: built.ok ? built.profile.loginEmail : normalizeText(input.loginEmail),
    websiteUrl: built.ok ? built.profile.websiteUrl : '',
    username: built.ok ? built.profile.username : normalizeText(input.username),
    notes: built.ok ? built.profile.notes : normalizeText(input.notes),
    tags: built.ok ? built.profile.tags : normalizeTags(input.tags),
    customFields: sanitizeCustomFields(input.customFields),
    openCount: Number(input.openCount) > 0 ? Number(input.openCount) : 0,
    lastOpenedAt: normalizeText(input.lastOpenedAt),
    createdAt: toIso(input.createdAt),
    updatedAt: toIso(input.updatedAt)
  };
};

const normalizeItem = (input = {}) => {
  const title = normalizeText(input.title) || 'Unbenannter Titel';
  const profiles = Array.isArray(input.profiles) ? input.profiles.map((profile) => normalizeProfile(profile)) : [];
  return {
    id: normalizeText(input.id) || makeId('acct-title'),
    title,
    archived: Boolean(input.archived),
    favorite: Boolean(input.favorite),
    openCount: Number(input.openCount) > 0 ? Number(input.openCount) : 0,
    lastOpenedAt: normalizeText(input.lastOpenedAt),
    createdAt: toIso(input.createdAt),
    updatedAt: toIso(input.updatedAt),
    tags: normalizeTags(input.tags),
    profiles
  };
};

const sortByUpdated = (items) => items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export const createDefaultAccountArchive = () => ({
  version: 1,
  items: [],
  stats: buildAccountArchiveStats({ items: [] }),
  updatedAt: new Date().toISOString()
});

export const buildAccountArchiveStats = (archive) => {
  const items = Array.isArray(archive?.items) ? archive.items : [];
  const profiles = items.flatMap((item) => item.profiles || []);
  const mostViewed = [...items].sort((a, b) => (b.openCount || 0) - (a.openCount || 0))[0];
  return {
    titles: items.filter((item) => !item.archived).length,
    profiles: profiles.length,
    favorites: items.filter((item) => item.favorite && !item.archived).length,
    multiProfileTitles: items.filter((item) => (item.profiles || []).length > 1 && !item.archived).length,
    mostViewedTitle: mostViewed?.title || '-'
  };
};

export const normalizeAccountArchive = (input, options = {}) => {
  const safe = input && typeof input === 'object' ? input : {};
  const dedup = new Map();
  const repair = { applied: false, reason: '' };
  (Array.isArray(safe.items) ? safe.items : []).forEach((item) => {
    const normalized = normalizeItem(item);
    if (!normalizeText(normalized.title)) return;
    dedup.set(normalized.id, normalized);
  });
  const archive = {
    version: 1,
    items: sortByUpdated([...dedup.values()]),
    stats: { titles: 0, profiles: 0, favorites: 0, multiProfileTitles: 0, mostViewedTitle: '-' },
    updatedAt: toIso(safe.updatedAt)
  };
  archive.stats = buildAccountArchiveStats(archive);
  if (!Array.isArray(safe.items) || typeof safe.version !== 'number') {
    repair.applied = true;
    repair.reason = 'Archivstruktur wurde defensiv normalisiert.';
  }
  if (options.withReport) return { archive, repair };
  return archive;
};

export const addAccountTitle = ({ archive, title, tags }) => {
  const checked = validateAccountTitleInput({ title, tags });
  if (!checked.ok) return checked;
  const duplicate = archive.items.some((item) => item.title.toLowerCase() === checked.title.toLowerCase() && !item.archived);
  if (duplicate) return { ok: false, code: 'ACCOUNT_TITLE_DUPLICATE', message: 'Titel ist bereits vorhanden.' };
  archive.items.unshift({
    id: makeId('acct-title'),
    title: checked.title,
    archived: false,
    favorite: false,
    openCount: 0,
    lastOpenedAt: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: checked.tags,
    profiles: []
  });
  archive.updatedAt = new Date().toISOString();
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_TITLE_ADDED', message: 'Titel wurde angelegt.' };
};

export const updateAccountTitle = ({ archive, titleId, patch }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  if (!target) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
  if (patch?.title !== undefined) {
    const checked = validateAccountTitleInput({ title: patch.title, tags: target.tags });
    if (!checked.ok) return checked;
    target.title = checked.title;
  }
  if (patch?.tags !== undefined) target.tags = normalizeTags(patch.tags);
  target.favorite = patch?.favorite === undefined ? target.favorite : Boolean(patch.favorite);
  target.updatedAt = new Date().toISOString();
  archive.updatedAt = target.updatedAt;
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_TITLE_UPDATED', message: 'Titel wurde geändert.' };
};

export const archiveAccountTitle = ({ archive, titleId }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  if (!target) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
  target.archived = true;
  target.updatedAt = new Date().toISOString();
  archive.updatedAt = target.updatedAt;
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_TITLE_ARCHIVED', message: 'Titel wurde archiviert.' };
};

export const addAccountProfile = ({ archive, titleId, profile }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  if (!target) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
  const built = buildAccountProfilePayload(profile);
  if (!built.ok) return built;
  if (findDuplicateProfileName(target.profiles, built.profile.profileName)) {
    return { ok: false, code: 'ACCOUNT_PROFILE_DUPLICATE', message: 'Profilname ist in diesem Titel bereits vorhanden.' };
  }
  target.profiles.push({
    id: makeId('acct-profile'),
    ...built.profile,
    openCount: 0,
    lastOpenedAt: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  target.updatedAt = new Date().toISOString();
  archive.updatedAt = target.updatedAt;
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_PROFILE_ADDED', message: 'Profil wurde angelegt.' };
};

export const updateAccountProfile = ({ archive, titleId, profileId, patch }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  const profile = target?.profiles?.find((entry) => entry.id === profileId);
  if (!target || !profile) return { ok: false, code: 'ACCOUNT_PROFILE_MISSING', message: 'Profil wurde nicht gefunden.' };
  const built = buildAccountProfilePayload({ ...profile, ...patch });
  if (!built.ok) return built;
  if (findDuplicateProfileName(target.profiles, built.profile.profileName, profileId)) {
    return { ok: false, code: 'ACCOUNT_PROFILE_DUPLICATE', message: 'Profilname ist in diesem Titel bereits vorhanden.' };
  }
  Object.assign(profile, built.profile, { updatedAt: new Date().toISOString() });
  target.updatedAt = profile.updatedAt;
  archive.updatedAt = profile.updatedAt;
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_PROFILE_UPDATED', message: 'Profil wurde geändert.' };
};

export const removeOrArchiveAccountProfile = ({ archive, titleId, profileId }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  if (!target) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
  const before = target.profiles.length;
  target.profiles = target.profiles.filter((profile) => profile.id !== profileId);
  if (before === target.profiles.length) return { ok: false, code: 'ACCOUNT_PROFILE_MISSING', message: 'Profil wurde nicht gefunden.' };
  target.updatedAt = new Date().toISOString();
  archive.updatedAt = target.updatedAt;
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_PROFILE_REMOVED', message: 'Profil wurde entfernt.' };
};

export const addCustomField = ({ archive, titleId, profileId, label, value }) => {
  return updateAccountProfile({ archive, titleId, profileId, patch: { customFields: [...(archive.items.find((item) => item.id === titleId)?.profiles.find((p) => p.id === profileId)?.customFields || []), { label, value }] } });
};

export const updateCustomField = ({ archive, titleId, profileId, index, label, value }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  const profile = target?.profiles?.find((entry) => entry.id === profileId);
  if (!target || !profile) return { ok: false, code: 'ACCOUNT_PROFILE_MISSING', message: 'Profil wurde nicht gefunden.' };
  const next = [...profile.customFields];
  if (!next[index]) return { ok: false, code: 'ACCOUNT_CUSTOM_FIELD_MISSING', message: 'Zusatzfeld wurde nicht gefunden.' };
  next[index] = { label, value };
  return updateAccountProfile({ archive, titleId, profileId, patch: { customFields: next } });
};

export const removeCustomField = ({ archive, titleId, profileId, index }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  const profile = target?.profiles?.find((entry) => entry.id === profileId);
  if (!target || !profile) return { ok: false, code: 'ACCOUNT_PROFILE_MISSING', message: 'Profil wurde nicht gefunden.' };
  const next = profile.customFields.filter((_, customIndex) => customIndex !== index);
  return updateAccountProfile({ archive, titleId, profileId, patch: { customFields: next } });
};

export const markAccountOpened = ({ archive, titleId, profileId = '' }) => {
  const target = archive.items.find((item) => item.id === titleId && !item.archived);
  if (!target) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
  const now = new Date().toISOString();
  target.openCount += 1;
  target.lastOpenedAt = now;
  target.updatedAt = now;
  if (profileId) {
    const profile = target.profiles.find((entry) => entry.id === profileId);
    if (profile) {
      profile.openCount += 1;
      profile.lastOpenedAt = now;
      profile.updatedAt = now;
    }
  }
  archive.updatedAt = now;
  archive.stats = buildAccountArchiveStats(archive);
  return { ok: true, code: 'ACCOUNT_OPENED', message: 'Zugriff wurde gezählt.' };
};

export const getFavoriteAccounts = (archive) => (archive.items || []).filter((item) => item.favorite && !item.archived);
export const getMostViewedAccounts = (archive, limit = 3) => [...(archive.items || [])]
  .filter((item) => !item.archived)
  .sort((a, b) => (b.openCount || 0) - (a.openCount || 0))
  .slice(0, limit);

export const searchAccountArchive = (archive, query) => {
  const needle = normalizeText(query).toLowerCase();
  const items = (archive.items || []).filter((item) => !item.archived);
  if (!needle) return items;
  return items.filter((item) => buildAccountSearchText(item).includes(needle));
};
