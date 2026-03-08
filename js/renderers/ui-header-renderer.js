export const renderHeaderSection = ({ state, texts, messages, setText, byId, autoFormatText, buildHeaderProjectStatus, buildHeaderAutosaveStatus, layoutBudgetStatus }) => {
  setText('app-title', texts.titles?.appTitle || 'ProvoWare Dashboard');
  setText('app-subtitle', texts.titles?.appSubtitle || 'Projektstart');
  setText('header-chip-project-status', buildHeaderProjectStatus(state));
  setText('header-chip-autosave-status', buildHeaderAutosaveStatus(state));

  const modulesCount = Array.isArray(state.moduleRegistry?.modules) ? state.moduleRegistry.modules.length : 0;
  const templateCount = Array.isArray(state.templateArchive?.items) ? state.templateArchive.items.length : 0;
  const archiveEventsCount = Array.isArray(state.profileArchive?.events) ? state.profileArchive.events.length : 0;
  const selftestStatus = state.selftestResult?.overallStatus;
  const selftestLabel = selftestStatus === 'green'
    ? 'stabil'
    : (selftestStatus === 'yellow' ? 'prüfen' : (selftestStatus === 'red' ? 'kritisch' : 'offen'));
  const selftestBadgeClass = selftestStatus === 'green'
    ? 'is-stable'
    : (selftestStatus === 'yellow' ? 'is-review' : (selftestStatus === 'red' ? 'is-critical' : 'is-open'));
  const selftestLegend = selftestStatus === 'green'
    ? 'Ampel: 🟢 stabil – alle Kernchecks bestanden.'
    : (selftestStatus === 'yellow'
      ? 'Ampel: 🟡 prüfen – mindestens ein Check braucht Nacharbeit.'
      : (selftestStatus === 'red'
        ? 'Ampel: 🔴 kritisch – bitte zuerst Selbsttest-Fehler beheben.'
        : 'Ampel: ⚪ offen – bitte Selbsttest starten.'));
  setText('header-stat-modules', String(modulesCount));
  setText('header-stat-templates', String(templateCount));
  setText('header-stat-events', String(archiveEventsCount));
  setText('header-stat-health', selftestLabel);
  const healthNode = byId('header-stat-health');
  if (healthNode) {
    healthNode.className = `header-health-status ${selftestBadgeClass}`;
  }
  setText('header-stat-health-legend', selftestLegend);
  setText('layout-budget-label', layoutBudgetStatus?.label || 'Layoutbudget aktiv: H15/F10/S8');
  setText('layout-budget-warning', layoutBudgetStatus?.warning || 'Budgetprüfung ausstehend.');

  const nextStep = byId('next-step');
  if (!nextStep) return;
  const startupReady = state.debug?.startupReady;
  const hasSelectedFolder = Boolean(state.selectedProjectDirectory?.name);
  const fallbackWaiting = messages.startupWaiting || messages.startupBlocked || 'Bitte zuerst Ordner wählen';
  const nextMessage = startupReady
    ? (messages.startupReadyNext || 'Modul wählen')
    : (hasSelectedFolder ? fallbackWaiting : (messages.startupMissingFolderNext || 'Ordner wählen'));
  const label = messages.actionNext || 'Nächster Schritt';
  nextStep.textContent = `${label}: ${autoFormatText(nextMessage || 'Ordner wählen')}`;
};
