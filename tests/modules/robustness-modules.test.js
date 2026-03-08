import test from 'node:test';
import assert from 'node:assert/strict';

import { createBackupPayload } from '../../modules/backup_funktions_modul/logic.js';
import { createTodoEntry, updateTodoEntry } from '../../modules/todo_kalender_erinnerung/logic.js';
import { createTableBlueprint } from '../../modules/datenbank_baukasten/logic.js';
import { addDebugEvent, createDebugSession } from '../../modules/debugging_modul/logic.js';
import { addLogEntry, exportLogEntries } from '../../modules/logging_modul/logic.js';
import { createEmptyKnowledgeStore, createKnowledgeEntry, updateKnowledgeEntry } from '../../modules/wiki_notiz_wissen/logic.js';

test('backup: fehlende modul-id nutzt robusten fallback', () => {
  const result = createBackupPayload({ moduleId: ' ', version: 0 });
  assert.equal(result.payload.moduleId, 'unbekanntes_modul');
  assert.equal(result.payload.version, 1);
});

test('todo: fehlender titel erzeugt laienfreundlichen standardtitel', () => {
  const created = createTodoEntry({ title: '   ' });
  assert.equal(created.title, 'Neue Aufgabe');

  const updated = updateTodoEntry(created, { title: ' ' });
  assert.equal(updated.title, 'Neue Aufgabe');
});

test('datenbank: null-input bleibt stabil', () => {
  const blueprint = createTableBlueprint(null);
  assert.equal(blueprint.tableName, 'tabelle');
});

test('debugging: event ohne name bekommt klaren standardtext', () => {
  const session = addDebugEvent(createDebugSession(), { name: '   ' });
  assert.equal(session.events[0].name, 'Ohne Namen');
});

test('logging: nicht serialisierbarer kontext bleibt exportierbar', () => {
  const context = {};
  context.self = context;
  const store = addLogEntry(null, { context, eventName: '' });
  assert.equal(store.entries[0].eventName, 'Unbenanntes Ereignis');
  assert.doesNotThrow(() => exportLogEntries(store));
});

test('wiki: update mit ungültigem patch bleibt robust', () => {
  const created = createKnowledgeEntry(createEmptyKnowledgeStore(), { topic: 'T1', content: 'C1' });
  assert.equal(created.ok, true);
  const id = created.data.entry.id;
  const updated = updateKnowledgeEntry(created.data.store, id, null);
  assert.equal(updated.ok, true);
});
