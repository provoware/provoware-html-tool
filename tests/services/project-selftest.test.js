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
