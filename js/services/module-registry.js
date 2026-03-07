const MODULE_FILES = Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic']);

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
    const manifest = await readJsonIfOk(filePath(id, 'manifest'));
    if (!manifest.ok) {
      issues.push(manifest.code === 'BROKEN_JSON' ? 'manifest ungültig' : 'manifest fehlt');
    } else {
      const problem = validateManifest(manifest.data, id);
      if (problem) issues.push(problem);
    }

    const config = await readJsonIfOk(filePath(id, 'config'));
    if (!config.ok) {
      issues.push(config.code === 'BROKEN_JSON' ? 'config ungültig' : 'config fehlt');
    } else {
      const problem = validateSimpleObject(config.data, 'config');
      if (problem) issues.push(problem);
    }

    const texts = await readJsonIfOk(filePath(id, 'texts'));
    if (!texts.ok) {
      issues.push(texts.code === 'BROKEN_JSON' ? 'texts ungültig' : 'texts fehlt');
    } else {
      const problem = validateSimpleObject(texts.data, 'texts');
      if (problem) issues.push(problem);
    }

    const schema = await readJsonIfOk(filePath(id, 'schema'));
    if (!schema.ok) {
      issues.push(schema.code === 'BROKEN_JSON' ? 'schema ungültig' : 'schema fehlt');
    } else {
      const problem = validateSimpleObject(schema.data, 'schema');
      if (problem) issues.push(problem);
    }
  }

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
    return `${healthyModules}/${modules.length} Module vollständig verbunden.`;
  }

  const detail = brokenModules
    .map((item) => {
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
