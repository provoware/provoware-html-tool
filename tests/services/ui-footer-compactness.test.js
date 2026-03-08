import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const cssPath = path.join(projectRoot, 'css/app.css');

const readCss = () => fs.readFileSync(cssPath, 'utf8');

const findRule = (css, selector, expectedFragment) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedSelector}\\s*\\{[^}]*${expectedFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^}]*\\}`, 'm');
  return regex.test(css);
};

test('ui-footer-compactness: kompakte footer-abstände bleiben stabil', () => {
  const css = readCss();

  assert.equal(findRule(css, '.footer', 'padding: 8px;'), true);
  assert.equal(findRule(css, '.footer-grid', 'gap: 6px;'), true);
  assert.equal(findRule(css, '.footer-box', 'padding: 6px;'), true);
  assert.equal(findRule(css, '.footer', 'padding: 4px;'), true);
  assert.equal(findRule(css, '.footer-box', 'padding: 4px;'), true);
});
