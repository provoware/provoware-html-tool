const MODULE_FILES = Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic']);

const MODULE_PROFILES = Object.freeze([
  Object.freeze({ id: 'datenbank_baukasten' }),
  Object.freeze({ id: 'todo_kalender_erinnerung' })
]);

const exists = async (path) => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    if (response.ok) return true;
  } catch {
    // Fallback über GET bei eingeschränkten Servern.
  }

  try {
    const response = await fetch(path, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
};

const checkProfile = async (id) => {
  const checks = await Promise.all(MODULE_FILES.map(async (file) => ({
    file,
    ok: await exists(`./modules/${id}/${file === 'logic' ? 'logic.js' : `${file}.json`}`)
  })));

  const missingFiles = checks.filter((item) => !item.ok).map((item) => item.file);
  return {
    id,
    ok: missingFiles.length === 0,
    missingFiles
  };
};

export const loadModuleRegistry = async () => {
  const modules = await Promise.all(MODULE_PROFILES.map((profile) => checkProfile(profile.id)));
  const healthyModules = modules.filter((item) => item.ok).length;

  return {
    modules,
    summary: `${healthyModules}/${modules.length} Module vollständig verbunden.`
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
