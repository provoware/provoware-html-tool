import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildCopyText,
  createRhymeStore,
  searchRhymes,
  upsertRhymeEntry
} from '../../modules/reimarchiv_modul/logic.js';

test('reimarchiv modul: speichern, ergänzen und suchen bleibt robust', () => {
  let store = createRhymeStore();

  const created = upsertRhymeEntry(store, {
    referenceWord: 'Nacht',
    rhymes: 'Pracht, Macht',
    variants: 'Nächte',
    notes: 'dunkel'
  });
  assert.equal(created.ok, true);
  store = created.store;

  const merged = upsertRhymeEntry(store, {
    referenceWord: 'Nacht',
    rhymes: 'Wacht'
  });
  assert.equal(merged.ok, true);
  store = merged.store;

  const search = searchRhymes(store, 'nac');
  assert.equal(search.ok, true);
  assert.deepEqual(search.matches[0].rhymes.sort(), ['macht', 'pracht', 'wacht']);

  const copyText = buildCopyText(search);
  assert.equal(copyText.includes('nacht:'), true);
});
