import test from 'node:test';
import assert from 'node:assert/strict';

const { detectTemplateDesignStatus, loadModuleRegistry } = await import('../../js/services/module-registry.js');

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


test('loadModuleRegistry liefert statusCode für robuste Auswertung', async () => {
  const originalFetch = globalThis.fetch;

  const response = (ok, data) => ({ ok, json: async () => data });
  globalThis.fetch = async (path) => {
    if (path === './data/module-registry.json') {
      return response(true, { version: 1, moduleIds: ['ok_modul', 'kaputt_modul', 'missing_modul'] });
    }

    if (path.includes('/missing_modul/')) return response(false);

    if (path.endsWith('/logic.js')) return response(true);

    if (path.endsWith('/manifest.json')) {
      if (path.includes('/kaputt_modul/')) return response(true, { id: 'kaputt_modul', name: '', version: '1.0.0' });
      return response(true, { id: 'ok_modul', name: 'OK', version: '1.0.0' });
    }

    if (path.endsWith('/config.json') || path.endsWith('/texts.json') || path.endsWith('/schema.json')) {
      return response(true, {});
    }

    return response(false);
  };

  const result = await loadModuleRegistry();
  const byId = Object.fromEntries(result.modules.map((item) => [item.id, item]));

  assert.equal(byId.ok_modul.statusCode, 'OK');
  assert.equal(byId.kaputt_modul.statusCode, 'INVALID_CONTENT');
  assert.equal(byId.missing_modul.statusCode, 'MISSING_FILES');
  assert.match(result.summary, /missing_modul: fehlt manifest, config, texts, schema, logic\./);
  assert.match(result.summary, /Hilfe: Datei modules\/\<modul-id\>\/manifest\.json anlegen/);

  globalThis.fetch = originalFetch;
});

test('loadModuleRegistry nutzt fallback und bereinigt doppelte/leerwerte ids', async () => {
  const originalFetch = globalThis.fetch;
  const response = (ok, data) => ({ ok, json: async () => data });

  globalThis.fetch = async (path) => {
    if (path === './data/module-registry.json') {
      return response(true, { version: 1, moduleIds: [' alpha ', '', 'alpha', 'beta'] });
    }

    if (path.includes('/alpha/') || path.includes('/beta/')) {
      return response(true, path.endsWith('/logic.js') ? undefined : { id: path.includes('/alpha/') ? 'alpha' : 'beta', name: 'Name', version: '1.0.0' });
    }

    return response(false);
  };

  const result = await loadModuleRegistry();
  const moduleIds = result.modules.map((item) => item.id);

  assert.deepEqual(moduleIds, ['alpha', 'beta']);
  assert.match(result.summary, /Quelle: data\/module-registry\.json/);
  assert.match(result.summary, /Doppelte moduleIds wurden bereinigt \(alpha\)/);

  globalThis.fetch = async (path) => {
    if (path === './data/module-registry.json') return response(false);
    return response(false);
  };

  const fallbackResult = await loadModuleRegistry();
  assert.match(fallbackResult.summary, /Quelle: fallback/);
  assert.match(fallbackResult.summary, /Nächster Schritt:/);

  globalThis.fetch = async (path) => {
    if (path === './data/module-registry.json') return response(true, { version: 2, moduleIds: ['alpha'] });
    return response(false);
  };

  const badVersionResult = await loadModuleRegistry();
  assert.match(badVersionResult.summary, /keine gültige version/);
  assert.match(badVersionResult.summary, /Feld "version" auf 1 setzen/);

  globalThis.fetch = originalFetch;
});
