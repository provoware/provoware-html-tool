import test from 'node:test';
import assert from 'node:assert/strict';

import { setState } from '../../js/state.js';
import { render } from '../../js/ui.js';

const createNode = () => ({ textContent: '' });

test('header-chips: setzen nach setState nur die zwei Status-Texte korrekt', () => {
  const nodes = {
    'header-chip-project-status': createNode(),
    'header-chip-autosave-status': createNode(),
    'next-step': { textContent: '', innerHTML: '' }
  };
  const previousDocument = globalThis.document;
  globalThis.document = {
    getElementById: (id) => nodes[id] || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { style: { setProperty: () => {} } },
    createElement: () => ({
      setAttribute: () => {},
      addEventListener: () => {},
      classList: { add: () => {}, remove: () => {} }
    })
  };

  try {
    setState({
      selectedProjectDirectory: null,
      selftestResult: null,
      debug: { startupReady: false },
      editorFilePath: '',
      editorDirty: false
    });
    render();
    assert.equal(nodes['header-chip-project-status'].textContent, 'Wartet');
    assert.equal(nodes['header-chip-autosave-status'].textContent, 'Bereit');

    setState({
      selectedProjectDirectory: { name: 'Demo-Projekt' },
      selftestResult: null,
      debug: { startupReady: false },
      editorFilePath: 'notes.txt',
      editorDirty: true
    });
    render();
    assert.equal(nodes['header-chip-project-status'].textContent, 'In Arbeit');
    assert.equal(nodes['header-chip-autosave-status'].textContent, 'Offen');

    setState({
      selectedProjectDirectory: { name: 'Demo-Projekt' },
      selftestResult: null,
      debug: { startupReady: true },
      editorFilePath: 'notes.txt',
      editorDirty: false
    });
    render();
    assert.equal(nodes['header-chip-project-status'].textContent, 'Bereit');
    assert.equal(nodes['header-chip-autosave-status'].textContent, 'Gesichert');

    setState({
      selectedProjectDirectory: { name: 'Demo-Projekt' },
      selftestResult: null,
      debug: { startupReady: false },
      editorFilePath: '',
      editorDirty: false,
      uiTexts: {
        messages: {
          actionNext: '<img src=x onerror=alert(1)>',
          startupWaiting: '<script>alert(1)</script>'
        }
      }
    });
    render();
    assert.equal(nodes['next-step'].textContent, '<img src=x onerror=alert(1)>: <script>alert(1)</script>.');
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  }
});

test('header-chips: next-step zeigt sonderzeichen und sehr langen text nur als text', () => {
  const nodes = {
    'header-chip-project-status': createNode(),
    'header-chip-autosave-status': createNode(),
    'next-step': { textContent: '', innerHTML: '' }
  };
  const previousDocument = globalThis.document;
  const longWaitingText = `${`äöü ß & < > " ' . `.repeat(45)}ende`;

  globalThis.document = {
    getElementById: (id) => nodes[id] || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { style: { setProperty: () => {} } },
    createElement: () => ({
      setAttribute: () => {},
      addEventListener: () => {},
      classList: { add: () => {}, remove: () => {} }
    })
  };

  try {
    setState({
      selectedProjectDirectory: { name: 'Demo-Projekt' },
      selftestResult: null,
      debug: { startupReady: false },
      editorFilePath: '',
      editorDirty: false,
      uiTexts: {
        messages: {
          actionNext: 'Nächster Schritt & Prüfung',
          startupWaiting: longWaitingText
        }
      }
    });
    render();

    assert.equal(longWaitingText.length > 200, true);
    assert.equal(nodes['next-step'].textContent.includes('Nächster Schritt & Prüfung:'), true);
    assert.equal(nodes['next-step'].textContent.includes('äöü ß & < > " \' .'), true);
    assert.equal(nodes['next-step'].textContent.includes('ende.'), true);
    assert.equal(nodes['next-step'].innerHTML, '');
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  }
});
