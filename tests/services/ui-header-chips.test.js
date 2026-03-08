import test from 'node:test';
import assert from 'node:assert/strict';

import { setState } from '../../js/state.js';
import { render } from '../../js/ui.js';

const createNode = () => ({ textContent: '' });

test('header-chips: setzen nach setState nur die zwei Status-Texte korrekt', () => {
  const nodes = {
    'header-chip-project-status': createNode(),
    'header-chip-autosave-status': createNode(),
    'next-step': { textContent: '', innerHTML: '' },
    'header-stat-health': { textContent: '', className: '' },
    'header-stat-health-legend': createNode(),
    'header-stat-events-trend': createNode()
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
      selftestResult: { overallStatus: 'yellow' },
      debug: { startupReady: true },
      editorFilePath: '',
      editorDirty: false
    });
    render();
    assert.equal(nodes['header-stat-health'].textContent, 'prüfen');
    assert.equal(nodes['header-stat-health'].className.includes('is-review'), true);
    assert.equal(nodes['header-stat-health-legend'].textContent.includes('🟡 prüfen'), true);

    setState({
      selectedProjectDirectory: { name: 'Demo-Projekt' },
      selftestResult: null,
      debug: { startupReady: true },
      editorFilePath: '',
      editorDirty: false,
      profileArchive: { events: [] }
    });
    render();
    assert.equal(nodes['header-stat-events-trend'].textContent, '0 (keine Historie)');

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    setState({
      selectedProjectDirectory: { name: 'Demo-Projekt' },
      selftestResult: null,
      debug: { startupReady: true },
      editorFilePath: '',
      editorDirty: false,
      profileArchive: {
        events: [
          { timestamp: new Date(now - day).toISOString() },
          { timestamp: new Date(now - (2 * day)).toISOString() },
          { timestamp: new Date(now - (8 * day)).toISOString() },
          { timestamp: new Date(now - (10 * day)).toISOString() }
        ]
      }
    });
    render();
    assert.equal(nodes['header-stat-events-trend'].textContent, '2 (±0)');

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

    setState({
      selectedProjectDirectory: null,
      selftestResult: null,
      debug: { startupReady: false },
      editorFilePath: '',
      editorDirty: false,
      uiTexts: {
        messages: {
          actionNext: 'Nächster Schritt',
          startupMissingFolderNext: 'Ordner wählen'
        }
      }
    });
    render();
    assert.equal(nodes['next-step'].textContent, 'Nächster Schritt: Ordner wählen.');
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
    'next-step': { textContent: '', innerHTML: '' },
    'header-stat-health': { textContent: '', className: '' },
    'header-stat-health-legend': createNode(),
    'header-stat-events-trend': createNode()
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
    assert.equal(nodes['next-step'].textContent.includes('ende'), true);
    assert.equal(nodes['next-step'].innerHTML, '');
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  }
});
