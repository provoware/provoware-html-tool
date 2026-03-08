import test from 'node:test';
import assert from 'node:assert/strict';

import { addTemplate, createDefaultTemplateArchive, normalizeTemplateArchive } from '../../js/services/templates-archive.js';

test('Template-Defaults enthalten den neuen Bug-Ticket-Eintrag', () => {
  const archive = createDefaultTemplateArchive();
  const bugTicket = archive.items.find((item) => item.title === 'Bug-Ticket in klaren Schritten');

  assert.ok(bugTicket);
  assert.equal(bugTicket.category, 'Textbaustein');
});

test('addTemplate gibt klare Fehlermeldung bei ungültigem Archiv zurück', () => {
  const result = addTemplate({ archive: null, title: 'A', content: 'B', category: 'Textbaustein' });

  assert.equal(result.ok, false);
  assert.equal(result.code, 'TEMPLATE_ARCHIVE_INVALID');
});


test('normalizeTemplateArchive ergänzt required_fields und meldet Reparatur', () => {
  const input = {
    version: 1,
    items: [{ id: 'x1', title: 'Test', content: 'Inhalt', category: 'Textbaustein', favorite: false }]
  };

  const result = normalizeTemplateArchive(input, { withReport: true });

  assert.equal(Array.isArray(result.archive.required_fields), true);
  assert.equal(result.archive.required_fields.includes('title'), true);
  assert.equal(result.repair.applied, true);
});


test('Template-Defaults enthalten den Account-Archiv-Schnellcheck', () => {
  const archive = createDefaultTemplateArchive();
  const entry = archive.items.find((item) => item.title === 'Account-Archiv Schnellprüfung');

  assert.ok(entry);
  assert.equal(entry.category, 'Arbeitsphrase');
});
