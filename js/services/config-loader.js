import { logEvent } from './logger.js';

const FALLBACKS = {
  appConfig: { appName: 'ProvoWare Dashboard', version: '0.1.0', defaultTheme: 'dunkel', layoutModes: ['standard'], startBehavior: { selftestAsFirstStep: true } },
  themes: { dunkel: { bg: '#0f172a', bgPanel: '#182238', textMain: '#f8fafc' } },
  uiTexts: { messages: { startupBlocked: 'Start ist noch nicht bereit.' }, errors: { unknown: 'Ein Fehler ist aufgetreten.' } },
  projectStructure: { requiredDirectories: [], requiredFiles: [], selftestRules: { always: [], optional: [], needsUserAction: [] }, writeTestRules: { enabledByDefault: false } }
};

const readJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`LOAD_FAILED_${path}`);
  }
  return response.json();
};

const asObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const validate = (kind, value) => {
  if (!asObject(value)) return false;
  if (kind === 'appConfig') return typeof value.appName === 'string' && asObject(value.startBehavior);
  if (kind === 'themes') return Object.keys(value).length > 0;
  if (kind === 'uiTexts') return asObject(value.messages) && asObject(value.errors);
  if (kind === 'projectStructure') return Array.isArray(value.requiredDirectories) && Array.isArray(value.requiredFiles);
  return true;
};

const safeLoad = async (kind, path) => {
  try {
    const data = await readJson(path);
    if (!validate(kind, data)) {
      throw new Error(`INVALID_${kind}`);
    }
    return { ok: true, data, fallbackUsed: false };
  } catch (error) {
    logEvent('WARN', 'CONFIG_FALLBACK', `Fallback für ${kind} aktiv.`, { error: String(error) });
    return { ok: false, data: FALLBACKS[kind], fallbackUsed: true };
  }
};

export const loadAllConfig = async () => {
  const appConfig = await safeLoad('appConfig', './data/app-config.json');
  const themes = await safeLoad('themes', './data/themes.json');
  const uiTexts = await safeLoad('uiTexts', './data/ui_texts.json');
  const projectStructure = await safeLoad('projectStructure', './data/project-structure.json');

  const ok = !appConfig.fallbackUsed && !themes.fallbackUsed && !uiTexts.fallbackUsed && !projectStructure.fallbackUsed;
  return {
    ok,
    code: ok ? 'CONFIG_OK' : 'CONFIG_WITH_FALLBACKS',
    message: ok ? 'Konfiguration geladen.' : 'Konfiguration mit Fallbacks geladen.',
    data: {
      appConfig: appConfig.data,
      themes: themes.data,
      uiTexts: uiTexts.data,
      projectStructure: projectStructure.data
    }
  };
};
