import { filesystemAdapter } from '../../adapters/filesystem-adapter.js';
import { formatEditorContentForPath } from '../code-formatter.js';

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
const normalizeRelativePath = (path = '') => String(path || '').replaceAll('\\', '/').replace(/^\/+|\/+$/g, '');
const joinPath = (basePath, fileName) => {
  const base = normalizeRelativePath(basePath);
  return base ? `${base}/${fileName}` : fileName;
};
const isTextLikeFile = (name = '') => {
  const extension = String(name).split('.').pop()?.toLowerCase();
  return extension ? TEXT_FILE_EXTENSIONS.has(extension) : false;
};

const updateDashboardRowState = (setState, getState, rowIndex, patch = {}) => {
  const rows = withDefaultDashboardRows(getState().dashboardNotes?.rows || []);
  if (!rows[rowIndex]) return;
  rows[rowIndex] = { ...rows[rowIndex], ...patch };
  setState({ dashboardNotes: { basePath: DASHBOARD_NOTES_BASE_PATH, rows } });
};

const createDashboardNoteFailure = ({ setState, getState, logEvent, rowIndex, code, message, data, logData = {} }) => {
  const result = { ok: false, code, message, data };
  updateDashboardRowState(setState, getState, rowIndex, { feedback: message });
  logEvent('WARN', code, message, logData);
  return result;
};

export const createWorkspaceActions = ({ getState, setState, logEvent }) => ({
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
  onOpenModuleRegistryNextStepFile: async (path) => {
    const filePath = normalizeRelativePath(path);
    if (!filePath) {
      const message = 'Kein Dateipfad im Modul-Hinweis gefunden.';
      setState({ editorStatus: message });
      return { ok: false, code: 'MODULE_NEXT_STEP_FILE_MISSING', message };
    }
    const exists = await filesystemAdapter.fileExists(filePath);
    if (!exists.ok || !exists.data?.exists) {
      const message = `Datei konnte nicht geöffnet werden: ${filePath}`;
      setState({ editorStatus: message });
      logEvent('WARN', exists.code || 'MODULE_NEXT_STEP_FILE_MISSING', message, exists.data);
      return exists.ok ? { ok: false, code: 'MODULE_NEXT_STEP_FILE_MISSING', message, data: { path: filePath } } : exists;
    }
    const loaded = await filesystemAdapter.readText(filePath);
    if (!loaded.ok) {
      setState({ editorStatus: `Datei konnte nicht gelesen werden: ${filePath}` });
      logEvent('WARN', loaded.code, 'Datei aus Modul-Hinweis konnte nicht gelesen werden.', loaded.data);
      return loaded;
    }
    setState({
      editorFilePath: filePath,
      editorContent: loaded.data?.text || '',
      editorStatus: `Editor geöffnet: ${filePath}`,
      editorDirty: false
    });
    logEvent('INFO', 'MODULE_NEXT_STEP_FILE_OPENED', 'Datei aus Modul-Hinweis im Editor geöffnet.', { path: filePath });
    return { ok: true, code: 'MODULE_NEXT_STEP_FILE_OPENED', message: `Datei geöffnet: ${filePath}`, data: { path: filePath } };
  },
  onEditorChangeContent: (content) => {
    setState({ editorContent: content, editorDirty: true });
  },
  onFormatEditorFile: async () => {
    const state = getState();
    const filePath = normalizeRelativePath(state.editorFilePath);
    const result = formatEditorContentForPath({ path: filePath, content: state.editorContent || '' });
    if (!result.ok) {
      setState({ editorStatus: result.message });
      logEvent('WARN', result.code, result.message, result.data);
      return result;
    }
    setState({
      editorContent: result.data?.content || '',
      editorDirty: result.data?.changed ? true : state.editorDirty,
      editorStatus: result.message
    });
    logEvent('INFO', result.code, result.message, result.data);
    return result;
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
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_TITLE_MISSING',
        message: 'Titel fehlt.',
        logData: { rowIndex }
      });
    }
    if (!normalizedValue) {
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_VALUE_MISSING',
        message: 'Eintrag fehlt.',
        logData: { rowIndex, title: normalizedTitle }
      });
    }

    const safeFileName = sanitizeFileName(normalizedTitle);
    if (!safeFileName) {
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_FILENAME_INVALID',
        message: 'Titel ist als Dateiname ungültig.',
        logData: { rowIndex, title: normalizedTitle }
      });
    }

    const filePath = `${DASHBOARD_NOTES_BASE_PATH}/${safeFileName}${DASHBOARD_NOTE_FILE_EXTENSION}`;
    const exists = await filesystemAdapter.fileExists(filePath);
    if (!exists.ok) {
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_EXISTS_CHECK_FAILED',
        message: 'Dateiprüfung fehlgeschlagen.',
        data: exists.data,
        logData: { rowIndex, title: normalizedTitle, filePath }
      });
    }

    let previous = '';
    if (exists.data?.exists) {
      const loaded = await filesystemAdapter.readText(filePath);
      if (!loaded.ok) {
        return createDashboardNoteFailure({
          setState,
          getState,
          logEvent,
          rowIndex,
          code: 'DASHBOARD_NOTE_READ_FAILED',
          message: 'Datei konnte nicht gelesen werden.',
          data: loaded.data,
          logData: { rowIndex, filePath }
        });
      }
      previous = loaded.data?.text || '';
    }

    const nextText = previous ? `${previous}\n${normalizedValue}` : normalizedValue;
    const saved = await filesystemAdapter.writeText(filePath, nextText);
    if (!saved.ok) {
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_SAVE_FAILED',
        message: 'Eintrag konnte nicht gespeichert werden.',
        data: saved.data,
        logData: { rowIndex, filePath }
      });
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
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_EDITOR_OPEN_FAILED',
        message: 'Noch keine Datei gespeichert.'
      });
    }

    const loaded = await filesystemAdapter.readText(filePath);
    if (!loaded.ok) {
      return createDashboardNoteFailure({
        setState,
        getState,
        logEvent,
        rowIndex,
        code: 'DASHBOARD_NOTE_EDITOR_READ_FAILED',
        message: 'Datei konnte nicht geladen werden.',
        data: loaded.data,
        logData: { rowIndex, filePath }
      });
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

export const normalizeActionPath = normalizeRelativePath;
