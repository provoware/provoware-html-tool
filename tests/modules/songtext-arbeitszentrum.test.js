import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addSection,
  createSongStore,
  listQuickAccessButtons,
  requestRhymesForWord,
  saveReusableFromSection,
  saveSongToArchive,
  transferSelectionToSong
} from '../../modules/songtext_arbeitszentrum/logic.js';

test('songtext modul: transfer, reusable und versioniertes archiv funktionieren', async () => {
  let store = createSongStore();

  const added = addSection(store, 'Refrain');
  store = added.store;

  const transferred = transferSelectionToSong(store, {
    selection: 'Wir bleiben laut',
    mode: 'replace',
    targetSectionId: added.sectionId
  });
  assert.equal(transferred.ok, true);
  store = transferred.store;

  const reusable = saveReusableFromSection(store, added.sectionId);
  assert.equal(reusable.ok, true);
  store = reusable.store;

  const quick = listQuickAccessButtons(store);
  assert.equal(quick.length, 0);

  const archived1 = saveSongToArchive(store, 'Nachtflug');
  const archived2 = saveSongToArchive(archived1.store, 'Nachtflug');
  assert.equal(archived1.ok, true);
  assert.equal(archived2.ok, true);
  assert.equal(archived1.archiveId.endsWith('_v1'), true);
  assert.equal(archived2.archiveId.endsWith('_v2'), true);

  const rhymeResponse = await requestRhymesForWord({
    searchRhymes: async () => ({ ok: true, matches: [{ referenceWord: 'flug', rhymes: ['zug'] }] })
  }, 'Flug');
  assert.equal(rhymeResponse.ok, true);
  assert.equal(rhymeResponse.matches[0].rhymes[0], 'zug');
});
