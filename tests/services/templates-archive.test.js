import test from 'node:test';
import assert from 'node:assert/strict';

import { addTemplate, createDefaultTemplateArchive } from '../../js/services/templates-archive.js';

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
