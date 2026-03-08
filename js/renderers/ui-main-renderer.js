import { categories } from '../services/profile-archive.js';
import { evaluatePlugin, getPluginCatalog } from '../modules/plugin-manager.js';
import { statusVisual } from '../status-visuals.js';
import { escapeHtml } from '../services/html-escape.js';

const statusClass = (status) => (status === 'green' ? 'check-ok' : status === 'yellow' ? 'check-warn' : 'check-error');

const NEXT_STEP_FILE_PATH_PATTERN = /(data\/[\w./-]+\.[\w]+|modules\/[\w./-]+\.[\w]+)/i;

const extractNextStepFilePath = (nextStep) => {
  const match = String(nextStep || '').match(NEXT_STEP_FILE_PATH_PATTERN);
  return match?.[1] || '';
};

export const renderMainSection = ({
  state,
  byId,
  setText,
  formatPermissionStatus,
  formatWritePermissionStatus,
  formatStructureStatus,
  formatOverallStatus,
  formatDateTime,
  autoFormatText,
  autoFormatHtml,
  renderStats,
  renderProfileOptions,
  renderCategoryList,
  fileNameFromPath,
  buildStartupSteps,
  buildDashboardInfo,
  renderPluginOptions,
  pluginEnabled,
  renderSidebarModules,
  renderTemplateList,
  renderTemplateQuickButtons,
  renderFilePreviewList,
  renderAccountList,
  renderAccountProfileOptions,
  renderAccountCustomFields
}) => {
  const selectedName = state.selectedProjectDirectory?.name;
  const rememberedName = state.rememberedProjectDirectoryName;
  const folderText = selectedName || (rememberedName ? `${rememberedName} (zuletzt gewählt)` : '-');
  setText('status-folder', folderText);
  setText('status-read', formatPermissionStatus(state.permissionStatus?.read));
  setText('status-write', formatWritePermissionStatus(state.permissionStatus));
  setText('status-structure', formatStructureStatus(state.selftestResult));
  setText('status-last-test', autoFormatText(state.selftestResult?.summary || '-'));
  setText('status-overall', formatOverallStatus(state.selftestResult?.overallStatus || 'red'));
  setText('status-layout', state.layoutMode || '-');
  setText('archive-overview-profile', state.selectedProfile || '-');
  setText('archive-overview-total', String(state.profileStats?.total ?? '-'));
  setText('archive-overview-updated', formatDateTime(state.profileArchive?.updatedAt));

  const accountItems = (state.accountArchive?.items || []).filter((item) => !item.archived);
  const accountSearch = String(state.accountArchiveSearch || '').toLowerCase();
  const filteredAccounts = accountSearch
    ? accountItems.filter((item) => {
      const profileText = (item.profiles || []).flatMap((profile) => [profile.profileName, profile.loginEmail, profile.websiteUrl, profile.username, profile.notes, ...(profile.tags || []), ...((profile.customFields || []).flatMap((field) => [field.label, field.value]))]).join(' ').toLowerCase();
      return `${item.title} ${(item.tags || []).join(' ')} ${profileText}`.toLowerCase().includes(accountSearch);
    })
    : accountItems;
  const titleId = filteredAccounts.some((item) => item.id === state.selectedAccountTitleId)
    ? state.selectedAccountTitleId
    : (filteredAccounts[0]?.id || '');
  const selectedTitle = accountItems.find((item) => item.id === titleId) || null;
  const selectedProfile = (selectedTitle?.profiles || []).find((profile) => profile.id === state.selectedAccountProfileId) || selectedTitle?.profiles?.[0] || null;

  const accountTitleList = byId('account-title-list');
  if (accountTitleList) {
    accountTitleList.innerHTML = renderAccountList(filteredAccounts);
    accountTitleList.dataset.selectedTitle = titleId;
  }
  const accountProfileSelect = byId('account-profile-select');
  if (accountProfileSelect) {
    accountProfileSelect.innerHTML = renderAccountProfileOptions(selectedTitle?.profiles || [], selectedProfile?.id || '');
    accountProfileSelect.disabled = !(selectedTitle?.profiles || []).length;
  }
  setText('account-stats', `Titel: ${state.accountArchiveStats?.titles ?? 0} | Profile: ${state.accountArchiveStats?.profiles ?? 0} | Favoriten: ${state.accountArchiveStats?.favorites ?? 0} | Mehrfachprofile: ${state.accountArchiveStats?.multiProfileTitles ?? 0}`);
  setText('account-detail-title', selectedTitle?.title || 'Kein Titel ausgewählt');
  setText('account-detail-email', selectedProfile?.loginEmail || '-');
  setText('account-detail-url', selectedProfile?.websiteUrl || '-');
  setText('account-detail-username', selectedProfile?.username || '-');
  setText('account-detail-notes', selectedProfile?.notes || 'Keine Notiz hinterlegt.');
  const customList = byId('account-custom-list');
  if (customList) customList.innerHTML = renderAccountCustomFields(selectedProfile?.customFields || []);
  const accountFeedback = byId('account-feedback');
  if (accountFeedback) accountFeedback.textContent = state.accountArchiveFeedback || 'Bereit.';
  const accountFavorites = byId('account-favorites');
  if (accountFavorites) {
    const favorites = accountItems.filter((item) => item.favorite).slice(0, 3);
    accountFavorites.innerHTML = favorites.length ? favorites.map((item) => `<li>${escapeHtml(item.title)}</li>`).join('') : '<li>Keine Favoriten.</li>';
  }
  const accountMostViewed = byId('account-most-viewed');
  if (accountMostViewed) {
    const viewed = [...accountItems].sort((a, b) => (b.openCount || 0) - (a.openCount || 0)).slice(0, 3);
    accountMostViewed.innerHTML = viewed.length ? viewed.map((item) => `<li>${escapeHtml(item.title)} (${item.openCount || 0})</li>`).join('') : '<li>Noch keine Nutzung.</li>';
  }

  const accountDialog = byId('account-detail-dialog');
  const accountDialogBody = byId('account-dialog-content');
  if (accountDialog && accountDialogBody) {
    const dialogTitle = accountItems.find((item) => item.id === state.accountArchiveDialog?.titleId);
    const dialogProfile = dialogTitle?.profiles?.find((profile) => profile.id === state.accountArchiveDialog?.profileId) || dialogTitle?.profiles?.[0];
    if (state.accountArchiveDialog?.open && dialogTitle) {
      const emailValue = escapeHtml(dialogProfile?.loginEmail || '-');
      const urlValue = escapeHtml(dialogProfile?.websiteUrl || '-');
      const usernameValue = escapeHtml(dialogProfile?.username || '-');
      accountDialogBody.innerHTML = `<h4>${escapeHtml(dialogTitle.title)}</h4><p><strong>Profil:</strong> ${escapeHtml(dialogProfile?.profileName || '-')}</p><p><strong>E-Mail:</strong> ${emailValue} <button class="btn-small" type="button" data-account-copy="E-Mail" data-copy-value="${emailValue}">Kopieren</button></p><p><strong>URL:</strong> ${urlValue} <button class="btn-small" type="button" data-account-copy="URL" data-copy-value="${urlValue}">Kopieren</button></p><p><strong>Benutzername:</strong> ${usernameValue} <button class="btn-small" type="button" data-account-copy="Benutzername" data-copy-value="${usernameValue}">Kopieren</button></p><p><strong>Notizen:</strong> ${escapeHtml(dialogProfile?.notes || '-')}</p>`;
      if (typeof accountDialog.showModal === 'function' && !accountDialog.open) accountDialog.showModal();
      else if (typeof accountDialog.showModal !== 'function') accountDialog.setAttribute('open', 'open');
    } else if (accountDialog.open) {
      accountDialog.close();
    } else {
      accountDialog.removeAttribute('open');
    }
  }

  const quietModeToggle = byId('a11y-quiet-mode');
  const panelProportionSelect = byId('panel-proportion-select');
  if (panelProportionSelect) panelProportionSelect.value = state.panelProportionPreset || 'balanced';
  if (quietModeToggle) quietModeToggle.checked = Boolean(state.a11yQuietMode);
  const gridHelpToggle = byId('toggle-grid-help');
  const showGridHelp = state.showGridHelp !== false;
  if (gridHelpToggle) gridHelpToggle.checked = showGridHelp;
  const panelGrid = byId('panel-grid');
  if (panelGrid) panelGrid.classList.toggle('panel-grid--show-help', showGridHelp);

  const checksList = byId('checks-list');
  if (checksList) {
    const checks = state.selftestResult?.checks || [];
    checksList.replaceChildren();
    checks.forEach((check) => {
      const visual = statusVisual(check.status);
      const item = document.createElement('article');
      item.className = `check-item ${statusClass(check.status)}`;

      const title = document.createElement('strong');
      title.textContent = `${visual.symbol} ${autoFormatText(check.name)}`;
      const text = document.createElement('span');
      text.textContent = autoFormatText(check.message);

      item.append(title, document.createElement('br'), text);
      checksList.append(item);
    });
  }

  setText('archive-stats', renderStats(state.profileStats));
  const profileSelect = byId('profile-select');
  if (profileSelect) {
    profileSelect.innerHTML = renderProfileOptions(state.profileArchive, state.selectedProfile);
  }
  const sortSelect = byId('archive-sort');
  if (sortSelect) sortSelect.value = state.archiveSortMode || 'alpha';

  const archiveList = byId('archive-list');
  if (archiveList) {
    archiveList.innerHTML = categories.map((category) => `<section class="archive-category"><h4>${category}</h4><ul>${renderCategoryList(state.profileArchive, state.selectedProfile, category) || '<li>-</li>'}</ul></section>`).join('');
  }

  const noteRows = state.dashboardNotes?.rows || [];
  noteRows.forEach((row, rowIndex) => {
    const titleField = byId(`dashboard-note-title-${rowIndex}`);
    if (titleField && document.activeElement !== titleField) titleField.value = row.title || '';
    const inputField = byId(`dashboard-note-input-${rowIndex}`);
    if (inputField && document.activeElement !== inputField) inputField.value = row.input || '';
    const openButton = byId(`dashboard-note-open-${rowIndex}`);
    if (openButton) openButton.disabled = !row.lastSavedPath;
    setText(`dashboard-note-feedback-${rowIndex}`, row.feedback || '-');
    const lastFile = fileNameFromPath(row.lastSavedPath);
    setText(`dashboard-note-file-${rowIndex}`, `Letzte Datei: ${lastFile || '-'}`);
  });

  const startupSteps = byId('startup-steps');
  const startupAssistantTitle = byId('startup-assistant-title');
  const startupAssistantText = byId('startup-assistant-text');
  const startupAssistantHint = byId('startup-assistant-hint');
  const startupAssistantAction = byId('startup-assistant-action');
  if (startupSteps) {
    const progress = buildStartupSteps(state);
    startupSteps.innerHTML = progress.steps.map((step, index) => {
      const css = step.done
        ? 'startup-step startup-step--done'
        : (index === progress.currentIndex ? 'startup-step startup-step--current' : 'startup-step');
      return `<li class="${css}">${escapeHtml(step.label)}</li>`;
    }).join('');

    const currentStep = progress.steps[progress.currentIndex];
    const allDone = progress.steps.every((step) => step.done);
    const startupCheck = state.startupCheck;
    const suggestedAction = startupCheck?.ok === false ? startupCheck?.data?.nextAction : null;

    if (startupAssistantTitle) {
      startupAssistantTitle.textContent = allDone ? 'Assistent: Fertig' : `Assistent: ${currentStep.assistantTitle}`;
    }
    if (startupAssistantText) {
      startupAssistantText.textContent = allDone
        ? 'Alle 4 Schritte sind erledigt. Du kannst jetzt normal weiterarbeiten.'
        : (startupCheck?.ok === false
          ? `${currentStep.assistantText} Fehlerhilfe: ${startupCheck.message}`
          : currentStep.assistantText);
    }
    if (startupAssistantHint) {
      startupAssistantHint.textContent = allDone
        ? 'Du kannst bei Bedarf jederzeit erneut prüfen.'
        : (suggestedAction?.hint || 'Der Knopf startet den passenden Schritt rechts im Bereich „Tool-Einstellungen und Tests“.');
    }
    if (startupAssistantAction) {
      if (allDone) {
        startupAssistantAction.disabled = true;
        startupAssistantAction.textContent = 'Alles erledigt';
        startupAssistantAction.dataset.assistantTarget = '';
      } else {
        startupAssistantAction.disabled = false;
        startupAssistantAction.textContent = suggestedAction?.label || currentStep.actionLabel;
        startupAssistantAction.dataset.assistantTarget = suggestedAction?.target || currentStep.actionTarget;
      }
    }
  }

  const dashboardInfo = buildDashboardInfo(state);
  setText('dashboard-info-note', dashboardInfo);

  const pluginCatalog = getPluginCatalog();
  const selectedPluginId = state.pluginManager?.selectedPluginId || 'char-counter';
  const pluginSelect = byId('plugin-select');
  if (pluginSelect) {
    pluginSelect.innerHTML = renderPluginOptions(selectedPluginId);
  }
  const selectedPlugin = pluginCatalog.find((item) => item.id === selectedPluginId) || pluginCatalog[0];
  const selectedPluginEnabled = pluginEnabled(state, selectedPlugin?.id || 'char-counter');
  setText('plugin-help-text', selectedPlugin?.help || 'Plugin-Hilfe nicht verfügbar.');
  setText('plugin-state', selectedPluginEnabled ? 'Status: aktiv' : 'Status: deaktiviert');
  setText('plugin-toggle', selectedPluginEnabled ? 'Plugin deaktivieren' : 'Plugin aktivieren');
  const pluginOutput = byId('plugin-output');
  if (pluginOutput) {
    if (!selectedPluginEnabled) {
      pluginOutput.innerHTML = '<li>Plugin ist deaktiviert. Aktivieren Sie es bei Bedarf.</li>';
    } else {
      const result = evaluatePlugin(selectedPlugin?.id || 'char-counter');
      const lines = [result.title, ...(result.lines || [])];
      pluginOutput.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
    }
  }

  setText('module-registry-summary', state.moduleRegistry?.summary || '-');
  setText('module-registry-summary-main', state.moduleRegistry?.summary || '-');
  const moduleRegistryNextStep = state.moduleRegistry?.nextStep || 'Keine Aktion nötig.';
  setText('module-registry-next-step', `Nächster Modul-Schritt: ${moduleRegistryNextStep}`);
  const nextStepPath = extractNextStepFilePath(moduleRegistryNextStep);
  const moduleRegistryOpenButton = byId('module-registry-open-next-step');
  if (moduleRegistryOpenButton) {
    moduleRegistryOpenButton.disabled = !nextStepPath;
    moduleRegistryOpenButton.dataset.filePath = nextStepPath;
    moduleRegistryOpenButton.title = nextStepPath ? `Datei öffnen: ${nextStepPath}` : 'Kein Dateipfad im nächsten Schritt gefunden.';
  }
  const moduleRegistryCreateButton = byId('module-registry-create-next-step');
  if (moduleRegistryCreateButton) {
    moduleRegistryCreateButton.disabled = !nextStepPath;
    moduleRegistryCreateButton.dataset.filePath = nextStepPath;
    moduleRegistryCreateButton.title = nextStepPath ? `Datei anlegen: ${nextStepPath}` : 'Kein Dateipfad im nächsten Schritt gefunden.';
  }
  const templateSelect = byId('module-registry-template-select');
  const templateApplyButton = byId('module-registry-apply-template');
  const templatePath = state.moduleRegistryTemplatePath || '';
  const templateType = state.moduleRegistryTemplateType || '';
  const templateEnabled = Boolean(templatePath && templateType);
  if (templateSelect) {
    templateSelect.disabled = !templateEnabled;
    if (templateEnabled) templateSelect.value = templateType;
    if (!templateEnabled) templateSelect.value = '';
    templateSelect.dataset.filePath = templatePath;
  }
  if (templateApplyButton) {
    templateApplyButton.disabled = !templateEnabled;
    templateApplyButton.dataset.filePath = templatePath;
    templateApplyButton.title = templateEnabled ? `Vorlage einsetzen: ${templatePath}` : 'Vorlagenmenü erst nach Datei-Anlage verfügbar.';
  }
  setText('module-registry-template-status', state.moduleRegistryTemplateStatus || 'Vorlagenmenü inaktiv.');
  const sidebarModuleList = byId('sidebar-module-list');
  if (sidebarModuleList) {
    sidebarModuleList.innerHTML = renderSidebarModules(state.moduleRegistry?.modules || []);
  }
  setText('template-design-status', autoFormatText(state.templateDesignStatus?.message || '-'));

  const templateDraft = state.templateDraft || { id: null, title: '', content: '', category: 'Textbaustein' };
  const templateId = byId('template-id');
  if (templateId) templateId.value = templateDraft.id || '';
  const templateTitle = byId('template-title');
  if (templateTitle) templateTitle.value = templateDraft.title || '';
  const templateCategory = byId('template-category');
  if (templateCategory) templateCategory.value = templateDraft.category || 'Textbaustein';
  const templateContent = byId('template-content');
  if (templateContent) templateContent.value = templateDraft.content || '';

  const templateList = byId('template-list');
  if (templateList) {
    templateList.innerHTML = renderTemplateList(state.templateArchive?.items || []);
  }

  const templateFavorites = byId('template-favorites');
  if (templateFavorites) {
    templateFavorites.innerHTML = renderTemplateQuickButtons(state.templateArchive?.items || []);
  }

  const templateFeedback = byId('template-feedback');
  if (templateFeedback) {
    const text = state.templateFeedback?.message || '';
    templateFeedback.textContent = text;
    templateFeedback.style.visibility = text ? 'visible' : 'hidden';
  }

  const templateArchiveStatus = byId('template-archive-status');
  if (templateArchiveStatus) {
    templateArchiveStatus.textContent = state.templateArchiveStatus || 'Vorlagen-Archiv bereit.';
  }

  const archiveEvents = byId('archive-events');
  if (archiveEvents) {
    archiveEvents.innerHTML = (state.profileArchive?.events || []).slice(0, 6).map((item) => `<li><span>${escapeHtml(item.timestamp.slice(11, 19))}</span> ${autoFormatHtml(item.message)}</li>`).join('');
  }

  const archiveOverviewEvents = byId('archive-overview-events');
  if (archiveOverviewEvents) {
    archiveOverviewEvents.innerHTML = (state.profileArchive?.events || []).slice(0, 4)
      .map((item) => `<li><span class="log-time">${escapeHtml(item.timestamp.slice(11, 19))}</span>${autoFormatHtml(item.message)}</li>`)
      .join('') || '<li>Keine Archiv-Meldungen.</li>';
  }

  const logList = byId('log-list');
  if (logList) {
    logList.innerHTML = (state.logs || [])
      .slice(0, 10)
      .map((item) => `<li><span class="log-time">${escapeHtml(item.timestamp.slice(11, 19))}</span><strong>${autoFormatHtml(item.type)}</strong> ${autoFormatHtml(item.message)}</li>`)
      .join('');
  }

  const filePreviewPath = byId('file-preview-path');
  if (filePreviewPath) filePreviewPath.value = state.filePreviewPath || '';

  const includeOther = byId('file-preview-include-other');
  if (includeOther) includeOther.checked = Boolean(state.filePreviewIncludeOtherFiles);

  setText('file-preview-status', state.filePreviewStatus || '-');

  const filePreviewList = byId('file-preview-list');
  if (filePreviewList) filePreviewList.innerHTML = renderFilePreviewList(state.filePreviewEntries || []);

  const filePreviewContent = byId('file-preview-content');
  if (filePreviewContent) filePreviewContent.value = state.filePreviewContent || '';

  const editorContent = byId('editor-content');
  if (editorContent && document.activeElement !== editorContent) {
    editorContent.value = state.editorContent || '';
  }

  const dirtyBadge = state.editorDirty ? ' *ungespeichert' : '';
  setText('editor-file-path', state.editorFilePath ? `${state.editorFilePath}${dirtyBadge}` : '-');
  setText('editor-status', state.editorStatus || '-');
};
