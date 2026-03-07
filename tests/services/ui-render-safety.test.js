import test from 'node:test';
import assert from 'node:assert/strict';

import { escapeHtml } from '../../js/services/html-escape.js';

const renderUnsafeInputAsListItem = (value) => `<li>${escapeHtml(value)}</li>`;

test('ui-render: schadhafter html-input wird nur als text gerendert', () => {
  const payload = '<img src=x onerror="alert(1)">';

  const html = renderUnsafeInputAsListItem(payload);

  assert.equal(html.includes('<img'), false);
  assert.equal(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'), true);
});
