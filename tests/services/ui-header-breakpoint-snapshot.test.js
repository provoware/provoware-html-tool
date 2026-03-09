import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const css = fs.readFileSync(path.join(projectRoot, 'css/app.css'), 'utf8');

const buildHeaderSnapshot = () => ({
  desktop1280: css.includes('@media (max-width: 1340px)') && css.includes('.header-dashboard {\n    grid-template-columns: repeat(2, minmax(0, 1fr));'),
  tablet980: css.includes('@media (max-width: 980px)') && css.includes('.header-dashboard {\n    grid-template-columns: repeat(2, minmax(0, 1fr));'),
  mobile720: css.includes('@media (max-width: 720px)') && css.includes('.header-dashboard {\n    grid-template-columns: 1fr;')
});

test('ui-header-breakpoint-snapshot: 1280/980/720 Regeln sind stabil vorhanden', () => {
  assert.deepEqual(buildHeaderSnapshot(), {
    desktop1280: true,
    tablet980: true,
    mobile720: true
  });
});
