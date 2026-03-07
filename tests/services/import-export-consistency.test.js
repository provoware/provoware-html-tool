import test from 'node:test';
import assert from 'node:assert/strict';

const previousWindow = globalThis.window;
globalThis.window = { showDirectoryPicker: undefined };

const moduleRegistry = await import('../../js/services/module-registry.js');
const startupCheck = await import('../../js/services/startup-check.js');
const selftestService = await import('../../js/services/project-selftest.js');
const { filesystemAdapter } = await import('../../js/adapters/filesystem-adapter.js');
const { desktopFilesystemAdapter } = await import('../../js/adapters/desktop-filesystem.js');

if (previousWindow === undefined) {
  delete globalThis.window;
} else {
  globalThis.window = previousWindow;
}

test('direkt betroffene Services exportieren die in app.js genutzten Funktionen', () => {
  assert.equal(typeof moduleRegistry.loadModuleRegistry, 'function');
  assert.equal(typeof moduleRegistry.detectTemplateDesignStatus, 'function');
  assert.equal(typeof startupCheck.runStartupCheck, 'function');
  assert.equal(typeof selftestService.runProjectSelftest, 'function');
});

test('filesystemAdapter hat die benötigte Oberfläche für app/startup/selftest', () => {
  const requiredMethods = [
    'selectProjectDirectory',
    'checkPermissions',
    'getDirectoryInfo',
    'ensureProjectStructure',
    'readJson',
    'writeJson',
    'fileExists',
    'createFile',
    'listDirectory',
    'readText',
    'writeText',
    'runProjectSelftest'
  ];

  for (const method of requiredMethods) {
    assert.equal(typeof filesystemAdapter[method], 'function', `Methode fehlt im filesystemAdapter: ${method}`);
    assert.equal(typeof desktopFilesystemAdapter[method], 'function', `Methode fehlt im desktopFilesystemAdapter: ${method}`);
  }
});
