import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addRecordToBlueprint,
  createDatenbankBaukastenModule,
  createTableBlueprint,
  validateBlueprint
} from '../../modules/datenbank_baukasten/logic.js';

test('datenbank modul: basisobjekt ist bereit', () => {
  const moduleState = createDatenbankBaukastenModule();
  assert.equal(moduleState.id, 'datenbank_baukasten');
  assert.equal(moduleState.ready, true);
});

test('datenbank modul: blueprint + record werden normalisiert', () => {
  const blueprint = createTableBlueprint({
    tableName: ' Kontakte ',
    columns: [{ name: 'Name', type: 'TEXT', required: true }]
  });
  const updated = addRecordToBlueprint(blueprint, { Name: '  Mia  ' });
  assert.equal(updated.tableName, 'Kontakte');
  assert.equal(updated.records[0].Name, 'Mia');
});

test('datenbank modul: validierung erkennt fehlenden tabellennamen', () => {
  const result = validateBlueprint({ tableName: '', columns: [] });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'BLUEPRINT_TABLE_MISSING');
});
