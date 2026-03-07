import { runProjectSelftest } from '../services/project-selftest.js';

let rootHandle = null;

const response = (ok, code, message, data = null) => ({ ok, code, message, data });

const getFileHandleSafe = async (path, create = false) => {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts.pop();
  let current = rootHandle;
  for (const part of parts) {
    current = await current.getDirectoryHandle(part, { create });
  }
  return current.getFileHandle(fileName, { create });
};

const ensureDirectoryPath = async (path, create = true) => {
  let current = rootHandle;
  for (const part of path.split('/').filter(Boolean)) {
    current = await current.getDirectoryHandle(part, { create });
  }
  return current;
};

const getDirectoryHandleSafe = async (path) => {
  if (!path) return rootHandle;
  return ensureDirectoryPath(path, false);
};

export const browserFilesystemAdapter = {
  selectProjectDirectory: async () => {
    if (!('showDirectoryPicker' in window)) {
      return response(false, 'BROWSER_PICKER_UNAVAILABLE', 'Ordnerwahl wird nicht unterstützt.');
    }
    try {
      rootHandle = await window.showDirectoryPicker();
      return response(true, 'DIRECTORY_SELECTED', 'Projektordner wurde gewählt.', { name: rootHandle.name });
    } catch (error) {
      return response(false, 'DIRECTORY_SELECT_FAILED', 'Ordnerwahl wurde abgebrochen oder ist fehlgeschlagen.', { error: String(error) });
    }
  },

  checkPermissions: async () => {
    if (!rootHandle) {
      return response(false, 'NO_DIRECTORY', 'Kein Projektordner gewählt.');
    }
    try {
      const readState = await rootHandle.queryPermission({ mode: 'read' });
      let writeState = await rootHandle.queryPermission({ mode: 'readwrite' });
      if (readState !== 'granted') {
        await rootHandle.requestPermission({ mode: 'read' });
      }
      if (writeState !== 'granted') {
        writeState = await rootHandle.requestPermission({ mode: 'readwrite' });
      }
      const read = readState === 'granted' || (await rootHandle.queryPermission({ mode: 'read' })) === 'granted';
      const write = writeState === 'granted';
      const klass = read && write ? 'full' : read ? 'read-only' : 'denied';
      return response(true, 'PERMISSION_CHECKED', 'Rechte wurden geprüft.', { read, write, class: klass });
    } catch (error) {
      return response(false, 'PERMISSION_FAILED', 'Rechteprüfung ist fehlgeschlagen.', { error: String(error) });
    }
  },

  getDirectoryInfo: async () => {
    if (!rootHandle) return response(false, 'NO_DIRECTORY', 'Kein Projektordner gewählt.');
    return response(true, 'DIRECTORY_INFO_OK', 'Ordnerinfo verfügbar.', { name: rootHandle.name });
  },

  ensureProjectStructure: async (structure) => {
    if (!rootHandle) return response(false, 'NO_DIRECTORY', 'Kein Projektordner gewählt.');
    try {
      const changed = [];
      for (const dir of structure.requiredDirectories || []) {
        if (dir.createIfMissing) {
          await ensureDirectoryPath(dir.path, true);
          changed.push({ type: 'directory', path: dir.path });
        }
      }
      for (const file of structure.requiredFiles || []) {
        const exists = await browserFilesystemAdapter.fileExists(file.path);
        if (!exists.ok || exists.data.exists) continue;
        if (file.onMissing !== 'create') continue;
        const content = file.type === 'json' ? JSON.stringify(file.defaultContent, null, 2) : String(file.defaultContent || '');
        await browserFilesystemAdapter.createFile(file.path, content);
        changed.push({ type: 'file', path: file.path });
      }
      return response(true, 'STRUCTURE_ENSURED', 'Fehlende Struktur wurde ergänzt.', { changed });
    } catch (error) {
      return response(false, 'STRUCTURE_ENSURE_FAILED', 'Projektstruktur konnte nicht ergänzt werden.', { error: String(error) });
    }
  },

  readJson: async (path) => {
    try {
      const textResult = await browserFilesystemAdapter.readText(path);
      if (!textResult.ok) return textResult;
      return response(true, 'JSON_READ_OK', 'JSON wurde gelesen.', JSON.parse(textResult.data.text));
    } catch (error) {
      return response(false, 'JSON_READ_FAILED', 'JSON konnte nicht gelesen werden.', { error: String(error) });
    }
  },

  writeJson: async (path, data) => browserFilesystemAdapter.writeText(path, JSON.stringify(data, null, 2)),

  fileExists: async (path) => {
    try {
      await getFileHandleSafe(path, false);
      return response(true, 'FILE_EXISTS', 'Datei ist vorhanden.', { exists: true });
    } catch {
      return response(true, 'FILE_MISSING', 'Datei fehlt.', { exists: false });
    }
  },

  createFile: async (path, content) => {
    try {
      const fileHandle = await getFileHandleSafe(path, true);
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return response(true, 'FILE_CREATED', 'Datei wurde erstellt.', { path });
    } catch (error) {
      return response(false, 'FILE_CREATE_FAILED', 'Datei konnte nicht erstellt werden.', { error: String(error) });
    }
  },

  listDirectory: async (path = '') => {
    if (!rootHandle) return response(false, 'NO_DIRECTORY', 'Kein Projektordner gewählt.');
    try {
      const directoryHandle = await getDirectoryHandleSafe(path);
      const entries = [];
      for await (const [name, handle] of directoryHandle.entries()) {
        entries.push({ name, kind: handle.kind });
      }
      entries.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name, 'de');
      });
      return response(true, 'DIRECTORY_LIST_OK', 'Ordnerinhalt wurde gelesen.', { path, entries });
    } catch (error) {
      return response(false, 'DIRECTORY_LIST_FAILED', 'Ordnerinhalt konnte nicht gelesen werden.', { error: String(error), path });
    }
  },

  readText: async (path) => {
    try {
      const fileHandle = await getFileHandleSafe(path, false);
      const file = await fileHandle.getFile();
      return response(true, 'TEXT_READ_OK', 'Text wurde gelesen.', { text: await file.text() });
    } catch (error) {
      return response(false, 'TEXT_READ_FAILED', 'Text konnte nicht gelesen werden.', { error: String(error) });
    }
  },

  writeText: async (path, content) => {
    try {
      const fileHandle = await getFileHandleSafe(path, true);
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return response(true, 'TEXT_WRITE_OK', 'Text wurde geschrieben.', { path });
    } catch (error) {
      return response(false, 'TEXT_WRITE_FAILED', 'Text konnte nicht geschrieben werden.', { error: String(error) });
    }
  },

  runProjectSelftest: async (options) => runProjectSelftest(browserFilesystemAdapter, options)
};
