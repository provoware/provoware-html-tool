const MODULE_FILES = Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic']);
const FALLBACK_MODULE_IDS = Object.freeze(['datenbank_baukasten', 'todo_kalender_erinnerung']);

const filePath = (id, file) => `./modules/${id}/${file === 'logic' ? 'logic.js' : `${file}.json`}`;

const readJson = async (path) => {
  try {
    const response = await fetch(path, { method: 'GET' });
    if (!response.ok) return { ok: false, code: 'MISSING' };

const MODULE_PROFILES = Object.freeze([
  Object.freeze({ id: 'datenbank_baukasten' }),
  Object.freeze({ id: 'todo_kalender_erinnerung' })
]);

const filePath = (id, file) => `./modules/${id}/${file === 'logic' ? 'logic.js' : `${file}.json`}`;

const readJsonIfOk = async (path) => {
  try {
    const response = await fetch(path, { method: 'GET' });
    if (!response.ok) {
      return { ok: false, code: 'MISSING' };
    }
    return { ok: true, data: await response.json() };
  } catch {
    return { ok: false, code: 'BROKEN_JSON' };
  }
};

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const validateManifest = (manifest, id) => {
  if (!manifest || typeof manifest !== 'object') return 'manifest ist kein Objekt';
  if (!hasText(manifest.id)) return 'manifest.id fehlt';
  if (manifest.id !== id) return `manifest.id ist ${manifest.id}, erwartet ${id}`;
  if (!hasText(manifest.name)) return 'manifest.name fehlt';
  if (!hasText(manifest.version)) return 'manifest.version fehlt';
  return null;
};

const validateSimpleObject = (value, field) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return `${field} ist kein Objekt`;
  return null;
};

const readModuleIds = async () => {
  const registry = await readJson('./data/module-registry.json');
  if (!registry.ok) {
    return { ids: [...FALLBACK_MODULE_IDS], source: 'fallback' };
  }

  const moduleIds = registry.data?.moduleIds;
  if (!Array.isArray(moduleIds)) {
    return { ids: [...FALLBACK_MODULE_IDS], source: 'fallback' };
  }

  const ids = [...new Set(moduleIds.map((id) => String(id || '').trim()).filter(Boolean))];
  if (ids.length === 0) {
    return { ids: [...FALLBACK_MODULE_IDS], source: 'fallback' };
  }

  return { ids, source: 'data/module-registry.json' };
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return `${field} ist kein Objekt`;
  }
  return null;
};

const checkProfile = async (id) => {
  const checks = await Promise.all(MODULE_FILES.map(async (file) => ({
    file,
    ok: (await fetch(filePath(id, file), { method: 'GET' }).catch(() => null))?.ok === true
  })));

  const missingFiles = checks.filter((item) => !item.ok).map((item) => item.file);
  const issues = [];

  if (missingFiles.length === 0) {
    const manifest = await readJson(filePath(id, 'manifest'));
    const manifest = await readJsonIfOk(filePath(id, 'manifest'));
    if (!manifest.ok) {
      issues.push(manifest.code === 'BROKEN_JSON' ? 'manifest ungültig' : 'manifest fehlt');
    } else {
      const problem = validateManifest(manifest.data, id);
      if (problem) issues.push(problem);
    }

    const config = await readJson(filePath(id, 'config'));
    const config = await readJsonIfOk(filePath(id, 'config'));
    if (!config.ok) {
      issues.push(config.code === 'BROKEN_JSON' ? 'config ungültig' : 'config fehlt');
    } else {
      const problem = validateSimpleObject(config.data, 'config');
      if (problem) issues.push(problem);
    }

    const texts = await readJson(filePath(id, 'texts'));
    const texts = await readJsonIfOk(filePath(id, 'texts'));
    if (!texts.ok) {
      issues.push(texts.code === 'BROKEN_JSON' ? 'texts ungültig' : 'texts fehlt');
    } else {
      const problem = validateSimpleObject(texts.data, 'texts');
      if (problem) issues.push(problem);
    }

    const schema = await readJson(filePath(id, 'schema'));
    const schema = await readJsonIfOk(filePath(id, 'schema'));
    if (!schema.ok) {
      issues.push(schema.code === 'BROKEN_JSON' ? 'schema ungültig' : 'schema fehlt');
    } else {
      const problem = validateSimpleObject(schema.data, 'schema');
      if (problem) issues.push(problem);
    }
  }

  return { id, ok: missingFiles.length === 0 && issues.length === 0, missingFiles, issues };
};

const fixHintFor = (issue) => {
  if (issue === 'manifest.id fehlt') return 'Hilfe: In manifest.json das Feld "id" ergänzen.';
  if (issue === 'manifest.name fehlt') return 'Hilfe: In manifest.json das Feld "name" ergänzen.';
  if (issue === 'manifest.version fehlt') return 'Hilfe: In manifest.json das Feld "version" ergänzen.';
  if (issue === 'manifest ungültig') return 'Hilfe: manifest.json auf gültiges JSON prüfen.';
  if (issue === 'config ungültig') return 'Hilfe: config.json auf gültiges JSON prüfen.';
  if (issue === 'texts ungültig') return 'Hilfe: texts.json auf gültiges JSON prüfen.';
  if (issue === 'schema ungültig') return 'Hilfe: schema.json auf gültiges JSON prüfen.';
  if (issue.includes('ist kein Objekt')) return 'Hilfe: Datei muss ein JSON-Objekt mit { ... } sein.';
  if (issue.includes('erwartet')) return 'Hilfe: manifest.id muss genau dem Ordnernamen entsprechen.';
  return 'Hilfe: Moduldateien prüfen und fehlende Pflichtfelder ergänzen.';
};

const buildSummary = (modules, source) => {
  return {
    id,
    ok: missingFiles.length === 0 && issues.length === 0,
    missingFiles,
    issues
  };
};

const buildSummary = (modules) => {
  const healthyModules = modules.filter((item) => item.ok).length;
  const brokenModules = modules.filter((item) => !item.ok);

  if (brokenModules.length === 0) {
    return `${healthyModules}/${modules.length} Module vollständig verbunden (Quelle: ${source}).`;
    return `${healthyModules}/${modules.length} Module vollständig verbunden.`;
  }

  const detail = brokenModules
    .map((item) => {
      if (item.missingFiles.length > 0) {
        return `${item.id}: fehlt ${item.missingFiles.join(', ')}. Hilfe: Datei anlegen.`;
      }
      const firstIssue = item.issues[0] || 'ungültig';
      return `${item.id}: ${firstIssue}. ${fixHintFor(firstIssue)}`;
    })
    .join(' | ');

  return `${healthyModules}/${modules.length} Module vollständig verbunden (Quelle: ${source}). Fehler: ${detail}`;
};

export const loadModuleRegistry = async () => {
  const moduleIds = await readModuleIds();
  const modules = await Promise.all(moduleIds.ids.map((id) => checkProfile(id)));
  return { modules, summary: buildSummary(modules, moduleIds.source) };
      if (item.missingFiles.length > 0) return `${item.id}: fehlt ${item.missingFiles.join(', ')}`;
      return `${item.id}: ${item.issues[0] || 'ungültig'}`;
    })
    .join(' | ');

  return `${healthyModules}/${modules.length} Module vollständig verbunden. Fehler: ${detail}.`;
};

export const loadModuleRegistry = async () => {
  const modules = await Promise.all(MODULE_PROFILES.map((profile) => checkProfile(profile.id)));
  return {
    modules,
    summary: buildSummary(modules)
  };
};

export const detectTemplateDesignStatus = () => {
  const hasTemplateCss = Boolean(document.querySelector('link[href="assets/css/base.css"]'));
  const hasTemplateJs = Boolean(document.querySelector('script[src="assets/js/core.js"]'));

  if (hasTemplateCss && hasTemplateJs) {
    return { ok: true, message: 'Vorlagen-Design aktiv (assets/css/base.css + assets/js/core.js eingebunden).' };
  }

  return {
    ok: false,
    message: 'Vorlagen-Design in assets ist nicht aktiv, weil index.html nur css/app.css und js/app.js lädt.'
  };
};
