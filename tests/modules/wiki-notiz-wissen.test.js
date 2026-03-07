import test from 'node:test';
import assert from 'node:assert/strict';

import {
  listKnowledgeEntries,
  readKnowledgeEntry,
  createKnowledgeEntry,
  createEmptyKnowledgeStore
} from '../../modules/wiki_notiz_wissen/logic.js';

test('wiki modul: list/read liefern Kopien statt Original-Referenzen', () => {
  const created = createKnowledgeEntry(createEmptyKnowledgeStore(), {
    topic: 'API',
    content: 'Kurz erklärt',
    tags: ['basis'],
    relatedIds: ['a-1']
  });

  assert.equal(created.ok, true);
  const store = created.data.store;

  const listed = listKnowledgeEntries(store);
  listed.data[0].tags.push('manipuliert');

  const read = readKnowledgeEntry(store, store.entries[0].id);
  read.data.relatedIds.push('manipuliert');

  assert.deepEqual(store.entries[0].tags, ['basis']);
  assert.deepEqual(store.entries[0].relatedIds, ['a-1']);
});
