import { setState, subscribeState } from './state.js';
import { loadAllConfig } from './services/config-loader.js';
import { logEvent } from './services/logger.js';
import { filesystemAdapter } from './adapters/filesystem-adapter.js';
import { runStartupCheck } from './services/startup-check.js';
import { applyTheme, bindUiActions, detectLayoutMode, render } from './ui.js';
import {
  ARCHIVE_PATH,
  addArchiveEvent,
  addEntry,
  buildStats,
  createDefaultArchive,
  createRandomMix,
  editEntry,
  normalizeArchive,
  removeEntry,
  sortArchive
} from './services/profile-archive.js';

const LAST_DIRECTORY_NAME_KEY = 'provoware:last-directory-name';
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

const applyLoadedData = (bundle) => {
  setState({
    config: bundle.appConfig,
    themes: bundle.themes,
    uiTexts: bundle.uiTexts,
    projectStructure: bundle.projectStructure
  });
};

const refreshLayoutMode = () => {
  const mode = detectLayoutMode(window.appState?.config || {});
  setState({ layoutMode: mode });
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

const copyToClipboardSafe = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    logEvent('INFO', 'MIX_COPIED', 'Zufallsmix wurde in die Zwischenablage kopiert.');
  } catch (error) {
    logEvent('WARN', 'MIX_COPY_FAILED', 'Zwischenablage konnte nicht beschrieben werden.', { error: String(error) });
  }
};

const selectDirectory = async () => {
  const selected = await filesystemAdapter.selectProjectDirectory();
  logEvent(selected.ok ? 'INFO' : 'WARN', selected.code, selected.message, selected.data);
  if (!selected.ok) return;

  setState({ selectedProjectDirectory: selected.data, rememberedProjectDirectoryName: selected.data?.name || null });
  if (selected.data?.name) storeRememberedDirectoryName(selected.data.name);

  const permissions = await filesystemAdapter.checkPermissions();
  if (permissions.ok) {
    setState({ permissionStatus: permissions.data });
  }
  await runSelftest(false);
  await loadProfileArchive();

  const start = await runStartupCheck(window.appState.projectStructure);
  setState({ debug: { startupReady: start.ok } });
  logEvent(start.ok ? 'INFO' : 'WARN', start.code, start.message, start.data);
};

const ensureStructure = async () => {
  const result = await filesystemAdapter.ensureProjectStructure(window.appState.projectStructure);
  logEvent(result.ok ? 'INFO' : 'WARN', result.code, result.message, result.data);
  await runSelftest(false);
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

  const loaded = await loadAllConfig();
  applyLoadedData(loaded.data);
  setState({
    rememberedProjectDirectoryName: readRememberedDirectoryName(),
    selectedProfile: DEFAULT_PROFILE,
    profileArchive: createDefaultArchive(),
    profileStats: buildStats(createDefaultArchive(), DEFAULT_PROFILE)
  });
  logEvent(loaded.ok ? 'INFO' : 'WARN', loaded.code, loaded.message);

  const themeName = loaded.data.appConfig.defaultTheme;
  applyTheme(loaded.data.themes[themeName] || loaded.data.themes.dunkel);

  const initialMode = detectLayoutMode(loaded.data.appConfig);
  setState({ layoutMode: initialMode, debug: { startupReady: false } });

  bindUiActions({
    onSelectDirectory: selectDirectory,
    onRunSelftest: runSelftest,
    onEnsureStructure: ensureStructure,
    onSwitchDirectory: selectDirectory,
    onSelectProfile: (profile) => {
      const archive = window.appState.profileArchive || createDefaultArchive();
      setState({ selectedProfile: profile, profileStats: buildStats(archive, profile) });
    },
    onSaveCategoryEntry: ({ category, value }) => updateArchive((archive) => addEntry({ archive, profile: window.appState.selectedProfile, category, value })),
    onEditCategoryEntry: ({ category, oldValue, newValue }) => updateArchive((archive) => editEntry({ archive, profile: window.appState.selectedProfile, category, oldValue, newValue })),
    onDeleteCategoryEntry: ({ category, value }) => updateArchive((archive) => removeEntry({ archive, profile: window.appState.selectedProfile, category, value })),
    onSortArchive: (mode) => {
      setState({ archiveSortMode: mode });
      return updateArchive((archive) => sortArchive({ archive, mode }));
    },
    onExportArchive: async () => {
      const archive = normalizeArchive(window.appState.profileArchive || createDefaultArchive());
      const text = JSON.stringify(archive, null, 2);
      await copyToClipboardSafe(text);
      logEvent('INFO', 'ARCHIVE_EXPORTED', 'Archiv wurde als JSON bereitgestellt.');
      return text;
    },
    onImportArchive: (text) => {
      try {
        const parsed = normalizeArchive(JSON.parse(text));
        return updateArchive((archive) => {
          Object.assign(archive, parsed);
          return { ok: true, code: 'ARCHIVE_IMPORTED', message: 'Archiv wurde importiert.' };
        });
      } catch (error) {
        const result = { ok: false, code: 'ARCHIVE_IMPORT_FAILED', message: 'Import-JSON ist ungültig.', data: { error: String(error) } };
        logEvent('WARN', result.code, result.message, result.data);
        return result;
      }
    },
    onGenerateMix: async ({ includeCategories, amountPerCategory }) => {
      const result = await updateArchive((archive) => createRandomMix({
        archive,
        profile: window.appState.selectedProfile,
        includeCategories,
        amountPerCategory
      }));
      if (result.ok && result.data?.text) {
        await copyToClipboardSafe(result.data.text);
      }
      return result;
    }
  });

  const start = await runStartupCheck(loaded.data.projectStructure);
  setState({ debug: { startupReady: start.ok } });
  logEvent(start.ok ? 'INFO' : 'WARN', start.code, start.message, start.data);

  window.addEventListener('resize', onResize);
  render();
};

init().catch((error) => {
  logEvent('ERROR', 'APP_INIT_FAILED', 'Die Anwendung konnte nicht starten.', { error: String(error) });
  render();
});
