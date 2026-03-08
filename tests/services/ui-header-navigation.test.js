import test from 'node:test';
import assert from 'node:assert/strict';

import { bindUiActions } from '../../js/ui.js';

const createCard = (targetId) => {
  const handlers = {};
  return {
    dataset: { navTarget: targetId },
    addEventListener: (type, handler) => { handlers[type] = handler; },
    trigger: (type, event = {}) => handlers[type]?.(event)
  };
};

test('header-navigation: klick und tastatur lösen zielaktion aus', () => {
  const cardQuick = createCard('action-select-dir');
  const cardControls = createCard('panel-proportion-select');
  const cardStats = createCard('action-run-selftest');
  const focusHits = [];
  const clickHits = [];

  const nodes = {
    'header-selftest-help': { addEventListener: () => {} },
    'action-select-dir': { tagName: 'BUTTON', focus: () => focusHits.push('action-select-dir'), click: () => clickHits.push('action-select-dir'), addEventListener: () => {} },
    'panel-proportion-select': { tagName: 'SELECT', focus: () => focusHits.push('panel-proportion-select'), addEventListener: () => {} },
    'action-run-selftest': { tagName: 'BUTTON', focus: () => focusHits.push('action-run-selftest'), click: () => clickHits.push('action-run-selftest'), addEventListener: () => {} },
    'header-card-feedback': { textContent: '' }
  };

  const previousDocument = globalThis.document;
  globalThis.document = {
    getElementById: (id) => nodes[id] || null,
    querySelectorAll: (selector) => selector === '.header-card[data-nav-target]' ? [cardQuick, cardControls, cardStats] : [],
    addEventListener: () => {}
  };

  try {
    bindUiActions({ onSelectDirectory: () => {}, onRunSelftest: () => {} });
    cardQuick.trigger('click', { target: { closest: () => null } });
    cardControls.trigger('keydown', { key: 'Enter', preventDefault: () => {} });
    cardStats.trigger('keydown', { key: ' ', preventDefault: () => {} });

    assert.deepEqual(clickHits, ['action-select-dir', 'action-run-selftest']);
    assert.deepEqual(focusHits, ['action-select-dir', 'panel-proportion-select', 'action-run-selftest']);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});

test('header-navigation: fehlendes ziel schreibt warnung und verschachtelte button-klicks werden ignoriert', () => {
  const cardMissing = createCard('missing-target');
  const logs = [];

  const previousDocument = globalThis.document;
  globalThis.document = {
    getElementById: (id) => (id === 'header-card-feedback' ? { textContent: '' } : null),
    querySelectorAll: (selector) => selector === '.header-card[data-nav-target]' ? [cardMissing] : [],
    addEventListener: () => {}
  };

  try {
    bindUiActions({ onAddLog: (level, message) => logs.push({ level, message }) });
    cardMissing.trigger('click', { target: { closest: () => ({}) } });
    assert.equal(logs.length, 0);

    cardMissing.trigger('keydown', { key: 'Enter', preventDefault: () => {} });
    assert.equal(logs.length, 1);
    assert.equal(logs[0].level, 'warn');
    assert.equal(logs[0].message.includes('missing-target'), true);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});

test('header-navigation: selftest-hilfe-knopf startet selbsttest und setzt fokus', () => {
  const handlers = {};
  const focusHits = [];
  const runHits = [];
  const nodes = {
    'header-selftest-help': { addEventListener: (type, handler) => { handlers[type] = handler; } },
    'action-run-selftest': {
      tagName: 'BUTTON',
      focus: () => focusHits.push('action-run-selftest'),
      click: () => {},
      addEventListener: () => {}
    },
    'header-card-feedback': { textContent: '' }
  };
  const previousDocument = globalThis.document;
  globalThis.document = {
    getElementById: (id) => nodes[id] || null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };

  try {
    bindUiActions({ onRunSelftest: () => runHits.push('run') });
    handlers.click?.({});
    assert.deepEqual(focusHits, ['action-run-selftest']);
    assert.deepEqual(runHits, ['run']);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
