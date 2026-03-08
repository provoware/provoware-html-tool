import { createArchiveActions } from './ui-actions/archive-actions.js';
import { createTemplateActions } from './ui-actions/template-actions.js';
import { createWorkspaceActions } from './ui-actions/workspace-actions.js';
import { createSessionActions } from './ui-actions/session-actions.js';
import { createAccountActions } from './ui-actions/account-actions.js';

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
  updateAccountArchive,
  logEvent,
  storeGridHelpPreference
}) => ({
  ...createSessionActions({
    getState,
    setState,
    selectDirectory,
    runSelftest,
    ensureStructure,
    buildDiagnosisExport,
    copyToClipboardSafe,
    logEvent,
    storeGridHelpPreference
  }),
  ...createArchiveActions({
    getState,
    setState,
    updateArchive,
    copyToClipboardSafe,
    logEvent
  }),
  ...createTemplateActions({
    getState,
    setState,
    updateTemplateArchive,
    copyToClipboardSafe
  }),
  ...createWorkspaceActions({
    getState,
    setState,
    logEvent
  }),
  ...createAccountActions({
    getState,
    setState,
    updateAccountArchive
  })
});
