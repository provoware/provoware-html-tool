import test from 'node:test';
import assert from 'node:assert/strict';

const { detectTemplateDesignStatus } = await import('../../js/services/module-registry.js');

test('detectTemplateDesignStatus bleibt robust ohne document', () => {
  const originalDocument = globalThis.document;
  delete globalThis.document;

  const result = detectTemplateDesignStatus();
  assert.equal(result.ok, false);
  assert.equal(result.message, 'Vorlagen-Design-Status ist nur im Browser prüfbar.');

  if (originalDocument !== undefined) {
    globalThis.document = originalDocument;
  }
});

test('detectTemplateDesignStatus meldet aktiv bei css+js einbindung', () => {
  const originalDocument = globalThis.document;
  globalThis.document = {
    querySelector: (selector) => {
      if (selector === 'link[href="assets/css/base.css"]') return { tagName: 'LINK' };
      if (selector === 'script[src="assets/js/core.js"]') return { tagName: 'SCRIPT' };
      return null;
    }
  };

  const result = detectTemplateDesignStatus();
  assert.equal(result.ok, true);
  assert.equal(result.message, 'Vorlagen-Design aktiv (assets/css/base.css + assets/js/core.js eingebunden).');

  if (originalDocument === undefined) {
    delete globalThis.document;
  } else {
    globalThis.document = originalDocument;
  }
});
