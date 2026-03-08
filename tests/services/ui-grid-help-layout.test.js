import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { renderMainSection } from '../../js/renderers/ui-main-renderer.js';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

const createBaseState = () => ({
  selectedProjectDirectory: null,
  rememberedProjectDirectoryName: '',
  permissionStatus: null,
  selftestResult: null,
  selectedProfile: 'HardTechno',
  profileStats: { total: 0 },
  profileArchive: { updatedAt: '', events: [] },
  layoutMode: '-',
  logs: [],
  dashboardNotes: { rows: [] },
  templateArchive: { items: [] },
  templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' },
  templateFeedback: { message: '' },
  moduleRegistry: { summary: '-', modules: [] },
  pluginManager: { selectedPluginId: 'char-counter', enabledPluginIds: [] },
  filePreview: { includeOther: false, entries: [], activeEntryPath: '', activeEntryContent: '' }
});

const createRendererDeps = (state, elements) => ({
  state,
  byId: (id) => elements[id] || null,
  setText: () => {},
  formatPermissionStatus: () => '-',
  formatWritePermissionStatus: () => '-',
  formatStructureStatus: () => '-',
  formatOverallStatus: () => '-',
  formatDateTime: () => '-',
  autoFormatText: (value) => value,
  autoFormatHtml: (value) => value,
  renderStats: () => '-',
  renderProfileOptions: () => '',
  renderCategoryList: () => '',
  fileNameFromPath: () => '',
  buildStartupSteps: () => ({
    currentIndex: 0,
    steps: [{ done: true, label: 'ok', assistantTitle: 'ok', assistantText: 'ok', actionLabel: 'ok', actionTarget: '' }]
  }),
  buildDashboardInfo: () => '-',
  renderPluginOptions: () => '',
  pluginEnabled: () => false,
  renderSidebarModules: () => '',
  renderTemplateList: () => '',
  renderTemplateQuickButtons: () => '',
  renderFilePreviewList: () => ''
});

test('ui-grid-help: aktivierte rasterhilfe setzt die 3x3-klasse', () => {
  const panelGrid = {
    classList: {
      classes: new Set(['panel-grid']),
      toggle(name, force) {
        if (force) this.classes.add(name);
        else this.classes.delete(name);
      },
      contains(name) {
        return this.classes.has(name);
      }
    }
  };
  const gridHelpToggle = { checked: false };

  const state = { ...createBaseState(), showGridHelp: true };
  renderMainSection(createRendererDeps(state, { 'panel-grid': panelGrid, 'toggle-grid-help': gridHelpToggle }));

  assert.equal(gridHelpToggle.checked, true);
  assert.equal(panelGrid.classList.contains('panel-grid--show-help'), true);
});

test('ui-grid-help: index hat echtes 3x3-raster mit 9 slots', () => {
  const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const panelGridStart = html.indexOf('<section id="panel-grid"');
  const panelGridEnd = html.indexOf('</main>', panelGridStart);

  assert.notEqual(panelGridStart, -1, 'panel-grid bereich fehlt');
  assert.notEqual(panelGridEnd, -1, 'panel-grid ende fehlt');

  const panelGridSection = html.slice(panelGridStart, panelGridEnd);

  const slotCount = (panelGridSection.match(/class="module-panel/g) || []).length;
  assert.equal(slotCount, 9);
});
