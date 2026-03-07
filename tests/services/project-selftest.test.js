import test from 'node:test';
import assert from 'node:assert/strict';

const { runProjectSelftest } = await import('../../js/services/project-selftest.js');

const createAdapter = (overrides = {}) => ({
  getDirectoryInfo: async () => ({ ok: true, data: { name: 'demo' } }),
  checkPermissions: async () => ({ ok: true, data: { read: true, write: false } }),
  listDirectory: async () => ({ ok: true, data: { entries: [] } }),
  fileExists: async () => ({ ok: true, data: { exists: true } }),
  createFile: async () => ({ ok: true }),
  writeText: async () => ({ ok: false }),
  readText: async () => ({ ok: false }),
  ...overrides
});

test('Ordnerprüfung bleibt ohne Schreibprobe erfolgreich', async () => {
  let writeCalls = 0;
  const adapter = createAdapter({
    writeText: async () => {
      writeCalls += 1;
      return { ok: true, data: { path: 'logs/write-test.txt' } };
    }
  });

  const result = await runProjectSelftest(adapter, {
    projectStructure: { requiredDirectories: [{ path: 'logs', required: true }], requiredFiles: [] },
    runWriteTest: false
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.data.missingDirs.length, 0);
  assert.equal(writeCalls, 0);
});

test('Fehlender Ordner wird als fehlend markiert', async () => {
  const adapter = createAdapter({
    listDirectory: async () => ({ ok: false, code: 'DIRECTORY_LIST_FAILED' })
  });

  const result = await runProjectSelftest(adapter, {
    projectStructure: { requiredDirectories: [{ path: 'logs', required: true }], requiredFiles: [] },
    runWriteTest: false
  });

  assert.deepEqual(result.data.data.missingDirs, ['logs']);
  assert.equal(result.data.checks.some((item) => item.code === 'DIR_MISSING'), true);
});

test('Cleanup wird nur gewertet, wenn echte Funktion übergeben wird', async () => {
  const cleanupCalls = [];
  let lastToken = '';
  const adapter = createAdapter({
    checkPermissions: async () => ({ ok: true, data: { read: true, write: true } }),
    writeText: async (_path, token) => {
      lastToken = token;
      return { ok: true };
    },
    readText: async () => ({ ok: true, data: { text: lastToken } })
  });

  const resultWithoutCleanup = await runProjectSelftest(adapter, {
    projectStructure: { writeTestRules: { testFile: 'logs/write-test.txt' }, requiredDirectories: [], requiredFiles: [] },
    runWriteTest: true,
    cleanupAfterSuccess: 'invalid'
  });

  assert.equal(resultWithoutCleanup.data.checks.some((item) => item.code === 'WRITE_TEST_CLEANUP_OK'), false);
  assert.equal(resultWithoutCleanup.data.checks.some((item) => item.code === 'WRITE_TEST_CLEANUP_FAILED'), false);

  const resultWithCleanup = await runProjectSelftest(adapter, {
    projectStructure: { writeTestRules: { testFile: 'logs/write-test.txt' }, requiredDirectories: [], requiredFiles: [] },
    runWriteTest: true,
    cleanupAfterSuccess: async (context) => {
      cleanupCalls.push(context.testFile);
      return { removed: true };
    }
  });

  assert.equal(cleanupCalls.length, 1);
  assert.equal(cleanupCalls[0], 'logs/write-test.txt');
  assert.equal(resultWithCleanup.data.checks.some((item) => item.code === 'WRITE_TEST_CLEANUP_OK'), true);
});
