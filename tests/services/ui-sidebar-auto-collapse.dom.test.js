import test from 'node:test';
import assert from 'node:assert/strict';

import { syncRightSidebarAutoCollapseState } from '../../js/ui.js';

const createClassList = (initial = []) => {
  const classes = new Set(initial);
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
    },
    has: (name) => classes.has(name)
  };
};

test('ui-sidebar-auto-collapse(dom): setzt Klasse + Auto-Label bei <1100px und maximiertem Panel', () => {
  const classList = createClassList(['has-maximized-panel']);
  const app = { classList };
  const toggleButton = { textContent: 'Rechte Leiste' };

  const result = syncRightSidebarAutoCollapseState({
    app,
    toggleButton,
    viewportWidth: 1099,
    baseLabel: 'Rechte Leiste'
  });

  assert.equal(result, true);
  assert.equal(classList.has('sidebar-right-auto-collapsed'), true);
  assert.equal(toggleButton.textContent, 'Rechte Leiste (Auto)');
});

test('ui-sidebar-auto-collapse(dom): entfernt Klasse + Auto-Label außerhalb der Bedingung', () => {
  const classList = createClassList(['has-maximized-panel', 'sidebar-right-auto-collapsed']);
  const app = { classList };
  const toggleButton = { textContent: 'Rechte Leiste (Auto)' };

  const result = syncRightSidebarAutoCollapseState({
    app,
    toggleButton,
    viewportWidth: 1100,
    baseLabel: 'Rechte Leiste'
  });

  assert.equal(result, false);
  assert.equal(classList.has('sidebar-right-auto-collapsed'), false);
  assert.equal(toggleButton.textContent, 'Rechte Leiste');
});
