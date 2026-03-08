import test from 'node:test';
import assert from 'node:assert/strict';

import { setState } from '../../js/state.js';
import { bindUiActions } from '../../js/ui.js';

const createClassList = () => {
  const classes = new Set();
  return {
    toggle: (name) => {
      if (classes.has(name)) {
        classes.delete(name);
        return false;
      }
      classes.add(name);
      return true;
    },
    contains: (name) => classes.has(name)
  };
};

test('tools-toggle: aria-expanded und label wechseln robust beim klick', () => {
  const listeners = new Map();
  const widgetsPanel = { classList: createClassList() };
  const toggleButton = {
    textContent: 'Mehr Tools',
    attributes: {},
    addEventListener: (event, handler) => listeners.set(event, handler),
    setAttribute: (name, value) => {
      toggleButton.attributes[name] = value;
    }
  };

  const previousDocument = globalThis.document;
  globalThis.document = {
    getElementById: (id) => {
      if (id === 'widgets-panel') return widgetsPanel;
      if (id === 'action-toggle-tools') return toggleButton;
      return null;
    },
    querySelectorAll: () => [],
    addEventListener: () => {}
  };

  try {
    setState({
      uiTexts: {
        buttons: {
          showMoreTools: 'Mehr Tools',
          showLessTools: 'Weniger Tools'
        }
      }
    });

    bindUiActions({
      onSelectDirectory: () => {},
      onRunSelftest: () => {},
      onEnsureStructure: () => {},
      onRunWriteTest: () => {},
      onSwitchDirectory: () => {},
      onExportDiagnosis: async () => '',
      onLogoutWithAutosave: async () => {},
      onToggleA11yQuietMode: () => {},
      onToggleGridHelp: () => {},
      onChangeTheme: () => {},
      onSelectPlugin: () => {},
      onTogglePluginEnabled: () => {},
      onSelectProfile: () => {},
      onSortArchive: () => {},
      onSaveCategoryEntry: () => {},
      onDashboardNoteChangeTitle: () => {},
      onDashboardNoteChangeInput: () => {},
      onDashboardNoteSave: async () => {},
      onOpenDashboardNoteLastFileInEditor: async () => {},
      onEditCategoryEntry: async () => {},
      onDeleteCategoryEntry: async () => {},
      onExportArchive: async () => {},
      onGenerateMix: async () => {},
      onTemplateSave: () => {},
      onTemplateResetDraft: () => {},
      onTemplateStartEdit: () => {},
      onTemplateCopy: async () => {},
      onTemplateToggleFavorite: async () => {},
      onTemplateDelete: async () => {},
      onSetFilePreviewPath: () => {},
      onToggleFilePreviewIncludeOther: () => {},
      onLoadFilePreviewList: async () => {},
      onOpenPreviewFile: async () => {},
      onOpenPreviewInEditor: () => {},
      onEditorChangeContent: () => {},
      onSaveEditorFile: async () => {}
    });

    listeners.get('click')();
    assert.equal(toggleButton.attributes['aria-expanded'], 'true');
    assert.equal(toggleButton.textContent, 'Weniger Tools');

    listeners.get('click')();
    assert.equal(toggleButton.attributes['aria-expanded'], 'false');
    assert.equal(toggleButton.textContent, 'Mehr Tools');
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  }
});
