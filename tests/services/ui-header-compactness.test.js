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

test('ui-header-compactness: header ist kompakter bei desktop-breite', () => {
  const css = readCss();

  assert.equal(findRule(css, '.header', 'height: 100%;'), true);
  assert.equal(findRule(css, '.header-dashboard', 'gap: 10px;'), true);
  assert.equal(findRule(css, '.header-card', 'padding: 6px 8px;'), true);
  assert.match(css, /@media \(min-width: 981px\)[\s\S]*\.header-status-chips\s*\{[\s\S]*grid-auto-rows:\s*minmax\(36px, auto\);[\s\S]*\}/m);
});

test('ui-header-compactness: 980px behält klare hierarchy mit kompakten abständen', () => {
  const css = readCss();

  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.header-dashboard\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);[\s\S]*gap:\s*8px;[\s\S]*\}/m);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.header-card-intro,\s*\.header-card-quick\s*\{[\s\S]*row-gap:\s*7px;[\s\S]*\}/m);
});
