const pass = (name, code, message, details = null) => ({ name, status: 'green', code, message, details });
const warn = (name, code, message, details = null) => ({ name, status: 'yellow', code, message, details });
const fail = (name, code, message, details = null) => ({ name, status: 'red', code, message, details });

const SELFTEST_IO_LABELS = {
  directoryInfo: 'SELFTEST_DIRECTORY',
  permission: 'SELFTEST_PERMISSION',
  listDirectory: 'SELFTEST_LIST_DIRECTORY',
  fileExists: 'SELFTEST_FILE_EXISTS',
  createFile: 'SELFTEST_CREATE_FILE',
  writeText: 'SELFTEST_WRITE_TEXT',
  readText: 'SELFTEST_READ_TEXT'
};

const safeCall = async (label, task) => {
  try {
    return await task();
  } catch (error) {
    return {
      ok: false,
      code: `${label}_THREW`,
      message: 'Unerwarteter Laufzeitfehler.',
      data: { error: String(error) }
    };
  }
};

const deriveOverall = (checks) => {
  if (checks.some((item) => item.status === 'red')) return 'red';
  if (checks.some((item) => item.status === 'yellow')) return 'yellow';
  return 'green';
};

const runCleanupAfterWriteTest = async (cleanupAfterSuccess, context) => {
  if (typeof cleanupAfterSuccess !== 'function') {
    return null;
  }
  try {
    const result = await cleanupAfterSuccess(context);
    return { ok: true, data: result ?? null };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
};

export const runProjectSelftest = async (adapter, options = {}) => {
  const checks = [];
  const structure = options.projectStructure || { requiredDirectories: [], requiredFiles: [], writeTestRules: {} };

  const dirInfo = await safeCall(SELFTEST_IO_LABELS.directoryInfo, () => adapter.getDirectoryInfo());
  if (!dirInfo.ok) {
    const directoryCode = dirInfo.code || 'DIRECTORY_REQUIRED';
    const directoryMessage = dirInfo.code
      ? 'Ordnerstatus konnte nicht gelesen werden.'
      : 'Kein Projektordner gewählt.';
    checks.push(fail('Ordnerwahl', directoryCode, directoryMessage, dirInfo.data || null));
    return { ok: false, code: 'SELFTEST_STOPPED', message: 'Selbsttest konnte nicht starten.', data: { overallStatus: 'red', summary: 'Bitte zuerst Ordner wählen.', checks, data: {} } };
  }
  checks.push(pass('Ordnerwahl', 'DIRECTORY_OK', 'Projektordner ist gewählt.', dirInfo.data));

  const permission = await safeCall(SELFTEST_IO_LABELS.permission, () => adapter.checkPermissions());
  if (!permission.ok) {
    checks.push(fail('Rechteprüfung', permission.code || 'PERMISSION_FAILED', 'Rechte konnten nicht geprüft werden.', permission.data || null));
  } else if (permission.data.read && permission.data.write) {
    checks.push(pass('Rechteprüfung', 'PERMISSION_FULL', 'Lese- und Schreibrechte sind vorhanden.', permission.data));
  } else if (permission.data.read) {
    checks.push(warn('Rechteprüfung', 'PERMISSION_READ_ONLY', 'Nur Leserechte vorhanden.', permission.data));
  } else {
    checks.push(fail('Rechteprüfung', 'PERMISSION_DENIED', 'Kein Zugriff auf den Ordner.', permission.data));
  }

  const missingDirs = [];
  for (const dir of structure.requiredDirectories || []) {
    if (!dir.required) continue;
    const directoryState = await safeCall(SELFTEST_IO_LABELS.listDirectory, () => adapter.listDirectory(dir.path));
    if (directoryState.ok) {
      checks.push(pass(`Ordner ${dir.path}`, 'DIR_OK', 'Ordner ist verfügbar.'));
    } else {
      missingDirs.push(dir.path);
      checks.push(warn(`Ordner ${dir.path}`, directoryState.code || 'DIR_MISSING', 'Ordner fehlt oder ist nicht lesbar.', directoryState.data || null));
    }
  }

  const missingFiles = [];
  for (const file of structure.requiredFiles || []) {
    const exists = await safeCall(SELFTEST_IO_LABELS.fileExists, () => adapter.fileExists(file.path));
    if (exists.ok && exists.data.exists) {
      checks.push(pass(`Datei ${file.path}`, 'FILE_OK', 'Datei ist vorhanden.'));
      continue;
    }
    missingFiles.push(file.path);
    if (permission.ok && permission.data.write && file.onMissing === 'create') {
      const content = file.type === 'json' ? JSON.stringify(file.defaultContent, null, 2) : String(file.defaultContent || '');
      const created = await safeCall(SELFTEST_IO_LABELS.createFile, () => adapter.createFile(file.path, content));
      if (created.ok) {
        checks.push(pass(`Datei ${file.path}`, 'FILE_CREATED', 'Fehlende Datei wurde erstellt.'));
      } else {
        checks.push(fail(`Datei ${file.path}`, created.code || 'FILE_CREATE_FAILED', 'Datei fehlt und konnte nicht erstellt werden.', created.data || null));
      }
    } else {
      checks.push(fail(`Datei ${file.path}`, 'FILE_MISSING', 'Pflichtdatei fehlt.'));
    }
  }

  if (options.runWriteTest) {
    const testFile = structure.writeTestRules?.testFile || 'logs/write-test.txt';
    const token = `write-test-${Date.now()}`;
    const write = await safeCall(SELFTEST_IO_LABELS.writeText, () => adapter.writeText(testFile, token));
    const read = write.ok ? await safeCall(SELFTEST_IO_LABELS.readText, () => adapter.readText(testFile)) : { ok: false, code: write.code, data: write.data };
    if (write.ok && read.ok && read.data.text === token) {
      checks.push(pass('Optionaler Schreibtest', 'WRITE_TEST_OK', 'Schreibtest war erfolgreich.'));
      const cleanup = await runCleanupAfterWriteTest(options.cleanupAfterSuccess, { adapter, testFile, token });
      if (cleanup) {
        if (cleanup.ok) {
          checks.push(pass('Aufräumen nach Schreibtest', 'WRITE_TEST_CLEANUP_OK', 'Testdatei wurde nach Erfolg bereinigt.', cleanup.data));
        } else {
          checks.push(warn('Aufräumen nach Schreibtest', 'WRITE_TEST_CLEANUP_FAILED', 'Aufräumen nach Schreibtest ist fehlgeschlagen.', { error: cleanup.error, testFile }));
        }
      }
    } else {
      checks.push(warn('Optionaler Schreibtest', write.code || read.code || 'WRITE_TEST_FAILED', 'Schreibtest ist fehlgeschlagen.', { write: write.data || null, read: read.data || null }));
    }
  }

  const overallStatus = deriveOverall(checks);
  const summary = overallStatus === 'green' ? 'Alle Kernprüfungen sind erfolgreich.' : overallStatus === 'yellow' ? 'Es gibt Warnungen. Bitte Hinweise prüfen.' : 'Es gibt Fehler. Bitte zuerst Grundprobleme lösen.';

  return {
    ok: overallStatus !== 'red',
    code: 'SELFTEST_DONE',
    message: 'Selbsttest abgeschlossen.',
    data: { overallStatus, summary, checks, data: { missingDirs, missingFiles } }
  };
};
