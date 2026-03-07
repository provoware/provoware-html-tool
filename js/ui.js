import { categories } from './services/profile-archive.js';
import { getState } from './state.js';
import { formatStatusWithSymbol, statusVisual } from './status-visuals.js';

const byId = (id) => document.getElementById(id);

const normalizeWhitespace = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const ensureTerminalPunctuation = (value) => {
  if (!value) return '';
  if (/[.!?…]$/.test(value)) return value;
  return `${value}.`;
};

const autoFormatText = (value) => {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return '';
  const withSpaces = normalized.replace(/[_-]+/g, ' ');
  const capitalized = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  return ensureTerminalPunctuation(capitalized);
};

const formatStatusWord = (value) => {
  const normalized = normalizeWhitespace(value);
  return normalized ? normalized.toLowerCase() : '-';
};

const setText = (id, text) => {
  const node = byId(id);
  if (node) node.textContent = text;
};

const statusClass = (status) => (status === 'green' ? 'check-ok' : status === 'yellow' ? 'check-warn' : 'check-error');

const formatOverallStatus = (status) => {
  return formatStatusWithSymbol(status);
};

const formatPermissionStatus = (allowed) => {
  if (typeof allowed !== 'boolean') return '-';
  return formatStatusWithSymbol(allowed ? 'green' : 'red', formatStatusWord(allowed ? 'ok' : 'nein'));
};

const formatWritePermissionStatus = (permissionStatus) => {
  const canRead = permissionStatus?.read;
  const canWrite = permissionStatus?.write;
  if (canRead === true && canWrite === false) {
    return formatStatusWithSymbol('yellow', formatStatusWord('nur lesen'));
  }
  return formatPermissionStatus(canWrite);
};

const formatStructureStatus = (selftestResult) => {
  if (!selftestResult) return '-';
  const hasMissingFiles = Boolean(selftestResult.data?.missingFiles?.length);
  return hasMissingFiles
    ? formatStatusWithSymbol('yellow', formatStatusWord('fehlt teilweise'))
    : formatStatusWithSymbol('green', formatStatusWord('ok'));
};

const renderProfileOptions = (archive, selected) => {
  const options = Object.keys(archive?.profiles || {});
  return options.map((name) => `<option value="${name}" ${name === selected ? 'selected' : ''}>${name}</option>`).join('');
};

const renderCategoryList = (archive, profile, category) => {
  const list = archive?.profiles?.[profile]?.[category] || [];
  return list.map((item) => `<li><span>${item.value}</span><div><button class="btn-small" data-edit="${category}" data-value="${item.value}">Bearbeiten</button><button class="btn-small" data-delete="${category}" data-value="${item.value}">Löschen</button></div></li>`).join('');
};

const renderStats = (stats) => {
  if (!stats) return '-';
  return `Genres: ${stats.genres} | Stimmungen: ${stats.moods} | Stile: ${stats.styles} | Gesamt: ${stats.total}`;
};

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

const bindWorkspaceControls = () => {
  const app = byId('app');
  if (!app || app.dataset.workspaceControlsBound === 'yes') return;
  app.dataset.workspaceControlsBound = 'yes';

  const setSidebarState = (id, cssClass) => {
    const button = byId(id);
    if (!button) return;
    button.addEventListener('click', () => {
      app.classList.toggle(cssClass);
      const isCollapsed = app.classList.contains(cssClass);
      button.setAttribute('aria-pressed', isCollapsed ? 'true' : 'false');
    });
  };

  setSidebarState('toggle-left-sidebar', 'sidebar-left-collapsed');
  setSidebarState('toggle-right-sidebar', 'sidebar-right-collapsed');

  document.querySelectorAll('[data-panel-maximize]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.module-panel');
      if (!panel) return;
      const willMaximize = !panel.classList.contains('is-maximized');
      document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
      if (willMaximize) panel.classList.add('is-maximized');
      app.classList.toggle('has-maximized-panel', willMaximize);
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
    app.classList.remove('has-maximized-panel');
  });
};

export const bindUiActions = (actions) => {
  byId('action-select-dir')?.addEventListener('click', actions.onSelectDirectory);
  byId('action-run-selftest')?.addEventListener('click', () => actions.onRunSelftest(false));
  byId('action-ensure-structure')?.addEventListener('click', actions.onEnsureStructure);
  byId('action-run-write-test')?.addEventListener('click', () => actions.onRunSelftest(true));
  byId('action-switch-dir')?.addEventListener('click', actions.onSwitchDirectory);
  byId('action-export-diagnosis')?.addEventListener('click', async () => {
    const text = await actions.onExportDiagnosis();
    const area = byId('diagnosis-transfer');
    if (area) area.value = text;
  });

  byId('profile-select')?.addEventListener('change', (event) => actions.onSelectProfile(event.target.value));
  byId('archive-sort')?.addEventListener('change', (event) => actions.onSortArchive(event.target.value));

  categories.forEach((category) => {
    byId(`save-${category}`)?.addEventListener('click', () => {
      const input = byId(`input-${category}`);
      actions.onSaveCategoryEntry({ category, value: input?.value || '' });
      if (input) input.value = '';
    });
    byId(`input-${category}`)?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const input = event.currentTarget;
      actions.onSaveCategoryEntry({ category, value: input.value || '' });
      input.value = '';
    });
  });

  byId('archive-list')?.addEventListener('click', async (event) => {
    const editCategory = event.target.getAttribute('data-edit');
    const deleteCategory = event.target.getAttribute('data-delete');
    const value = event.target.getAttribute('data-value');
    if (editCategory && value) {
      const next = window.prompt('Neuer Text', value);
      if (next !== null) {
        await actions.onEditCategoryEntry({ category: editCategory, oldValue: value, newValue: next });
      }
    }
    if (deleteCategory && value) {
      await actions.onDeleteCategoryEntry({ category: deleteCategory, value });
    }
  });

  byId('archive-export')?.addEventListener('click', async () => {
    const text = await actions.onExportArchive();
    const area = byId('archive-transfer');
    if (area) area.value = text;
  });

  byId('archive-import')?.addEventListener('click', async () => {
    const area = byId('archive-transfer');
    await actions.onImportArchive(area?.value || '');
  });

  byId('mix-generate')?.addEventListener('click', async () => {
    const includeCategories = categories.filter((category) => byId(`mix-include-${category}`)?.checked);
    const amountPerCategory = Object.fromEntries(categories.map((category) => [category, Number(byId(`mix-amount-${category}`)?.value || 1)]));
    await actions.onGenerateMix({ includeCategories, amountPerCategory });
  });

  document.querySelectorAll('[data-mix-quick]').forEach((button) => {
    button.addEventListener('click', async () => {
      const amount = Number(button.getAttribute('data-mix-quick'));
      categories.forEach((category) => {
        const input = byId(`mix-amount-${category}`);
        if (input) input.value = String(amount);
      });
      const includeCategories = categories.filter((category) => byId(`mix-include-${category}`)?.checked);
      const amountPerCategory = Object.fromEntries(categories.map((category) => [category, amount]));
      await actions.onGenerateMix({ includeCategories, amountPerCategory });
    });
  });

  bindWorkspaceControls();
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
  setText('action-export-diagnosis', 'Diagnose exportieren');

  const nextStep = byId('next-step');
  if (nextStep) {
    const startupReady = state.debug?.startupReady;
    const nextMessage = startupReady ? messages.startupReady || '' : messages.startupWaiting || messages.startupBlocked || '';
    nextStep.innerHTML = `<strong>${messages.actionNext || 'Nächster Schritt'}:</strong> ${autoFormatText(nextMessage)}`;
  }

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

  const checksList = byId('checks-list');
  if (checksList) {
    const checks = state.selftestResult?.checks || [];
    checksList.innerHTML = checks.map((check) => {
      const visual = statusVisual(check.status);
      return `<article class="check-item ${statusClass(check.status)}"><strong>${visual.symbol} ${autoFormatText(check.name)}</strong><br><span>${autoFormatText(check.message)}</span></article>`;
    }).join('');
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

  setText('mix-output', state.randomMix?.text || '-');

  setText('module-registry-summary', state.moduleRegistry?.summary || '-');
  setText('template-design-status', autoFormatText(state.templateDesignStatus?.message || '-'));

  const archiveEvents = byId('archive-events');
  if (archiveEvents) {
    archiveEvents.innerHTML = (state.profileArchive?.events || []).slice(0, 6).map((item) => `<li><span>${item.timestamp.slice(11, 19)}</span> ${autoFormatText(item.message)}</li>`).join('');
  }

  const logList = byId('log-list');
  if (logList) {
    logList.innerHTML = (state.logs || [])
      .slice(0, 10)
      .map((item) => `<li><span class="log-time">${item.timestamp.slice(11, 19)}</span><strong>${autoFormatText(item.type)}</strong> ${autoFormatText(item.message)}</li>`)
      .join('');
  }

  document.getElementById('app')?.setAttribute('data-layout-mode', state.layoutMode || 'standard');
};
