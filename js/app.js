import { setState, subscribeState } from './state.js';
import { loadAllConfig } from './services/config-loader.js';
import { logEvent } from './services/logger.js';
import { filesystemAdapter } from './adapters/filesystem-adapter.js';
import { runStartupCheck } from './services/startup-check.js';
import { detectTemplateDesignStatus, loadModuleRegistry } from './services/module-registry.js';
import { createUiActionHandlers } from './services/ui-action-handlers.js';
import { buildDiagnosisExport } from './services/diagnosis-export.js';
import { applyTheme, bindUiActions, detectLayoutMode, render } from './ui.js';
import {
  ARCHIVE_PATH,
  addArchiveEvent,
  buildStats,
  createDefaultArchive,
  normalizeArchive
} from './services/profile-archive.js';
import {
  TEMPLATE_ARCHIVE_PATH,
  createDefaultTemplateArchive,
  normalizeTemplateArchive
} from './services/templates-archive.js';

const LAST_DIRECTORY_NAME_KEY = 'provoware:last-directory-name';
const WRITE_PERMISSION_CHOICE_KEY = 'provoware:write-permission-choice';
const GRID_HELP_VISIBILITY_KEY = 'provoware:grid-help-visibility';
const DEFAULT_PROFILE = 'HardTechno';

const readRememberedDirectoryName = () => {
  try {
    return window.localStorage.getItem(LAST_DIRECTORY_NAME_KEY);
  } catch {
    return null;
  }
};

const storeRememberedDirectoryName = (name) => {
  try {
    window.localStorage.setItem(LAST_DIRECTORY_NAME_KEY, name);
  } catch {
    // Speicher kann je nach Browser-Einstellung blockiert sein.
  }
};


const readWritePermissionChoice = () => {
  try {
    const raw = window.localStorage.getItem(WRITE_PERMISSION_CHOICE_KEY);
    if (raw === 'allow') return true;
    if (raw === 'deny') return false;
    return null;
  } catch {
    return null;
  }
};

const storeWritePermissionChoice = (allowWrite) => {
  try {
    window.localStorage.setItem(WRITE_PERMISSION_CHOICE_KEY, allowWrite ? 'allow' : 'deny');
  } catch {
    // Speicher kann je nach Browser-Einstellung blockiert sein.
  }
};

const resolveWritePermissionChoiceAtStartup = () => {
  const remembered = readWritePermissionChoice();
  if (remembered !== null) {
    return remembered;
  }

  const allowWrite = window.confirm('Soll die App beim Ordnerstart auch Schreibrechte anfragen? Empfehlung: Ja, wenn Struktur ergänzt oder Daten gespeichert werden sollen.');
  storeWritePermissionChoice(allowWrite);
  return allowWrite;
};


const readGridHelpVisibilityChoice = () => {
  try {
    const raw = window.localStorage.getItem(GRID_HELP_VISIBILITY_KEY);
    if (raw === 'show') return true;
    if (raw === 'hide') return false;
    return null;
  } catch {
    return null;
  }
};

const storeGridHelpVisibilityChoice = (showGridHelp) => {
  try {
    window.localStorage.setItem(GRID_HELP_VISIBILITY_KEY, showGridHelp ? 'show' : 'hide');
  } catch {
    // Speicher kann je nach Browser-Einstellung blockiert sein.
  }
};

const applyLoadedData = (bundle) => {
  setState({
    config: bundle.appConfig,
    themes: bundle.themes,
    uiTexts: bundle.uiTexts,
    projectStructure: bundle.projectStructure
  });
};


const runSelftest = async (withWriteTest = false) => {
  const state = window.appState;
  const result = await filesystemAdapter.runProjectSelftest({ projectStructure: state.projectStructure, runWriteTest: withWriteTest });
  if (result.ok || result.code === 'SELFTEST_DONE') {
    setState({ selftestResult: result.data });
  }
  logEvent(result.ok ? 'INFO' : 'WARN', result.code, result.message, result.data);
};

const saveArchiveToDisk = async (archive) => {
  const write = await filesystemAdapter.writeJson(ARCHIVE_PATH, archive);
  if (!write.ok) {
    logEvent('WARN', write.code, 'Archiv konnte nicht gespeichert werden.', write.data);
  }
  return write.ok;
};

const saveTemplateArchiveToDisk = async (archive) => {
  const write = await filesystemAdapter.writeJson(TEMPLATE_ARCHIVE_PATH, archive);
  if (!write.ok) {
    logEvent('WARN', write.code, 'Vorlagen-Archiv konnte nicht gespeichert werden.', write.data);
  }
  return write.ok;
};

const loadProfileArchive = async () => {
  const exists = await filesystemAdapter.fileExists(ARCHIVE_PATH);
  if (!exists.ok) {
    logEvent('WARN', exists.code, 'Archivstatus konnte nicht gelesen werden.', exists.data);
    return;
  }

  let archive = createDefaultArchive();
  if (exists.data.exists) {
    const loaded = await filesystemAdapter.readJson(ARCHIVE_PATH);
    if (loaded.ok) {
      archive = normalizeArchive(loaded.data);
      logEvent('INFO', loaded.code, 'Archiv wurde geladen.');
    } else {
      logEvent('WARN', loaded.code, 'Archiv konnte nicht gelesen werden. Standardarchiv wird genutzt.', loaded.data);
    }
  } else {
    await saveArchiveToDisk(archive);
    logEvent('INFO', 'ARCHIVE_CREATED', 'Archivdatei wurde angelegt.');
  }

  const selectedProfile = window.appState.selectedProfile || DEFAULT_PROFILE;
  setState({
    profileArchive: archive,
    selectedProfile,
    randomMix: archive.lastMix,
    profileStats: buildStats(archive, selectedProfile)
  });
};

const updateArchive = async (mutate, fallbackMessage = 'Archivaktion') => {
  const state = window.appState;
  const archive = normalizeArchive(state.profileArchive || createDefaultArchive());
  const result = mutate(archive);

  addArchiveEvent(archive, result.ok ? 'INFO' : 'WARN', result.message, { code: result.code });
  const selectedProfile = state.selectedProfile || DEFAULT_PROFILE;
  setState({
    profileArchive: archive,
    selectedProfile,
    randomMix: archive.lastMix,
    profileStats: buildStats(archive, selectedProfile)
  });

  logEvent(result.ok ? 'INFO' : 'WARN', result.code, result.message, result.data || null);
  if (result.ok) {
    await saveArchiveToDisk(archive);
  } else if (fallbackMessage) {
    logEvent('WARN', 'ARCHIVE_ACTION_SKIPPED', fallbackMessage);
  }

  return result;
};

const loadTemplateArchive = async () => {
  const exists = await filesystemAdapter.fileExists(TEMPLATE_ARCHIVE_PATH);
  if (!exists.ok) {
    logEvent('WARN', exists.code, 'Vorlagen-Archivstatus konnte nicht gelesen werden.', exists.data);
    return;
  }

  let archive = createDefaultTemplateArchive();
  let templateArchiveStatus = '';
  if (exists.data.exists) {
    const loaded = await filesystemAdapter.readJson(TEMPLATE_ARCHIVE_PATH);
    if (loaded.ok) {
      const normalized = normalizeTemplateArchive(loaded.data, { withReport: true });
      archive = normalized.archive;
      if (normalized.repair?.applied) {
        templateArchiveStatus = 'Archiv repariert: Pflichtfelder wurden ergänzt.';
        logEvent('INFO', 'TEMPLATE_ARCHIVE_REPAIRED', templateArchiveStatus, { reason: normalized.repair.reason });
        await saveTemplateArchiveToDisk(archive);
      }
    }
  } else {
    await saveTemplateArchiveToDisk(archive);
  }

  setState({
    templateArchive: archive,
    templateArchiveStatus,
    templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' }
  });
};

const updateTemplateArchive = async (mutate, fallbackMessage = 'Vorlagenaktion') => {
  const state = window.appState;
  const archive = normalizeTemplateArchive(state.templateArchive || createDefaultTemplateArchive());
  const result = mutate(archive);
  setState({ templateArchive: archive });
  logEvent(result.ok ? 'INFO' : 'WARN', result.code, result.message, result.data || null);
  if (result.ok) {
    await saveTemplateArchiveToDisk(archive);
  } else {
    logEvent('WARN', 'TEMPLATE_ACTION_SKIPPED', fallbackMessage);
  }
  return result;
};

const copyToClipboardSafe = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    logEvent('INFO', 'MIX_COPIED', 'Zufallsmix wurde in die Zwischenablage kopiert.');
  } catch (error) {
    logEvent('WARN', 'MIX_COPY_FAILED', 'Zwischenablage konnte nicht beschrieben werden.', { error: String(error) });
  }
};

const selectDirectory = async (allowWritePermission) => {
  const selected = await filesystemAdapter.selectProjectDirectory();
  logEvent(selected.ok ? 'INFO' : 'WARN', selected.code, selected.message, selected.data);
  if (!selected.ok) return;

  setState({ selectedProjectDirectory: selected.data, rememberedProjectDirectoryName: selected.data?.name || null });
  if (selected.data?.name) storeRememberedDirectoryName(selected.data.name);

  const permissions = await filesystemAdapter.checkPermissions({ requestWrite: allowWritePermission === true });
  if (permissions.ok) {
    setState({ permissionStatus: permissions.data });
  }
  await runSelftest(false);
  await loadProfileArchive();

  await runStartupReadinessCheck(window.appState.projectStructure, allowWritePermission);
};

const ensureStructure = async () => {
  const result = await filesystemAdapter.ensureProjectStructure(window.appState.projectStructure);
  logEvent(result.ok ? 'INFO' : 'WARN', result.code, result.message, result.data);
  await runSelftest(false);
};


const runStartupReadinessCheck = async (projectStructure, allowWritePermission) => {
  const start = await runStartupCheck(projectStructure, { requestWrite: allowWritePermission === true });
  setState({ debug: { startupReady: start.ok } });
  logEvent(start.ok ? 'INFO' : 'WARN', start.code, start.message, start.data);
};

const onResize = () => {
  const mode = detectLayoutMode(window.appState.config || {});
  setState({ layoutMode: mode });
};

const init = async () => {
  subscribeState((next) => {
    window.appState = next;
    render();
  });

  const allowWritePermission = filesystemAdapter.mode === 'browser'
    ? resolveWritePermissionChoiceAtStartup()
    : false;

  const loaded = await loadAllConfig();
  applyLoadedData(loaded.data);
  const rememberedGridHelpVisibility = readGridHelpVisibilityChoice();

  setState({
    rememberedProjectDirectoryName: readRememberedDirectoryName(),
    writePermissionChoice: allowWritePermission,
    showGridHelp: rememberedGridHelpVisibility !== null ? rememberedGridHelpVisibility : true,
    selectedProfile: DEFAULT_PROFILE,
    profileArchive: createDefaultArchive(),
    profileStats: buildStats(createDefaultArchive(), DEFAULT_PROFILE),
    templateArchive: createDefaultTemplateArchive()
  });
  logEvent(loaded.ok ? 'INFO' : 'WARN', loaded.code, loaded.message);

  const themeName = loaded.data.appConfig.defaultTheme;
  const initialTheme = loaded.data.themes[themeName] ? themeName : 'design-nachtblau';
  applyTheme(loaded.data.themes[initialTheme] || loaded.data.themes['design-nachtblau']);

  const initialMode = detectLayoutMode(loaded.data.appConfig);
  const moduleRegistry = await loadModuleRegistry();
  const templateDesignStatus = detectTemplateDesignStatus();
  setState({ layoutMode: initialMode, currentTheme: initialTheme, moduleRegistry, templateDesignStatus, debug: { startupReady: false } });

  const actions = createUiActionHandlers({
    getState: () => window.appState,
    setState,
    selectDirectory: () => selectDirectory(allowWritePermission),
    runSelftest,
    ensureStructure,
    buildDiagnosisExport: () => buildDiagnosisExport(window.appState),
    copyToClipboardSafe,
    updateArchive,
    updateTemplateArchive,
    logEvent,
    storeGridHelpPreference: storeGridHelpVisibilityChoice
  });

  bindUiActions({
    ...actions,
    onChangeTheme: (themeName) => {
      const state = window.appState;
      const nextTheme = state.themes?.[themeName] ? themeName : state.currentTheme || 'design-nachtblau';
      applyTheme(state.themes?.[nextTheme] || state.themes?.['design-nachtblau'] || {});
      setState({ currentTheme: nextTheme });
    }
  });

  await loadTemplateArchive();

  await runStartupReadinessCheck(loaded.data.projectStructure, allowWritePermission);

  window.addEventListener('resize', onResize);
  render();
};

init().catch((error) => {
  logEvent('ERROR', 'APP_INIT_FAILED', 'Die Anwendung konnte nicht starten.', { error: String(error) });
  render();
});
