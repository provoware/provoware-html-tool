import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const cssPath = path.join(projectRoot, 'css/app.css');
const readCss = () => fs.readFileSync(cssPath, 'utf8');

const hasText = (css, text) => css.includes(text);

test('ui-panel-width-breakpoints: desktop nutzt tokenisierte panel-min/max-breiten', () => {
  const css = readCss();
  assert.equal(hasText(css, '--panel-nav-min: 220px;'), true);
  assert.equal(hasText(css, '--panel-nav-max: 320px;'), true);
  assert.equal(hasText(css, '--panel-main-min: 620px;'), true);
  assert.equal(hasText(css, '--panel-widgets-min: 260px;'), true);
  assert.equal(hasText(css, '--panel-widgets-max: 360px;'), true);
  assert.equal(hasText(css, 'grid-template-columns: minmax(var(--panel-nav-min), var(--panel-nav-max)) minmax(var(--panel-main-min), 1fr) minmax(var(--panel-widgets-min), var(--panel-widgets-max));'), true);
});

test('ui-panel-width-breakpoints: tablet und mobil haben eigene fallback-regeln', () => {
  const css = readCss();
  assert.equal(hasText(css, '@media (max-width: 1340px)'), true);
  assert.equal(hasText(css, 'grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);'), true);
  assert.equal(hasText(css, '@media (max-width: 980px)'), true);
  assert.equal(hasText(css, 'grid-template-columns: 1fr;'), true);
  assert.equal(hasText(css, '.nav,\n  .main,\n  .widgets {'), true);
});

test('ui-panel-width-breakpoints: auto-collapse rechts bei maximiertem panel und linker mobile-collapse sind definiert', () => {
  const css = readCss();
  assert.equal(hasText(css, '.app.sidebar-right-auto-collapsed {'), true);
  assert.equal(hasText(css, '.app.sidebar-left-collapsed.sidebar-right-auto-collapsed {'), true);
  assert.equal(hasText(css, '.app.sidebar-right-auto-collapsed .widgets .sidebar-body,'), true);
  assert.equal(hasText(css, '.app.sidebar-left-collapsed .nav .sidebar-body {\n    display: none;\n  }'), true);
});
