import {
  addAccountProfile,
  addAccountTitle,
  addCustomField,
  archiveAccountTitle,
  getFavoriteAccounts,
  getMostViewedAccounts,
  markAccountOpened,
  removeCustomField,
  removeOrArchiveAccountProfile,
  searchAccountArchive,
  updateAccountProfile,
  updateAccountTitle,
  updateCustomField
} from '../account-archive.js';

const findFirstProfileId = (archive, titleId) => archive.items.find((item) => item.id === titleId)?.profiles?.[0]?.id || '';

export const createAccountActions = ({ getState, setState, updateAccountArchive }) => ({
  onAccountSearch: (query) => setState({ accountArchiveSearch: String(query || '') }),
  onSelectAccountTitle: (titleId) => {
    const state = getState();
    const account = (state.accountArchive?.items || []).find((item) => item.id === titleId && !item.archived);
    const fallbackProfile = account?.profiles?.[0]?.id || '';
    setState({ selectedAccountTitleId: account?.id || '', selectedAccountProfileId: fallbackProfile });
  },
  onSelectAccountProfile: (profileId) => setState({ selectedAccountProfileId: profileId || '' }),
  onCreateAccountTitle: async () => {
    const title = window.prompt('Titelname (z. B. Forum A)');
    if (title === null) return { ok: false, code: 'ACCOUNT_CANCELLED', message: 'Abgebrochen.' };
    const result = await updateAccountArchive((archive) => addAccountTitle({ archive, title }));
    if (result.ok) {
      const firstId = getState().accountArchive?.items?.[0]?.id || '';
      setState({ selectedAccountTitleId: firstId, selectedAccountProfileId: findFirstProfileId(getState().accountArchive, firstId), accountArchiveFeedback: result.message });
    }
    return result;
  },
  onEditAccountTitle: async (titleId) => {
    const state = getState();
    const current = state.accountArchive?.items?.find((item) => item.id === titleId);
    if (!current) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
    const title = window.prompt('Titel bearbeiten', current.title);
    if (title === null) return { ok: false, code: 'ACCOUNT_CANCELLED', message: 'Abgebrochen.' };
    const result = await updateAccountArchive((archive) => updateAccountTitle({ archive, titleId, patch: { title } }));
    setState({ accountArchiveFeedback: result.message });
    return result;
  },
  onArchiveAccountTitle: async (titleId) => {
    const result = await updateAccountArchive((archive) => archiveAccountTitle({ archive, titleId }));
    const archive = getState().accountArchive;
    const firstActive = (archive?.items || []).find((item) => !item.archived);
    setState({
      selectedAccountTitleId: firstActive?.id || '',
      selectedAccountProfileId: firstActive?.profiles?.[0]?.id || '',
      accountArchiveFeedback: result.message
    });
    return result;
  },
  onToggleAccountFavorite: (titleId) => {
    const state = getState();
    const target = state.accountArchive?.items?.find((item) => item.id === titleId);
    if (!target) return { ok: false, code: 'ACCOUNT_TITLE_MISSING', message: 'Titel wurde nicht gefunden.' };
    return updateAccountArchive((archive) => updateAccountTitle({ archive, titleId, patch: { favorite: !target.favorite } }));
  },
  onCreateAccountProfile: async (titleId) => {
    const profileName = window.prompt('Profilname (z. B. privat)');
    if (profileName === null) return { ok: false, code: 'ACCOUNT_CANCELLED', message: 'Abgebrochen.' };
    const result = await updateAccountArchive((archive) => addAccountProfile({ archive, titleId, profile: { profileName } }));
    const profileId = findFirstProfileId(getState().accountArchive, titleId);
    setState({ selectedAccountTitleId: titleId, selectedAccountProfileId: profileId, accountArchiveFeedback: result.message });
    return result;
  },
  onEditAccountProfile: async ({ titleId, profileId, patch }) => updateAccountArchive((archive) => updateAccountProfile({ archive, titleId, profileId, patch })),
  onRemoveAccountProfile: async ({ titleId, profileId }) => updateAccountArchive((archive) => removeOrArchiveAccountProfile({ archive, titleId, profileId })),
  onAddCustomField: async ({ titleId, profileId, label, value }) => updateAccountArchive((archive) => addCustomField({ archive, titleId, profileId, label, value })),
  onEditCustomField: async ({ titleId, profileId, index, label, value }) => updateAccountArchive((archive) => updateCustomField({ archive, titleId, profileId, index, label, value })),
  onRemoveCustomField: async ({ titleId, profileId, index }) => updateAccountArchive((archive) => removeCustomField({ archive, titleId, profileId, index })),
  onOpenAccountDialog: async ({ titleId, profileId }) => {
    const result = await updateAccountArchive((archive) => markAccountOpened({ archive, titleId, profileId }));
    if (result.ok) {
      setState({ accountArchiveDialog: { open: true, titleId, profileId }, selectedAccountTitleId: titleId, selectedAccountProfileId: profileId || '' });
    }
    return result;
  },
  onCloseAccountDialog: () => setState({ accountArchiveDialog: { open: false, titleId: '', profileId: '' } }),
  onAccountComputedLists: () => {
    const archive = getState().accountArchive;
    return {
      favorites: getFavoriteAccounts(archive),
      mostViewed: getMostViewedAccounts(archive),
      search: searchAccountArchive(archive, getState().accountArchiveSearch)
    };
  }
});
