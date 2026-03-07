import { createDefaultArchive, createRandomMix, normalizeArchive, addEntry, editEntry, removeEntry, sortArchive, buildStats } from '../profile-archive.js';

const DEFAULT_PROFILE = 'HardTechno';

export const createArchiveActions = ({ getState, setState, updateArchive, copyToClipboardSafe, logEvent }) => ({
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
  }
});
