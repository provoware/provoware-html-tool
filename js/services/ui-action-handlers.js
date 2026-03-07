import { createDefaultArchive, createRandomMix, normalizeArchive, addEntry, editEntry, removeEntry, sortArchive, buildStats } from './profile-archive.js';
import { addTemplate, editTemplate, removeTemplate, toggleTemplateFavorite } from './templates-archive.js';

const DEFAULT_PROFILE = 'HardTechno';

export const createUiActionHandlers = ({
  getState,
  setState,
  selectDirectory,
  runSelftest,
  ensureStructure,
  buildDiagnosisExport,
  copyToClipboardSafe,
  updateArchive,
  updateTemplateArchive,
  logEvent
}) => ({
  onSelectDirectory: selectDirectory,
  onRunSelftest: runSelftest,
  onEnsureStructure: ensureStructure,
  onSwitchDirectory: selectDirectory,
  onExportDiagnosis: async () => {
    const text = JSON.stringify(buildDiagnosisExport(), null, 2);
    await copyToClipboardSafe(text);
    logEvent('INFO', 'DIAGNOSIS_EXPORTED', 'Diagnose wurde als JSON bereitgestellt.');
    return text;
  },
  onSelectProfile: (profile) => {
    const state = getState();
    const archive = state.profileArchive || createDefaultArchive();
    setState({ selectedProfile: profile, profileStats: buildStats(archive, profile) });
  },
  onSaveCategoryEntry: ({ category, value }) => {
    const state = getState();
    return updateArchive((archive) => addEntry({ archive, profile: state.selectedProfile, category, value }));
  },
  onEditCategoryEntry: ({ category, oldValue, newValue }) => {
    const state = getState();
    return updateArchive((archive) => editEntry({ archive, profile: state.selectedProfile, category, oldValue, newValue }));
  },
  onDeleteCategoryEntry: ({ category, value }) => {
    const state = getState();
    return updateArchive((archive) => removeEntry({ archive, profile: state.selectedProfile, category, value }));
  },
  onSortArchive: (mode) => {
    setState({ archiveSortMode: mode });
    return updateArchive((archive) => sortArchive({ archive, mode }));
  },
  onExportArchive: async () => {
    const state = getState();
    const archive = normalizeArchive(state.profileArchive || createDefaultArchive());
    const text = JSON.stringify(archive, null, 2);
    await copyToClipboardSafe(text);
    logEvent('INFO', 'ARCHIVE_EXPORTED', 'Archiv wurde als JSON bereitgestellt.');
    return text;
  },
  onImportArchive: (text) => {
    try {
      const parsed = normalizeArchive(JSON.parse(text));
      return updateArchive((archive) => {
        Object.assign(archive, parsed);
        return { ok: true, code: 'ARCHIVE_IMPORTED', message: 'Archiv wurde importiert.' };
      });
    } catch (error) {
      const result = { ok: false, code: 'ARCHIVE_IMPORT_FAILED', message: 'Import-JSON ist ungültig.', data: { error: String(error) } };
      logEvent('WARN', result.code, result.message, result.data);
      return result;
    }
  },
  onGenerateMix: async ({ includeCategories, amountPerCategory }) => {
    const state = getState();
    const result = await updateArchive((archive) => createRandomMix({
      archive,
      profile: state.selectedProfile || DEFAULT_PROFILE,
      includeCategories,
      amountPerCategory
    }));
    if (result.ok && result.data?.text) {
      await copyToClipboardSafe(result.data.text);
    }
    return result;
  },
  onTemplateSave: async ({ id, title, content, category }) => {
    const result = await updateTemplateArchive((archive) => (
      id
        ? editTemplate({ archive, id, title, content, category })
        : addTemplate({ archive, title, content, category })
    ));
    if (result.ok) {
      setState({ templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' } });
    }
    return result;
  },
  onTemplateStartEdit: (id) => {
    const item = (getState().templateArchive?.items || []).find((entry) => entry.id === id);
    if (!item) return;
    setState({ templateDraft: { id: item.id, title: item.title, content: item.content, category: item.category } });
  },
  onTemplateDelete: (id) => updateTemplateArchive((archive) => removeTemplate({ archive, id })),
  onTemplateToggleFavorite: (id) => updateTemplateArchive((archive) => toggleTemplateFavorite({ archive, id })),
  onTemplateCopy: async (id) => {
    const item = (getState().templateArchive?.items || []).find((entry) => entry.id === id);
    if (!item) {
      return { ok: false, code: 'TEMPLATE_MISSING', message: 'Vorlage wurde nicht gefunden.' };
    }
    await copyToClipboardSafe(item.content);
    setState({ templateFeedback: { message: `„${item.title}“ wurde kopiert.`, type: 'success', until: Date.now() + 3000 } });
    setTimeout(() => {
      const state = getState();
      if (state.templateFeedback?.until && state.templateFeedback.until <= Date.now()) {
        setState({ templateFeedback: null });
      }
    }, 3200);
    return { ok: true, code: 'TEMPLATE_COPIED', message: 'Vorlage wurde in die Zwischenablage kopiert.' };
  },
  onTemplateResetDraft: () => {
    setState({ templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' } });
  }
});
