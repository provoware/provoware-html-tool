const pass = (name, code, message, details = null) => ({ name, status: 'green', code, message, details });
const warn = (name, code, message, details = null) => ({ name, status: 'yellow', code, message, details });
const fail = (name, code, message, details = null) => ({ name, status: 'red', code, message, details });

const deriveOverall = (checks) => {
  if (checks.some((item) => item.status === 'red')) return 'red';
  if (checks.some((item) => item.status === 'yellow')) return 'yellow';
  return 'green';
};

export const runProjectSelftest = async (adapter, options = {}) => {
  const checks = [];
  const structure = options.projectStructure || { requiredDirectories: [], requiredFiles: [], writeTestRules: {} };

  const dirInfo = await adapter.getDirectoryInfo();
  if (!dirInfo.ok) {
    checks.push(fail('Ordnerwahl', 'DIRECTORY_REQUIRED', 'Kein Projektordner gewählt.'));
    return { ok: false, code: 'SELFTEST_STOPPED', message: 'Selbsttest konnte nicht starten.', data: { overallStatus: 'red', summary: 'Bitte zuerst Ordner wählen.', checks, data: {} } };
  }
  checks.push(pass('Ordnerwahl', 'DIRECTORY_OK', 'Projektordner ist gewählt.', dirInfo.data));

  const permission = await adapter.checkPermissions();
  if (!permission.ok) {
    checks.push(fail('Rechteprüfung', 'PERMISSION_FAILED', 'Rechte konnten nicht geprüft werden.'));
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
    const marker = `${dir.path.replaceAll('/', '_')}/.probe`;
    const writeProbe = await adapter.writeText(marker, 'probe');
    if (writeProbe.ok) {
      checks.push(pass(`Ordner ${dir.path}`, 'DIR_OK', 'Ordner ist verfügbar.'));
    } else {
      missingDirs.push(dir.path);
      checks.push(warn(`Ordner ${dir.path}`, 'DIR_MISSING_OR_READ_ONLY', 'Ordner fehlt oder Schreiben ist nicht erlaubt.'));
    }
  }

  const missingFiles = [];
  for (const file of structure.requiredFiles || []) {
    const exists = await adapter.fileExists(file.path);
    if (exists.ok && exists.data.exists) {
      checks.push(pass(`Datei ${file.path}`, 'FILE_OK', 'Datei ist vorhanden.'));
      continue;
    }
    missingFiles.push(file.path);
    if (permission.ok && permission.data.write && file.onMissing === 'create') {
      const content = file.type === 'json' ? JSON.stringify(file.defaultContent, null, 2) : String(file.defaultContent || '');
      const created = await adapter.createFile(file.path, content);
      if (created.ok) {
        checks.push(pass(`Datei ${file.path}`, 'FILE_CREATED', 'Fehlende Datei wurde erstellt.'));
      } else {
        checks.push(fail(`Datei ${file.path}`, 'FILE_CREATE_FAILED', 'Datei fehlt und konnte nicht erstellt werden.'));
      }
    } else {
      checks.push(fail(`Datei ${file.path}`, 'FILE_MISSING', 'Pflichtdatei fehlt.'));
    }
  }

  if (options.runWriteTest) {
    const testFile = structure.writeTestRules?.testFile || 'logs/write-test.txt';
    const token = `write-test-${Date.now()}`;
    const write = await adapter.writeText(testFile, token);
    const read = write.ok ? await adapter.readText(testFile) : { ok: false };
    if (write.ok && read.ok && read.data.text === token) {
      checks.push(pass('Optionaler Schreibtest', 'WRITE_TEST_OK', 'Schreibtest war erfolgreich.'));
    } else {
      checks.push(warn('Optionaler Schreibtest', 'WRITE_TEST_FAILED', 'Schreibtest ist fehlgeschlagen.'));
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
