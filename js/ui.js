import { getState } from './state.js';

const byId = (id) => document.getElementById(id);

const setText = (id, text) => {
  const node = byId(id);
  if (node) node.textContent = text;
};

const statusClass = (status) => (status === 'green' ? 'check-ok' : status === 'yellow' ? 'check-warn' : 'check-error');

export const applyTheme = (themeTokens = {}) => {
  const map = {
    bg: '--bg',
    bgPanel: '--bg-panel',
    bgPanelSoft: '--bg-panel-soft',
    header: '--header',
    textMain: '--text-main',
    textMuted: '--text-muted',
    shadow: '--shadow',
    radius: '--radius',
    gridLine: '--grid-line',
    focus: '--focus'
  };
  Object.entries(map).forEach(([token, cssVar]) => {
    if (themeTokens[token]) document.documentElement.style.setProperty(cssVar, themeTokens[token]);
  });
};

export const detectLayoutMode = (config) => {
  const width = window.innerWidth;
  if (width >= (config.minimumSizes?.wide?.minWidth || 1400)) return 'wide';
  if (width >= (config.minimumSizes?.standard?.minWidth || 1100)) return 'standard';
  if (width >= (config.minimumSizes?.kompakt?.minWidth || 900)) return 'kompakt';
  return 'eng';
};

export const bindUiActions = (actions) => {
  byId('action-select-dir')?.addEventListener('click', actions.onSelectDirectory);
  byId('action-run-selftest')?.addEventListener('click', () => actions.onRunSelftest(false));
  byId('action-ensure-structure')?.addEventListener('click', actions.onEnsureStructure);
  byId('action-run-write-test')?.addEventListener('click', () => actions.onRunSelftest(true));
  byId('action-switch-dir')?.addEventListener('click', actions.onSwitchDirectory);
};

export const render = () => {
  const state = getState();
  const texts = state.uiTexts || {};
  const messages = texts.messages || {};

  setText('app-title', texts.titles?.appTitle || 'ProvoWare Dashboard');
  setText('app-subtitle', texts.titles?.appSubtitle || 'Projektstart');
  setText('nav-title', texts.titles?.navigation || 'Navigation');
  setText('startup-title', texts.titles?.startup || 'Startstatus');
  setText('status-title', texts.titles?.status || 'Projektordner-Status');
  setText('log-title', texts.titles?.logs || 'Letzte Meldungen');

  setText('action-select-dir', texts.buttons?.selectDirectory || 'Ordner wählen');
  setText('action-run-selftest', texts.buttons?.runSelftest || 'Selbsttest starten');
  setText('action-ensure-structure', texts.buttons?.ensureStructure || 'Projektstruktur anlegen');
  setText('action-run-write-test', texts.buttons?.runWriteTest || 'Schreibtest ausführen');
  setText('action-switch-dir', texts.buttons?.switchDirectory || 'Ordner wechseln');

  const nextStep = byId('next-step');
  if (nextStep) {
    const startupReady = state.debug?.startupReady;
    nextStep.innerHTML = `<strong>${messages.actionNext || 'Nächster Schritt'}:</strong> ${startupReady ? messages.startupReady || '' : messages.startupWaiting || messages.startupBlocked || ''}`;
  }

  setText('status-folder', state.selectedProjectDirectory?.name || '-');
  setText('status-read', state.permissionStatus?.read ? 'ok' : 'nein');
  setText('status-write', state.permissionStatus?.write ? 'ok' : 'nein');
  setText('status-structure', state.selftestResult?.data?.missingFiles?.length ? 'fehlt teilweise' : 'ok/unklar');
  setText('status-last-test', state.selftestResult?.summary || '-');
  setText('status-overall', state.selftestResult?.overallStatus || 'rot');
  setText('status-layout', state.layoutMode || '-');

  const checksList = byId('checks-list');
  if (checksList) {
    const checks = state.selftestResult?.checks || [];
    checksList.innerHTML = checks.map((check) => `<article class="check-item ${statusClass(check.status)}"><strong>${check.name}</strong><br><span>${check.message}</span></article>`).join('');
  }

  const logList = byId('log-list');
  if (logList) {
    logList.innerHTML = (state.logs || []).slice(0, 10).map((item) => `<li><span class="log-time">${item.timestamp.slice(11, 19)}</span><strong>${item.type}</strong> ${item.message}</li>`).join('');
  }

  document.getElementById('app')?.setAttribute('data-layout-mode', state.layoutMode || 'standard');
};
