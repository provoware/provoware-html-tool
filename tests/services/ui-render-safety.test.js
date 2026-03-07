import test from 'node:test';
import assert from 'node:assert/strict';

import { createSafeListItem, escapeHtml } from '../../js/services/html-escape.js';

const renderUnsafeInputAsListItem = (value) => `<li>${escapeHtml(value)}</li>`;

test('ui-render: schadhafter html-input wird nur als text gerendert', () => {
  const payload = '<img src=x onerror="alert(1)">';

  const html = renderUnsafeInputAsListItem(payload);

  assert.equal(html.includes('<img'), false);
  assert.equal(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'), true);
});

test('ui-render: createSafeListItem zeigt injection-payload nur als text', () => {
  const imgPayload = '<img src=x onerror="alert(1)">';
  const scriptPayload = '<script>alert(2)</script>';

  const imgHtml = createSafeListItem(imgPayload);
  const scriptHtml = createSafeListItem(scriptPayload);

  assert.equal(imgHtml, '<li>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</li>');
  assert.equal(scriptHtml, '<li>&lt;script&gt;alert(2)&lt;/script&gt;</li>');
  assert.equal(imgHtml.includes('<img'), false);
  assert.equal(scriptHtml.includes('<script>'), false);
});
