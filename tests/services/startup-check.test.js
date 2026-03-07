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