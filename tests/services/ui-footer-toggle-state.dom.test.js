import test from 'node:test';
import assert from 'node:assert/strict';

import { syncFooterCollapseUi } from '../../js/ui.js';

const createClassList = () => {
  const classes = new Set();
  return {
    contains: (name) => classes.has(name),
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

test('ui-footer-toggle-state(dom): setzt Collapse-Klasse und Buttontexte konsistent', () => {
  const classList = createClassList();
  const footer = { classList };
  const button = {
    textContent: '',
    attrs: {},
    setAttribute(name, value) {
      this.attrs[name] = value;
    }
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
  assert.equal(classList.contains('is-collapsed'), true);
  assert.equal(button.textContent, 'Footer ausklappen');
  assert.equal(button.attrs['aria-expanded'], 'false');

  syncFooterCollapseUi(false);
  assert.equal(classList.contains('is-collapsed'), false);
  assert.equal(button.textContent, 'Footer einklappen');
  assert.equal(button.attrs['aria-expanded'], 'true');

  global.document = previousDocument;
});
