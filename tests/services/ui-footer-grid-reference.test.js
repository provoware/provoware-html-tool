import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const cssPath = path.join(projectRoot, 'css/app.css');

const readCss = () => fs.readFileSync(cssPath, 'utf8');

const findRule = (css, selector, expectedFragment) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedFragment = expectedFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedSelector}\\s*\\{[^}]*${escapedFragment}[^}]*\\}`, 'm');
  return regex.test(css);
};

test('ui-footer-grid-reference: footer-grid bleibt explizit 4-spaltig', () => {
  const css = readCss();

  assert.equal(findRule(css, '.footer-grid', 'grid-template-columns: repeat(4, minmax(0, 1fr));'), true);
});

test('ui-footer-grid-reference: footer-toggle bleibt auf referenzmaß 84x26', () => {
  const css = readCss();

  assert.equal(findRule(css, '.footer-toggle', 'width: 84px;'), true);
  assert.equal(findRule(css, '.footer-toggle', 'height: 26px;'), true);
});
