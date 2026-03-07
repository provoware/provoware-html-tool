import test from 'node:test';
import assert from 'node:assert/strict';

const { desktopFilesystemAdapter } = await import('../../js/adapters/desktop-filesystem.js');

test('Desktop-Stub gibt klare Nutzerhinweise zurück', async () => {
  const result = await desktopFilesystemAdapter.runProjectSelftest({ runWriteTest: false });

  assert.equal(result.ok, false);
  assert.equal(result.code, 'DESKTOP_ADAPTER_NOT_ACTIVE');
  assert.match(result.message, /Browser-Modus/);
  assert.equal(result.data.nextStep, 'Nutze zuerst die Browser-Version mit "Ordner wählen".');
});
