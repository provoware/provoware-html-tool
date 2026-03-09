const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NO_DATA_TREND = {
  label: '0 (keine Historie)',
  hint: 'Vergleich nicht verfügbar (keine verwertbaren Daten)'
};
const NO_VALID_TIMESTAMPS_TREND = {
  label: '0 (keine gültigen Zeitstempel)',
  hint: 'Vergleich nicht verfügbar (keine verwertbaren Daten)'
};

const getArchiveEvents = (state) => (Array.isArray(state?.profileArchive?.events) ? state.profileArchive.events : []);

const evaluateArchiveTrend = (events) => {
  if (!Array.isArray(events) || events.length === 0) {
    return NO_DATA_TREND;
  }

  const nowMs = Date.now();
  if (!Number.isFinite(nowMs)) {
    return NO_DATA_TREND;
  }

  const currentWindowStart = nowMs - (7 * MS_PER_DAY);
  const previousWindowStart = nowMs - (14 * MS_PER_DAY);
  let currentCount = 0;
  let previousCount = 0;
  let validEventsCount = 0;

  events.forEach((event) => {
    const parsedTime = Date.parse(String(event?.timestamp || ''));
    if (!Number.isFinite(parsedTime)) return;
    validEventsCount += 1;
    if (parsedTime > nowMs || parsedTime < previousWindowStart) return;
    if (parsedTime >= currentWindowStart) {
      currentCount += 1;
      return;
    }
    previousCount += 1;
  });

  if (validEventsCount === 0) {
    return NO_VALID_TIMESTAMPS_TREND;
  }

  const delta = currentCount - previousCount;
  const label = delta > 0
    ? `${currentCount} (+${delta})`
    : (delta < 0 ? `${currentCount} (${delta})` : `${currentCount} (±0)`);

  return {
    label,
    hint: 'Vergleich zur Vorwoche'
  };
};

export const renderHeaderSection = ({ state, texts, messages, setText, byId, autoFormatText, buildHeaderProjectStatus, buildHeaderAutosaveStatus, layoutBudgetStatus }) => {
  const safeState = state || {};
  const safeById = typeof byId === 'function' ? byId : () => null;
  const safeAutoFormatText = typeof autoFormatText === 'function' ? autoFormatText : (value) => String(value || '');
  const safeSetText = typeof setText === 'function' ? setText : () => {};
  const archiveEvents = getArchiveEvents(safeState);

  safeSetText('app-title', texts.titles?.appTitle || 'ProvoWare Dashboard');
  safeSetText('app-subtitle', texts.titles?.appSubtitle || 'Projektstart');
  safeSetText('header-chip-project-status', buildHeaderProjectStatus(safeState));
  safeSetText('header-chip-autosave-status', buildHeaderAutosaveStatus(safeState));

  const modulesCount = Array.isArray(safeState.moduleRegistry?.modules) ? safeState.moduleRegistry.modules.length : 0;
  const templateCount = Array.isArray(safeState.templateArchive?.items) ? safeState.templateArchive.items.length : 0;
  const archiveEventsCount = archiveEvents.length;
  const archiveTrend = evaluateArchiveTrend(archiveEvents);
  const selftestStatus = safeState.selftestResult?.overallStatus;
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
  safeSetText('header-stat-modules', String(modulesCount));
  safeSetText('header-stat-templates', String(templateCount));
  safeSetText('header-stat-events', String(archiveEventsCount));
  safeSetText('header-stat-events-trend', archiveTrend.label);
  safeSetText('header-stat-events-trend-hint', archiveTrend.hint);
  safeSetText('header-stat-health', selftestLabel);
  const healthNode = safeById('header-stat-health');
  if (healthNode) {
    healthNode.className = `header-health-status ${selftestBadgeClass}`;
  }
  safeSetText('header-stat-health-legend', selftestLegend);
  safeSetText('layout-budget-label', layoutBudgetStatus?.label || 'Layoutbudget aktiv: H15/F10/S8');
  safeSetText('layout-budget-warning', layoutBudgetStatus?.warning || 'Budgetprüfung ausstehend.');

  const nextStep = safeById('next-step');
  if (!nextStep) return;
  const startupReady = safeState.debug?.startupReady;
  const hasSelectedFolder = Boolean(safeState.selectedProjectDirectory?.name);
  const fallbackWaiting = messages.startupWaiting || messages.startupBlocked || 'Bitte zuerst Ordner wählen';
  const nextMessage = startupReady
    ? (messages.startupReadyNext || 'Modul wählen')
    : (hasSelectedFolder ? fallbackWaiting : (messages.startupMissingFolderNext || 'Ordner wählen'));
  const label = messages.actionNext || 'Nächster Schritt';
  nextStep.textContent = `${label}: ${safeAutoFormatText(nextMessage || 'Ordner wählen')}`;
};
