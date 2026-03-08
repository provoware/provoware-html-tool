import test from 'node:test';
import assert from 'node:assert/strict';

if (!globalThis.window) {
  globalThis.window = {};
}

const { filesystemAdapter } = await import('../../js/adapters/filesystem-adapter.js');
const { runStartupCheck } = await import('../../js/services/startup-check.js');

test('Startup-Check gibt Schreibwunsch an Rechteprüfung weiter', async () => {
  const original = {
    getDirectoryInfo: filesystemAdapter.getDirectoryInfo,
    checkPermissions: filesystemAdapter.checkPermissions,
    runProjectSelftest: filesystemAdapter.runProjectSelftest
  };

  const calls = [];
  filesystemAdapter.getDirectoryInfo = async () => ({ ok: true, data: { name: 'demo' } });
  filesystemAdapter.checkPermissions = async (options) => {
    calls.push(options);
    return { ok: true, data: { read: true, write: false, class: 'read-only' } };
  };
  filesystemAdapter.runProjectSelftest = async () => ({ ok: true, data: { overallStatus: 'green', checks: [] } });

  await runStartupCheck({}, { requestWrite: true });

  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], { requestWrite: true });

  filesystemAdapter.getDirectoryInfo = original.getDirectoryInfo;
  filesystemAdapter.checkPermissions = original.checkPermissions;
  filesystemAdapter.runProjectSelftest = original.runProjectSelftest;
});

test('Startup-Check nutzt sichere Defaults bei ungültiger Projektstruktur', async () => {
  const original = {
    getDirectoryInfo: filesystemAdapter.getDirectoryInfo,
    checkPermissions: filesystemAdapter.checkPermissions,
    runProjectSelftest: filesystemAdapter.runProjectSelftest
  };

  let selftestOptions = null;
  filesystemAdapter.getDirectoryInfo = async () => ({ ok: true, data: { name: 'demo' } });
  filesystemAdapter.checkPermissions = async () => ({ ok: true, data: { read: true, write: true } });
  filesystemAdapter.runProjectSelftest = async (options) => {
    selftestOptions = options;
    return { ok: true, data: { overallStatus: 'green', checks: [] } };
  };

  const result = await runStartupCheck(null, { requestWrite: false });

  assert.equal(result.ok, true);
  assert.equal(result.data.selfRepair.repaired, true);
  assert.equal(result.data.nextAction?.target, 'action-run-selftest');
  assert.equal(typeof result.data.selfRepair.reason, 'string');
  assert.deepEqual(selftestOptions.projectStructure.requiredFiles, []);

  filesystemAdapter.getDirectoryInfo = original.getDirectoryInfo;
  filesystemAdapter.checkPermissions = original.checkPermissions;
  filesystemAdapter.runProjectSelftest = original.runProjectSelftest;
});

test('Startup-Check meldet Laufzeitfehler aus Adapter klar zurück', async () => {
  const original = {
    getDirectoryInfo: filesystemAdapter.getDirectoryInfo,
    checkPermissions: filesystemAdapter.checkPermissions,
    runProjectSelftest: filesystemAdapter.runProjectSelftest
  };

  filesystemAdapter.getDirectoryInfo = async () => {
    throw new Error('kaputt');
  };

  const result = await runStartupCheck({}, {});

  assert.equal(result.ok, false);
  assert.equal(result.code, 'STARTUP_DIRECTORY_THREW');
  assert.equal(result.data.needsDirectory, true);
  assert.equal(result.data.nextAction?.target, 'action-select-dir');

  filesystemAdapter.getDirectoryInfo = original.getDirectoryInfo;
  filesystemAdapter.checkPermissions = original.checkPermissions;
  filesystemAdapter.runProjectSelftest = original.runProjectSelftest;
});

test('Startup-Check bleibt robust bei unvollständiger Selbsttest-Antwort', async () => {
  const original = {
    getDirectoryInfo: filesystemAdapter.getDirectoryInfo,
    checkPermissions: filesystemAdapter.checkPermissions,
    runProjectSelftest: filesystemAdapter.runProjectSelftest
  };

  filesystemAdapter.getDirectoryInfo = async () => ({ ok: true, data: { name: 'demo' } });
  filesystemAdapter.checkPermissions = async () => ({ ok: true, data: { read: true, write: true } });
  filesystemAdapter.runProjectSelftest = async () => ({ ok: true });

  const result = await runStartupCheck({}, {});

  assert.equal(result.ok, false);
  assert.equal(result.code, 'STARTUP_SELFTEST_INVALID_PAYLOAD');
  assert.equal(result.data.needsSelftest, true);
  assert.equal(result.data.nextAction?.target, 'action-run-selftest');

  filesystemAdapter.getDirectoryInfo = original.getDirectoryInfo;
  filesystemAdapter.checkPermissions = original.checkPermissions;
  filesystemAdapter.runProjectSelftest = original.runProjectSelftest;
});
