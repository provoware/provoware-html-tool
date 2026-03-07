import test from 'node:test';
import assert from 'node:assert/strict';

import { initGuideToolsModule } from '../../js/modules/guide-tools-module.js';

const createElement = () => {
  const listeners = new Map();
  return {
    dataset: {},
    value: '',
    textContent: '',
    innerHTML: '',
    classList: { add: () => {}, remove: () => {} },
    addEventListener: (type, handler) => {
      listeners.set(type, handler);
    },
    dispatch: (type, event = {}) => {
      const handler = listeners.get(type);
      if (handler) handler(event);
    },
    querySelector: () => null,
    closest: () => null,
    getAttribute: () => null
  };
};

test('guide-tools: zentrale Index-Navigation deckt Arrow/Jump und Reorder mit ab', () => {
  const app = createElement();
  const indexList = createElement();
  const sectionList = createElement();
  const titleInput = createElement();
  const descriptionInput = createElement();
  const feedback = createElement();
  const form = createElement();
  const moveUpButton = createElement();
  const moveDownButton = createElement();

  const sectionScrolls = [0, 0, 0];
  const sectionNodes = {
    'guide-tool-section-0': { scrollIntoView: () => { sectionScrolls[0] += 1; } },
    'guide-tool-section-1': { scrollIntoView: () => { sectionScrolls[1] += 1; } },
    'guide-tool-section-2': { scrollIntoView: () => { sectionScrolls[2] += 1; } }
  };

  let focusedSelector = '';
  indexList.querySelector = (selector) => ({
    focus: () => {
      focusedSelector = selector;
    }
  });

  const nodes = {
    app,
    'guide-tools-index-list': indexList,
    'guide-tools-sections': sectionList,
    'guide-tools-title': titleInput,
    'guide-tools-description': descriptionInput,
    'guide-tools-feedback': feedback,
    'guide-tools-form': form,
    'guide-tools-move-up': moveUpButton,
    'guide-tools-move-down': moveDownButton,
    ...sectionNodes
  };

  const storage = new Map();
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;

  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value)
    },
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {}
  };

  globalThis.document = {
    getElementById: (id) => nodes[id] || null,
    querySelectorAll: () => []
  };

  try {
    initGuideToolsModule();

    indexList.dispatch('keydown', {
      key: 'ArrowUp',
      preventDefault: () => {}
    });
    assert.equal(focusedSelector, '[data-guide-index="0"]');
    assert.equal(titleInput.value, 'Start prüfen');

    indexList.dispatch('keydown', {
      key: 'ArrowDown',
      preventDefault: () => {}
    });
    indexList.dispatch('keydown', {
      key: 'ArrowDown',
      preventDefault: () => {}
    });
    indexList.dispatch('keydown', {
      key: 'ArrowDown',
      preventDefault: () => {}
    });
    assert.equal(focusedSelector, '[data-guide-index="2"]');
    assert.equal(titleInput.value, 'Ergebnis sichern');

    indexList.dispatch('keydown', {
      key: 'ArrowUp',
      preventDefault: () => {}
    });
    assert.equal(focusedSelector, '[data-guide-index="1"]');
    assert.equal(titleInput.value, 'Tool wählen');

    indexList.dispatch('keydown', {
      key: 'Enter',
      preventDefault: () => {}
    });
    assert.equal(sectionScrolls[1], 1);
    assert.equal(feedback.textContent, 'Status: Abschnitt 2 aktiv.');

    moveDownButton.dispatch('click');
    const saved = JSON.parse(storage.get('provoware:guide-tools-module'));
    assert.deepEqual(saved.map((item) => item.title), ['Start prüfen', 'Ergebnis sichern', 'Tool wählen']);
    assert.equal(feedback.textContent, 'Status: Eintrag nach unten verschoben.');
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }

    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  }
});
