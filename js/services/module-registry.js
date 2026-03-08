const MODULE_FILES = Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic']);
const FALLBACK_MODULE_IDS = Object.freeze(['backup_funktions_modul', 'datenbank_baukasten', 'debugging_modul', 'logging_modul', 'todo_kalender_erinnerung', 'wiki_notiz_wissen']);

const filePath = (id, file) => `./modules/${id}/${file === 'logic' ? 'logic.js' : `${file}.json`}`;

const readJsonIfOk = async (path) => {
  try {
    const response = await fetch(path, { method: 'GET' });
    if (!response.ok) return { ok: false, code: 'MISSING' };
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
  const registry = await readJsonIfOk('./data/module-registry.json');
  if (!registry.ok) {
    return {
      ids: [...FALLBACK_MODULE_IDS],
      source: 'fallback',
      fallbackReason: 'module-registry.json fehlt oder ist nicht lesbar',
      nextStep: 'Datei data/module-registry.json prüfen oder neu erzeugen.'
    };
  }

  if (registry.data?.version !== 1) {
    return {
      ids: [...FALLBACK_MODULE_IDS],
      source: 'fallback',
      fallbackReason: 'module-registry.json hat keine gültige version (erwartet: 1)',
      nextStep: 'In data/module-registry.json das Feld "version" auf 1 setzen.'
    };
  }

  // Altformat "modules" bleibt nur als Lese-Fallback erlaubt.
  const moduleIds = Array.isArray(registry.data?.moduleIds)
    ? registry.data.moduleIds
    : (Array.isArray(registry.data?.modules)
        ? registry.data.modules.map((entry) => (typeof entry === 'string' ? entry : entry?.id))
        : null);
  if (!Array.isArray(moduleIds)) {
    return {
      ids: [...FALLBACK_MODULE_IDS],
      source: 'fallback',
      fallbackReason: 'module-registry.json hat kein gültiges moduleIds-Array',
      nextStep: 'In data/module-registry.json ein Array "moduleIds" mit Text-IDs eintragen.'
    };
  }

  // Nur echte Text-IDs akzeptieren, damit kein "[object Object]" als Modul-ID durchrutscht.
  const ids = [...new Set(moduleIds.filter((id) => typeof id === 'string').map((id) => id.trim()).filter(Boolean))];
  if (ids.length === 0) {
    return {
      ids: [...FALLBACK_MODULE_IDS],
      source: 'fallback',
      fallbackReason: 'module-registry.json enthält keine nutzbaren Modul-IDs',
      nextStep: 'Mindestens eine gültige Modul-ID in "moduleIds" eintragen.'
    };
  }

  return { ids, source: 'data/module-registry.json', fallbackReason: null, nextStep: null };
};

const checkProfile = async (id) => {
  let moduleName = id;
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
      moduleName = hasText(manifest.data?.name) ? manifest.data.name.trim() : id;
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

  const isHealthy = missingFiles.length === 0 && issues.length === 0;
  const statusCode = isHealthy ? 'OK' : (missingFiles.length > 0 ? 'MISSING_FILES' : 'INVALID_CONTENT');

  return { id, name: moduleName, ok: isHealthy, statusCode, missingFiles, issues };
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

const missingFileHintFor = (file) => {
  if (file === 'manifest') return 'Hilfe: Datei modules/<modul-id>/manifest.json anlegen (id, name, version eintragen).';
  if (file === 'config') return 'Hilfe: Datei modules/<modul-id>/config.json als JSON-Objekt { ... } anlegen.';
  if (file === 'texts') return 'Hilfe: Datei modules/<modul-id>/texts.json als JSON-Objekt { ... } anlegen.';
  if (file === 'schema') return 'Hilfe: Datei modules/<modul-id>/schema.json als JSON-Objekt { ... } anlegen.';
  if (file === 'logic') return 'Hilfe: Datei modules/<modul-id>/logic.js anlegen und die Modul-Funktionen exportieren.';
  return 'Hilfe: Fehlende Moduldatei anlegen.';
};

const buildSummary = (modules, source) => {
  const healthyModules = modules.filter((item) => item.ok).length;
  const brokenModules = modules.filter((item) => !item.ok);

  if (brokenModules.length === 0) {
    return `${healthyModules}/${modules.length} Module vollständig verbunden (Quelle: ${source}).`;
  }

  const detail = brokenModules
    .map((item) => {
      if (item.missingFiles.length > 0) {
        const firstMissingFile = item.missingFiles[0];
        return `${item.id}: fehlt ${item.missingFiles.join(', ')}. ${missingFileHintFor(firstMissingFile)}`;
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
  const summary = buildSummary(modules, moduleIds.source);
  if (!moduleIds.fallbackReason) return { modules, summary };

  return {
    modules,
    summary: `${summary} Hinweis: Fallback aktiv, weil ${moduleIds.fallbackReason}.${moduleIds.nextStep ? ` Nächster Schritt: ${moduleIds.nextStep}` : ''}`
  };
};

export const detectTemplateDesignStatus = () => {
  if (typeof document === 'undefined' || typeof document.querySelector !== 'function') {
    return {
      ok: false,
      message: 'Vorlagen-Design-Status ist nur im Browser prüfbar.'
    };
  }

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
