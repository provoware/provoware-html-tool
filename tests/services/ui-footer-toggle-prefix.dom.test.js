import test from 'node:test';
import assert from 'node:assert/strict';

import { syncFooterCollapseUi } from '../../js/ui.js';

const createClassList = () => {
  const classes = new Set();
  return {
    toggle: (name, force) => {
      if (force === true) {
        classes.add(name);
        return true;
      }
      if (force === false) {
        classes.delete(name);
        return false;
      }
      if (classes.has(name)) {
        classes.delete(name);
        return false;
      }
      classes.add(name);
      return true;
    }
  };
};

test('ui-footer-toggle-prefix(dom): symbole bleiben in beiden zuständen stabil', () => {
  const footer = { classList: createClassList() };
  const button = {
    textContent: '',
    setAttribute: () => {}
  };

  const nodes = {
    app: { querySelector: () => footer },
    'footer-toggle': button
  };

  const previousDocument = global.document;
  global.document = {
    getElementById: (id) => nodes[id] || null
  };

  syncFooterCollapseUi(true);
  assert.equal(button.textContent.startsWith('▸ '), true);

  syncFooterCollapseUi(false);
  assert.equal(button.textContent.startsWith('▾ '), true);

  global.document = previousDocument;
});
