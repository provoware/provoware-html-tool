const MS_PER_DAY = 24 * 60 * 60 * 1000;

const buildArchiveTrendLabel = (events) => {
  if (!Array.isArray(events) || events.length === 0) return '0 (keine Historie)';
  const nowMs = Date.now();
  if (!Number.isFinite(nowMs)) return '0 (keine Historie)';

  const currentWindowStart = nowMs - (7 * MS_PER_DAY);
  const previousWindowStart = nowMs - (14 * MS_PER_DAY);
  let currentCount = 0;
  let previousCount = 0;

  events.forEach((event) => {
    const parsedTime = Date.parse(String(event?.timestamp || ''));
    if (!Number.isFinite(parsedTime)) return;
    if (parsedTime > nowMs || parsedTime < previousWindowStart) return;
    if (parsedTime >= currentWindowStart) {
      currentCount += 1;
      return;
    }
    previousCount += 1;
  });

  const delta = currentCount - previousCount;
  if (delta > 0) return `${currentCount} (+${delta})`;
  if (delta < 0) return `${currentCount} (${delta})`;
  return `${currentCount} (±0)`;
};

const buildArchiveTrendHint = (events) => {
  if (!Array.isArray(events) || events.length === 0) return 'Vergleich nicht verfügbar';
  return 'Vergleich zur Vorwoche';
};

export const renderHeaderSection = ({ state, texts, messages, setText, byId, autoFormatText, buildHeaderProjectStatus, buildHeaderAutosaveStatus, layoutBudgetStatus }) => {
  setText('app-title', texts.titles?.appTitle || 'ProvoWare Dashboard');
  setText('app-subtitle', texts.titles?.appSubtitle || 'Projektstart');
  setText('header-chip-project-status', buildHeaderProjectStatus(state));
  setText('header-chip-autosave-status', buildHeaderAutosaveStatus(state));

  const modulesCount = Array.isArray(state.moduleRegistry?.modules) ? state.moduleRegistry.modules.length : 0;
  const templateCount = Array.isArray(state.templateArchive?.items) ? state.templateArchive.items.length : 0;
  const archiveEventsCount = Array.isArray(state.profileArchive?.events) ? state.profileArchive.events.length : 0;
  const archiveEventsTrend = buildArchiveTrendLabel(state.profileArchive?.events);
  const archiveEventsTrendHint = buildArchiveTrendHint(state.profileArchive?.events);
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
  setText('header-stat-events-trend', archiveEventsTrend);
  setText('header-stat-events-trend-hint', archiveEventsTrendHint);
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
