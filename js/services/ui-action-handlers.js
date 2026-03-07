import { createDefaultArchive, createRandomMix, normalizeArchive, addEntry, editEntry, removeEntry, sortArchive, buildStats } from './profile-archive.js';
import { addTemplate, editTemplate, removeTemplate, toggleTemplateFavorite } from './templates-archive.js';
import { filesystemAdapter } from '../adapters/filesystem-adapter.js';

const DEFAULT_PROFILE = 'HardTechno';
const TEXT_FILE_EXTENSIONS = new Set(['txt', 'md', 'json', 'js', 'css', 'html', 'csv', 'xml', 'yml', 'yaml', 'log']);

const DASHBOARD_NOTES_BASE_PATH = 'data/dashboard3-notes';
const DASHBOARD_NOTE_DEFAULTS = ['pppoppi details ideen', 'Favoriten Genres', 'Templates-Input-Pool'];
const DASHBOARD_NOTE_FILE_EXTENSION = '.txt';

const withDefaultDashboardRows = (rows = []) => DASHBOARD_NOTE_DEFAULTS.map((title, index) => ({
  title: rows[index]?.title || title,
  input: rows[index]?.input || '',
  feedback: rows[index]?.feedback || '-',
  lastSavedPath: rows[index]?.lastSavedPath || ''
}));

const sanitizeFileName = (title = '') => String(title || '').trim().replace(/[\/:*?"<>|]/g, '_');

const updateDashboardRowState = (setState, getState, rowIndex, patch = {}) => {
  const rows = withDefaultDashboardRows(getState().dashboardNotes?.rows || []);
  if (!rows[rowIndex]) return;
  rows[rowIndex] = { ...rows[rowIndex], ...patch };
  setState({ dashboardNotes: { basePath: DASHBOARD_NOTES_BASE_PATH, rows } });
};

const normalizeRelativePath = (path = '') => String(path || '').replaceAll('\\', '/').replace(/^\/+|\/+$/g, '');

const joinPath = (basePath, fileName) => {
  const base = normalizeRelativePath(basePath);
  return base ? `${base}/${fileName}` : fileName;
};

const isTextLikeFile = (name = '') => {
  const extension = String(name).split('.').pop()?.toLowerCase();
  return extension ? TEXT_FILE_EXTENSIONS.has(extension) : false;
};

export const createUiActionHandlers = ({
  getState,
  setState,
  selectDirectory,
  runSelftest,
  ensureStructure,
  buildDiagnosisExport,
  copyToClipboardSafe,
  updateArchive,
  updateTemplateArchive,
  logEvent
}) => ({
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
  onSelectProfile: (profile) => {
    const state = getState();
    const archive = state.profileArchive || createDefaultArchive();
    setState({ selectedProfile: profile, profileStats: buildStats(archive, profile) });
  },
  onSaveCategoryEntry: ({ category, value }) => {
    const state = getState();
    return updateArchive((archive) => addEntry({ archive, profile: state.selectedProfile, category, value }));
  },
  onEditCategoryEntry: ({ category, oldValue, newValue }) => {
    const state = getState();
    return updateArchive((archive) => editEntry({ archive, profile: state.selectedProfile, category, oldValue, newValue }));
  },
  onDeleteCategoryEntry: ({ category, value }) => {
    const state = getState();
    return updateArchive((archive) => removeEntry({ archive, profile: state.selectedProfile, category, value }));
  },
  onSortArchive: (mode) => {
    setState({ archiveSortMode: mode });
    return updateArchive((archive) => sortArchive({ archive, mode }));
  },
  onExportArchive: async () => {
    const state = getState();
    const archive = normalizeArchive(state.profileArchive || createDefaultArchive());
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
    const state = getState();
    const result = await updateArchive((archive) => createRandomMix({
      archive,
      profile: state.selectedProfile || DEFAULT_PROFILE,
      includeCategories,
      amountPerCategory
    }));
    if (result.ok && result.data?.text) {
      await copyToClipboardSafe(result.data.text);
    }
    return result;
  },
  onTemplateSave: async ({ id, title, content, category }) => {
    const result = await updateTemplateArchive((archive) => (
      id
        ? editTemplate({ archive, id, title, content, category })
        : addTemplate({ archive, title, content, category })
    ));
    if (result.ok) {
      setState({ templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' } });
    }
    return result;
  },
  onTemplateStartEdit: (id) => {
    const item = (getState().templateArchive?.items || []).find((entry) => entry.id === id);
    if (!item) return;
    setState({ templateDraft: { id: item.id, title: item.title, content: item.content, category: item.category } });
  },
  onTemplateDelete: (id) => updateTemplateArchive((archive) => removeTemplate({ archive, id })),
  onTemplateToggleFavorite: (id) => updateTemplateArchive((archive) => toggleTemplateFavorite({ archive, id })),
  onTemplateCopy: async (id) => {
    const item = (getState().templateArchive?.items || []).find((entry) => entry.id === id);
    if (!item) {
      return { ok: false, code: 'TEMPLATE_MISSING', message: 'Vorlage wurde nicht gefunden.' };
    }
    await copyToClipboardSafe(item.content);
    setState({ templateFeedback: { message: `„${item.title}“ wurde kopiert.`, type: 'success', until: Date.now() + 3000 } });
    setTimeout(() => {
      const state = getState();
      if (state.templateFeedback?.until && state.templateFeedback.until <= Date.now()) {
        setState({ templateFeedback: null });
      }
    }, 3200);
    return { ok: true, code: 'TEMPLATE_COPIED', message: 'Vorlage wurde in die Zwischenablage kopiert.' };
  },
  onTemplateResetDraft: () => {
    setState({ templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' } });
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
  onSetFilePreviewPath: (path) => {
    setState({ filePreviewPath: normalizeRelativePath(path) });
  },
  onToggleFilePreviewIncludeOther: (enabled) => {
    setState({ filePreviewIncludeOtherFiles: Boolean(enabled) });
  },
  onLoadFilePreviewList: async () => {
    const state = getState();
    const path = normalizeRelativePath(state.filePreviewPath);
    const listed = await filesystemAdapter.listDirectory(path);
    if (!listed.ok) {
      const status = 'Dateiliste konnte nicht geladen werden.';
      setState({ filePreviewEntries: [], filePreviewStatus: status });
      logEvent('WARN', listed.code, status, listed.data);
      return listed;
    }

    const includeOther = Boolean(state.filePreviewIncludeOtherFiles);
    const files = (listed.data?.entries || [])
      .filter((entry) => entry.kind === 'file')
      .filter((entry) => includeOther || isTextLikeFile(entry.name))
      .map((entry) => ({ ...entry, path: joinPath(path, entry.name) }));

    const status = files.length
      ? `${files.length} Datei(en) gefunden.`
      : 'Keine passenden Dateien gefunden.';
    setState({ filePreviewPath: path, filePreviewEntries: files, filePreviewStatus: status });
    logEvent('INFO', 'FILE_PREVIEW_LIST_LOADED', status, { path, includeOther });
    return { ok: true, code: 'FILE_PREVIEW_LIST_READY', message: status, data: { path, count: files.length } };
  },
  onOpenPreviewFile: async (path) => {
    const normalizedPath = normalizeRelativePath(path);
    if (!normalizedPath) {
      return { ok: false, code: 'FILE_PREVIEW_MISSING_PATH', message: 'Dateipfad fehlt.' };
    }
    const loaded = await filesystemAdapter.readText(normalizedPath);
    if (!loaded.ok) {
      const status = 'Datei konnte nicht gelesen werden.';
      setState({ filePreviewSelectedPath: normalizedPath, filePreviewStatus: status, filePreviewContent: '' });
      logEvent('WARN', loaded.code, status, loaded.data);
      return loaded;
    }
    const status = `Datei geladen: ${normalizedPath}`;
    setState({ filePreviewSelectedPath: normalizedPath, filePreviewContent: loaded.data?.text || '', filePreviewStatus: status });
    logEvent('INFO', 'FILE_PREVIEW_OPENED', status);
    return { ok: true, code: 'FILE_PREVIEW_OPENED', message: status };
  },
  onOpenPreviewInEditor: () => {
    const state = getState();
    const filePath = normalizeRelativePath(state.filePreviewSelectedPath);
    if (!filePath) {
      return { ok: false, code: 'EDITOR_OPEN_FAILED', message: 'Keine Vorschau-Datei aktiv.' };
    }
    setState({
      editorFilePath: filePath,
      editorContent: state.filePreviewContent || '',
      editorStatus: `Editor geöffnet: ${filePath}`,
      editorDirty: false
    });
    logEvent('INFO', 'EDITOR_OPENED_FROM_PREVIEW', 'Vorschau wurde im Editor geöffnet.', { path: filePath });
    return { ok: true, code: 'EDITOR_OPENED', message: 'Vorschau wurde im Editor geöffnet.' };
  },
  onEditorChangeContent: (content) => {
    setState({ editorContent: content, editorDirty: true });
  },
  onDashboardNoteChangeTitle: ({ rowIndex, title }) => {
    updateDashboardRowState(setState, getState, rowIndex, { title });
  },
  onDashboardNoteChangeInput: ({ rowIndex, value }) => {
    updateDashboardRowState(setState, getState, rowIndex, { input: value });
  },
  onDashboardNoteSave: async ({ rowIndex, title, value }) => {
    const normalizedTitle = String(title || '').trim();
    const normalizedValue = String(value || '').trim();
    if (!normalizedTitle) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_TITLE_MISSING', message: 'Titel fehlt.' };
      updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
      logEvent('WARN', result.code, result.message, { rowIndex });
      return result;
    }
    if (!normalizedValue) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_VALUE_MISSING', message: 'Eintrag fehlt.' };
      updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
      logEvent('WARN', result.code, result.message, { rowIndex, title: normalizedTitle });
      return result;
    }

    const safeFileName = sanitizeFileName(normalizedTitle);
    if (!safeFileName) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_FILENAME_INVALID', message: 'Titel ist als Dateiname ungültig.' };
      updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
      logEvent('WARN', result.code, result.message, { rowIndex, title: normalizedTitle });
      return result;
    }

    const filePath = `${DASHBOARD_NOTES_BASE_PATH}/${safeFileName}${DASHBOARD_NOTE_FILE_EXTENSION}`;
    const exists = await filesystemAdapter.fileExists(filePath);
    if (!exists.ok) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_EXISTS_CHECK_FAILED', message: 'Dateiprüfung fehlgeschlagen.', data: exists.data };
      updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
      logEvent('WARN', result.code, result.message, { rowIndex, title: normalizedTitle, filePath });
      return result;
    }

    let previous = '';
    if (exists.data?.exists) {
      const loaded = await filesystemAdapter.readText(filePath);
      if (!loaded.ok) {
        const result = { ok: false, code: 'DASHBOARD_NOTE_READ_FAILED', message: 'Datei konnte nicht gelesen werden.', data: loaded.data };
        updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
        logEvent('WARN', result.code, result.message, { rowIndex, filePath });
        return result;
      }
      previous = loaded.data?.text || '';
    }

    const nextText = previous ? `${previous}
${normalizedValue}` : normalizedValue;
    const saved = await filesystemAdapter.writeText(filePath, nextText);
    if (!saved.ok) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_SAVE_FAILED', message: 'Eintrag konnte nicht gespeichert werden.', data: saved.data };
      updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
      logEvent('WARN', result.code, result.message, { rowIndex, filePath });
      return result;
    }

    const message = exists.data?.exists
      ? `Eintrag angehängt: ${safeFileName}${DASHBOARD_NOTE_FILE_EXTENSION}`
      : `Neue Datei erstellt: ${safeFileName}${DASHBOARD_NOTE_FILE_EXTENSION}`;
    updateDashboardRowState(setState, getState, rowIndex, {
      title: normalizedTitle,
      input: '',
      feedback: message,
      lastSavedPath: filePath
    });
    logEvent('INFO', exists.data?.exists ? 'DASHBOARD_NOTE_APPENDED' : 'DASHBOARD_NOTE_CREATED', message, { rowIndex, filePath });
    return { ok: true, code: exists.data?.exists ? 'DASHBOARD_NOTE_APPENDED' : 'DASHBOARD_NOTE_CREATED', message, data: { filePath } };
  },
  onOpenDashboardNoteLastFileInEditor: async (rowIndex) => {
    const row = withDefaultDashboardRows(getState().dashboardNotes?.rows || [])[rowIndex];
    const filePath = normalizeRelativePath(row?.lastSavedPath);
    if (!filePath) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_EDITOR_OPEN_FAILED', message: 'Noch keine Datei gespeichert.' };
      updateDashboardRowState(setState, getState, rowIndex, { feedback: result.message });
      return result;
    }

    const loaded = await filesystemAdapter.readText(filePath);
    if (!loaded.ok) {
      const result = { ok: false, code: 'DASHBOARD_NOTE_EDITOR_READ_FAILED', message: 'Datei konnte nicht geladen werden.', data: loaded.data };
      logEvent('WARN', result.code, result.message, { rowIndex, filePath });
      return result;
    }

    const content = loaded.data?.text || '';
    setState({
      filePreviewSelectedPath: filePath,
      filePreviewContent: content,
      filePreviewStatus: `Datei geladen: ${filePath}`,
      editorFilePath: filePath,
      editorContent: content,
      editorStatus: `Editor geöffnet: ${filePath}`,
      editorDirty: false
    });
    logEvent('INFO', 'DASHBOARD_NOTE_EDITOR_OPENED', 'Datei wurde im Editor geöffnet.', { rowIndex, filePath });
    return { ok: true, code: 'DASHBOARD_NOTE_EDITOR_OPENED', message: 'Datei wurde im Editor geöffnet.', data: { filePath } };
  },
  onSaveEditorFile: async () => {
    const state = getState();
    const filePath = normalizeRelativePath(state.editorFilePath);
    if (!filePath) {
      return { ok: false, code: 'EDITOR_SAVE_NO_FILE', message: 'Keine Editor-Datei aktiv.' };
    }
    const saved = await filesystemAdapter.writeText(filePath, state.editorContent || '');
    if (!saved.ok) {
      setState({ editorStatus: 'Speichern fehlgeschlagen.' });
      logEvent('WARN', saved.code, 'Editor-Datei konnte nicht gespeichert werden.', saved.data);
      return saved;
    }
    const status = `Gespeichert: ${filePath}`;
    setState({ editorStatus: status, editorDirty: false, filePreviewContent: state.editorContent || '' });
    logEvent('INFO', 'EDITOR_FILE_SAVED', status);
    return { ok: true, code: 'EDITOR_FILE_SAVED', message: status };
  }
});
