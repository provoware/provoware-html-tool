import test from 'node:test';
import assert from 'node:assert/strict';

import { renderMainSection } from '../../js/renderers/ui-main-renderer.js';

test('ui-main: Assistenten-Hinweis wird bei Alternative auf 110 Zeichen gekürzt und Volltext bleibt im Tooltip', () => {
  const nodes = {
    'startup-steps': { innerHTML: '' },
    'startup-assistant-title': { textContent: '' },
    'startup-assistant-text': { textContent: '' },
    'startup-assistant-hint': { textContent: '', title: '' },
    'startup-assistant-action': { disabled: false, textContent: '', dataset: {} },
    'startup-assistant-alt-action': { hidden: true, disabled: true, textContent: '', dataset: {} }
  };

  const longHint = 'Dieser Hinweis ist absichtlich sehr lang und erklärt einen alternativen Pfad mit vielen Details, damit der sichtbare Text sicher gekürzt wird.';

  renderMainSection({
    state: {
      startupCheck: {
        ok: false,
        data: {
          nextAction: { label: 'Primär', target: 'action-run-selftest', hint: 'Kurz' },
          alternativeAction: { label: 'Alternative', target: 'action-switch-dir', hint: longHint }
        },
        message: 'Fehler'
      },
      profileArchive: { events: [] },
      templateArchive: { items: [] },
      moduleRegistry: { modules: [], summary: '' },
      accountArchive: { items: [] }
    },
    byId: (id) => nodes[id] || null,
    setText: () => {},
    formatPermissionStatus: () => '-',
    formatWritePermissionStatus: () => '-',
    formatStructureStatus: () => '-',
    formatOverallStatus: () => '-',
    formatDateTime: () => '-',
    autoFormatText: (value) => String(value || ''),
    autoFormatHtml: (value) => String(value || ''),
    renderStats: () => '-',
    renderProfileOptions: () => '',
    renderCategoryList: () => '',
    fileNameFromPath: () => '',
    buildStartupSteps: () => ({
      currentIndex: 0,
      steps: [{ done: false, label: 'Schritt', assistantTitle: 'Titel', assistantText: 'Text', actionLabel: 'Aktion', actionTarget: 'x' }]
    }),
    buildDashboardInfo: () => '-',
    renderPluginOptions: () => '',
    pluginEnabled: () => false,
    renderSidebarModules: () => '',
    renderTemplateList: () => '',
    renderTemplateQuickButtons: () => '',
    renderFilePreviewList: () => '',
    renderAccountList: () => '',
    renderAccountProfileOptions: () => '',
    renderAccountCustomFields: () => ''
  });

  assert.equal(nodes['startup-assistant-hint'].title, longHint);
  assert.equal(nodes['startup-assistant-hint'].textContent.length <= 110, true);
  assert.equal(nodes['startup-assistant-hint'].textContent.endsWith('…'), true);
});
