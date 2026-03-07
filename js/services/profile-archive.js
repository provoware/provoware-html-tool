const CATEGORIES = ['genres', 'moods', 'styles'];
const TEMPLATE_AREAS = ['programmierung', 'linux-befehle', 'vibe-coding', 'chat-gpt-prompts', 'automation', 'analyse', 'recherche', 'optimierung', 'gui-bau-planung'];

const DEFAULT_PROFILE_CONTENT = Object.freeze({
  HardTechno: {
    genres: ['Hard Techno', 'Industrial Techno', 'Schranz', 'Rave', 'Gabber', 'Acid Techno', 'Rawstyle'],
    moods: ['treibend', 'düster', 'aggressiv', 'energiegeladen', 'hypnotisch', 'unterirdisch', 'aufgeladen'],
    styles: ['Peak-Time', 'Warehouse', 'Underground Club', 'Berlin School', 'Live-DJ-Set', 'Hybrid Set', 'Festival Mainfloor']
  },
  Chill: {
    genres: ['Lo-Fi', 'Downtempo', 'Ambient', 'Trip-Hop', 'Balearic', 'Chillout', 'Bossa Nova Electronica'],
    moods: ['ruhig', 'warm', 'nostalgisch', 'leicht', 'meditativ', 'sonnig', 'nachtaktiv'],
    styles: ['Cafe Session', 'Sunset Mix', 'Rainy Day', 'Study Flow', 'Dreamscape', 'Late Night Radio', 'Coastal Vibes']
  },
  Hörspiele: {
    genres: ['Krimi', 'Science-Fiction', 'Fantasy', 'Historisch', 'Comedy', 'True Crime', 'Regionaldialekt'],
    moods: ['spannend', 'mystisch', 'humorvoll', 'ernst', 'abenteuerlich', 'unheimlich', 'nahbar'],
    styles: ['Binaural', 'Erzähler-zentriert', 'Dialog-lastig', 'Atmosphärisch', 'Kinderfreundlich', 'Noir', 'Underground-Podcast']
  }
});

const DEFAULT_TEMPLATE_ARCHIVE = Object.freeze({
  version: 1,
  categories: {
    programmierung: ['TypeScript API-Grundgerüst', 'Python Datenpipeline', 'Rust CLI-Skeleton', 'Go Worker-Service', 'C# WebAPI Starter'],
    'linux-befehle': ['Dateien finden mit find + xargs', 'Systemlast prüfen mit top/htop', 'Rechte setzen mit chmod/chown', 'Logs filtern mit journalctl', 'Netz prüfen mit ss und ping'],
    'vibe-coding': ['Feature in 30 Minuten als Mini-Prototyp', 'Refactor mit Fokus auf Lesbarkeit', 'Code-Walkthrough für Teamübergabe', 'Pair-Prompt für Bugfix', 'Spikes für neue Idee'],
    'chat-gpt-prompts': ['Bug reproduzieren und eingrenzen', 'Code Review mit Risiko-Liste', 'API-Dokumentation in einfacher Sprache', 'Testfälle aus User Story ableiten', 'Architektur-Entscheidung mit Pros/Cons'],
    automation: ['CI-Check für Lint+Test', 'Release-Tag automatisch erzeugen', 'Backups nachts rotieren', 'CSV-Import per Cronjob', 'Webhook mit Retry'],
    analyse: ['Fehlercluster aus Logs bilden', 'Laufzeitengpässe messen', 'Datenqualität als Score', 'A/B Ergebnisvergleich', 'Risikomatrix für Deploy'],
    recherche: ['Technologie-Vergleich nach Kriterien', 'Regionales Hosting prüfen', 'Open-Source-Lizenzcheck', 'Underground-Community-Trends sammeln', 'Quellenbewertung mit Vertrauensgrad'],
    optimierung: ['Build-Zeit verkürzen', 'Caching-Strategie einführen', 'Datenbankindex prüfen', 'Bundle-Size reduzieren', 'Barrierefreiheit verbessern'],
    'gui-bau-planung': ['Wireframe für Dashboard', 'Formular mit Fehlerhinweisen', 'Komponentenbaum planen', 'Nutzerfluss als Schrittkette', 'Design-Token-Liste erstellen']
  }
});

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const ensureProfile = (archive, profile) => {
  if (!archive.profiles[profile]) {
    archive.profiles[profile] = { genres: [], moods: [], styles: [] };
  }
  return archive.profiles[profile];
};

const toRecord = (value) => ({ value: normalizeText(value), createdAt: new Date().toISOString() });

const normalizeRecordList = (list) => {
  const dedup = new Map();
  list.forEach((item) => {
    const value = normalizeText(item?.value ?? item);
    if (!value) return;
    const key = value.toLowerCase();
    if (dedup.has(key)) return;
    dedup.set(key, {
      value,
      createdAt: item?.createdAt && String(item.createdAt).trim() ? String(item.createdAt) : new Date().toISOString()
    });
  });
  return [...dedup.values()].sort(byValue);
};

const createDefaultProfiles = () => Object.fromEntries(
  Object.entries(DEFAULT_PROFILE_CONTENT).map(([profileName, profile]) => [
    profileName,
    {
      genres: normalizeRecordList(profile.genres),
      moods: normalizeRecordList(profile.moods),
      styles: normalizeRecordList(profile.styles)
    }
  ])
);

const createDefaultTemplateArchive = () => ({
  version: DEFAULT_TEMPLATE_ARCHIVE.version,
  categories: Object.fromEntries(
    TEMPLATE_AREAS.map((area) => [area, normalizeRecordList(DEFAULT_TEMPLATE_ARCHIVE.categories[area] || [])])
  )
});

const byValue = (a, b) => a.value.localeCompare(b.value, 'de', { sensitivity: 'base' });
const byCreated = (a, b) => a.createdAt.localeCompare(b.createdAt);

export const ARCHIVE_PATH = 'data/profile-archive.json';

export const createDefaultArchive = () => ({
  version: 1,
  profiles: createDefaultProfiles(),
  templateArchive: createDefaultTemplateArchive(),
  events: [],
  lastMix: null,
  updatedAt: new Date().toISOString()
});

export const normalizeCategory = (value) => (CATEGORIES.includes(value) ? value : 'genres');

export const normalizeArchive = (input) => {
  const base = createDefaultArchive();
  const safe = input && typeof input === 'object' ? input : {};
  const profiles = safe.profiles && typeof safe.profiles === 'object' ? safe.profiles : {};

  Object.entries(profiles).forEach(([profileName, categories]) => {
    if (!categories || typeof categories !== 'object') return;
    base.profiles[profileName] = { genres: [], moods: [], styles: [] };
    CATEGORIES.forEach((category) => {
      const list = Array.isArray(categories[category]) ? categories[category] : [];
      base.profiles[profileName][category] = normalizeRecordList(list);
    });
  });

  const templateArchive = safe.templateArchive && typeof safe.templateArchive === 'object' ? safe.templateArchive : null;
  if (templateArchive) {
    const categories = templateArchive.categories && typeof templateArchive.categories === 'object' ? templateArchive.categories : {};
    base.templateArchive = {
      version: Number(templateArchive.version) || 1,
      categories: Object.fromEntries(
        TEMPLATE_AREAS.map((area) => [area, normalizeRecordList(Array.isArray(categories[area]) ? categories[area] : [])])
      )
    };
  }

  if (Array.isArray(safe.events)) {
    base.events = safe.events.slice(0, 200);
  }
  if (safe.lastMix && typeof safe.lastMix === 'object') {
    base.lastMix = safe.lastMix;
  }
  base.updatedAt = safe.updatedAt || new Date().toISOString();
  return base;
};

export const addEntry = ({ archive, profile, category, value }) => {
  const text = normalizeText(value);
  if (!text) return { ok: false, code: 'ENTRY_EMPTY', message: 'Bitte Text eingeben.' };
  const cat = normalizeCategory(category);
  const target = ensureProfile(archive, profile);
  const duplicate = target[cat].some((item) => item.value.toLowerCase() === text.toLowerCase());
  if (duplicate) return { ok: false, code: 'ENTRY_DUPLICATE', message: 'Eintrag ist schon vorhanden.' };
  target[cat].push(toRecord(text));
  target[cat].sort(byValue);
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'ENTRY_ADDED', message: 'Eintrag wurde gespeichert.' };
};

export const editEntry = ({ archive, profile, category, oldValue, newValue }) => {
  const text = normalizeText(newValue);
  const cat = normalizeCategory(category);
  const target = ensureProfile(archive, profile);
  const oldKey = normalizeText(oldValue).toLowerCase();
  const row = target[cat].find((item) => item.value.toLowerCase() === oldKey);
  if (!row) return { ok: false, code: 'ENTRY_MISSING', message: 'Eintrag wurde nicht gefunden.' };
  if (!text) return { ok: false, code: 'ENTRY_EMPTY', message: 'Bitte Text eingeben.' };
  const duplicate = target[cat].some((item) => item !== row && item.value.toLowerCase() === text.toLowerCase());
  if (duplicate) return { ok: false, code: 'ENTRY_DUPLICATE', message: 'Eintrag ist schon vorhanden.' };
  row.value = text;
  target[cat].sort(byValue);
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'ENTRY_UPDATED', message: 'Eintrag wurde geändert.' };
};

export const removeEntry = ({ archive, profile, category, value }) => {
  const cat = normalizeCategory(category);
  const target = ensureProfile(archive, profile);
  const key = normalizeText(value).toLowerCase();
  const next = target[cat].filter((item) => item.value.toLowerCase() !== key);
  if (next.length === target[cat].length) return { ok: false, code: 'ENTRY_MISSING', message: 'Eintrag wurde nicht gefunden.' };
  target[cat] = next;
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'ENTRY_REMOVED', message: 'Eintrag wurde entfernt.' };
};

export const sortArchive = ({ archive, mode }) => {
  const sorter = mode === 'created' ? byCreated : byValue;
  Object.values(archive.profiles).forEach((profile) => {
    CATEGORIES.forEach((category) => profile[category].sort(sorter));
  });
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'ARCHIVE_SORTED', message: 'Liste wurde sortiert.' };
};

const pickUnique = (items, amount) => {
  const pool = [...items];
  const result = [];
  while (pool.length && result.length < amount) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
};

export const createRandomMix = ({ archive, profile, includeCategories, amountPerCategory }) => {
  const target = ensureProfile(archive, profile);
  const categories = CATEGORIES.filter((category) => includeCategories?.includes(category));
  if (!categories.length) return { ok: false, code: 'MIX_NO_CATEGORY', message: 'Bitte mindestens einen Bereich wählen.' };

  const mix = {};
  categories.forEach((category) => {
    const requested = Number(amountPerCategory?.[category] || 0);
    const amount = Number.isFinite(requested) && requested > 0 ? Math.floor(requested) : 1;
    mix[category] = pickUnique(target[category], amount).map((item) => item.value);
  });

  const text = categories
    .map((category) => `${category}: ${mix[category].length ? mix[category].join(', ') : '-'}`)
    .join(' | ');

  archive.lastMix = { profile, mix, text, createdAt: new Date().toISOString() };
  archive.updatedAt = new Date().toISOString();
  return { ok: true, code: 'MIX_CREATED', message: 'Zufallsmix wurde erstellt.', data: archive.lastMix };
};

export const addArchiveEvent = (archive, type, message, details = null) => {
  archive.events = [{ timestamp: new Date().toISOString(), type, message, details }, ...archive.events].slice(0, 100);
};

export const buildStats = (archive, profile) => {
  const target = ensureProfile(archive, profile);
  const stats = {
    genres: target.genres.length,
    moods: target.moods.length,
    styles: target.styles.length
  };
  return { ...stats, total: stats.genres + stats.moods + stats.styles };
};

export const categories = CATEGORIES;
