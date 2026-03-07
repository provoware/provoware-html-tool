import { filesystemAdapter } from '../../adapters/filesystem-adapter.js';
import { formatEditorContentForPath } from '../code-formatter.js';
import { normalizeActionPath } from './workspace-actions.js';

const tryShutdownBackend = async () => {
  const api = globalThis.window?.provowareDesktopApi;
  if (!api || typeof api.shutdownBackend !== 'function') {
    return { ok: true, code: 'BACKEND_CLOSE_SKIPPED', message: 'Kein Desktop-Backend aktiv.' };
  }
  return api.shutdownBackend();
};

export const createSessionActions = ({ getState, setState, selectDirectory, runSelftest, ensureStructure, buildDiagnosisExport, copyToClipboardSafe, logEvent }) => ({
  onSelectDirectory: selectDirectory,
  onRunSelftest: runSelftest,
  onEnsureStructure: ensureStructure,
  onSwitchDirectory: selectDirectory,
  onExportDiagnosis: async () => {
    const text = JSON.stringify(buildDiagnosisExport(), null, 2);
    await copyToClipboardSafe(text);
    logEvent('INFO', 'DIAGNOSIS_EXPORTED', 'Diagnose wurde als JSON bereitgestellt.');
    return text;
  },
  onToggleA11yQuietMode: (enabled) => {
    setState({ a11yQuietMode: Boolean(enabled) });
    logEvent('INFO', 'A11Y_QUIET_MODE_CHANGED', enabled ? 'Ruhiger Modus wurde aktiviert.' : 'Ruhiger Modus wurde deaktiviert.');
  },
  onSelectPlugin: (pluginId) => {
    const state = getState();
    const manager = state.pluginManager || { selectedPluginId: 'char-counter', plugins: {} };
    setState({ pluginManager: { ...manager, selectedPluginId: pluginId || 'char-counter' } });
  },
  onTogglePluginEnabled: () => {
    const state = getState();
    const manager = state.pluginManager || { selectedPluginId: 'char-counter', plugins: {} };
    const pluginId = manager.selectedPluginId || 'char-counter';
    const entry = manager.plugins?.[pluginId] || { enabled: true };
    setState({
      pluginManager: {
        ...manager,
        plugins: {
          ...(manager.plugins || {}),
          [pluginId]: { enabled: !entry.enabled }
        }
      }
    });
  },
  onLogoutWithAutosave: async () => {
    const state = getState();
    let autosave = { ok: true, code: 'AUTOSAVE_SKIPPED', message: 'Nichts zu speichern.' };
    if (state.editorFilePath && state.editorDirty) {
      const formatted = formatEditorContentForPath({ path: state.editorFilePath, content: state.editorContent || '' });
      if (!formatted.ok) {
        logEvent('WARN', formatted.code, formatted.message, formatted.data);
        return formatted;
      }
      setState({ editorContent: formatted.data?.content || state.editorContent || '' });
      autosave = await filesystemAdapter.writeText(normalizeActionPath(state.editorFilePath), formatted.data?.content || '');
      if (!autosave.ok) {
        logEvent('WARN', autosave.code, 'Autospeichern vor Logout fehlgeschlagen.', autosave.data);
        return autosave;
      }
      logEvent('INFO', 'EDITOR_AUTOSAVED_ON_LOGOUT', 'Editor wurde vor dem Logout gespeichert.', { path: state.editorFilePath });
    }

    const backendClose = await tryShutdownBackend();
    if (!backendClose.ok) {
      logEvent('WARN', backendClose.code, 'Backend konnte nicht sicher geschlossen werden.', backendClose.data);
      return backendClose;
    }

    setState({
      selectedProjectDirectory: null,
      permissionStatus: { read: false, write: false, class: 'unknown' },
      selftestResult: null,
      debug: { startupReady: false },
      editorFilePath: '',
      editorContent: '',
      editorDirty: false,
      editorStatus: 'Session wurde sicher beendet.'
    });
    const result = { ok: true, code: 'LOGOUT_DONE', message: 'Logout abgeschlossen. Daten sind gesichert.', data: { autosave: autosave.code, backend: backendClose.code } };
    logEvent('INFO', result.code, result.message, result.data);
    return result;
  }
});
