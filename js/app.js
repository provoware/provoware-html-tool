import { setState, subscribeState } from './state.js';
import { loadAllConfig } from './services/config-loader.js';
import { logEvent } from './services/logger.js';
import { filesystemAdapter } from './adapters/filesystem-adapter.js';
import { runStartupCheck } from './services/startup-check.js';
import { applyTheme, bindUiActions, detectLayoutMode, render } from './ui.js';

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

const selectDirectory = async () => {
  const selected = await filesystemAdapter.selectProjectDirectory();
  logEvent(selected.ok ? 'INFO' : 'WARN', selected.code, selected.message, selected.data);
  if (!selected.ok) return;

  setState({ selectedProjectDirectory: selected.data });
  const permissions = await filesystemAdapter.checkPermissions();
  if (permissions.ok) {
    setState({ permissionStatus: permissions.data });
  }
  await runSelftest(false);

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
  logEvent(loaded.ok ? 'INFO' : 'WARN', loaded.code, loaded.message);

  const themeName = loaded.data.appConfig.defaultTheme;
  applyTheme(loaded.data.themes[themeName] || loaded.data.themes.dunkel);

  const initialMode = detectLayoutMode(loaded.data.appConfig);
  setState({ layoutMode: initialMode, debug: { startupReady: false } });

  bindUiActions({
    onSelectDirectory: selectDirectory,
    onRunSelftest: runSelftest,
    onEnsureStructure: ensureStructure,
    onSwitchDirectory: selectDirectory
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
